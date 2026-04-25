import React, { useEffect } from 'react';
import { X, Calendar, ExternalLink, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface CalendlyModalProps {
  isOpen: boolean;
  onClose: () => void;
  calendlyLink: string;
}

export function CalendlyModal({ isOpen, onClose, calendlyLink }: CalendlyModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-brand-dark/40 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-display font-bold text-brand-dark">Book a Call</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-0.5">Select a time for your consultation</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <a 
                  href={calendlyLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-400 hover:text-brand-primary transition-colors"
                >
                  Open in New Tab <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={onClose}
                  className="w-12 h-12 rounded-2xl bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center group"
                >
                  <X className="w-6 h-6 transition-transform group-hover:rotate-90" />
                </button>
              </div>
            </div>

            {/* Content / Iframe */}
            <div className="flex-1 bg-gray-50 relative">
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                  <p className="text-xs font-black text-brand-primary uppercase tracking-[0.2em]">Loading Calendar...</p>
                </div>
              </div>
              <iframe
                src={`${calendlyLink}?hide_landing_page_details=1&hide_gdpr_banner=1`}
                width="100%"
                height="100%"
                frameBorder="0"
                title="Calendly Booking"
                className="w-full h-full relative z-10"
              ></iframe>
            </div>

            {/* Footer Tip */}
            <div className="p-4 bg-white border-t border-gray-50 text-center">
               <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  Secure Scheduling Powered by Calendly
               </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
