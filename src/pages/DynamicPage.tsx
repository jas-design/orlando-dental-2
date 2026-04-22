import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { collection, query, where, getDocs, limit, orderBy, getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'motion/react';
import { Loader2, ArrowRight, Phone, Clock, MapPin, Mail, ChevronRight, FileText, Users as UsersIcon, Layout, Star } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '../components/Button';

export function DynamicPage() {
  const location = useLocation();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchPage() {
      setLoading(true);
      setError(false);
      try {
        const path = location.pathname.replace('/orlando-dental-2', '') || '/';
        const q = query(collection(db, 'pages'), where('slug', '==', path), limit(1));
        const snap = await getDocs(q);
        
        if (!snap.empty) {
          setPageData(snap.docs[0].data());
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Error fetching dynamic page:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchPage();
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="pt-40 pb-20 flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <Loader2 className="w-12 h-12 animate-spin text-brand-primary" />
        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Loading Secure Content...</p>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="pt-40 pb-20 px-4 text-center space-y-8">
        <h1 className="text-6xl md:text-8xl font-display font-bold text-brand-dark tracking-tighter">404</h1>
        <p className="text-xl text-gray-500 max-w-md mx-auto">This page doesn't exist or is still being crafted by our team.</p>
        <Link to="/" className="inline-block bg-brand-primary text-white px-10 py-5 rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-brand-primary/20 hover:bg-brand-dark transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 overflow-x-hidden">
      {pageData.sections?.map((section: any, i: number) => (
        <RenderSection key={section.id || i} section={section} />
      ))}
    </div>
  );
}

function RenderSection({ section }: { section: any }) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    async function fetchSectionData() {
      if (section.type === 'services_grid') {
        setLoading(true);
        const q = query(collection(db, 'services'), orderBy('order', 'asc'), limit(8));
        const snap = await getDocs(q);
        setData(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      }
      if (section.type === 'team_grid') {
        setLoading(true);
        const q = query(collection(db, 'team'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        setData(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      }
      if (section.type === 'blog_grid') {
        setLoading(true);
        const q = query(collection(db, 'blog'), orderBy('date', 'desc'), limit(3));
        const snap = await getDocs(q);
        setData(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        setLoading(false);
      }
      if (section.type === 'contact_strip') {
        const snap = await getDoc(doc(db, 'settings', 'contact'));
        if (snap.exists()) setSettings(snap.data());
      }
    }
    fetchSectionData();
  }, [section.type]);

  if (section.type === 'hero') {
    return (
      <section className="bg-[#D4ECEE] py-24 md:py-32 relative overflow-hidden">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16">
          <div className="lg:w-1/2 space-y-8 text-center lg:text-left">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-brand-primary font-black uppercase tracking-[0.4em] text-xs block"
            >
              + {section.badge || 'DENTAL CARE'}
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-display font-bold text-brand-dark tracking-tighter leading-tight"
            >
              {section.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-700/80 leading-relaxed max-w-xl"
            >
              {section.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Button to="/contact" className="!px-12 !py-6 text-xl">{section.cta || 'Book Consultation'}</Button>
            </motion.div>
          </div>
          <div className="lg:w-1/2">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="rounded-[60px] overflow-hidden shadow-3xl"
             >
                <img src={section.image} alt={section.title} className="w-full aspect-[4/3] object-cover" />
             </motion.div>
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'text_with_image') {
    return (
      <section className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-16 md:gap-24">
           <div className="lg:w-1/2 order-2 lg:order-1">
              <div className="rounded-[48px] overflow-hidden shadow-2xl relative group">
                 <img src={section.image} alt={section.title} className="w-full object-cover aspect-square transition-transform duration-700 group-hover:scale-105" />
                 <div className="absolute inset-0 bg-brand-primary/5 mix-blend-multiply" />
              </div>
           </div>
           <div className="lg:w-1/2 order-1 lg:order-2 space-y-8">
              <h2 className="text-4xl md:text-5xl font-display font-bold text-brand-dark tracking-tight">{section.title}</h2>
              <div className="w-20 h-1.5 bg-brand-primary rounded-full" />
              <p className="text-lg text-gray-500 leading-relaxed whitespace-pre-wrap">{section.description}</p>
              <Button variant="outline" to="/services" className="group">
                 <span>Our Services</span>
                 <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
           </div>
        </div>
      </section>
    );
  }

  if (section.type === 'services_grid') {
    return (
      <section className="py-40 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-20 space-y-6">
            <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-dark tracking-tight">{section.title || 'Our Services'}</h2>
            <p className="text-gray-500">{section.description}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {data.map((service, i) => {
              const Icon = (LucideIcons as any)[service.icon] || LucideIcons.Stethoscope;
              return (
                <div key={i} className="bg-white p-10 rounded-[40px] text-center space-y-4 hover:shadow-2xl transition-all border border-white">
                  <div className="w-16 h-16 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mx-auto">
                    <Icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-brand-dark uppercase tracking-widest text-[10px]">{service.title}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'team_grid') {
    return (
      <section className="py-40 bg-brand-dark text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
            <div className="max-w-xl space-y-6">
               <h2 className="text-5xl font-display font-bold leading-none">{section.title || 'Meet Our Experts'}</h2>
               <p className="text-gray-400">{section.description}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {data.map((member, i) => (
              <div key={i} className="group space-y-6">
                <div className="aspect-[4/5] rounded-[48px] overflow-hidden bg-white/5 relative">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-8 left-8 right-8">
                    <span className="text-brand-primary font-black uppercase tracking-widest text-[10px]">{member.specialty}</span>
                    <h4 className="text-2xl font-display font-bold mt-2">{member.name}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (section.type === 'blog_grid') {
    return (
      <section className="py-40 bg-white">
        <div className="container mx-auto px-4">
           <div className="max-w-2xl mx-auto text-center mb-20 space-y-6">
              <h2 className="text-5xl font-display font-bold text-brand-dark">{section.title || 'Latest Insights'}</h2>
              <p className="text-gray-500">{section.description}</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {data.map((post, i) => (
                <div key={i} className="group space-y-6">
                  <div className="aspect-[16/10] rounded-[40px] overflow-hidden shadow-sm">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  </div>
                  <div className="space-y-4">
                    <span className="text-brand-primary font-black uppercase tracking-widest text-[10px]">{post.category}</span>
                    <h3 className="text-2xl font-display font-bold text-brand-dark group-hover:text-brand-primary transition-colors">{post.title}</h3>
                  </div>
                </div>
              ))}
           </div>
        </div>
      </section>
    );
  }

  if (section.type === 'contact_strip') {
    return (
      <div className="bg-brand-primary py-12">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-white">
          <div className="flex items-center gap-6">
             <Phone className="w-10 h-10 p-2 bg-white/20 rounded-xl" />
             <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-60">Call Us</p>
                <p className="text-xl font-display font-bold">{settings?.phone || '(407) 737-9444'}</p>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <Clock className="w-10 h-10 p-2 bg-white/20 rounded-xl" />
             <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-60">Hours</p>
                <p className="text-xl font-display font-bold">{settings?.hours || 'Mon-Sat: 7am-5pm'}</p>
             </div>
          </div>
          <div className="flex items-center gap-6">
             <MapPin className="w-10 h-10 p-2 bg-white/20 rounded-xl" />
             <div>
                <p className="text-xs font-black uppercase tracking-widest opacity-60">Location</p>
                <p className="text-lg font-display font-bold line-clamp-1">{settings?.address || 'Orlando, FL'}</p>
             </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
