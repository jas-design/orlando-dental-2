import { ReactNode, useEffect, useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  User,
  ExternalLink,
  Loader2
} from 'lucide-react';
import { cn } from '../lib/utils';

export function AdminLayout({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (!u) {
        navigate('/admin/login');
      } else {
        setUser(u);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/admin/login');
    } catch (err) {
      console.error('Sign out error', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
      </div>
    );
  }

  const navItems = [
    { name: 'Overview', path: '/admin', icon: LayoutDashboard },
    { name: 'Pages', path: '/admin/pages', icon: FileText },
    { name: 'Media Library', path: '/admin/media', icon: ImageIcon },
    { name: 'Contact Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFB] flex font-sans">
      {/* Sidebar Desktop */}
      <aside className="hidden lg:flex w-72 bg-white flex-col border-r border-gray-100 h-screen fixed">
        <div className="p-8 border-b border-gray-50">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold">OC</div>
             <div>
                <h2 className="font-bold text-brand-dark leading-none">CMS</h2>
                <p className="text-[10px] uppercase font-black tracking-widest text-brand-primary opacity-70">Orlando Dental</p>
             </div>
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all group",
                isActive 
                  ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/20" 
                  : "text-gray-400 hover:bg-gray-50 hover:text-brand-dark"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6 border-t border-gray-50 space-y-4">
           <a 
             href="/" 
             target="_blank" 
             className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
           >
              <ExternalLink className="w-5 h-5" />
              <span>View Site</span>
           </a>
           <button 
             onClick={handleSignOut}
             className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 transition-all"
           >
             <LogOut className="w-5 h-5" />
             <span>Log Out</span>
           </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-72 min-h-screen flex flex-col">
        {/* Header Bar */}
        <header className="bg-white/80 backdrop-blur-md h-20 border-b border-gray-100 flex items-center justify-between px-8 sticky top-0 z-40">
           <div className="lg:hidden flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 -ml-2 text-gray-500"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="font-bold text-brand-dark">Orlando CMS</h2>
           </div>

           <div className="flex-1 hidden lg:block">
              <h2 className="text-xl font-display font-bold text-brand-dark">
                {navItems.find(item => item.path === location.pathname)?.name || 'Dashboard'}
              </h2>
           </div>

           <div className="flex items-center gap-6">
              <div className="hidden md:flex flex-col text-right">
                 <span className="text-sm font-bold text-brand-dark">{user?.email}</span>
                 <span className="text-[10px] font-black uppercase tracking-widest text-brand-primary">Administrator</span>
              </div>
              <div className="w-10 h-10 rounded-full bg-brand-light border-2 border-white shadow-md flex items-center justify-center text-brand-primary">
                 <User className="w-5 h-5" />
              </div>
           </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 lg:p-12">
           {children}
        </div>
      </main>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-brand-dark/20 backdrop-blur-sm z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-[70] lg:hidden p-8 flex flex-col"
            >
               <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white font-bold">OC</div>
                    <span className="font-bold text-brand-dark">CMS</span>
                  </div>
                  <button onClick={() => setSidebarOpen(false)} className="p-2 text-gray-400">
                     <X className="w-6 h-6" />
                  </button>
               </div>

               <nav className="flex-1 space-y-4">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) => cn(
                      "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all",
                      isActive 
                        ? "bg-brand-primary text-white shadow-xl shadow-brand-primary/20" 
                        : "text-gray-400 hover:bg-gray-50 hover:text-brand-dark"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
               </nav>

               <div className="mt-auto pt-8 border-t border-gray-50 flex flex-col gap-4">
                  <a href="/" target="_blank" className="flex items-center gap-4 text-gray-500 font-bold px-4">
                    <ExternalLink className="w-5 h-5" />
                    <span>View Site</span>
                  </a>
                  <button onClick={handleSignOut} className="flex items-center gap-4 text-red-500 font-bold px-4">
                    <LogOut className="w-5 h-5" />
                    <span>Log Out</span>
                  </button>
               </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
