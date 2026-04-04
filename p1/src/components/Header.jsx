import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setIsMenuOpen(false);
      navigate('/login'); 
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const desktopLinkClass = ({ isActive }) => 
    `px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
      isActive 
        ? 'text-emerald-400 bg-emerald-500/10 rounded-full' 
        : 'text-slate-400 hover:text-white'
    }`;

  const MenuLink = ({ to, label, icon }) => (
    <Link 
      to={to} 
      onClick={() => setIsMenuOpen(false)} 
      className="flex items-center gap-x-4 px-4 py-3 rounded-2xl hover:bg-emerald-500/10 text-slate-300 hover:text-emerald-400 transition-all duration-300 group"
    >
      <span className="text-lg group-hover:scale-110 transition-transform">{icon}</span>
      <span className="font-bold text-[11px] uppercase tracking-widest">{label}</span>
    </Link>
  );

  return (
    <header className={`fixed top-0 w-full z-[100] transition-all duration-500 ${
      isScrolled 
        ? 'bg-slate-950/80 backdrop-blur-2xl py-4 border-b border-white/5 shadow-2xl' 
        : 'bg-transparent py-8'
    }`}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between items-center h-12">
          
          {/* LEFT: Menu & Branding */}
          <div className="flex items-center gap-x-8">
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)} 
                className={`p-3 rounded-full transition-all duration-300 ${isMenuOpen ? 'bg-emerald-500 text-slate-950 rotate-90' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              </button>

              <div className={`absolute top-16 left-0 w-72 bg-slate-900/95 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] shadow-2xl py-8 px-6 transition-all duration-500 transform ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <nav className="flex flex-col space-y-2">
                  <p className="text-[9px] font-black text-emerald-500 uppercase tracking-[0.4em] mb-4 px-4">Sanctuary Maps</p>
                  <MenuLink to="/resources" label="Wisdom Hub" icon="📖" />
                  <MenuLink to="/chat" label="Neural Support" icon="✨" />
                  <MenuLink to="/peer-support" label="Safe Haven" icon="🤝" />
                  <MenuLink to="/booking" label="Expert Sync" icon="🌿" />

                  {currentUser && (
                    <div className="pt-6 mt-6 border-t border-white/5">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em] mb-4 px-4">Neural Profile</p>
                      <MenuLink to="/settings/privacy" label="Privacy Control" icon="🛡️" />
                      <MenuLink to="/care-alerts" label="Care Alerts" icon="🔔" />
                      <MenuLink to="/help" label="Help Center" icon="❓" />
                    </div>
                  )}
                </nav>
              </div>
            </div>

            <Link to="/" className="flex items-center group">
              <span className="text-xl font-light text-white tracking-tighter uppercase transition-colors group-hover:text-emerald-400">
                Mitr<span className="font-serif italic text-emerald-500 ml-1">Sanctuary</span>
              </span>
            </Link>
          </div>
          
          {/* CENTER: Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-2">
            <NavLink to="/resources" className={desktopLinkClass}>Resources</NavLink>
            <NavLink to="/chat" className={desktopLinkClass}>Chat</NavLink>
            <NavLink to="/peer-support" className={desktopLinkClass}>Forum</NavLink>
            <NavLink to="/booking" className={desktopLinkClass}>Experts</NavLink>
          </nav>

          {/* RIGHT: Admin Entrance & Auth */}
          <div className="flex items-center gap-x-6">
            {!currentUser && (
              <Link 
                to="/admin-gate" 
                className="hidden sm:block text-[9px] font-black text-slate-600 uppercase tracking-[0.4em] hover:text-emerald-500 transition-all border-r border-white/10 pr-6 relative group"
              >
                <span className="relative z-10">Admin Access</span>
                <span className="absolute inset-0 bg-emerald-500/20 blur-md rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></span>
              </Link>
            )}

            {currentUser ? (
              <div className="flex items-center gap-x-6">
                <div className="hidden md:flex flex-col text-right">
                  <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-none">Member</span>
                  <span className="text-[11px] font-bold text-emerald-400 truncate max-w-[100px] mt-1 uppercase tracking-tight">
                    {currentUser.email.split('@')[0]}
                  </span>
                </div>
                <button 
                  onClick={handleLogout} 
                  disabled={isLoggingOut} 
                  className="bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 text-slate-300 text-[10px] font-black px-6 py-2.5 rounded-full transition-all active:scale-95 uppercase tracking-widest"
                >
                  {isLoggingOut ? 'SYNCING...' : 'DISCONNECT'}
                </button>
              </div>
            ) : (
              <Link to="/login" className="bg-white text-slate-950 text-[10px] font-black px-8 py-3 rounded-full hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 uppercase tracking-widest">
                Enter
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;