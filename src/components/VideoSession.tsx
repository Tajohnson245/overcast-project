'use client';

/**
 * VideoSession Component
 * 
 * Main video session container that:
 * - Wraps content with DailyProvider for Daily.co integration
 * - Manages connection state (joining, joined, error)
 * - Handles joining and leaving the room
 * - Renders participant grid
 */

import { useEffect, useState, useCallback } from 'react';
import { DailyProvider, useDaily, useDailyEvent } from '@daily-co/daily-react';
import DailyIframe from '@daily-co/daily-js';
import ParticipantGrid from './ParticipantGrid';
import ControlPanel from './ControlPanel';
import { getDailyToken, generateGuestName } from '@/lib/daily';
import type { ConnectionState } from '@/types';

interface VideoSessionProps {
  /** Cohort ID to join */
  cohortId: string;
  /** Cohort display name */
  cohortName: string;
  /** Optional user display name */
  userName?: string;
  /** Whether user is an instructor */
  isInstructor?: boolean;
}

/**
 * Inner component that has access to Daily.co hooks
 */
function VideoSessionInner({ 
  cohortId, 
  cohortName,
  userName,
  isInstructor = false,
}: VideoSessionProps) {
  const daily = useDaily();
  const [connectionState, setConnectionState] = useState<ConnectionState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [isViewOnly, setIsViewOnly] = useState(false);
  
  // Handle joining the room
  const joinRoom = useCallback(async (viewOnly = false) => {
    if (!daily || connectionState !== 'idle') return;
    
    setConnectionState('joining');
    setError(null);
    setIsViewOnly(viewOnly);
    
    try {
      // Get meeting token from our API
      const displayName = userName || generateGuestName();
      const { token, roomUrl } = await getDailyToken(cohortId, displayName, isInstructor);
      
      // Join the Daily.co room with appropriate settings
      await daily.join({
        url: roomUrl,
        token,
        userName: displayName,
        // If view-only, disable camera and mic from the start
        startVideoOff: viewOnly,
        startAudioOff: viewOnly,
      });
      
      setConnectionState('joined');
    } catch (err) {
      console.error('Failed to join room:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to join room';
      
      // Check if it's a permission error
      if (errorMessage.toLowerCase().includes('permission') || 
          errorMessage.toLowerCase().includes('notallowed')) {
        setError('Camera/microphone access denied. You can join in view-only mode.');
      } else if (errorMessage.toLowerCase().includes('not found') ||
                 errorMessage.toLowerCase().includes('room')) {
        setError('This session is not currently live. Please try again later.');
      } else {
        setError(errorMessage);
      }
      setConnectionState('error');
    }
  }, [daily, cohortId, userName, isInstructor, connectionState]);
  
  // Handle leaving the room
  const leaveRoom = useCallback(async () => {
    if (!daily || connectionState !== 'joined') return;
    
    setConnectionState('leaving');
    
    try {
      await daily.leave();
      setConnectionState('idle');
    } catch (err) {
      console.error('Failed to leave room:', err);
      setConnectionState('idle');
    }
  }, [daily, connectionState]);
  
  // Listen for Daily.co events
  useDailyEvent('joined-meeting', () => {
    setConnectionState('joined');
  });
  
  useDailyEvent('left-meeting', () => {
    setConnectionState('idle');
  });
  
  useDailyEvent('error', (event) => {
    console.error('Daily.co error:', event);
    setError(event?.error?.message || 'An error occurred');
    setConnectionState('error');
  });
  
  // Auto-join when component mounts
  useEffect(() => {
    if (connectionState === 'idle' && daily) {
      joinRoom();
    }
  }, [daily, connectionState, joinRoom]);
  
  // Render based on connection state
  if (connectionState === 'joining') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-overcast-teal border-t-transparent mb-4" />
        <h3 className="text-xl font-semibold text-overcast-white mb-2">
          Joining {cohortName}...
        </h3>
        <p className="text-overcast-gray">
          Please allow camera and microphone access when prompted.
        </p>
      </div>
    );
  }
  
  if (connectionState === 'error') {
    const isPermissionError = error?.toLowerCase().includes('permission') || 
                               error?.toLowerCase().includes('denied') ||
                               error?.toLowerCase().includes('view-only');
    
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="text-4xl mb-4">{isPermissionError ? '📷' : '⚠️'}</div>
        <h3 className="text-xl font-semibold text-red-400 mb-2">
          {isPermissionError ? 'Camera/Mic Access Required' : 'Connection Error'}
        </h3>
        <p className="text-overcast-gray mb-4 text-center max-w-md">
          {error || 'Failed to connect to the session.'}
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => {
              setConnectionState('idle');
              setError(null);
            }}
            className="rounded-lg bg-overcast-teal px-4 py-2 font-medium text-overcast-black transition-colors hover:bg-overcast-teal-dim"
          >
            Try Again
          </button>
          {isPermissionError && (
            <button
              onClick={() => {
                setConnectionState('idle');
                setError(null);
                // Join in view-only mode
                setTimeout(() => joinRoom(true), 100);
              }}
              className="rounded-lg border border-overcast-gray-dark px-4 py-2 font-medium text-overcast-white transition-colors hover:border-overcast-teal"
            >
              Join View-Only
            </button>
          )}
        </div>
      </div>
    );
  }
  
  if (connectionState === 'leaving') {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-overcast-gray border-t-transparent mb-4" />
        <h3 className="text-xl font-semibold text-overcast-white">
          Leaving session...
        </h3>
      </div>
    );
  }
  
  // Joined state - show participant grid
  return (
    <div className="space-y-6">
      {/* Connection status bar */}
      <div className="flex items-center justify-between rounded-lg bg-overcast-dark/50 px-4 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-sm text-overcast-gray">Connected to {cohortName}</span>
          {isInstructor && (
            <span className="rounded bg-overcast-orange/20 px-2 py-0.5 text-xs text-overcast-orange">
              Instructor Mode
            </span>
          )}
          {isViewOnly && (
            <span className="rounded bg-overcast-gray-dark px-2 py-0.5 text-xs text-overcast-gray">
              View Only
            </span>
          )}
        </div>
        <button
          onClick={leaveRoom}
          className="text-sm text-overcast-gray hover:text-overcast-white transition-colors"
        >
          Leave quietly
        </button>
      </div>
      
      {/* Participant video grid */}
      <ParticipantGrid />
      
      {/* Instructor Control Panel */}
      {isInstructor && <ControlPanel />}
    </div>
  );
}

/**
 * Main VideoSession component that wraps with DailyProvider
 */
export default function VideoSession(props: VideoSessionProps) {
  const [callObject, setCallObject] = useState<ReturnType<typeof DailyIframe.createCallObject> | null>(null);
  
  // Create call object on mount
  useEffect(() => {
    const newCallObject = DailyIframe.createCallObject({
      dailyConfig: {
        // CSP-friendly mode
        avoidEval: true,
      },
    });
    
    setCallObject(newCallObject);
    
    // Cleanup on unmount
    return () => {
      newCallObject.destroy();
    };
  }, []);
  
  if (!callObject) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-overcast-teal border-t-transparent" />
      </div>
    );
  }
  
  return (
    <DailyProvider callObject={callObject}>
      <VideoSessionInner {...props} />
    </DailyProvider>
  );
}

