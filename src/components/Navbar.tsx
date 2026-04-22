import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, MapPin, Mail, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import * as Icons from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Logo } from './Logo';
import { useContent } from '../context/ContentContext';

export function Navbar() {
  const { content } = useContent();
  const { contactInfo: CONTACT_INFO } = content;
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
              <span>{CONTACT_INFO.address}</span>
            </div>
            <div className="flex items-center space-x-2 border-l border-white/10 pl-6">
              <Icons.Clock className="w-3.5 h-3.5 text-brand-primary" />
              <span>{CONTACT_INFO.hours[0].day}: {CONTACT_INFO.hours[0].time}</span>
            </div>
            <div className="flex items-center space-x-2 border-l border-white/10 pl-6">
              <Phone className="w-3.5 h-3.5 text-brand-primary" />
              <span>{CONTACT_INFO.phone}</span>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5 text-brand-primary" />
              <span>{CONTACT_INFO.email}</span>
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
              <div className="h-12 flex items-center justify-center">
                 <Logo />
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
