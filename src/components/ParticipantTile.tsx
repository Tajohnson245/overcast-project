'use client';

/**
 * ParticipantTile Component
 * 
 * Displays a single participant's video tile in the session.
 * Shows video feed, name, and audio/video status indicators.
 */

import { useEffect, useRef } from 'react';
import { useParticipantProperty } from '@daily-co/daily-react';

interface ParticipantTileProps {
  /** Daily.co session ID */
  sessionId: string;
  /** Whether this is the local user */
  isLocal?: boolean;
}

export default function ParticipantTile({ sessionId, isLocal = false }: ParticipantTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Get participant properties using Daily React hooks
  const userName = useParticipantProperty(sessionId, 'user_name');
  const videoState = useParticipantProperty(sessionId, 'tracks.video.state');
  const audioState = useParticipantProperty(sessionId, 'tracks.audio.state');
  const videoTrack = useParticipantProperty(sessionId, 'tracks.video.persistentTrack');
  
  // Attach video track to video element
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !videoTrack) return;
    
    video.srcObject = new MediaStream([videoTrack]);
  }, [videoTrack]);
  
  const isVideoPlayable = videoState === 'playable';
  const isAudioPlayable = audioState === 'playable';
  const displayName = userName || 'Guest';
  
  return (
    <div className="relative aspect-video overflow-hidden rounded-lg border border-overcast-gray-dark/30 bg-overcast-dark">
      {/* Video element */}
      {isVideoPlayable ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={isLocal} // Mute local video to prevent echo
          className="h-full w-full object-cover"
        />
      ) : (
        // Placeholder when video is off
        <div className="flex h-full w-full items-center justify-center bg-overcast-dark">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-overcast-gray-dark text-2xl font-bold text-overcast-teal">
            {displayName.charAt(0).toUpperCase()}
          </div>
        </div>
      )}
      
      {/* Overlay with participant info */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-overcast-black/80 to-transparent p-3">
        <div className="flex items-center justify-between">
          {/* Name and local indicator */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-overcast-white truncate max-w-[150px]">
              {displayName}
            </span>
            {isLocal && (
              <span className="rounded bg-overcast-teal/20 px-1.5 py-0.5 text-xs text-overcast-teal">
                You
              </span>
            )}
          </div>
          
          {/* Status indicators */}
          <div className="flex items-center gap-2">
            {/* Video status */}
            <span className={`text-sm ${isVideoPlayable ? 'text-overcast-teal' : 'text-overcast-gray'}`}>
              {isVideoPlayable ? '📹' : '📷'}
            </span>
            
            {/* Audio status */}
            <span className={`text-sm ${isAudioPlayable ? 'text-overcast-teal' : 'text-red-500'}`}>
              {isAudioPlayable ? '🎙️' : '🔇'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Local indicator border */}
      {isLocal && (
        <div className="absolute inset-0 rounded-lg border-2 border-overcast-teal/50 pointer-events-none" />
      )}
    </div>
  );
}

