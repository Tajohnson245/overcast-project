# Tasks: Overcast Video Classroom

**Input**: Design documents from `/specs/001-video-classroom/`  
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅  
**Tests**: Manual testing only (per constitution guidelines for beginner-friendly projects)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3, US4)
- All paths relative to repository root

---

## Phase 1: Setup (Project Initialization)

**Purpose**: Initialize Next.js project with all required dependencies and configuration

- [x] T001 Initialize Next.js 14 project with TypeScript, Tailwind, ESLint, App Router in src/ directory
- [x] T002 Install Daily.co dependencies: @daily-co/daily-react, @daily-co/daily-js, jotai
- [x] T003 [P] Install authentication dependency: jose
- [x] T004 [P] Create .env.local template with Daily.co and auth placeholders per quickstart.md
- [x] T005 [P] Configure Tailwind with Overcast theme colors (teal, black, orange) in tailwind.config.ts
- [x] T006 [P] Add custom fonts (Cabinet Grotesk or similar) via next/font in src/app/layout.tsx
- [x] T007 [P] Create placeholder cohort images in public/images/cohorts/ (cohort-1.jpg through cohort-6.jpg)

**Checkpoint**: Project compiles with `npm run dev`, shows default Next.js page with Overcast styling

---

## Phase 2: Foundational (Shared Types and Configuration)

**Purpose**: Core types and configuration that all user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create TypeScript interfaces in src/types/index.ts (Cohort, User, Session, Participant, LoginRequest, LoginResponse)
- [x] T009 [P] Create cohort configuration in src/config/cohorts.ts with 6 static cohorts using env vars
- [x] T010 [P] Create global styles in src/app/globals.css with dark theme base
- [x] T011 [P] Implement root layout in src/app/layout.tsx with font loading and dark background
- [x] T012 Create Header component with "Overcast" branding and placeholder mode toggle in src/components/Header.tsx
- [x] T013 [P] Create Footer component with "Powered by the Overclock Accelerator" in src/components/Footer.tsx

**Checkpoint**: App shows header/footer shell, types are importable, cohort config returns 6 cohorts

---

## Phase 3: User Story 1 - Student Joins Cohort Session (Priority: P1) 🎯 MVP

**Goal**: Students can view lobby with 6 cohorts, click to join a video session, and return to lobby

**Independent Test**: Launch app → See 6 cohort tiles → Click one → Video displays → Click "Return to Main Lobby" → Back at lobby

### API for User Story 1

- [x] T014 [US1] Implement GET /api/cohorts endpoint in src/app/api/cohorts/route.ts
- [x] T015 [P] [US1] Implement GET /api/cohorts/[cohortId] endpoint in src/app/api/cohorts/[cohortId]/route.ts
- [x] T016 [US1] Implement POST /api/daily/token endpoint in src/app/api/daily/token/route.ts

### Components for User Story 1

- [x] T017 [P] [US1] Create CohortTile component with image, name, hover effects in src/components/CohortTile.tsx
- [x] T018 [US1] Create CohortGrid component with 2x3 layout in src/components/CohortGrid.tsx (uses CohortTile)
- [x] T019 [US1] Implement lobby page with CohortGrid in src/app/page.tsx
- [x] T020 [P] [US1] Create ParticipantTile component with video/audio display in src/components/ParticipantTile.tsx
- [x] T021 [US1] Create ParticipantGrid component for video layout in src/components/ParticipantGrid.tsx (uses ParticipantTile)
- [x] T022 [US1] Create VideoSession component with DailyProvider wrapper in src/components/VideoSession.tsx
- [x] T023 [US1] Implement session page at src/app/session/[cohortId]/page.tsx with VideoSession, "Return to Main Lobby" button

### Daily.co Integration for User Story 1

- [x] T024 [US1] Create Daily.co helper functions in src/lib/daily.ts (join room, leave room, get token)
- [x] T025 [US1] Connect VideoSession to Daily.co room using useDaily() hook
- [x] T026 [US1] Implement participant rendering with useParticipantIds() and useParticipant() hooks
- [x] T027 [US1] Add connection state handling (joining, joined, error) with user feedback

