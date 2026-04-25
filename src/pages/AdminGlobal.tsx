import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';
import { Save, Phone, Mail, MapPin, Clock, Loader2, CheckCircle, MessageCircle, Palette, Globe } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import { ImageUpload } from '../components/ImageUpload';

export function AdminGlobal() {
  const { content, updateContent } = useContent();
  const [formData, setFormData] = useState({
    contactInfo: content.contactInfo,
    branding: content.branding
  });
  const [saving, setSaving] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    setFormData({
      contactInfo: content.contactInfo,
      branding: content.branding
    });
  }, [content.contactInfo, content.branding]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateContent(formData);
      showNotification('Global changes saved successfully!');
    } catch (err) {
      console.error(err);
      showNotification('Error saving changes.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl space-y-12 pb-24">
      <div>
         <p className="text-brand-primary font-black uppercase tracking-[0.3em] mb-2 text-xs">Admin Panel</p>
         <h1 className="text-4xl font-display font-bold text-brand-dark">Global Changes</h1>
         <p className="text-gray-500 mt-2">Manage your clinic's branding, colors, and contact information in one place.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-16">
         {/* 1. Branding & Colors Section */}
         <section className="space-y-8">
            <h2 className="text-xl font-display font-bold text-brand-dark flex items-center gap-3">
               <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center">
                  <Palette className="w-5 h-5" />
               </div>
               Branding & Identity
            </h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
               {/* Logo Upload */}
               <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Clinic Logo</span>
                  <ImageUpload 
                    label="Upload Logo"
                    value={formData.contactInfo.logoUrl || ''}
                    onChange={(url) => setFormData({ 
                      ...formData, 
                      contactInfo: { ...formData.contactInfo, logoUrl: url } 
                    })}
                    folder="images"
                  />
                  <p className="text-xs text-gray-400 mt-2 italic">Recommended: Transparent PNG or SVG.</p>
               </div>

               {/* Color Selection */}
               <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-8">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400 block mb-2">Brand Colors</span>
                  <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-3">
                        <label className="text-sm font-bold text-brand-dark">Primary Color</label>
                        <div className="flex items-center gap-3">
                           <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shadow-inner shrink-0">
                              <div 
                                className="absolute inset-0" 
                                style={{ backgroundColor: formData.branding.primaryColor }} 
                              />
                              <input 
                                type="color" 
                                value={formData.branding.primaryColor}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  branding: { ...formData.branding, primaryColor: e.target.value }
                                })}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                           </div>
                           <input 
                             type="text"
                             value={formData.branding.primaryColor}
                             onChange={(e) => setFormData({
                               ...formData,
                               branding: { ...formData.branding, primaryColor: e.target.value }
                             })}
                             className="flex-1 px-4 py-2 bg-gray-50 border-gray-100 rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                           />
                        </div>
                     </div>
                     <div className="space-y-3">
                        <label className="text-sm font-bold text-brand-dark">Secondary Color</label>
                        <div className="flex items-center gap-3">
                           <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-100 shadow-inner shrink-0">
                              <div 
                                className="absolute inset-0" 
                                style={{ backgroundColor: formData.branding.secondaryColor }} 
                              />
                              <input 
                                type="color" 
                                value={formData.branding.secondaryColor}
                                onChange={(e) => setFormData({
                                  ...formData,
                                  branding: { ...formData.branding, secondaryColor: e.target.value }
                                })}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              />
                           </div>
                           <input 
                             type="text"
                             value={formData.branding.secondaryColor}
                             onChange={(e) => setFormData({
                               ...formData,
                               branding: { ...formData.branding, secondaryColor: e.target.value }
                             })}
                             className="flex-1 px-4 py-2 bg-gray-50 border-gray-100 rounded-lg text-sm font-mono uppercase focus:ring-2 focus:ring-brand-primary outline-none transition-all"
                           />
                        </div>
                     </div>

                  </div>
               </div>
            </div>
         </section>

         {/* 2. Contact Information Section */}
         <section className="space-y-8">
            <h2 className="text-xl font-display font-bold text-brand-dark flex items-center gap-3">
               <div className="w-10 h-10 bg-brand-primary/10 text-brand-primary rounded-xl flex items-center justify-center">
                  <Globe className="w-5 h-5" />
               </div>
               Contact Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {/* Phone */}
               <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-brand-primary">
                     <Phone className="w-5 h-5" />
                     <span className="text-sm font-bold uppercase tracking-widest">Phone Number</span>
                  </div>
                  <input 
                    type="text"
                    value={formData.contactInfo.phone}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contactInfo: { ...formData.contactInfo, phone: e.target.value } 
                    })}
                    className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none font-medium transition-all"
                  />
               </div>

               {/* WhatsApp */}
               <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-[#25D366]">
                     <MessageCircle className="w-5 h-5" />
                     <span className="text-sm font-bold uppercase tracking-widest">WhatsApp Number</span>
                  </div>
                  <input 
                    type="text"
                    placeholder="e.g. 4077379444"
                    value={formData.contactInfo.whatsapp || ''}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contactInfo: { ...formData.contactInfo, whatsapp: e.target.value.replace(/\D/g, '') } 
                    })}
                    className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-[#25D366] outline-none font-medium transition-all"
                  />
               </div>

               {/* Email */}
               <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-brand-primary">
                     <Mail className="w-5 h-5" />
                     <span className="text-sm font-bold uppercase tracking-widest">Email Address</span>
                  </div>
                  <input 
                    type="email"
                    value={formData.contactInfo.email}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contactInfo: { ...formData.contactInfo, email: e.target.value } 
                    })}
                    className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none font-medium transition-all"
                  />
               </div>

               {/* Address */}
               <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-brand-primary">
                     <MapPin className="w-5 h-5" />
                     <span className="text-sm font-bold uppercase tracking-widest">Clinic Address</span>
                  </div>
                  <input 
                    type="text"
                    value={formData.contactInfo.address}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      contactInfo: { ...formData.contactInfo, address: e.target.value } 
                    })}
                    className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none font-medium transition-all"
                  />
               </div>

               {/* Hours */}
               <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6 md:col-span-2">
                  <div className="flex items-center gap-3 text-brand-primary">
                     <Clock className="w-5 h-5" />
                     <span className="text-sm font-bold uppercase tracking-widest">Business Hours</span>
                  </div>
                  <div className="space-y-4">
                    {formData.contactInfo.hours.map((h, i) => (
                      <div key={i} className="flex gap-4 items-center">
                         <input 
                           type="text"
                           value={h.day}
                           onChange={(e) => {
                             const newHours = [...formData.contactInfo.hours];
                             newHours[i].day = e.target.value;
                             setFormData({ 
                               ...formData, 
                               contactInfo: { ...formData.contactInfo, hours: newHours } 
                             });
                           }}
                           className="flex-1 px-4 py-2 bg-gray-50 border-gray-100 rounded-lg outline-none text-sm font-bold"
                         />
                         <input 
                           type="text"
                           value={h.time}
                           onChange={(e) => {
                             const newHours = [...formData.contactInfo.hours];
                             newHours[i].time = e.target.value;
                             setFormData({ 
                               ...formData, 
                               contactInfo: { ...formData.contactInfo, hours: newHours } 
                             });
                           }}
                           className="flex-1 px-4 py-2 bg-gray-50 border-gray-100 rounded-lg outline-none text-sm"
                         />
                      </div>
                    ))}
                  </div>
               </div>
            </div>
         </section>

         <div className="flex items-center gap-4 fixed bottom-8 right-8 z-50">
            <button 
              type="submit"
              disabled={saving}
              className="px-10 py-5 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-[0.2em] shadow-2xl shadow-brand-dark/20 hover:bg-brand-primary hover:shadow-brand-primary/20 transition-all flex items-center gap-3 disabled:opacity-50"
            >
               {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
               {saving ? 'Saving...' : 'Save Global Changes'}
            </button>
         </div>
      </form>
    </div>
  );
}
