/**
 * GET /api/cohorts
 * 
 * Returns all available cohorts for the lobby display.
 * Cohorts are loaded from static configuration.
 */

import { NextResponse } from 'next/server';
import { getAllCohorts } from '@/config/cohorts';
import type { CohortsResponse } from '@/types';

export async function GET() {
  try {
    const cohorts = getAllCohorts();
    
    // Return cohorts without exposing internal Daily.co URLs to client
    // The client will use /api/daily/token to get room access
    const publicCohorts = cohorts.map(cohort => ({
      id: cohort.id,
      name: cohort.name,
      image: cohort.image,
      description: cohort.description,
      capacity: cohort.capacity,
    }));
    
    const response: CohortsResponse = {
      cohorts: publicCohorts as CohortsResponse['cohorts'],
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching cohorts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cohorts' },
      { status: 500 }
    );
  }
}

