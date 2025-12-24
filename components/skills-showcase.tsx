'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { TiltCard } from '@/components/ui/tilt-card';

/**
 * Skill Category Data
 */
const skillCategories = [
    {
        id: 'data',
        title: 'DATA ANALYTICS',
        role: 'Data Analyst',
        description: 'Deciphering patterns. Transforming raw data into actionable intelligence with precision.',
        colors: {
            primary: 'from-green-500 to-emerald-400',
            border: 'group-hover:border-green-500/50',
            text: 'text-green-400',
            bgParam: 'bg-green-950/30'
        },
        skills: ['Python', 'Pandas', 'NumPy', 'SQL', 'Power BI', 'Tableau', 'Scikit-Learn'],
        bgPattern: (
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 100 L10 80 L20 90 L30 60 L40 70 L50 40 L60 50 L70 20 L80 30 L90 10 L100 0 V100 H0 Z" fill="currentColor" className="text-green-500" />
                <rect x="10" y="80" width="8" height="20" className="text-green-500/50" fill="currentColor" />
                <rect x="30" y="60" width="8" height="40" className="text-green-500/50" fill="currentColor" />
                <rect x="50" y="40" width="8" height="60" className="text-green-500/50" fill="currentColor" />
                <rect x="70" y="20" width="8" height="80" className="text-green-500/50" fill="currentColor" />
            </svg>
        )
    },
    {
        id: 'web',
        title: 'WEB DEVELOPMENT',
        role: 'Full Stack Engineer',
        description: 'Building immersive, high-performance web experiences with modern architecture.',
        colors: {
            primary: 'from-cyan-400 to-purple-500',
            border: 'group-hover:border-cyan-500/50',
            text: 'text-cyan-400',
            bgParam: 'bg-cyan-950/30'
        },
        skills: ['React.js', 'Next.js 14', 'TypeScript', 'Tailwind', 'Three.js', 'Node.js'],
        bgPattern: (
            <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-20 font-mono text-cyan-500 text-xs select-none overflow-hidden">
                <div>&lt;html&gt;</div>
                <div className="pl-8 text-purple-400">{`{ content }`}</div>
                <div className="pl-4">&lt;/body&gt;</div>
                <div className="absolute top-1/2 right-4 text-6xl font-bold opacity-10">{`{ }`}</div>
            </div>
        )
    },
    {
        id: 'python',
        title: 'PYTHON DEVELOPMENT',
        role: 'Backend Architect',
        description: 'Algorithmic efficiency. Scalable systems, automation, and AI integration.',
        colors: {
            primary: 'from-yellow-400 to-blue-500',
            border: 'group-hover:border-yellow-500/50',
            text: 'text-yellow-400',
            bgParam: 'bg-yellow-950/30'
        },
        skills: ['Django', 'FastAPI', 'Automation', 'PyTest', 'Celery', 'Redis', 'Algorithms'],
        bgPattern: (
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100">
                <defs>
                    <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-yellow-500" />
                    </pattern>
                </defs>
                <rect width="100" height="100" fill="url(#grid)" />
                <circle cx="90" cy="50" r="3" fill="currentColor" className="text-yellow-400" />
            </svg>
        )
    },
    {
        id: 'flutter',
        title: 'FLUTTER DEVELOPMENT',
        role: 'Mobile App Developer',
        description: 'Fluid, native-performance applications for iOS and Android.',
        colors: {
            primary: 'from-blue-400 to-teal-400',
            border: 'group-hover:border-blue-500/50',
            text: 'text-blue-400',
            bgParam: 'bg-blue-950/30'
        },
        skills: ['Dart', 'Flutter SDK', 'Riverpod', 'Firebase', 'Clean Arch', 'iOS/Android'],
        bgPattern: (
            <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" preserveAspectRatio="none">
                <path d="M0 50 Q25 30 50 50 T100 50 V100 H0 Z" fill="currentColor" className="text-blue-500" />
                <circle cx="80" cy="20" r="5" className="text-blue-400" fill="currentColor" />
            </svg>
        )
    }
];

