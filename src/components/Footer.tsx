import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { CONTACT_INFO } from '../constants';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-32 pb-12 overflow-hidden relative border-t border-white/5">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
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
                  <span>300 Pennsylvania Ave NW, Washington, DC 20006</span>
               </li>
               <li className="flex items-center space-x-4">
                  <Icons.Phone className="w-5 h-5 text-brand-primary shrink-0" />
                  <span>+ 386 40 111 5555</span>
               </li>
               <li className="flex items-center space-x-4">
                  <Icons.Mail className="w-5 h-5 text-brand-primary shrink-0" />
                  <span>info@ident.com</span>
               </li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="bg-white/5 p-10 rounded-[40px] space-y-8 border border-white/5">
            <h4 className="text-2xl font-display font-bold leading-tight">
               Subscribe to our newsletter
            </h4>
            <div className="space-y-4">
               <div className="relative">
                  <input 
                    type="email" 
                    placeholder="Enter email" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-6 text-sm focus:outline-none focus:border-brand-primary transition-colors"
                  />
                  <button className="absolute right-2 top-2 bottom-2 bg-brand-primary text-white p-3 rounded-lg hover:bg-brand-dark transition-colors">
                     <Icons.Send className="w-4 h-4" />
                  </button>
               </div>
               <p className="text-[10px] text-white/30 uppercase tracking-widest text-center">Get the latest updates right in your inbox.</p>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-xs font-bold uppercase tracking-widest">
          <p>© {new Date().getFullYear()} Orlando Dental Care. All rights reserved.</p>
          <div className="flex space-x-8">
            <Link to="#" className="hover:text-brand-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-brand-primary transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
