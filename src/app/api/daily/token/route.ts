/**
 * POST /api/daily/token
 * 
 * Generates a Daily.co meeting token for joining a room.
 * Instructor tokens include owner permissions for moderation.
 * 
 * Request body:
 * - roomName: The cohort room to join
 * - userName: Display name for the participant
 * - isInstructor: Whether to grant owner permissions (optional)
 */

import { NextResponse } from 'next/server';
import { getCohortById, getRoomNameFromUrl } from '@/config/cohorts';
import type { DailyTokenRequest, DailyTokenResponse, ApiError } from '@/types';

export async function POST(request: Request) {
  try {
    const body: DailyTokenRequest = await request.json();
    const { roomName, userName, isInstructor = false } = body;
    
    // Validate required fields
    if (!roomName || !userName) {
      return NextResponse.json<ApiError>(
        { error: 'roomName and userName are required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }
    
    // Find the cohort to get the Daily.co room URL
    const cohortId = roomName.startsWith('cohort-') ? roomName : `cohort-${roomName}`;
    const cohort = getCohortById(cohortId);
    
    if (!cohort) {
      return NextResponse.json<ApiError>(
        { error: 'Room not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }
    
    // Get API key from environment
    const apiKey = process.env.DAILY_API_KEY;
    
    if (!apiKey) {
      console.error('DAILY_API_KEY not configured');
      return NextResponse.json<ApiError>(
        { error: 'Server configuration error', code: 'CONFIG_ERROR' },
        { status: 500 }
      );
    }
    
    // Extract room name from Daily.co URL
    const dailyRoomName = getRoomNameFromUrl(cohort.dailyRoomUrl);
    
    // Generate meeting token via Daily.co API
    const tokenResponse = await fetch('https://api.daily.co/v1/meeting-tokens', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          room_name: dailyRoomName,
          user_name: userName,
          is_owner: isInstructor,
          enable_screenshare: isInstructor,
          // Token expires in 1 hour
          exp: Math.floor(Date.now() / 1000) + 3600,
        },
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json().catch(() => ({}));
      console.error('Daily.co API error:', errorData);
      return NextResponse.json<ApiError>(
        { error: 'Failed to generate meeting token', code: 'DAILY_API_ERROR' },
        { status: 500 }
      );
    }
    
    const tokenData = await tokenResponse.json();
    
    const response: DailyTokenResponse = {
      token: tokenData.token,
      roomUrl: cohort.dailyRoomUrl,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error generating token:', error);
    return NextResponse.json<ApiError>(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

