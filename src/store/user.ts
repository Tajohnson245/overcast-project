/**
 * User State Store (Jotai)
 * 
 * Global state for user mode (student/instructor) and authentication status.
 * Uses Jotai atoms for simple, performant state management.
 */

import { atom } from 'jotai';
import type { User, UserMode } from '@/types';
import { DEFAULT_USER } from '@/types';

/**
 * Main user atom storing the complete user state.
 */
export const userAtom = atom<User>(DEFAULT_USER);

/**
 * Derived atom for just the user mode.
 * Read-only - use setUserMode action to update.
 */
export const userModeAtom = atom(
  (get) => get(userAtom).mode
);

/**
 * Derived atom for authentication status.
 * Read-only - managed by login/logout actions.
 */
export const isAuthenticatedAtom = atom(
  (get) => get(userAtom).isAuthenticated
);

/**
 * Action atom to set user mode.
 */
export const setUserModeAtom = atom(
  null,
  (get, set, mode: UserMode) => {
    const currentUser = get(userAtom);
    set(userAtom, { ...currentUser, mode });
  }
);

/**
 * Action atom to set authentication state.
 */
export const setAuthenticatedAtom = atom(
  null,
  (get, set, isAuthenticated: boolean) => {
    const currentUser = get(userAtom);
    set(userAtom, {
      ...currentUser,
      isAuthenticated,
      mode: isAuthenticated ? 'instructor' : 'student',
    });
  }
);

/**
 * Action atom to set display name.
 */
export const setDisplayNameAtom = atom(
  null,
  (get, set, displayName: string) => {
    const currentUser = get(userAtom);
    set(userAtom, { ...currentUser, displayName });
  }
);

/**
 * Action atom to reset user to default state (logout).
 */
export const resetUserAtom = atom(
  null,
  (_get, set) => {
    set(userAtom, DEFAULT_USER);
  }
);

