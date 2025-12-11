# Quickstart Guide: Overcast Video Classroom

**Feature**: 001-video-classroom  
**Date**: 2025-12-10

## Prerequisites

Before starting, ensure you have:

- **Node.js 18.17+** (LTS recommended)
- **npm** or **yarn** package manager
- **Daily.co account** with 6 pre-created rooms
- **Git** for version control

## 1. Project Setup

### Initialize Next.js Project

```bash
# Create new Next.js project with TypeScript and Tailwind
npx create-next-app@latest overcast-classroom --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd overcast-classroom
```

### Install Dependencies

```bash
# Daily.co video SDK and peer dependencies
npm install @daily-co/daily-react @daily-co/daily-js jotai

# JWT handling for authentication
npm install jose

# Development utilities (optional)
npm install -D @types/node
```

## 2. Environment Configuration

### Create Environment File

Create `.env.local` in the project root:

```env
# Daily.co Configuration
DAILY_API_KEY=your_daily_api_key_here
DAILY_DOMAIN=your-domain

# Pre-configured room URLs (create these in Daily.co dashboard)
DAILY_ROOM_COHORT_1=https://your-domain.daily.co/cohort-1
DAILY_ROOM_COHORT_2=https://your-domain.daily.co/cohort-2
DAILY_ROOM_COHORT_3=https://your-domain.daily.co/cohort-3
DAILY_ROOM_COHORT_4=https://your-domain.daily.co/cohort-4
DAILY_ROOM_COHORT_5=https://your-domain.daily.co/cohort-5
DAILY_ROOM_COHORT_6=https://your-domain.daily.co/cohort-6

# Instructor Authentication (change for production!)
INSTRUCTOR_USERNAME=instructor
INSTRUCTOR_PASSWORD=your_secure_password_min_8_chars

# JWT Secret (generate a random 32+ character string)
JWT_SECRET=your_random_secret_key_at_least_32_characters_long

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Get Daily.co API Key

1. Create account at [daily.co](https://www.daily.co/)
2. Navigate to Dashboard → Developers → API Keys
3. Copy your API key to `.env.local`

### Create Daily.co Rooms

For local development, create 6 rooms in your Daily.co dashboard:
- `cohort-1` through `cohort-6`
- Set privacy to "public" for testing
- Copy the full room URLs to `.env.local`

## 3. Tailwind Configuration

Update `tailwind.config.ts` with the Overcast theme:

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        overcast: {
          black: '#0A0A0A',
          dark: '#1A1A1A',
          teal: '#00FFD1',
          'teal-dim': '#00B894',
          orange: '#FFBD17',
          white: '#FFFFFF',
          gray: '#888888',
          'gray-dark': '#333333',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      animation: {
        'pulse-teal': 'pulse-teal 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fade-in 0.5s ease-out',
      },
      keyframes: {
        'pulse-teal': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
```

## 4. Project Structure

Create the following directory structure:

```text
src/
├── app/
│   ├── layout.tsx           # Root layout with fonts
│   ├── page.tsx             # Main lobby
│   ├── globals.css          # Global styles
│   ├── session/
│   │   └── [cohortId]/
│   │       └── page.tsx     # Video session page
│   └── api/
│       ├── cohorts/
│       │   └── route.ts     # GET cohorts
│       ├── auth/
│       │   ├── login/
│       │   │   └── route.ts # POST login
│       │   ├── logout/
│       │   │   └── route.ts # POST logout
│       │   └── verify/
│       │       └── route.ts # GET verify
│       └── daily/
│           └── token/
│               └── route.ts # POST token
├── components/
│   ├── Header.tsx           # Navigation with mode toggle
│   ├── Footer.tsx           # "Powered by Overclock"
│   ├── CohortGrid.tsx       # 6-tile cohort display
│   ├── CohortTile.tsx       # Individual cohort card
│   ├── VideoSession.tsx     # Main video container
│   ├── ParticipantGrid.tsx  # Video tile grid
│   ├── ParticipantTile.tsx  # Individual participant
│   ├── ControlPanel.tsx     # Instructor controls
│   └── LoginModal.tsx       # Instructor auth modal
├── config/
│   └── cohorts.ts           # Cohort configuration
├── hooks/
│   └── useAuth.ts           # Authentication hook
├── lib/
│   ├── daily.ts             # Daily.co utilities
│   └── auth.ts              # JWT helpers
└── types/
    └── index.ts             # TypeScript interfaces
```

## 5. Quick Verification Steps

### Start Development Server

```bash
npm run dev
```

### Verify Setup

1. **Homepage loads**: Visit `http://localhost:3000`
2. **Cohorts display**: Should see 6 cohort tiles (or placeholders)
3. **API works**: Visit `http://localhost:3000/api/cohorts`
4. **Video connects**: Click a cohort to join session

### Common Issues

| Issue | Solution |
|-------|----------|
| "Daily is not defined" | Ensure `@daily-co/daily-js` is installed |
| Video not loading | Check Daily room URLs in `.env.local` |
| Auth not working | Verify JWT_SECRET is set |
| CORS errors | Daily.co handles CORS; check room settings |

## 6. Development Workflow

### Running Locally

```bash
# Start development server with hot reload
npm run dev

# Build for production
npm run build

# Run production build locally
npm start

# Lint and format
npm run lint
```

### Testing Video

1. Open the app in two browser windows
2. Join the same cohort from both
3. You should see yourself in both windows
4. Test mute/unmute and camera toggle

### Testing Instructor Mode

1. Click "Instructors" button in header
2. Enter credentials from `.env.local`
3. Join a cohort session
4. Verify Control Panel appears below video

## 7. Deployment to Vercel

### Quick Deploy

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts to link project
```

### Environment Variables

Add all `.env.local` variables to Vercel:
1. Project Settings → Environment Variables
2. Add each variable
3. Redeploy for changes to take effect

## 8. Next Steps

After completing setup:

1. **Implement lobby page** with CohortGrid component
2. **Add video session** with Daily.co integration
3. **Build instructor controls** for muting participants
4. **Style with Tailwind** using the futuristic theme
5. **Test end-to-end** with multiple users

---

## Quick Reference

### Key Files to Edit First

| Priority | File | Purpose |
|----------|------|---------|
| 1 | `src/config/cohorts.ts` | Define cohort data |
| 2 | `src/app/page.tsx` | Lobby UI |
| 3 | `src/components/CohortTile.tsx` | Cohort card design |
| 4 | `src/app/session/[cohortId]/page.tsx` | Video session |
| 5 | `src/components/VideoSession.tsx` | Daily.co integration |

### Useful Commands

```bash
# Generate Daily.co meeting token (for testing)
curl -X POST https://api.daily.co/v1/meeting-tokens \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"properties":{"room_name":"cohort-1"}}'

# Check Daily room exists
curl https://api.daily.co/v1/rooms/cohort-1 \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### Documentation Links

- [Daily.co React Docs](https://docs.daily.co/reference/daily-react)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Jotai State Management](https://jotai.org/docs/introduction)

