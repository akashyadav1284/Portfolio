'use client';

import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

// ------------------------------------
// Typewriter Sequences
// ------------------------------------
const SEQUENCE = [
  "Welcome to AKASHVERSE",
  "Where Imagination Meets Reality...",
  "I Don't Just Build Websites...",
  "I Create Experiences."
];

// ------------------------------------
// Typewriter Component
// ------------------------------------
const TypewriterIntro = ({ onComplete }: { onComplete: () => void }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (currentLineIndex >= SEQUENCE.length) {
      setTimeout(() => onComplete(), 1500); // Pause before final reveal
      return;
    }

    const currentFullText = SEQUENCE[currentLineIndex];

    if (isTyping) {
      if (displayText.length < currentFullText.length) {
        timeout = setTimeout(() => {
          setDisplayText(currentFullText.slice(0, displayText.length + 1));
        }, 60); // Speed of typing
      } else {
        setIsTyping(false);
        timeout = setTimeout(() => { }, 1200); // Pause on full string
      }
    } else {
      timeout = setTimeout(() => {
        setDisplayText('');
        setCurrentLineIndex((prev) => prev + 1);
        setIsTyping(true);
      }, 1000); // Pause before erasing/next line
    }

    return () => clearTimeout(timeout);
  }, [displayText, isTyping, currentLineIndex, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
      transition={{ duration: 1 }}
      className="absolute inset-0 flex items-center justify-center z-50 bg-black"
    >
      <div className="font-mono text-xl md:text-3xl text-cyan-400 tracking-widest text-center px-4 drop-shadow-[0_0_10px_rgba(0,243,255,0.8)] flex items-center">
        {displayText}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          className="inline-block w-3 h-8 md:h-10 bg-cyan-400 ml-1 shadow-[0_0_10px_rgba(0,243,255,1)]"
        />
      </div>
    </motion.div>
  );
};

// ------------------------------------
// Main Hero Section
// ------------------------------------
export default function HeroSection() {
  const [bootDone, setBootDone] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  
  useEffect(() => {
    // Listen for BootScreen completion
    const onBootComplete = () => setBootDone(true);
    window.addEventListener('bootComplete', onBootComplete);
    
    // Fallback timeout corresponding exactly to BootScreen duration 
    // just in case HMR or React StrictMode misses the event listener
    const safetyTimer = setTimeout(() => setBootDone(true), 4500); 

    return () => {
      window.removeEventListener('bootComplete', onBootComplete);
      clearTimeout(safetyTimer);
    };
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end start"] });

  const yOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const yMove = useTransform(scrollYProgress, [0, 1], [0, 150]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePosition({ x, y });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-transparent"
    >
      <AnimatePresence>
        {bootDone && !introDone && <TypewriterIntro onComplete={() => setIntroDone(true)} />}
      </AnimatePresence>

      <motion.div
        style={{ opacity: yOpacity, y: yMove }}
        initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
        animate={introDone ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
        transition={{ duration: 2, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center justify-center text-center max-w-5xl px-6 w-full"
      >
        {/* Main Title Reveal */}
        <motion.div
          animate={{ x: mousePosition.x * -20, y: mousePosition.y * -20 }}
          transition={{ type: "spring", stiffness: 40, damping: 20 }}
          className="relative mb-6 group cursor-default"
        >
          <h1 className="text-6xl sm:text-7xl md:text-[8rem] font-black font-orbitron uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-cyan-100 to-cyan-500 drop-shadow-[0_0_20px_rgba(0,243,255,0.4)] leading-none transition-all duration-500 group-hover:drop-shadow-[0_0_40px_rgba(0,243,255,0.8)]">
            AKASH YADAV
          </h1>
          <div className="absolute inset-0 bg-cyan-400/10 blur-[50px] animate-pulse -z-10 rounded-full group-hover:bg-cyan-400/20 transition-all duration-500" />
        </motion.div>

        {/* Short Statement */}
        <p className="text-lg md:text-2xl text-slate-300 font-inter mb-12 max-w-2xl px-4 italic drop-shadow-lg">
          "I design. I build. I bring ideas to life."
        </p>

        {/* Immersive CTA */}
        <motion.a
          href="#about"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative group px-10 py-5 bg-black/40 backdrop-blur-md border border-cyan-900/50 rounded-full overflow-hidden transition-all duration-300 hover:border-cyan-400 hover:bg-cyan-950/40 hover:shadow-[0_0_40px_rgba(0,243,255,0.4)] click-sound"
        >
          <div className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent -translate-x-[200%] skew-x-[30deg] group-hover:translate-x-[400%] transition-transform duration-1000 ease-out" />
          <span className="relative z-10 font-mono text-sm md:text-base uppercase tracking-[0.4em] font-bold text-white group-hover:text-cyan-300 transition-colors">
            ENTER AKASHVERSE
          </span>
        </motion.a>
      </motion.div>

    </section>
  );
}
