import { useState, useEffect } from 'react';
import { useContent } from '../context/ContentContext';
import { motion } from 'motion/react';
import { Save, Phone, Mail, MapPin, Clock, Loader2, CheckCircle } from 'lucide-react';

export function AdminSettings() {
  const { content, updateContent } = useContent();
  const [formData, setFormData] = useState(content.contactInfo);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setFormData(content.contactInfo);
  }, [content.contactInfo]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateContent({ contactInfo: formData });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-12">
      <div>
         <p className="text-brand-primary font-black uppercase tracking-[0.3em] mb-2 text-xs">Configuration</p>
         <h1 className="text-4xl font-display font-bold text-brand-dark">Contact Information</h1>
         <p className="text-gray-500 mt-2">Changes here will automatically update the header, footer, and contact page.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
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
            <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-4 md:col-span-2">
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

         <div className="flex items-center gap-4">
            <button 
              type="submit"
              disabled={saving}
              className="px-10 py-5 bg-brand-dark text-white rounded-2xl font-bold uppercase tracking-[0.2em] shadow-2xl shadow-brand-dark/20 hover:bg-brand-primary hover:shadow-brand-primary/20 transition-all flex items-center gap-3 disabled:opacity-50"
            >
               {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
               {saving ? 'Saving...' : 'Save Changes'}
            </button>

            {success && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-emerald-500 font-bold"
              >
                 <CheckCircle className="w-5 h-5" />
                 All changes published!
              </motion.div>
            )}
         </div>
      </form>
    </div>
  );
}
