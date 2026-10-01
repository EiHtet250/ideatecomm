import { useCallback, useEffect, useRef, useState } from 'react';
import { isN8nServiceError, sendChatMessage } from '../../services/n8nClient';
import type { ChatLanguage, ServiceErrorCode } from '../../types/help';

export type ChatMessage =
  | { id: string; role: 'visitor'; text: string }
  | { id: string; role: 'bot'; text: string; suggestStaff: boolean };

export interface ChatFailure {
  /** The visitor message to send again on Retry. */
  text: string;
  code: ServiceErrorCode;
  /** Server message, only for VALIDATION errors. */
  message?: string;
}

const SESSION_KEY = 'mint.chat.sessionId';
const MESSAGES_KEY = 'mint.chat.messages.v1';
const MAX_STORED_MESSAGES = 60;

function randomId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  // Fallback for non-secure contexts (e.g. testing on a phone over plain http).
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

function readStorage(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null; // storage can be blocked (private mode, strict settings)
  }
}

function writeStorage(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* ignore: chat still works without saving */
  }
}

function getSessionId(): string {
  const existing = readStorage(SESSION_KEY);
  if (existing && /^[A-Za-z0-9_-]{1,64}$/.test(existing)) return existing;
  const id = randomId();
  writeStorage(SESSION_KEY, id);
  return id;
}

function loadMessages(): ChatMessage[] {
  const raw = readStorage(MESSAGES_KEY);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m): m is ChatMessage =>
        typeof m === 'object' &&
        m !== null &&
        typeof m.id === 'string' &&
        typeof m.text === 'string' &&
        (m.role === 'visitor' || (m.role === 'bot' && typeof m.suggestStaff === 'boolean')),
    );
  } catch {
    return [];
  }
}

/** Chat state for one browser-tab session. The sessionId is kept in sessionStorage. */
export function useChat(language: ChatLanguage = 'en') {
  const [sessionId] = useState(getSessionId);
  const [messages, setMessages] = useState<ChatMessage[]>(loadMessages);
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState<ChatFailure | null>(null);

  const pendingRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    writeStorage(MESSAGES_KEY, JSON.stringify(messages.slice(-MAX_STORED_MESSAGES)));
  }, [messages]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const ask = useCallback(
    async (text: string) => {
      pendingRef.current = true;
      setPending(true);
      setFailure(null);
      const controller = new AbortController();
      abortRef.current = controller;

      try {
        const answer = await sendChatMessage({ sessionId, message: text, language }, controller.signal);
        setMessages((prev) => [
          ...prev,
          { id: randomId(), role: 'bot', text: answer.reply, suggestStaff: answer.suggestStaff },
        ]);
      } catch (error) {
        if (isN8nServiceError(error) && error.code === 'ABORTED') return;
        const code: ServiceErrorCode = isN8nServiceError(error) ? error.code : 'SERVER';
        setFailure({
          text,
          code,
          message: code === 'VALIDATION' && isN8nServiceError(error) ? error.message : undefined,
        });
      } finally {
        pendingRef.current = false;
        setPending(false);
      }
    },
    [sessionId, language],
  );

  /** Returns false if the message was not sent (empty, or still waiting for a reply). */
  const send = useCallback(
    (raw: string): boolean => {
      const text = raw.trim();
      if (!text || pendingRef.current) return false;
      setMessages((prev) => [...prev, { id: randomId(), role: 'visitor', text }]);
      void ask(text);
      return true;
    },
    [ask],
  );

  const retry = useCallback(() => {
    if (failure && !pendingRef.current) void ask(failure.text);
  }, [ask, failure]);

  return { sessionId, messages, pending, failure, send, retry };
}
