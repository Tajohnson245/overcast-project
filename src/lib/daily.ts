/**
 * Daily.co Helper Functions
 * 
 * Utilities for interacting with the Daily.co API and managing video sessions.
 */

import type { DailyTokenRequest, DailyTokenResponse } from '@/types';

/**
 * Fetch a meeting token from our API.
 * The token is required to join a Daily.co room.
 */
export async function getDailyToken(
  roomName: string,
  userName: string,
  isInstructor: boolean = false
): Promise<DailyTokenResponse> {
  const response = await fetch('/api/daily/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      roomName,
      userName,
      isInstructor,
    } as DailyTokenRequest),
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || 'Failed to get meeting token');
  }
  
  return response.json();
}

/**
 * Extract the room name from a cohort ID.
 * Cohort IDs are already in the format "cohort-1", "cohort-2", etc.
 */
export function getCohortRoomName(cohortId: string): string {
  return cohortId;
}

/**
 * Generate a random guest name for anonymous users.
 */
export function generateGuestName(): string {
  const adjectives = ['Swift', 'Bright', 'Clever', 'Quick', 'Sharp', 'Bold', 'Keen', 'Wise'];
  const nouns = ['Learner', 'Student', 'Coder', 'Builder', 'Maker', 'Hacker', 'Engineer', 'Dev'];
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const number = Math.floor(Math.random() * 100);
  
  return `${adjective}${noun}${number}`;
}

