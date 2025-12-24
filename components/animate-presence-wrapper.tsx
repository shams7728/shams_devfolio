'use client';

/**
 * AnimatePresence Wrapper Component
 * 
 * Wraps the app with Framer Motion's AnimatePresence for page transitions
 * Requirements: 6.3
 */

import { AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface AnimatePresenceWrapperProps {
  children: ReactNode;
}

/**
 * AnimatePresenceWrapper Component
 * 
 * Enables exit animations when navigating between pages
 */
export function AnimatePresenceWrapper({ children }: AnimatePresenceWrapperProps) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <div key={pathname}>
        {children}
      </div>
    </AnimatePresence>
  );
}
