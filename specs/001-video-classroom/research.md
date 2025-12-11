# Research: Overcast Video Classroom

**Feature**: 001-video-classroom  
**Date**: 2025-12-10  
**Status**: Complete

## Executive Summary

This research consolidates findings for building a video classroom application using the Daily.co platform with Next.js, Vercel serverless functions, and Tailwind CSS. The application will support 6 pre-configured cohort rooms with student/instructor modes and moderation capabilities.

---

## 1. Video Platform: Daily.co

### Decision: Use @daily-co/daily-react with DailyProvider Pattern

**Rationale**: Daily React provides React-specific hooks and components that simplify integration compared to raw daily-js. The hook-based API aligns with modern React patterns and reduces boilerplate.

**Alternatives Considered**:
- **Raw daily-js only**: Rejected - requires more manual state management, doesn't integrate naturally with React component lifecycle
- **Daily Prebuilt UI**: Rejected - limited customization for our futuristic aesthetic requirements

### Key Integration Patterns

#### 1.1 Installation

```bash
npm install @daily-co/daily-react @daily-co/daily-js jotai
```

**Note**: `jotai` is a peer dependency required by daily-react for state management.

#### 1.2 DailyProvider Setup

The application MUST wrap video-enabled pages with `DailyProvider`:

```tsx
import { DailyProvider } from '@daily-co/daily-react';

function VideoSession({ roomUrl }) {
  return <DailyProvider url={roomUrl}>{/* Video components */}</DailyProvider>;
}
```

#### 1.3 Essential Hooks for Our Use Cases

| Hook | Use Case | Notes |
|------|----------|-------|
| `useDaily()` | Access call object, join/leave | Primary control hook |
| `useParticipantIds()` | List all participants | Supports filter/sort options |
| `useParticipant(id)` | Get single participant data | For rendering individual tiles |
| `useParticipantProperty()` | Get specific props (video, audio state) | Optimized re-renders |
| `useDevices()` | Camera/mic selection, enable/disable | For media controls |
| `useScreenShare()` | Instructor screen sharing | Start/stop methods |
| `useAppMessage()` | Custom messaging between participants | For instructor commands |
| `useNetwork()` | Connection quality indicators | Auto-updates stats |
| `useDailyEvent()` | Register event listeners | Auto-cleanup on unmount |

#### 1.4 Participant Video Rendering

```tsx
import { useParticipantIds, useParticipantProperty } from '@daily-co/daily-react';

function ParticipantTile({ id }) {
  const [username, videoState, audioState] = useParticipantProperty(id, [
    'user_name',
    'tracks.video.state',
    'tracks.audio.state',
  ]);
  
  return (
    <div>
      <span>{username ?? 'Guest'}</span>
      <span>📷 {videoState === 'playable' ? '✅' : '❌'}</span>
      <span>🎙️ {audioState === 'playable' ? '✅' : '❌'}</span>
    </div>
  );
}
```

#### 1.5 Muting Participants (Instructor Feature)

Instructors can mute participants using the call object:

```tsx
const daily = useDaily();

const muteParticipant = (sessionId: string) => {
  daily?.updateParticipant(sessionId, { setAudio: false });
};
```

#### 1.6 Breakout Rooms Consideration

**Finding**: Daily.co does not have native breakout room API. 

**Solution**: Create separate Daily rooms for each breakout and redirect participants:
1. Generate breakout room URLs dynamically (via API)
2. Track which participants are in which breakout
3. Provide "Return to Main Session" button that redirects back

**Alternative**: Use Daily's `subdomain` feature with multiple rooms in same domain for easier management.

### 1.7 CSP Compliance

For production deployment, ensure `avoidEval: true` is set:

```tsx
const daily = DailyIframe.createCallObject({
  dailyConfig: {
    avoidEval: true
  }
});
```

This ensures CSP compliance without requiring `unsafe-eval`.

---

## 2. Frontend Framework: Next.js 14

### Decision: Use Next.js App Router with Route Groups

**Rationale**: App Router provides better layouts, loading states, and error boundaries. Route groups organize student vs instructor paths clearly.

