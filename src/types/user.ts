// User and staff types. No authentication exists yet -
// these only describe the shape of data the future login will provide.

export type UserRole = 'visitor' | 'staff';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export type HelpRequestStatus = 'new' | 'in-progress' | 'resolved';

/** A request for help sent by a visitor to museum staff. */
export interface HelpRequest {
  id: string;
  visitorName: string;
  /** References Location.id */
  locationId?: string;
  message: string;
  status: HelpRequestStatus;
  /** ISO date-time string. */
  createdAt: string;
}