export function SkillsShowcase() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % skillCategories.length);
        }, 5000); // 5 seconds for better readability
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col items-center justify-center bg-black py-20 overflow-hidden perspective-[2000px]">

            {/* Background Decor */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 pointer-events-none" />

            {/* Header */}
            <div className="relative z-20 text-center px-4 mb-20">
                <h2 className="text-3xl md:text-5xl font-bold font-mono text-white mb-2 tracking-tighter">
                    SKILL <span className="text-cyan-400">MULTIVERSE</span>
                </h2>
                <p className="text-zinc-500 text-sm md:text-base">Holographic System • Auto-Rotation: Active</p>
            </div>

            {/* Main Content Stage */}
            <div className="relative w-full max-w-5xl h-[60vh] md:h-[600px] px-4 flex items-center justify-center perspective-[3000px]">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={skillCategories[activeIndex].id}
                        initial={{ opacity: 0, rotateX: -90, scale: 0.5, z: -500 }}
                        animate={{ opacity: 1, rotateX: 0, scale: 1, z: 0 }}
                        exit={{ opacity: 0, rotateX: 90, scale: 0.5, z: -500 }}
                        transition={{
                            duration: 0.8,
                            type: "spring",
                            stiffness: 100,
                            damping: 20
                        }}
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {/* Wrap the card in TiltCard for interactive parallax */}
                        <TiltCard className="w-full h-full">
                            <SkillCard category={skillCategories[activeIndex]} index={activeIndex} total={skillCategories.length} />
                        </TiltCard>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Progress Indicators */}
            <div className="flex gap-4 mt-16 z-20">
                {skillCategories.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setActiveIndex(idx)}
                        className={cn(
                            "h-1.5 rounded-full transition-all duration-500",
                            idx === activeIndex ? "w-12 bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" : "w-4 bg-zinc-800 hover:bg-zinc-600"
                        )}
                    />
                ))}
            </div>

        </section>
    );
}

function SkillCard({ category, index, total }: { category: typeof skillCategories[0], index: number, total: number }) {
    return (
        <div className={cn(
            "w-full h-full md:max-h-[500px] rounded-3xl overflow-hidden border border-zinc-800 bg-zinc-900/90 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row backdrop-blur-3xl",
            category.colors.border
        )}>

            {/* 1. Visual Half */}
            <div className={cn("relative flex-1 bg-black/40 overflow-hidden flex items-center justify-center group-hover:bg-opacity-30 transition-all", category.colors.bgParam)}>
                {/* Parallax Background Layers */}
                <div className="absolute inset-0 opacity-20 scale-110 group-hover:scale-100 transition-transform duration-1000" style={{ transform: 'translateZ(-50px)' }}>
                    {category.bgPattern}
                </div>

                <span
                    className="text-9xl filter drop-shadow-2xl animate-pulse relative z-10 transition-transform duration-500 group-hover:scale-110"
                    style={{ transform: 'translateZ(60px)' }} // Pops out in 3D
                >
                    {getIconForCategory(category.id)}
                </span>

                <div
                    className="absolute top-4 left-4 p-2 bg-black/60 rounded backdrop-blur border border-white/10 z-20 shadow-xl"
                    style={{ transform: 'translateZ(20px)' }}
                >
                    <span className={cn("text-xs font-bold font-mono uppercase", category.colors.text)}>
                        Sector 0{index + 1}
                    </span>
                </div>
            </div>

            {/* 2. Content Half */}
            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center bg-zinc-950/80 backdrop-blur-md relative border-t md:border-t-0 md:border-l border-white/5">
                <div
                    className="absolute top-4 right-4 text-7xl font-black text-white/5 font-mono select-none"
                    style={{ transform: 'translateZ(-20px)' }} // Sits behind
                >
                    0{index + 1}
                </div>

                <div className="relative z-10" style={{ transform: 'translateZ(30px)' }}>
                    <h3 className={cn("text-3xl md:text-5xl font-bold tracking-tighter uppercase font-mono mb-3", category.colors.text)}>
                        {category.title}
                    </h3>
                    <h4 className="text-sm md:text-lg font-bold font-mono mb-6 uppercase tracking-widest text-zinc-500">
                        {category.role}
                    </h4>
                    <div className="h-0.5 w-12 bg-white/10 mb-6" />
                    <p className="text-zinc-300 text-lg md:text-xl mb-8 leading-relaxed">
                        {category.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill, i) => (
                            <motion.span
                                key={skill}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (i * 0.05) }}
                                className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-mono text-zinc-300 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                {skill}
                            </motion.span>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
}

function getIconForCategory(id: string) {
    switch (id) {
        case 'data': return '📊';
        case 'web': return '💻';
        case 'python': return '🐍';
        case 'flutter': return '📱';
        default: return '⚡';
    }
}
