# Implementation Plan: Overcast Video Classroom

**Branch**: `001-video-classroom` | **Date**: 2025-12-10 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-video-classroom/spec.md`

## Summary

Build a video classroom application with 6 pre-configured cohort rooms using the Daily.co video platform. The application supports two modes: Students (view and participate) and Instructors (authenticated with moderation controls). Technical approach uses Next.js 14 App Router, Daily React SDK for video, Tailwind CSS with a futuristic black/teal/orange aesthetic, and Vercel serverless functions. No database required - cohort configuration is static.

## Technical Context

**Language/Version**: TypeScript 5.3+ with Next.js 14  
**Primary Dependencies**: @daily-co/daily-react ^0.18.0, @daily-co/daily-js ^0.62.0, jotai ^2.6.0, jose ^5.2.0  
**Storage**: N/A (static configuration files, JWT in HTTP-only cookies)  
**Testing**: Manual testing (per constitution guidelines for beginner-friendly projects)  
**Target Platform**: Modern browsers (Chrome, Firefox, Safari, Edge) via Vercel deployment  
**Project Type**: Web application (single Next.js project)  
**Performance Goals**: Video display <5s, session join <3s, mute action <2 clicks  
**Constraints**: Support 50 concurrent participants per cohort, maintain video quality  
**Scale/Scope**: 6 cohorts, ~300 total concurrent users across all cohorts

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-checked after Phase 1 design.*

### Pre-Design Check ✅

| Principle | Evaluation | Status |
|-----------|------------|--------|
| **I. Simplicity First** | Single Next.js project, no database, minimal abstractions | ✅ Pass |
| **II. Readability Over Cleverness** | Using well-documented Daily React hooks, clear component structure | ✅ Pass |
| **III. Comprehensive Comments** | Plan includes clear purpose for each file and component | ✅ Pass |
| **IV. Beginner Accessibility** | Using standard React patterns, no metaprogramming, explicit state | ✅ Pass |
| **V. File Minimization** | Consolidated structure, components grouped logically | ✅ Pass |

### Post-Design Check ✅

| Principle | Evaluation | Status |
|-----------|------------|--------|
| **I. Simplicity First** | No factory patterns, no abstract classes, direct implementations | ✅ Pass |
| **II. Readability Over Cleverness** | All Daily.co hooks are officially documented with clear APIs | ✅ Pass |
| **III. Comprehensive Comments** | Data model includes rationale, types are documented | ✅ Pass |
| **IV. Beginner Accessibility** | Links to Daily.co docs included in research, standard REST patterns | ✅ Pass |
| **V. File Minimization** | ~15 total files for full feature, types consolidated | ✅ Pass |

## Project Structure

### Documentation (this feature)

```text
specs/001-video-classroom/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # Phase 0 research findings
├── data-model.md        # Entity definitions
├── quickstart.md        # Setup guide
├── contracts/
│   └── api.yaml         # OpenAPI 3.0 specification
└── tasks.md             # Phase 2 output (created by /speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx           # Root layout with fonts and theme
│   ├── page.tsx             # Main lobby (cohort grid)
│   ├── globals.css          # Global styles, Tailwind base
│   ├── session/
│   │   └── [cohortId]/
│   │       └── page.tsx     # Video session page (student + instructor)
│   └── api/
│       ├── cohorts/
│       │   └── route.ts     # GET /api/cohorts
│       ├── auth/
│       │   ├── login/
│       │   │   └── route.ts # POST /api/auth/login
│       │   ├── logout/
│       │   │   └── route.ts # POST /api/auth/logout
│       │   └── verify/
│       │       └── route.ts # GET /api/auth/verify
│       └── daily/
│           └── token/
│               └── route.ts # POST /api/daily/token
├── components/
│   ├── Header.tsx           # Navigation with Students/Instructors toggle
│   ├── Footer.tsx           # "Powered by the Overclock Accelerator"
│   ├── CohortGrid.tsx       # 2x3 grid of cohort tiles
│   ├── CohortTile.tsx       # Individual cohort card with hover effects
│   ├── VideoSession.tsx     # DailyProvider wrapper + video container
│   ├── ParticipantGrid.tsx  # Grid of participant video tiles
│   ├── ParticipantTile.tsx  # Single participant video with name/status
│   ├── ControlPanel.tsx     # Instructor mute/breakout controls
│   └── LoginModal.tsx       # Instructor authentication modal
├── config/
│   └── cohorts.ts           # Static cohort configuration
├── hooks/
│   └── useAuth.ts           # Authentication state hook
├── lib/
│   ├── daily.ts             # Daily.co helper functions
│   └── auth.ts              # JWT sign/verify utilities
└── types/
    └── index.ts             # All TypeScript interfaces

