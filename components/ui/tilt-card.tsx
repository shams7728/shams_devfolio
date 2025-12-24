'use client';

import { useRef, useState, MouseEvent } from 'react';
import { motion, useMotionTemplate, useMotionValue, useSpring } from 'framer-motion';

const DEFAULT_ROTATION_RANGE = 20;
const HALF_ROTATION_RANGE = DEFAULT_ROTATION_RANGE / 2;

interface TiltCardProps {
    children: React.ReactNode;
    className?: string;
    tiltMaxAngle?: number;
    glareEnable?: boolean;
    scale?: number;
}

export function TiltCard({
    children,
    className = '',
    tiltMaxAngle = DEFAULT_ROTATION_RANGE,
    glareEnable = true,
    scale = 1.0
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const scaleVal = useSpring(1, { stiffness: 100, damping: 30 });

    const xSpring = useSpring(x);
    const ySpring = useSpring(y);

    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg) scale(${scaleVal})`;

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const width = rect.width;
        const height = rect.height;

        const mouseX = (e.clientX - rect.left) * tiltMaxAngle;
        const mouseY = (e.clientY - rect.top) * tiltMaxAngle;

        const rX = (mouseY / height - tiltMaxAngle / 2) * -1;
        const rY = mouseX / width - tiltMaxAngle / 2;

        x.set(rX);
        y.set(rY);
    };

    const handleMouseEnter = () => {
        scaleVal.set(scale);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        scaleVal.set(1);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            style={{
                transformStyle: 'preserve-3d',
                transform,
            }}
            className={`relative rounded-3xl group ${className}`}
        >
            {/* Glossy Overlay */}
            {glareEnable && (
                <div
                    style={{ transform: 'translateZ(50px)' }}
                    className="absolute inset-4 -z-10 rounded-2xl bg-gradient-to-br from-white/10 to-transparent blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
            )}
            {children}
        </motion.div>
    );
}
