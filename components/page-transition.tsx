'use client';

/**
 * Page Transition Component
 * 
 * Wraps pages with Framer Motion animations for smooth transitions
 * Requirements: 6.3
 */

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

/**
 * Fade and slide transition variants
 */
const variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.48, 0.15, 0.25, 0.96] as const,
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: [0.48, 0.15, 0.25, 0.96] as const,
    },
  },
};

/**
 * PageTransition Component
 * 
 * Provides smooth fade and slide animations for page transitions
 */
export function PageTransition({ children }: PageTransitionProps) {
  return (
    <motion.div
      initial="hidden"
      animate="enter"
      exit="exit"
      variants={variants}
    >
      {children}
    </motion.div>
  );
}
