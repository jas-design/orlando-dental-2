import React, { useState, useEffect } from 'react';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { FileText, Plus, ChevronRight, Search, Loader2 } from 'lucide-react';
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
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchPages() {
      try {
        const q = query(collection(db, 'pages'));
        const querySnapshot = await getDocs(q);
        const fetchedPages = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        
        // Merge default pages with fetched pages to ensure they all exist in the list
        const merged = DEFAULT_PAGES.map(defaultPage => {
          const match = fetchedPages.find(p => p.id === defaultPage.id);
          return match || defaultPage;
        });

        setPages(merged);
      } catch (error) {
        console.error("Error fetching pages:", error);
        setPages(DEFAULT_PAGES);
      } finally {
        setLoading(false);
      }
    }
    fetchPages();
  }, []);

  const filteredPages = pages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-display font-bold text-brand-dark mb-2">Website Pages</h1>
          <p className="text-gray-500">Select a page to edit its content and structure</p>
        </div>
        <button 
          disabled
          className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-400 rounded-2xl font-bold cursor-not-allowed"
          title="New page creation coming soon"
        >
          <Plus className="w-5 h-5" />
          <span>New Page</span>
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input 
          type="text"
          placeholder="Search pages..."
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
          {filteredPages.map((page, index) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/admin/pages/edit/${page.id}`)}
              className="group bg-white p-6 rounded-[32px] border border-gray-50 shadow-sm hover:shadow-xl hover:border-brand-primary/20 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-brand-dark">{page.title}</h3>
                  <p className="text-sm text-gray-400">{page.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="hidden md:inline text-xs font-black uppercase tracking-widest text-gray-300 group-hover:text-brand-primary transition-colors">Edit Content</span>
                <ChevronRight className="w-5 h-5 text-gray-200 group-hover:text-brand-primary transition-colors" />
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
