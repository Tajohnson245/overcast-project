/**
 * POST /api/auth/login
 * 
 * Authenticates an instructor using username and password.
 * On success, sets an HTTP-only cookie with a JWT token.
 */

import { NextResponse } from 'next/server';
import { 
  validateCredentials, 
  createInstructorToken, 
  setAuthCookie 
} from '@/lib/auth';
import type { LoginRequest, LoginResponse, ApiError } from '@/types';

export async function POST(request: Request) {
  try {
    const body: LoginRequest = await request.json();
    const { username, password } = body;
    
    // Validate required fields
    if (!username || !password) {
      return NextResponse.json<ApiError>(
        { error: 'Username and password are required', code: 'VALIDATION_ERROR' },
        { status: 400 }
      );
    }
    
    // Validate credentials
    if (!validateCredentials(username, password)) {
      return NextResponse.json<ApiError>(
        { error: 'Invalid credentials', code: 'AUTH_FAILED' },
        { status: 401 }
      );
    }
    
    // Create JWT token
    const token = await createInstructorToken();
    
    // Set HTTP-only cookie
    await setAuthCookie(token);
    
    const response: LoginResponse = {
      success: true,
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json<ApiError>(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

