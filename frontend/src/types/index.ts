import type { Profile } from './profile';

// Re-export all types
export * from './design';
export * from './instagram';
export * from './validation';
export * from './profile';

// User types
export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  email_verified_at: string | null;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
  profile?: Profile;
}

export type UserRole = 'designer' | 'supplier' | 'admin' | 'super_admin';

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// Form types
export interface SelectOption {
  label: string;
  value: string;
}
