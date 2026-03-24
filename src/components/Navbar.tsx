'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const NAV_LINKS = [
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Check initial scroll state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 w-full z-[100] transition-all duration-500 ease-out ${
          scrolled 
            ? 'py-4 bg-[#0a0f1f]/80 backdrop-blur-xl border-b border-cyan-500/30 shadow-[0_4px_30px_rgba(6,182,212,0.15)]' 
            : 'py-6 bg-transparent backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-12 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 md:w-10 md:h-10 bg-transparent flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
               <div className="absolute inset-0 border-[2px] md:border-[3px] border-r-transparent border-b-transparent border-red-500 rounded-lg transform -rotate-45 group-hover:border-red-400 group-hover:shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all" />
               <div className="absolute inset-0 border-[2px] md:border-[3px] border-l-transparent border-t-transparent border-cyan-500 rounded-lg transform -rotate-45 group-hover:border-cyan-400 group-hover:shadow-[0_0_15px_rgba(6,182,212,0.5)] transition-all" />
               <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-magenta-400 to-cyan-500 shadow-[0_0_10px_rgba(217,70,239,0.5)] group-hover:animate-pulse"></div>
            </div>
            <span className="text-xl md:text-3xl font-orbitron font-bold text-white tracking-widest leading-none mt-1 drop-shadow-[0_0_5px_rgba(255,255,255,0.4)] group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_15px_rgba(6,182,212,0.8)] transition-all duration-300">
              AKASHVERSE
            </span>
          </Link>

          {/* Center Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.1)]">
            {NAV_LINKS.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="relative text-xs font-mono font-bold uppercase tracking-[0.1em] text-slate-300 hover:text-white px-5 py-2.5 rounded-full transition-colors group overflow-hidden"
              >
                <span className="relative z-10">{link.name}</span>
                {/* Hover Underline Glow Effect */}
                <span className="absolute bottom-1 left-1/2 w-0 h-[2px] bg-cyan-400 -translate-x-1/2 group-hover:w-3/4 transition-all duration-300 shadow-[0_0_10px_rgba(6,182,212,0.8)]" />
                <span className="absolute inset-0 bg-cyan-500/10 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300 ease-out" />
              </Link>
            ))}
          </div>

          {/* Right Action Buttons (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Admin Button */}
            <Link 
              href="/admin" 
              className="relative text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-red-400 px-6 py-2.5 rounded-full border border-red-500/50 bg-red-950/20 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(239,68,68,0.2)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)] group overflow-hidden"
            >
              <div className="absolute inset-0 bg-red-500/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2">ADMIN</span>
            </Link>
            
            {/* Join Button */}
            <Link 
              href="#contact" 
              className="relative text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-magenta-300 px-6 py-2.5 rounded-full border border-magenta-500/50 bg-magenta-950/20 hover:bg-magenta-500 hover:text-white transition-all duration-300 shadow-[0_0_10px_rgba(217,70,239,0.2)] hover:shadow-[0_0_20px_rgba(217,70,239,0.8)] group overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-magenta-600/50 to-purple-600/50 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">JOIN</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white hover:text-cyan-400 transition-colors focus:outline-none p-2 relative z-[110]"
            aria-label="Toggle Menu"
          >
            <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-1.5' : 'mb-1.5'}`}></div>
            <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'mb-1.5'}`}></div>
            <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </button>
        </div>
      </motion.nav>

      {/* Mobile Slide-in Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-[105] bg-[#020612]/95 backdrop-blur-3xl flex flex-col justify-center items-center px-6"
          >
            {/* Menu Links */}
            <div className="flex flex-col items-center space-y-6 w-full">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="w-full text-center"
                >
                  <Link 
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl font-orbitron font-bold uppercase tracking-widest text-slate-300 hover:text-cyan-400 transition-colors block py-4 border-b border-white/5 hover:border-cyan-500/50 w-full"
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {/* Action Buttons Mobile */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col w-full gap-4 mt-8 max-w-xs"
              >
                <Link 
                  href="/admin" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center font-mono font-bold uppercase tracking-[0.2em] text-red-400 py-4 rounded-xl border border-red-500/50 bg-red-950/20 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                >
                  ADMIN PORTAL
                </Link>
                <Link 
                  href="#contact" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center font-mono font-bold uppercase tracking-[0.2em] text-magenta-300 py-4 rounded-xl border border-magenta-500/50 bg-magenta-950/20 hover:bg-magenta-500 hover:text-white transition-all duration-300 shadow-[0_0_15px_rgba(217,70,239,0.3)]"
                >
                  JOIN NETWORK
                </Link>
              </motion.div>
            </div>
            
            {/* Background design elements */}
            <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-cyan-900/10 to-transparent pointer-events-none" />
            <div className="absolute top-1/4 right-0 w-64 h-64 border border-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
