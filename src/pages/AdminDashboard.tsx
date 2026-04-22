import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { 
  FileEdit, 
  Users, 
  Eye, 
  TrendingUp,
  Clock,
  ArrowUpRight
} from 'lucide-react';

export function AdminDashboard() {
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

        {/* Quick Tips or Server Status */}
        <div className="space-y-6">
           <h4 className="text-xl font-display font-bold text-brand-dark">CMS Health</h4>
           <div className="bg-brand-dark text-white rounded-[40px] p-8 space-y-6 shadow-2xl shadow-brand-dark/30 relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                   <span className="text-sm font-bold uppercase tracking-widest text-white/50">Database</span>
                   <span className="px-2 py-1 bg-brand-primary text-[10px] rounded-lg font-black tracking-tighter">CONNECTED</span>
                </div>
                <div className="space-y-4">
                   <div className="flex justify-between items-center text-sm font-medium">
                      <span className="text-white/70">Storage Limit</span>
                      <span>12% Used</span>
                   </div>
                   <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-primary w-[12%] rounded-full shadow-[0_0_10px_rgba(20,229,219,0.5)]"></div>
                   </div>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
           </div>
        </div>
      </div>
    </div>
  );
}
