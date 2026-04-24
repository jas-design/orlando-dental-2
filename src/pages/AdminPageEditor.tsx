import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Save, ChevronLeft, Loader2, Image as ImageIcon, Plus, Trash2, Eye, Type, Layout, Star, Search, Users, AlertCircle } from 'lucide-react';
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
        const template = getTemplateForPage(pageId);
        
        if (docSnap.exists()) {
          const dbData = docSnap.data();
          // Aggressive merge: ensure we have a title and sections if it's a known page
          const finalData = { 
            ...template, 
            ...dbData 
          };

          // If it's a known page (like home) and sections are missing/empty, take from template
          if (!dbData.sections || dbData.sections.length === 0) {
            finalData.sections = template.sections;
          }

          // Ensure title is never empty
          if (!dbData.title || dbData.title.trim() === "") {
            finalData.title = template.title;
          }

          setPageData(finalData);
        } else {
          // Initialize with default template based on pageId
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
    const normalizedId = id.toLowerCase().trim();
    const common = { 
      slug: normalizedId === 'home' ? '/' : `/${normalizedId}`, 
      title: normalizedId.charAt(0).toUpperCase() + normalizedId.slice(1), 
      sections: [] 
    };
    
    // We check both ID and slug for "Home" identification
    if (normalizedId === 'home' || normalizedId === 'index') {
      return {
        ...common,
        title: 'Home Page',
        sections: [
          {
            id: 'hero',
            type: 'hero',
            useStructuredTitle: true,
            line1: 'Reveal the',
            line2: 'Radiant Smile',
            line3: 'You Deserve',
            line2Color: '#14e5db',
            description: 'Experience dental care that combines advanced technology with a gentle, personalized touch in a comfortable environment.',
            cta: 'BOOK APPOINTMENT',
            image: 'https://images.unsplash.com/photo-1576091160550-217359f48f4c?auto=format&fit=crop&q=80'
          },
          {
            id: 'info_strip',
            type: 'info_strip',
            phone: '+ 386 40 111 5555',
            hours: 'Mon - Sat: 7:00 - 17:00',
            cta: 'BOOK AN APPOINTMENT'
          },
          {
            id: 'services_grid',
            type: 'services_grid',
            badge: 'OUR SERVICES',
            title: 'Complete {Dental Care}',
            description: 'Dedicated to providing the best dental experience for our community with a focus on comfort and high-end results.'
          },
          {
            id: 'mission',
            type: 'text_with_image',
            badge: 'WHY CHOOSE US',
            title: 'Diagnosis of {Dental Diseases}',
            description: 'We are committed to providing the highest quality dental care using state-of-the-art equipment.',
            image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80'
          },
          {
            id: 'before_after',
            type: 'before_after',
            badge: 'BEFORE AND AFTER',
            title: 'Get a {Hollywood Smile} Today!',
            description: 'Experience life-changing results with our advanced cosmetic dentistry procedures.',
            image_before: 'https://images.unsplash.com/photo-1593059080506-3458322287bd?auto=format&fit=crop&q=80&w=1200',
            image_after: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200'
          },
          {
            id: 'faq',
            type: 'faq',
            badge: 'FREQUENTLY ASKED QUESTIONS',
            title: 'If You Have Questions? <br /> We\'ve Got {Answers}!',
            description: 'Find answers to your most common dental health questions.'
          },
          {
            id: 'doctor_banner',
            type: 'doctor_banner',
            badge: 'MEDICAL DIRECTOR',
            title: 'Lead by Dr. A. {Viviana Santos}',
            quote: 'Every smile tells a story. Our mission is to make sure yours is one of health, confidence, and joy.',
            experience: '25+',
            patients: '18k+',
            image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000'
          },
          {
            id: 'testimonials',
            type: 'team_grid',
            badge: 'TESTIMONIALS',
            title: 'What Our {Patients Say}',
            description: 'Read about the experiences of our patients and how we\'ve helped them achieve their perfect smiles.'
          },
          {
            id: 'blog',
            type: 'blog_grid',
            badge: 'LATEST NEWS',
            title: 'Oral Health {Tips & Insights}',
            description: 'Stay updated with the latest dental health tips, news, and expert advice from our team.'
          },
          {
            id: 'footer_cta',
            type: 'hero',
            title: 'READY TO {TRANSFORM} YOUR SMILE?',
            description: 'Join thousands of happy patients in Orlando. Book your consultation today.',
            cta: 'BOOK NOW',
            image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80'
          }
        ]
      };
    }

    if (normalizedId === 'about') {
      return {
        ...common,
        title: 'About Us',
        sections: [
          {
            id: 'about_hero',
            type: 'hero',
            badge: 'OUR STORY',
            title: 'We Care For Your {Dental Health}',
            description: 'At Orlando Dental Care, we take pride in bringing added value to every patient by addressing all of your dental needs and concerns.',
            cta: 'Learn More',
            image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80'
          },
          {
             id: 'mission',
             type: 'text_with_image',
             title: 'Our Mission',
             description: 'Our mission is to provide the highest quality dental care in a comfortable and welcoming environment. We believe in educating our patients and providing them with all the necessary information to make informed decisions about their oral health.',
             image: 'https://images.unsplash.com/photo-1629907326852-b8356ee70666?auto=format&fit=crop&q=80'
          },
          {
             id: 'team_grid',
             type: 'team_grid',
             title: 'Meet the Experts Behind <br /> Your {Radiant Smile}',
             description: 'Dedicated to providing the best dental experience for our community with a focus on comfort and high-end results.'
          }
        ]
      };
    }

    if (normalizedId === 'services') {
      return {
        ...common,
        title: 'Services',
        sections: [
          {
            id: 'services_hero',
            type: 'hero',
            badge: 'OUR CARE',
            title: 'Comprehensive {Dental Services}',
            description: 'From routine checkups to full smile transformations, we provide comprehensive dental care for patients of all ages.',
            cta: 'View Services',
            image: 'https://images.unsplash.com/photo-1576091160550-217359f48f4c?auto=format&fit=crop&q=80'
          },
          {
            id: 'services_grid',
            type: 'services_grid',
            title: 'Complete {Dental Care}',
            description: 'Dedicated to providing the best dental experience for our community with a focus on comfort and high-end results.'
          }
        ]
      };
    }

    if (normalizedId === 'gallery') {
      return {
        ...common,
        title: 'Smile Gallery',
        sections: [
          {
            id: 'gallery_hero',
            type: 'hero',
            badge: 'SMILE TRANSFORMATION',
            title: 'Our {Smile Gallery}',
            description: 'Take a look at our modern facility and some of the amazing transformations we\'ve achieved for our patients.',
            cta: 'View Gallery',
            image: 'https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80'
          }
        ]
      };
    }

    if (normalizedId === 'contact') {
      return {
        ...common,
        title: 'Contact Us',
        sections: [
          {
            id: 'contact_hero',
            type: 'hero',
            badge: 'CONTACT US',
            title: 'Get {In Touch}',
            description: 'Have questions or ready to schedule? Our team is here to help you achieve the smile of your dreams.',
            cta: 'Schedule Now',
            image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80'
          },
          {
            id: 'contact_strip',
            type: 'contact_strip',
            title: 'Contact Information',
            description: 'Visit us in Orlando or reach out via phone or email for any inquiries about our services or insurance coverage.'
          }
        ]
      };
    }

    return common;
  };

  const addSection = (type: string) => {
    let newSection: any = { 
      id: `${type}_${Date.now()}`, 
      type: type,
      title: 'New Section',
      description: 'Add your description here...'
    };
    
    // Custom defaults for different types
    if (type === 'hero') {
      newSection = { ...newSection, title: 'New Hero Section', badge: 'SPECIAL OFFER', cta: 'Book Now', image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80' };
    } else if (type === 'text_with_image') {
      newSection = { ...newSection, image: 'https://images.unsplash.com/photo-1629907326852-b8356ee70666?auto=format&fit=crop&q=80' };
    } else if (type === 'info_strip') {
      newSection = { ...newSection, title: '', description: '', phone: '+ 386 40 111 5555', hours: 'Mon - Sat: 7:00 - 17:00' };
    } else if (type === 'before_after') {
      newSection = { ...newSection, title: 'Smile Transformation', image_before: 'https://images.unsplash.com/photo-1593059080506-3458322287bd?auto=format&fit=crop&q=80&w=1200', image_after: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200' };
    } else if (type === 'doctor_banner') {
      newSection = { ...newSection, title: 'Lead by Dr. Santos', quote: 'Your happiness is our priority.', experience: '20+', patients: '10k+', image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000' };
    } else if (type === 'faq') {
      newSection = { ...newSection, title: 'Frequently Asked Questions' };
    }
    
    setPageData({
      ...pageData,
      sections: [...(pageData?.sections || []), newSection]
    });
  };

  const removeSection = (index: number) => {
    if (!window.confirm("Remove this section?")) return;
    const newSections = (pageData?.sections || []).filter((_: any, i: number) => i !== index);
    setPageData({ ...pageData, sections: newSections });
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...(pageData?.sections || [])];
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
    const newSections = [...(pageData?.sections || [])];
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

  if (!pageData && !loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
          <AlertCircle className="w-16 h-16 text-gray-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-600 mb-2">Page Not Found</h2>
          <p className="text-gray-400 font-medium mb-8">We couldn't load the data for this page. It might have been moved or deleted.</p>
          <button 
            onClick={() => navigate('/admin/pages')}
            className="px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-brand-dark transition-all"
          >
            Back to Pages
          </button>
        </div>
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
      </div>

      {/* Floating Save Button */}
      <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-3 px-10 py-5 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-[0.2em] shadow-2xl shadow-brand-dark/30 hover:bg-brand-primary hover:shadow-brand-primary/20 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
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
              {pageData?.sections?.map((section: any, index: number) => (
                <SectionEditor 
                  key={section.id || index} 
                  section={section} 
                  index={index}
                  total={pageData.sections?.length || 0}
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
                  onClick={() => addSection('info_strip')}
                  className="py-4 border-2 border-dashed border-gray-100 rounded-[24px] text-gray-400 font-bold flex flex-col items-center justify-center gap-2 hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all text-xs"
                >
                   <Layout className="w-5 h-5" />
                   <span>Info Strip</span>
                </button>
                <button 
                  onClick={() => addSection('text_with_image')}
                  className="py-4 border-2 border-dashed border-gray-100 rounded-[24px] text-gray-400 font-bold flex flex-col items-center justify-center gap-2 hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all text-xs"
                >
                   <Type className="w-5 h-5" />
                   <span>Content</span>
                </button>
                <button 
                  onClick={() => addSection('before_after')}
                  className="py-4 border-2 border-dashed border-gray-100 rounded-[24px] text-gray-400 font-bold flex flex-col items-center justify-center gap-2 hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all text-xs"
                >
                   <Search className="w-5 h-5" />
                   <span>Before/After</span>
                </button>
                <button 
                  onClick={() => addSection('doctor_banner')}
                  className="py-4 border-2 border-dashed border-gray-100 rounded-[24px] text-gray-400 font-bold flex flex-col items-center justify-center gap-2 hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all text-xs"
                >
                   <Users className="w-5 h-5" />
                   <span>Doc Banner</span>
                </button>
                <button 
                  onClick={() => addSection('faq')}
                  className="py-4 border-2 border-dashed border-gray-100 rounded-[24px] text-gray-400 font-bold flex flex-col items-center justify-center gap-2 hover:border-brand-primary/30 hover:text-brand-primary hover:bg-brand-primary/5 transition-all text-xs"
                >
                   <Plus className="w-5 h-5" />
                   <span>FAQ</span>
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

              {/* Title Editor Selection */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                   <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Hero Title Style</label>
                   <div className="flex bg-white px-2 py-1 rounded-xl border border-gray-100">
                      <button 
                        onClick={() => onUpdate({ useStructuredTitle: false })}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${!section.useStructuredTitle ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-brand-dark'}`}
                      >
                         Single Line
                      </button>
                      <button 
                        onClick={() => onUpdate({ useStructuredTitle: true })}
                        className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${section.useStructuredTitle ? 'bg-brand-primary text-white shadow-md' : 'text-gray-400 hover:text-brand-dark'}`}
                      >
                         3 Lines (Custom Color)
                      </button>
                   </div>
                </div>

                {!section.useStructuredTitle ? (
                  <div className="space-y-2">
                    <input 
                      type="text" 
                      value={section.title} 
                      onChange={(e) => onUpdate({ title: e.target.value })}
                      placeholder="Enter full title..."
                      className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                    />
                    <p className="text-[10px] text-gray-400 pl-1 italic">
                      Tip: Use <b>{"{text}"}</b> to color text (ex: {"{Our Smile}"}) and <b>{"<br />"}</b> for new lines.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-white rounded-[32px] border border-gray-100">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Line 1</label>
                       <input 
                         type="text" 
                         value={section.line1} 
                         onChange={(e) => onUpdate({ line1: e.target.value })}
                         placeholder="Reveal the"
                         className="w-full p-3 bg-gray-50 border-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary text-sm font-bold" 
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Line 2 (Colored)</label>
                       <input 
                         type="text" 
                         value={section.line2} 
                         onChange={(e) => onUpdate({ line2: e.target.value })}
                         placeholder="Radiant Smile"
                         className="w-full p-3 bg-gray-50 border-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary text-sm font-bold" 
                       />
                       <div className="flex items-center gap-2 mt-2">
                          <input 
                            type="color" 
                            value={section.line2Color || '#14e5db'} 
                            onChange={(e) => onUpdate({ line2Color: e.target.value })}
                            className="w-8 h-8 rounded-lg cursor-pointer border-none p-0 bg-transparent"
                          />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">{section.line2Color || '#14e5db'}</span>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Line 3</label>
                       <input 
                         type="text" 
                         value={section.line3} 
                         onChange={(e) => onUpdate({ line3: e.target.value })}
                         placeholder="You Deserve"
                         className="w-full p-3 bg-gray-50 border-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-brand-primary text-sm font-bold" 
                       />
                    </div>
                  </div>
                )}
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
                <p className="text-[10px] text-gray-400 pl-1 italic">
                  Tip: Use <b>{"{text}"}</b> to color text and <b>{"<br />"}</b> for new lines.
                </p>
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
                  label={section.id === 'mission' || section.badge?.includes('CHOOSE') ? "Feature Image (e.g. 3D Tooth)" : "Main Section Image"}
                  value={section.image}
                  onChange={(url) => onUpdate({ image: url })}
                  folder="images"
                />
              </div>
            </div>
          )}
          {section.type === 'info_strip' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone Number</label>
                <input 
                  type="text" 
                  value={section.phone} 
                  onChange={(e) => onUpdate({ phone: e.target.value })}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Working Hours</label>
                <input 
                  type="text" 
                  value={section.hours} 
                  onChange={(e) => onUpdate({ hours: e.target.value })}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                />
              </div>
            </div>
          )}

          {section.type === 'before_after' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Heading</label>
                <input 
                  type="text" 
                  value={section.title} 
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                />
                <p className="text-[10px] text-gray-400 pl-1 italic">
                  Tip: Use <b>{"{text}"}</b> to color text and <b>{"<br />"}</b> for new lines.
                </p>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Description</label>
                <textarea 
                  value={section.description} 
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  rows={2}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary resize-none" 
                />
              </div>
              <div className="space-y-2">
                <ImageUpload 
                  label="Before Image"
                  value={section.image_before}
                  onChange={(url) => onUpdate({ image_before: url })}
                  folder="images"
                />
              </div>
              <div className="space-y-2">
                <ImageUpload 
                  label="After Image"
                  value={section.image_after}
                  onChange={(url) => onUpdate({ image_after: url })}
                  folder="images"
                />
              </div>
            </div>
          )}

          {section.type === 'doctor_banner' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Main Title</label>
                <input 
                  type="text" 
                  value={section.title} 
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                />
                <p className="text-[10px] text-gray-400 pl-1 italic">
                  Tip: Use <b>{"{text}"}</b> to color text and <b>{"<br />"}</b> for new lines.
                </p>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Doctor Quote</label>
                <input 
                  type="text" 
                  value={section.quote} 
                  onChange={(e) => onUpdate({ quote: e.target.value })}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Years Experience</label>
                <input 
                  type="text" 
                  value={section.experience} 
                  onChange={(e) => onUpdate({ experience: e.target.value })}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Happy Patients</label>
                <input 
                  type="text" 
                  value={section.patients} 
                  onChange={(e) => onUpdate({ patients: e.target.value })}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                />
              </div>
              <div className="md:col-span-2 space-y-2">
                <ImageUpload 
                  label="Doctor Photo"
                  value={section.image}
                  onChange={(url) => onUpdate({ image: url })}
                  folder="images"
                />
              </div>
            </div>
          )}

          {section.type === 'faq' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Section Heading</label>
                <input 
                  type="text" 
                  value={section.title} 
                  onChange={(e) => onUpdate({ title: e.target.value })}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary" 
                />
                <p className="text-[10px] text-gray-400 pl-1 italic">
                   Tip: Use <b>{"{text}"}</b> to color text and <b>{"<br />"}</b> for new lines.
                </p>
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">Subheading</label>
                <textarea 
                  value={section.description} 
                  onChange={(e) => onUpdate({ description: e.target.value })}
                  rows={2}
                  className="w-full p-4 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-brand-primary resize-none" 
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
                <p className="text-[10px] text-gray-400 pl-1 italic">
                  Tip: Use <b>{"{text}"}</b> to color text and <b>{"<br />"}</b> for new lines.
                </p>
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
