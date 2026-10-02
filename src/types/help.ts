// Types for the Help and Chatbot features (Member 3).
// Import directly from './types/help' (not re-exported from types/index.ts).
import type { HelpRequest, HelpRequestStatus } from './user';

export type AreaSource = HelpRequest['areaSource'];

/** What a visitor sends when asking staff for help. */
export interface NewHelpRequest {
  area: string;
  areaSource: AreaSource;
  description: string;
}

/** Languages the chatbot can reply in. */
export type ChatLanguage = 'en' | 'zh' | 'ms' | 'ta';

export interface ChatReply {
  reply: string;
  /** True when the visitor should be pointed to museum staff or the Help page. */
  suggestStaff: boolean;
}

export type HelpStatusFilter = HelpRequestStatus | 'all';

/** Optional visitor feedback. No personal data. */
export interface NewFeedback {
  /** Star rating from 1 (lowest) to 5 (highest). Must match the range the n8n feedback workflow accepts. */
  rating: 1 | 2 | 3 | 4 | 5;
  comment?: string;
}

export interface FeedbackReceipt {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
}

/** A feedback row as shown to staff. */
export type FeedbackEntry = FeedbackReceipt;

/**
 * Error codes from n8nClient.
 * VALIDATION, AUTH, SERVER come from the n8n envelope.
 * NETWORK, TIMEOUT, CONFIG, ABORTED are raised in the browser.
 */
export type ServiceErrorCode =
  | 'VALIDATION'
  | 'AUTH'
  | 'SERVER'
  | 'NETWORK'
  | 'TIMEOUT'
  | 'CONFIG'
  | 'ABORTED';
