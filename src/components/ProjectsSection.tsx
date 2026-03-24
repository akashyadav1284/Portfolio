'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface Project {
  _id: string;
  title: string;
  description: string;
  techStack: string[];
  githubLink: string;
  liveLink: string;
  image?: string;
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  // Disable scroll when modal is open
  useEffect(() => {
    if (selectedProject) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [selectedProject]);

  const [projectsVisible, setProjectsVisible] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) setProjects(await res.json());
      } catch (err) {
        console.error("Failed to load projects", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleInitialize = () => {
    // Optional click sound
    // const audio = new Audio('/click.mp3'); audio.play().catch(()=>{});

    setIsTransitioning(true);
    
    // Dispatch event to accelerate background grid/stars in SceneBackground
    window.dispatchEvent(new CustomEvent('projectsInitialized'));

    setTimeout(() => {
        setProjectsVisible(true);
        setIsTransitioning(false);
    }, 1500); // 1.5s cinematic flash/zoom transition
  };

  return (
    <section id="projects" className="py-32 relative z-10 w-full min-h-screen">
      
      {/* Background radial effects */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-electric-blue/5 rounded-full blur-[100px] pointer-events-none mix-blend-screen" />
      <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[80px] pointer-events-none mix-blend-screen" />

      {/* Subtle White Flash on Transition */}
      <AnimatePresence>
         {isTransitioning && (
           <motion.div 
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             transition={{ duration: 0.8 }}
             className="fixed inset-0 bg-white/20 z-[900] pointer-events-none mix-blend-overlay"
           />
         )}
      </AnimatePresence>

      <div className="container mx-auto px-6 max-w-7xl relative" ref={ref}>
         <AnimatePresence mode="wait">
            {!projectsVisible ? (
                <motion.div 
                   key="intro"
                   initial={{ opacity: 0, y: 30 }}
                   animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                   exit={{ opacity: 0, scale: 2, filter: "blur(10px)" }}
                   transition={{ duration: 1, ease: "easeInOut" }}
                   className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-12"
                >
                    <motion.div
                       initial={{ opacity: 0 }}
                       animate={{ opacity: 1 }}
                       transition={{ delay: 0.5, duration: 2 }}
                       className="relative"
                    >
                       <p className="text-2xl md:text-3xl lg:text-4xl font-inter italic text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 max-w-4xl mx-auto leading-relaxed tracking-wide drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                           "Every line of code here tells a story.
                       </p>
                       <p className="text-xl md:text-2xl lg:text-3xl font-orbitron font-bold text-cyan-400 mt-6 inline-block drop-shadow-[0_0_15px_rgba(0,243,255,0.6)] animate-pulse shadow-cyan-400">
                           Scroll deeper… if you're ready."
                       </p>
                       <div className="absolute -inset-10 bg-cyan-900/10 blur-[50px] -z-10 rounded-full animate-pulse" />
                    </motion.div>

                    <motion.button
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: 1.5, duration: 1 }}
                       whileHover={{ scale: 1.05, textShadow: "0 0 8px rgb(255,255,255)" }}
                       whileTap={{ scale: 0.95 }}
                       onClick={handleInitialize}
                       className="relative group px-12 py-5 bg-black/40 backdrop-blur-md border border-cyan-400/50 rounded-full overflow-hidden transition-all duration-300 hover:border-white hover:bg-cyan-950/40 hover:shadow-[0_0_40px_rgba(150,0,255,0.4)] click-sound"
                    >
                       <div className="absolute inset-0 w-1/4 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[200%] skew-x-[30deg] group-hover:translate-x-[400%] transition-transform duration-1000 ease-out" />
                       <span className="relative z-10 font-mono text-lg uppercase tracking-[0.4em] font-bold text-white transition-colors">
                           Initialize Projects
                       </span>
                    </motion.button>
                </motion.div>
            ) : (
                <motion.div 
                   key="projects-grid"
                   initial={{ opacity: 0, scale: 0.9 }}
                   animate={{ opacity: 1, scale: 1 }}
                   transition={{ duration: 1, ease: "easeOut" }}
                >
                    <div className="mb-20 text-center">
                      <h2 className="text-5xl md:text-7xl font-black font-orbitron mb-4 tracking-tighter text-white drop-shadow-[0_0_15px_rgba(0,51,255,0.8)]">
                         PROJECTS
                      </h2>
                      <div className="flex justify-center items-center gap-4 text-slate-400 font-mono text-sm tracking-[0.2em] uppercase">
                        <div className="w-8 h-px bg-neon-cyan"></div>
                        <span>Executed Systems</span>
                        <div className="w-8 h-px bg-neon-cyan"></div>
                      </div>
                    </div>

                    {loading ? (
                      <div className="flex justify-center py-20">
                         <div className="w-16 h-16 border-4 border-electric-blue border-t-neon-cyan rounded-full animate-spin shadow-[0_0_30px_#00f3ff]"></div>
                      </div>
                    ) : (
                      <div className="grid md:grid-cols-2 gap-10">
                        {projects.map((project, i) => (
                           <ProjectCard key={project._id} project={project} index={i} inView={true} onClick={() => setSelectedProject(project)} />
                        ))}
                      </div>
                    )}
                </motion.div>
            )}
         </AnimatePresence>
      </div>

      {/* Detailed Full Screen Interface */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-10 bg-[#02040A]/90 backdrop-blur-xl"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ y: 100, scale: 0.9, opacity: 0 }}
              animate={{ y: 0, scale: 1, opacity: 1 }}
              exit={{ y: 50, scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-[#0a0f1f] border border-neon-cyan/50 rounded-3xl shadow-[0_0_50px_rgba(0,243,255,0.2)] scrollbar-hide flex flex-col"
            >
              {/* Image Header */}
              <div className="relative w-full h-[40vh] bg-black shrink-0">
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0a0f1f] via-[#0a0f1f]/60 to-transparent z-10"></div>
                 <img src={selectedProject.image || "https://images.unsplash.com/photo-1639762681485-074b7f4ec651"} alt={selectedProject.title} className="w-full h-full object-cover opacity-60" />
                 
                 {/* Close Button */}
                 <button onClick={() => setSelectedProject(null)} className="absolute top-6 right-6 z-30 w-12 h-12 bg-black/50 border border-slate-700 hover:border-red-500 rounded-full flex items-center justify-center text-white hover:text-red-500 transition-colors backdrop-blur-md">
                   ✕
                 </button>
                 
                 <div className="absolute bottom-6 left-8 z-20">
                    <span className="px-4 py-1.5 bg-black border border-electric-blue rounded-full text-xs font-mono text-neon-cyan uppercase shadow-[0_0_15px_rgba(0,51,255,0.6)] backdrop-blur-md mb-4 inline-block tracking-widest">SYSTEM DEPLOYMENT</span>
                    <h2 className="text-4xl md:text-6xl font-black font-orbitron text-white drop-shadow-xl">{selectedProject.title}</h2>
                 </div>
              </div>

              {/* Detailed Content */}
              <div className="p-8 md:p-12 flex-grow">
                 <div className="grid lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-8">
                       <div>
                         <h3 className="text-xl font-bold font-orbitron text-cyan-500 mb-4 tracking-widest uppercase border-b border-slate-800 pb-2">Architecture Overview</h3>
                         <p className="text-slate-300 font-inter leading-relaxed text-lg">{selectedProject.description}</p>
                       </div>
                       
                       <div>
                         <h3 className="text-xl font-bold font-orbitron text-cyan-500 mb-4 tracking-widest uppercase border-b border-slate-800 pb-2">Core Tech Specs</h3>
                         <div className="flex flex-wrap gap-3">
                           {selectedProject.techStack.map(stack => (
                             <span key={stack} className="px-4 py-2 font-mono text-xs uppercase font-bold text-electric-blue bg-electric-blue/10 border border-electric-blue/50 rounded-lg shadow-inner">
                               {stack}
                             </span>
                           ))}
                         </div>
                       </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-black/50 border border-slate-800 rounded-2xl p-6">
                           <h3 className="text-sm font-bold font-mono text-slate-500 mb-4 tracking-[0.2em] uppercase">Deployment Links</h3>
                           <div className="space-y-4">
                             <a href={selectedProject.liveLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between text-center py-4 px-6 rounded-xl uppercase font-orbitron font-bold text-sm tracking-widest bg-electric-blue text-white hover:bg-neon-cyan hover:text-black hover:shadow-[0_0_30px_rgba(0,243,255,0.7)] group transition-all">
                               <span>Launch Live UI</span>
                               <span className="group-hover:translate-x-1 transition-transform">→</span>
                             </a>
                             <a href={selectedProject.githubLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-between text-center py-4 px-6 rounded-xl uppercase font-orbitron font-bold text-sm tracking-widest bg-black border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white transition-all">
                               <span>Source Code</span>
                               <span>&lt;/&gt;</span>
                             </a>
                           </div>
                        </div>
                        
                        <div className="bg-black/50 border border-slate-800 rounded-2xl p-6">
                           <h3 className="text-sm font-bold font-mono text-slate-500 mb-1 tracking-[0.2em] uppercase">STATUS</h3>
                           <p className="text-green-500 font-mono tracking-widest text-sm flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                             ACTIVE DEPLOYMENT
                           </p>
                        </div>
                    </div>
                 </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function ProjectCard({ project, index, inView, onClick }: { project: Project, index: number, inView: boolean, onClick: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6, delay: 0.1 + index * 0.1, type: "spring", stiffness: 100 }}
      onClick={onClick}
      className="group glass-card border flex flex-col rounded-3xl overflow-hidden relative border-slate-800 hover:border-neon-cyan shadow-lg bg-navy-900/40 cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
    >
      {/* Shine overlay that sweeps across on hover */}
      <div className="absolute top-0 -inset-full h-full w-1/2 z-20 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-10 group-hover:animate-shine pointer-events-none" />

      {/* Image Container */}
      <div className="h-64 sm:h-72 w-full relative overflow-hidden bg-black flex-shrink-0">
        <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#0a0f1f] to-transparent z-10" />
        <img 
           src={project.image || "https://images.unsplash.com/photo-1639762681485-074b7f4ec651?auto=format&fit=crop&q=80&w=800"} 
           alt={project.title} 
           className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[2s] ease-out"
        />
        
        <div className="absolute top-4 right-4 z-20">
           <span className="px-3 py-1 bg-black/60 border border-electric-blue rounded-full text-[10px] font-mono font-bold text-neon-cyan uppercase shadow-[0_0_15px_rgba(0,51,255,0.6)] backdrop-blur-md">
             ACTIVE_LINK
           </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-8 pb-10 flex flex-col flex-grow relative z-30">
        <h3 className="text-3xl font-orbitron font-bold text-white mb-3 group-hover:text-neon-cyan transition-colors">
          {project.title}
        </h3>
        <p className="text-slate-400 font-light leading-relaxed mb-6 flex-grow text-sm sm:text-base">
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.techStack.map(stack => (
            <span key={stack} className="px-3 py-1 font-mono text-[10px] uppercase font-bold text-electric-blue bg-electric-blue/10 border border-electric-blue/30 rounded">
              {stack}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-4 mt-auto border-t border-slate-800 pt-6">
           <button className="flex-1 btn-neon text-center py-3 rounded uppercase font-orbitron font-bold text-xs tracking-widest bg-black/40 pointer-events-none">
             Access Terminal /&gt;
           </button>
        </div>
      </div>
    </motion.div>
  );
}
