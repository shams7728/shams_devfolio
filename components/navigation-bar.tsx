'use client';

/**
 * Advanced Navigation Bar
 * Theme: Floating Holographic Control Bar
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalSearch } from './global-search';


export function NavigationBar() {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Smart Hide on Scroll
  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const currentScrollY = window.scrollY;

        // Hide if scrolling down AND past 100px
        // Show if scrolling up OR at top
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }

        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  }, [lastScrollY]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT', path: '/about' },
    { name: 'SKILLS', path: '/skills' },
    { name: 'PROJECTS', path: '/projects' },
    { name: 'CONTACT', path: '/contact' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: isVisible ? 0 : -100, opacity: isVisible ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className={`fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none`}
      >
        <div
          className={`
            pointer-events-auto
            relative w-full max-w-6xl 
            flex items-center justify-between 
            px-6 py-3 rounded-2xl md:rounded-full
            bg-black/40 dark:bg-black/60 
            backdrop-blur-xl border border-white/10
            shadow-[0_8px_32px_0_rgba(0,0,0,0.36)]
            transition-all duration-300
          `}
        >
          {/* 1. Logo / Identity */}
          <Link href="/" className="group flex items-center gap-3 relative z-20 shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center text-white font-bold font-mono text-sm group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] group-hover:scale-105 transition-all duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-white">
                <polyline points="4 17 10 11 4 5" />
                <line x1="12" y1="19" x2="20" y2="19" />
              </svg>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-mono group-hover:text-zinc-300 transition-colors">
                DEVELOPED BY
              </span>
              <span className="font-bold text-lg tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 group-hover:to-purple-400 transition-all font-mono">
                SHAMS
              </span>
            </div>
          </Link>

          {/* 2. Desktop Navigation (Center) - Absolute centered to ensure balance */}
          <div className="hidden lg:flex items-center gap-2 absolute left-1/2 -translate-x-1/2">
            <div className="flex items-center bg-white/5 rounded-full px-2 py-1 border border-white/5">
              {navLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    href={link.path}
                    className={`
                        relative px-5 py-2 text-[11px] font-mono font-bold tracking-wider transition-all duration-300 rounded-full
                        ${isActive
                        ? 'text-black bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)]'
                        : 'text-zinc-400 hover:text-white hover:bg-white/10'
                      }
                      `}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 3. Actions (Right) */}
          <div className="flex items-center gap-4 relative z-20 shrink-0">
            {/* Search (Desktop) - Adjusted width and spacing */}
            <div className="hidden md:block w-32 lg:w-48 transition-all hover:w-56">
              <GlobalSearch />
            </div>

            <div className="w-px h-6 bg-white/20 hidden md:block" />

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-white bg-white/5 rounded-full border border-white/10 active:scale-95 transition-all hover:bg-white/10"
              aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                  <line x1="4" x2="20" y1="12" y2="12" />
                  <line x1="4" x2="20" y1="6" y2="6" />
                  <line x1="4" x2="20" y1="18" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-3xl pt-24 px-6 lg:hidden flex flex-col gap-6"
          >
            {/* Mobile Links */}
            <div className="flex flex-col gap-2">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + (i * 0.05) }}
                >
                  <Link
                    href={link.path}
                    className={`block text-3xl font-bold font-mono py-2 border-b border-white/5 ${pathname === link.path ? 'text-cyan-400 pl-4 border-l-2 border-l-cyan-400' : 'text-zinc-500'
                      }`}
                  >
                    <span className="text-xs text-zinc-700 mr-4">0{i + 1}</span>
                    {link.name}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Mobile Search */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <GlobalSearch />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
