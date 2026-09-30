// All visitor-facing text for the Help page, in one place.
// To add a language later, add a new object with the same shape (e.g. zh, ms, ta)
// and pick it in getHelpStrings(). Keep sentences short and plain.
import type { ChatLanguage, ServiceErrorCode } from '../../types/help';

const en = {
  page: {
    title: 'Help',
    description: 'Ask museum staff for help, see what to do in an emergency, and share your feedback.',
  },

  request: {
    heading: 'Need help now?',
    intro: 'Send a message to museum staff. We do not ask for your name.',
    sharedNotice: 'Your message and the area you choose will be shared with museum staff.',
    emergencyNote: 'In an emergency, tell a staff member now.',
    emergencyCall: 'Call',
    areaLabel: 'Where are you?',
    areaHint: 'Choose the level you are on. If you do not know, choose "I am not sure".',
    areaChoose: 'Choose an area',
    areaLevel: (level: number) => `Level ${level}`,
    areaUnsure: 'I am not sure',
    areaLastScanned: (area: string) => `${area} (from your last QR scan)`,
    noteLabel: 'More about where you are (optional)',
    noteHint: 'For example: near the lift.',
    descriptionLabel: 'What help do you need?',
    descriptionHint: 'Write a short message. Up to 500 characters.',
    charactersLeft: (n: number) => (n >= 0 ? `${n} characters left` : `${-n} characters too many`),
    submit: 'Send to staff',
    submitting: 'Sending...',
    errors: {
      areaRequired: 'Please choose an area. You can choose "I am not sure".',
      noteTooLong: (max: number) => `Please keep this to ${max} characters or fewer.`,
      descriptionRequired: 'Please tell us what help you need.',
      descriptionTooLong: 'Your message is too long. Please use 500 characters or fewer.',
    },
    failedHeading: 'Your message was not sent',
    failedKeepText: 'Your message is still in the form.',
    retry: 'Try again',
    callInstead: 'You can also call or WhatsApp',
    successHeading: 'Your message was sent to staff',
    referenceLabel: 'Reference number',
    nextStepsHeading: 'What to do next',
    nextSteps: [
      'If it is safe, stay near the area you chose.',
      'If you need help faster, speak to any staff member.',
      'Tell staff your reference number if they ask.',
    ],
    sendAnother: 'Send another message',
  },

  safety: {
    heading: 'Safety information',
    intro: 'If something is wrong:',
    steps: [
      'Stay calm.',
      'If you can, move to a safe place.',
      'Tell a museum staff member.',
    ],
    emergencyPrefix: 'In an emergency, call',
    ambulanceFire: 'for ambulance or fire',
    or: 'or',
    police: 'for police',
  },

  contact: {
    heading: 'Contact MINT',
    address: 'Address',
    phone: 'Phone or WhatsApp',
    email: 'Email',
    hours: 'Opening hours',
  },

  feedback: {
    heading: 'Feedback',
    intro: 'This is optional. It helps us make the guide better.',
    ratingLegend: 'How easy was this guide to use?',
    ratings: [
      { value: 1, icon: '😣', label: 'Very hard' },
      { value: 2, icon: '🙁', label: 'Hard' },
      { value: 3, icon: '😐', label: 'Okay' },
      { value: 4, icon: '🙂', label: 'Easy' },
      { value: 5, icon: '😄', label: 'Very easy' },
    ] as const,
    commentLabel: 'What could we do better? (optional)',
    commentHint: 'Please do not write your name or contact details. Up to 500 characters.',
    submit: 'Send feedback',
    submitting: 'Sending...',
    errors: {
      ratingRequired: 'Please choose how easy the guide was to use.',
      commentTooLong: 'Your comment is too long. Please use 500 characters or fewer.',
    },
    failedHeading: 'Your feedback was not sent',
    retry: 'Try again',
    successHeading: 'Thank you for your feedback',
    successText: 'Your feedback helps us improve the guide.',
    sendAnother: 'Send more feedback',
  },

  /** Friendly messages for service errors. VALIDATION uses the server's own message when there is one. */
  serviceErrors: {
    VALIDATION: 'Please check your message and try again.',
    AUTH: 'This guide cannot reach museum staff right now.',
    SERVER: 'Something went wrong on our side.',
    NETWORK: 'We cannot connect right now. Please check your internet connection.',
    TIMEOUT: 'This is taking too long.',
    CONFIG: 'Help requests are not set up yet.',
    ABORTED: 'The message was cancelled.',
  } satisfies Record<ServiceErrorCode, string>,
};

export type HelpStrings = typeof en;

const helpStrings: Partial<Record<ChatLanguage, HelpStrings>> = { en };

/** No language setting exists yet (Member 4), so this defaults to English. */
export function getHelpStrings(language: ChatLanguage = 'en'): HelpStrings {
  return helpStrings[language] ?? en;
}
