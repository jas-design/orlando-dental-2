import { motion } from 'motion/react';
import { Target, Award, Users, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/Button';

export function About() {
  return (
    <div className="pt-24">
      {/* Hero Header */}
      <section className="bg-[#D4ECEE] py-24 text-brand-dark relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary/10 rounded-full blur-[100px]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-brand-primary font-black uppercase tracking-widest text-xs"
          >
            Our Story
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-display font-bold mt-4 mb-6 text-brand-dark"
          >
            We Care For Your Dental Health
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-700/80 max-w-2xl mx-auto leading-relaxed"
          >
            At Orlando Dental Care, we take pride in bringing added value to every patient by addressing all of your dental needs and concerns.
          </motion.p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-12">
               <div className="space-y-4">
                 <h2 className="text-4xl font-display font-bold">Our Mission</h2>
                 <p className="text-gray-600 text-lg leading-relaxed">
                   Our mission is to provide the highest quality dental care in a comfortable and welcoming environment. We believe in educating our patients and providing them with all the necessary information to make informed decisions about their oral health.
                 </p>
               </div>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                 {[
                   { icon: Target, title: 'Patient Focused', desc: 'Every treatment plan is tailored to your unique needs.' },
                   { icon: Award, title: 'Modern Tech', desc: 'Using state-of-the-art equipment for precision.' },
                   { icon: ShieldCheck, title: 'Certified Care', desc: 'Highly trained professionals you can trust.' },
                   { icon: Users, title: 'Family Driven', desc: 'Comprehensive care for all generations.' }
                 ].map((item, i) => (
                   <div key={i} className="flex gap-4">
                     <div className="w-12 h-12 bg-white text-brand-primary rounded-xl flex items-center justify-center flex-shrink-0 shadow-md border border-gray-100">
                       <item.icon className="w-6 h-6" />
                     </div>
                     <div>
                       <h4 className="font-bold text-gray-900">{item.title}</h4>
                       <p className="text-sm text-gray-500">{item.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
            <div className="relative">
              <div className="rounded-[48px] overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=800" 
                  alt="Our Office" 
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              <div className="absolute -bottom-10 -right-10 bg-brand-primary p-8 rounded-3xl shadow-xl flex items-center gap-4">
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
                <div className="rounded-full overflow-hidden w-48 h-48 mx-auto border-4 border-brand-primary shadow-lg">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-2xl font-display font-bold">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
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
           <Button to="/contact" className="!px-12 py-5 text-xl">Book Appointment</Button>
        </div>
      </section>
    </div>
  );
}
