export type UserRole = 'visitor' | 'federation' | 'admin';

export interface AppUser {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  country?: string;
  isEmailVerified: boolean;
}

export interface Profile {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  country: string | null;
  isEmailVerified: boolean;
  created_at: string;
  updated_at: string;
}
