'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CursorGlow() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button'))) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseover', handleMouseOver, { passive: true });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full pointer-events-none z-0"
        animate={{
          x: mousePosition.x - 250,
          y: mousePosition.y - 250,
          scale: isHovered ? 1.5 : 1,
          opacity: isHovered ? 0.6 : 0.3
        }}
        transition={{
          type: "tween",
          ease: "circOut",
          duration: 0.15,
          scale: { duration: 0.4 }
        }}
        style={{
          background: 'radial-gradient(circle, rgba(0,243,255,0.15) 0%, rgba(157,78,221,0.05) 50%, rgba(0,0,0,0) 80%)',
          mixBlendMode: 'screen'
        }}
      />
      
      {/* Precision Core */}
      <motion.div
        className="fixed top-0 left-0 w-2 h-2 rounded-full pointer-events-none z-[100] mix-blend-screen"
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
          scale: isHovered ? 4 : 1,
          backgroundColor: isHovered ? 'rgba(157,78,221,0.8)' : 'rgba(0,243,255,1)'
        }}
        transition={{ type: "tween", ease: "linear", duration: 0.05 }}
      >
        <div className="absolute inset-0 rounded-full border border-cyan-300 animate-ping opacity-50 shadow-[0_0_10px_#00f3ff]"></div>
      </motion.div>
    </>
  );
}
