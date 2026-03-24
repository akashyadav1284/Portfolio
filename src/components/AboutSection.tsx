'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { Github, Linkedin, Instagram, Mail, Phone } from 'lucide-react';

// -------------------------------------------------------------
// AnimatedText Component
// -------------------------------------------------------------
const AnimatedText = ({ text, delay = 0, className = '' }: { text: string; delay?: number; className?: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={`font-mono tracking-widest ${className}`}
    >
      {text}
    </motion.div>
  );
};

// -------------------------------------------------------------
// GlitchHeading Component
// -------------------------------------------------------------
const GlitchHeading = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  return (
    <motion.h2
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="text-4xl md:text-5xl lg:text-7xl font-black font-orbitron uppercase text-white mb-2 relative group tracking-tighter"
    >
      <span className="relative z-10 drop-shadow-[0_0_15px_rgba(0,243,255,0.8)]">{text}</span>
      <span className="absolute top-0 left-[2px] -z-10 text-red-500 opacity-70 group-hover:animate-ping mix-blend-screen">{text}</span>
      <span className="absolute top-0 -left-[2px] -z-10 text-blue-500 opacity-70 group-hover:animate-pulse mix-blend-screen">{text}</span>
    </motion.h2>
  );
};

// -------------------------------------------------------------
// Social3DIcons Component
// -------------------------------------------------------------
const Social3DIcons = () => {
  const links = [
    { name: 'GitHub', icon: <Github size={24} />, url: 'https://github.com/akashyadav1284', color: 'shadow-[0_0_20px_rgba(255,255,255,0.4)]', hoverBorder: 'hover:border-white' },
    { name: 'LinkedIn', icon: <Linkedin size={24} />, url: 'https://www.linkedin.com/in/akash-yadav-403676379/', color: 'shadow-[0_0_20px_rgba(0,119,181,0.6)]', hoverBorder: 'hover:border-[#0077b5]' },
    { name: 'Instagram', icon: <Instagram size={24} />, url: 'https://instagram.com/akasxh_yadav', color: 'shadow-[0_0_20px_rgba(225,48,108,0.6)]', hoverBorder: 'hover:border-[#e1306c]' },
    { name: 'Gmail', icon: <Mail size={24} />, url: 'mailto:akashyadav9992462520@gmail.com', color: 'shadow-[0_0_20px_rgba(234,67,53,0.6)]', hoverBorder: 'hover:border-[#ea4335]' },
    { name: 'CommLink', icon: <Phone size={24} />, url: 'tel:+919467658854', color: 'shadow-[0_0_20px_rgba(16,185,129,0.6)]', hoverBorder: 'hover:border-[#10b981]' }
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
      {links.map((link, i) => (
        <motion.a
          key={link.name}
          href={link.url}
          target={link.name !== 'Gmail' && link.name !== 'CommLink' ? "_blank" : "_self"}
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 30, rotateX: 45 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 + (i * 0.1), type: 'spring' }}
          whileHover={{ scale: 1.1, rotateZ: 5, y: -5 }}
          className={`relative group flex flex-col items-center justify-center p-6 bg-black/40 backdrop-blur-xl border border-cyan-900/30 rounded-2xl ${link.hoverBorder} transition-all duration-300 z-10 overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent`}
        >
          {/* Ambient Background Glow on Hover */}
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 scale-150 rounded-full blur-2xl ${link.color} bg-current pointer-events-none mix-blend-screen`}></div>

          <div className="text-slate-300 group-hover:text-white transition-colors relative z-10 mb-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
            {link.icon}
          </div>
          <span className="text-[10px] font-mono text-cyan-600 group-hover:text-cyan-400 uppercase tracking-widest relative z-10">
            {link.name}
          </span>
        </motion.a>
      ))}
    </div>
  );
};

// -------------------------------------------------------------
// Interactive Counter Hook
// -------------------------------------------------------------
function useCounter(end: number, duration: number = 2) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const inView = useInView(nodeRef, { once: true });

  useEffect(() => {
    if (!inView) return;
    let startTimestamp: number | null = null;
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  }, [end, duration, inView]);

  return { count, nodeRef };
}

// -------------------------------------------------------------
// Main AboutSection Component
// -------------------------------------------------------------
export default function AboutSection() {
  const { count: projects, nodeRef: pRef } = useCounter(6, 2);
  const { count: commits, nodeRef: cRef } = useCounter(37, 2.5);
  const { count: skills, nodeRef: sRef } = useCounter(18, 2);

  return (
    <section id="about" className="py-32 relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#02040A]">

      {/* 🌌 Cinematic Background Fog & Grid Overlays */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Purple/Cyan depth blur */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-purple-900/10 rounded-full blur-[150px] mix-blend-screen" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-900/10 rounded-full blur-[150px] mix-blend-screen" />
        {/* Subtle Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#02040A]/80 to-[#02040A] z-0" />
      </div>

      <div className="container mx-auto px-6 max-w-7xl relative z-10">

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center mb-24">
          {/* LEFT SIDE: Identity Reveal Narrative */}
          <div className="space-y-8">
            <div className="space-y-2 relative">
              <div className="absolute -left-6 top-2 bottom-2 w-1 bg-gradient-to-b from-cyan-500 to-purple-600 rounded-full shadow-[0_0_15px_rgba(0,243,255,0.6)]" />
              <AnimatedText text="[ UPLINK SECURE ]" delay={0.1} className="text-[10px] text-cyan-600 uppercase" />
              <GlitchHeading text="IDENTITY DETECTED" delay={0.2} />
              <AnimatedText text="Initializing Developer Profile..." delay={0.4} className="text-sm text-purple-400 uppercase" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="p-6 bg-black/40 border border-white/5 rounded-2xl backdrop-blur-md shadow-[inset_0_0_30px_rgba(0,0,0,0.8)] relative group overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

              <p className="text-xl md:text-2xl font-orbitron text-white leading-relaxed mb-6">
                "I don't just write code.<br />
                <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">I architect digital realities.</span>"
              </p>

              <ul className="space-y-4 font-mono text-sm tracking-widest text-slate-400">
                <li className="flex items-center gap-4">
                  <span className="text-cyan-700 w-24">NAME:</span>
                  <span className="text-white">Akash Yadav</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-cyan-700 w-24">COURSE:</span>
                  <span className="text-white">B.Tech CSE (AIML)</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-cyan-700 w-24">YEAR:</span>
                  <span className="text-white">1st Year</span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-cyan-700 w-24">COLLEGE:</span>
                  <span className="text-white">Lovely Professional University</span>
                </li>
              </ul>
            </motion.div>

            <AnimatedText
              text="Focused on building intelligent systems, scalable architectures, and future-ready web experiences."
              delay={0.8}
              className="text-sm text-slate-500 italic border-l border-cyan-900/50 pl-4 py-1"
            />
          </div>

          {/* RIGHT SIDE: Connect Node */}
          <div className="relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="absolute -inset-10 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.05),transparent_70%)] pointer-events-none"
            />

            <div className="mb-8">
              <AnimatedText text="/// CONNECT NODE" delay={0.4} className="text-sm text-cyan-500 uppercase font-bold mb-2" />
              <div className="h-[1px] w-full bg-gradient-to-r from-cyan-900 to-transparent" />
            </div>

            <Social3DIcons />
          </div>
        </div>

        {/* BOTTOM: System Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-cyan-900/30"
        >
          {/* Stat: Projects */}
          <div ref={pRef} className="flex flex-col items-center justify-center p-8 bg-black/30 border border-white/5 rounded-2xl backdrop-blur-sm relative group overflow-hidden">
            <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/5 transition-colors duration-500" />
            <span className="text-5xl font-black font-orbitron text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{projects}+</span>
            <span className="text-[10px] font-mono text-cyan-600 uppercase tracking-widest mt-2">Active Deployments</span>
          </div>

          {/* Stat: Skills */}
          <div ref={sRef} className="flex flex-col items-center justify-center p-8 bg-black/30 border border-white/5 rounded-2xl backdrop-blur-sm relative group overflow-hidden">
            <div className="absolute inset-0 bg-purple-500/0 group-hover:bg-purple-500/5 transition-colors duration-500" />
            <span className="text-5xl font-black font-orbitron text-cyan-400 drop-shadow-[0_0_15px_rgba(0,243,255,0.6)]">{skills}+</span>
            <span className="text-[10px] font-mono text-cyan-600 uppercase tracking-widest mt-2">Tech Stacks</span>
          </div>

          {/* Stat: Commits */}
          <div ref={cRef} className="flex flex-col items-center justify-center p-8 bg-black/30 border border-white/5 rounded-2xl backdrop-blur-sm relative group overflow-hidden">
            <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors duration-500" />
            <span className="text-5xl font-black font-orbitron text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">{commits}</span>
            <span className="text-[10px] font-mono text-cyan-600 uppercase tracking-widest mt-2">Commits Logged</span>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
