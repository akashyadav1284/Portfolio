'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Check if hovering over any interactable element
      const target = e.target as HTMLElement;
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('group') // For glowing text hovers
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  if (isMobile) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden mix-blend-screen">
      {/* Outer Ring Delay */}
      <motion.div
        animate={{
          x: mousePosition.x - 20,
          y: mousePosition.y - 20,
          scale: isHovering ? 1.8 : 1,
          opacity: isHovering ? 0.8 : 0.4
        }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.5 }}
        className="absolute w-[40px] h-[40px] border border-cyan-400 rounded-full shadow-[0_0_15px_rgba(0,243,255,0.6)]"
      />
      {/* Exact Center Dot */}
      <motion.div
        animate={{
          x: mousePosition.x - 4,
          y: mousePosition.y - 4,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0 }}
        className="absolute w-[8px] h-[8px] bg-cyan-300 rounded-full shadow-[0_0_10px_rgba(0,243,255,1)]"
      />
      {/* Soft Ambient Cursor GLow */}
      <motion.div
        animate={{
          x: mousePosition.x - 100,
          y: mousePosition.y - 100,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0 : 0.05
        }}
        transition={{ type: "spring", stiffness: 50, damping: 20 }}
        className="absolute w-[200px] h-[200px] bg-cyan-500 rounded-full blur-[40px]"
      />
    </div>
  );
}
