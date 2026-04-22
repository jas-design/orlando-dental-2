import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Button } from '../components/Button';
import * as Icons from 'lucide-react';
import { TEAM, BLOG_POSTS } from '../constants';
import { doc, getDoc, collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function Home() {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [pageData, setPageData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    async function fetchData() {
      try {
        // Fetch Home Page Content
        const pageSnap = await getDoc(doc(db, 'pages', 'home'));
        if (pageSnap.exists()) setPageData(pageSnap.data());

        // Fetch Services
        const servicesSnap = await getDocs(query(collection(db, 'services'), orderBy('order', 'asc'), limit(8)));
        const servicesData = servicesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setServices(servicesData);

        // Fetch Recent Blogs
        const blogSnap = await getDocs(query(collection(db, 'blog'), orderBy('date', 'desc'), limit(3)));
        const blogData = blogSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBlogPosts(blogData);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    }
    fetchData();

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const heroSection = pageData?.sections?.find((s: any) => s.type === 'hero');
  const whyChooseUs = pageData?.sections?.find((s: any) => s.id === 'services_intro');

  const DEFAULT_SERVICES = [
    { title: 'General Dental Care', icon: 'Stethoscope' },
    { title: 'Dental Orthodontics', icon: 'Activity' },
    { title: 'Dental Implants', icon: 'Syringe' },
    { title: 'Advanced Dentistry', icon: 'ClipboardCheck' },
    { title: 'Teeth Whitening', icon: 'Sparkles' },
    { title: 'Crowns & Bridges', icon: 'Crown' },
    { title: 'Dental Veneers', icon: 'Smile' },
    { title: 'Emergency Procedures', icon: 'ShieldAlert' },
  ];

  const displayServices = services.length > 0 ? services : DEFAULT_SERVICES;

  const TESTIMONIALS = [
    { name: 'Sarah Miller', pos: 'Cosmetic Patient', text: 'The level of care here is unmatched. They really took the time to explain every step of my treatment. The results are better than I ever imagined.' },
    { name: 'John Peterson', pos: 'Orthodontics', text: 'I finally have the straight teeth I always wanted. The process was way faster than I expected! The team was incredibly supportive throughout.' },
    { name: 'Emma Watson', pos: 'New Patient', text: 'Hands down the best dental experience I have ever had. The office is beautiful and the staff is wonderful. I actually look forward to my visits!' },
    { name: 'Michael Chen', pos: 'Dental Implants', text: 'Professional, efficient, and caring. The implant procedure was painless and the final result looks completely natural. 10/10 service.' },
    { name: 'David Wilson', pos: 'Oral Surgery', text: 'Exceptional care from start to finish. The recovery was quick and the follow-up support was outstanding. Highly recommended.' },
    { name: 'Linda Brown', pos: 'General Care', text: 'A truly family-friendly practice. My kids love coming here, which is a testament to the staff\'s gentle approach and patience.' },
  ];

  const visibleItems = isMobile ? 1 : 2;
  const maxIndex = TESTIMONIALS.length - visibleItems;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  return (
    <div className="overflow-x-hidden font-sans">
      {/* 1. Hero Section */}
      <section className="relative min-h-[85vh] flex items-center pt-24 lg:pt-32 overflow-hidden bg-white">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl space-y-10">
            <div className="space-y-6">
               <h1 className="text-6xl md:text-8xl font-display font-bold text-brand-dark leading-[1.05] tracking-tight">
                 {heroSection?.title?.split('<br />').map((line: string, i: number) => (
                    <React.Fragment key={i}>
                       {line} {i === 0 && <br />}
                    </React.Fragment>
                 )) || (
                   <>Reveal the <br /> <span className="text-brand-primary">Radiant Smile</span> <br /> You Deserve</>
                 )}
               </h1>
               <p className="text-xl text-gray-500 max-w-xl leading-relaxed font-medium">
                 {heroSection?.description || "Experience dental care with a personal touch. Dr. Santos and our team combine artistry and precision to give you the healthy, confident smile you've always wanted."}
               </p>
            </div>
            <Link to="/contact" className="inline-flex items-center space-x-3 bg-brand-primary text-white px-10 py-5 rounded-md font-bold text-sm uppercase tracking-widest hover:bg-brand-dark transition-all shadow-2xl shadow-brand-primary/30">
               <span>{heroSection?.cta || 'Make an Appointment'}</span>
               <Icons.ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Hero Dentist Image */}
        <div className="absolute top-0 right-0 w-full h-full lg:w-1/2 pointer-events-none overflow-hidden xl:block hidden">
           <img 
             src={heroSection?.image || "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=1200"} 
             className="w-full h-full object-cover object-center translate-x-10" 
             alt="Professional Dentist"
           />
           {/* Gradient Overlay */}
           <div className="absolute inset-y-0 left-0 w-64 bg-gradient-to-r from-white to-transparent" />
        </div>
      </section>

      {/* 2. Info Strip Banner */}
      <div className="bg-brand-dark text-white py-10 relative z-20">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-center">
              <div className="flex items-center space-x-6">
                 <div className="w-16 h-16 bg-white text-brand-primary rounded-xl flex items-center justify-center shadow-lg">
                    <Icons.Phone className="w-7 h-7" />
                 </div>
                 <div>
                    <h3 className="font-bold uppercase tracking-tight text-[11px] opacity-50 mb-1">Give us a call</h3>
                    <p className="text-2xl font-display font-bold tracking-tight">+ 386 40 111 5555</p>
                 </div>
              </div>
              <div className="flex items-center space-x-6 border-white/5 md:border-x px-0 md:px-12 h-full">
                 <div className="w-16 h-16 bg-white text-brand-primary rounded-xl flex items-center justify-center shadow-lg">
                    <Icons.Clock className="w-7 h-7" />
                 </div>
                 <div>
                    <h3 className="font-bold uppercase tracking-tight text-[11px] opacity-50 mb-1">Working Hours</h3>
                    <p className="text-2xl font-display font-bold tracking-tight">Mon - Sat: 7:00 - 17:00</p>
                 </div>
              </div>
              <div className="flex items-center">
                 <Link to="/contact" className="w-full h-16 border-2 border-white/20 rounded-xl flex items-center justify-center font-bold uppercase tracking-widest text-xs hover:bg-brand-primary hover:border-brand-primary transition-all">
                    Book an Appointment
                 </Link>
              </div>
           </div>
        </div>
      </div>

      {/* 3. Services Grid */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-4">
           <div className="text-center max-w-2xl mx-auto space-y-6 mb-24">
              <span className="text-brand-primary font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center space-x-2">
                 <span>+ OUR SERVICES</span>
              </span>
              <h2 className="text-5xl font-display font-bold text-brand-dark tracking-tighter">Complete Dental Care</h2>
              <p className="text-gray-500 font-medium leading-relaxed">Dedicated to providing the best dental experience for our community with a focus on comfort and high-end results.</p>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
              {displayServices.map((service: any, i: number) => {
                const IconComponent = (Icons as any)[service.icon] || Icons.Stethoscope;
                return (
                  <div key={i} className="group p-10 bg-white border border-gray-100 rounded-[40px] hover:shadow-3xl transition-all duration-500 text-center space-y-6 flex flex-col items-center">
                    <div className="w-20 h-20 bg-white text-brand-primary rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6">
                       <IconComponent className="w-10 h-10" />
                    </div>
                    <h3 className="font-bold text-brand-dark uppercase tracking-[0.2em] text-[10px]">{service.title || service.name}</h3>
                  </div>
                );
              })}
           </div>
        </div>
      </section>

      {/* 4. Why Choose Us / Diagnosis Section */}
      <section className="py-32 bg-[#f8fbff] relative overflow-hidden">
        {/* Decorative corner Icons */}
        <Icons.Plus className="absolute top-10 left-10 text-brand-primary/10 w-16 h-16" />
        <Icons.Sparkle className="absolute bottom-10 right-10 text-brand-primary/10 w-24 h-24" />
        <Icons.Sparkles className="absolute top-20 right-20 text-brand-primary/10 w-10 h-10" />

        <div className="container mx-auto px-4 relative z-10">
           <div className="text-center max-w-2xl mx-auto space-y-6 mb-24">
              <span className="text-brand-primary font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center space-x-2">
                <span>+ WHY CHOOSE US</span>
              </span>
              <h2 className="text-6xl font-display font-bold text-[#1a3a4a] tracking-tight">
                {whyChooseUs?.title || (
                   <>Diagnosis of <span className="text-brand-primary font-bold">Dental Diseases</span></>
                )}
              </h2>
              <p className="text-gray-400 font-medium leading-relaxed">
                {whyChooseUs?.description || "We are committed to sustainability, eco-friendly initiatives."}
              </p>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* Left Column */}
              <div className="space-y-20 lg:text-right">
                 {[
                   { title: 'Experienced Doctor', icon: Icons.UserCheck, desc: 'The goal of our clinic is to provide friendly, caring dentistry and the.' },
                   { title: 'Personalized Care', icon: Icons.HeartPulse, desc: 'The goal of our clinic is to provide friendly, caring dentistry and the.' },
                   { title: 'Flexible Payment Options', icon: Icons.Wallet2, desc: 'The goal of our clinic is to provide friendly, caring dentistry and the.' },
                 ].map((item, i) => (
                   <div key={i} className="flex flex-col lg:flex-row items-center lg:items-center justify-end gap-6 group">
                      <div className="order-2 lg:order-1">
                         <h3 className="text-2xl font-display font-bold text-brand-dark group-hover:text-brand-primary transition-colors">{item.title}</h3>
                         <p className="text-gray-400 text-sm mt-2 leading-relaxed max-w-xs ml-auto">{item.desc}</p>
                      </div>
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-brand-primary order-1 lg:order-2 group-hover:bg-brand-primary group-hover:text-white transition-all shrink-0">
                         <item.icon className="w-8 h-8" />
                      </div>
                   </div>
                 ))}
              </div>

              {/* Center Image */}
              <div className="relative flex items-center justify-center py-10">
                 <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    {/* Circle Ring */}
                    <div className="w-[450px] h-[450px] border border-brand-primary/10 rounded-full relative">
                       {/* Perimeter Dots */}
                       {[0, 60, 120, 180, 240, 300].map((deg) => (
                         <div 
                           key={deg}
                           className="absolute w-2.5 h-2.5 bg-brand-primary rounded-full shadow-[0_0_10px_rgba(39,162,168,0.5)]"
                           style={{ 
                             top: `${50 + 50 * Math.sin((deg * Math.PI) / 180)}%`, 
                             left: `${50 + 50 * Math.cos((deg * Math.PI) / 180)}%`,
                             transform: 'translate(-50%, -50%)'
                           }}
                         />
                       ))}
                    </div>
                 </div>
                 <img 
                   src="https://png.pngtree.com/png-vector/20231016/ourmid/pngtree-3d-render-teeth-isolated-white-transparent-background-png-image_10162590.png" 
                   className="w-[340px] h-auto relative z-10 drop-shadow-[0_30px_60px_rgba(39,162,168,0.15)] hover:scale-105 transition-transform duration-700" 
                   alt="3D Tooth"
                 />
              </div>

              {/* Right Column */}
              <div className="space-y-20">
                 {[
                   { title: 'Emergency Services', icon: Icons.Crosshair, desc: 'The goal of our clinic is to provide friendly, caring dentistry and the.' },
                   { title: 'Positive Patient Reviews', icon: Icons.ThumbsUp, desc: 'The goal of our clinic is to provide friendly, caring dentistry and the.' },
                   { title: 'Latest Technology', icon: Icons.CircuitBoard, desc: 'The goal of our clinic is to provide friendly, caring dentistry and the.' },
                 ].map((item, i) => (
                   <div key={i} className="flex flex-col lg:flex-row items-center lg:items-center gap-6 group">
                      <div className="w-16 h-16 rounded-2xl bg-white shadow-lg flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all shrink-0">
                         <item.icon className="w-8 h-8" />
                      </div>
                      <div>
                         <h3 className="text-2xl font-display font-bold text-brand-dark group-hover:text-brand-primary transition-colors">{item.title}</h3>
                         <p className="text-gray-400 text-sm mt-2 leading-relaxed max-w-xs">{item.desc}</p>
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 5. Before & After Transformation Section */}
      <section className="py-40 bg-[#1e293b] text-white">
        <div className="container mx-auto px-4">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
              {/* Slider on the Left */}
              <div 
                className="relative h-[600px] rounded-[30px] overflow-hidden shadow-3xl select-none group cursor-ew-resize order-2 lg:order-1"
                onMouseMove={handleMouseMove}
              >
                {/* Before/After Labels */}
                <div className="absolute top-6 left-6 z-20 pointer-events-none">
                  <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-white/10 shadow-xl">
                    Before
                  </span>
                </div>
                <div className="absolute top-6 right-6 z-20 pointer-events-none">
                  <span className="bg-brand-primary/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-xl">
                    After
                  </span>
                </div>

                <div className="absolute inset-0">
                  <img src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="After" />
                </div>
                <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}>
                  <img src="https://images.unsplash.com/photo-1593059080506-3458322287bd?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" alt="Before" />
                </div>
                {/* Thin White Divider Line */}
                <div 
                  className="absolute inset-y-0 w-0.5 bg-white z-10 pointer-events-none"
                  style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                >
                  {/* Small Circular Handle as per image */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg text-[#1e293b]">
                    <Icons.ChevronLeft className="w-4 h-4" />
                    <Icons.ChevronRight className="w-4 h-4 ml-[-4px]" />
                  </div>
                </div>
              </div>

              {/* Content on the Right */}
              <div className="space-y-8 order-1 lg:order-2">
                 <div className="space-y-4">
                    <span className="text-brand-primary font-black uppercase text-xs tracking-[0.4em] block mb-4">+ BEFORE AND AFTER</span>
                    <h2 className="text-5xl md:text-7xl font-display font-medium text-white tracking-tight">
                       Get a Hollywood <br /> Smile Today!
                    </h2>
                 </div>
                 <div className="space-y-6">
                    <p className="text-gray-400 text-lg leading-relaxed font-light">
                       Sed elementum tortor sit amet lacus feugiat aliquam eu euismod dui, sit finibus neque quam nisl, euismod vitae sem in, tempor auctor nulla facilis in aliquam laoreet semper quam per inceptos.
                    </p>
                    <p className="text-gray-400 text-lg leading-relaxed font-light">
                       Amet lacus feugiat aliquam eu euismod dui, sit amet finibus neque quam euismod vitae sem tempor.
                    </p>
                 </div>
                 <div className="pt-6">
                    <p className="text-white text-2xl font-display font-medium italic">Dr. A. Viviana Santos</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-40 bg-white">
        <div className="container mx-auto px-4">
           {/* Section Headers */}
           <div className="text-center max-w-3xl mx-auto space-y-4 mb-24">
              <span className="text-brand-primary font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center space-x-2">
                 <span>+ FREQUENTLY ASKED QUESTIONS</span>
              </span>
              <h2 className="text-5xl md:text-7xl font-display font-medium text-[#1e293b] tracking-tight leading-tight">
                 If You Have Questions? <br /> We've Got Answers!
              </h2>
           </div>

           <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              {/* Left Column: Image and Stats */}
              <div className="relative">
                 <div className="rounded-[40px] overflow-hidden shadow-2xl relative">
                    <img 
                      src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=1000" 
                      className="w-full h-full object-cover aspect-[4/3]" 
                      alt="Dentist consultation" 
                    />
                 </div>
                 {/* Stats Box - Exactly as per image */}
                 <div className="absolute bottom-[-40px] left-[-20px] right-[-20px] md:left-4 md:right-4 bg-brand-primary rounded-[30px] p-10 flex items-center shadow-2xl text-white">
                    <div className="flex-1 text-center border-r border-white/20 px-6">
                       <h3 className="text-4xl md:text-5xl font-display font-bold mb-2">800+</h3>
                       <p className="text-sm font-medium text-white/80">Successful Projects</p>
                    </div>
                    <div className="flex-1 text-center px-6">
                       <h3 className="text-4xl md:text-5xl font-display font-bold mb-2">353+</h3>
                       <p className="text-sm font-medium text-white/80">Dental Hospital</p>
                    </div>
                 </div>
              </div>

              {/* Right Column: Accordion */}
              <div className="space-y-4 pt-12 lg:pt-0">
                 {[
                   { 
                     q: 'How often should I visit the doctor?', 
                     a: 'Routine checkups are recommended once a year for adults. Frequency may increase with age or chronic conditions. Preventive visits help catch issues early. Always follow your doctor\'s advice. Schedule visits if symptoms arise.' 
                   },
                   { 
                     q: 'How often should I see the dentist?', 
                     a: 'Regular dental visits should happen every six months for most people. This allows for professional cleaning and early detection of potential issues like decay or gum disease.' 
                   },
                   { 
                     q: 'What\'s included in a general health checkup?', 
                     a: 'A standard checkup usually includes a review of your medical history, vitals check, physical examination, and potentially blood tests or screenings tailored to your age and health focus.' 
                   },
                   { 
                     q: 'What causes tooth decay?', 
                     a: 'Tooth decay is caused by bacteria in the mouth that produce acids when consuming sugary foods. These acids gradually erode the tooth enamel over time.' 
                   }
                 ].map((faq, i) => (
                   <div 
                     key={i} 
                     className={`border rounded-2xl overflow-hidden transition-all duration-300 ${activeFaq === i ? 'border-brand-primary ring-1 ring-brand-primary/20' : 'border-gray-200'}`}
                   >
                      <button 
                        onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                        className="w-full flex items-center justify-between p-8 text-left group"
                      >
                         <span className={`text-xl font-display font-medium transition-colors ${activeFaq === i ? 'text-brand-primary' : 'text-brand-dark'}`}>
                            {faq.q}
                         </span>
                         <Icons.ArrowUpRight className={`w-5 h-5 transition-transform duration-300 ${activeFaq === i ? 'rotate-90 text-brand-primary' : 'text-gray-400 group-hover:text-brand-primary'}`} />
                      </button>
                      <motion.div 
                        initial={false}
                        animate={{ height: activeFaq === i ? 'auto' : 0, opacity: activeFaq === i ? 1 : 0 }}
                        className="overflow-hidden"
                      >
                         <div className="p-8 pt-0 text-gray-500 leading-relaxed text-lg border-t border-gray-50">
                            {faq.a}
                         </div>
                      </motion.div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </section>

      {/* 7. Doctor Banner Strip */}
      <section className="py-20 bg-brand-light/30">
        <div className="container mx-auto px-4">
           <div className="bg-white rounded-[100px] overflow-hidden flex flex-col lg:flex-row items-center border border-gray-100 shadow-3xl">
              <div className="lg:w-3/5 p-20 space-y-12">
                 <div className="space-y-6">
                    <span className="text-brand-primary font-black uppercase text-xs tracking-[0.4em] block mb-4">+ MEDICAL DIRECTOR</span>
                    <h2 className="text-6xl md:text-8xl font-display font-bold text-brand-dark leading-[0.9] tracking-tighter">
                       Lead by <br /> Dr. A. Viviana Santos
                    </h2>
                 </div>
                 <p className="text-gray-400 text-2xl font-medium leading-relaxed italic border-l-4 border-brand-primary pl-10">
                    "Every smile tells a story. Our mission is to make sure yours is one of health, confidence, and joy."
                 </p>
                 <div className="flex items-center space-x-12">
                    <div className="space-y-2">
                       <p className="text-5xl font-display font-bold text-brand-primary">25+</p>
                       <p className="text-[11px] font-black uppercase tracking-widest text-brand-dark/40">Years of Practice</p>
                    </div>
                    <div className="w-px h-16 bg-gray-100" />
                    <div className="space-y-2">
                       <p className="text-5xl font-display font-bold text-brand-dark">18k+</p>
                       <p className="text-[11px] font-black uppercase tracking-widest text-brand-dark/40">Happy Patients</p>
                    </div>
                 </div>
              </div>
              <div className="lg:w-2/5 h-[700px] w-full relative">
                 <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover" alt="Dr. A. Viviana Santos" />
                 <div className="absolute inset-0 bg-brand-primary/10 mix-blend-multiply" />
              </div>
           </div>
        </div>
      </section>

      {/* 8. Testimonials Carousel */}
      <section className="py-40 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto space-y-8 mb-24">
            <span className="text-brand-primary font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center space-x-2">
               <span>+ TESTIMONIALS</span>
            </span>
            <h2 className="text-5xl md:text-7xl font-display font-bold text-brand-dark tracking-tighter leading-none">What Our Patients Say</h2>
          </div>

          <div className="relative">
            <div className="overflow-hidden">
              <motion.div 
                className="flex"
                animate={{ x: `-${testimonialIndex * (100 / visibleItems)}%` }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
              >
                {TESTIMONIALS.map((t, i) => (
                  <div key={i} className={`${isMobile ? 'w-full' : 'w-1/2'} flex-shrink-0 px-4`}>
                    <div className="bg-gray-50 p-10 lg:p-12 rounded-[40px] lg:rounded-[60px] text-left space-y-6 lg:space-y-8 relative group hover:bg-white hover:shadow-3xl transition-all duration-700 h-full flex flex-col justify-between">
                      <div className="space-y-4 lg:space-y-6">
                        <div className="flex text-brand-secondary">
                          {[...Array(5)].map((_, j) => <Icons.Star key={j} className="w-4 h-4 fill-current" />)}
                        </div>
                        <p className="text-lg lg:text-xl text-brand-dark font-medium leading-relaxed italic">
                          "{t.text}"
                        </p>
                      </div>
                      <div className="flex items-center space-x-6 pt-8 border-t border-gray-100 mt-auto">
                        <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gray-200 rounded-full flex-shrink-0" />
                        <div>
                          <h4 className="font-bold text-brand-dark text-lg leading-none">{t.name}</h4>
                          <p className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mt-2">{t.pos}</p>
                        </div>
                      </div>
                      <Icons.Quote className="absolute top-8 right-8 lg:top-10 lg:right-10 w-10 h-10 lg:w-16 lg:h-16 text-brand-primary/5 transition-transform group-hover:scale-110" />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-center space-x-4 mt-16">
              <button 
                onClick={() => setTestimonialIndex(prev => (prev > 0 ? prev - 1 : maxIndex))}
                className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center text-brand-dark hover:bg-brand-primary hover:text-white transition-all shadow-xl"
              >
                <Icons.ArrowLeft className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setTestimonialIndex(prev => (prev < maxIndex ? prev + 1 : 0))}
                className="w-16 h-16 rounded-full border border-gray-200 flex items-center justify-center text-brand-dark hover:bg-brand-primary hover:text-white transition-all shadow-xl"
              >
                <Icons.ArrowRight className="w-6 h-6" />
              </button>
            </div>

            {/* Dots */}
            <div className="flex justify-center space-x-2 mt-8">
              {[...Array(maxIndex + 1)].map((_, i) => (
                <button 
                  key={i}
                  onClick={() => setTestimonialIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${testimonialIndex === i ? 'bg-brand-primary w-8' : 'bg-gray-200'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Latest News (Blog) */}
      <section className="py-40 bg-gray-50/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
            <div className="max-w-2xl space-y-6">
               <span className="text-brand-primary font-black uppercase text-xs tracking-[0.4em] block">+ LATEST NEWS</span>
               <h2 className="text-5xl md:text-7xl font-display font-bold text-brand-dark tracking-tighter leading-none">Oral Health <br /> <span className="text-brand-primary">Tips & Insights</span></h2>
            </div>
            <Link to="/blog" className="px-10 py-5 bg-white text-brand-dark rounded-2xl font-bold uppercase tracking-widest text-[11px] border border-gray-100 hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all shadow-xl shadow-gray-200/50">
               View All Articles
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {blogPosts.length > 0 ? (
              blogPosts.map((post: any, i: number) => (
                <motion.div 
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white rounded-[40px] overflow-hidden border border-gray-50 shadow-sm hover:shadow-3xl transition-all duration-500"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-10 space-y-6">
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-brand-primary">
                      <span>{post.category}</span>
                      <span className="w-1 h-1 bg-gray-200 rounded-full" />
                      <span className="text-gray-400">{post.date}</span>
                    </div>
                    <h3 className="text-2xl font-display font-bold text-brand-dark group-hover:text-brand-primary transition-colors line-clamp-2">
                       {post.title}
                    </h3>
                    <Link to={`/blog/${post.id}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-brand-dark group-hover:text-brand-primary transition-colors">
                      <span>Read More</span>
                      <Icons.ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))
            ) : (
              // Fallback cards if no posts in DB
              [1, 2, 3].map((_, i) => (
                <div key={i} className="bg-white/50 rounded-[40px] border border-dashed border-gray-200 p-12 text-center flex flex-col items-center justify-center space-y-4">
                  <Icons.FileText className="w-12 h-12 text-gray-200" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Awaiting Articles</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* 9. Call to Action */}
      <section className="py-40 bg-brand-primary relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
        <div className="container mx-auto px-4 text-center space-y-16 relative z-10">
          <h2 className="text-6xl md:text-[120px] font-display font-bold text-white leading-[0.85] tracking-tighter">
            READY TO <br /> <span className="text-brand-dark">TRANSFORM</span> <br /> YOUR SMILE?
          </h2>
          <div className="flex flex-col md:flex-row items-center justify-center gap-10">
             <Link to="/contact" className="bg-brand-dark text-white px-16 py-8 rounded-[30px] font-black text-xl hover:bg-white hover:text-brand-primary transition-all shadow-3xl group">
                <span className="flex items-center space-x-4">
                  <span>BOOK NOW</span>
                  <Icons.ArrowUpRight className="w-6 h-6 transition-transform group-hover:rotate-45" />
                </span>
             </Link>
             <a href="tel:+386401115555" className="bg-white text-brand-primary px-16 py-8 rounded-[30px] font-black text-xl hover:bg-brand-dark hover:text-white transition-all shadow-3xl">
                CALL CLINIC
             </a>
          </div>
        </div>
      </section>
    </div>
  );
}
