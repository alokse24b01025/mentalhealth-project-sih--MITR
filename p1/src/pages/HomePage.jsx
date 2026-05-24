import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- Intersection Observer Logic ---
const useIntersectionObserver = (options) => {
  const [ref, setRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    if (!ref || !options.root.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
    }, { root: options.root.current, threshold: options.threshold || 0.1 });
    observer.observe(ref);
    return () => ref && observer.unobserve(ref);
  }, [ref, options]);
  return [setRef, isVisible];
};

const coreFeatures = [
  { to: "/chat", title: "Neural Support", description: "Empathetic AI guidance for immediate emotional regulation.", icon: "✨" },
  { to: "/booking", title: "Expert Care", description: "Seamless, anonymous access to professional campus counselors.", icon: "🌿" },
  { to: "/resources", title: "Wisdom Hub", description: "Curated wellness guides across multiple native languages.", icon: "📖" },
  { to: "/peer-support", title: "Safe Haven", description: "Connect with a community of resiliency in total anonymity.", icon: "🤝" },
  { to: "/admin-gate", title: "Growth Analytics", description: "Compassionate data insights for institutional wellness.", icon: "📈" },
];

const HomePage = () => {
  const { currentUser } = useAuth(); 
  const navigate = useNavigate();
  
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [realProfiles, setRealProfiles] = useState([]);
  const [userQuote, setUserQuote] = useState('');
  const [userLocation, setUserLocation] = useState('');
  
  const mainScrollRef = useRef(null);
  const [fRef, fVisible] = useIntersectionObserver({ root: mainScrollRef, threshold: 0.1 });
  const [pRef, pVisible] = useIntersectionObserver({ root: mainScrollRef, threshold: 0.1 });

  // 1. Fetch APPROVED stories only
  const loadProfiles = async () => {
    try {
      // This endpoint now only returns users with resiliencyStatus: 'approved'
      const response = await fetch('https://mentalhealth-backend-sa09.onrender.com/api/resiliency/shared');
      const data = await response.json();
      setRealProfiles(data);
    } catch (err) {
      console.error("Failed to fetch resiliency stories.");
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  const handleFeatureAccess = (e, path) => {
    if (!currentUser) {
      e.preventDefault(); 
      setShowLoginModal(true); 
    } else {
      navigate(path);
    }
  };

  const submitResiliency = async () => {
    if (!currentUser) return;
    const idToSend = currentUser._id || currentUser.uid || currentUser.id;

    if (!userQuote || !userLocation || !idToSend) return;

    try {
      const response = await fetch('https://mentalhealth-backend-sa09.onrender.com/api/resiliency/opt-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: idToSend,
          quote: userQuote, 
          location: userLocation 
        }),
      });

      if (response.ok) {
        setShowShareModal(false);
        // Show success notification
        setShowSuccess(true);
        setUserQuote('');
        setUserLocation('');
        // We DO NOT call loadProfiles() immediately because the story is still 'pending'
        setTimeout(() => setShowSuccess(false), 5000);
      }
    } catch (err) {
      console.error("Network error:", err);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#020617] text-slate-300 selection:bg-emerald-500/20 overflow-hidden font-sans">
      <Header />
      
      {/* MODAL: Success Notification */}
      {showSuccess && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[250] animate-in slide-in-from-bottom-10 duration-500">
          <div className="bg-slate-900/90 backdrop-blur-2xl border border-emerald-500/30 px-8 py-5 rounded-3xl shadow-2xl flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center text-[10px] text-slate-950 font-black">✓</div>
              <p className="text-white text-[10px] font-black uppercase tracking-[0.2em]">Story Submitted</p>
            </div>
            <p className="text-slate-400 text-[9px] uppercase tracking-widest font-bold">Awaiting Admin Moderation</p>
          </div>
        </div>
      )}

      {/* MODAL: Login Sanctuary */}
      {showLoginModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-700" onClick={() => setShowLoginModal(false)}></div>
          <div className="relative bg-slate-900/90 border border-white/10 p-6 sm:p-12 rounded-2xl sm:rounded-[3rem] shadow-2xl max-w-sm w-full max-h-[90vh] overflow-y-auto text-center animate-in zoom-in-95 duration-300">
            <div className="text-4xl mb-6">🌿</div>
            <h3 className="text-2xl font-light text-white tracking-tight mb-4">Access the <span className="font-serif italic text-emerald-500">Sanctuary</span></h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-10">This feature is reserved for our registered members to protect community privacy.</p>
            <Link to="/login" className="block w-full py-5 bg-white text-slate-950 font-black rounded-2xl hover:bg-emerald-400 transition-all uppercase tracking-widest text-xs">Enter the Sanctuary</Link>
          </div>
        </div>
      )}

      {/* MODAL: Share Resiliency Form */}
      {showShareModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-700" onClick={() => setShowShareModal(false)}></div>
          <div className="relative bg-slate-900 border border-emerald-500/20 p-6 sm:p-10 rounded-2xl sm:rounded-[3rem] shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto text-center animate-in zoom-in-95 duration-300">
            <h3 className="text-2xl font-light text-white mb-4 tracking-tight">Share Your <span className="font-serif italic text-emerald-500">Light</span></h3>
            <p className="text-slate-400 text-sm mb-8 leading-relaxed italic uppercase text-[10px] tracking-widest">Your story will be reviewed by admins before going live.</p>
            
            <textarea 
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-5 text-sm text-slate-200 mb-4 focus:ring-1 focus:ring-emerald-500 outline-none min-h-[120px]"
              placeholder="What helped you find balance?..."
              value={userQuote}
              onChange={(e) => setUserQuote(e.target.value)}
            />
            <input 
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-200 mb-8 outline-none focus:border-emerald-500/30"
              placeholder="Your Location (e.g. Jammu)"
              value={userLocation}
              onChange={(e) => setUserLocation(e.target.value)}
            />

            <div className="flex flex-col sm:flex-row gap-4">
              <button onClick={submitResiliency} className="w-full sm:flex-1 py-4 bg-white text-slate-950 font-black rounded-2xl text-[10px] uppercase tracking-widest hover:bg-emerald-400 transition-all">Submit for Review</button>
              <button onClick={() => setShowShareModal(false)} className="w-full sm:flex-1 py-4 bg-slate-800 text-slate-400 font-black rounded-2xl text-[10px] uppercase tracking-widest">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <main ref={mainScrollRef} className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
        {/* HERO */}
        <section className="relative min-h-[90vh] flex items-center justify-center px-6">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 blur-[120px] rounded-full"></div>
          <div className="relative z-10 max-w-5xl text-center">
            <span className="text-[10px] font-black tracking-[0.5em] text-emerald-500 uppercase mb-8 block animate-pulse">Neural Encryption Active</span>
            <h2 className="text-4xl sm:text-6xl md:text-8xl font-light text-white tracking-tighter leading-[1.1]">
              Gentle Support for <br /> <span className="font-serif italic text-emerald-500/90">Modern Minds</span>
            </h2>
            <div className="mt-16 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4">
              <button onClick={(e) => handleFeatureAccess(e, "/chat")} className="w-full sm:w-auto px-12 py-5 bg-white text-slate-950 font-black text-[11px] uppercase tracking-widest rounded-full hover:bg-emerald-400 transition-all shadow-2xl">Begin Neural Sync</button>
              <button onClick={(e) => handleFeatureAccess(e, "/resources")} className="w-full sm:w-auto px-12 py-5 bg-slate-900/50 text-white font-black text-[11px] uppercase tracking-widest rounded-full border border-white/10 hover:bg-slate-800 transition-all">Wisdom Hub</button>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section ref={fRef} className={`py-16 sm:py-24 md:py-32 transition-all duration-1000 ${fVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="w-full overflow-hidden relative py-10">
            <div className="flex animate-scroll-slow">
              {[...coreFeatures, ...coreFeatures].map((f, i) => (
                <div key={i} onClick={(e) => handleFeatureAccess(e, f.to)} className="cursor-pointer flex-shrink-0 w-[340px] h-[240px] mx-5 p-10 flex flex-col items-start justify-center bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-[2.5rem] shadow-2xl hover:border-emerald-500/40 group transition-all">
                  <div className="text-3xl mb-6 opacity-80 group-hover:scale-125 transition-transform">{f.icon}</div>
                  <h4 className="font-bold text-xl text-slate-100 tracking-tight">{f.title}</h4>
                  <p className="text-slate-400 text-sm mt-3 leading-relaxed">{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SHARED RESILIENCY */}
        <section ref={pRef} className={`py-16 sm:py-24 md:py-40 px-6 transition-all duration-1000 ${pVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12 sm:mb-24">
              <h2 className="text-4xl font-light text-white tracking-tight">Shared <span className="font-serif italic text-emerald-500">Resiliency</span></h2>
              <p className="mt-6 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Verified stories of strength</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {/* SHARE CARD */}
              {currentUser && (
                <div 
                  onClick={() => setShowShareModal(true)}
                  className="bg-emerald-500/5 border border-dashed border-emerald-500/20 p-8 rounded-[3rem] text-center flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-500/10 transition-all group min-h-[250px]"
                >
                  <div className="text-3xl mb-4 group-hover:scale-125 transition-transform">🌱</div>
                  <p className="text-white font-bold text-sm">Contribute Light</p>
                  <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-2 tracking-[0.3em]">Awaiting Review</p>
                </div>
              )}

              {/* DYNAMIC PROFILES - ONLY APPROVED ONES APPEAR HERE */}
              {realProfiles.map((p, i) => (
                <div key={p._id} className="bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] text-center flex flex-col items-center min-h-[250px] animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <img src={p.imageUrl || "https://placehold.co/100x100/064e3b/ffffff?text=User"} alt={p.name} className="w-14 h-14 rounded-full mb-6 grayscale border border-emerald-500/20" />
                  <p className="text-slate-300 italic text-sm leading-relaxed font-light flex-1">"{p.bio}"</p>
                  <div className="mt-8 border-t border-white/5 pt-6 w-full">
                    <p className="font-bold text-white text-sm">{p.name}</p>
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1 opacity-60">{p.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 text-center bg-slate-950/20">
            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-slate-600">Institutional Governance • Neural Security v2.6</p>
        </section>
      </main>
      <Footer />

      <style>{`
        .animate-scroll-slow { animation: scroll 60s linear infinite; }
        @keyframes scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .animate-slide-up { animation: slideUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; opacity: 0; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default HomePage;