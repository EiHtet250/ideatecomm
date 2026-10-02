// All visitor-facing text for the Help page, in one place.
// To add a language later, add a new object with the same shape (e.g. zh, ms, ta)
// and pick it in getHelpStrings(). Keep sentences short and plain.
import type { HelpRequestStatus } from '../../types';
import type { ChatLanguage, ServiceErrorCode } from '../../types/help';

const en = {
  page: {
    title: 'Help',
    description: 'Ask museum staff for help, see what to do in an emergency, and share your feedback.',
  },

  request: {
    heading: 'Need help now?',
    intro: 'Send a message to museum staff. We do not ask for your name.',
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
    recogniseLabel: 'How can staff recognise you? (optional)',
    recogniseHint: 'For example: red jacket, with two children. Please do not write your name or phone number.',
    descriptionLabel: 'What help do you need?',
    descriptionHint: 'Write a short message. Up to 500 characters.',
    charactersLeft: (n: number) => (n >= 0 ? `${n} characters left` : `${-n} characters too many`),
    submit: 'Send to staff',
    submitting: 'Sending...',
    errors: {
      areaRequired: 'Please choose an area. You can choose "I am not sure".',
      noteTooLong: (max: number) => `Please keep this to ${max} characters or fewer.`,
      recogniseTooLong: (max: number) => `Please keep this to ${max} characters or fewer.`,
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
      'If you need help faster, speak to any staff member.',
      'Tell staff your reference number if they ask.',
    ],
    sendAnother: 'Send another message',

    /** Shown after sending, while the visitor waits. Updates as staff change the status. */
    tracker: {
      status: {
        new: { heading: 'Your message was sent to staff', text: 'Staff have been told. Someone will come to you soon.' },
        'in-progress': { heading: 'A staff member is on the way', text: 'Staff have seen your message and are coming to you.' },
        resolved: { heading: 'Staff marked your request as done', text: 'We hope that helped. You can send another message if you still need help.' },
        cancelled: { heading: 'You cancelled this request', text: 'Staff have been told that you no longer need help.' },
        'not-found': {
          heading: 'Staff came but could not find you',
          text: 'Please send a new message from where you are now, or speak to any staff member.',
        },
      } satisfies Record<HelpRequestStatus, { heading: string; text: string }>,
      stayNear: (area: string) => `Please stay near ${area} so staff can find you.`,
      stayHere: 'Please stay where you are so staff can find you.',
      movedHint: 'If you have to move, cancel this request and send a new one from your new place.',
      updates: 'This page checks for updates every 10 seconds.',
      checkFailed: 'We could not check for updates just now. We will keep trying.',
      cancel: 'I no longer need help',
      cancelling: 'Cancelling...',
      cancelFailed: 'We could not cancel your request. Please try again, or tell a staff member.',
    },
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
    ratingLegend: 'How would you rate this guide? Choose 1 to 5 stars.',
    ratingHint: '1 star is the lowest. 5 stars is the best.',
    /** Accessible label for one star option, e.g. "4 out of 5 stars". */
    starLabel: (value: number) => `${value} out of 5 stars`,
    /** Shown next to the stars once the visitor has chosen, e.g. "4 out of 5 stars". */
    ratingSelected: (value: number) => `${value} out of 5 stars`,
    ratingNone: 'No stars chosen yet',
    ratings: [
      { value: 1 },
      { value: 2 },
      { value: 3 },
      { value: 4 },
      { value: 5 },
    ] as const,
    commentLabel: 'What could we do better? (optional)',
    commentHint: 'Please do not write your name or contact details. Up to 500 characters.',
    submit: 'Send feedback',
    submitting: 'Sending...',
    errors: {
      ratingRequired: 'Please choose a rating from 1 to 5 stars.',
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
