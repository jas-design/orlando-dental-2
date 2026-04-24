import React, { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';
import { Save, Phone, Mail, MapPin, Clock, Loader2, CheckCircle, MessageCircle } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

import { ImageUpload } from '../components/ImageUpload';

export function AdminSettings() {
  const { content, updateContent } = useContent();
  const [formData, setFormData] = useState(content.contactInfo);
  const [themeColors, setThemeColors] = useState(content.themeColors);
  const [saving, setSaving] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    setFormData(content.contactInfo);
    setThemeColors(content.themeColors);
  }, [content.contactInfo, content.themeColors]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateContent({ 
        contactInfo: formData,
        themeColors: themeColors
      });
      showNotification('Settings updated successfully!');
    } catch (err) {
      console.error(err);
      showNotification('Error saving settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const ColorInput = ({ label, value, onChange, icon: Icon }: any) => (
    <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg shadow-sm border border-gray-100" style={{ backgroundColor: value }}></div>
        <span className="text-sm font-bold uppercase tracking-widest text-gray-500">{label}</span>
      </div>
      <div className="flex gap-2">
        <input 
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-12 h-12 rounded-xl cursor-pointer border-0 p-0 overflow-hidden"
        />
        <input 
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none font-mono text-sm transition-all"
        />
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-12">
      <div>
         <p className="text-brand-primary font-black uppercase tracking-[0.3em] mb-2 text-xs">Settings</p>
         <h1 className="text-4xl font-display font-bold text-brand-dark">General & Visuals</h1>
         <p className="text-gray-500 mt-2">Manage your clinic's basic information and brand appearance.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-12 pb-24">
         {/* Theme Colors Section */}
         <section className="space-y-6">
            <h2 className="text-xl font-display font-bold text-brand-dark flex items-center gap-2">
               <span className="w-8 h-1 bg-brand-primary rounded-full"></span>
               Brand Colors
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <ColorInput 
                 label="Primary Color" 
                 value={themeColors.primary} 
                 onChange={(v: string) => setThemeColors({ ...themeColors, primary: v })} 
               />
               <ColorInput 
                 label="Secondary Color" 
                 value={themeColors.secondary} 
                 onChange={(v: string) => setThemeColors({ ...themeColors, secondary: v })} 
               />
               <ColorInput 
                 label="Dark Brand" 
                 value={themeColors.dark} 
                 onChange={(v: string) => setThemeColors({ ...themeColors, dark: v })} 
               />
               <ColorInput 
                 label="Light Tint" 
                 value={themeColors.light} 
                 onChange={(v: string) => setThemeColors({ ...themeColors, light: v })} 
               />
               <ColorInput 
                 label="Accent" 
                 value={themeColors.accent} 
                 onChange={(v: string) => setThemeColors({ ...themeColors, accent: v })} 
               />
            </div>
         </section>

         {/* General Information Section */}
         <section className="space-y-6">
            <h2 className="text-xl font-display font-bold text-brand-dark flex items-center gap-2">
               <span className="w-8 h-1 bg-brand-primary rounded-full"></span>
               General Information
            </h2>
            <div className="grid grid-cols-1 gap-8">
               {/* Site Logo */}
               <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-brand-primary mb-2">
                     <span className="text-sm font-bold uppercase tracking-widest text-gray-400">Main Clinic Logo</span>
                  </div>
                  <ImageUpload 
                    label="Upload Clinic Logo"
                    value={formData.logoUrl || ''}
                    onChange={(url) => setFormData({ ...formData, logoUrl: url })}
                    folder="images"
                  />
                  <p className="text-xs text-gray-400 mt-2 italic">If no image is uploaded, the site will fall back to the default logo designs.</p>
               </div>
            </div>
         </section>

         {/* Contact Information Section */}
         <section className="space-y-6">
            <h2 className="text-xl font-display font-bold text-brand-dark flex items-center gap-2">
               <span className="w-8 h-1 bg-brand-primary rounded-full"></span>
               Contact Details
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
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                    value={formData.whatsapp || ''}
                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-[#25D366] outline-none font-medium transition-all"
                  />
                  <p className="text-[10px] text-gray-400">Only numbers, no spaces or dashes</p>
               </div>

               {/* Email */}
               <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4">
                  <div className="flex items-center gap-3 text-brand-primary">
                     <Mail className="w-5 h-5" />
                     <span className="text-sm font-bold uppercase tracking-widest">Email Address</span>
                  </div>
                  <input 
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-50 border-gray-100 rounded-xl focus:ring-2 focus:ring-brand-primary outline-none font-medium transition-all"
                  />
               </div>

               {/* Address */}
               <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4 md:col-span-1">
                  <div className="flex items-center gap-3 text-brand-primary">
                     <MapPin className="w-5 h-5" />
                     <span className="text-sm font-bold uppercase tracking-widest">Clinic Address</span>
                  </div>
                  <input 
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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
                    {formData.hours.map((h, i) => (
                      <div key={i} className="flex gap-4 items-center">
                         <input 
                           type="text"
                           value={h.day}
                           onChange={(e) => {
                             const newHours = [...formData.hours];
                             newHours[i].day = e.target.value;
                             setFormData({ ...formData, hours: newHours });
                           }}
                           className="flex-1 px-4 py-2 bg-gray-50 border-gray-100 rounded-lg outline-none text-sm font-bold"
                         />
                         <input 
                           type="text"
                           value={h.time}
                           onChange={(e) => {
                             const newHours = [...formData.hours];
                             newHours[i].time = e.target.value;
                             setFormData({ ...formData, hours: newHours });
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
               {saving ? 'Saving...' : 'Save Changes'}
            </button>
         </div>
      </form>
    </div>
  );
}
