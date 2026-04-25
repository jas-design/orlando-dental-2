import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import * as Icons from 'lucide-react';
import { Button } from '../components/Button';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { TEAM as STATIC_TEAM } from '../constants';
import { renderTitle } from '../lib/utils';

export function About() {
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Page Data for About
        const pageSnap = await getDoc(doc(db, 'pages', 'about'));
        if (pageSnap.exists()) {
          setPageData(pageSnap.data());
        }

        const q = query(collection(db, 'team'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTeam(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayTeam = team.length > 0 ? team : STATIC_TEAM;
  const missionSection = pageData?.sections?.find((s: any) => s.id === 'mission' || s.type === 'text_with_image');
  const heroSection = pageData?.sections?.find((s: any) => s.type === 'hero');
  const teamSection = pageData?.sections?.find((s: any) => s.type === 'team_grid');

  const allFeatures = [
    ...(missionSection?.features_left || []),
    ...(missionSection?.features_right || [])
  ];

  const displayFeatures = allFeatures.length > 0 ? allFeatures : [
    { icon: 'Target', title: 'Patient Focused', description: 'Every treatment plan is tailored to your unique needs.' },
    { icon: 'Award', title: 'Modern Tech', description: 'Using state-of-the-art equipment for precision.' },
    { icon: 'ShieldCheck', title: 'Certified Care', description: 'Highly trained professionals you can trust.' },
    { icon: 'Users', title: 'Family Driven', description: 'Comprehensive care for all generations.' }
  ];

  return (
    <div className="pt-24">
      {/* Hero Header */}
      <section className="bg-[#D4ECEE] py-24 text-brand-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-secondary font-black uppercase tracking-widest text-xs"
          >
            {heroSection?.badge || 'Our Story'}
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold mt-4 mb-6 text-brand-dark"
          >
            {renderTitle(heroSection?.title) || 'We Care For Your Dental Health'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-700/80 max-w-2xl mx-auto leading-relaxed"
          >
            {heroSection?.description || 'At Orlando Dental Care, we take pride in bringing added value to every patient by addressing all of your dental needs and concerns.'}
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
               <div className="space-y-4">
                 <h2 className="text-4xl font-display font-bold">
                   {renderTitle(missionSection?.title) || 'Our Mission'}
                 </h2>
                 <p className="text-gray-600 text-lg leading-relaxed">
                   {missionSection?.description || 'Our mission is to provide the highest quality dental care in a comfortable and welcoming environment. We believe in educating our patients and providing them with all the necessary information to make informed decisions about their oral health.'}
                 </p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 {displayFeatures.map((item, i) => {
                   const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;
                   return (
                     <div key={i} className="flex gap-4">
                       <div className="w-12 h-12 bg-white text-brand-secondary rounded-xl flex items-center justify-center flex-shrink-0 shadow-md border border-gray-100">
                         <IconComponent className="w-6 h-6" />
                       </div>
                       <div>
                         <h4 className="font-bold text-gray-900">{item.title}</h4>
                         <p className="text-sm text-gray-500">{item.description || (item as any).desc}</p>
                       </div>
                     </div>
                   );
                 })}
               </div>
            </div>
            <div className="relative">
              <div className="rounded-[48px] overflow-hidden shadow-2xl">
                <img 
                  src={(missionSection?.image && missionSection.image !== '') ? missionSection.image : (heroSection?.image && heroSection.image !== '') ? heroSection.image : "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800"} 
                  alt="Our Office" 
                  className="w-full aspect-[4/3] object-cover"
                />

              </div>
              <div className="absolute -bottom-10 -right-10 bg-brand-secondary p-8 rounded-3xl shadow-xl flex items-center gap-4">
                 <div className="text-5xl font-display font-bold text-brand-dark">15</div>
                 <div className="text-sm font-bold text-brand-dark/70 uppercase leading-tight tracking-widest">Years of <br /> Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges Wrapper */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-display font-bold uppercase tracking-widest text-gray-400">Trusted By Industry Leaders</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-40 hover:opacity-100 transition-opacity">
            {/* These would be actual certification logos */}
            <div className="font-bold text-2xl text-gray-900">ADA American Dental Association</div>
            <div className="font-bold text-2xl text-gray-900">Invisalign Platinum</div>
            <div className="font-bold text-2xl text-gray-900">AAO Orthodontics</div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Why Choose Orlando Dental Care?</h2>
            <p className="text-gray-600">We go beyond routine checkups to provide a comprehensive dental experience based on trust and transparency.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              {
                title: 'Expert Specialists',
                desc: 'Our team includes specialists in all fields of dentistry, from surgery to pediatric care.',
                image: 'https://images.unsplash.com/photo-1559839734-2b71f1536780?auto=format&fit=crop&q=80&w=400'
              },
              {
                title: 'High-Tech Facility',
                desc: 'Equipped with digital X-rays, 3D imaging, and the latest in sterilization technology.',
                image: 'https://images.unsplash.com/photo-1581595224492-38616483df21?auto=format&fit=crop&q=80&w=400'
              },
              {
                title: 'Compassionate Team',
                desc: 'We understand dental anxiety and strive to make every visit calm and stress-free.',
                image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400'
              }
            ].map((item, i) => (
              <div key={i} className="space-y-6">
                <div className="rounded-full overflow-hidden w-48 h-48 mx-auto border-4 border-brand-secondary shadow-lg">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-display font-bold">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Our Team Section */}
      <section className="py-24 bg-brand-dark text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
            <span className="text-brand-secondary font-black uppercase tracking-widest text-xs">{teamSection?.badge || '+ OUR SPECIALISTS'}</span>
            <h2 className="text-5xl font-display font-bold leading-none">{renderTitle(teamSection?.title) || <>Meet the Experts Behind <br /> Your Radiant Smile</>}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {displayTeam.map((member, i) => (
              <motion.div 
                key={member.id || i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group space-y-6 text-center"
              >
                <div className="aspect-[4/5] rounded-[48px] overflow-hidden bg-white/5 border border-white/10 group-hover:border-brand-primary/50 transition-all duration-500 relative">
                   <img src={member.image} alt={member.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                   <div className="absolute inset-0 bg-gradient-to-t from-brand-dark via-transparent to-transparent opacity-60" />
                   <div className="absolute bottom-8 left-0 right-0 px-6">
                      <span className="inline-block px-4 py-1.5 bg-brand-secondary text-brand-dark font-bold text-[10px] rounded-full uppercase tracking-widest mb-3">
                         {member.specialty}
                      </span>
                      <h4 className="text-2xl font-display font-bold leading-none">{member.name}</h4>
                   </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 container mx-auto px-4">
        <div className="bg-brand-secondary/30 rounded-[64px] p-12 md:p-24 text-center space-y-8">
           <h2 className="text-4xl md:text-6xl font-display font-bold text-brand-dark">Ready for Your First Visit?</h2>
           <p className="text-xl text-gray-700 max-w-2xl mx-auto">
             Contact us today and schedule an appointment to start your journey towards a healthier, brighter smile.
           </p>
           <Button to="/contact" className="!px-12 py-5 text-xl !bg-brand-secondary !text-brand-dark">Book Appointment</Button>
        </div>
      </section>
    </div>
  );
}
