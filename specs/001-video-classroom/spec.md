# Feature Specification: Overcast Video Classroom

**Feature Branch**: `1-video-classroom`  
**Created**: 2025-12-10  
**Status**: Clarified  
**Input**: Video-based classroom application with lobby, live video feeds, and instructor mode

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Student Joins a Cohort Session (Priority: P1)

A student visits the Overcast application and sees the main lobby displaying 6 available
cohorts. Each cohort is represented by a tile with a static image and cohort name (e.g.,
"Cohort 1", "Cohort 2"). The student clicks on a cohort tile to join that session and is
taken to a live video feed of the classroom. At any time, the student can click "Return
to Main Lobby" to leave the session and choose a different cohort.

**Why this priority**: This is the core user journey. Without the ability for students
to join and view video sessions, the application has no value.

**Independent Test**: Can be fully tested by launching the app, clicking a cohort, 
verifying video displays, and returning to lobby. Delivers the primary value of 
attending a live class.

**Acceptance Scenarios**:

1. **Given** a student on the main lobby, **When** they view the page, **Then** they 
   see 6 cohort tiles with images and labels (Cohort 1 through Cohort 6)
2. **Given** a student on the main lobby, **When** they click a cohort tile, **Then** 
   they are taken to that cohort's live video session
3. **Given** a student viewing a video session, **When** they click "Return to Main 
   Lobby", **Then** they return to the lobby and can select a different cohort
4. **Given** a student viewing a video session, **When** the video is active, **Then** 
   they see the cohort name, video feed, and session description

---

### User Story 2 - Instructor Enters Instructor Mode (Priority: P2)

An instructor visits the Overcast application and clicks the "Instructors" button in
the header. Since instructor mode requires authentication, they are prompted to enter
their username and password. After successful login, they enter Instructor mode and
see the same 6 cohort tiles but will receive enhanced controls when joining a session.

**Why this priority**: Instructors need a separate mode to access moderation tools.
This is essential for classroom management but depends on the base student flow.

**Independent Test**: Can be tested by clicking Instructors, completing login, verifying
the UI reflects instructor selection, and confirming the mode persists when navigating.

**Acceptance Scenarios**:

1. **Given** an unauthenticated user on the main lobby, **When** they click "Instructors"
   in the header, **Then** they see a login prompt requesting username and password
2. **Given** a user viewing the login prompt, **When** they enter valid credentials,
   **Then** the login succeeds and they enter Instructor mode
3. **Given** a user viewing the login prompt, **When** they enter invalid credentials,
   **Then** they see an error message and remain in Student mode
4. **Given** an authenticated instructor on the main lobby, **When** they view the page,
   **Then** they see the same 6 cohort tiles as students
5. **Given** an instructor in Instructor mode, **When** they click "Students" in the
   header, **Then** they switch back to Student mode (logout from instructor session)

---

### User Story 3 - Instructor Moderates a Session (Priority: P2)

An instructor in Instructor mode joins a cohort session and sees a Control Panel
below the video feed. The Control Panel provides moderation tools including the
ability to mute participants and start breakout rooms.

**Why this priority**: Moderation tools are critical for instructors to manage
live sessions effectively. This builds on the instructor mode foundation.

**Independent Test**: Can be tested by joining a session as instructor and verifying
Control Panel is visible with mute and breakout room options.

**Acceptance Scenarios**:

1. **Given** an instructor clicks a cohort tile, **When** they enter the session, 
   **Then** they see a Control Panel below the video feed
2. **Given** an instructor viewing the Control Panel, **When** they look at available
   controls, **Then** they see options to mute participants
3. **Given** an instructor viewing the Control Panel, **When** they look at available
   controls, **Then** they see options to start breakout rooms
4. **Given** an instructor in a session, **When** they click "Return to Main Lobby",
   **Then** they return to the lobby in Instructor mode

---

### User Story 4 - Instructor Session Persists (Priority: P3)

When an instructor authenticates and enters Instructor mode, their authenticated
session persists as they navigate between the lobby and cohort sessions. The header
shows the current mode and the instructor does not need to re-authenticate until
they explicitly switch back to Student mode (which logs them out).

**Why this priority**: Session persistence improves user experience but is not blocking
for core functionality.

**Independent Test**: Can be tested by logging in as instructor, joining a session,
returning to lobby, and verifying instructor mode is still active.

**Acceptance Scenarios**:

