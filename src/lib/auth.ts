/**
 * Authentication Utilities
 * 
 * JWT sign/verify functions and cookie helpers for instructor authentication.
 * Uses the 'jose' library for JWT operations.
 */

import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

// Cookie name for instructor token
export const AUTH_COOKIE_NAME = 'instructor_token';

// Token expiration time (4 hours)
export const TOKEN_EXPIRATION = '4h';
export const TOKEN_MAX_AGE = 4 * 60 * 60; // 4 hours in seconds

/**
 * Get the JWT secret from environment variables.
 * Throws if not configured.
 */
function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  
  if (!secret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }
  
  return new TextEncoder().encode(secret);
}

/**
 * Payload stored in the JWT token.
 */
interface TokenPayload {
  role: 'instructor';
  iat?: number;
  exp?: number;
  [key: string]: unknown; // Index signature for JWTPayload compatibility
}

/**
 * Create a signed JWT token for an instructor.
 */
export async function createInstructorToken(): Promise<string> {
  const secret = getJwtSecret();
  
  const token = await new SignJWT({ role: 'instructor' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRATION)
    .sign(secret);
  
  return token;
}

/**
 * Verify an instructor JWT token.
 * Returns the payload if valid, null if invalid or expired.
 */
export async function verifyInstructorToken(token: string): Promise<TokenPayload | null> {
  try {
    const secret = getJwtSecret();
    const { payload } = await jwtVerify(token, secret);
    
    // Verify it's an instructor token
    if (payload.role !== 'instructor') {
      return null;
    }
    
    return payload as TokenPayload;
  } catch (error) {
    // Token is invalid or expired
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Set the instructor authentication cookie.
 * Uses HTTP-only cookie for security.
 */
export async function setAuthCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: TOKEN_MAX_AGE,
    path: '/',
  });
}

/**
 * Get the instructor token from cookies.
 * Returns null if not found.
 */
export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(AUTH_COOKIE_NAME);
  return cookie?.value || null;
}

/**
 * Clear the instructor authentication cookie.
 */
export async function clearAuthCookie(): Promise<void> {
  const cookieStore = await cookies();
  
  cookieStore.set(AUTH_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0,
    path: '/',
  });
}

/**
 * Validate instructor credentials against environment variables.
 */
export function validateCredentials(username: string, password: string): boolean {
  const validUsername = process.env.INSTRUCTOR_USERNAME;
  const validPassword = process.env.INSTRUCTOR_PASSWORD;
  
  if (!validUsername || !validPassword) {
    console.error('Instructor credentials not configured in environment');
    return false;
  }
  
  return username === validUsername && password === validPassword;
}

/**
 * Check if the current request has a valid instructor session.
 */
export async function isInstructorAuthenticated(): Promise<boolean> {
  const token = await getAuthCookie();
  
  if (!token) {
    return false;
  }
  
  const payload = await verifyInstructorToken(token);
  return payload !== null;
}

