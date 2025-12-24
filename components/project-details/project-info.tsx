'use client';

import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { SpotlightCard } from '@/components/ui/spotlight-card';
import { ExternalLink, Github, Globe } from 'lucide-react';
import { Project } from '@/lib/types/database';

interface ProjectInfoProps {
    project: Project;
}

export function ProjectInfo({ project }: ProjectInfoProps) {
    return (
        <section className="py-20 bg-black relative z-10">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Description */}
                    <div className="lg:col-span-2 space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-3xl font-bold text-white mb-6">About the Project</h2>
                            <div className="prose prose-lg prose-invert max-w-none text-zinc-400 leading-relaxed 
                                prose-headings:text-white prose-strong:text-white prose-a:text-blue-400 hover:prose-a:text-blue-300">
                                <ReactMarkdown>
                                    {project.long_description}
                                </ReactMarkdown>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar Info / Stats */}
                    <div className="lg:col-span-1 space-y-6">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                        >
                            <SpotlightCard className="p-8 bg-zinc-900/40 border-zinc-800">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <span className="w-2 h-8 bg-blue-500 rounded-full" />
                                    Project Details
                                </h3>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">My Role</h4>
                                        <p className="text-zinc-200 font-medium">{project.role?.title || 'Lead Developer'}</p>
                                    </div>

                                    {/* Links */}
                                    <div className="flex flex-col gap-3 pt-4 border-t border-white/5">
                                        {project.github_url && (
                                            <a
                                                href={project.github_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between group p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                                            >
                                                <span className="flex items-center gap-3 text-zinc-300 group-hover:text-white transition-colors">
                                                    <Github className="w-5 h-5" />
                                                    Source Code
                                                </span>
                                                <ExternalLink className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                                            </a>
                                        )}

                                        {project.live_url && (
                                            <a
                                                href={project.live_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center justify-between group p-3 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 hover:from-blue-600/30 hover:to-purple-600/30 border border-blue-500/30 transition-all"
                                            >
                                                <span className="flex items-center gap-3 text-blue-200 group-hover:text-white transition-colors">
                                                    <Globe className="w-5 h-5" />
                                                    Live Demo
                                                </span>
                                                <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </SpotlightCard>
                        </motion.div>
                    </div>

                </div>
            </div>
        </section>
    );
}
