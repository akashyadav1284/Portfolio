'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function MobileWhatsAppButton() {
  const [isMobile, setIsMobile] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  const phoneNumber = '919467658854';
  const customMessage = "Hi Akash, I'm interested in working with you.";
  const link = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMessage)}`;

  useEffect(() => {
    // Only mount on strictly mobile devices (<= 768px)
    if (window.innerWidth <= 768) {
      setIsMobile(true);
      // Premium UX: Intermittently Auto-expand to attract user attention
      const t1 = setTimeout(() => setExpanded(true), 1500);
      const t2 = setTimeout(() => setExpanded(false), 9000); 
      return () => { clearTimeout(t1); clearTimeout(t2); };
    }
    
    // Resize Listener to handle hot-resizing testing
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) return null; // Explicitly hidden and unmounted on Desktop

  return (
    <div className="fixed bottom-5 left-5 z-[999] pointer-events-none flex items-center">
      
      {/* Container wrapping the whole expanding pill */}
      <motion.a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ y: 0 }}
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        className="relative flex items-center p-1 bg-black/80 backdrop-blur-md rounded-full border border-[#25D366]/40 shadow-[0_4px_20px_rgba(37,211,102,0.3)] pointer-events-auto active:scale-95 transition-transform overflow-hidden"
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => setExpanded(false)}
        onTouchStart={() => setExpanded(true)}
      >
        {/* Circular WhatsApp Icon (Always visible) */}
        <div className="relative flex items-center justify-center w-[52px] h-[52px] bg-gradient-to-br from-[#25D366] to-[#1ebe5d] rounded-full shadow-inner z-20 shrink-0">
          {/* Constant Ripple Pulse behind circle */}
          <div className="absolute inset-0 bg-[#25D366]/40 rounded-full animate-ping pointer-events-none" />
          
          <svg className="w-7 h-7 text-white relative z-10 drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.031 21c-1.566 0-3.094-.406-4.453-1.188L3 21l1.234-4.516c-.859-1.422-1.312-3.031-1.312-4.672 0-4.859 3.953-8.813 8.812-8.813s8.813 3.953 8.813 8.813-3.953 8.813-8.813 8.813zm0-16.14c-4.047 0-7.344 3.297-7.344 7.344 0 1.281.328 2.547.953 3.656l-.797 2.922 2.984-.797c1.078.594 2.313.906 3.563.906 4.047 0 7.344-3.297 7.344-7.344S16.078 4.86 12.031 4.86zm3.937 9.984c-.219-.109-1.281-.641-1.484-.719-.188-.078-.328-.109-.469.109-.141.219-.562.719-.688.859-.125.156-.266.172-.484.06-1.156-.516-2.125-1.109-2.922-2.313-.125-.188 0-.281.109-.391.109-.109.219-.25.328-.391.109-.141.141-.234.219-.391.078-.156.031-.312-.016-.422-.062-.125-.469-1.141-.656-1.563-.172-.391-.344-.344-.469-.344h-.391c-.172 0-.453.063-.688.313-.234.25-.906.891-.906 2.188 0 1.297.922 2.547 1.047 2.719.125.172 1.844 2.828 4.484 3.953 1.391.594 2 1.047 2.703 1.219s1.422.141 1.938.078c.578-.078 1.766-.719 2.016-1.422.25-.703.25-1.312.188-1.422-.094-.125-.328-.188-.547-.281z" />
          </svg>
          
          {/* Online Indicator Dot */}
          <span className="absolute top-0 right-0 w-3 h-3 bg-[#1ebe5d] border-[2px] border-[#0a0f1f] rounded-full shadow-[0_0_8px_#25D366] animate-pulse"></span>
        </div>

        {/* Text Container that functionally expands horizontally */}
        <motion.div
           initial={false}
           animate={{ width: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }}
           className="overflow-hidden flex items-center"
        >
          <div className="pl-3 pr-4 py-2 whitespace-nowrap">
            <span className="text-white text-sm font-medium mr-1.5 flex-none">Need Help?</span>
            <span className="text-[#25D366] text-sm font-bold tracking-wide drop-shadow-[0_0_5px_rgba(37,211,102,0.8)] flex-none">
              ask your query
            </span>
          </div>
        </motion.div>
      </motion.a>
    </div>
  );
}
