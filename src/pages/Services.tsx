import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Button } from '../components/Button';
import { SERVICES as STATIC_SERVICES } from '../constants';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function Services() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Page Data for Services
        const pageSnap = await getDoc(doc(db, 'pages', 'services'));
        if (pageSnap.exists()) setPageData(pageSnap.data());

        const q = query(collection(db, 'services'), orderBy('order', 'asc'));
        const snap = await getDocs(q);
        const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(data);
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const displayServices = services.length > 0 ? services : STATIC_SERVICES;
  const heroSection = pageData?.sections?.find((s: any) => s.type === 'hero');

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="bg-[#D4ECEE] py-24 border-b border-brand-primary/20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-brand-dark mb-6">
            {heroSection?.title || 'Our Services'}
          </h1>
          <p className="text-gray-700 font-medium text-xl max-w-2xl mx-auto leading-relaxed">
            {heroSection?.description || 'From routine checkups to full smile transformations, we provide comprehensive dental care for patients of all ages.'}
          </p>
        </div>
      </section>

      {/* Main Services Grid */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-brand-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-24">
              {displayServices.map((service, index) => {
                const IconComponent = (Icons as any)[service.icon] || Icons.CheckCircle;
                const isEven = index % 2 === 0;
                
                return (
                  <motion.div
                    key={service.id || index}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 lg:gap-24 items-center`}
                  >
                    <div className="w-full lg:w-1/2">
                      <div className="relative">
                        <div className="rounded-[48px] overflow-hidden shadow-2xl relative z-10 aspect-video">
                          <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute -top-6 -left-6 w-24 h-24 bg-brand-primary rounded-3xl -z-0 transform -rotate-12" />
                      </div>
                    </div>
                    
                    <div className="w-full lg:w-1/2 space-y-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white text-brand-primary rounded-2xl flex items-center justify-center shadow-lg border border-gray-50">
                           <IconComponent className="w-8 h-8" />
                        </div>
                        <h2 className="text-4xl font-display font-bold text-gray-900">{service.title}</h2>
                      </div>
                      <p className="text-gray-600 text-lg leading-relaxed pt-2">
                         {service.description} We use modern technology and advanced techniques to ensure the best possible results and patient comfort.
                      </p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4">
                        {[
                          'Pain-free experience',
                          'State-of-the-art tech',
                          'Expert care',
                          'Same-day visits'
                        ].map((feature, i) => (
                          <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                            <CheckCircle2 className="w-5 h-5 text-brand-primary" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="pt-4">
                        <Button to="/contact">Schedule This Service</Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-brand-dark text-white text-center">
        <div className="container mx-auto px-4 space-y-8">
           <h2 className="text-4xl md:text-5xl font-display font-bold">Unsure what you need?</h2>
           <p className="text-blue-100/70 text-lg max-w-2xl mx-auto">
             Contact or visit us for a comprehensive oral exam. We'll assess your needs and build a custom treatment plan that fits your expectations and budget.
           </p>
           <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
              <Button to="/contact" variant="primary" className="!px-12">Contact Us</Button>
              <Button href="tel:407-737-9444" variant="outline" className="border-white text-white hover:bg-white hover:text-brand-dark">Call (407) 737-9444</Button>
           </div>
        </div>
      </section>
    </div>
  );
}
