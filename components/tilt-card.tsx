'use client';

/**
 * 3D Tilt Card Component
 * 
 * Provides 3D tilt effect on hover with depth, shadows, and highlights
 * Optimized for 60fps performance using transform and opacity only
 * Requirements: 10.1, 10.2, 10.5
 */

import { useRef, useEffect, useState, type ReactNode, type MouseEvent } from 'react';
import { useAccessibility } from '@/lib/contexts/accessibility-context';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  tiltMaxAngle?: number;
  glareEnable?: boolean;
  scale?: number;
}

export function TiltCard({
  children,
  className = '',
  tiltMaxAngle = 15,
  glareEnable = true,
  scale = 1.05,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const { reducedMotion } = useAccessibility();

  useEffect(() => {
    const card = cardRef.current;
    if (!card || reducedMotion) return;

    const handleMouseMove = (e: globalThis.MouseEvent) => {
      if (!isHovering) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -tiltMaxAngle;
      const rotateY = ((x - centerX) / centerX) * tiltMaxAngle;

      // Apply transform using GPU-accelerated properties only
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`;

      // Update glare position
      if (glareEnable && glareRef.current) {
        const glareX = (x / rect.width) * 100;
        const glareY = (y / rect.height) * 100;
        glareRef.current.style.background = `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255, 255, 255, 0.2) 0%, transparent 50%)`;
        glareRef.current.style.opacity = '1';
      }
    };

    const handleMouseEnter = () => {
      setIsHovering(true);
    };

    const handleMouseLeave = () => {
      setIsHovering(false);
      if (card) {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
      if (glareEnable && glareRef.current) {
        glareRef.current.style.opacity = '0';
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isHovering, tiltMaxAngle, glareEnable, scale, reducedMotion]);

  if (reducedMotion) {
    // Return simple card without tilt for reduced motion preference
    return (
      <div ref={cardRef} className={className}>
        {children}
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className={`${className} will-change-transform`}
      style={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.1s ease-out',
      }}
    >
      {glareEnable && (
        <div
          ref={glareRef}
          className="absolute inset-0 pointer-events-none rounded-inherit z-10"
          style={{
            opacity: 0,
            transition: 'opacity 0.3s ease-out',
            mixBlendMode: 'overlay',
          }}
        />
      )}
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </div>
  );
}
