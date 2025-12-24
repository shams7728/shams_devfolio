'use client';

/**
 * Role Background Component
 * 
 * Adaptive background animations that change based on the current role
 * Requirements: 2.2, 2.3, 2.4, 2.5, 2.6
 */

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface RoleBackgroundProps {
  animationType: 'data-grid' | 'code-lines' | 'ui-components' | 'database-shapes' | 'custom' | 'none';
  config?: Record<string, any>;
}

export function RoleBackground({ animationType, config = {} }: RoleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous animation
    if (animationRef.current) {
      animationRef.current.kill();
    }

    const container = containerRef.current;
    container.innerHTML = ''; // Clear previous elements

    // Create animation based on type
    switch (animationType) {
      case 'data-grid':
        createDataGridAnimation(container, config);
        break;
      case 'code-lines':
        createCodeLinesAnimation(container, config);
        break;
      case 'ui-components':
        createUIComponentsAnimation(container, config);
        break;
      case 'database-shapes':
        createDatabaseShapesAnimation(container, config);
        break;
      default:
        break;
    }

    return () => {
      if (animationRef.current) {
        animationRef.current.kill();
      }
    };
  }, [animationType, config]);

  if (animationType === 'none') {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 dark:opacity-10"
      aria-hidden="true"
    />
  );
}

/**
 * Data Grid Animation - For Data Analyst role
 * Animated grid pattern with light pulses
 */
function createDataGridAnimation(container: HTMLElement, config: Record<string, any>) {
  const gridSize = config.gridSize || 40;
  const rows = Math.ceil(container.clientHeight / gridSize) + 1;
  const cols = Math.ceil(container.clientWidth / gridSize) + 1;

  // Create grid lines
  for (let i = 0; i <= rows; i++) {
    const line = document.createElement('div');
    line.className = 'absolute w-full h-px bg-blue-500/30';
    line.style.top = `${i * gridSize}px`;
    container.appendChild(line);
  }

  for (let i = 0; i <= cols; i++) {
    const line = document.createElement('div');
    line.className = 'absolute h-full w-px bg-blue-500/30';
    line.style.left = `${i * gridSize}px`;
    container.appendChild(line);
  }

  // Create pulsing dots at intersections
  const dotCount = config.dotCount || 20;
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement('div');
    dot.className = 'absolute w-2 h-2 bg-blue-400 rounded-full';
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    container.appendChild(dot);

    // Animate dot
    gsap.to(dot, {
      scale: 1.5,
      opacity: 0.3,
      duration: 2 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: Math.random() * 2,
    });
  }
}

/**
 * Code Lines Animation - For Web Developer role
 * Animated code-like lines flowing across the screen
 */
function createCodeLinesAnimation(container: HTMLElement, config: Record<string, any>) {
  const lineCount = config.lineCount || 15;

  for (let i = 0; i < lineCount; i++) {
    const line = document.createElement('div');
    line.className = 'absolute h-px bg-gradient-to-r from-transparent via-green-500 to-transparent';
    line.style.width = `${20 + Math.random() * 40}%`;
    line.style.top = `${Math.random() * 100}%`;
    line.style.left = '-50%';
    container.appendChild(line);

    // Animate line across screen
    gsap.to(line, {
      left: '150%',
      duration: 3 + Math.random() * 4,
      repeat: -1,
      ease: 'none',
      delay: Math.random() * 3,
    });

    // Pulse opacity
    gsap.to(line, {
      opacity: 0.3 + Math.random() * 0.4,
      duration: 1 + Math.random(),
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }
}

/**
 * UI Components Animation - For Flutter Developer role
 * Floating UI component outlines
 */
function createUIComponentsAnimation(container: HTMLElement, config: Record<string, any>) {
  const componentCount = config.componentCount || 12;
  const shapes = ['rect', 'circle', 'rounded'];

  for (let i = 0; i < componentCount; i++) {
    const component = document.createElement('div');
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    const size = 40 + Math.random() * 80;

    component.className = `absolute border-2 border-purple-500/40`;
    component.style.width = `${size}px`;
    component.style.height = `${size}px`;
    component.style.left = `${Math.random() * 100}%`;
    component.style.top = `${Math.random() * 100}%`;

    if (shape === 'circle') {
      component.style.borderRadius = '50%';
    } else if (shape === 'rounded') {
      component.style.borderRadius = '12px';
    }

    container.appendChild(component);

    // Float animation
    gsap.to(component, {
      y: -30 + Math.random() * 60,
      x: -30 + Math.random() * 60,
      rotation: -15 + Math.random() * 30,
      duration: 4 + Math.random() * 4,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: Math.random() * 2,
    });

    // Opacity pulse
    gsap.to(component, {
      opacity: 0.2 + Math.random() * 0.3,
      duration: 2 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }
}

/**
 * Database Shapes Animation - For SQL Developer role
 * Floating table and column shapes
 */
function createDatabaseShapesAnimation(container: HTMLElement, config: Record<string, any>) {
  const shapeCount = config.shapeCount || 10;

  for (let i = 0; i < shapeCount; i++) {
    const isTable = Math.random() > 0.5;
    const shape = document.createElement('div');

    if (isTable) {
      // Create table shape (rectangle with rows)
      shape.className = 'absolute border-2 border-orange-500/40 bg-orange-500/5';
      const width = 80 + Math.random() * 60;
      const height = 60 + Math.random() * 40;
      shape.style.width = `${width}px`;
      shape.style.height = `${height}px`;
      shape.style.borderRadius = '4px';

      // Add row lines
      const rows = 3;
      for (let j = 1; j < rows; j++) {
        const row = document.createElement('div');
        row.className = 'absolute w-full h-px bg-orange-500/30';
        row.style.top = `${(j / rows) * 100}%`;
        shape.appendChild(row);
      }
    } else {
      // Create column shape (cylinder)
      shape.className = 'absolute border-2 border-orange-500/40 bg-orange-500/5';
      const width = 30 + Math.random() * 20;
      const height = 50 + Math.random() * 30;
      shape.style.width = `${width}px`;
      shape.style.height = `${height}px`;
      shape.style.borderRadius = `${width / 2}px ${width / 2}px 4px 4px`;
    }

    shape.style.left = `${Math.random() * 100}%`;
    shape.style.top = `${Math.random() * 100}%`;
    container.appendChild(shape);

    // Float animation
    gsap.to(shape, {
      y: -40 + Math.random() * 80,
      x: -40 + Math.random() * 80,
      rotation: -10 + Math.random() * 20,
      duration: 5 + Math.random() * 5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: Math.random() * 3,
    });

    // Opacity pulse
    gsap.to(shape, {
      opacity: 0.3 + Math.random() * 0.3,
      duration: 2 + Math.random() * 2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
    });
  }
}