1. **Given** a student in a session, **When** they return to lobby, **Then** the 
   "Students" button remains selected
2. **Given** an authenticated instructor in a session, **When** they return to lobby,
   **Then** the "Instructors" button remains selected and they stay authenticated
3. **Given** an authenticated instructor, **When** they click "Students" to switch
   modes, **Then** they are logged out and return to unauthenticated Student mode

---

### Edge Cases

- What happens when a user tries to join a cohort that has no active session?
  (Show appropriate message that session is not currently live)
- What happens when video connection is lost during a session?
  (Display reconnection message and attempt to reconnect automatically)
- What happens when all 6 cohorts are at capacity?
  (Display capacity message on affected cohort tiles)
- What happens when a user has no camera/microphone permissions?
  (Allow viewing without participating; show permission prompt if needed)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a main lobby with exactly 6 cohort tiles arranged
  in a 2-column, 3-row grid layout
- **FR-002**: Each cohort tile MUST display a static image and cohort label 
  (Cohort 1 through Cohort 6)
- **FR-003**: System MUST provide a header with "Overcast" branding and 
  Students/Instructors toggle buttons
- **FR-004**: Users MUST be able to click a cohort tile to join that session's
  live video feed
- **FR-005**: The video session view MUST display the cohort name, live video feed,
  session description, and "Return to Main Lobby" button
- **FR-006**: Users MUST be able to return to the main lobby from any video session
- **FR-007**: Instructors MUST see a Control Panel when viewing a session that is
  not visible to students
- **FR-008**: The Control Panel MUST include ability to mute participants
- **FR-009**: The Control Panel MUST include ability to start breakout rooms with
  a specified group size (system randomly assigns participants)
- **FR-017**: When starting breakout rooms, instructor MUST specify the group size
- **FR-018**: System MUST randomly distribute participants into breakout rooms
- **FR-019**: Participants in breakout rooms MUST have option to return to main session
- **FR-010**: The current mode (Student/Instructor) MUST persist during navigation
- **FR-011**: All screens MUST display "Powered by the Overclock Accelerator" footer
- **FR-012**: System MUST require username/password authentication before granting
  access to Instructor mode
- **FR-013**: Unauthenticated users clicking "Instructors" MUST see a login prompt
- **FR-020**: Authenticated instructors clicking "Students" MUST be logged out and
  return to unauthenticated Student mode
- **FR-014**: Students MUST be able to broadcast their own video and audio when in a session
- **FR-015**: System MUST prompt students for camera/microphone permissions when joining
- **FR-016**: Students MUST be able to participate without camera/mic (view-only fallback)

### Key Entities

- **User**: A person using the application. Has a current mode (Student or Instructor)
- **Cohort**: A classroom grouping (1-6). Has a name, static image, and optional 
  active session
- **Session**: A live video session for a cohort. Has a video feed, description,
  and list of participants
- **Participant**: A user currently in a session. Has video/audio streams that can 
  be muted by instructors. May be in view-only mode if permissions denied
- **Breakout Room**: A sub-session created by an instructor for small group work.
  Participants are randomly assigned based on instructor-specified group size.
  Participants can return to main session at any time

## Clarifications

### Session 2025-12-10

- Q: How is instructor mode protected from unauthorized use? → A: Username/password authentication required for instructor access
- Q: Do students broadcast their own video/audio, or only watch? → A: Full participation - students have video/audio, can be muted by instructor
- Q: How are students assigned to breakout rooms? → A: Automatic random assignment into groups of specified size

## Assumptions

- Students do not need to authenticate to join sessions (public access for viewing)
- Instructors MUST authenticate with username/password to access Instructor mode
- Video streaming will use industry-standard real-time video protocols
- Cohort images are static and pre-configured by administrators
- Session descriptions are set by instructors or administrators before the session
- Breakout room functionality creates separate video rooms within a session
- Muting applies to audio only (video remains active)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can navigate from lobby to a cohort session in under 3 seconds
- **SC-002**: Video feed displays within 5 seconds of joining a session
- **SC-003**: System supports at least 50 concurrent participants per cohort session
- **SC-004**: 95% of users successfully complete the join-session flow on first attempt
- **SC-005**: Instructors can mute a participant within 2 clicks from the Control Panel
- **SC-006**: Return to lobby action completes in under 2 seconds
- **SC-007**: Mode toggle (Student/Instructor) reflects immediately in the UI
- **SC-008**: System maintains video quality during normal network conditions

