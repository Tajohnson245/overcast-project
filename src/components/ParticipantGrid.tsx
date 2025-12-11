'use client';

/**
 * ParticipantGrid Component
 * 
 * Displays all participants in a responsive grid layout.
 * Automatically adjusts grid columns based on participant count.
 */

import { useParticipantIds } from '@daily-co/daily-react';
import ParticipantTile from './ParticipantTile';

export default function ParticipantGrid() {
  // Get all participant IDs, with local participant first
  const participantIds = useParticipantIds({ 
    sort: 'joined_at',
  });
  
  // Determine grid columns based on participant count
  const getGridClass = () => {
    const count = participantIds.length;
    if (count === 1) return 'grid-cols-1 max-w-2xl mx-auto';
    if (count === 2) return 'grid-cols-1 md:grid-cols-2';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 6) return 'grid-cols-2 md:grid-cols-3';
    return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';
  };
  
  if (participantIds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="animate-pulse-teal text-4xl mb-4">👋</div>
        <h3 className="text-xl font-semibold text-overcast-white mb-2">
          Waiting for participants...
        </h3>
        <p className="text-overcast-gray">
          You&apos;re the first one here. Others will appear when they join.
        </p>
      </div>
    );
  }
  
  return (
    <div className={`grid gap-4 ${getGridClass()}`}>
      {participantIds.map((id) => (
        <ParticipantTile
          key={id}
          sessionId={id}
          isLocal={id === 'local'}
        />
      ))}
    </div>
  );
}

