/**
 * Main Lobby Page
 * 
 * Displays the 6 cohort tiles in a grid layout.
 * Students click a cohort to join that session.
 */

import CohortGrid from '@/components/CohortGrid';
import { getAllCohorts } from '@/config/cohorts';

export default function LobbyPage() {
  // Get cohorts from configuration (server-side)
  const cohorts = getAllCohorts();
  
  // Remove dailyRoomUrl from client-facing data
  const publicCohorts = cohorts.map(({ dailyRoomUrl, ...cohort }) => cohort);
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
          <span className="text-overcast-white">AI Engineering</span>
          <br />
          <span className="text-overcast-teal">Accelerator</span>
        </h1>
        <p className="mt-4 text-lg text-overcast-gray max-w-2xl mx-auto">
          Join a live cohort session to learn cutting-edge AI engineering skills 
          with expert instructors and fellow engineers.
        </p>
        
        {/* Status indicator */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-overcast-dark px-4 py-2 text-sm">
          <span className="h-2 w-2 rounded-full bg-overcast-teal animate-pulse" />
          <span className="text-overcast-gray">
            <span className="text-overcast-white font-medium">6</span> cohorts available
          </span>
        </div>
      </div>
      
      {/* Cohort Grid */}
      <section aria-label="Available Cohorts">
        <CohortGrid cohorts={publicCohorts} />
      </section>
      
      {/* Instructions */}
      <div className="mt-12 text-center text-sm text-overcast-gray">
        <p>
          Click on a cohort tile to join the live video session.
          <br />
          Make sure your camera and microphone are ready.
        </p>
      </div>
    </div>
  );
}
