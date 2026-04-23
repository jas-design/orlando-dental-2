import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Save, ChevronLeft, Loader2, Image as ImageIcon, Plus, Trash2, Eye, Type, Layout, Star, Search, Users } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

import { ImageUpload } from '../components/ImageUpload';

export function AdminPageEditor() {
  const { pageId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('content');
  const { showNotification } = useNotification();

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
    const common = { slug: `/${id === 'home' ? '' : id}`, title: id.charAt(0).toUpperCase() + id.slice(1), sections: [] };
    
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

    if (id === 'about') {
      return {
        ...common,
        title: 'About Us',
        sections: [
          {
            id: 'about_hero',
            type: 'hero',
            badge: 'OUR STORY',
            title: 'We Care For Your Dental Health',
            description: 'At Orlando Dental Care, we take pride in bringing added value to every patient by addressing all of your dental needs.',
            cta: 'Learn More',
            image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80'
          },
          {
             id: 'mission',
             type: 'text_with_image',
             title: 'Our Mission',
             description: 'To provide the highest quality dental care in a comfortable and welcoming environment.',
             image: 'https://images.unsplash.com/photo-1629907326852-b8356ee70666?auto=format&fit=crop&q=80'
          }
        ]
      };
    }

    if (id === 'services') {
      return {
        ...common,
        title: 'Services',
        sections: [
          {
            id: 'services_hero',
            type: 'hero',
            badge: 'OUR CARE',
            title: 'Comprehensive Dental Services',
            description: 'From routine checkups to full smile transformations, we provide comprehensive dental care for all ages.',
            cta: 'View Services',
            image: 'https://images.unsplash.com/photo-1576091160550-217359f48f4c?auto=format&fit=crop&q=80'
          }
        ]
      };
    }

    return common;
  };

  const addSection = (type: string) => {
    const newSection = {
      id: `${type}_${Date.now()}`,
      type: type,
      title: 'New Section',
      description: 'Add your description here...',
      image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80'
    };
    
    if (type === 'hero') {
      (newSection as any).badge = 'NEW BADGE';
      (newSection as any).cta = 'Button Text';
    }

    setPageData({
      ...pageData,
      sections: [...pageData.sections, newSection]
    });
  };

  const removeSection = (index: number) => {
    if (!window.confirm("Remove this section?")) return;
    const newSections = pageData.sections.filter((_: any, i: number) => i !== index);
    setPageData({ ...pageData, sections: newSections });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...pageData.sections];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newSections.length) return;
    
    [newSections[index], newSections[newIndex]] = [newSections[newIndex], newSections[index]];
    setPageData({ ...pageData, sections: newSections });
  };

  const handleSave = async () => {
    if (!pageId || !pageData) return;
    setSaving(true);
    try {
      await setDoc(doc(db, 'pages', pageId), {
        ...pageData,
        updatedAt: new Date().toISOString()
      });
      showNotification('Page updated successfully!');
    } catch (error: any) {
      console.error("Error saving page:", error);
      showNotification(`Error saving page: ${error?.message || 'Unknown error'}`, 'error');
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
                  key={section.id || index} 
                  section={section} 
                  index={index}
                  total={pageData.sections.length}
                  onUpdate={(data) => updateSection(index, data)} 
                  onRemove={() => removeSection(index)}
                  onMove={(dir) => moveSection(index, dir)}
                />
              ))}

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <button 
                  onClick={() => addSection('hero')}
                  className="py-4 border-2 border-dashed border-gray-100 rounded-[24px] text-gray-400 font-bold flex flex-col items-center justify-center gap-2 hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all text-xs"
                >
                   <Star className="w-5 h-5" />
                   <span>Hero</span>
                </button>
                <button 
                  onClick={() => addSection('text_with_image')}
                  className="py-4 border-2 border-dashed border-gray-100 rounded-[24px] text-gray-400 font-bold flex flex-col items-center justify-center gap-2 hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all text-xs"
                >
                   <Type className="w-5 h-5" />
                   <span>Content</span>
                </button>
                <button 
                  onClick={() => addSection('services_grid')}
                  className="py-4 border-2 border-dashed border-gray-100 rounded-[24px] text-gray-400 font-bold flex flex-col items-center justify-center gap-2 hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all text-xs"
                >
                   <Layout className="w-5 h-5" />
                   <span>Services Grid</span>
                </button>
                <button 
                  onClick={() => addSection('team_grid')}
                  className="py-4 border-2 border-dashed border-gray-100 rounded-[24px] text-gray-400 font-bold flex flex-col items-center justify-center gap-2 hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all text-xs"
                >
                   <Users className="w-5 h-5" />
                   <span>Team Grid</span>
                </button>
                <button 
                  onClick={() => addSection('blog_grid')}
                  className="py-4 border-2 border-dashed border-gray-100 rounded-[24px] text-gray-400 font-bold flex flex-col items-center justify-center gap-2 hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all text-xs"
                >
                   <ImageIcon className="w-5 h-5" />
                   <span>Blog Feed</span>
                </button>
                <button 
                  onClick={() => addSection('contact_strip')}
                  className="py-4 border-2 border-dashed border-gray-100 rounded-[24px] text-gray-400 font-bold flex flex-col items-center justify-center gap-2 hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all text-xs"
                >
                   <Search className="w-5 h-5" />
                   <span>Contact Info</span>
                </button>
              </div>
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
  index: number;
  total: number;
  onUpdate: (data: any) => void;
  onRemove: () => void;
  onMove: (direction: 'up' | 'down') => void;
  key?: any;
}