public/
└── images/
    └── cohorts/             # Static cohort images (cohort-1.jpg through cohort-6.jpg)
```

**Structure Decision**: Single Next.js application with App Router. All video-related components are client components. API routes serve as Vercel serverless functions. No separate backend service needed.

## Key Technical Decisions

### 1. Video Platform: Daily.co with daily-react

Using the `@daily-co/daily-react` library for React integration instead of raw `daily-js`. The hook-based API (`useDaily`, `useParticipantIds`, `useParticipant`) aligns with modern React patterns.

**Key hooks used**:
- `DailyProvider`: Wraps video session pages
- `useDaily()`: Access to call object for join/leave
- `useParticipantIds()`: List participants with filter/sort
- `useParticipantProperty()`: Optimized access to specific participant data
- `useDevices()`: Camera/microphone management
- `useDailyEvent()`: Event listener with auto-cleanup

### 2. Authentication: Simple JWT

For local development, using environment variable credentials with JWT tokens stored in HTTP-only cookies. The `jose` library handles JWT operations without requiring Node.js crypto polyfills.

### 3. No Database

Cohort configuration stored in TypeScript files. Instructor credentials in environment variables. User state managed client-side with Jotai atoms.

### 4. Visual Identity

Implementing the futuristic aesthetic with:
- **Colors**: Black (#0A0A0A) background, Teal (#00FFD1) accents, Orange (#FFBD17) highlights
- **Typography**: Bold geometric sans-serif (Cabinet Grotesk or similar)
- **Effects**: Subtle hover transitions, grayscale-to-color images, grid patterns

## Complexity Tracking

> No violations requiring justification. Design follows constitution principles.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *None identified* | — | — |

## Implementation Priorities

Based on spec priorities:

| Priority | Story | Implementation Focus |
|----------|-------|---------------------|
| P1 | Student joins cohort session | Lobby, CohortTile, VideoSession, ParticipantGrid |
| P2 | Instructor authentication | LoginModal, useAuth, API auth routes |
| P2 | Instructor moderation | ControlPanel, mute functionality |
| P3 | Session persistence | Cookie-based token refresh, state restoration |

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| Daily.co rate limits | Use meeting tokens, cache participant data |
| Browser permissions | Clear permission prompts, view-only fallback |
| Network instability | Daily.co handles reconnection, show status indicators |
| Breakout room complexity | Deferred to future scope, basic implementation only |

## Artifacts Generated

- ✅ `research.md` - Daily.co integration patterns, tech decisions
- ✅ `data-model.md` - Entity definitions (Cohort, User, Session, Participant)
- ✅ `contracts/api.yaml` - OpenAPI 3.0 specification
- ✅ `quickstart.md` - Local development setup guide
- ⏳ `tasks.md` - Created by `/speckit.tasks` command (not this plan)

## Next Steps

1. Run `/speckit.tasks` to generate implementation tasks
2. Initialize Next.js project following quickstart.md
3. Implement P1 features (student video session flow)
4. Add P2 features (instructor mode)
5. Polish P3 features (session persistence)
