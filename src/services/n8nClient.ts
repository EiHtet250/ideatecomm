/**
 * n8nClient: the ONLY place the app talks to n8n.
 *
 * Endpoints (see n8n/README.md):
 *   POST {base}/chat          sendChatMessage
 *   POST {base}/help          createHelpRequest
 *   GET  {base}/help          listHelpRequests
 *   POST {base}/help/status   updateHelpRequestStatus
 *   POST {base}/feedback      submitFeedback
 *   GET  {base}/feedback      listFeedback (staff)
 *
 * Every response uses the envelope
 *   { ok: true, data } | { ok: false, error: { code, message } }
 * and every failure is turned into an N8nServiceError with a visitor-friendly message.
 *
 * SECURITY NOTE: VITE_ variables are embedded in the built JavaScript bundle and can be read
 * by anyone who opens the site. VITE_N8N_API_KEY is therefore only a prototype deterrent,
 * not real security. Staff routes still need real authentication before launch.
 * Never log the key.
 */
import type { HelpRequest, HelpRequestStatus } from '../types';
import type {
  ChatLanguage,
  ChatReply,
  FeedbackEntry,
  FeedbackReceipt,
  HelpStatusFilter,
  NewFeedback,
  NewHelpRequest,
  ServiceErrorCode,
} from '../types/help';

const CHAT_TIMEOUT_MS = 20_000;
const DEFAULT_TIMEOUT_MS = 10_000;
const MAX_SERVER_MESSAGE_LENGTH = 300;

/**
 * Default English messages for each error code. Pages may show their own translated
 * strings instead by switching on `error.code`.
 */
export const SERVICE_ERROR_MESSAGES: Record<ServiceErrorCode, string> = {
  VALIDATION: 'Please check what you typed and try again.',
  AUTH: 'This guide cannot connect to the museum service right now. Please ask a staff member for help.',
  SERVER: 'Something went wrong on our side. Please try again in a moment.',
  NETWORK: 'We cannot reach the museum service. Please check your internet connection and try again.',
  TIMEOUT: 'This is taking too long. Please try again.',
  CONFIG: 'This feature is not set up yet. Please ask a staff member for help.',
  ABORTED: 'The request was cancelled.',
};

/** Typed error thrown by every function in this file. `message` is safe to show to visitors. */
export class N8nServiceError extends Error {
  readonly code: ServiceErrorCode;
  /** HTTP status, when a response was received. */
  readonly status?: number;

  constructor(code: ServiceErrorCode, message?: string, status?: number) {
    super(message || SERVICE_ERROR_MESSAGES[code]);
    this.name = 'N8nServiceError';
    this.code = code;
    this.status = status;
  }
}

export function isN8nServiceError(error: unknown): error is N8nServiceError {
  return error instanceof N8nServiceError;
}

// ---------- configuration ----------

interface N8nConfig {
  baseUrl: string;
  apiKey: string;
}

let configWarningShown = false;

function getConfig(): N8nConfig {
  const baseUrl = (import.meta.env.VITE_N8N_BASE_URL as string | undefined)?.trim().replace(/\/+$/, '') ?? '';
  const apiKey = (import.meta.env.VITE_N8N_API_KEY as string | undefined)?.trim() ?? '';
  const missing = [!baseUrl && 'VITE_N8N_BASE_URL', !apiKey && 'VITE_N8N_API_KEY'].filter(Boolean);

  if (missing.length > 0) {
    if (!configWarningShown) {
      configWarningShown = true;
      console.error(
        `[n8nClient] Missing ${missing.join(' and ')}. Copy .env.example to .env.local, fill in the values, ` +
          'then restart "npm run dev". See n8n/README.md.',
      );
    }
    throw new N8nServiceError('CONFIG');
  }
  return { baseUrl, apiKey };
}

/** True when both environment variables are set. Lets pages show a notice before any request. */
export function isN8nConfigured(): boolean {
  try {
    getConfig();
    return true;
  } catch {
    return false;
  }
}

// ---------- low-level request ----------

interface RequestOptions {
  method: 'GET' | 'POST';
  path: string;
  body?: unknown;
  query?: Record<string, string | undefined>;
  timeoutMs: number;
  /** Optional caller signal, e.g. to cancel when a component unmounts. */
  signal?: AbortSignal;
}

