import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const CounselorCard = ({ counselor }) => {
  const [sessionType, setSessionType] = useState('In-Person');

  // --- NEW: Handle Contact Logic ---
  const handleContact = () => {
    if (sessionType === 'Tele-Counselling') {
      // Logic for Instant Chat via WhatsApp
      // Note: counselor.phone must be saved in your DB (e.g., 919876543210)
      const message = `Hello ${counselor.name}, I found your profile on the Well-being Hub and would like to book a remote session regarding ${counselor.specialization || counselor.specialty}.`;
      window.open(`https://wa.me/${counselor.phone}?text=${encodeURIComponent(message)}`, '_blank');
    } else {
      // Logic for Formal Email Booking
      const subject = `Appointment Request: ${counselor.name}`;
      const body = `Hello, I would like to schedule an in-person consultation for ${counselor.specialization || counselor.specialty}. \n\nPlease let me know your available slots.`;
      window.location.href = `mailto:${counselor.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  return (
    <div className="bg-slate-900 border border-emerald-800/30 rounded-2xl shadow-xl hover:shadow-emerald-900/20 transform transition-all duration-300 overflow-hidden flex flex-col group">
      <div className="relative overflow-hidden">
        <img 
          src={counselor.image}
          alt={`Portrait of ${counselor.name}`} 
          className="w-full h-64 object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
          onError={(e) => { e.target.onerror = null; e.target.src=`https://placehold.co/400x300/1e293b/64748b?text=Professional+Photo`; }}
        />
        <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-lg">
          {counselor.role || 'Verified Expert'}
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        <h3 className="text-2xl font-bold text-emerald-50">{counselor.name}</h3>
        <p className="text-emerald-400 font-medium text-sm tracking-wide mt-1 uppercase">{counselor.specialization || counselor.specialty}</p>
        
        <div className="flex-grow mt-4">
            <p className="text-slate-400 text-sm">
                <span className="text-emerald-500 font-bold">Schedule:</span> {Array.isArray(counselor.availability) ? counselor.availability.join(', ') : counselor.availability}
            </p>
            {counselor.bio && <p className="text-slate-500 text-xs mt-3 italic line-clamp-2">"{counselor.bio}"</p>}
        </div>
        
        {/* Session Type Switcher */}
        <div className="mt-6 flex bg-slate-800 rounded-xl p-1 border border-slate-700">
            <button 
              onClick={() => setSessionType('In-Person')} 
              className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-all ${sessionType === 'In-Person' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-emerald-200'}`}
            >
                In-Person / Email
            </button>
            <button 
              onClick={() => setSessionType('Tele-Counselling')} 
              className={`w-1/2 py-2 text-xs font-bold rounded-lg transition-all ${sessionType === 'Tele-Counselling' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-emerald-200'}`}
            >
                Direct Chat
            </button>
        </div>

        <button 
          onClick={handleContact}
          className="mt-5 w-full bg-emerald-600 text-white font-bold py-4 px-6 rounded-xl hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all active:scale-[0.98]"
        >
          {sessionType === 'Tele-Counselling' ? 'Start WhatsApp Chat' : 'Request via Email'}
        </button>
      </div>
    </div>
  );
};

const BookingPage = () => {
  const [experts, setExperts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await fetch('https://https://mentalhealth-project-sih-mitr.onrender.com/api/experts');
        const data = await res.json();
        setExperts(data);
      } catch (err) {
        console.error("Booking system sync error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExperts();
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#020617] text-slate-200 font-sans">
      <Header />
      
      <main className="flex-1 overflow-y-auto p-8 pt-40">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-5xl font-black text-white tracking-tight">Professional Support</h2>
          <p className="mt-4 text-slate-400 text-lg max-w-2xl mx-auto font-light">
            Secure and confidential access to our specialized mental health network.
          </p>
        </div>

        {/* Urgent Care Banner */}
        <div className="max-w-5xl mx-auto mb-16 bg-red-900/20 border border-red-500/30 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
            <div className="text-center md:text-left">
                <p className="font-black text-red-400 uppercase tracking-widest text-sm">Crisis Intervention</p>
                <p className="text-slate-300 text-sm mt-1">If you are in immediate distress, our priority team is standing by.</p>
            </div>
            <button className="bg-red-600 text-white font-black py-3 px-8 rounded-xl hover:bg-red-500 transition-all shadow-lg hover:shadow-red-900/40 whitespace-nowrap">
                Emergency Priority
            </button>
        </div>
        
        {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
                <p className="text-emerald-500 font-bold animate-pulse font-mono tracking-tighter">SYNCING CLINICAL DATABASE...</p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto mb-20">
              {experts.map(expert => (
                <CounselorCard key={expert._id || expert.id} counselor={expert} />
              ))}
            </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default BookingPage;