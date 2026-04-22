import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Plus, ChevronRight, Search, Loader2, X, AlertCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DEFAULT_PAGES = [
  { id: 'home', title: 'Home Page', slug: '/' },
  { id: 'about', title: 'About Us', slug: '/about' },
  { id: 'services', title: 'Services', slug: '/services' },
  { id: 'gallery', title: 'Smile Gallery', slug: '/gallery' },
  { id: 'contact', title: 'Contact', slug: '/contact' }
];

export function AdminPages() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPage, setNewPage] = useState({ title: '', slug: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPages();
  }, []);

  async function fetchPages() {
    setLoading(true);
    try {
      const q = query(collection(db, 'pages'));
      const querySnapshot = await getDocs(q);
      const fetchedPages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Ensure all default pages are represented
      const defaultMap = new Map(DEFAULT_PAGES.map(p => [p.id, p]));
      
      // Combine - favor DB version if it exists
      const finalPages = [...fetchedPages];
      DEFAULT_PAGES.forEach(def => {
        if (!finalPages.find(p => p.id === def.id)) {
          finalPages.push(def);
        }
      });

      // Sort by title
      setPages(finalPages.sort((a: any, b: any) => (a.title || '').localeCompare(b.title || '')));
    } catch (error) {
      console.error("Error fetching pages:", error);
      setPages(DEFAULT_PAGES);
    } finally {
      setLoading(false);
    }
  }

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPage.title || !newPage.slug) return;
    
    // Normalize slug: remove special chars, spaces to dashes, lowercase
    let slug = newPage.slug.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // remove special chars
      .trim()
      .replace(/\s+/g, '-')         // spaces to dashes
      .replace(/-+/g, '-')          // multiple dashes to single
      .replace(/^\//, '');          // remove leading slash if entered
    
    const docId = slug || 'new-page-' + Date.now();
    slug = '/' + slug;

    try {
      await setDoc(doc(db, 'pages', docId), {
        title: newPage.title,
        slug: slug,
        sections: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setIsModalOpen(false);
      setNewPage({ title: '', slug: '' });
      navigate(`/admin/pages/edit/${docId}`);
    } catch (error: any) {
      console.error("Error creating page:", error);
      alert(`Error creating page: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (DEFAULT_PAGES.find(p => p.id === id)) {
      alert("Default system pages cannot be deleted.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this page?")) return;

    try {
      await deleteDoc(doc(db, 'pages', id));
      fetchPages();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <p className="text-brand-primary font-black uppercase tracking-[0.3em] mb-2 text-xs">Site Structure</p>
           <h1 className="text-4xl font-display font-bold text-brand-dark">Website Pages</h1>
           <p className="text-gray-500 mt-2">Create new pages or select an existing one to edit its content.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20"
        >
          <Plus className="w-5 h-5" />
          <span>NEW PAGE</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text"
          placeholder="Search pages by title or URL..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-brand-primary outline-none shadow-sm transition-all"
        />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPages.map((page, index) => {
            const isDefault = DEFAULT_PAGES.some(p => p.id === page.id);
            return (
              <motion.div
                key={page.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => navigate(`/admin/pages/edit/${page.id}`)}
                className="group bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-xl hover:border-brand-primary/20 transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                       <h3 className="text-lg font-bold text-brand-dark">{page.title}</h3>
                       {isDefault && (
                         <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-gray-100 text-gray-400 rounded-full">System</span>
                       )}
                    </div>
                    <p className="text-sm text-gray-400 font-medium">{page.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {!isDefault && (
                    <button 
                      onClick={(e) => handleDelete(e, page.id)}
                      className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                       <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                  <ChevronRight className="w-6 h-6 text-gray-200 group-hover:text-brand-primary transition-all" />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* New Page Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/20 backdrop-blur-sm"
          >
            <motion.div 
               initial={{ scale: 0.95, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 max-w-xl w-full space-y-8"
            >
               <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-display font-bold text-brand-dark">Create New Page</h2>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                     <X className="w-6 h-6 text-gray-400" />
                  </button>
               </div>

               <form onSubmit={handleCreatePage} className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Page Title</label>
                     <input 
                        required
                        type="text"
                        value={newPage.title}
                        onChange={(e) => setNewPage({...newPage, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-')})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                        placeholder="e.g. Patient Information"
                     />
                  </div>

                  <div className="space-y-2">
                     <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">URL Slug</label>
                     <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 font-bold">/</div>
                        <input 
                           required
                           type="text"
                           value={newPage.slug}
                           onChange={(e) => setNewPage({...newPage, slug: e.target.value})}
                           className="w-full pl-8 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                           placeholder="patient-info"
                        />
                     </div>
                  </div>

                  <div className="bg-amber-50 p-6 rounded-2xl flex gap-4 text-amber-700">
                     <AlertCircle className="w-6 h-6 shrink-0" />
                     <p className="text-sm border-l border-amber-200 pl-4 leading-relaxed">
                        The URL slug determines the address of the page (e.g. yoursite.com/<b>patient-info</b>). Use only letters, numbers, and dashes.
                     </p>
                  </div>

                  <div className="pt-4 flex gap-4">
                     <button 
                        type="submit"
                        className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all"
                     >
                        Create Page
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
