import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Plus, Trash2, Loader2, Search, X, Check, Edit2 } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

import { ImageUpload } from '../components/ImageUpload';

const CATEGORIES = ['Cosmetic', 'Implants', 'Orthodontics', 'General'];

export function AdminGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { showNotification } = useNotification();
  
  const [imageForm, setImageForm] = useState({
    title: '',
    caption: '',
    url: '',
    category: 'Cosmetic'
  });

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    setLoading(true);
    try {
      const q = query(collection(db, 'gallery'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setImages(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageForm.url) {
      showNotification('Please upload an image first.', 'error');
      return;
    }
    
    setSaving(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'gallery', editingId), {
          ...imageForm,
          updatedAt: new Date().toISOString()
        });
        showNotification('Image updated successfully!');
      } else {
        await addDoc(collection(db, 'gallery'), {
          ...imageForm,
          createdAt: new Date().toISOString()
        });
        showNotification('Image added to gallery!');
      }
      setIsModalOpen(false);
      setEditingId(null);
      setImageForm({ title: '', url: '', category: 'Cosmetic' });
      fetchImages();
    } catch (error) {
      console.error("Error saving image:", error);
      showNotification("Error saving image.", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (img: any) => {
    setEditingId(img.id);
    setImageForm({
      title: img.title || '',
      caption: img.caption || '',
      url: img.url || '',
      category: img.category || 'Cosmetic'
    });
    setIsModalOpen(true);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setImageForm({ title: '', caption: '', url: '', category: 'Cosmetic' });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    try {
      await deleteDoc(doc(db, 'gallery', id));
      fetchImages();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const filteredImages = images.filter(img => 
    img.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    img.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <p className="text-brand-primary font-black uppercase tracking-[0.3em] mb-2 text-xs">Visual Assets</p>
           <h1 className="text-4xl font-display font-bold text-brand-dark">Smile Gallery</h1>
           <p className="text-gray-500 mt-2">Manage the before & after images and showcase gallery.</p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20"
        >
          <Plus className="w-5 h-5" />
          <span>ADD IMAGE</span>
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
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/20 backdrop-blur-sm"
          >
            <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 max-w-xl w-full space-y-8">
               <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-display font-bold text-brand-dark">
                    {editingId ? 'Edit Gallery Image' : 'Add New Gallery Image'}
                  </h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                     <X className="w-6 h-6 text-gray-400" />
                  </button>
               </div>

               <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Image Title</label>
                     <input 
                        required
                        type="text"
                        value={imageForm.title}
                        onChange={(e) => setImageForm({...imageForm, title: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                        placeholder="e.g. Teeth Whitening Results"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Caption / Description</label>
                     <input 
                        type="text"
                        value={imageForm.caption}
                        onChange={(e) => setImageForm({...imageForm, caption: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                        placeholder="Additional details about this case..."
                     />
                  </div>

                  <div className="space-y-2">
                     <ImageUpload 
                       label="Image Asset"
                       value={imageForm.url}
                       onChange={(url) => setImageForm({...imageForm, url: url})}
                       folder="images"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Category</label>
                     <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                           <button 
                              key={cat}
                              type="button"
                              onClick={() => setImageForm({...imageForm, category: cat})}
                              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${imageForm.category === cat ? 'bg-brand-primary text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                           >
                              {cat}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                     <button 
                        type="submit"
                        disabled={saving}
                        className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                     >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        {saving ? 'Saving...' : (editingId ? 'Update Image' : 'Add to Gallery')}
                     </button>
                     <button 
                        type="button"
                        onClick={() => setIsModalOpen(false)}
                        className="px-8 py-4 border border-gray-100 text-gray-400 rounded-2xl font-bold uppercase tracking-widest hover:bg-gray-50 transition-all"
                     >
                        Cancel
                     </button>
                  </div>
               </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredImages.map((img, index) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group relative bg-white rounded-[40px] overflow-hidden border border-gray-50 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all p-4"
            >
              <div className="aspect-square rounded-[32px] overflow-hidden bg-gray-50 relative">
                 <img 
                   src={img.url} 
                   alt={img.title} 
                   className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                   onError={(e) => {
                     (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80';
                   }}
                 />
                 <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/5 transition-colors duration-500"></div>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleEdit(img)}
                      className="w-10 h-10 bg-white text-gray-400 rounded-full flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-md z-10"
                      title="Edit"
                    >
                       <Edit2 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(img.id)}
                      className="w-10 h-10 bg-white text-gray-400 rounded-full flex items-center justify-center transition-all hover:bg-red-500 hover:text-white shadow-md z-10"
                      title="Delete"
                    >
                       <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
              </div>
              <div className="p-4 space-y-1 text-left">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary block">{img.category}</span>
                 <h3 className="font-bold text-brand-dark truncate">{img.title}</h3>
                 {img.caption && <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{img.caption}</p>}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredImages.length === 0 && (
         <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
            <ImageIcon className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold">No images found in the gallery.</p>
         </div>
      )}
    </div>
  );
}
