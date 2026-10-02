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

/**
 * "cancelled" is set by the visitor (they no longer need help).
 * "not-found" is set by staff who went to the area and could not find the visitor.
 */
export type HelpRequestStatus = 'new' | 'in-progress' | 'resolved' | 'cancelled' | 'not-found';

/**
 * A request for help sent by a visitor to museum staff.
 * No personal data (name, email) is collected or stored.
 */
export interface HelpRequest {
  id: string;
  /** Area given by the visitor, e.g. "Level 3". Not a tracked or live location. */
  area: string;
  /** "manual" = chosen by the visitor, "lastScanned" = from the last QR code they scanned. */
  areaSource: 'manual' | 'lastScanned';
  description: string;
  /** Optional: how staff can recognise the visitor, e.g. "red jacket". Empty when not given. */
  visitorNote: string;
  status: HelpRequestStatus;
  /** ISO date-time string (built-in Data Table column). */
  createdAt: string;
  /** ISO date-time string (built-in Data Table column). */
  updatedAt?: string;
}
