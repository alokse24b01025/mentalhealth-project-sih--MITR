import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isLoading) return; 

    setError('');
    setIsLoading(true);

    try {
      console.log("Sending login request for:", email);
      const result = await login(email, password);
      
      if (result) {
        console.log("Login success, navigating...");
        const destination = location.state?.from?.pathname || '/';
        navigate(destination, { replace: true });
      }
    } catch (err) {
      console.error("Login page error catch:", err.message);
      setError(err.message || "Invalid email or password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#020617] p-6 selection:bg-emerald-500/30 overflow-hidden relative">
      
      {/* Background Decorative Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-emerald-500/5 blur-[100px] rounded-full"></div>

      {/* Glassmorphism Card */}
      <div className="relative w-full max-w-md rounded-2xl sm:rounded-[3rem] bg-slate-900/40 backdrop-blur-3xl border border-white/5 shadow-2xl p-6 sm:p-12 max-h-[95vh] overflow-y-auto animate-in fade-in zoom-in duration-700">
        
        {/* Close/Home Button */}
        <Link to="/" className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors group">
          <svg xmlns="https://www.w3.org/2000/svg" className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-10">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 mb-4">
            <img src={logo} alt="MindWell Logo" className="h-10 w-auto" />
          </div>
          <h1 className="text-[10px] font-black uppercase tracking-[0.5em] text-emerald-500">Mitr Sanctuary</h1>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-3xl font-light text-white tracking-tight">Welcome <span className="font-serif italic text-emerald-500">Back</span></h2>
          <p className="mt-3 text-slate-400 text-xs font-medium tracking-wide">Enter your credentials to access your sanctuary</p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center animate-pulse">
            <p className="text-red-400 text-[11px] font-bold uppercase tracking-wider mx-auto">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Neural ID / Email
            </label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full px-6 py-4 bg-slate-950/50 border border-white/5 rounded-2xl focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all duration-300 text-slate-200 text-sm placeholder:text-slate-600" 
              placeholder="name@university.edu" 
            />
          </div>

          {/* Password Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 ml-1">
              Security Key
            </label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full px-6 py-4 bg-slate-950/50 border border-white/5 rounded-2xl focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all duration-300 text-slate-200 text-sm placeholder:text-slate-600" 
              placeholder="••••••••" 
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading} 
            className={`w-full py-5 px-4 font-black rounded-2xl transition-all duration-300 flex items-center justify-center text-[11px] uppercase tracking-[0.2em] shadow-2xl ${
              isLoading 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                : 'bg-white text-slate-950 hover:bg-emerald-400 active:scale-[0.98] shadow-emerald-500/10'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-slate-500 border-t-slate-200 rounded-full animate-spin"></div>
                <span>Authenticating</span>
              </div>
            ) : (
              'Enter Sanctuary'
            )}
          </button>
        </form>

        <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-widest text-slate-500">
          New to the sanctuary?{' '}
          <Link to="/signup" className="text-emerald-500 hover:text-emerald-400 transition-colors ml-1">
            Create Neural Profile
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;