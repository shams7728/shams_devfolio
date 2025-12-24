'use client';

/**
 * About Section
 * 
 * Layout:
 * - Left: Bio & Details (Text)
 * - Right: Interactive 3D Skills Sphere
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SkillCloud } from './ui/skill-cloud';
import type { Role } from '@/lib/types/database';

interface AboutSectionProps {
    roles?: Role[];
}

export function AboutSection({ roles = [] }: AboutSectionProps) {
    // Typewriter effect state
    const [displayText, setDisplayText] = useState('');
    const [roleIndex, setRoleIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [typingSpeed, setTypingSpeed] = useState(150);

    // Dynamic roles to cycle through - fallback if empty
    const roleTitles = roles.length > 0
        ? roles.map(r => r.title)
        : ['Full Stack Developer', 'UI/UX Designer', 'Creative Technologist', 'System Architect'];

    useEffect(() => {
        const handleType = () => {
            const currentRole = roleTitles[roleIndex];
            const isFullText = displayText === currentRole;
            const isEmptyText = displayText === '';

            if (isDeleting) {
                setDisplayText(currentRole.substring(0, displayText.length - 1));
                setTypingSpeed(50); // Faster deletion
            } else {
                setDisplayText(currentRole.substring(0, displayText.length + 1));
                setTypingSpeed(150); // Normal typing
            }

            if (!isDeleting && isFullText) {
                // Pause at end of word
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && isEmptyText) {
                // Move to next word
                setIsDeleting(false);
                setRoleIndex((prev) => (prev + 1) % roleTitles.length);
            }
        };

        const timer = setTimeout(handleType, typingSpeed);
        return () => clearTimeout(timer);
    }, [displayText, isDeleting, roleIndex, roleTitles, typingSpeed]);

    return (
        <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-black overflow-hidden border-t border-zinc-800">

            {/* Background Glow */}
            <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                {/* Left: Content */}
                <div className="space-y-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-700 text-xs font-mono text-zinc-400 mb-6 group hover:border-cyan-500/50 transition-colors cursor-default">
                            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></span>
                            IDENTITY_VERIFIED
                        </div>

                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 font-mono tracking-tight">
                            Shams<br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Mansuri</span>
                        </h2>

                        <div className="font-mono text-cyan-400 text-lg mb-6 flex flex-col gap-2">
                            <div>
                                <span className="text-zinc-500 mr-2">&gt;</span>
                                B.Tech Computer Science Graduate
                            </div>
                            <div className="flex items-center h-8">
                                <span className="text-zinc-500 mr-2">&gt;</span>
                                {displayText}
                                <span className="w-2 h-5 bg-cyan-400 ml-1 animate-pulse" />
                            </div>
                        </div>

                        <div className="space-y-6 text-zinc-400 leading-relaxed max-w-lg">
                            <p className="hover:text-zinc-200 transition-colors duration-300">
                                I am a versatile developer specializing in <span className="text-cyan-300 border-b border-cyan-500/30 pb-0.5">Web Development</span>, <span className="text-purple-300 border-b border-purple-500/30 pb-0.5">Mobile Apps</span>, and <span className="text-green-300 border-b border-green-500/30 pb-0.5">Data Analytics</span>.
                                I build comprehensive digital ecosystems that live across platforms.
                            </p>
                            <p className="hover:text-zinc-200 transition-colors duration-300">
                                From architecting scalable web applications and intuitive mobile experiences to deriving actionable insights from complex data, I deliver end-to-end solutions.
                                My focus is on creating seamless, high-performance products that drive real value.
                            </p>
                        </div>
                        {/* Removed Stats Block as requested */}
                    </motion.div>
                </div>

                {/* Right: 3D Skills Sphere (CSS Version) */}
                <div className="h-[400px] lg:h-[500px] w-full relative flex items-center justify-center">
                    <SkillCloud />
                </div>

            </div>
        </section>
    );
}
