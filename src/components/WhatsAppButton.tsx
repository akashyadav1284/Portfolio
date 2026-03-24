'use client';

import { motion } from 'framer-motion';

export default function WhatsAppButton() {
  const phoneNumber = '919467658854';
  const customMessage = "Hi Akash, I'm interested in working with you.";

  return (
    <div className="fixed bottom-5 left-5 z-[999] flex items-center group pointer-events-none">
      
      {/* Ripple Pulse Effect Behind Button */}
      <div className="absolute left-0 top-0 w-[60px] h-[60px] bg-[#25D366]/40 rounded-full animate-ping pointer-events-none" />
      
      {/* The Main Circular Button */}
      <motion.a
        href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-[60px] h-[60px] bg-gradient-to-br from-[#25D366] to-[#1ebe5d] rounded-full shadow-[0_0_20px_rgba(37,211,102,0.5)] transition-all z-20 pointer-events-auto"
      >
        {/* WhatsApp Icon */}
        <svg
          className="w-8 h-8 text-white relative z-10 drop-shadow-md"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12.031 21c-1.566 0-3.094-.406-4.453-1.188L3 21l1.234-4.516c-.859-1.422-1.312-3.031-1.312-4.672 0-4.859 3.953-8.813 8.812-8.813s8.813 3.953 8.813 8.813-3.953 8.813-8.813 8.813zm0-16.14c-4.047 0-7.344 3.297-7.344 7.344 0 1.281.328 2.547.953 3.656l-.797 2.922 2.984-.797c1.078.594 2.313.906 3.563.906 4.047 0 7.344-3.297 7.344-7.344S16.078 4.86 12.031 4.86zm3.937 9.984c-.219-.109-1.281-.641-1.484-.719-.188-.078-.328-.109-.469.109-.141.219-.562.719-.688.859-.125.156-.266.172-.484.06-1.156-.516-2.125-1.109-2.922-2.313-.125-.188 0-.281.109-.391.109-.109.219-.25.328-.391.109-.141.141-.234.219-.391.078-.156.031-.312-.016-.422-.062-.125-.469-1.141-.656-1.563-.172-.391-.344-.344-.469-.344h-.391c-.172 0-.453.063-.688.313-.234.25-.906.891-.906 2.188 0 1.297.922 2.547 1.047 2.719.125.172 1.844 2.828 4.484 3.953 1.391.594 2 1.047 2.703 1.219s1.422.141 1.938.078c.578-.078 1.766-.719 2.016-1.422.25-.703.25-1.312.188-1.422-.094-.125-.328-.188-.547-.281z" />
        </svg>

        {/* Glowing Dot near Icon */}
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-white rounded-full border-2 border-[#1ebe5d] shadow-[0_0_8px_white] animate-pulse"></span>
      </motion.a>

      {/* Smooth Expanding Message Box */}
      {/* On Mobile: Always visible, On Desktop: Expands on hover */}
      <a 
         href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(customMessage)}`}
         target="_blank"
         rel="noopener noreferrer"
         className="ml-4 px-5 py-3 rounded-2xl bg-black/70 backdrop-blur-md border border-[#25D366]/40 shadow-[0_0_15px_rgba(37,211,102,0.2)] whitespace-nowrap opacity-100 translate-x-0 md:opacity-0 md:-translate-x-[10px] md:group-hover:opacity-100 md:group-hover:translate-x-0 transition-all duration-300 ease-in-out cursor-pointer pointer-events-auto z-10"
      >
        <span className="text-white text-sm font-medium mr-2">Need Help?</span>
        <span className="text-[#25D366] text-sm font-bold tracking-wide drop-shadow-[0_0_8px_rgba(37,211,102,0.8)]">ask your query</span>
      </a>
    </div>
  );
}
