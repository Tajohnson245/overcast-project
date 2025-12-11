/**
 * Cohort Configuration
 * 
 * Static configuration for the 6 classroom cohorts.
 * Daily.co room URLs are loaded from environment variables.
 * 
 * To add or modify cohorts:
 * 1. Update this file with the new cohort data
 * 2. Add corresponding DAILY_ROOM_COHORT_X env variable
 * 3. Create the room in Daily.co dashboard
 */

import { Cohort } from '@/types';

/**
 * All available cohorts in the Overcast classroom.
 * Each cohort maps to a pre-configured Daily.co room.
 */
export const COHORTS: Cohort[] = [
  {
    id: 'cohort-1',
    name: 'Cohort 1',
    image: '/images/cohorts/cohort-1.svg',
    dailyRoomUrl: process.env.DAILY_ROOM_COHORT_1 || 'https://your-domain.daily.co/cohort-1',
    description: 'AI Fundamentals - Introduction to AI Engineering',
    capacity: 50,
  },
  {
    id: 'cohort-2',
    name: 'Cohort 2',
    image: '/images/cohorts/cohort-2.svg',
    dailyRoomUrl: process.env.DAILY_ROOM_COHORT_2 || 'https://your-domain.daily.co/cohort-2',
    description: 'Machine Learning - Core ML Algorithms & Techniques',
    capacity: 50,
  },
  {
    id: 'cohort-3',
    name: 'Cohort 3',
    image: '/images/cohorts/cohort-3.svg',
    dailyRoomUrl: process.env.DAILY_ROOM_COHORT_3 || 'https://your-domain.daily.co/cohort-3',
    description: 'Deep Learning - Neural Networks & Architectures',
    capacity: 50,
  },
  {
    id: 'cohort-4',
    name: 'Cohort 4',
    image: '/images/cohorts/cohort-4.svg',
    dailyRoomUrl: process.env.DAILY_ROOM_COHORT_4 || 'https://your-domain.daily.co/cohort-4',
    description: 'Neural Networks - Advanced Network Design',
    capacity: 50,
  },
  {
    id: 'cohort-5',
    name: 'Cohort 5',
    image: '/images/cohorts/cohort-5.svg',
    dailyRoomUrl: process.env.DAILY_ROOM_COHORT_5 || 'https://your-domain.daily.co/cohort-5',
    description: 'LLM Engineering - Building with Large Language Models',
    capacity: 50,
  },
  {
    id: 'cohort-6',
    name: 'Cohort 6',
    image: '/images/cohorts/cohort-6.svg',
    dailyRoomUrl: process.env.DAILY_ROOM_COHORT_6 || 'https://your-domain.daily.co/cohort-6',
    description: 'AI Production - Deploying AI at Scale',
    capacity: 50,
  },
];

/**
 * Get a cohort by its ID.
 * Returns undefined if cohort is not found.
 */
export function getCohortById(id: string): Cohort | undefined {
  return COHORTS.find(cohort => cohort.id === id);
}

/**
 * Get all cohorts.
 * Used by the lobby page to display the cohort grid.
 */
export function getAllCohorts(): Cohort[] {
  return COHORTS;
}

/**
 * Extract room name from Daily.co URL.
 * Example: "https://domain.daily.co/cohort-1" -> "cohort-1"
 */
export function getRoomNameFromUrl(url: string): string {
  const parts = url.split('/');
  return parts[parts.length - 1];
}

