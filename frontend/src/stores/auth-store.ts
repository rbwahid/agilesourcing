import { create } from 'zustand';

/**
 * User type definition
 */
interface User {
  id: number;
  name: string;
  email: string;
  role: 'designer' | 'supplier' | 'admin' | 'super_admin';
}

/**
 * Auth state interface
 */
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

/**
 * Auth store - in-memory only (no localStorage persistence)
 *
 * SECURITY: User data is NOT persisted to localStorage to prevent XSS attacks
 * from accessing sensitive user information. Auth state is managed via:
 * - React Query for server state (useUser hook)
 * - Server-side session cookies (httpOnly, secure)
 *
 * This store is used for UI state only and should be treated as auxiliary
 * to the React Query cache which is the source of truth.
 */
export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),
  setLoading: (isLoading) => set({ isLoading }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
