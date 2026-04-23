import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Image as ImageIcon, Plus, Trash2, Loader2, Search, X, Check, Filter } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

import { ImageUpload } from '../components/ImageUpload';

const CATEGORIES = ['Cosmetic', 'Implants', 'Orthodontics', 'General'];

export function AdminGallery() {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddMode, setIsAddMode] = useState(false);
  const { showNotification } = useNotification();
  
  const [newImage, setNewImage] = useState({
    title: '',
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

  const handleAddImage = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await addDoc(collection(db, 'gallery'), {
        ...newImage,
        createdAt: new Date().toISOString()
      });
      setIsAddMode(false);
      setNewImage({ title: '', url: '', category: 'Cosmetic' });
      fetchImages();
      showNotification('Image added to gallery!');
    } catch (error) {
      console.error("Error adding image:", error);
      showNotification("Error adding image.", "error");
    } finally {
      setSaving(false);
    }
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
          onClick={() => setIsAddMode(true)}
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
        {isAddMode && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/20 backdrop-blur-sm"
          >
            <div className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 max-w-xl w-full space-y-8">
               <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-display font-bold text-brand-dark">Add New Gallery Image</h2>
                  <button onClick={() => setIsAddMode(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                     <X className="w-6 h-6 text-gray-400" />
                  </button>
               </div>

               <form onSubmit={handleAddImage} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Image Title</label>
                     <input 
                        required
                        type="text"
                        value={newImage.title}
                        onChange={(e) => setNewImage({...newImage, title: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                        placeholder="e.g. Teeth Whitening Results"
                     />
                  </div>

                  <div className="space-y-2">
                     <ImageUpload 
                       label="Image Asset"
                       value={newImage.url}
                       onChange={(url) => setNewImage({...newImage, url: url})}
                       folder="gallery"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Category</label>
                     <div className="flex flex-wrap gap-2">
                        {CATEGORIES.map(cat => (
                           <button 
                              key={cat}
                              type="button"
                              onClick={() => setNewImage({...newImage, category: cat})}
                              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${newImage.category === cat ? 'bg-brand-primary text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
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
                        {saving ? 'Publishing...' : 'Add to Gallery'}
                     </button>
                     <button 
                        type="button"
                        onClick={() => setIsAddMode(false)}
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
              <div className="aspect-square rounded-[32px] overflow-hidden bg-gray-100 relative">
                 <img src={img.url} alt={img.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-brand-dark/0 group-hover:bg-brand-dark/40 transition-colors duration-500"></div>
                 <button 
                   onClick={() => handleDelete(img.id)}
                   className="absolute top-4 right-4 w-10 h-10 bg-white/10 backdrop-blur-md text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500"
                 >
                    <Trash2 className="w-5 h-5" />
                 </button>
              </div>
              <div className="p-4 space-y-1">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary">{img.category}</span>
                 <h3 className="font-bold text-brand-dark truncate">{img.title}</h3>
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
