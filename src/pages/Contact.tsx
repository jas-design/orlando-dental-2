import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, ExternalLink } from 'lucide-react';
import { AppointmentForm } from '../components/AppointmentForm';
import { useContent } from '../context/ContentContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { renderTitle } from '../lib/utils';

export function Contact() {
  const { content } = useContent();
  const { contactInfo } = content;
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
                      <a href={`tel:${contactInfo.phone}`} className="text-brand-dark font-medium hover:underline">{contactInfo.phone}</a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white shadow-md border border-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-brand-primary">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Email</h4>
                      <a href={`mailto:${contactInfo.email}`} className="text-brand-dark font-medium hover:underline break-all">{contactInfo.email}</a>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white shadow-md border border-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-brand-primary">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Location</h4>
                      <p className="text-gray-600 text-sm leading-tight">{contactInfo.address}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-white shadow-md border border-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0 text-brand-primary">
                      <Clock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">Working Hours</h4>
                      <div className="space-y-1">
                        {contactInfo.hours.map((h, i) => (
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

              {/* Google Map */}
              <div className="relative group overflow-hidden rounded-[40px] shadow-2xl h-[450px] bg-gray-100 border border-gray-100">
                <iframe 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  loading="lazy" 
                  allowFullScreen 
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(contactInfo.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                ></iframe>
                
                {/* Floating Info Box on top of Map */}
                <div className="absolute bottom-8 left-8 right-8 md:right-auto md:w-80">
                  <div className="bg-white/95 backdrop-blur-md p-8 rounded-3xl shadow-2xl border border-white/20 space-y-4">
                    <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-display font-bold text-gray-900 leading-tight text-lg">Find us at</p>
                      <p className="text-gray-500 text-sm mt-1">{contactInfo.address}</p>
                    </div>
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(contactInfo.address)}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-widest hover:text-brand-dark transition-colors"
                    >
                      Get Directions <ExternalLink className="w-3.5 h-3.5" />
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
