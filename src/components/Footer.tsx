import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Logo } from './Logo';
import { useContent } from '../context/ContentContext';

export function Footer() {
  const { content } = useContent();
  const { contactInfo: CONTACT_INFO } = content;
  return (
    <footer className="bg-brand-dark text-white pt-32 pb-12 overflow-hidden relative border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 mb-20">
          {/* Column 1: Brand & Social */}
          <div className="space-y-10">
            <Link to="/" className="flex items-center group">
              <div className="h-16 flex items-center justify-center">
                 <Logo variant="light" />
              </div>
            </Link>
            <p className="text-white/50 text-sm leading-relaxed">
              We provide affordable, high-quality, and comprehensive dental care services for our patients to achieve dental wellness.
            </p>
            <div className="flex space-x-4">
              {[Icons.Facebook, Icons.Twitter, Icons.Linkedin, Icons.Instagram].map((Icon, i) => (
                <a key={i} href="#" className="w-11 h-11 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-all shadow-lg">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="space-y-8 lg:pl-10">
            <h4 className="text-xl font-display font-bold">
               Quick Links
            </h4>
            <ul className="space-y-4 text-white/50 text-sm font-medium tracking-tight">
               <li><Link to="/about" className="hover:text-brand-primary transition-colors">About Us</Link></li>
               <li><Link to="/services" className="hover:text-brand-primary transition-colors">Services</Link></li>
               <li><Link to="/gallery" className="hover:text-brand-primary transition-colors">Smile Gallery</Link></li>
               <li><Link to="/contact" className="hover:text-brand-primary transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="space-y-8 lg:pl-10">
            <h4 className="text-xl font-display font-bold">
               Contact
            </h4>
            <ul className="space-y-6 text-white/50 text-sm">
               <li className="flex items-start space-x-4">
                  <Icons.MapPin className="w-5 h-5 text-brand-primary shrink-0" />
                  <span>{CONTACT_INFO.address}</span>
               </li>
               <li className="flex items-center space-x-4">
                  <Icons.Phone className="w-5 h-5 text-brand-primary shrink-0" />
                  <span>{CONTACT_INFO.phone}</span>
               </li>
               <li className="flex items-center space-x-4">
                  <Icons.Mail className="w-5 h-5 text-brand-primary shrink-0" />
                  <span>{CONTACT_INFO.email}</span>
               </li>
            </ul>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-xs font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Dental Care Clinic. All rights reserved.</p>
          <div className="flex space-x-8">
            <Link to="/privacy-policy" className="hover:text-brand-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-brand-primary transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
