"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BOOT_MESSAGES = [
  "AKASH_NET Initializing...",
  "Security Clearance Check",
  "Robotics AI Network Sync",
  "Loading Neural Modules",
  "XR Protocol Activated",
  "Access Level: STUDENT"
];

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // 3.5 seconds boot duration
    const duration = 3500;
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;
    let timer: any;

    timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min((currentStep / steps) * 100, 100);
      setProgress(nextProgress);

      const nextMessageIdx = Math.min(
        Math.floor((currentStep / steps) * BOOT_MESSAGES.length),
        BOOT_MESSAGES.length - 1
      );

      setCurrentMessageIndex(nextMessageIdx);

      if (currentStep >= steps) {
        clearInterval(timer);
        setIsDone(true);
        // Fire complete immediately after setting done
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        key="boot-screen"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black text-cyan-400 font-mono overflow-hidden"
      >
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(to right, #0891b2 1px, transparent 1px), linear-gradient(to bottom, #0891b2 1px, transparent 1px)`,
            backgroundSize: `4rem 4rem`
          }}
        />

        {/* Glitch Overlay */}
        <motion.div
          className="absolute inset-0 bg-cyan-900/10 pointer-events-none mix-blend-overlay"
          animate={{
            opacity: [0, 0.1, 0, 0.3, 0],
            x: [0, -4, 4, -2, 2, 0],
          }}
          transition={{
            duration: 0.15,
            repeat: Infinity,
            repeatType: "mirror",
            repeatDelay: Math.random() * 3 + 1
          }}
        />

        {/* Scanline Effect */}
        <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-50 opacity-50" />

        <div className="w-full max-w-3xl px-8 z-10 flex flex-col gap-12">

          {/* Header */}
          <div className="flex justify-between items-end border-b border-cyan-800/50 pb-4">
            <h1 className="text-3xl md:text-5xl font-bold tracking-widest uppercase flex items-center shadow-cyan-500/50 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">
              AKASH _OS
              <span className="text-sm font-normal ml-4 text-cyan-600">v2.0</span>
            </h1>
            <div className="text-sm tracking-widest text-cyan-600 hidden md:block">
              SYSTEM BOOT
            </div>
          </div>

          {/* Terminal Text */}
          <div className="h-40 flex flex-col justify-end gap-3 text-sm md:text-lg font-medium">
            {BOOT_MESSAGES.slice(0, currentMessageIndex + 1).map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={idx === currentMessageIndex ? 'text-cyan-300' : 'text-cyan-800'}
              >
                <span className="mr-3 opacity-50">&gt;</span>
                <span className={idx === currentMessageIndex ? 'animate-pulse' : ''}>{msg}</span>
                {idx === currentMessageIndex && !isDone && (
                  <span className="inline-block w-2.5 h-5 bg-cyan-400 ml-2 animate-[pulse_0.5s_infinite]" />
                )}
                {isDone && idx === BOOT_MESSAGES.length - 1 && (
                  <span className="inline-block ml-3 text-cyan-400">[ OK ]</span>
                )}
              </motion.div>
            ))}
          </div>

          {/* Loading Bar */}
          <div className="w-full relative mt-8">
            <div className="flex justify-between text-xs text-cyan-500 mb-2 uppercase tracking-widest font-bold">
              <span>System Load</span>
              <span className="text-cyan-300">{Math.floor(progress)}%</span>
            </div>
            <div className="h-1.5 w-full bg-cyan-950/80 overflow-hidden relative border border-cyan-900/50">
              <motion.div
                className="absolute top-0 left-0 bottom-0 bg-cyan-400 shadow-[0_0_20px_#22d3ee]"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Hex decor inside boot */}
            <div className="absolute -bottom-8 right-0 flex gap-1 opacity-50">
              {[0, 1, 2].map((i) => (
                <div key={i} className={`w-2 h-2 ${isDone ? 'bg-cyan-400' : 'bg-cyan-900'} scale-y-150 transform skew-x-[-30deg]`} />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function BootScreen() {
  const [isBooted, setIsBooted] = useState(false);
  
  // Also dispatch global event in case components miss the exact timeout window
  useEffect(() => {
    if (isBooted) {
      window.dispatchEvent(new Event('bootComplete'));
    }
  }, [isBooted]);

  if (isBooted) return null;
  return <BootSequence onComplete={() => setIsBooted(true)} />;
}
