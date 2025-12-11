'use client';

/**
 * Video Session Page
 * 
 * Displays the video session for a specific cohort.
 * Includes:
 * - Cohort name and description
 * - Video session with all participants
 * - Return to lobby button
 */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import VideoSession from '@/components/VideoSession';
import type { Cohort } from '@/types';

export default function SessionPage() {
  const params = useParams();
  const router = useRouter();
  const cohortId = params.cohortId as string;
  
  const [cohort, setCohort] = useState<Omit<Cohort, 'dailyRoomUrl'> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch cohort details
  useEffect(() => {
    async function fetchCohort() {
      try {
        const response = await fetch(`/api/cohorts/${cohortId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Cohort not found');
          } else {
            setError('Failed to load cohort');
          }
          return;
        }
        
        const data = await response.json();
        setCohort(data);
      } catch (err) {
        console.error('Failed to fetch cohort:', err);
        setError('Failed to load cohort');
      } finally {
        setLoading(false);
      }
    }
    
    fetchCohort();
  }, [cohortId]);
  
  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-overcast-teal border-t-transparent mb-4" />
          <p className="text-overcast-gray">Loading session...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error || !cohort) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="text-4xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-overcast-white mb-2">
            {error || 'Session Not Found'}
          </h2>
          <p className="text-overcast-gray mb-6">
            This cohort session may not be available right now.
          </p>
          <Link
            href="/"
            className="rounded-lg bg-overcast-teal px-6 py-3 font-medium text-overcast-black transition-colors hover:bg-overcast-teal-dim"
          >
            Return to Main Lobby
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Session Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-overcast-teal md:text-3xl">
            {cohort.name}
          </h1>
          <p className="mt-1 text-overcast-gray">
            {cohort.description}
          </p>
        </div>
        
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-lg border border-overcast-gray-dark px-4 py-2 text-sm font-medium text-overcast-white transition-colors hover:border-overcast-teal hover:text-overcast-teal"
        >
          <svg 
            className="h-4 w-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M10 19l-7-7m0 0l7-7m-7 7h18" 
            />
          </svg>
          Return to Main Lobby
        </Link>
      </div>
      
      {/* Video Session */}
      <div className="rounded-xl border border-overcast-gray-dark/30 bg-overcast-dark/30 p-4 md:p-6">
        <VideoSession
          cohortId={cohort.id}
          cohortName={cohort.name}
        />
      </div>
      
      {/* Session Footer */}
      <div className="mt-6 text-center text-sm text-overcast-gray">
        <p>
          Having trouble? Try refreshing the page or checking your camera/microphone permissions.
        </p>
      </div>
    </div>
  );
}

