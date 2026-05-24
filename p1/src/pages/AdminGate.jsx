import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminGate = () => {
  const [adminId, setAdminId] = useState('');
  const [adminSecret, setAdminSecret] = useState('');
  const [status, setStatus] = useState('idle');
  const navigate = useNavigate();

  const handleAuthorization = (e) => {
    e.preventDefault();
    
    // Credentials
    const MASTER_ID = "admin_alok"; 
    const MASTER_SECRET = "mitr_secure_2026";

    if (adminId === MASTER_ID && adminSecret === MASTER_SECRET) {
      setStatus('success');
      
      // Save token so AdminDashboard allows entry
      localStorage.setItem('sanctuary_admin_token', 'authorized_neural_session');
      
      // FIX: Match the path in App.jsx exactly (lowercase)
      setTimeout(() => {
        navigate('/admin-dashboard');
      }, 1000);
    } else {
      setStatus('error');
      // Clear input on error for security
      setAdminSecret(''); 
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 selection:bg-red-500/30">
      <div className="w-full max-w-md bg-slate-900/40 backdrop-blur-3xl border border-white/5 p-6 sm:p-12 rounded-2xl sm:rounded-[3rem] shadow-2xl max-h-[95vh] overflow-y-auto relative animate-in fade-in zoom-in duration-500">
        
        {/* Security Scan Line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-red-500/50 blur-sm animate-pulse"></div>

        <div className="text-center mb-10">
          <div className="text-4xl mb-4">🔐</div>
          <h2 className="text-2xl font-light text-white tracking-tight">Neural <span className="font-serif italic text-red-500">Gate</span></h2>
          <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-500 mt-2">Restricted Access Point</p>
        </div>

        <form onSubmit={handleAuthorization} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">Terminal ID</label>
            <input 
              type="text"
              placeholder="Enter ID"
              autoComplete="off"
              className="w-full bg-slate-950/80 border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-red-500/40 transition-all"
              value={adminId}
              onChange={(e) => setAdminId(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-600 ml-2">Neural Key</label>
            <input 
              type="password"
              placeholder="••••••••"
              className="w-full bg-slate-950/80 border border-white/5 p-4 rounded-2xl text-white outline-none focus:border-red-500/40 transition-all"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
            />
          </div>

          <button 
            type="submit" 
            className={`w-full py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-2xl ${
              status === 'success' 
                ? 'bg-emerald-500 text-white' 
                : 'bg-white text-slate-950 hover:bg-red-500 hover:text-white'
            }`}
          >
            {status === 'success' ? 'ACCESS GRANTED' : status === 'error' ? 'DENIED - RETRY' : 'AUTHORIZE'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminGate;