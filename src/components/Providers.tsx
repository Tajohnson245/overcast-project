'use client';

/**
 * Providers Component
 * 
 * Wraps the application with necessary context providers.
 * Currently includes Jotai Provider for global state management.
 */

import { Provider as JotaiProvider } from 'jotai';

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  return (
    <JotaiProvider>
      {children}
    </JotaiProvider>
  );
}