**Alternatives Considered**:
- **Pages Router**: Rejected - App Router is the current standard, better for layouts
- **Vite + React Router**: Rejected - Loses Vercel serverless integration benefits

### 2.1 Proposed Route Structure

```text
app/
├── layout.tsx              # Root layout with header/footer
├── page.tsx                # Main lobby (cohort grid)
├── (student)/
│   └── session/[cohortId]/
│       └── page.tsx        # Student video session view
├── (instructor)/
│   ├── login/
│   │   └── page.tsx        # Instructor login
│   └── session/[cohortId]/
│       └── page.tsx        # Instructor session with controls
└── api/
    ├── cohorts/
    │   └── route.ts        # GET cohorts (from config)
    ├── auth/
    │   └── login/
    │       └── route.ts    # POST instructor login
    └── daily/
        └── rooms/
            └── route.ts    # Daily room management (for breakouts)
```

### 2.2 Client vs Server Components

| Component Type | Use For |
|----------------|---------|
| Server Component | Lobby page, initial cohort data |
| Client Component | Video session (requires browser APIs) |
| Server Action | Auth verification, room creation |

**Critical**: Daily.js requires browser APIs. All video components MUST be client components with `'use client'` directive.

---

## 3. Styling: Tailwind CSS + Custom Theme

### Decision: Tailwind with Custom Color Palette

**Rationale**: Tailwind provides utility-first approach that matches the precise control needed for the futuristic aesthetic. Custom colors enable the teal/black/orange palette.

### 3.1 Custom Color Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'overcast': {
          black: '#0A0A0A',
          dark: '#1A1A1A',
          teal: '#00FFD1',
          'teal-dim': '#00B894',
          orange: '#FFBD17',
          white: '#FFFFFF',
          gray: '#888888',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        body: ['var(--font-body)', 'sans-serif'],
      }
    }
  }
}
```

### 3.2 Typography Approach

**Decision**: Use `next/font` for optimized font loading

Recommended fonts for futuristic aesthetic:
- **Display/Headers**: Space Grotesk, Orbitron, or Exo 2
- **Body**: Inter, DM Sans, or Outfit

**Note from Constitution**: The frontend aesthetics guidelines warn against generic fonts like Inter. Consider:
- **Recommended Primary**: Clash Display, Cabinet Grotesk, or General Sans
- **Recommended Accent**: JetBrains Mono for technical elements

### 3.3 UI Component Patterns

```tsx
// Cohort card with futuristic styling
<div className="bg-overcast-dark border border-overcast-teal/20 
                hover:border-overcast-teal transition-all duration-300
                rounded-lg overflow-hidden group">
  <div className="aspect-video relative">
    <img src={cohort.image} className="object-cover grayscale group-hover:grayscale-0" />
  </div>
  <div className="p-4">
    <h3 className="text-overcast-teal font-display uppercase tracking-wider">
      {cohort.name}
    </h3>
  </div>
</div>
```

---

## 4. Local Configuration (No Database)

### Decision: JSON Configuration File + Environment Variables

**Rationale**: Simplifies initial development and local testing. Cohort data is static and known in advance.

### 4.1 Configuration Structure

```typescript
// config/cohorts.ts
export interface CohortConfig {
  id: string;
  name: string;
  image: string;
  dailyRoomUrl: string;
  description: string;
}

export const COHORTS: CohortConfig[] = [
  {
    id: 'cohort-1',
    name: 'Cohort 1',
    image: '/images/cohort-1.jpg',
    dailyRoomUrl: process.env.DAILY_ROOM_COHORT_1!,
    description: 'AI Engineering Fundamentals'
  },
  // ... 6 cohorts total
];
```

### 4.2 Environment Variables

```env
# .env.local
DAILY_API_KEY=your_daily_api_key
DAILY_ROOM_COHORT_1=https://your-domain.daily.co/cohort-1
DAILY_ROOM_COHORT_2=https://your-domain.daily.co/cohort-2
DAILY_ROOM_COHORT_3=https://your-domain.daily.co/cohort-3
DAILY_ROOM_COHORT_4=https://your-domain.daily.co/cohort-4
DAILY_ROOM_COHORT_5=https://your-domain.daily.co/cohort-5
DAILY_ROOM_COHORT_6=https://your-domain.daily.co/cohort-6

