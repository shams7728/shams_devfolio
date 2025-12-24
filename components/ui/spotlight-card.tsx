'use client';

import { useRef, MouseEvent } from 'react';

interface SpotlightCardProps {
    children: React.ReactNode;
    className?: string;
    spotlightColor?: string;
}

export function SpotlightCard({
    children,
    className = '',
    spotlightColor = 'rgba(255, 255, 255, 0.15)'
}: SpotlightCardProps) {
    const divRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!divRef.current) return;

        const div = divRef.current;
        const rect = div.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        div.style.setProperty('--mouse-x', `${x}px`);
        div.style.setProperty('--mouse-y', `${y}px`);
        div.style.setProperty('--spotlight-opacity', '1');
    };

    const handleMouseLeave = () => {
        if (!divRef.current) return;
        divRef.current.style.setProperty('--spotlight-opacity', '0');
    };

    return (
        <div
            ref={divRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`relative overflow-hidden rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-md ${className} group`}
        >
            <div
                className="pointer-events-none absolute -inset-px transition-opacity duration-300"
                style={{
                    opacity: 'var(--spotlight-opacity, 0)',
                    background: `radial-gradient(600px circle at var(--mouse-x, 0px) var(--mouse-y, 0px), ${spotlightColor}, transparent 40%)`,
                }}
            />
            <div className="relative h-full">{children}</div>
        </div>
    );
}