function SectionEditor({ section, index, total, onUpdate, onRemove, onMove }: SectionEditorProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
      <div 
        className="px-8 py-6 flex items-center justify-between cursor-pointer border-b border-gray-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
           <div className="flex flex-col gap-1 mr-2">
              <button 
                disabled={index === 0}
                onClick={(e) => { e.stopPropagation(); onMove('up'); }}
                className="p-1 text-gray-300 hover:text-brand-primary disabled:opacity-0 transition-all"
              >
                 <ChevronLeft className="w-4 h-4 rotate-90" />
              </button>
              <button 
                disabled={index === total - 1}
                onClick={(e) => { e.stopPropagation(); onMove('down'); }}
                className="p-1 text-gray-300 hover:text-brand-primary disabled:opacity-0 transition-all"
              >
                 <ChevronLeft className="w-4 h-4 -rotate-90" />
              </button>
           </div>
           <div className="w-10 h-10 bg-brand-primary/10 rounded-xl flex items-center justify-center text-brand-primary">
              {section.type === 'hero' ? <Star className="w-5 h-5" /> : <Type className="w-5 h-5" />}
           </div>
           <div>
              <h3 className="font-bold text-brand-dark uppercase tracking-widest text-xs">Section {index + 1}: {section.type}</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">ID: {section.id}</p>
           </div>
        </div>
        <div className="flex items-center gap-4">
           <button 
            onClick={(e) => { e.stopPropagation(); onRemove(); }}
            className="p-2 text-gray-300 hover:text-red-500 transition-colors"
          >
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
                <ImageUpload 
                  label="Background Image"
                  value={section.image}
                  onChange={(url) => onUpdate({ image: url })}
                  folder="images"
                />
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
                <ImageUpload 
                  label="Main Image"
                  value={section.image}
                  onChange={(url) => onUpdate({ image: url })}
                  folder="images"
                />
              </div>
            </div>
          )}
          {(section.type === 'services_grid' || section.type === 'team_grid' || section.type === 'blog_grid') && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Section Heading</label>
                <input 
                  type="text" 
                  value={section.title} 
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Subheading (Optional)</label>
                <textarea 
                  value={section.description} 
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  rows={2}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary resize-none" 
                />
              </div>
            </div>
          )}

          {section.type === 'contact_strip' && (
            <div className="p-6 bg-blue-50/50 rounded-2xl flex items-center gap-4 text-blue-700">
               <Search className="w-6 h-6" />
               <p className="text-sm font-medium">This section pulls data automatically from your <Link to="/admin/settings" className="font-bold underline">Contact Settings</Link>.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
