# Data Model: Overcast Video Classroom

**Feature**: 001-video-classroom  
**Date**: 2025-12-10  
**Status**: Complete

## Overview

This document defines the data entities for the Overcast Video Classroom application. Since we are using local configuration without a database, entities are represented as TypeScript interfaces with static configuration data.

---

## Entity Relationship Diagram

```text
┌─────────────┐         ┌─────────────┐
│   Cohort    │ 1     * │   Session   │
│  (config)   │─────────│  (runtime)  │
└─────────────┘         └─────────────┘
                              │
                              │ 1
                              │
                              │ *
                        ┌─────────────┐
                        │ Participant │
                        │  (runtime)  │
                        └─────────────┘
                              │
                              │ 0..1
                              │ belongs to
                              ▼
                        ┌─────────────┐
                        │ BreakoutRoom│
                        │  (runtime)  │
                        └─────────────┘
                        
┌─────────────┐
│    User     │ (local state, not persisted)
│ mode: role  │
└─────────────┘
```

---

## Entities

### 1. Cohort

**Description**: A classroom grouping with pre-configured Daily room URL. Static configuration loaded at build time.

**Source**: `config/cohorts.ts`

```typescript
/**
 * Represents a cohort classroom configuration.
 * Cohorts are statically defined and do not change at runtime.
 */
interface Cohort {
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
```

**Validation Rules**:
- `id`: Required, unique, kebab-case format
- `name`: Required, max 50 characters
- `image`: Required, valid image path or URL
- `dailyRoomUrl`: Required, valid Daily.co room URL format
- `description`: Required, max 200 characters

**Example Data**:

```typescript
const COHORTS: Cohort[] = [
  {
    id: 'cohort-1',
    name: 'Cohort 1',
    image: '/images/cohorts/cohort-1.jpg',
    dailyRoomUrl: 'https://overcast.daily.co/cohort-1',
    description: 'AI Engineering Fundamentals - Week 1'
  },
  // ... 5 more cohorts
];
```

---

### 2. User

**Description**: Represents the current user in the application. Stored in client-side state only; not persisted to server.

**Source**: React Context / Jotai atom

```typescript
/**
 * Current user state.
 * Mode determines which features are available.
 */
interface User {
  /** Display name for video sessions */
  displayName: string;
  
  /** Current operational mode */
  mode: 'student' | 'instructor';
  
  /** True if instructor authentication succeeded */
  isAuthenticated: boolean;
}
```

**State Transitions**:

```text
Initial State:
  mode: 'student'
  isAuthenticated: false

On successful instructor login:
  mode: 'instructor'
  isAuthenticated: true

On instructor logout (click "Students"):
  mode: 'student'
  isAuthenticated: false
```

**Validation Rules**:
- `displayName`: Optional, defaults to 'Guest', max 30 characters
- `mode`: Required, must be 'student' or 'instructor'
- `isAuthenticated`: Required, must be true for instructor mode features

---

### 3. Session

**Description**: Runtime representation of an active video session. Managed by Daily.co, represented locally for UI state.

**Source**: Daily.co + local state

```typescript
/**
 * Runtime session state derived from Daily.co room.
 * This is not stored - it reflects the current call state.
 */
interface Session {
  /** The cohort this session belongs to */
  cohortId: string;
  
  /** Daily.co room name (extracted from URL) */
  roomName: string;
  
  /** Current connection state */
  connectionState: 'idle' | 'joining' | 'joined' | 'leaving' | 'error';
  
  /** List of current participants */
  participants: Participant[];
  
  /** Active breakout rooms (if any) */
  breakoutRooms: BreakoutRoom[];
  
  /** Error message if connectionState is 'error' */
  error?: string;
}
```

**State Transitions**:

```text
idle → joining     (user clicks cohort tile)
joining → joined   (Daily.co connection established)
joining → error    (connection failed)
joined → leaving   (user clicks return to lobby)
leaving → idle     (disconnection complete)
error → idle       (user acknowledges error)
```

---

### 4. Participant

**Description**: A user currently in a video session. Data provided by Daily.co participant events.

**Source**: Daily.co SDK (`DailyParticipant` type)

