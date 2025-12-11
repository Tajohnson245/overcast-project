'use client';

/**
 * Header Component
 * 
 * Navigation header with:
 * - Overcast branding
 * - Students/Instructors mode toggle
 * - Visual indicator for current mode
 * - Login modal integration for instructor auth
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import LoginModal from './LoginModal';

export default function Header() {
  const { 
    mode, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    logout, 
    verify,
    clearError 
  } = useAuth();
  
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  // Verify auth status on mount
  useEffect(() => {
    verify();
  }, [verify]);
  
  // Handle student button click
  const handleStudentClick = async () => {
    if (mode === 'instructor' && isAuthenticated) {
      // Switching from instructor to student logs out
      await logout();
    }
  };

  // Handle instructor button click
  const handleInstructorClick = () => {
    if (mode === 'student') {
      if (isAuthenticated) {
        // Shouldn't happen, but handle gracefully
        // Already authenticated somehow, just verify
        verify();
      } else {
        // Need to login - show modal
        setIsLoginModalOpen(true);
      }
    }
  };
  
  // Handle login submission
  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    const success = await login(username, password);
    if (success) {
      setIsLoginModalOpen(false);
    }
    return success;
  };
  
  // Handle modal close
  const handleModalClose = () => {
    setIsLoginModalOpen(false);
    clearError();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-overcast-gray-dark/30 bg-overcast-black/90 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo / Branding */}
          <div className="flex items-center gap-2">
            <div className="relative">
              {/* Glow effect behind logo */}
              <div className="absolute -inset-1 rounded-lg bg-overcast-teal/20 blur-sm" />
              <h1 className="relative text-2xl font-bold tracking-tight">
                <span className="text-overcast-teal">OVER</span>
                <span className="text-overcast-white">CAST</span>
              </h1>
            </div>
            <span className="hidden text-xs uppercase tracking-widest text-overcast-gray sm:inline">
              Video Classroom
            </span>
          </div>

          {/* Mode Toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-overcast-gray-dark/50 bg-overcast-dark p-1">
            {/* Students Button */}
            <button
              onClick={handleStudentClick}
              className={`
                relative rounded-md px-4 py-2 text-sm font-medium transition-all duration-200
                ${mode === 'student'
                  ? 'bg-overcast-teal text-overcast-black'
                  : 'text-overcast-gray hover:text-overcast-white'
                }
              `}
              aria-pressed={mode === 'student'}
            >
              Students
              {mode === 'student' && (
                <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-overcast-black/30" />
              )}
            </button>

            {/* Instructors Button */}
            <button
              onClick={handleInstructorClick}
              className={`
                relative rounded-md px-4 py-2 text-sm font-medium transition-all duration-200
                ${mode === 'instructor'
                  ? 'bg-overcast-orange text-overcast-black'
                  : 'text-overcast-gray hover:text-overcast-white'
                }
              `}
              aria-pressed={mode === 'instructor'}
            >
              Instructors
              {mode === 'instructor' && (
                <span className="absolute -bottom-0.5 left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-overcast-black/30" />
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={handleModalClose}
        onLogin={handleLogin}
        isLoading={isLoading}
        error={error}
      />
    </>
  );
}

