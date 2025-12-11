/**
 * GET /api/cohorts/[cohortId]
 * 
 * Returns a single cohort by ID.
 * Used when navigating to a specific cohort session.
 */

import { NextResponse } from 'next/server';
import { getCohortById } from '@/config/cohorts';

interface RouteParams {
  params: Promise<{
    cohortId: string;
  }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { cohortId } = await params;
    const cohort = getCohortById(cohortId);
    
    if (!cohort) {
      return NextResponse.json(
        { error: 'Cohort not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }
    
    // Return cohort without exposing internal Daily.co URL
    const publicCohort = {
      id: cohort.id,
      name: cohort.name,
      image: cohort.image,
      description: cohort.description,
      capacity: cohort.capacity,
    };
    
    return NextResponse.json(publicCohort);
  } catch (error) {
    console.error('Error fetching cohort:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cohort' },
      { status: 500 }
    );
  }
}

