import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { 
  FileEdit, 
  Users, 
  Eye, 
  TrendingUp,
  Clock,
  ArrowUpRight,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { CONTACT_INFO } from '../constants';
import { useState } from 'react';
import { useNotification } from '../context/NotificationContext';

export function AdminDashboard() {
  const [syncing, setSyncing] = useState(false);
  const { showNotification } = useNotification();

  const handleCloudSync = async () => {
    if (!confirm('This will synchronize your local configuration to the cloud. Current cloud content for "Home" and "Settings" will be updated. Continue?')) return;
    
    setSyncing(true);
    try {
      // Sync Contact Info
      await setDoc(doc(db, 'settings', 'global'), { contactInfo: CONTACT_INFO });
      
      // Sync Initial Home Page Data
      const homeDefault = {
        title: 'Home',
        slug: '/',
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
            image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80'
          },
          {
            id: 'services_intro',
            type: 'services_grid',
            title: 'Complete {Dental Care}',
            description: 'Dedicated to providing the best dental experience for our community with a focus on comfort and high-end results.'
          },
          {
             id: 'mission',
             type: 'text_with_image',
             badge: '+ WHY CHOOSE US',
             title: 'Diagnosis of {Dental Diseases}',
             description: 'We are committed to sustainability, eco-friendly initiatives and providing the most advanced dental diagnostics available today.',
             image: 'https://png.pngtree.com/png-vector/20231016/ourmid/pngtree-3d-render-teeth-isolated-white-transparent-background-png-image_10162590.png'
          }
        ]
      };
      
      await setDoc(doc(db, 'pages', 'home'), homeDefault);
      
      showNotification('Configuration and Home page merged to cloud', 'success');
    } catch (error) {
      console.error('Sync error:', error);
      showNotification('Failed to sync. Check Firebase permissions.', 'error');
    } finally {
      setSyncing(false);
    }
  };

  const stats = [
    { label: 'Website Visits', value: '1,284', icon: Eye, color: 'brand-primary' },
    { label: 'New Appointments', value: '42', icon: Clock, color: 'blue-500' },
    { label: 'Active Pages', value: '8', icon: FileEdit, color: 'emerald-500' },
    { label: 'Conversion Rate', value: '3.2%', icon: TrendingUp, color: 'orange-500' },
  ];

  const recentActivity = [
    { action: 'Updated home page header', user: 'Admin', time: '2 hours ago' },
    { action: 'Changed clinic phone number', user: 'Admin', time: '5 hours ago' },
    { action: 'Uploaded new gallery images', user: 'Admin', time: 'Yesterday' },
  ];

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row justify-between md:items-end gap-6">
        <div>
           <p className="text-brand-primary font-black uppercase tracking-[0.3em] mb-2 text-xs">Overview</p>
           <h1 className="text-4xl font-display font-bold text-brand-dark">Welcome back!</h1>
        </div>
        <div className="flex gap-4">
           <button className="px-6 py-3 bg-brand-primary text-white rounded-2xl font-bold text-sm tracking-widest uppercase shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all">
              Edit Homepage
           </button>
           <button className="px-6 py-3 bg-white text-brand-dark border border-gray-100 rounded-2xl font-bold text-sm tracking-widest uppercase hover:bg-gray-50 transition-all flex items-center gap-2">
              Add Post <ArrowUpRight className="w-4 h-4" />
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm shadow-brand-dark/5"
          >
             <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-6", `bg-${stat.color}/10`)}>
                <stat.icon className={cn("w-6 h-6", `text-${stat.color}`)} />
             </div>
             <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-1">{stat.label}</p>
             <h3 className="text-3xl font-display font-bold text-brand-dark">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
           <h4 className="text-xl font-display font-bold text-brand-dark flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              Recent Activity
           </h4>
           <div className="bg-white rounded-[40px] border border-gray-100 overflow-hidden">
              <div className="divide-y divide-gray-50">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="p-8 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                     <div className="flex items-center gap-6">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                           <Users className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                           <p className="font-bold text-brand-dark">{activity.action}</p>
                           <p className="text-xs text-brand-primary uppercase font-black tracking-widest mt-1">by {activity.user}</p>
                        </div>
                     </div>
                     <span className="text-sm text-gray-400 font-medium">{activity.time}</span>
                  </div>
                ))}
              </div>
              <button className="w-full py-6 text-sm font-bold text-gray-400 hover:text-brand-dark bg-gray-50/30 transition-all">
                 View All Activity
              </button>
           </div>
        </div>

        {/* Database Health & Cloud Sync */}
        <div className="space-y-6">
           <h4 className="text-xl font-display font-bold text-brand-dark flex items-center gap-2">
              <Database className="w-5 h-5 text-brand-primary" />
              Cloud Infrastructure
           </h4>
           
           <div className="bg-brand-dark text-white rounded-[40px] p-8 space-y-8 shadow-2xl shadow-brand-dark/30 relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Firebase Storage</span>
                   <span className="px-3 py-1 bg-brand-primary/20 text-brand-primary text-[9px] rounded-lg font-black tracking-widest border border-brand-primary/20">CONNECTED</span>
                </div>

                <div className="space-y-4">
                   <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest">
                      <span className="text-white/50">Data Consistency</span>
                      <span className="text-brand-primary flex items-center gap-1">
                         <CheckCircle2 className="w-3 h-3" /> Healthy
                      </span>
                   </div>
                   <p className="text-sm text-white/70 leading-relaxed font-medium">
                      If you see old content flashing, sync your local configuration to the cloud.
                   </p>
                </div>

                <button 
                  onClick={handleCloudSync}
                  disabled={syncing}
                  className="w-full py-4 bg-white text-brand-dark rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-brand-primary hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 group"
                >
                  {syncing ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-brand-primary" />
                  ) : (
                    <RefreshCw className="w-4 h-4 text-brand-primary group-hover:text-white transition-colors" />
                  )}
                  {syncing ? 'Synchronizing...' : 'Sync Local to Cloud'}
                </button>
              </div>
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/5 rounded-full blur-3xl -mr-24 -mt-24"></div>
           </div>

           <div className="bg-gray-50 rounded-[40px] p-8 border border-gray-100/50">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-10 h-10 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                    <AlertCircle className="w-5 h-5" />
                 </div>
                 <h5 className="font-bold text-brand-dark">Quick Support</h5>
              </div>
              <p className="text-sm text-gray-400 font-medium leading-relaxed">
                 Having trouble with image uploads? Make sure to check your Firebase Storage CORS settings.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
