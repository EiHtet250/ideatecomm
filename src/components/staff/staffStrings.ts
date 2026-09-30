// All staff-facing text for Staff Home and Help Requests, in one place.
// To add a language later, add an object with the same shape and pick it in getStaffStrings().
import type { HelpRequestStatus } from '../../types';
import type { ChatLanguage, ServiceErrorCode } from '../../types/help';

const en = {
  locale: 'en-SG',

  status: {
    new: 'New',
    'in-progress': 'In progress',
    resolved: 'Resolved',
  } satisfies Record<HelpRequestStatus, string>,

  home: {
    title: 'Staff Home',
    description: 'Overview for museum staff on duty.',
    requestsHeading: 'Help requests',
    countsLabel: 'Help requests by status',
    recentHeading: 'Most recent',
    noRecent: 'No help requests right now.',
    viewAll: 'View Help Requests →',
    futureHeading: 'Future staff feature',
  },

  list: {
    title: 'Help Requests',
    description: 'Help requests sent by visitors from the Help page.',
    areaNote: 'The area is what the visitor chose or typed. It is not a live location.',
    filterLabel: 'Show requests',
    filterAll: 'All',
    loading: 'Loading help requests...',
    empty: 'No help requests right now.',
    emptyFiltered: 'No requests with this status.',
    requestLabel: (id: string) => `Request ${id}`,
    areaLabel: 'Area given by visitor',
    fromQrScan: '(from last QR scan)',
    messageLabel: 'Message',
    sentLabel: 'Sent',
    setStatusLabel: 'Change status',
    saving: 'Saving...',
    lastUpdated: (time: string) => `Updated ${time}. Checks for new requests every 10 seconds.`,
    paused: 'Paused while this tab is hidden.',
    newArrival: (id: string, area: string) => `New help request ${id}: ${area}.`,
    newArrivals: (count: number) => `${count} new help requests.`,
    refreshFailed: (reason: string) => `Could not check for new requests. ${reason} The list below may be out of date.`,
    loadFailed: 'Could not load help requests.',
    retry: 'Try again',
    actionFailed: (status: string) => `The status was not saved. It is back to "${status}".`,
    dismiss: 'Dismiss',
  },

  feedback: {
    heading: 'Visitor feedback',
    intro: 'Ratings and comments sent by visitors from the Help page. Visitors are not asked for their name.',
    question: 'How easy was this guide to use?',
    average: (avg: string, count: number) =>
      `Average ${avg} out of 5, from ${count} ${count === 1 ? 'response' : 'responses'}.`,
    ratingsLabel: 'Number of responses for each rating',
    ratingCount: (count: number) => `${count}`,
    outOfFive: (rating: number) => `${rating} out of 5`,
    commentsHeading: 'Latest comments',
    noFeedback: 'No feedback yet.',
    noComments: 'No written comments yet.',
    showAll: (count: number) => `Show all comments (${count})`,
    showFewer: 'Show fewer comments',
    refresh: 'Refresh',
    refreshing: 'Refreshing...',
    updated: (time: string) => `Updated ${time}.`,
    loading: 'Loading feedback...',
    loadFailed: 'Could not load feedback.',
    refreshFailed: (reason: string) => `Could not refresh feedback. ${reason} The numbers below may be out of date.`,
    retry: 'Try again',
  },

  time: {
    justNow: 'just now',
  },

  serviceErrors: {
    VALIDATION: 'Please check and try again.',
    AUTH: 'The service key is missing or wrong.',
    SERVER: 'The service had a problem.',
    NETWORK: 'No connection to the service.',
    TIMEOUT: 'The service took too long to answer.',
    CONFIG: 'The service is not set up (check .env.local).',
    ABORTED: 'The request was cancelled.',
  } satisfies Record<ServiceErrorCode, string>,
};

export type StaffStrings = typeof en;

const staffStrings: Partial<Record<ChatLanguage, StaffStrings>> = { en };

export function getStaffStrings(language: ChatLanguage = 'en'): StaffStrings {
  return staffStrings[language] ?? en;
}
