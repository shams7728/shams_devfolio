'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import gsap from 'gsap';
import { ArrowDown } from 'lucide-react';
import LiquidBackground from '@/components/3d/liquid-background';
import { Project } from '@/lib/types/database';

interface ProjectHeroProps {
    project: Project;
}

export function ProjectHero({ project }: ProjectHeroProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);

    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 250]);
    const opacity = useTransform(scrollY, [0, 300], [1, 0]);

    // Smooth spring physics for parallax
    const springY = useSpring(y, { stiffness: 100, damping: 30 });

    useEffect(() => {
        // Split text animation for title using GSAP
        if (!titleRef.current) return;

        // Ensure accurate text content
        titleRef.current.innerHTML = project.title;

        const chars = titleRef.current.innerText.split('');
        titleRef.current.innerHTML = '';

        chars.forEach((char) => {
            const span = document.createElement('span');
            span.innerText = char === ' ' ? '\u00A0' : char; // Preserve spaces
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(50px) rotate(10deg)';
            titleRef.current?.appendChild(span);
        });

        const spans = titleRef.current.querySelectorAll('span');

        gsap.to(spans, {
            y: 0,
            opacity: 1,
            rotate: 0,
            stagger: 0.03,
            duration: 0.8,
            ease: 'back.out(1.7)',
            delay: 0.2
        });

    }, [project.title]);

    return (
        <div ref={containerRef} className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-slate-950 flex items-center justify-center">
            {/* 3D Liquid Background - High visibility */}
            <div className="absolute inset-0 z-0 opacity-80 mix-blend-screen">
                <LiquidBackground />
            </div>

            {/* Overlay Gradient - Blue tint for theme */}
            <div className="absolute inset-0 z-10 bg-gradient-to-b from-slate-950/30 via-slate-900/10 to-slate-950 pointer-events-none" />

            {/* Content */}
            <motion.div
                style={{ y: springY, opacity }}
                className="relative z-20 container mx-auto px-4 text-center max-w-4xl"
            >
                {/* Animated Role Badge */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="mb-8 inline-block"
                >
                    <span className="px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-950/30 backdrop-blur-md text-sm font-bold text-cyan-300 uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                        Project Showcase
                    </span>
                </motion.div>

                {/* Hero Title - Fixed Sizing & Wrapping */}
                <h1
                    ref={titleRef}
                    className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-8 leading-[1.2] break-words hyphens-auto drop-shadow-2xl max-w-4xl mx-auto"
                    aria-label={project.title}
                >
                    {project.title}
                </h1>

                {/* Short Description */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.8 }}
                    className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md"
                >
                    {project.short_description}
                </motion.p>

                {/* Tech Stack Pills */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.5, duration: 1 }}
                    className="mt-10 flex flex-wrap justify-center gap-3"
                >
                    {project.tech_stack.map((tech, i) => (
                        <span
                            key={i}
                            className="px-4 py-2 bg-slate-900/60 backdrop-blur-md border border-slate-700/50 rounded-full text-slate-200 text-sm font-medium hover:bg-cyan-500/20 hover:border-cyan-500/50 hover:text-cyan-200 transition-all duration-300 cursor-default"
                        >
                            {tech}
                        </span>
                    ))}
                </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2, duration: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
            >
                <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                    <ArrowDown className="w-6 h-6 text-cyan-400/50" />
                </motion.div>
            </motion.div>
        </div>
    );
}
