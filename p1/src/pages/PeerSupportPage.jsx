import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAuth } from '../AuthContext';

const PostCard = ({ post, onUpdate }) => {
  // --- States must be INSIDE the component ---
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleUpvote = async () => {
    const res = await fetch(`https://mentalhealth-backend-sa09.onrender.com/api/posts/${post._id}/upvote`, { method: 'PUT' });
    if (res.ok) onUpdate();
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const res = await fetch(`https://mentalhealth-backend-sa09.onrender.com/api/posts/${post._id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: commentText, author: "Anonymous Peer" })
    });
    if (res.ok) {
      setCommentText('');
      onUpdate();
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl mb-6 overflow-hidden flex shadow-xl">
      {/* Reddit-style Side Vote Bar */}
      <div className="bg-slate-950/40 w-10 sm:w-12 flex-shrink-0 flex flex-col items-center py-4 border-r border-slate-800 text-slate-500">
        <button onClick={handleUpvote} className="hover:text-emerald-500 transition-all text-lg sm:text-xl">▲</button>
        <span className="text-emerald-500 font-mono font-bold my-0.5 sm:my-1 text-xs sm:text-sm">{post.likes || 0}</span>
        <button className="hover:text-red-500 transition-all text-lg sm:text-xl">▼</button>
      </div>

      <div className="flex-1 p-4 sm:p-6">
        <p className="text-slate-200 text-sm sm:text-lg mb-4">{post.content}</p>
        
        {/* RENDER IMAGE IF IT EXISTS */}
        {post.image && (
          <div className="mb-4 rounded-xl overflow-hidden border border-slate-800">
            <img src={post.image} alt="Post content" className="w-full max-h-96 object-cover" />
          </div>
        )}

        <div className="flex gap-4">
          <button onClick={() => setShowComments(!showComments)} className="text-slate-500 text-xs font-bold hover:text-emerald-400">
            💬 {post.comments?.length || 0} Comments
          </button>
        </div>

        {showComments && (
          <div className="mt-6 space-y-4 border-t border-slate-800 pt-4 animate-fade-in">
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input 
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white outline-none focus:border-emerald-500"
                placeholder="Add a supportive comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button type="submit" className="bg-emerald-600 px-4 py-2 rounded-lg text-xs font-bold text-white hover:bg-emerald-500">
                Reply
              </button>
            </form>
            
            {/* SAFE MAPPING with Optional Chaining */}
            {post.comments?.map((c, i) => (
              <div key={i} className="bg-slate-800/40 p-3 rounded-lg border-l-2 border-emerald-500">
                <p className="text-slate-300 text-sm">{c.text}</p>
                <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-widest">Anonymous Peer</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PeerSupport = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [imageURL, setImageURL] = useState('');
  const { currentUser } = useAuth();

  const fetchPosts = async () => {
    try {
      const res = await fetch('https://mentalhealth-backend-sa09.onrender.com/api/posts');
      const data = await res.json();
      setPosts(data);
    } catch (err) { console.error("Fetch error:", err); }
  };

  useEffect(() => { fetchPosts(); }, []);
const handleAddPost = async (e) => {
  e.preventDefault();
  console.log("Attempting to post..."); // Check your Browser Console (F12)

  try {
    const res = await fetch('https://mentalhealth-backend-sa09.onrender.com/api/posts/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        content: newPost, 
        image: imageURL, 
        authorEmail: currentUser?.email || "anonymous@test.com" 
      })
    });

    const data = await res.json();
    console.log("Server Response:", data);

    if (res.ok) {
      alert("✅ Post Success!"); // Confirmation
      setNewPost('');
      setImageURL('');
      fetchPosts(); 
    } else {
      // This will show you exactly what Mongoose is complaining about
      alert("❌ Server rejected post: " + JSON.stringify(data.errors || data.message));
    }
  } catch (err) {
    console.error("Fetch Error:", err);
    alert("❌ Network Error: Is your backend running on Port 5000?");
  }
};

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200">
      <Header />
      <main className="max-w-3xl mx-auto pt-24 sm:pt-40 p-4 sm:p-6">
        <h2 className="text-3xl sm:text-4xl font-black mb-8 text-white tracking-tight text-center">Community Feed</h2>
        
        <form onSubmit={handleAddPost} className="bg-slate-900 border border-emerald-900/30 p-4 sm:p-6 rounded-2xl mb-12 shadow-2xl">
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            className="w-full p-4 bg-slate-800 rounded-xl text-white border border-slate-700 outline-none mb-4 focus:ring-2 focus:ring-emerald-500 transition-all"
            placeholder="Share your story anonymously..."
            rows="3"
            required
          />
          <input 
            type="text"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            className="w-full p-3 bg-slate-800 rounded-xl text-white border border-slate-700 outline-none mb-4 text-sm focus:ring-2 focus:ring-emerald-500 transition-all"
            placeholder="Image URL (Optional - e.g. Imgur/Unsplash link)"
          />
          <button type="submit" className="w-full bg-emerald-600 px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-500 transition-all shadow-lg hover:shadow-emerald-900/20 text-white text-sm">
            Post to Community
          </button>
        </form>

        <div className="space-y-6 pb-20">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard key={post._id} post={post} onUpdate={fetchPosts} />
            ))
          ) : (
            <div className="text-center py-20 opacity-50">
               <p>No community voices yet. Be the first to share.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PeerSupport;