const SERVER_CODES: ServiceErrorCode[] = ['VALIDATION', 'AUTH', 'SERVER'];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/** Uses the server's plain-language message only when it looks like one. */
function safeServerMessage(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  const text = value.trim();
  if (!text || text.length > MAX_SERVER_MESSAGE_LENGTH) return undefined;
  return text;
}

async function request<T>({ method, path, body, query, timeoutMs, signal }: RequestOptions): Promise<T> {
  const { baseUrl, apiKey } = getConfig();

  // The base may be a full address, or a path on this site (the dev relay in vite.config.ts).
  const url = new URL(`${baseUrl}${path}`, window.location.origin);
  for (const [key, value] of Object.entries(query ?? {})) {
    if (value) url.searchParams.set(key, value);
  }

  const controller = new AbortController();
  let timedOut = false;
  const timer = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const onCallerAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', onCallerAbort, { once: true });
  }

  let response: Response;
  let text: string;
  try {
    const headers: Record<string, string> = { Accept: 'application/json', 'x-mint-key': apiKey };
    if (body !== undefined) headers['Content-Type'] = 'application/json';

    response = await fetch(url.toString(), {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
      cache: 'no-store',
      credentials: 'omit',
    });
    text = await response.text();
  } catch {
    if (timedOut) throw new N8nServiceError('TIMEOUT');
    if (signal?.aborted) throw new N8nServiceError('ABORTED');
    // fetch rejects on network failure, DNS errors and CORS blocks.
    throw new N8nServiceError('NETWORK');
  } finally {
    window.clearTimeout(timer);
    signal?.removeEventListener('abort', onCallerAbort);
  }

  // n8n's Header Auth rejects bad keys itself with plain text (403), before our envelope.
  if (response.status === 401 || response.status === 403) {
    throw new N8nServiceError('AUTH', undefined, response.status);
  }

  let json: unknown;
  try {
    json = text ? JSON.parse(text) : undefined;
  } catch {
    json = undefined;
  }

  if (!isRecord(json) || typeof json.ok !== 'boolean') {
    // Not our envelope: an n8n default error page, a proxy error, or an inactive workflow (404).
    throw new N8nServiceError('SERVER', undefined, response.status);
  }

  if (json.ok === false) {
    const error = isRecord(json.error) ? json.error : {};
    const code = SERVER_CODES.includes(error.code as ServiceErrorCode)
      ? (error.code as ServiceErrorCode)
      : 'SERVER';
    // Only VALIDATION messages are specific enough to show as-is; others use our own wording.
    const message = code === 'VALIDATION' ? safeServerMessage(error.message) : undefined;
    throw new N8nServiceError(code, message, response.status);
  }

  if (!response.ok) {
    throw new N8nServiceError('SERVER', undefined, response.status);
  }

  return json.data as T;
}

// ---------- mapping helpers ----------

// n8n stores "in_progress"; the app uses "in-progress" (matches the .status--in-progress CSS class).
const STATUS_FROM_API: Record<string, HelpRequestStatus> = {
  new: 'new',
  in_progress: 'in-progress',
  resolved: 'resolved',
};
const STATUS_TO_API: Record<HelpRequestStatus, string> = {
  new: 'new',
  'in-progress': 'in_progress',
  resolved: 'resolved',
};

function toHelpRequest(value: unknown): HelpRequest | null {
  if (!isRecord(value)) return null;
  const id = value.id;
  const status = STATUS_FROM_API[String(value.status)];
  if ((typeof id !== 'number' && typeof id !== 'string') || !status) return null;
  if (typeof value.createdAt !== 'string') return null;

  return {
    id: String(id),
    area: typeof value.area === 'string' ? value.area : '',
    areaSource: value.areaSource === 'lastScanned' ? 'lastScanned' : 'manual',
    description: typeof value.description === 'string' ? value.description : '',
    status,
    createdAt: value.createdAt,
    updatedAt: typeof value.updatedAt === 'string' ? value.updatedAt : undefined,
  };
}

function requireHelpRequest(value: unknown): HelpRequest {
  const row = toHelpRequest(value);
  if (!row) throw new N8nServiceError('SERVER');
  return row;
}

