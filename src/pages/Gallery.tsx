import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Loader2 } from 'lucide-react';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { renderTitle } from '../lib/utils';

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | string>('all');
  const [galleryItems, setGalleryItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Page Data
        const pageSnap = await getDoc(doc(db, 'pages', 'gallery'));
        if (pageSnap.exists()) setPageData(pageSnap.data());

        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setGalleryItems(data);
      } catch (error) {
        console.error("Error fetching gallery:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const staticImages = [
    {
      url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800',
      category: 'Cosmetic',
      title: 'Invisalign Treatment result'
    },
    {
      url: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800',
      category: 'Cosmetic',
      title: 'Smile Transformation'
    }
  ];

  const images = galleryItems.length > 0 ? galleryItems : staticImages;
  const filteredImages = filter === 'all' ? images : images.filter(img => img.category === filter);
  const categories = ['all', ...Array.from(new Set(images.map((img: any) => img.category)))];
  
  const heroSection = pageData?.sections?.find((s: any) => s.type === 'hero');

  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Header */}
      <section className="bg-[#D4ECEE] py-24 mb-12">
        <div className="container mx-auto px-4 text-center">
           <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-dark mb-6">
             {renderTitle(heroSection?.title) || 'Smile Gallery'}
           </h1>
           <p className="text-gray-700 font-medium text-xl max-w-2xl mx-auto leading-relaxed">
             {heroSection?.description || 'Take a look at our modern facility and some of the amazing transformations we\'ve achieved for our patients.'}
           </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat as any)}
              className={`px-8 py-3 rounded-full font-bold transition-all uppercase text-[10px] tracking-widest ${
                filter === cat 
                  ? 'bg-brand-primary text-brand-dark shadow-xl shadow-brand-primary/20' 
                  : 'bg-gray-50 text-gray-400 hover:text-gray-900'
              }`}
            >
              {cat === 'all' ? 'All Photos' : cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 pb-24">
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            <AnimatePresence mode="popLayout">
              {filteredImages.map((img, i) => (
                <motion.div
                  key={img.url || i}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="relative group cursor-pointer overflow-hidden rounded-3xl shadow-sm hover:shadow-xl transition-all"
                  onClick={() => setSelectedImage(img.url)}
                >
                  <img 
                    src={img.url} 
                    alt={img.title} 
                    className="w-full h-auto object-cover" 
                  />
                  <div className="absolute inset-0 bg-brand-dark/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-brand-primary shadow-lg">
                       <Search className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl translate-y-12 group-hover:translate-y-0 transition-transform">
                    <p className="text-sm font-bold text-gray-900 line-clamp-1">{img.title}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 p-4 md:p-12 flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            <button 
              className="absolute top-8 right-8 text-white p-2 hover:bg-white/10 rounded-full transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-8 h-8" />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={selectedImage} 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl" 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
