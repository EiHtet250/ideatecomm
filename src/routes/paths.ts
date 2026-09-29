// Central list of route paths so links and routes stay in sync.
export const paths = {
  welcome: '/',
  home: '/home',
  directions: '/directions',
  exhibits: '/exhibits',
  discoveryTrail: '/discovery-trail',
  profile: '/profile',
  settings: '/settings',
  help: '/help',
} as const;

/** Links shown in the shared navigation (Welcome is the landing page, reached via the brand link). */
export const navLinks = [
  { to: paths.home, label: 'Home' },
  { to: paths.directions, label: 'Directions' },
  { to: paths.exhibits, label: 'Exhibits' },
  { to: paths.discoveryTrail, label: 'Discovery Trail' },
  { to: paths.profile, label: 'Profile' },
  { to: paths.settings, label: 'Settings' },
  { to: paths.help, label: 'Help' },
] as const;
