import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import { useAuth } from '../AuthContext';

const CareAlertsPage = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  const suggestions = [
    { id: 1, text: "🧘 Meditation", link: "/meditate" },
    { id: 2, text: "📓 Journal", link: "/journal" },
    { id: 3, text: "🌊 Breathing", link: "/breathing" },
    { id: 4, text: "🤝 Support", link: "/peer-support" },
    { id: 5, text: "📞 Expert", link: "/booking" }
  ];

  useEffect(() => {
    const fetchAlerts = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        const userId = currentUser._id || currentUser.uid || currentUser.id;
        const response = await fetch(`https://mentalhealth-project-sih-mitr.onrender.com/api/alerts?userId=${userId}`);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();
        setAlerts(data);
      } catch (err) {
        console.error("Failed to load care alerts:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 pt-32 pb-24 px-6 overflow-x-hidden relative">
      <Header />
      
      {/* Sanctuary Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-500/5 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
          <h1 className="text-5xl md:text-6xl font-light text-white tracking-tighter mb-4">
            Care <span className="font-serif italic text-emerald-500">Center</span>
          </h1>
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-500">
            Neural insights for {currentUser?.email?.split('@')[0] || 'Member'}
          </p>
        </header>

        {/* 1. QUICK ACTIONS: Glassmorphic Pills */}
        <section className="mb-16">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 ml-1">Recommended Pathways</h3>
          <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
            {suggestions.map((item) => (
              <a 
                key={item.id}
                href={item.link}
                className="flex-shrink-0 bg-slate-900/40 backdrop-blur-xl border border-white/5 px-8 py-4 rounded-full text-[11px] font-black uppercase tracking-widest text-slate-300 hover:bg-emerald-500 hover:text-white transition-all shadow-2xl active:scale-95 border-emerald-500/10"
              >
                {item.text}
              </a>
            ))}
          </div>
        </section>

        {/* 2. PRIORITY ALERTS: The Sanctuary Feed */}
        <section className="space-y-8">
          <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 ml-1">Priority Observations</h3>
          
          {loading ? (
            <div className="animate-pulse space-y-6">
              {[1, 2].map((i) => (
                <div key={i} className="h-32 bg-slate-900/40 rounded-[2.5rem] border border-white/5"></div>
              ))}
            </div>
          ) : alerts.length > 0 ? (
            alerts.map((alert, idx) => (
              <div 
                key={idx} 
                className={`p-10 rounded-[3rem] border backdrop-blur-2xl transition-all duration-700 hover:scale-[1.01] shadow-2xl animate-in slide-up fade-in ${
                  alert.priority === 'High' || alert.priority === 'Critical' 
                    ? 'border-red-500/20 bg-gradient-to-br from-red-500/5 to-transparent' 
                    : 'border-white/5 bg-slate-900/20'
                }`}
                style={{ animationDelay: `${idx * 150}ms` }}
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-6">
                      <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border ${
                        alert.priority === 'Critical' 
                          ? 'text-red-400 border-red-500/20 bg-red-500/10 animate-pulse' 
                          : 'text-emerald-400 border-emerald-500/20 bg-emerald-500/10'
                      }`}>
                        {alert.type}
                      </span>
                      <span className="h-px w-8 bg-white/10"></span>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{alert.priority} Priority</span>
                    </div>
                    <p className="text-white text-2xl font-light tracking-tight leading-relaxed">
                      {alert.message.split(' ').map((word, i) => 
                        i % 5 === 0 ? <span key={i} className="font-serif italic text-slate-100">{word} </span> : word + ' '
                      )}
                    </p>
                  </div>
                  
                  <a 
                    href={alert.link} 
                    className="w-full md:w-auto text-center bg-white text-slate-950 text-[11px] font-black px-12 py-5 rounded-2xl hover:bg-emerald-400 hover:shadow-[0_0_30px_-5px_rgba(52,211,153,0.3)] transition-all uppercase tracking-widest active:scale-95"
                  >
                    {alert.action}
                  </a>
                </div>
              </div>
            ))
          ) : (
            /* EMPTY STATE: Deep Peace */
            <div className="text-center py-40 bg-slate-900/20 rounded-[4rem] border border-dashed border-white/5 backdrop-blur-3xl animate-in zoom-in duration-1000">
              <div className="text-5xl mb-8 opacity-50 grayscale">🌿</div>
              <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.5em] mb-2">Neural Balance Achieved</p>
              <p className="text-white/40 font-serif italic text-lg">No active alerts within the sanctuary.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CareAlertsPage;