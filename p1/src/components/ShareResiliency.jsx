import React, { useState } from 'react';

const ShareResiliency = ({ userId, onComplete }) => {
  const [quote, setQuote] = useState('');
  const [location, setLocation] = useState('');

  const handleShare = async () => {
    const response = await fetch('http://https://mentalhealth-project-sih-mitr.onrender.com/api/resiliency/opt-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, quote, location })
    });
    if (response.ok) onComplete();
  };

  return (
    <div className="bg-slate-900/90 border border-emerald-500/20 p-8 rounded-[2rem] text-center max-w-lg mx-auto shadow-2xl">
      <h3 className="text-xl font-light text-white mb-4">Share Your <span className="font-serif italic text-emerald-500">Resiliency</span></h3>
      <p className="text-slate-400 text-sm mb-6">Would you like to inspire others by sharing your journey in the Sanctuary?</p>
      
      <textarea 
        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-4 text-sm text-slate-300 mb-4 focus:ring-1 focus:ring-emerald-500 outline-none"
        placeholder="Share a short quote about your growth..."
        onChange={(e) => setQuote(e.target.value)}
      />
      <input 
        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-300 mb-6 outline-none"
        placeholder="Your City/Location"
        onChange={(e) => setLocation(e.target.value)}
      />

      <div className="flex gap-4">
        <button onClick={handleShare} className="flex-1 py-3 bg-white text-slate-950 font-black rounded-xl text-xs uppercase tracking-widest">Yes, Share</button>
        <button onClick={onComplete} className="flex-1 py-3 bg-slate-800 text-slate-400 font-black rounded-xl text-xs uppercase tracking-widest">Not Now</button>
      </div>
    </div>
  );
};