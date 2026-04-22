import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Plus, Trash2, Loader2, Search, X, Check, Edit2, Calendar, User, Tag } from 'lucide-react';

export function AdminBlog() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentPost, setCurrentPost] = useState<any>(null);

  const emptyPost = {
    title: '',
    category: 'General Dentistry',
    author: 'Admin',
    description: '',
    image: '',
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const q = query(collection(db, 'blog'), orderBy('date', 'desc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPosts(data);
    } catch (error) {
      console.error("Error fetching blog:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentPost.id) {
        // Update existing
        const { id, ...data } = currentPost;
        await updateDoc(doc(db, 'blog', id), data);
      } else {
        // Create new
        await addDoc(collection(db, 'blog'), {
          ...currentPost,
          createdAt: new Date().toISOString()
        });
      }
      setIsEditMode(false);
      fetchPosts();
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Error saving post.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;
    try {
      await deleteDoc(doc(db, 'blog', id));
      fetchPosts();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const openEditor = (post: any = null) => {
    setCurrentPost(post || { ...emptyPost });
    setIsEditMode(true);
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <p className="text-brand-primary font-black uppercase tracking-[0.3em] mb-2 text-xs">Knowledge Base</p>
           <h1 className="text-4xl font-display font-bold text-brand-dark">Blog Management</h1>
           <p className="text-gray-500 mt-2">Create articles and oral health tips for your patients.</p>
        </div>
        <button 
          onClick={() => openEditor()}
          className="flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20"
        >
          <Plus className="w-5 h-5" />
          <span>NEW POST</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text"
          placeholder="Search by title or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none shadow-sm transition-all"
        />
      </div>

      <AnimatePresence>
        {isEditMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/20 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div 
               initial={{ scale: 0.95, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 max-w-2xl w-full space-y-8 sticky top-4 my-8"
            >
               <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-display font-bold text-brand-dark">
                     {currentPost.id ? 'Edit Blog Post' : 'Create New Post'}
                  </h2>
                  <button onClick={() => setIsEditMode(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                     <X className="w-6 h-6 text-gray-400" />
                  </button>
               </div>

               <form onSubmit={handleSavePost} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Post Title</label>
                        <input 
                           required
                           type="text"
                           value={currentPost.title}
                           onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                           placeholder="How to care for..."
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Category</label>
                        <input 
                           required
                           type="text"
                           value={currentPost.category}
                           onChange={(e) => setCurrentPost({...currentPost, category: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                           placeholder="General Care"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Author Name</label>
                        <input 
                           type="text"
                           value={currentPost.author}
                           onChange={(e) => setCurrentPost({...currentPost, author: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Publish Date</label>
                        <input 
                           type="text"
                           value={currentPost.date}
                           onChange={(e) => setCurrentPost({...currentPost, date: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                        />
                     </div>
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Featured Image URL</label>
                        <input 
                           required
                           type="url"
                           value={currentPost.image}
                           onChange={(e) => setCurrentPost({...currentPost, image: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                           placeholder="https://images.unsplash.com/..."
                        />
                     </div>
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Preview Description</label>
                        <textarea 
                           required
                           rows={4}
                           value={currentPost.description}
                           onChange={(e) => setCurrentPost({...currentPost, description: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all resize-none"
                           placeholder="Brief summary for the blog listing page..."
                        />
                     </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                     <button 
                        type="submit"
                        disabled={saving}
                        className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                     >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        {saving ? 'Saving...' : 'Publish Post'}
                     </button>
                     <button 
                        type="button"
                        onClick={() => setIsEditMode(false)}
                        className="px-8 py-4 border border-gray-100 text-gray-400 rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
                     >
                        Cancel
                     </button>
                  </div>
               </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filteredPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-xl hover:border-brand-primary/20 transition-all flex flex-col lg:flex-row lg:items-center gap-8"
            >
              <div className="lg:w-48 h-32 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                 <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
              </div>
              <div className="flex-grow space-y-3">
                 <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-brand-primary border border-brand-primary/20 px-2.5 py-1 rounded-full">
                       <Tag className="w-3 h-3" /> {post.category}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
                       <Calendar className="w-3.5 h-3.5" /> {post.date}
                    </span>
                 </div>
                 <h3 className="text-xl font-bold text-brand-dark group-hover:text-brand-primary transition-colors">{post.title}</h3>
                 <p className="text-sm text-gray-400 line-clamp-2">{post.description}</p>
                 <div className="flex items-center gap-2 text-xs text-gray-300">
                    <User className="w-3.5 h-3.5" /> Published by <span className="font-bold text-gray-400">{post.author}</span>
                 </div>
              </div>
              <div className="flex flex-row lg:flex-col gap-2 shrink-0">
                 <button 
                   onClick={() => openEditor(post)}
                   className="flex-1 lg:w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-sm"
                 >
                    <Edit2 className="w-5 h-5" />
                 </button>
                 <button 
                   onClick={() => handleDelete(post.id)}
                   className="flex-1 lg:w-12 h-12 bg-gray-50 text-gray-400 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-sm"
                 >
                    <Trash2 className="w-5 h-5" />
                 </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredPosts.length === 0 && (
         <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
            <FileText className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold">No articles found in the blog.</p>
         </div>
      )}
    </div>
  );
}