**Checkpoint**: Complete student flow works - lobby → join session → see video → return to lobby

---

## Phase 4: User Story 2 - Instructor Enters Instructor Mode (Priority: P2)

**Goal**: Instructors can authenticate via login modal and switch to Instructor mode

**Independent Test**: Click "Instructors" → See login modal → Enter credentials → Mode changes to Instructor → Click "Students" → Logged out, back to Student mode

### API for User Story 2

- [x] T028 [P] [US2] Create JWT utilities in src/lib/auth.ts (sign, verify, cookie helpers)
- [x] T029 [US2] Implement POST /api/auth/login endpoint in src/app/api/auth/login/route.ts
- [x] T030 [P] [US2] Implement POST /api/auth/logout endpoint in src/app/api/auth/logout/route.ts
- [x] T031 [P] [US2] Implement GET /api/auth/verify endpoint in src/app/api/auth/verify/route.ts

### Components for User Story 2

- [x] T032 [US2] Create useAuth hook with login, logout, verify functions in src/hooks/useAuth.ts
- [x] T033 [US2] Create LoginModal component with username/password form in src/components/LoginModal.tsx
- [x] T034 [US2] Update Header component to show Students/Instructors toggle and trigger LoginModal

### State Management for User Story 2

- [x] T035 [US2] Create user state atom with Jotai for mode tracking (student/instructor)
- [x] T036 [US2] Connect mode state to Header visual indicator
- [x] T037 [US2] Add error handling for invalid credentials in LoginModal

**Checkpoint**: Instructor login/logout works, mode toggle visible in header, mode persists in state

---

## Phase 5: User Story 3 - Instructor Moderates a Session (Priority: P2)

**Goal**: Instructors see Control Panel in session with mute and breakout room controls

**Independent Test**: Login as instructor → Join cohort → See Control Panel below video → Mute button visible → (Breakout room UI visible, basic only)

**Depends on**: User Story 2 (requires instructor mode)

### Components for User Story 3

- [ ] T038 [US3] Create ControlPanel component with mute participant button in src/components/ControlPanel.tsx
- [ ] T039 [US3] Update session page to conditionally show ControlPanel when in instructor mode
- [ ] T040 [US3] Implement mute participant functionality using daily.updateParticipant()
- [ ] T041 [US3] Add participant list in ControlPanel showing name and mute status
- [ ] T042 [P] [US3] Add breakout room UI placeholder in ControlPanel (basic group size input, future implementation)

### Integration for User Story 3

- [ ] T043 [US3] Pass instructor mode state to VideoSession component
- [ ] T044 [US3] Ensure instructor joins with owner permissions via Daily token

**Checkpoint**: Instructor sees Control Panel, can mute participants, breakout room UI visible (non-functional)

---

## Phase 6: User Story 4 - Instructor Session Persists (Priority: P3)

**Goal**: Instructor authentication persists across page navigation and refresh

**Independent Test**: Login as instructor → Join session → Return to lobby → Still in instructor mode → Refresh page → Still in instructor mode → Click "Students" → Logged out

**Depends on**: User Story 2 (requires authentication)

### Implementation for User Story 4

- [ ] T045 [US4] Add auth verification on page load in src/app/layout.tsx
- [ ] T046 [US4] Update useAuth hook to check cookie on mount and restore mode
- [ ] T047 [US4] Ensure mode persists during navigation between lobby and sessions
- [ ] T048 [US4] Verify logout clears cookie and resets to student mode

**Checkpoint**: Instructor mode persists across all navigation, refresh restores mode, logout works

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Visual polish, edge cases, and finalization

