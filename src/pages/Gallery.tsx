import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search } from 'lucide-react';

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'results' | 'office'>('all');

  const images = [
    {
      url: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=800',
      category: 'results',
      title: 'Invisalign Treatment result'
    },
    {
      url: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=800',
      category: 'results',
      title: 'Smile Transformation'
    },
    {
      url: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800',
      category: 'office',
      title: 'Modern Consultation Room'
    },
    {
      url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=800',
      category: 'office',
      title: 'Treatment Bay'
    },
    {
      url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800',
      category: 'office',
      title: 'Welcoming Reception'
    },
    {
      url: 'https://images.unsplash.com/photo-1516062423079-7ca13cdc7f52?auto=format&fit=crop&q=80&w=800',
      category: 'results',
      title: 'Dental Implant Result'
    }
  ];

  const filteredImages = filter === 'all' ? images : images.filter(img => img.category === filter);

  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Header */}
      <section className="bg-[#D4ECEE] py-24 mb-12">
        <div className="container mx-auto px-4 text-center">
           <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-dark mb-6">Smile Gallery</h1>
           <p className="text-gray-700 font-medium text-xl max-w-2xl mx-auto leading-relaxed">
             Take a look at our modern facility and some of the amazing transformations we've achieved for our patients.
           </p>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="container mx-auto px-4 mb-12">
        <div className="flex justify-center gap-6">
          {[
            { id: 'all', label: 'All Photos' },
            { id: 'results', label: 'Patient Results' },
            { id: 'office', label: 'Our Office' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`px-6 py-2 rounded-full font-bold transition-all ${
                filter === tab.id 
                  ? 'bg-brand-primary text-brand-dark shadow-md' 
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="container mx-auto px-4 pb-24">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, i) => (
              <motion.div
                key={img.url}
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
                  <p className="text-sm font-bold text-gray-900">{img.title}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
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
              className="max-w-full max-h-full object-contain rounded-xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
