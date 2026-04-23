import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Stethoscope, Plus, Trash2, Loader2, Search, X, Check, Edit2, Layout, Image as ImageIcon } from 'lucide-react';
import * as Icons from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

import { ImageUpload } from '../components/ImageUpload';

export function AdminServices() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentService, setCurrentService] = useState<any>(null);
  const { showNotification } = useNotification();

  const emptyService = {
    title: '',
    description: '',
    icon: 'Stethoscope',
    image: '',
    category: 'General Care',
    order: 0
  };

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    setLoading(true);
    try {
      const q = query(collection(db, 'services'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setServices(data.length > 0 ? data : []);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentService.id) {
        const { id, ...data } = currentService;
        await updateDoc(doc(db, 'services', id), data);
      } else {
        await addDoc(collection(db, 'services'), {
          ...currentService,
          createdAt: new Date().toISOString()
        });
      }
      setIsEditMode(false);
      fetchServices();
      showNotification('Service updated successfully!');
    } catch (error) {
      console.error("Error saving service:", error);
      showNotification('Error saving service.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this service?")) return;
    try {
      await deleteDoc(doc(db, 'services', id));
      fetchServices();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const openEditor = (service: any = null) => {
    setCurrentService(service || { ...emptyService });
    setIsEditMode(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <p className="text-brand-primary font-black uppercase tracking-[0.3em] mb-2 text-xs">Medical Offerings</p>
           <h1 className="text-4xl font-display font-bold text-brand-dark">Dental Services</h1>
           <p className="text-gray-500 mt-2">Manage the services listed on the homepage and services page.</p>
        </div>
        <button 
          onClick={() => openEditor()}
          className="flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20"
        >
          <Plus className="w-5 h-5" />
          <span>NEW SERVICE</span>
        </button>
      </div>

      <AnimatePresence>
        {isEditMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-dark/20 backdrop-blur-sm overflow-y-auto"
          >
            <motion.div 
               initial={{ scale: 0.95, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-white rounded-[40px] shadow-2xl p-8 md:p-12 max-w-2xl w-full space-y-8 sticky top-4 my-8"
            >
               <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-display font-bold text-brand-dark">
                     {currentService.id ? 'Edit Service' : 'Add New Service'}
                  </h2>
                  <button onClick={() => setIsEditMode(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                     <X className="w-6 h-6 text-gray-400" />
                  </button>
               </div>

               <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Service Title</label>
                        <input 
                           required
                           type="text"
                           value={currentService.title}
                           onChange={(e) => setCurrentService({...currentService, title: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Category</label>
                        <input 
                           required
                           type="text"
                           value={currentService.category}
                           onChange={(e) => setCurrentService({...currentService, category: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Icon Name (Lucide)</label>
                        <input 
                           type="text"
                           value={currentService.icon}
                           onChange={(e) => setCurrentService({...currentService, icon: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                           placeholder="Stethoscope, Activity, Sparkles..."
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Display Order</label>
                        <input 
                           type="number"
                           value={currentService.order}
                           onChange={(e) => setCurrentService({...currentService, order: parseInt(e.target.value)})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                        />
                     </div>
                     <div className="md:col-span-2 space-y-2">
                        <ImageUpload 
                          label="Main Service Image"
                          value={currentService.image}
                          onChange={(url) => setCurrentService({...currentService, image: url})}
                          folder="services"
                        />
                     </div>
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Description</label>
                        <textarea 
                           required
                           rows={4}
                           value={currentService.description}
                           onChange={(e) => setCurrentService({...currentService, description: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all resize-none"
                        />
                     </div>
                  </div>

                  <div className="pt-4 flex gap-4">
                     <button 
                        type="submit"
                        disabled={saving}
                        className="flex-1 py-4 bg-brand-primary text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                     >
                        {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        {saving ? 'Saving...' : 'Save Service'}
                     </button>
                     <button 
                        type="button"
                        onClick={() => setIsEditMode(false)}
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

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-brand-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = (Icons as any)[service.icon] || Stethoscope;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group bg-white p-8 rounded-[40px] border border-gray-50 shadow-sm hover:shadow-2xl transition-all space-y-6 flex flex-col justify-between"
              >
                <div className="space-y-6">
                   <div className="flex justify-between items-start">
                      <div className="w-16 h-16 bg-brand-primary/5 rounded-2xl flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all transform group-hover:rotate-6">
                         <IconComponent className="w-8 h-8" />
                      </div>
                      <div className="flex gap-2">
                         <button onClick={() => openEditor(service)} className="p-2 text-gray-300 hover:text-brand-primary transition-colors"><Edit2 className="w-4 h-4" /></button>
                         <button onClick={() => handleDelete(service.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                   </div>
                   <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary mb-2 block">{service.category}</span>
                      <h3 className="text-xl font-bold text-brand-dark">{service.title}</h3>
                      <p className="text-sm text-gray-400 mt-3 line-clamp-3 leading-relaxed">{service.description}</p>
                   </div>
                </div>
                <div className="pt-4 border-t border-gray-50 flex items-center justify-between font-bold text-[10px] text-gray-300 uppercase tracking-widest">
                   <span>Order: {service.order}</span>
                   <span className="flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Image Set</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!loading && services.length === 0 && (
         <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200">
            <Layout className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 font-bold">No services defined yet.</p>
         </div>
      )}
    </div>
  );
}