# Instructor credentials (simple auth for local dev)
INSTRUCTOR_USERNAME=instructor
INSTRUCTOR_PASSWORD=secure_password_here
```

---

## 5. Authentication: Simple JWT for Instructor Mode

### Decision: Server-side JWT with HTTP-only Cookies

**Rationale**: Simple, secure, no external auth service needed for local development. Can be upgraded to proper auth (NextAuth.js, Clerk) later.

### 5.1 Implementation Pattern

```typescript
// app/api/auth/login/route.ts
import { cookies } from 'next/headers';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  const { username, password } = await request.json();
  
  if (username === process.env.INSTRUCTOR_USERNAME && 
      password === process.env.INSTRUCTOR_PASSWORD) {
    
    const token = await new SignJWT({ role: 'instructor' })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('4h')
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));
    
    cookies().set('instructor_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 4 * 60 * 60 // 4 hours
    });
    
    return Response.json({ success: true });
  }
  
  return Response.json({ error: 'Invalid credentials' }, { status: 401 });
}
```

---

## 6. Vercel Serverless Functions

### Decision: Use Next.js API Routes (Serverless by Default)

**Rationale**: Next.js API routes deploy as Vercel serverless functions automatically. No additional configuration needed.

### 6.1 API Endpoints Required

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/cohorts` | GET | Return cohort list from config |
| `/api/auth/login` | POST | Instructor authentication |
| `/api/auth/logout` | POST | Clear instructor session |
| `/api/auth/verify` | GET | Check if instructor token valid |
| `/api/daily/token` | POST | Generate Daily meeting token |
| `/api/daily/breakout` | POST | Create breakout room (future) |

### 6.2 Daily Meeting Tokens

For enhanced security and instructor permissions:

```typescript
// app/api/daily/token/route.ts
export async function POST(request: Request) {
  const { roomName, isInstructor, userName } = await request.json();
  
  const response = await fetch('https://api.daily.co/v1/meeting-tokens', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.DAILY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      properties: {
        room_name: roomName,
        user_name: userName,
        is_owner: isInstructor,
        enable_screenshare: isInstructor,
      }
    })
  });
  
  return Response.json(await response.json());
}
```

---

## 7. Performance Considerations

### 7.1 Video Optimization

- **Simulcast**: Enabled by default in Daily.co for adaptive quality
- **Bandwidth Saver**: Consider reducing received video quality when many participants
- **Lazy Loading**: Only render video tiles for visible participants

### 7.2 Success Criteria Alignment

| Criteria | Implementation |
|----------|---------------|
| Join session < 3 seconds | Use pre-joined state, optimize bundle |
| Video displays < 5 seconds | Daily handles this; ensure fast room URLs |
| 50 concurrent participants | Daily.co SFU handles this natively |
| Mute in 2 clicks | Control Panel always visible, direct mute button |

---

## 8. Unresolved Items → Future Scope

1. **Breakout Rooms**: Full implementation deferred - requires additional Daily rooms
2. **Recording**: Not in current scope but Daily.co supports via `useRecording()`
3. **Persistent User Accounts**: Current design uses session-only identification
4. **Analytics**: Consider Daily.co analytics API for session metrics

---

## 9. Dependencies Summary

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@daily-co/daily-react": "^0.18.0",
    "@daily-co/daily-js": "^0.62.0",
    "jotai": "^2.6.0",
    "jose": "^5.2.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "typescript": "^5.3.0",
    "@types/react": "^18.2.0"
  }
}
```

---

## 10. Research Sources

1. Daily React Documentation: https://github.com/daily-co/daily-react
2. Daily JS Documentation: https://github.com/daily-co/daily-js
3. Next.js App Router: https://nextjs.org/docs/app
4. Vercel Serverless Functions: https://vercel.com/docs/functions
5. Tailwind CSS: https://tailwindcss.com/docs

