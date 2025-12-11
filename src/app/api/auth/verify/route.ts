/**
 * GET /api/auth/verify
 * 
 * Checks if the current user has a valid instructor session.
 * Used to restore instructor mode on page refresh.
 */

import { NextResponse } from 'next/server';
import { isInstructorAuthenticated } from '@/lib/auth';
import type { AuthVerifyResponse } from '@/types';

export async function GET() {
  try {
    const isAuthenticated = await isInstructorAuthenticated();
    
    const response: AuthVerifyResponse = {
      isAuthenticated,
      role: isAuthenticated ? 'instructor' : 'student',
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Auth verify error:', error);
    
    // On error, assume not authenticated
    const response: AuthVerifyResponse = {
      isAuthenticated: false,
      role: 'student',
    };
    
    return NextResponse.json(response);
  }
}

