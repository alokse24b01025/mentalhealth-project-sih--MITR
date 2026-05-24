import React from 'react';
import Header from '../components/Header';
import Chatbot from '../components/Chatbot';

const HelpCenterPage = () => {
  return (
    /* 1. Ensure the outer container takes exactly the screen height and prevents double scrollbars */
    <div className="h-screen flex flex-col bg-[#020617] text-slate-200 overflow-hidden">
      <Header />
      
      {/* 2. Main container starts below the header and fills the remaining height */}
      <main className="flex-1 flex flex-col pt-16 sm:pt-24 relative overflow-hidden">
        
        {/* Background Decorative Glow (Sanctuary Vibe) */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        {/* 3. Full-Screen Chat Container */}
        <div className="flex-1 w-full max-w-6xl mx-auto flex flex-col bg-slate-900/40 backdrop-blur-xl border-x border-t border-white/5 rounded-t-2xl sm:rounded-t-[3rem] overflow-hidden shadow-2xl relative z-10">
          
          {/* Header Bar inside the Chat UI */}
          <div className="bg-slate-950/80 backdrop-blur-md p-6 border-b border-white/5 text-center shrink-0">
            <h1 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.5em] mb-1">Mitr Neural Support</h1>
            <h2 className="text-2xl font-light text-white tracking-tight">Help <span className="font-serif italic text-emerald-500">Center</span></h2>
          </div>

          {/* 4. Chatbot area - flex-1 allows it to grow to fill the screen */}
          <div className="flex-1 flex flex-col min-h-0">
            <Chatbot selectedLanguage="System Help" />
          </div>

          {/* Bottom Quick Links */}
          <div className="p-5 bg-slate-950/80 backdrop-blur-md flex justify-around text-[9px] font-black text-slate-500 uppercase tracking-[0.3em] shrink-0 border-t border-white/5">
            <span className="hover:text-emerald-500 cursor-pointer transition-colors">Neural FAQs</span>
            <span className="hover:text-emerald-500 cursor-pointer transition-colors">Technical Sync</span>
            <span className="hover:text-emerald-500 cursor-pointer transition-colors">Privacy Protocol</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpCenterPage;