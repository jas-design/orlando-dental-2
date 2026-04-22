import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Save, ChevronLeft, Loader2, Image as ImageIcon, Plus, Trash2, Eye, Type, Layout, Star, Search } from 'lucide-react';

export function AdminPageEditor() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('content');

  useEffect(() => {
    async function fetchPageData() {
      if (!pageId) return;
      setLoading(true);
      try {
        const docRef = doc(db, 'pages', pageId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPageData(docSnap.data());
        } else {
          // Initialize with default template based on pageId
          const template = getTemplateForPage(pageId);
          setPageData(template);
        }
      } catch (error) {
        console.error("Error fetching page:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPageData();
  }, [pageId]);

  const getTemplateForPage = (id: string) => {
    const common = { slug: `/${id === 'home' ? '' : id}`, title: id.charAt(0).toUpperCase() + id.slice(1) };
    
    if (id === 'home') {
      return {
        ...common,
        title: 'Home Page',
        sections: [
          {
            id: 'hero',
            type: 'hero',
            badge: 'EXCELLENCE IN DENTISTRY',
            title: 'Modern Care, Classic Smile',
            description: 'Experience dental care that combines advanced technology with a gentle, personalized touch in a comfortable environment.',
            cta: 'Book Appointment',
            image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80'
          },
          {
            id: 'services_intro',
            type: 'text_with_image',
            title: 'Why Choose Us?',
            description: 'Our team is dedicated to providing the highest quality dental care using state-of-the-art equipment.',
            image: 'https://images.unsplash.com/photo-1576091160550-217359f48f4c?auto=format&fit=crop&q=80'
          }
        ]
      };
    }
    return { ...common, sections: [] };
  };

  const handleSave = async () => {
    if (!pageId || !pageData) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'pages', pageId), {
        ...pageData,
        updatedAt: new Date().toISOString()
      });
      alert('Page updated successfully!');
    } catch (error) {
      console.error("Error saving page:", error);
      alert('Error saving page. Check console for details.');
    } finally {
      setSaving(false);
    }
  };

  const updateSection = (index: number, data: any) => {
    const newSections = [...pageData.sections];
    newSections[index] = { ...newSections[index], ...data };
    setPageData({ ...pageData, sections: newSections });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/admin/pages')}
            className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-brand-primary hover:border-brand-primary/20 transition-all shadow-sm"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-display font-bold text-brand-dark">Editing: {pageData?.title}</h1>
            <p className="text-sm text-gray-400">Manage the content and sections of this page</p>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>Save Changes</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Controls */}
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-[32px] border border-gray-50 shadow-sm space-y-2">
            <button 
              onClick={() => setActiveTab('content')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'content' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <Layout className="w-5 h-5" />
              <span>Sections</span>
            </button>
            <button 
              onClick={() => setActiveTab('seo')}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${activeTab === 'seo' ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20' : 'text-gray-400 hover:bg-gray-50'}`}
            >
              <Search className="w-5 h-5" />
              <span>SEO & Meta</span>
            </button>
          </div>

          <div className="bg-brand-dark p-8 rounded-[32px] text-white space-y-4 relative overflow-hidden">
             <div className="relative z-10">
                <Star className="w-8 h-8 text-brand-primary mb-4" />
                <h4 className="font-bold">Editor Tip</h4>
                <p className="text-sm opacity-60 leading-relaxed">Changes saved here will reflect immediately on the live website.</p>
             </div>
             <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-primary/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'content' ? (
            <div className="space-y-8">
              {pageData?.sections.map((section: any, index: number) => (
                <SectionEditor 
                  key={section.id + index} 
                  section={section} 
                  onUpdate={(data) => updateSection(index, data)} 
                />
              ))}

              <button className="w-full py-8 border-2 border-dashed border-gray-100 rounded-[32px] text-gray-300 font-bold flex flex-col items-center justify-center gap-4 hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all">
                 <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                    <Plus className="w-6 h-6" />
                 </div>
                 <span>Add New Section</span>
              </button>
            </div>
          ) : (
             <div className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-sm space-y-8">
                <div className="space-y-4">
                   <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Page Title (Meta)</label>
                   <input 
                     type="text" 
                     value={pageData?.title} 
                     onChange={(e) => setPageData({...pageData, title: e.target.value})}
                     className="w-full p-4 bg-gray-50 border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                   />
                </div>
                <div className="space-y-4">
                   <label className="text-sm font-bold uppercase tracking-widest text-gray-400">Page Slug</label>
                   <input 
                     type="text" 
                     value={pageData?.slug} 
                     onChange={(e) => setPageData({...pageData, slug: e.target.value})}
                     className="w-full p-4 bg-gray-50 border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                   />
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface SectionEditorProps {
  section: any;
  onUpdate: (data: any) => void;
  key?: any;
}

function SectionEditor({ section, onUpdate }: SectionEditorProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div 
        className="px-8 py-6 flex items-center justify-between cursor-pointer border-b border-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
           <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
              {section.type === 'hero' ? <Star className="w-5 h-5" /> : <Type className="w-5 h-5" />}
           </div>
           <div>
              <h3 className="font-bold text-brand-dark uppercase tracking-widest text-xs">{section.id} Section</h3>
              <p className="text-sm text-gray-400 font-medium">Type: {section.type}</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <button className="p-2 text-gray-300 hover:text-red-500 transition-colors">
              <Trash2 className="w-5 h-5" />
           </button>
        </div>
      </div>

      {isOpen && (
        <div className="p-8 space-y-6 bg-gray-50/30">
          {section.type === 'hero' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Badge Text</label>
                <input 
                  type="text" 
                  value={section.badge} 
                  onChange={(e) => onUpdate({ badge: e.target.value })}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Main Title</label>
                <input 
                  type="text" 
                  value={section.title} 
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Sub-description</label>
                <textarea 
                  value={section.description} 
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  rows={3}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary resize-none" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">CTA Button Text</label>
                <input 
                  type="text" 
                  value={section.cta} 
                  onChange={(e) => onUpdate({ cta: e.target.value })}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Background Image URL</label>
                <div className="relative">
                   <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                   <input 
                    type="text" 
                    value={section.image} 
                    onChange={(e) => onUpdate({ image: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                  />
                </div>
              </div>
            </div>
          )}

          {section.type === 'text_with_image' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Heading</label>
                <input 
                  type="text" 
                  value={section.title} 
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Content Text</label>
                <textarea 
                  value={section.description} 
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  rows={4}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary resize-none" 
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Image URL</label>
                <div className="relative">
                   <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                   <input 
                    type="text" 
                    value={section.image} 
                    onChange={(e) => onUpdate({ image: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
