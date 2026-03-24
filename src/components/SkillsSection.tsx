'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Skill {
  _id: string;
  name: string;
  level?: number;
  category: string;
  icon?: string;
}

export default function SkillsSection() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await fetch('/api/skills');
        if (!res.ok) throw new Error('API Error');
        const data = await res.json();
        setSkills(data);
      } catch (err) {
        console.error("Failed to fetch skills, falling back to empty state.", err);
        setSkills([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  return (
    <section id="skills" className="py-32 relative z-10 w-full min-h-screen flex items-center bg-navy-900/10">
      
      {/* Matrix Data Backdrop */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{ backgroundImage: 'radial-gradient(var(--electric-blue) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>

      <div className="container mx-auto px-6 max-w-7xl relative" ref={ref}>
        <motion.div
           initial={{ opacity: 0, y: 50 }}
           animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
           transition={{ duration: 0.8 }}
           className="mb-20 text-center flex flex-col items-center"
        >
          <div className="inline-block relative">
            <h2 className="text-5xl md:text-7xl font-black font-orbitron mb-2 tracking-wide text-white underline decoration-electric-blue decoration-4 underline-offset-8">
              SKILLS_MATRIX
            </h2>
            <div className="absolute -top-6 -right-10 px-3 py-1 bg-neon-cyan text-black font-bold font-mono text-xs shadow-[0_0_20px_#00f3ff]">
              V2.0
            </div>
          </div>
          <p className="text-xl text-cyan-300 font-mono tracking-widest mt-8 px-6 py-2 border border-cyan-500/30 rounded bg-black/50 backdrop-blur-md">
            Processing tactical capabilities...
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-16 h-16 border-4 border-electric-blue border-t-neon-cyan rounded-full animate-spin shadow-[0_0_30px_#00f3ff]"></div>
          </div>
        ) : skills.length === 0 ? (
           <p className="text-center text-slate-400 font-mono">No nodes installed. Await admin configuration.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {skills.map((skill, i) => (
               <SkillNode key={skill._id} skill={skill} index={i} inView={inView} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SkillNode({ skill, index, inView }: { skill: Skill, index: number, inView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={inView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.5, y: 20 }}
      transition={{ duration: 0.5, delay: index * 0.05, type: "spring", stiffness: 120 }}
      className="glass-card relative flex flex-col items-center justify-center p-6 rounded-2xl group hover:-translate-y-2 hover:scale-[1.05] transition-transform duration-300 border border-slate-800 hover:border-neon-cyan cursor-crosshair min-h-[160px] bg-black/60"
    >
      {/* 3D Floating Glow under icon */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-electric-blue/20 rounded-full blur-[25px] group-hover:bg-neon-cyan/40 group-hover:blur-[35px] transition-all duration-500 z-0"></div>

      <div className="relative z-10 flex flex-col items-center gap-4">
        {skill.icon ? (
          <img src={skill.icon} alt={skill.name} className="w-12 h-12 object-contain filter group-hover:brightness-125 group-hover:drop-shadow-[0_0_15px_#00f3ff] transition-all" />
        ) : (
          <div className="w-12 h-12 rounded-lg border-2 border-electric-blue flex items-center justify-center text-neon-cyan font-bold font-mono group-hover:border-neon-cyan group-hover:bg-neon-cyan/10 transition-colors shadow-[0_0_15px_rgba(0,51,255,0.4)]">
            {skill.name.charAt(0)}
          </div>
        )}
        
        <div className="text-center">
          <h3 className="text-base font-orbitron font-bold text-slate-200 group-hover:text-white transition-colors uppercase tracking-wider">
            {skill.name}
          </h3>
          <p className="text-[10px] text-cyan-500 uppercase font-mono mt-1 opacity-60 group-hover:opacity-100">
            {skill.category}
          </p>
        </div>
      </div>
      
      {/* Edge highlight lines */}
      <div className="absolute top-0 right-0 w-4 h-px bg-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute top-0 right-0 w-px h-4 bg-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-4 h-px bg-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0 w-px h-4 bg-neon-cyan opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
  );
}
