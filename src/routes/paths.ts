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

/** Main visitor navigation. Museum Map is reached from Home; Help sits in the header. */
export const visitorNavLinks = [
  { to: paths.visitorHome, label: 'Home' },
  { to: paths.discoveryTrail, label: 'Discovery Trail' },
  { to: paths.toyGame, label: 'Toy Game' },
  { to: paths.rewards, label: 'Rewards' },
  { to: paths.chatbot, label: 'Chatbot' },
  { to: paths.contact, label: 'Contact' },
  { to: paths.settings, label: 'Settings' },
] as const;

export const staffNavLinks = [
  { to: paths.staffHome, key: 'staffHome' },
  { to: paths.helpRequests, key: 'helpRequests' },
  { to: paths.visitorFeedback, key: 'visitorFeedback' },
  { to: paths.staffSettings, key: 'staffSettings' },
] as const;