- [ ] T049 [P] Add loading states during video connection with teal pulse animation
- [ ] T050 [P] Add error states for failed connections with retry option
- [ ] T051 [P] Add "Session not live" message when cohort has no active session
- [ ] T052 [P] Add camera/microphone permission handling with view-only fallback
- [ ] T053 [P] Add responsive design for cohort grid (mobile-friendly layout)
- [ ] T054 Verify all screens have Header and Footer
- [ ] T055 [P] Add hover effects and transitions matching futuristic aesthetic
- [ ] T056 [P] Add connection status indicator in video session
- [ ] T057 Run through quickstart.md verification steps
- [ ] T058 Final visual polish pass for teal/black/orange theme consistency

---

## Dependencies & Execution Order

### Phase Dependencies

```text
Phase 1: Setup ──────────┐
                         ▼
Phase 2: Foundational ───┤ BLOCKS all user stories
                         │
         ┌───────────────┴───────────────┐
         ▼                               ▼
Phase 3: User Story 1 (P1)     Phase 4: User Story 2 (P2)
         │                               │
         │                     ┌─────────┴─────────┐
         │                     ▼                   ▼
         │            Phase 5: US3 (P2)   Phase 6: US4 (P3)
         │                     │                   │
         └──────────┬──────────┴───────────────────┘
                    ▼
         Phase 7: Polish
```

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| **US1** (P1) | Foundational | Phase 2 complete |
| **US2** (P2) | Foundational | Phase 2 complete (parallel with US1) |
| **US3** (P2) | US2 | Phase 4 complete (needs instructor mode) |
| **US4** (P3) | US2 | Phase 4 complete (needs authentication) |

### Within Each Phase

- Tasks marked [P] can run in parallel
- API routes before components that consume them
- Components before pages that use them
- All tasks in a phase complete before checkpoint validation

---

## Parallel Opportunities

### Phase 1 Parallel Tasks

```bash
# These can all run simultaneously:
- T003: Install jose
- T004: Create .env.local template
- T005: Configure Tailwind
- T006: Add custom fonts
- T007: Create placeholder images
```

### Phase 2 Parallel Tasks

```bash
# These can all run simultaneously:
- T009: Create cohort config
- T010: Create global styles
- T011: Implement root layout
- T013: Create Footer
```

### User Story Parallel Strategy

```bash
# After Phase 2, Developer A and Developer B can work in parallel:
Developer A: Phase 3 (User Story 1) - Core video functionality
Developer B: Phase 4 (User Story 2) - Authentication

# Then converge for:
Phase 5 (US3): Needs both video + auth
Phase 6 (US4): Needs auth only
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (~30 min)
2. Complete Phase 2: Foundational (~1 hr)
3. Complete Phase 3: User Story 1 (~2-3 hrs)
4. **STOP and VALIDATE**: Students can join video sessions
5. Deploy/demo if ready - this is a working MVP!

### Incremental Delivery

| Increment | What's Delivered | User Value |
|-----------|------------------|------------|
| MVP (US1) | Video lobby + sessions | Students can attend live classes |
| +US2 | Instructor login | Instructors can identify themselves |
| +US3 | Moderation controls | Instructors can manage sessions |
| +US4 | Session persistence | Smooth instructor experience |
| +Polish | Error handling, UX | Production-ready quality |

### Suggested Effort Estimates

| Phase | Estimated Time | Notes |
|-------|---------------|-------|
| Setup | 30-60 min | Mostly scaffolding |
| Foundational | 1-2 hrs | Types, config, layout shell |
| US1 (MVP) | 3-4 hrs | Core video integration |
| US2 | 2-3 hrs | Auth flow |
| US3 | 1-2 hrs | Extends US2 |
| US4 | 1 hr | Cookie persistence |
| Polish | 2-3 hrs | Edge cases, visual polish |
| **Total** | **~12-16 hrs** | Full feature complete |

---

## Notes

- [P] tasks = different files, no dependencies
- [US#] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Manual testing per constitution (no automated test tasks)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- All video components must be client components ('use client')
- Daily.co requires browser APIs - cannot be server rendered

