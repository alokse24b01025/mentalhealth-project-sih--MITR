import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// ... (keep your chartData here)

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [pendingStories, setPendingStories] = useState([]);
  const [status, setStatus] = useState({ type: '', msg: '' });

  // 1. SECURITY CHECK: Protect the Command Center
  useEffect(() => {
    const adminToken = localStorage.getItem('sanctuary_admin_token');
    if (adminToken !== 'authorized_neural_session') {
      navigate('/admin-gate');
    }
  }, [navigate]);

  // 2. FETCH PENDING STORIES (Memoized for safety)
  const fetchPending = useCallback(async () => {
    try {
      // Ensure this matches your EXACT backend URL
      const res = await fetch('https://mentalhealth-backend-sa09.onrender.com/api/resiliency/pending');
      if (res.ok) {
        const data = await res.json();
        setPendingStories(data);
        console.log("Moderation Queue Loaded:", data.length, "stories"); // Debug log
      }
    } catch (err) {
      console.error("Moderation fetch failed:", err);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  // 3. MODERATION HANDLER
  const handleModeration = async (id, decision) => {
    setStatus({ type: 'info', msg: `Syncing ${decision} status...` });
    try {
      const res = await fetch(`https://mentalhealth-backend-sa09.onrender.com/api/resiliency/moderate/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: decision })
      });
      
      if (res.ok) {
        setStatus({ type: 'success', msg: `Story ${decision} successfully!` });
        // Local state update so the card disappears instantly
        setPendingStories(prev => prev.filter(s => s._id !== id));
      } else {
        setStatus({ type: 'error', msg: 'Neural sync failed.' });
      }
    } catch (err) {
      setStatus({ type: 'error', msg: 'Server communication error.' });
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('sanctuary_admin_token');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200 selection:bg-red-500/20">
      <Header />
      
      {/* Admin Floating Control Bar */}
      <div className="fixed top-24 right-4 md:right-8 z-[60] flex flex-col sm:flex-row md:flex-col gap-2 sm:gap-3 items-end">
        <button 
          onClick={() => navigate('/admin-upload')}
          className="px-4 py-2 sm:px-6 sm:py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-emerald-500 hover:text-white transition-all shadow-2xl"
        >
          Open Resource Deployer
        </button>
        <button 
          onClick={handleAdminLogout}
          className="px-4 py-2 sm:px-6 sm:py-2 bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-red-500 hover:text-white transition-all shadow-2xl"
        >
          Terminate Admin Session
        </button>
      </div>

      <main className="flex-1 overflow-y-auto p-4 sm:p-8 pt-44 sm:pt-40">
        <div className="text-center mb-12">
          <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.5em] mb-4 block animate-pulse">Classified Access Only</span>
          <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight">
            Admin Command <span className="font-serif italic text-red-500">Center</span>
          </h2>
        </div>

        {/* Global Status Message */}
        {status.msg && (
          <div className={`max-w-7xl mx-auto mb-8 p-4 rounded-xl text-center text-xs font-black uppercase tracking-widest border animate-in slide-in-from-top-4 duration-500 ${
            status.type === 'success' ? 'bg-emerald-900/40 text-emerald-400 border-emerald-500/30' : 'bg-red-900/40 text-red-400 border-red-500/30'
          }`}>
            {status.msg}
          </div>
        )}

        {/* --- MODERATION QUEUE SECTION --- */}
        <div className="max-w-7xl mx-auto bg-slate-900/40 border border-yellow-500/10 p-6 sm:p-12 rounded-2xl sm:rounded-[3rem] shadow-2xl mb-12 backdrop-blur-3xl">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl sm:text-2xl font-light text-white">
              Resiliency <span className="font-serif italic text-yellow-500">Moderation</span> Queue
            </h3>
            <button 
              onClick={fetchPending}
              className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-slate-400 transition-all text-sm"
              title="Refresh Queue"
            >
              🔄
            </button>
          </div>
          
          {pendingStories.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-white/5 rounded-2xl">
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em]">System clear. No pending stories.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {pendingStories.map(story => (
                <div key={story._id} className="p-5 sm:p-8 bg-slate-950/50 border border-white/5 rounded-2xl sm:rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group hover:border-yellow-500/20 transition-all">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-white font-bold tracking-tight text-sm sm:text-base">{story.name || "Anonymous Member"}</span>
                      <span className="text-[9px] sm:text-[10px] font-black text-slate-600 uppercase tracking-widest">from {story.location || "Private"}</span>
                    </div>
                    <p className="text-slate-400 italic text-xs sm:text-sm font-serif">"{story.bio || "Finding peace here."}"</p>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <button 
                      onClick={() => handleModeration(story._id, 'approved')}
                      className="flex-1 md:flex-none px-6 py-2.5 bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-emerald-400 transition-all shadow-xl text-center"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => handleModeration(story._id, 'rejected')}
                      className="flex-1 md:flex-none px-6 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-red-500 hover:text-white transition-all shadow-xl text-center"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Rest of your insights and forms remain exactly same... */}
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard;