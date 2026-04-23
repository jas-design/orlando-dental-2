import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';
import { AppointmentForm } from '../components/AppointmentForm';
import { CONTACT_INFO } from '../constants';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { renderTitle } from '../lib/utils';

export function Contact() {
  const [pageData, setPageData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const pageSnap = await getDoc(doc(db, 'pages', 'contact'));
        if (pageSnap.exists()) setPageData(pageSnap.data());
      } catch (error) {
        console.error("Error fetching contact page data:", error);
      }
    }
    fetchData();
  }, []);

  const heroSection = pageData?.sections?.find((s: any) => s.type === 'hero');
  const contactStrip = pageData?.sections?.find((s: any) => s.type === 'contact_strip');

  return (
    <div className="pt-24 min-h-screen">
      {/* Hero Header */}
      <section className="bg-[#D4ECEE] py-24 border-b border-brand-primary/20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-display font-bold text-brand-dark mb-6"
          >
            {renderTitle(heroSection?.title) || 'Get In Touch'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-700 font-medium text-xl max-w-2xl mx-auto leading-relaxed"
          >
            {heroSection?.description || 'Have questions or ready to schedule? Our team is here to help you achieve the smile of your dreams.'}
          </motion.p>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            {/* Contact Info Card */}
            <motion.div 
               initial={{ opacity: 0, x: -30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="space-y-12"
            >
              <div className="space-y-8">
                <h2 className="text-4xl font-display font-bold">
                  {renderTitle(contactStrip?.title) || 'Contact Information'}
                </h2>
                <p className="text-gray-500 text-lg">
                  {contactStrip?.description || 'Visit us in Orlando or reach out via phone or email for any inquiries about our services or insurance coverage.'}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white shadow-md border border-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-brand-primary">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Phone</h4>
                      <a href={`tel:${CONTACT_INFO.phone}`} className="text-brand-dark font-medium hover:underline">{CONTACT_INFO.phone}</a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white shadow-md border border-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-brand-primary">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Email</h4>
                      <a href={`mailto:${CONTACT_INFO.email}`} className="text-brand-dark font-medium hover:underline break-all">{CONTACT_INFO.email}</a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white shadow-md border border-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-brand-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Location</h4>
                      <p className="text-gray-600 text-sm leading-tight">{CONTACT_INFO.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white shadow-md border border-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-brand-primary">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Working Hours</h4>
                      <div className="space-y-1">
                        {CONTACT_INFO.hours.map((h, i) => (
                          <p key={i} className="text-gray-600 text-xs flex justify-between gap-4">
                            <span>{h.day}</span>
                            <span className="font-bold">{h.time}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mock Google Map */}
              <div className="relative group overflow-hidden rounded-[40px] shadow-2xl h-[400px] bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200" 
                  alt="City Map" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-brand-dark/20 flex items-center justify-center">
                  <div className="bg-white p-6 rounded-3xl shadow-2xl text-center space-y-4 max-w-[280px]">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg text-brand-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-gray-900 leading-tight">Find us on curry Ford Rd. Suite 1</p>
                    <a 
                      href="https://www.google.com/maps/search/?api=1&query=5211+Curry+Ford+Rd+Suite+1+Orlando+FL+32812" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-brand-dark font-bold underline"
                    >
                      Get Directions <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Form Section */}
            <motion.div 
               initial={{ opacity: 0, x: 30 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="bg-white p-8 md:p-12 rounded-[48px] shadow-2xl border border-gray-100"
            >
              <h3 className="text-3xl font-display font-bold mb-8">Send Us a Message</h3>
              <AppointmentForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="bg-brand-dark py-24 text-white text-center">
         <div className="container mx-auto px-4 space-y-4">
            <h2 className="text-4xl font-display font-bold">Hablamos Español</h2>
            <p className="text-blue-100/70 text-lg">Ofrecemos atención dental de calidad para toda la familia en su propio idioma.</p>
         </div>
      </section>
    </div>
  );
}
