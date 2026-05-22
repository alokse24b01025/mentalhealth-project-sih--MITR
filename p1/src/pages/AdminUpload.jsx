import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const AdminUpload = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    type: 'video',
    url: '',
    description: '',
  });
  const [status, setStatus] = useState({ type: '', msg: '' });

  // 1. Security Logic: Kick out non-admins immediately
  useEffect(() => {
    const token = localStorage.getItem('sanctuary_admin_token');
    if (token !== 'authorized_neural_session') {
      // If no token or wrong token, kick them to the neural gate
      navigate('/admin-gate');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: 'loading', msg: 'Syncing with Neural Hub...' });

    try {
      const res = await fetch('https://https://mentalhealth-project-sih-mitr.onrender.com/api/resources/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setStatus({ type: 'success', msg: 'Deployment Successful: Resource is now Live.' });
        // Reset form but keep the user on the page for multiple uploads
        setFormData({ title: '', type: 'video', url: '', description: '' });
      } else {
        setStatus({ type: 'error', msg: 'Deployment Failed. Verify Server Logs.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Neural Sync Error: Server Offline.' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 selection:bg-emerald-500/30 overflow-x-hidden relative">
      <Header />
      
      {/* Background Decorative Glows */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-[-10%] w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-3xl mx-auto pt-40 p-6 relative z-10">
        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] shadow-2xl p-10 md:p-14 animate-in fade-in zoom-in duration-700">
          
          <header className="text-center mb-12">
            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] block mb-4">Secure Terminal</span>
            <h2 className="text-4xl font-light text-white tracking-tighter">
              Resource <span className="font-serif italic text-emerald-500">Deployer</span>
            </h2>
          </header>
          
          {status.msg && (
            <div className={`mb-8 p-5 rounded-2xl text-center text-[10px] font-black uppercase tracking-widest border animate-in slide-in-from-top-4 duration-500 ${
              status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 
              status.type === 'loading' ? 'bg-slate-800/50 border-white/5 text-slate-400' : 
              'bg-red-500/10 border-red-500/20 text-red-400'
            }`}>
              {status.msg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Title Input */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Content Title</label>
              <input 
                className="w-full bg-slate-950/80 border border-white/5 p-5 rounded-2xl text-white text-sm outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-700" 
                placeholder="e.g., Midnight Focus Frequency"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>

            {/* Type & URL Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Neural Format</label>
                <div className="relative">
                  <select 
                    className="w-full bg-slate-950/80 border border-white/5 p-5 rounded-2xl text-white text-sm outline-none focus:border-emerald-500/40 appearance-none cursor-pointer"
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="video">Video (YouTube)</option>
                    <option value="guide">Guide (PDF/Article)</option>
                    <option value="audio">Audio (MP3)</option>
                  </select>
                  <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-xs">▼</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Source Protocol (URL)</label>
                <input 
                  className="w-full bg-slate-950/80 border border-white/5 p-5 rounded-2xl text-white text-sm outline-none focus:border-emerald-500/40 transition-all placeholder:text-slate-700" 
                  placeholder="https://..."
                  value={formData.url}
                  onChange={(e) => setFormData({...formData, url: e.target.value})}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-2">Resource Insights</label>
              <textarea 
                className="w-full bg-slate-950/80 border border-white/5 p-5 rounded-2xl text-white text-sm outline-none focus:border-emerald-500/40 transition-all h-32 placeholder:text-slate-700 resize-none" 
                placeholder="Brief summary of this resource's wellness benefits..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-white text-slate-950 font-black py-5 rounded-2xl hover:bg-emerald-400 transition-all active:scale-[0.98] shadow-2xl shadow-emerald-500/10 text-[11px] uppercase tracking-[0.2em]"
            >
              Authorize Deployment
            </button>
          </form>
        </div>
        
        {/* Back to Control Center Link */}
        <div className="mt-10 text-center">
          <button 
            onClick={() => navigate('/admin-dashboard')}
            className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] hover:text-white transition-colors"
          >
            ← Return to Control Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminUpload;