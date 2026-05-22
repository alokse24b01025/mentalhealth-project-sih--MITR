import React, { useState, useEffect, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../AuthContext';

// --- Sub-component: Individual Post Item ---
const PostItem = ({ post, onUpdate }) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const handleUpvote = async () => {
    try {
      const res = await fetch(`https://https://mentalhealth-project-sih-mitr.onrender.com/api/posts/${post._id}/upvote`, { method: 'PUT' });
      if (res.ok) onUpdate();
    } catch (err) { console.error("Upvote failed", err); }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`https://https://mentalhealth-project-sih-mitr.onrender.com/api/posts/${post._id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: commentText })
      });
      if (res.ok) {
        setCommentText('');
        onUpdate();
      }
    } catch (err) { console.error("Comment failed", err); }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl mb-6 overflow-hidden flex shadow-xl transition-all hover:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Side Vote Bar */}
      <div className="bg-slate-950/40 w-12 flex flex-col items-center py-4 border-r border-slate-800 text-slate-500">
        <button onClick={handleUpvote} className="hover:text-emerald-500 transition-all text-xl">▲</button>
        <span className="text-emerald-500 font-mono font-bold my-1 text-sm">{post.likes || 0}</span>
        <button className="hover:text-red-500 transition-all text-xl">▼</button>
      </div>

      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-3">
          <span className="text-emerald-400 text-xs font-bold italic uppercase tracking-widest">Anonymous Peer</span>
          <span className="text-slate-500 text-[10px]">{new Date(post.date).toLocaleDateString()}</span>
        </div>
        
        <p className="text-slate-200 text-lg mb-4 leading-relaxed whitespace-pre-wrap">{post.content}</p>
        
        {/* MEDIA RENDERER: Connects to server's static uploads folder */}
        {post.image && (
          <div className="mb-4 rounded-xl overflow-hidden border border-slate-800 bg-black shadow-inner">
            {post.image.match(/\.(mp4|webm|ogg|mov)$/i) ? (
              <video 
                src={`https://https://mentalhealth-project-sih-mitr.onrender.com${post.image}`} 
                controls 
                className="w-full max-h-[500px]" 
              />
            ) : (
              <img 
                src={`https://https://mentalhealth-project-sih-mitr.onrender.com${post.image}`} 
                alt="Post content" 
                className="w-full max-h-[500px] object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            )}
          </div>
        )}

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowComments(!showComments)} 
            className="text-slate-500 text-xs font-bold hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            💬 {post.comments?.length || 0} Comments
          </button>
        </div>

        {showComments && (
          <div className="mt-6 border-t border-slate-800 pt-4 space-y-4">
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input 
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm outline-none focus:border-emerald-500 transition-all"
                placeholder="Write a supportive reply..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className="bg-emerald-600 px-4 py-2 rounded-lg text-xs font-bold text-white hover:bg-emerald-500 transition-colors">Reply</button>
            </form>
            {post.comments?.map((c, i) => (
              <div key={i} className="bg-slate-800/40 p-3 rounded-lg border-l-2 border-emerald-500 text-slate-300 text-sm">
                {c.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Page Component ---
const PeerSupport = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('newest'); 
  
  const fileInputRef = useRef(null);
  const { currentUser } = useAuth();

  const fetchPosts = async () => {
    try {
      const res = await fetch('https://https://mentalhealth-project-sih-mitr.onrender.com/api/posts');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err) { 
      console.error("Fetch error:", err); 
    } finally { 
      setIsLoading(false); 
    }
  };

  useEffect(() => { 
    fetchPosts(); 
    // Cleanup preview URL to prevent memory leaks
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, []);

  // Sorting Logic: Applied before rendering
  const sortedPosts = [...posts].sort((a, b) => {
    if (sortBy === 'popular') return (b.likes || 0) - (a.likes || 0);
    return new Date(b.date) - new Date(a.date);
  });

  const onFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Revoke old URL if it exists
      if (filePreview) URL.revokeObjectURL(filePreview);
      setFilePreview(URL.createObjectURL(selectedFile));
    }
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (!newPost.trim() || isPosting) return;
    setIsPosting(true);

    const formData = new FormData();
    formData.append('content', newPost);
    formData.append('authorEmail', currentUser?.email || "Anonymous");
    if (file) formData.append('media', file); // Field name must match backend Multer setup

    try {
      const res = await fetch('https://https://mentalhealth-project-sih-mitr.onrender.com/api/posts/create', {
        method: 'POST',
        body: formData, // Browser handles multipart headers
      });

      if (res.ok) {
        setNewPost('');
        setFile(null);
        if (filePreview) URL.revokeObjectURL(filePreview);
        setFilePreview(null);
        fetchPosts();
      }
    } catch (err) { 
      alert("Upload failed. Check server connection."); 
    } finally { 
      setIsPosting(false); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-200">
      <Header />
      <main className="max-w-3xl mx-auto pt-40 p-6 flex-1 w-full">
        <div className="text-center mb-10">
          <h2 className="text-5xl font-black text-white tracking-tight">Community Feed</h2>
          <p className="mt-4 text-slate-400 font-medium">Safe, anonymous multimedia support from your peers.</p>
        </div>

        {/* Input Form */}
        <form onSubmit={handlePost} className="bg-slate-900 border border-emerald-900/30 p-6 rounded-2xl mb-8 shadow-2xl transition-all hover:shadow-emerald-900/5">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="w-full p-4 bg-slate-800 rounded-xl text-white border border-slate-700 outline-none mb-4 focus:ring-2 focus:ring-emerald-500 transition-all resize-none"
            placeholder="Share your story anonymously... Access camera or gallery below."
            rows="3"
            required
          />
          
          {filePreview && (
            <div className="mb-4 relative group w-max">
                <button 
                  type="button"
                  onClick={() => {
                    setFile(null); 
                    URL.revokeObjectURL(filePreview);
                    setFilePreview(null);
                  }}
                  className="absolute -top-2 -right-2 bg-red-600 p-1.5 rounded-full z-10 shadow-lg hover:bg-red-500 transition-colors"
                >
                  <svg xmlns="https://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                {file?.type.startsWith('video') ? (
                  <video src={filePreview} className="h-40 rounded-lg border border-slate-700 shadow-xl" muted />
                ) : (
                  <img src={filePreview} className="h-40 rounded-lg border border-slate-700 object-cover shadow-xl" />
                )}
            </div>
          )}

          <div className="flex items-center justify-between gap-4">
            <button 
              type="button" 
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-5 py-2.5 rounded-xl text-sm font-semibold border border-slate-600 transition-all text-slate-300 active:scale-95"
            >
              <span>{file ? "Change Selection" : "📁 Photo/Video / 📷 Camera"}</span>
            </button>
            
            <input 
              type="file" 
              hidden 
              ref={fileInputRef} 
              accept="image/*,video/*" 
              onChange={onFileChange} 
            />

            <button 
              type="submit" 
              disabled={isPosting} 
              className="bg-emerald-600 px-8 py-3 rounded-xl font-bold hover:bg-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white shadow-lg shadow-emerald-900/20 active:scale-95"
            >
              {isPosting ? 'Uploading...' : 'Post to Community'}
            </button>
          </div>
        </form>

        {/* Sorting Toggle Logic */}
        <div className="flex justify-end gap-2 mb-6">
          <button 
            type="button"
            onClick={() => setSortBy('newest')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${sortBy === 'newest' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Newest
          </button>
          <button 
            type="button"
            onClick={() => setSortBy('popular')}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${sortBy === 'popular' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
          >
            Most Popular
          </button>
        </div>

        {/* The Feed Rendering */}
        <div className="space-y-6 pb-20">
          {isLoading ? (
            <div className="flex flex-col items-center py-20 text-emerald-500">
               <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
               <p className="font-bold animate-pulse">Syncing with Community...</p>
            </div>
          ) : sortedPosts.length > 0 ? (
            sortedPosts.map(post => <PostItem key={post._id} post={post} onUpdate={fetchPosts} />)
          ) : (
            <div className="text-center py-24 bg-slate-900/30 rounded-3xl border border-slate-800/50">
               <p className="text-xl text-slate-500 font-medium">The feed is empty. Be the first to reach out.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PeerSupport;