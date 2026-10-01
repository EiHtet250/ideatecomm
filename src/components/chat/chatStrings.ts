// All visitor-facing text for the Chatbot page, in one place.
// To add a language later, add an object with the same shape and pick it in getChatStrings().
import type { ChatLanguage, ServiceErrorCode } from '../../types/help';

const en = {
  page: {
    title: 'Museum Chatbot',
    scope: 'I can answer questions about MINT. I may not know everything. For other help, ask a staff member.',
  },
  log: {
    label: 'Conversation',
    you: 'You',
    bot: 'MINT Guide',
    welcome: 'Hi! Ask me about opening hours, tickets, what is on each level, or how to get to MINT.',
    languagesIntro: 'You can write in:',
    /** Language names are written in their own language, with a lang code for screen readers. */
    languages: [
      { lang: 'en', name: 'English' },
      { lang: 'zh', name: '中文' },
      { lang: 'ms', name: 'Bahasa Melayu' },
      { lang: 'ta', name: 'தமிழ்' },
    ],
    thinking: 'Thinking...',
    askStaff: 'Ask museum staff for help',
  },
  quick: {
    heading: 'Quick questions',
    hint: 'Tap a question to ask it.',
    questions: [
      'What are your opening hours?',
      'What is on each level?',
      'How can I contact MINT?',
      'Where can I get help?',
    ],
  },
  composer: {
    label: 'Type your question',
    hint: 'Press Enter to send. Press Shift and Enter for a new line.',
    send: 'Send',
    sending: 'Sending...',
    tooLong: 'Your message is too long. Please use 500 characters or fewer.',
    charactersLeft: (n: number) => (n >= 0 ? `${n} characters left` : `${-n} characters too many`),
  },
  failure: {
    heading: 'Sorry, I cannot answer right now.',
    reasons: {
      VALIDATION: 'Please check your message and try again.',
      AUTH: 'The chatbot is not available at the moment.',
      SERVER: 'Something went wrong on our side.',
      NETWORK: 'We cannot connect. Please check your internet connection.',
      TIMEOUT: 'This took too long.',
      CONFIG: 'The chatbot is not set up yet.',
      ABORTED: 'The message was cancelled.',
    } satisfies Record<ServiceErrorCode, string>,
    stillHelp: 'You can still get help:',
    call: 'Call or WhatsApp',
    email: 'Email',
    helpPage: 'Go to the Help page',
    retry: 'Try again',
  },
};

export type ChatStrings = typeof en;

const chatStrings: Partial<Record<ChatLanguage, ChatStrings>> = { en };

/** No language setting exists yet (Member 4), so this defaults to English. */
export function getChatStrings(language: ChatLanguage = 'en'): ChatStrings {
  return chatStrings[language] ?? en;
}
