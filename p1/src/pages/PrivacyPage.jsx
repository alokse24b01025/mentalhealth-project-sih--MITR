import React, { useState } from 'react';
import Header from '../components/Header';

const PrivacyPage = () => {
  const [privacySettings, setPrivacySettings] = useState({
    anonymousPosting: true,
    showEmail: false,
    publicMoodHistory: false,
  });

  const toggleSetting = (key) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 pt-24 sm:pt-32 p-4 sm:p-8">
      <Header />
      <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl">
        <h1 className="text-2xl sm:text-3xl font-black text-white mb-6 flex items-center gap-3">
          <span className="text-blue-500">🛡️</span> Privacy & Anonymity
        </h1>
        
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
            <div>
              <p className="font-bold text-slate-100">Anonymous Posting</p>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter mt-1">Hide your real name on forum posts</p>
            </div>
            <button onClick={() => toggleSetting('anonymousPosting')} className={`w-12 h-6 rounded-full transition-all ${privacySettings.anonymousPosting ? 'bg-emerald-600' : 'bg-slate-700'}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-all mx-1 ${privacySettings.anonymousPosting ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
            <div>
              <p className="font-bold text-slate-100">Visibility of Comments</p>
              <p className="text-xs text-slate-500 uppercase font-bold tracking-tighter mt-1">Allow others to see your chat history</p>
            </div>
            <button onClick={() => toggleSetting('publicMoodHistory')} className={`w-12 h-6 rounded-full transition-all ${privacySettings.publicMoodHistory ? 'bg-emerald-600' : 'bg-slate-700'}`}>
              <div className={`w-4 h-4 bg-white rounded-full transition-all mx-1 ${privacySettings.publicMoodHistory ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
        <button className="w-full mt-8 bg-emerald-600 py-4 rounded-2xl font-black text-white hover:bg-emerald-500 transition-all">SAVE PRIVACY SETTINGS</button>
      </div>
    </div>
  );
};

export default PrivacyPage;