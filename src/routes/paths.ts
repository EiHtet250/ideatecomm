// Central list of route paths so links and routes stay in sync.
export const paths = {
  /** Development preview entry page - temporary, remove once login exists. */
  devPreview: '/',
  notFound: '*',

  // Public / auth
  welcome: '/welcome',
  login: '/login',
  signUp: '/signup',

  // Visitor side
  visitorHome: '/visitor',
  museumMap: '/visitor/map',
  discoveryTrail: '/visitor/trail',
  toyGame: '/visitor/game',
  chatbot: '/visitor/chatbot',
  rewards: '/visitor/rewards',
  contact: '/visitor/contact',
  privacyPolicy: '/privacy-policy',
  terms: '/terms-and-conditions',
  profile: '/visitor/profile',
  settings: '/visitor/settings',
  help: '/visitor/help',

  // Staff side (NOT protected - no authentication exists yet)
  staffHome: '/staff',
  helpRequests: '/staff/help-requests',
  visitorFeedback: '/staff/feedback',
  staffSettings: '/staff/settings',
} as const;

/**
 * Main visitor navigation: the things visitors come to do.
 * Chatbot, Help and Settings sit beside the profile in the header; Contact is in the footer.
 */
export const visitorNavLinks = [
  { to: paths.visitorHome, label: 'Home' },
  { to: paths.museumMap, label: 'Museum Map' },
  { to: paths.discoveryTrail, label: 'Discovery Trail' },
  { to: paths.toyGame, label: 'Toy Game' },
  { to: paths.rewards, label: 'Rewards' },
] as const;

export const staffNavLinks = [
  { to: paths.staffHome, key: 'staffHome' },
  { to: paths.helpRequests, key: 'helpRequests' },
  { to: paths.visitorFeedback, key: 'visitorFeedback' },
  { to: paths.staffSettings, key: 'staffSettings' },
] as const;
