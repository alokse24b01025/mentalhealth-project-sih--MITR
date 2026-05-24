import React, { useState, useEffect, useMemo } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { API_BASE_URL } from '../config';

// Helper to convert standard YouTube/Vimeo links into direct embed URLs
const getEmbedUrl = (url, type) => {
  if (!url) return '';
  if (type === 'video') {
    // Check if it's a YouTube URL
    const ytRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const ytMatch = url.match(ytRegex);
    if (ytMatch && ytMatch[1]) {
      return `https://www.youtube.com/embed/${ytMatch[1]}`;
    }
    // Check if it's a Vimeo URL
    const vimeoRegex = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/i;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch && vimeoMatch[1]) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }
  }
  return url;
};

// The ResourceCard with Dark Theme styling
const ResourceCard = ({ resource }) => {
  const { title, type, url, downloads } = resource;

  const renderContent = () => {
    switch (type) {
      case 'video':
        const embedUrl = getEmbedUrl(url, type);
        return <iframe className="w-full h-48 rounded-lg border border-slate-700" src={embedUrl} title={title} frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>;
      case 'guide':
        return (
          <div className="flex items-center justify-center h-48 bg-slate-800 rounded-lg border border-slate-700">
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:text-emerald-300 hover:underline font-semibold transition-colors">
              <span className="text-4xl block text-center mb-2">📚</span>
              Read Guide
            </a>
          </div>
        );
      case 'audio':
        return <audio controls src={url} className="w-full filter invert opacity-80 hover:opacity-100 transition-opacity"></audio>;
      default:
        return null;
    }
  };

  return (
    <div className="border border-slate-800 rounded-xl shadow-2xl hover:border-emerald-500/50 bg-slate-900 p-6 flex flex-col transform transition-all duration-300 hover:-translate-y-2">
      <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-emerald-400 group">
        <h3 className="text-xl font-bold text-slate-100 mb-2 capitalize tracking-tight group-hover:text-emerald-400 transition-colors">{title}</h3>
      </a>
      <div className="flex items-center mb-4">
        <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          {type}
        </span>
      </div>
      <div className="flex-grow mb-4">
        {renderContent()}
      </div>
      {downloads && (
        <div className="border-t border-slate-800 pt-4">
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-widest">Downloads</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(downloads).map(([quality, link]) => (
              <a 
                key={quality}
                href={link}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-950 text-emerald-400 border border-emerald-900/50 text-[10px] font-black px-3 py-1 rounded-md hover:bg-emerald-600 hover:text-white transition-all"
              >
                {quality.toUpperCase()}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ResourcesPage = () => {
  const [resources, setResources] = useState([]);
  const [resiliencyStories, setResiliencyStories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/resources`);
        const data = await response.json();
        setResources(data);
      } catch (error) {
        console.error("Error loading resources:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchResiliency = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/resiliency/shared`);
        const data = await response.json();
        setResiliencyStories(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error loading resiliency stories:", err);
      }
    };

    fetchResources();
    fetchResiliency();
  }, []);

  const filteredResources = useMemo(() => {
    if (!searchTerm) return resources;
    return resources.filter(resource =>
      resource.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, resources]);

  return (
    <div className="h-screen flex flex-col bg-[#020617] text-slate-300 selection:bg-emerald-500/30">
      <Header />
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 pt-24 sm:pt-40">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tighter mb-4">
            Resource Hub
          </h2>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400">
            A curated library of psychoeducational content to support your mental health journey.
          </p>
        </div>

        {/* Search Bar - Dark Themed */}
        <div className="max-w-xl mx-auto mb-16 px-4">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-500 group-focus-within:text-emerald-500 transition-colors" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input 
              type="text" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all text-sm"
              placeholder="Search guides or videos..." 
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium animate-pulse">Loading wellness library...</p>
          </div>
        ) : filteredResources.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto mb-10">
            {filteredResources.map(resource => (
              <ResourceCard key={resource._id || resource.id} resource={resource} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/50 border border-slate-800 rounded-3xl max-w-2xl mx-auto">
            <span className="text-5xl block mb-4">🔍</span>
            <h3 className="text-2xl font-bold text-slate-200">No Resources Found</h3>
            <p className="mt-2 text-slate-500 px-6">We couldn't find any resources matching your search. Try different keywords like "Anxiety" or "Sleep".</p>
          </div>
        )}

        {/* PEER RESILIENCY SECTION: Always visible at the bottom of Resources page */}
        <section className="max-w-6xl mx-auto mt-24 pt-20 border-t border-slate-850 pb-20">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-light text-white tracking-tight">Shared <span className="font-serif italic text-emerald-500">Resiliency</span></h2>
            <p className="mt-4 text-slate-500 text-[10px] font-black uppercase tracking-[0.4em]">Verified stories of peer strength</p>
          </div>

          {resiliencyStories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {resiliencyStories.map((story, i) => (
                <div key={story._id || i} className="bg-slate-900/40 border border-white/5 p-8 rounded-[3rem] text-center flex flex-col items-center min-h-[250px] hover:border-emerald-500/20 transition-all duration-300">
                  <img src={story.imageUrl || `https://placehold.co/100x100/064e3b/ffffff?text=${encodeURIComponent(story.name ? story.name[0] : 'U')}`} alt={story.name} className="w-14 h-14 rounded-full mb-6 grayscale border border-emerald-500/20" />
                  <p className="text-slate-300 italic text-sm leading-relaxed font-light flex-1">"{story.bio || story.quote}"</p>
                  <div className="mt-8 border-t border-white/5 pt-6 w-full">
                    <p className="font-bold text-white text-sm">{story.name || "Anonymous Member"}</p>
                    <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1 opacity-60">{story.location || "Sanctuary Member"}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 opacity-55">
              <p className="text-slate-500 text-xs font-black uppercase tracking-[0.25em]">No shared peer stories in the directory yet.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;