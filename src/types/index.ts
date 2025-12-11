/**
 * Overcast Video Classroom - TypeScript Interfaces
 * 
 * Central type definitions for all entities in the application.
 * See data-model.md for detailed entity documentation.
 */

// =============================================================================
// Cohort Types
// =============================================================================

/**
 * Represents a cohort classroom configuration.
 * Cohorts are statically defined and do not change at runtime.
 */
export interface Cohort {
  /** Unique identifier (e.g., 'cohort-1') */
  id: string;
  
  /** Display name (e.g., 'Cohort 1') */
  name: string;
  
  /** Path to static image for cohort tile */
  image: string;
  
  /** Pre-configured Daily.co room URL */
  dailyRoomUrl: string;
  
  /** Brief description of cohort focus */
  description: string;
  
  /** Optional: capacity limit for display purposes */
  capacity?: number;
}

// =============================================================================
// User Types
// =============================================================================

/** Possible user modes in the application */
export type UserMode = 'student' | 'instructor';

/**
 * Current user state.
 * Mode determines which features are available.
 */
export interface User {
  /** Display name for video sessions */
  displayName: string;
  
  /** Current operational mode */
  mode: UserMode;
  
  /** True if instructor authentication succeeded */
  isAuthenticated: boolean;
}

/** Default user state for new visitors */
export const DEFAULT_USER: User = {
  displayName: 'Guest',
  mode: 'student',
  isAuthenticated: false,
};

// =============================================================================
// Session Types
// =============================================================================

/** Possible connection states for a video session */
export type ConnectionState = 'idle' | 'joining' | 'joined' | 'leaving' | 'error';

/** Possible states for a media track */
export type TrackState = 'off' | 'loading' | 'playable' | 'interrupted';

/**
 * Runtime session state derived from Daily.co room.
 * This is not stored - it reflects the current call state.
 */
export interface Session {
  /** The cohort this session belongs to */
  cohortId: string;
  
  /** Daily.co room name (extracted from URL) */
  roomName: string;
  
  /** Current connection state */
  connectionState: ConnectionState;
  
  /** List of current participants */
  participants: Participant[];
  
  /** Active breakout rooms (if any) */
  breakoutRooms: BreakoutRoom[];
  
  /** Error message if connectionState is 'error' */
  error?: string;
}

// =============================================================================
// Participant Types
// =============================================================================

/**
 * Represents a participant in the video session.
 * Wraps Daily.co's DailyParticipant with our UI concerns.
 */
export interface Participant {
  /** Daily.co session ID (unique per connection) */
  sessionId: string;
  
  /** Display name from Daily.co user_name */
  displayName: string;
  
  /** True if this is the local user */
  isLocal: boolean;
  
  /** True if this participant has owner permissions */
  isOwner: boolean;
  
  /** Video track state */
  videoState: TrackState;
  
  /** Audio track state */
  audioState: TrackState;
  
  /** True if audio is muted (either by self or by instructor) */
  isMuted: boolean;
  
  /** Reference to video track for rendering */
  videoTrack?: MediaStreamTrack;
  
  /** Reference to audio track for rendering */
  audioTrack?: MediaStreamTrack;
  
  /** Breakout room ID if participant is in a breakout */
  breakoutRoomId?: string;
}

// =============================================================================
// Breakout Room Types
// =============================================================================

/**
 * Represents a breakout room within a session.
 * Instructor creates these for small group activities.
 */
export interface BreakoutRoom {
  /** Unique identifier for this breakout */
  id: string;
  
  /** Display name (e.g., 'Group 1', 'Group 2') */
  name: string;
  
  /** Daily.co room URL for this breakout */
  dailyRoomUrl: string;
  
  /** Session IDs of participants assigned to this breakout */
  participantIds: string[];
  
  /** Target group size specified by instructor */
  targetSize: number;
  
  /** Creation timestamp */
  createdAt: Date;
}

// =============================================================================
// Authentication Types
// =============================================================================

/**
 * Instructor login request payload.
 */
export interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Instructor authentication response.
 */
export interface LoginResponse {
  success: boolean;
  error?: string;
}

/**
 * Auth verification response from /api/auth/verify
 */
export interface AuthVerifyResponse {
  isAuthenticated: boolean;
  role: UserMode;
}

// =============================================================================
// API Response Types
// =============================================================================

/**
 * Response from GET /api/cohorts
 */
export interface CohortsResponse {
  cohorts: Cohort[];
}

/**
 * Response from POST /api/daily/token
 */
export interface DailyTokenResponse {
  token: string;
  roomUrl: string;
}

/**
 * Request body for POST /api/daily/token
 */
export interface DailyTokenRequest {
  roomName: string;
  userName: string;
  isInstructor?: boolean;
}

/**
 * Generic API error response
 */
export interface ApiError {
  error: string;
  code?: string;
}

