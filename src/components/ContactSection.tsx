'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', linkedin: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [rating, setRating] = useState(0);
  const [ratingStatus, setRatingStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch (error) {
      setStatus('error');
    }
  };

  const handleRatingSubmit = async (stars: number) => {
    setRating(stars);
    setRatingStatus('submitting');
    try {
      const res = await fetch('/api/rating', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stars })
      });
      if (res.ok) setRatingStatus('success');
      else setRatingStatus('idle'); // revert on error silently or show toast
    } catch (e) {
      setRatingStatus('idle');
    }
  };

  return (
    <section id="contact" className="py-32 relative z-10 w-full min-h-screen flex flex-col items-center">

      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-electric-blue/10 rounded-full blur-[150px] pointer-events-none mix-blend-screen" />

      <div className="container mx-auto px-6 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black font-orbitron mb-4 tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,243,255,0.6)] uppercase">
            Let's Code and Connect With Me
          </h2>
          <div className="w-24 h-1 bg-neon-cyan mx-auto mb-6 shadow-[0_0_10px_#00f3ff]"></div>


        </motion.div>

        {/* Contact Form Terminal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card bg-black/60 border border-slate-800 rounded-3xl p-8 md:p-12 relative overflow-hidden backdrop-blur-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        >
          {/* Top Bar Decoration */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-transparent via-electric-blue to-transparent"></div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-cyan-500 font-bold tracking-[0.2em] uppercase ml-1">IDENTIFIER <span className="text-neon-cyan">*</span></label>
                <input required type="text" placeholder="Your Name" className="w-full bg-[#050b14] border border-slate-800 rounded-lg py-4 px-5 text-slate-300 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all font-mono" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-cyan-500 font-bold tracking-[0.2em] uppercase ml-1">NETWORK_ROUTING <span className="text-neon-cyan">*</span></label>
                <input required type="email" placeholder="Email Address" className="w-full bg-[#050b14] border border-slate-800 rounded-lg py-4 px-5 text-slate-300 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all font-mono" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] text-cyan-500 font-bold tracking-[0.2em] uppercase ml-1">LINKEDIN_URL <span className="text-slate-600">(OPTIONAL)</span></label>
                <input type="url" placeholder="https://linkedin.com/in/..." className="w-full bg-[#050b14] border border-slate-800 rounded-lg py-4 px-5 text-slate-300 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all font-mono" value={formData.linkedin} onChange={e => setFormData({ ...formData, linkedin: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-cyan-500 font-bold tracking-[0.2em] uppercase ml-1">COMMLINK_PHONE <span className="text-slate-600">(OPTIONAL)</span></label>
                <input type="tel" placeholder="Phone Number" className="w-full bg-[#050b14] border border-slate-800 rounded-lg py-4 px-5 text-slate-300 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all font-mono" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-cyan-500 font-bold tracking-[0.2em] uppercase ml-1">DATA_PAYLOAD <span className="text-neon-cyan">*</span></label>
              <textarea required rows={5} placeholder="Initiate handshake protocol..." className="w-full bg-[#050b14] border border-slate-800 rounded-lg py-4 px-5 text-slate-300 focus:outline-none focus:border-neon-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.3)] transition-all font-mono resize-none" value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}></textarea>
            </div>

            <button
              disabled={status === 'sending' || status === 'success'}
              type="submit"
              className={`w-full py-5 rounded-lg font-orbitron font-bold tracking-[0.2em] uppercase transition-all duration-300 relative overflow-hidden group
                ${status === 'success' ? 'bg-green-500 text-black shadow-[0_0_30px_#10b981]'
                  : 'bg-black border border-electric-blue text-electric-blue hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_30px_#00f3ff]'}`}
            >
              <div className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out z-0" />
              <span className="relative z-10 flex items-center justify-center gap-3">
                {status === 'idle' && 'TRANSMIT SIGNAL'}
                {status === 'sending' && 'ENCRYPTING & SENDING...'}
                {status === 'success' && 'TRANSMISSION SECURE'}
                {status === 'error' && 'CONNECTION FAILED - RETRY'}
              </span>
            </button>
          </form>
        </motion.div>

        {/* 5-Star Rating System */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-24 text-center border-t border-slate-800 pt-16"
        >
          <div className="inline-block relative mb-6">
            <div className="absolute -inset-4 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.1),transparent_70%)] blur-xl"></div>
            <h3 className="text-2xl md:text-3xl font-orbitron font-bold text-white relative z-10 tracking-widest uppercase mb-1">
              HOW WAS YOUR EXPERIENCE?
            </h3>
            <p className="text-slate-500 font-mono text-xs tracking-widest uppercase">RATE THE SYSTEM ARCHITECTURE</p>
          </div>

          <div className="flex justify-center gap-2 mb-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRatingSubmit(star)}
                disabled={ratingStatus === 'success'}
                className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center rounded-xl font-black text-2xl md:text-3xl transition-all duration-300 border backdrop-blur-md transform hover:-translate-y-2
                    ${rating >= star || ratingStatus === 'success' && rating >= star ? 'bg-yellow-400 text-black border-yellow-300 shadow-[0_0_30px_rgba(250,204,21,0.6)] animate-pulse' : 'bg-black/50 border-slate-800 text-slate-600 hover:border-yellow-500/50 hover:text-yellow-500'}`}
              >
                ★
              </button>
            ))}
          </div>

          <div className="h-8">
            {ratingStatus === 'success' && (
              <span className="text-green-400 font-mono text-sm uppercase tracking-widest drop-shadow-[0_0_10px_#10b981]">
                RATING LOGGED IN BLOCKCHAIN. THANK YOU.
              </span>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
