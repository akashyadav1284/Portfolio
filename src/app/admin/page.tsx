'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Dashboard State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [ratings, setRatings] = useState<any[]>([]);
  
  // Form Modals
  const [showSkillForm, setShowSkillForm] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editProjectId, setEditProjectId] = useState<string | null>(null);
  
  // New States
  const [newSkill, setNewSkill] = useState({ name: '', category: '', level: 80, icon: '' });
  const [newProject, setNewProject] = useState({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: '' });

  useEffect(() => {
    if (document.cookie.includes('token=')) setIsAuth(true);
  }, []);

  useEffect(() => {
    if (isAuth) fetchDashboardData();
  }, [isAuth]);

  const fetchDashboardData = async () => {
    try {
       const [sRes, pRes, mRes, uRes, rRes] = await Promise.all([
         fetch('/api/skills'),
         fetch('/api/projects'),
         fetch('/api/contact'),
         fetch('/api/users'),
         fetch('/api/rating')
       ]);
       const sData = await sRes.json();
       const pData = await pRes.json();
       const mData = await mRes.json();
       const uData = await uRes.json();
       const rData = await rRes.json();
       
       setSkills(Array.isArray(sData) ? sData : []);
       setProjects(Array.isArray(pData) ? pData : []);
       setMessages(Array.isArray(mData) ? mData : (mData.contacts ? mData.contacts : []));
       setUsers(Array.isArray(uData) ? uData : (uData.users ? uData.users : []));
       setRatings(Array.isArray(rData) ? rData : (rData.ratings ? rData.ratings : []));
    } catch(e) {
       console.log('Error fetching data');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        document.cookie = `token=${data.token}; path=/; max-age=43200; Secure; SameSite=Strict`;
        setIsAuth(true);
      } else {
        setError((await res.json()).error || 'Login failed');
      }
    } catch (err) {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const addSkill = async () => {
    const res = await fetch('/api/skills', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...newSkill, level: Number(newSkill.level) })
    });
    if (res.ok) {
        setShowSkillForm(false);
        setNewSkill({ name: '', category: '', level: 80, icon: '' });
        fetchDashboardData();
    }
  };

  const deleteSkill = async (id: string) => {
    if (!confirm('Delete this skill?')) return;
    const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
    if (res.ok) fetchDashboardData();
  };

  const addProject = async () => {
    if (!newProject.title.trim()) return alert("Validation Error: Please enter a Title for your project.");
    if (!newProject.description.trim()) return alert("Validation Error: Please enter a Description mapping for your project.");
    
    const payload = {
       ...newProject,
       techStack: newProject.techStack.split(',').map(s => s.trim())
    };

    const method = editProjectId ? 'PUT' : 'POST';
    const url = editProjectId ? `/api/projects/${editProjectId}` : '/api/projects';

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (res.ok) {
        setShowProjectForm(false);
        setNewProject({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: '' });
        setEditProjectId(null);
        fetchDashboardData();
    } else {
        const data = await res.json();
        alert('Failed: ' + (data.error || 'Unknown error'));
    }
  };

  const handleEditProject = (project: any) => {
    setNewProject({
      title: project.title,
      description: project.description,
      techStack: project.techStack.join(', '),
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || '',
      image: project.image || ''
    });
    setEditProjectId(project._id);
    setShowProjectForm(true);
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    if (res.ok) {
        fetchDashboardData();
    } else {
        const data = await res.json();
        alert('Failed: ' + (data.error || 'Unknown error'));
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Delete this message?')) return;
    const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
    if (res.ok) fetchDashboardData();
  }

  const changeUserStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (res.ok) fetchDashboardData();
  }

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user request?')) return;
    const res = await fetch(`/api/users/${id}`, { method: 'DELETE' });
    if (res.ok) fetchDashboardData();
  }

  const handleLogout = () => {
     document.cookie = 'token=; Max-Age=0; path=/';
     setIsAuth(false);
  }

  if (!isAuth) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black font-sans relative overflow-hidden">
         {/* Exact subtle red glow from the screenshot's left/center */}
         <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[600px] h-[600px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
         
         <motion.div 
           initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
           className="w-full max-w-[420px] border border-red-900/30 rounded-2xl bg-black shadow-[0_0_50px_rgba(200,0,0,0.05)] p-12 relative z-10"
         >
            <div className="flex flex-col items-center mb-8">
               {/* CREST Logo Inline */}
               <div className="w-16 h-16 bg-[#111] rounded-lg border border-red-900/50 flex items-center justify-center p-2 mb-6 shadow-[#ff000044]_0_0_15px">
                 <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-10 h-10">
                    <path d="M70 20 L30 20 L15 50 L30 80 L70 80" stroke="#ef4444" strokeWidth="12" fill="none" strokeLinecap="square" strokeLinejoin="miter"/>
                    <path d="M40 35 L55 50 L40 65" stroke="#ef4444" strokeWidth="8" fill="none" strokeLinecap="square"/>
                 </svg>
               </div>
               
               <h1 className="text-xl font-black text-white tracking-[0.1em] font-orbitron uppercase text-center flex items-center gap-2">
                 ADMIN <span className="text-red-500">PORTAL</span>
               </h1>
               <p className="text-[10px] text-slate-500 mt-2 font-mono tracking-wide text-center uppercase">
                 Secure access restricted to authorized personnel.
               </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-6">
               <div className="space-y-2">
                 <label className="text-[10px] text-slate-400 font-bold tracking-[0.1em] uppercase block">
                   ADMIN ID <span className="text-red-500">*</span>
                 </label>
                 <input 
                    type="text" 
                    required 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    className="w-full bg-[#0a0f16]/30 border border-white/5 rounded-md py-3 px-4 text-slate-300 text-sm focus:border-red-900/50 focus:outline-none transition-all placeholder:text-slate-600" 
                    placeholder="Enter Admin ID"
                 />
               </div>
               
               <div className="space-y-2">
                 <label className="text-[10px] text-slate-400 font-bold tracking-[0.1em] uppercase block">
                   PASS KEY <span className="text-red-500">*</span>
                 </label>
                 <input 
                    type="password" 
                    required 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    className="w-full bg-[#0a0f16]/30 border border-white/5 rounded-md py-3 px-4 text-slate-300 text-xl tracking-widest focus:border-red-900/50 focus:outline-none transition-all placeholder:text-slate-600 font-mono" 
                    placeholder="••••••••"
                 />
               </div>
               
               {error && <p className="text-red-500 text-xs font-mono text-center">{error}</p>}
               
               <button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-[#2a0000] border border-red-900/50 text-red-500 hover:text-white hover:bg-red-900/80 text-[10px] font-bold tracking-[0.2em] py-4 rounded-md transition-all shadow-inner uppercase mt-4"
               >
                 {loading ? 'Authenticating...' : 'Access System'}
               </button>
            </form>
            
            <button 
               onClick={() => router.push('/')} 
               className="w-full text-center text-[10px] text-slate-600 hover:text-white uppercase tracking-[0.1em] mt-10 transition-colors font-bold"
            >
               RETURN TO HOMEPAGE
            </button>
         </motion.div>
      </div>
    );
  }

  // Dashboard Calculations
  const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b.stars, 0) / ratings.length).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-[#02040A] text-white flex flex-col md:flex-row font-inter overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-black/60 border-r border-cyan-900/50 flex flex-col backdrop-blur-md z-20 shrink-0">
         <div className="p-6 border-b border-cyan-900/50">
           <h1 className="text-xl font-orbitron font-bold tracking-widest text-cyan-400 flex items-center gap-3 drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
             AKASH_OS
           </h1>
           <p className="text-xs text-cyan-700 font-mono mt-2 uppercase">Root Access Granted</p>
         </div>
         <div className="flex-grow py-6 flex flex-col gap-2 px-4">
            {[
              { id: 'dashboard', label: 'Dashboard' },
              { id: 'skills', label: 'Skills' },
              { id: 'projects', label: 'Projects' },
              { id: 'users', label: 'Join Requests' },
              { id: 'messages', label: 'Messages' },
              { id: 'ratings', label: 'Ratings' }
            ].map((tab) => (
              <button
                key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`text-left px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,243,255,0.1)]' : 'text-slate-500 hover:text-cyan-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                {tab.label}
              </button>
            ))}
         </div>
         <div className="p-4 border-t border-cyan-900/50 flex flex-col gap-2">
            <button onClick={() => router.push('/')} className="w-full text-xs font-mono font-bold tracking-widest py-3 border border-slate-800 rounded text-slate-400 hover:text-white hover:bg-white/5 transition uppercase">FRONTEND</button>
            <button onClick={handleLogout} className="w-full text-xs font-mono font-bold tracking-widest py-3 border border-red-900/30 bg-red-950/20 text-red-500 hover:text-red-400 hover:border-red-500 hover:shadow-[0_0_15px_rgba(239,68,68,0.3)] rounded transition uppercase">DISCONNECT</button>
         </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-grow p-6 md:p-10 lg:p-12 overflow-y-auto relative h-screen">
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] pointer-events-none mix-blend-screen" />
         
         {activeTab === 'dashboard' && (
           <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-8">
              <h2 className="text-3xl font-orbitron font-bold text-white uppercase tracking-widest">System Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 <div className="glass-card bg-black/40 border border-cyan-900/40 p-6 rounded-2xl flex flex-col shadow-[inset_0_0_20px_rgba(0,243,255,0.05)]">
                   <span className="text-cyan-600 font-mono text-xs uppercase tracking-widest mb-4">Total Skills</span>
                   <span className="text-5xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">{skills.length}</span>
                 </div>
                 <div className="glass-card bg-black/40 border border-cyan-900/40 p-6 rounded-2xl flex flex-col shadow-[inset_0_0_20px_rgba(0,243,255,0.05)]">
                   <span className="text-cyan-600 font-mono text-xs uppercase tracking-widest mb-4">Total Projects</span>
                   <span className="text-5xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">{projects.length}</span>
                 </div>
                 <div className="glass-card bg-black/40 border border-cyan-900/40 p-6 rounded-2xl flex flex-col shadow-[inset_0_0_20px_rgba(0,243,255,0.05)]">
                   <span className="text-cyan-600 font-mono text-xs uppercase tracking-widest mb-4">Total Join Requests</span>
                   <span className="text-5xl font-black text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.8)]">{users.length}</span>
                 </div>
                 <div className="glass-card bg-black/40 border border-cyan-900/40 p-6 rounded-2xl flex flex-col shadow-[inset_0_0_20px_rgba(0,243,255,0.05)]">
                   <span className="text-cyan-600 font-mono text-xs uppercase tracking-widest mb-4">Total Messages</span>
                   <span className="text-5xl font-black text-white">{messages.length}</span>
                 </div>
                 <div className="glass-card bg-black/40 border border-yellow-900/40 p-6 rounded-2xl flex flex-col shadow-[inset_0_0_20px_rgba(234,179,8,0.05)]">
                   <span className="text-yellow-600 font-mono text-xs uppercase tracking-widest mb-4">Average Rating</span>
                   <div className="flex items-end gap-3">
                     <span className="text-5xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(234,179,8,0.8)]">{avgRating}</span>
                     <span className="text-yellow-700 font-bold tracking-widest">/ 5.0</span>
                   </div>
                 </div>
              </div>
           </motion.div>
         )}

         {activeTab === 'skills' && (
           <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
              <div className="flex justify-between items-center bg-black/40 p-4 border border-cyan-900/30 rounded-xl backdrop-blur-sm">
                 <h2 className="text-xl font-orbitron uppercase text-white font-bold tracking-widest">Skills Matrix</h2>
                 <button onClick={() => setShowSkillForm(!showSkillForm)} className="bg-cyan-950/30 border border-cyan-500/50 text-cyan-400 text-[10px] font-bold tracking-[0.2em] px-4 py-2 hover:bg-cyan-500 hover:text-black transition shadow-[0_0_10px_rgba(0,243,255,0.2)] rounded uppercase">
                   {showSkillForm ? 'CANCEL POST' : 'ADD SKILL'}
                 </button>
              </div>

              {showSkillForm && (
                 <div className="bg-[#050b14] border border-cyan-900/50 p-6 rounded-xl grid md:grid-cols-2 gap-4">
                    <input className="bg-black border border-slate-800 text-sm p-3 font-mono text-slate-300 rounded focus:border-cyan-500 focus:outline-none" placeholder="Skill Name (e.g. Node.js)" value={newSkill.name} onChange={e=>setNewSkill({...newSkill, name: e.target.value})} />
                    <input className="bg-black border border-slate-800 text-sm p-3 font-mono text-slate-300 rounded focus:border-cyan-500 focus:outline-none" placeholder="Category (e.g. Backend)" value={newSkill.category} onChange={e=>setNewSkill({...newSkill, category: e.target.value})} />
                    <input className="bg-black border border-slate-800 text-sm p-3 font-mono text-slate-300 rounded focus:border-cyan-500 focus:outline-none" placeholder="Devicon ID (e.g. nodejs)" value={newSkill.icon} onChange={e=>setNewSkill({...newSkill, icon: e.target.value})} />
                    <input type="number" className="bg-black border border-slate-800 text-sm p-3 font-mono text-slate-300 rounded focus:border-cyan-500 focus:outline-none" placeholder="Level (0-100)" value={newSkill.level} onChange={e=>setNewSkill({...newSkill, level: Number(e.target.value)})} />
                    <button onClick={addSkill} className="md:col-span-2 bg-cyan-900/50 border border-cyan-500/50 text-cyan-400 font-mono font-bold tracking-widest text-[10px] py-4 rounded hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] transition uppercase">Save Skill</button>
                 </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                 {skills.map((s: any) => (
                    <div key={s._id} className="bg-black/50 border border-slate-800 p-4 rounded-xl flex flex-col relative group hover:border-cyan-500/50 transition">
                      <button onClick={() => deleteSkill(s._id)} className="absolute top-2 right-2 text-slate-600 hover:text-red-500 p-1 bg-black rounded opacity-0 group-hover:opacity-100 transition border border-transparent hover:border-red-500/50">✕</button>
                      <span className="font-orbitron font-bold text-white mb-1 group-hover:text-cyan-400 break-words pr-6">{s.name}</span>
                      <span className="text-[10px] text-cyan-700 font-mono uppercase tracking-widest">{s.category} • Lvl {s.level}</span>
                    </div>
                 ))}
              </div>
           </motion.div>
         )}

         {activeTab === 'projects' && (
           <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
              <div className="flex justify-between items-center bg-black/40 p-4 border border-cyan-900/30 rounded-xl backdrop-blur-sm">
                 <h2 className="text-xl font-orbitron uppercase text-white font-bold tracking-widest">Deployments</h2>
                 <button onClick={() => {
                     setShowProjectForm(!showProjectForm);
                     if (showProjectForm) {
                        setNewProject({ title: '', description: '', techStack: '', githubLink: '', liveLink: '', image: '' });
                        setEditProjectId(null);
                     }
                 }} className="bg-cyan-950/30 border border-cyan-500/50 text-cyan-400 text-[10px] font-bold tracking-[0.2em] px-4 py-2 hover:bg-cyan-500 hover:text-black transition shadow-[0_0_10px_rgba(0,243,255,0.2)] rounded uppercase">
                   {showProjectForm ? 'CANCEL' : 'ADD PROJECT'}
                 </button>
              </div>

              {showProjectForm && (
                 <div className="bg-[#050b14] border border-cyan-900/50 p-6 rounded-xl grid md:grid-cols-2 gap-4">
                    <input className="bg-black border border-slate-800 text-sm p-3 font-mono text-slate-300 rounded focus:border-cyan-500 focus:outline-none" placeholder="Title" value={newProject.title} onChange={e=>setNewProject({...newProject, title: e.target.value})} />
                    <input className="bg-black border border-slate-800 text-sm p-3 font-mono text-slate-300 rounded focus:border-cyan-500 focus:outline-none" placeholder="Tech Stack (comma separated)" value={newProject.techStack} onChange={e=>setNewProject({...newProject, techStack: e.target.value})} />
                    <textarea className="md:col-span-2 bg-black border border-slate-800 text-sm p-3 font-mono text-slate-300 rounded focus:border-cyan-500 focus:outline-none h-24" placeholder="Description" value={newProject.description} onChange={e=>setNewProject({...newProject, description: e.target.value})} />
                    <input className="bg-black border border-slate-800 text-sm p-3 font-mono text-slate-300 rounded focus:border-cyan-500 focus:outline-none" placeholder="GitHub URL" value={newProject.githubLink} onChange={e=>setNewProject({...newProject, githubLink: e.target.value})} />
                    <input className="bg-black border border-slate-800 text-sm p-3 font-mono text-slate-300 rounded focus:border-cyan-500 focus:outline-none" placeholder="Live URL" value={newProject.liveLink} onChange={e=>setNewProject({...newProject, liveLink: e.target.value})} />
                    <input className="md:col-span-2 bg-black border border-slate-800 text-sm p-3 font-mono text-slate-300 rounded focus:border-cyan-500 focus:outline-none" placeholder="Image URL" value={newProject.image} onChange={e=>setNewProject({...newProject, image: e.target.value})} />
                    <button onClick={addProject} className="md:col-span-2 bg-cyan-900/50 border border-cyan-500/50 text-cyan-400 font-mono font-bold tracking-widest text-[10px] py-4 rounded hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_20px_rgba(0,243,255,0.6)] transition uppercase">
                        {editProjectId ? 'Update Project' : 'Save Project'}
                    </button>
                 </div>
              )}

              <div className="space-y-4">
                  {projects.map((p: any) => (
                    <div key={p._id} className="bg-black/50 border border-slate-800 p-6 rounded-xl hover:border-cyan-900/50 transition relative group">
                      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition z-10 cursor-pointer pointer-events-auto">
                        <button onClick={() => handleEditProject(p)} className="bg-cyan-950/20 text-cyan-500 border border-cyan-900/50 hover:bg-cyan-500 hover:text-black px-3 py-1 rounded text-[10px] uppercase tracking-widest font-bold">Edit</button>
                        <button onClick={() => deleteProject(p._id)} className="bg-red-950/20 text-red-500 border border-red-900/50 hover:bg-red-500 hover:text-white px-3 py-1 rounded text-[10px] uppercase tracking-widest font-bold">Delete</button>
                      </div>
                      <h3 className="text-xl font-orbitron font-bold text-white uppercase tracking-wider mb-2">{p.title}</h3>
                      <p className="text-slate-400 text-sm mb-4 max-w-4xl">{p.description}</p>
                      <div className="flex flex-wrap gap-2 text-[10px] font-mono font-bold text-cyan-600 uppercase">
                         {p.techStack?.map((t: string) => <span key={t} className="bg-[#050b14] px-2 py-1 rounded border border-cyan-900/30">{t}</span>)}
                      </div>
                    </div>
                 ))}
              </div>
           </motion.div>
         )}

         {activeTab === 'users' && (
           <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
              <h2 className="text-xl font-orbitron uppercase text-white font-bold tracking-widest bg-black/40 p-4 border border-cyan-900/30 rounded-xl backdrop-blur-sm">Join Requests</h2>
              <div className="space-y-4">
                 {users.map((u: any) => (
                    <div key={u._id} className="bg-black/50 border border-slate-800 p-6 rounded-xl relative group">
                       <button onClick={() => deleteUser(u._id)} className="absolute top-4 right-4 bg-red-950/20 text-red-500 border border-red-900/50 hover:bg-red-500 hover:text-white px-3 py-1 rounded text-[10px] uppercase tracking-widest transition opacity-0 group-hover:opacity-100 font-bold z-10">Delete</button>
                       <div className="flex justify-between items-start mb-4">
                         <div>
                            <h3 className="text-lg font-bold text-white tracking-wider">{u.name}</h3>
                            <div className="text-xs font-mono text-cyan-600 mt-1 flex flex-wrap gap-4">
                               <span>{u.email}</span>
                               {u.phone && <span>{u.phone}</span>}
                               {u.linkedin && <a href={u.linkedin.startsWith('http')?u.linkedin:`https://${u.linkedin}`} target="_blank" className="hover:text-cyan-400 underline">LinkedIn ↗</a>}
                            </div>
                         </div>
                         <div className="flex gap-2">
                            {u.status === 'pending' && (
                               <>
                                 <button onClick={()=>changeUserStatus(u._id, 'approved')} className="text-[10px] bg-green-950/30 text-green-400 border border-green-900/50 px-3 py-1 rounded tracking-widest uppercase font-bold hover:bg-green-500 hover:text-black">Approve</button>
                                 <button onClick={()=>changeUserStatus(u._id, 'rejected')} className="text-[10px] bg-red-950/30 text-red-500 border border-red-900/50 px-3 py-1 rounded tracking-widest uppercase font-bold hover:bg-red-500 hover:text-white">Reject</button>
                               </>
                            )}
                            {u.status === 'approved' && <span className="text-[10px] text-green-400 font-bold tracking-widest uppercase px-3 py-1 border border-green-500/30 bg-green-950/20 rounded">Approved</span>}
                            {u.status === 'rejected' && <span className="text-[10px] text-red-500 font-bold tracking-widest uppercase px-3 py-1 border border-red-500/30 bg-red-950/20 rounded">Rejected</span>}
                         </div>
                       </div>
                       <div className="bg-[#050b14] p-4 rounded-lg border border-slate-800">
                         <p className="text-sm text-slate-300 font-sans italic">"{u.message}"</p>
                       </div>
                    </div>
                 ))}
              </div>
           </motion.div>
         )}

         {activeTab === 'messages' && (
           <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
              <h2 className="text-xl font-orbitron uppercase text-white font-bold tracking-widest bg-black/40 p-4 border border-cyan-900/30 rounded-xl backdrop-blur-sm">Messages Terminal</h2>
              <div className="space-y-4">
                 {messages.map((m: any) => (
                    <div key={m._id} className="bg-black/50 border border-slate-800 p-6 rounded-xl relative group">
                       <button onClick={() => deleteMessage(m._id)} className="absolute top-4 right-4 bg-red-950/20 text-red-500 border border-red-900/50 hover:bg-red-500 hover:text-white px-3 py-1 rounded text-[10px] uppercase tracking-widest transition opacity-0 group-hover:opacity-100 font-bold z-10">Delete</button>
                       <h3 className="text-md font-bold text-cyan-400 tracking-wider mb-1">{m.name}</h3>
                       <p className="text-xs font-mono text-slate-500 mb-4">{m.email} • {new Date(m.createdAt || m.timestamp).toLocaleString()}</p>
                       <p className="text-sm text-white font-sans">{m.message}</p>
                    </div>
                 ))}
              </div>
           </motion.div>
         )}

         {activeTab === 'ratings' && (
           <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
              <h2 className="text-xl font-orbitron uppercase text-white font-bold tracking-widest bg-black/40 p-4 border border-yellow-900/30 rounded-xl backdrop-blur-sm flex justify-between items-center">
                 <span>Ratings Log</span>
                 <span className="text-yellow-500 tracking-widest text-sm bg-yellow-950/40 px-3 py-1 rounded border border-yellow-500/30">{avgRating} / 5.0 AVG</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {ratings.map((r: any) => (
                    <div key={r._id} className="bg-black/50 border border-slate-800 p-6 rounded-xl flex flex-col justify-center items-center text-center">
                       <div className="flex gap-1 mb-3 text-2xl">
                         {[1,2,3,4,5].map(star => (
                           <span key={star} className={star <= r.stars ? "text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.8)]" : "text-slate-800"}>★</span>
                         ))}
                       </div>
                       <p className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">{new Date(r.createdAt).toLocaleString()}</p>
                    </div>
                 ))}
              </div>
           </motion.div>
         )}

      </div>
    </div>
  );
}