```typescript
/**
 * Represents a participant in the video session.
 * Wraps Daily.co's DailyParticipant with our UI concerns.
 */
interface Participant {
  /** Daily.co session ID (unique per connection) */
  sessionId: string;
  
  /** Display name from Daily.co user_name */
  displayName: string;
  
  /** True if this is the local user */
  isLocal: boolean;
  
  /** True if this participant has owner permissions */
  isOwner: boolean;
  
  /** Video track state */
  videoState: 'off' | 'loading' | 'playable' | 'interrupted';
  
  /** Audio track state */
  audioState: 'off' | 'loading' | 'playable' | 'interrupted';
  
  /** True if audio is muted (either by self or by instructor) */
  isMuted: boolean;
  
  /** Reference to video track for rendering */
  videoTrack?: MediaStreamTrack;
  
  /** Reference to audio track for rendering */
  audioTrack?: MediaStreamTrack;
  
  /** Breakout room ID if participant is in a breakout */
  breakoutRoomId?: string;
}
```

**Derived from Daily.co**:

```typescript
// Mapping from DailyParticipant to our Participant
function mapDailyParticipant(dp: DailyParticipant): Participant {
  return {
    sessionId: dp.session_id,
    displayName: dp.user_name || 'Guest',
    isLocal: dp.local,
    isOwner: dp.owner,
    videoState: dp.tracks.video.state,
    audioState: dp.tracks.audio.state,
    isMuted: dp.tracks.audio.state === 'off',
    videoTrack: dp.tracks.video.track,
    audioTrack: dp.tracks.audio.track,
  };
}
```

---

### 5. BreakoutRoom

**Description**: A sub-session created by an instructor for small group work.

**Source**: Local state + separate Daily.co rooms

```typescript
/**
 * Represents a breakout room within a session.
 * Instructor creates these for small group activities.
 */
interface BreakoutRoom {
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
```

**Note**: Full breakout room implementation is deferred to future scope. This model is included for reference.

---

### 6. InstructorCredentials

**Description**: Simple credentials for instructor authentication. Stored in environment variables.

**Source**: Environment variables

```typescript
/**
 * Instructor login request payload.
 */
interface LoginRequest {
  username: string;
  password: string;
}

/**
 * Instructor authentication response.
 */
interface LoginResponse {
  success: boolean;
  error?: string;
}
```

**Validation Rules**:
- `username`: Required, no whitespace
- `password`: Required, minimum 8 characters

---

## Data Flow Diagrams

### Student Join Flow

```text
1. Page Load
   └─> Fetch cohorts from config
   └─> Render lobby with 6 cohort tiles

2. Click Cohort Tile
   └─> Navigate to /session/[cohortId]
   └─> Session state: idle → joining
   └─> DailyProvider connects to dailyRoomUrl
   └─> Session state: joining → joined
   └─> Render video grid with participants

3. Click Return to Lobby
   └─> Session state: joined → leaving
   └─> Daily.co leave() called
   └─> Navigate to lobby
   └─> Session state: leaving → idle
```

### Instructor Auth Flow

```text
1. Click "Instructors" Button
   └─> Check if already authenticated (cookie check)
   └─> If authenticated: mode → instructor
   └─> If not: Show login modal

2. Submit Login
   └─> POST /api/auth/login
   └─> Server validates credentials
   └─> If valid: Set HTTP-only cookie, return success
   └─> Client: mode → instructor, isAuthenticated → true

3. Click "Students" Button (when instructor)
   └─> POST /api/auth/logout
   └─> Server clears cookie
   └─> Client: mode → student, isAuthenticated → false
```

---

## Storage Summary

| Entity | Storage Type | Persistence |
|--------|--------------|-------------|
| Cohort | Config file (TypeScript) | Build-time |
| User | React state (Jotai) | Session only |
| Session | React state + Daily.co | Runtime only |
| Participant | Daily.co SDK | Runtime only |
| BreakoutRoom | React state + Daily.co | Runtime only |
| Instructor Token | HTTP-only cookie | 4 hours |

---

## Type Exports

All types will be exported from a central location:

```typescript
// types/index.ts
export type { Cohort } from './cohort';
export type { User, UserMode } from './user';
export type { Session, ConnectionState } from './session';
export type { Participant, TrackState } from './participant';
export type { BreakoutRoom } from './breakout-room';
export type { LoginRequest, LoginResponse } from './auth';
```

