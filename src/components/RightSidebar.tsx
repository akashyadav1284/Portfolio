'use client';

import { useEffect, useState } from 'react';

export default function RightSidebar() {
  const [activePhase, setActivePhase] = useState(1);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      const phase = Math.min(5, Math.max(1, Math.floor(scrollPos / windowHeight) + 1));
      setActivePhase(phase);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {/* Left HUD Information (CREST Match) */}
      <div className="fixed left-6 top-32 hidden xl:flex flex-col space-y-2 z-[60] font-mono text-xs tracking-widest text-slate-500 pointer-events-none">
        <div className="flex items-center gap-2">
           <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]"></div>
           <span className="text-red-500 font-bold uppercase">CLEARANCE: OMEGA</span>
        </div>
        <div className="text-neon-cyan/70 font-bold uppercase pt-1">
          AKASH_NET V2.0
        </div>
      </div>

      {/* Right HUD Information (CREST Match) */}
      <div className="fixed right-6 top-32 hidden xl:flex flex-col items-end space-y-2 z-[60] font-mono text-[10px] tracking-widest text-slate-500 pointer-events-none">
        <div className="flex items-center gap-2">
           <span className="uppercase text-slate-400">UPTIME: 99.93%</span>
        </div>
        <div className="flex items-center gap-2">
           <span className="text-green-500 uppercase">ENCRYPTION: ACTIVE</span>
           <div className="w-1 h-1 bg-green-500 shadow-[0_0_5px_#10b981]"></div>
        </div>
      </div>

      {/* Right Phases System UI */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 hidden xl:flex flex-col space-y-6 z-[60] font-mono font-bold text-xs tracking-[0.2em] uppercase text-slate-600 pointer-events-auto pr-6">
        {[1,2,3,4,5].map((num) => (
          <div key={num} className="group flex items-center justify-end relative cursor-pointer" onClick={() => window.scrollTo({ top: (num-1)*window.innerHeight, behavior: 'smooth'})}>
            <span className={`transition-all duration-300 mr-4 ${activePhase === num ? 'text-neon-cyan drop-shadow-[0_0_10px_#00f3ff]' : 'group-hover:text-electric-blue'}`}>
              PHASE {num}
            </span>
            <div className={`w-0.5 h-8 transition-colors duration-300 ${activePhase === num ? 'bg-neon-cyan shadow-[0_0_10px_#00f3ff]' : 'bg-slate-800 group-hover:bg-electric-blue'}`}></div>
          </div>
        ))}
      </div>
    </>
  );
}
