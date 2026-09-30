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
  chatbot: '/visitor/chatbot',
  profile: '/visitor/profile',
  settings: '/visitor/settings',
  help: '/visitor/help',

  // Staff side (NOT protected - no authentication exists yet)
  staffHome: '/staff',
  helpRequests: '/staff/help-requests',
  visitorFeedback: '/staff/feedback',
} as const;

/** Main visitor navigation. Museum Map is reached from Home; Help sits in the header. */
export const visitorNavLinks = [
  { to: paths.visitorHome, label: 'Home' },
  { to: paths.discoveryTrail, label: 'Discovery Trail' },
  { to: paths.chatbot, label: 'Chatbot' },
  { to: paths.settings, label: 'Settings' },
] as const;

export const staffNavLinks = [
  { to: paths.staffHome, label: 'Staff Home' },
  { to: paths.helpRequests, label: 'Help Requests' },
  { to: paths.visitorFeedback, label: 'Visitor Feedback' },
] as const;
