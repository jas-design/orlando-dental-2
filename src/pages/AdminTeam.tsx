import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, Trash2, Loader2, X, Check, Edit2, ShieldCheck, Heart } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

import { ImageUpload } from '../components/ImageUpload';
import { TEAM as STATIC_TEAM } from '../constants';

export function AdminTeam() {
  const [members, setMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentMember, setCurrentMember] = useState<any>(null);
  const { showNotification } = useNotification();

  const emptyMember = {
    name: '',
    specialty: '',
    description: '',
    image: '',
    order: 0
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    try {
      const q = query(collection(db, 'team'), orderBy('order', 'asc'));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMembers(data);
    } catch (error) {
      console.error("Error fetching team:", error);
    } finally {
      setLoading(false);
    }
  }

  const importDefaults = async () => {
    setLoading(true);
    try {
      for (const member of STATIC_TEAM) {
        const { id, ...data } = member; // Remove static ID
        await addDoc(collection(db, 'team'), {
          ...data,
          createdAt: new Date().toISOString()
        });
      }
      showNotification('Default team members imported!');
      fetchMembers();
    } catch (error) {
      console.error("Error importing:", error);
      showNotification('Error importing defaults.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentMember.id) {
        const { id, ...data } = currentMember;
        await updateDoc(doc(db, 'team', id), data);
      } else {
        await addDoc(collection(db, 'team'), {
          ...currentMember,
          createdAt: new Date().toISOString()
        });
      }
      setIsEditMode(false);
      fetchMembers();
      showNotification('Team member saved successfully!');
    } catch (error) {
      console.error("Error saving member:", error);
      showNotification('Error saving team member.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Remove this team member?")) return;
    try {
      await deleteDoc(doc(db, 'team', id));
      fetchMembers();
    } catch (error) {
      console.error("Error deleting:", error);
    }
  };

  const openEditor = (member: any = null) => {
    setCurrentMember(member || { ...emptyMember });
    setIsEditMode(true);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <p className="text-brand-primary font-black uppercase tracking-[0.3em] mb-2 text-xs">Clinical Staff</p>
           <h1 className="text-4xl font-display font-bold text-brand-dark">Our Specialists</h1>
           <p className="text-gray-500 mt-2">Manage the doctors and staff members displayed on the about page.</p>
        </div>
        <button 
          onClick={() => openEditor()}
          className="flex items-center gap-2 px-8 py-4 bg-brand-primary text-white rounded-2xl font-bold tracking-widest hover:bg-brand-dark transition-all shadow-xl shadow-brand-primary/20"
        >
          <Plus className="w-5 h-5" />
          <span>ADD MEMBER</span>
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
                     {currentMember.id ? 'Edit Team Member' : 'Add Team Member'}
                  </h2>
                  <button onClick={() => setIsEditMode(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                     <X className="w-6 h-6 text-gray-400" />
                  </button>
               </div>

               <form onSubmit={handleSave} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Full Name</label>
                        <input 
                           required
                           type="text"
                           value={currentMember.name}
                           onChange={(e) => setCurrentMember({...currentMember, name: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Specialty / Role</label>
                        <input 
                           required
                           type="text"
                           value={currentMember.specialty}
                           onChange={(e) => setCurrentMember({...currentMember, specialty: e.target.value})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                           placeholder="e.g. Cosmetic Dentist"
                        />
                     </div>
                     <div className="space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Display Order</label>
                        <input 
                           type="number"
                           value={currentMember.order}
                           onChange={(e) => setCurrentMember({...currentMember, order: parseInt(e.target.value)})}
                           className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all"
                        />
                     </div>
                      <div className="md:col-span-2 space-y-2">
                        <ImageUpload 
                          label="Profile Image"
                          value={currentMember.image}
                          onChange={(url) => setCurrentMember({...currentMember, image: url})}
                          folder="images"
                        />
                      </div>
                     <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">Bio / Description</label>
                        <textarea 
                           required
                           rows={4}
                           value={currentMember.description}
                           onChange={(e) => setCurrentMember({...currentMember, description: e.target.value})}
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
                        {saving ? 'Saving...' : 'Save Member'}
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
          {members.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group bg-white p-6 rounded-[40px] border border-gray-50 shadow-sm hover:shadow-2xl transition-all"
            >
              <div className="aspect-[4/5] rounded-[32px] overflow-hidden bg-gray-100 mb-6 relative">
                 <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                 <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <div className="flex gap-3">
                       <button onClick={() => openEditor(member)} className="w-12 h-12 bg-white text-brand-primary rounded-xl flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-lg"><Edit2 className="w-5 h-5" /></button>
                       <button onClick={() => handleDelete(member.id)} className="w-12 h-12 bg-white text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all shadow-lg"><Trash2 className="w-5 h-5" /></button>
                    </div>
                 </div>
              </div>
              <div className="space-y-2 px-2 text-center">
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-primary border border-brand-primary/10 px-3 py-1 rounded-full">{member.specialty}</span>
                 <h3 className="text-xl font-bold text-brand-dark pt-2">{member.name}</h3>
                 <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{member.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && members.length === 0 && (
         <div className="text-center py-20 bg-gray-50 rounded-[40px] border border-dashed border-gray-200 space-y-6">
            <div className="flex flex-col items-center">
              <Users className="w-16 h-16 text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold text-lg">No team members added yet.</p>
              <p className="text-gray-400 text-sm max-w-xs mx-auto mt-2">Connect the existing specialists from the About page to the database to start managing them.</p>
            </div>
            <button 
              onClick={importDefaults}
              className="px-8 py-3 bg-white border border-brand-primary/20 text-brand-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-sm"
            >
              Import Existing Specialists
            </button>
         </div>
      )}
    </div>
  );
}
