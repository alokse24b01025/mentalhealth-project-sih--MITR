import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Chatbot from '../components/Chatbot';

const ChatPage = () => {
  const [language, setLanguage] = useState('English');
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [chatKey, setChatKey] = useState(0); // Used to force reset the chat

  // Logic to clear chat history locally if needed
  const handleResetChat = () => {
    if (window.confirm("Are you sure you want to clear this conversation?")) {
      setChatKey(prev => prev + 1);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-[#020617] text-slate-200 selection:bg-emerald-500/30">
      <Header />
      
      <main className="flex-1 w-full flex flex-col items-center p-4 pt-32 overflow-hidden">
        
        <div className="w-full max-w-5xl flex-1 flex flex-col min-h-0 bg-slate-900/50 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden relative">
          
          {/* Header Bar within Chat */}
          <div className="bg-slate-950/80 border-b border-slate-800 p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-25"></div>
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-widest text-white">AI Support Agent</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase">Encrypted & Confidential</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Reset Logic */}
              <button 
                onClick={handleResetChat}
                className="p-2 text-slate-500 hover:text-white transition-colors"
                title="Reset Conversation"
              >
                <svg xmlns="https://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              {/* Advanced Language Selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
              >
                <option value="English">EN - English</option>
                <option value="Hindi">HI - हिंदी</option>
                <option value="Tamil">TA - தமிழ்</option>
                <option value="Telugu">TE - తెలుగు</option>
              </select>

              {/* Emergency Guardrail Button */}
              <button 
                onClick={() => setIsEmergencyOpen(true)}
                className="bg-red-950/30 text-red-500 border border-red-900/50 px-3 py-1.5 rounded-lg text-xs font-black hover:bg-red-600 hover:text-white transition-all uppercase tracking-tighter"
              >
                Emergency?
              </button>
            </div>
          </div>

          {/* Chatbot Instance */}
          <div className="flex-1 flex flex-col min-h-0 relative">
            <Chatbot key={chatKey} selectedLanguage={language} />
            
            {/* Overlay for Emergency Info */}
            {isEmergencyOpen && (
              <div className="absolute inset-0 z-50 bg-slate-950/90 backdrop-blur-sm p-8 flex items-center justify-center">
                <div className="max-w-md w-full bg-slate-900 border border-red-900/50 p-6 rounded-2xl shadow-2xl">
                  <h3 className="text-xl font-black text-red-500 mb-2">Crisis Resources</h3>
                  <p className="text-slate-400 text-sm mb-6">If you are in immediate danger, please contact local emergency services or a crisis helpline immediately.</p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex justify-between text-sm border-b border-slate-800 pb-2">
                      <span className="text-slate-500">National Helpline</span>
                      <span className="text-white font-mono font-bold">9152987821</span>
                    </li>
                    <li className="flex justify-between text-sm border-b border-slate-800 pb-2">
                      <span className="text-slate-500">Emergency Services</span>
                      <span className="text-white font-mono font-bold">112</span>
                    </li>
                  </ul>
                  <button 
                    onClick={() => setIsEmergencyOpen(false)}
                    className="w-full bg-slate-800 text-white py-3 rounded-xl font-bold hover:bg-slate-700 transition-all"
                  >
                    Back to Chat
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Disclaimer Logic */}
        <p className="mt-4 text-[10px] text-slate-600 uppercase font-bold tracking-[0.2em]">
          AI support is not a substitute for professional medical advice or psychiatric care.
        </p>
      </main>
      
      <Footer />
    </div>
  );
};

export default ChatPage;