// ---------- public API ----------

export async function sendChatMessage(
  input: { sessionId: string; message: string; language?: ChatLanguage },
  signal?: AbortSignal,
): Promise<ChatReply> {
  const data = await request<unknown>({
    method: 'POST',
    path: '/chat',
    body: { sessionId: input.sessionId, message: input.message, language: input.language ?? 'en' },
    timeoutMs: CHAT_TIMEOUT_MS,
    signal,
  });

  if (!isRecord(data) || typeof data.reply !== 'string' || !data.reply.trim()) {
    throw new N8nServiceError('SERVER');
  }
  return { reply: data.reply, suggestStaff: data.suggestStaff === true };
}

export async function createHelpRequest(input: NewHelpRequest, signal?: AbortSignal): Promise<HelpRequest> {
  const data = await request<unknown>({
    method: 'POST',
    path: '/help',
    body: { area: input.area, areaSource: input.areaSource, description: input.description },
    timeoutMs: DEFAULT_TIMEOUT_MS,
    signal,
  });
  return requireHelpRequest(data);
}

/** Newest first, at most 100 (enforced by n8n). */
export async function listHelpRequests(
  options: { status?: HelpStatusFilter; signal?: AbortSignal } = {},
): Promise<HelpRequest[]> {
  const status = options.status && options.status !== 'all' ? STATUS_TO_API[options.status] : undefined;
  const data = await request<unknown>({
    method: 'GET',
    path: '/help',
    query: { status },
    timeoutMs: DEFAULT_TIMEOUT_MS,
    signal: options.signal,
  });

  if (!isRecord(data) || !Array.isArray(data.items)) throw new N8nServiceError('SERVER');
  return data.items.map(toHelpRequest).filter((row): row is HelpRequest => row !== null);
}

export async function updateHelpRequestStatus(
  id: string,
  status: HelpRequestStatus,
  signal?: AbortSignal,
): Promise<HelpRequest> {
  const numericId = Number(id);
  if (!Number.isInteger(numericId) || numericId <= 0) {
    throw new N8nServiceError('VALIDATION', 'The request number is not valid.');
  }
  const data = await request<unknown>({
    method: 'POST',
    path: '/help/status',
    body: { id: numericId, status: STATUS_TO_API[status] },
    timeoutMs: DEFAULT_TIMEOUT_MS,
    signal,
  });
  return requireHelpRequest(data);
}

export async function submitFeedback(input: NewFeedback, signal?: AbortSignal): Promise<FeedbackReceipt> {
  const data = await request<unknown>({
    method: 'POST',
    path: '/feedback',
    body: { rating: input.rating, comment: input.comment ?? '' },
    timeoutMs: DEFAULT_TIMEOUT_MS,
    signal,
  });
  if (!isRecord(data) || (typeof data.id !== 'number' && typeof data.id !== 'string') || typeof data.rating !== 'number') {
    throw new N8nServiceError('SERVER');
  }
  return {
    id: String(data.id),
    rating: data.rating,
    comment: typeof data.comment === 'string' ? data.comment : '',
    createdAt: typeof data.createdAt === 'string' ? data.createdAt : '',
  };
}

function toFeedbackEntry(value: unknown): FeedbackEntry | null {
  if (!isRecord(value)) return null;
  const { id, rating, createdAt } = value;
  if ((typeof id !== 'number' && typeof id !== 'string') || typeof createdAt !== 'string') return null;
  if (typeof rating !== 'number' || !Number.isInteger(rating) || rating < 1 || rating > 5) return null;
  return { id: String(id), rating, comment: typeof value.comment === 'string' ? value.comment : '', createdAt };
}

/** Staff: newest first, at most 100 (enforced by n8n). */
export async function listFeedback(signal?: AbortSignal): Promise<FeedbackEntry[]> {
  const data = await request<unknown>({ method: 'GET', path: '/feedback', timeoutMs: DEFAULT_TIMEOUT_MS, signal });
  if (!isRecord(data) || !Array.isArray(data.items)) throw new N8nServiceError('SERVER');
  return data.items
    .map(toFeedbackEntry)
    .filter((entry): entry is FeedbackEntry => entry !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
