'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const SKILLS = [
    'HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Next.js',
    'Node.js', 'Flutter', 'Dart', 'Tailwind', 'Three.js', 'SQL',
    'PostgreSQL', 'Python', 'Data Analysis', 'Git', 'Figma', 'UI/UX',
    'Redux', 'GraphQL'
];

export function SkillCloud() {
    const [isMounted, setIsMounted] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Manual animation loop for assured rotation
    useEffect(() => {
        if (!isMounted) return;

        let frameId: number;
        let rotation = 0;

        const animate = () => {
            rotation += 0.2; // Speed of rotation

            if (containerRef.current) {
                containerRef.current.style.transform = `rotateY(${rotation}deg) rotateX(${rotation * 0.5}deg)`;
            }

            // Counter-rotate items to keep them facing front
            itemRefs.current.forEach(item => {
                if (item) {
                    item.style.transform = `rotateX(${-rotation * 0.5}deg) rotateY(${-rotation}deg)`;
                }
            });

            frameId = requestAnimationFrame(animate);
        };

        frameId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(frameId);
    }, [isMounted]);

    if (!isMounted) {
        return <div className="w-full h-full flex items-center justify-center text-cyan-500/50 font-mono text-xs">Initializing Neural Link...</div>;
    }

    return (
        <div className="w-full h-full flex items-center justify-center perspective-[1000px] overflow-hidden">
            <div
                ref={containerRef}
                className="relative w-64 h-64 md:w-80 md:h-80 transform-style-3d"
                style={{ transformStyle: 'preserve-3d' }}
            >
                {SKILLS.map((skill, i) => {
                    // Distribute on a sphere surface using Fibonacci Sphere algorithm
                    const phi = Math.acos(-1 + (2 * i) / SKILLS.length);
                    const theta = Math.sqrt(SKILLS.length * Math.PI) * phi;

                    const x = 140 * Math.cos(theta) * Math.sin(phi);
                    const y = 140 * Math.sin(theta) * Math.sin(phi);
                    const z = 140 * Math.cos(phi);

                    return (
                        <div
                            key={skill}
                            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform-style-3d backface-visible"
                            style={{
                                transform: `translate3d(${x}px, ${y}px, ${z}px)`,
                                transformStyle: 'preserve-3d'
                            }}
                        >
                            <div
                                ref={el => { itemRefs.current[i] = el }}
                                className="px-3 py-1.5 rounded-full bg-black/80 border border-cyan-500/30 backdrop-blur-md text-cyan-400 font-mono text-xs md:text-sm whitespace-nowrap shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:bg-cyan-500 hover:text-black transition-colors duration-300 cursor-default"
                            >
                                {skill}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
