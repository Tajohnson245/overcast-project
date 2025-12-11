'use client';

/**
 * LoginModal Component
 * 
 * Modal dialog for instructor authentication.
 * Features:
 * - Username/password form
 * - Error handling and display
 * - Loading state
 * - Keyboard accessible (Escape to close)
 */

import { useState, useEffect, useCallback } from 'react';

interface LoginModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** Callback when login is attempted */
  onLogin: (username: string, password: string) => Promise<boolean>;
  /** Whether login is in progress */
  isLoading?: boolean;
  /** Error message to display */
  error?: string | null;
}

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
  isLoading = false,
  error = null,
}: LoginModalProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);
  
  // Display either prop error or local validation error
  const displayError = error || localError;
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    
    // Basic validation
    if (!username.trim()) {
      setLocalError('Username is required');
      return;
    }
    if (!password) {
      setLocalError('Password is required');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }
    
    const success = await onLogin(username, password);
    
    if (success) {
      // Clear form and close modal
      setUsername('');
      setPassword('');
      onClose();
    }
  };
  
  // Handle escape key
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      onClose();
    }
  }, [isOpen, onClose]);
  
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
  
  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setUsername('');
      setPassword('');
      setLocalError(null);
    }
  }, [isOpen]);
  
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-overcast-black/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="relative w-full max-w-md mx-4 rounded-xl border border-overcast-gray-dark bg-overcast-dark p-6 shadow-2xl animate-fade-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-overcast-gray hover:text-overcast-white transition-colors"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        {/* Header */}
        <div className="mb-6">
          <h2 id="login-title" className="text-2xl font-bold text-overcast-white">
            Instructor Login
          </h2>
          <p className="mt-1 text-sm text-overcast-gray">
            Enter your credentials to access instructor mode.
          </p>
        </div>
        
        {/* Error message */}
        {displayError && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-sm text-red-400">
            {displayError}
          </div>
        )}
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label 
              htmlFor="username" 
              className="block text-sm font-medium text-overcast-gray mb-1"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-overcast-gray-dark bg-overcast-black px-4 py-2 text-overcast-white placeholder-overcast-gray focus:border-overcast-teal focus:outline-none focus:ring-1 focus:ring-overcast-teal disabled:opacity-50"
              placeholder="Enter username"
              autoComplete="username"
            />
          </div>
          
          {/* Password */}
          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-overcast-gray mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="w-full rounded-lg border border-overcast-gray-dark bg-overcast-black px-4 py-2 text-overcast-white placeholder-overcast-gray focus:border-overcast-teal focus:outline-none focus:ring-1 focus:ring-overcast-teal disabled:opacity-50"
              placeholder="Enter password"
              autoComplete="current-password"
            />
          </div>
          
          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-lg bg-overcast-orange px-4 py-3 font-medium text-overcast-black transition-colors hover:bg-overcast-orange/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-overcast-black border-t-transparent" />
                Signing in...
              </>
            ) : (
              'Sign In as Instructor'
            )}
          </button>
        </form>
        
        {/* Footer note */}
        <p className="mt-4 text-center text-xs text-overcast-gray">
          Students don&apos;t need to log in. Click outside to continue as a student.
        </p>
      </div>
    </div>
  );
}

