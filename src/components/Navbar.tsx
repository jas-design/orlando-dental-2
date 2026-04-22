import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Mail, Facebook, Twitter, Instagram, Search, Linkedin } from 'lucide-react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IMAGES } from '../assets';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Smile Gallery', path: '/gallery' },
    { name: 'Contact Us', path: '/contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top Header Bar */}
      <div className="bg-brand-dark text-white py-2 hidden lg:block text-[11px] font-medium tracking-tight border-b border-white/5">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-brand-primary" />
              <span>300 Pennsylvania Ave NW</span>
            </div>
            <div className="flex items-center space-x-2 border-l border-white/10 pl-6">
              <Icons.Clock className="w-3.5 h-3.5 text-brand-primary" />
              <span>Mon - Sat: 7:00 - 17:00</span>
            </div>
            <div className="flex items-center space-x-2 border-l border-white/10 pl-6">
              <Phone className="w-3.5 h-3.5 text-brand-primary" />
              <span>+ 386 40 111 5555</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-brand-primary" />
              <span>info@yourdomain.com</span>
            </div>
            <div className="flex items-center space-x-4 border-l border-white/10 pl-6 h-3">
              <Facebook className="w-3.5 h-3.5 hover:text-brand-primary transition-colors cursor-pointer" />
              <Twitter className="w-3.5 h-3.5 hover:text-brand-primary transition-colors cursor-pointer" />
              <Linkedin className="w-3.5 h-3.5 hover:text-brand-primary transition-colors cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav 
        className={`transition-all duration-300 ${
          scrolled ? 'bg-white shadow-xl py-3' : 'bg-white/95 backdrop-blur-md py-5'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <div className="h-12 flex items-center justify-center transition-transform hover:scale-[1.02]">
                 <img 
                   src={IMAGES.logo} 
                   alt="Orlando Dental Care" 
                   className="h-full w-auto object-contain"
                   onError={(e) => {
                     // Fallback to stylized icon + text if logo.png is missing
                     const target = e.target as HTMLImageElement;
                     target.style.display = 'none';
                     const container = target.parentElement!;
                     container.innerHTML = `
                       <div class="flex items-center space-x-2">
                         <div class="w-10 h-10 bg-[#27a2a8] rounded-lg flex items-center justify-center">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-activity w-6 h-6"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                         </div>
                         <span class="font-display font-bold text-2xl leading-none tracking-tight flex items-center text-[#1e293b]">
                           Orlando<span class="text-[#27a2a8]">Dental.</span>
                         </span>
                       </div>
                     `;
                   }}
                 />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              <div className="flex items-center space-x-7 mr-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`text-[12px] font-bold uppercase tracking-widest transition-colors hover:text-brand-primary ${
                      location.pathname === link.path ? 'text-brand-primary' : 'text-brand-dark'
                    }`}
                  >
                    {link.name}
                  </Link>
                ))}
                <button className="text-brand-dark hover:text-brand-primary transition-colors ml-4">
                  <Search className="w-4 h-4" />
                </button>
              </div>
              
              <Link
                to="/contact"
                className="bg-brand-primary text-white px-8 py-3.5 rounded-lg text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-brand-dark transition-all shadow-lg shadow-brand-primary/20"
              >
                Book a Call
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center space-x-4">
               <a href="tel:407-737-9444" className="text-brand-primary">
                 <Phone className="w-5 h-5" />
               </a>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-md text-brand-dark"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
              <div className="container mx-auto px-4 py-8 flex flex-col space-y-5">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="text-lg font-bold text-brand-dark hover:text-brand-primary transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <Link
                  to="/contact"
                  className="bg-brand-primary text-white px-8 py-4 rounded-xl text-center font-bold"
                  onClick={() => setIsOpen(false)}
                >
                  Book a Call
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
