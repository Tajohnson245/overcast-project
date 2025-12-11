'use client';

/**
 * ControlPanel Component
 * 
 * Instructor-only control panel displayed below the video session.
 * Features:
 * - List of participants with mute controls
 * - Breakout room UI placeholder (future implementation)
 * - Mute all functionality
 */

import { useState } from 'react';
import { useDaily, useParticipantIds, useParticipantProperty } from '@daily-co/daily-react';

/**
 * Individual participant row with mute controls
 */
function ParticipantRow({ sessionId }: { sessionId: string }) {
  const daily = useDaily();
  const userName = useParticipantProperty(sessionId, 'user_name');
  const audioState = useParticipantProperty(sessionId, 'tracks.audio.state');
  const isLocal = useParticipantProperty(sessionId, 'local');
  const isOwner = useParticipantProperty(sessionId, 'owner');
  
  const isMuted = audioState !== 'playable';
  const displayName = userName || 'Guest';
  
  const handleToggleMute = () => {
    if (!daily || isLocal) return;
    
    // Toggle the participant's audio
    daily.updateParticipant(sessionId, {
      setAudio: isMuted, // If muted, unmute; if unmuted, mute
    });
  };
  
  return (
    <div className="flex items-center justify-between rounded-lg bg-overcast-dark/50 px-3 py-2">
      <div className="flex items-center gap-2">
        {/* Status indicator */}
        <span 
          className={`h-2 w-2 rounded-full ${isMuted ? 'bg-red-500' : 'bg-green-500'}`} 
        />
        
        {/* Name */}
        <span className="text-sm text-overcast-white truncate max-w-[150px]">
          {displayName}
        </span>
        
        {/* Badges */}
        {isLocal && (
          <span className="rounded bg-overcast-teal/20 px-1.5 py-0.5 text-xs text-overcast-teal">
            You
          </span>
        )}
        {isOwner && !isLocal && (
          <span className="rounded bg-overcast-orange/20 px-1.5 py-0.5 text-xs text-overcast-orange">
            Instructor
          </span>
        )}
      </div>
      
      {/* Mute button (only show for non-local participants) */}
      {!isLocal && (
        <button
          onClick={handleToggleMute}
          className={`rounded px-2 py-1 text-xs font-medium transition-colors ${
            isMuted
              ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
              : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
          }`}
        >
          {isMuted ? 'Unmute' : 'Mute'}
        </button>
      )}
    </div>
  );
}

/**
 * Breakout room placeholder section
 */
function BreakoutRoomSection() {
  const [groupSize, setGroupSize] = useState(4);
  
  return (
    <div className="rounded-lg border border-overcast-gray-dark/30 p-4">
      <h4 className="font-medium text-overcast-white mb-3">
        Breakout Rooms
        <span className="ml-2 text-xs text-overcast-gray">(Coming Soon)</span>
      </h4>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm text-overcast-gray mb-1">
            Group Size
          </label>
          <input
            type="number"
            min={2}
            max={10}
            value={groupSize}
            onChange={(e) => setGroupSize(parseInt(e.target.value) || 4)}
            className="w-24 rounded border border-overcast-gray-dark bg-overcast-black px-3 py-1 text-sm text-overcast-white"
            disabled
          />
        </div>
        
        <button
          disabled
          className="rounded-lg bg-overcast-gray-dark px-4 py-2 text-sm font-medium text-overcast-gray cursor-not-allowed"
        >
          Start Breakout Rooms
        </button>
        
        <p className="text-xs text-overcast-gray">
          Breakout room functionality will be available in a future update.
        </p>
      </div>
    </div>
  );
}

export default function ControlPanel() {
  const daily = useDaily();
  const participantIds = useParticipantIds({ sort: 'joined_at' });
  
  // Mute all non-local participants
  const handleMuteAll = () => {
    if (!daily) return;
    
    participantIds.forEach((id) => {
      if (id !== 'local') {
        daily.updateParticipant(id, { setAudio: false });
      }
    });
  };
  
  // Count muted vs unmuted
  const remoteParticipantCount = participantIds.filter(id => id !== 'local').length;
  
  return (
    <div className="rounded-xl border border-overcast-orange/30 bg-overcast-dark/50 p-4 mt-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-overcast-orange animate-pulse" />
          <h3 className="text-lg font-semibold text-overcast-orange">
            Instructor Control Panel
          </h3>
        </div>
        
        {remoteParticipantCount > 0 && (
          <button
            onClick={handleMuteAll}
            className="rounded-lg bg-red-500/20 px-3 py-1.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/30"
          >
            Mute All
          </button>
        )}
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Participants Section */}
        <div>
          <h4 className="font-medium text-overcast-white mb-3">
            Participants ({participantIds.length})
          </h4>
          
          {participantIds.length === 0 ? (
            <p className="text-sm text-overcast-gray">
              No participants in the session yet.
            </p>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {participantIds.map((id) => (
                <ParticipantRow key={id} sessionId={id} />
              ))}
            </div>
          )}
        </div>
        
        {/* Breakout Room Section */}
        <BreakoutRoomSection />
      </div>
    </div>
  );
}

