import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { HelpCircle, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Curated list for quick selection
const COMMON_ICONS = [
  'Target', 'ShieldCheck', 'Award', 'Users', 'Heart', 'Stethoscope', 'Activity', 
  'Clock', 'MapPin', 'Phone', 'Star', 'Smile', 'ThumbsUp', 'Calendar', 'Briefcase',
  'Clipboard', 'CheckCircle', 'Info', 'HelpCircle', 'Zap', 'Leaf', 'Gem', 'Crown',
  'Sparkles', 'Medal', 'Trophy', 'Lightbulb', 'Search', 'Bell', 'Settings',
  'User', 'Mail', 'Link', 'Image', 'Camera', 'Video', 'Mic', 'Music', 'Globe',
  'Sun', 'Moon', 'Cloud', 'Umbrella', 'Coffee', 'Trash2', 'Edit', 'Save',
  'Plus', 'Minus', 'ChevronRight', 'ChevronLeft', 'ArrowRight', 'ArrowLeft',
  'Eye', 'Lock', 'Unlock', 'Database', 'FileText', 'PieChart', 'BarChart', 'Layers',
  'Syringe', 'ClipboardCheck', 'ShieldAlert', 'Crosshair', 'CircuitBoard', 'Wallet2', 'HeartPulse', 'UserCheck'
];

// Get all available lucide icons for search
const ALL_ICON_NAMES = Object.keys(Icons).filter(name => 
  // Filter out the X, Search, etc that we import separately if they are duplicate or internal
  name !== 'createLucideIcon' && name !== 'default'
);

interface IconInputProps {
  value: string;
  onChange: (iconName: string) => void;
  label?: string;
  placeholder?: string;
}

export function IconInput({ value, onChange, label, placeholder = "Search icons..." }: IconInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const IconComponent = (Icons as any)[value] || HelpCircle;

  const filteredIcons = searchTerm.trim() === '' 
    ? COMMON_ICONS 
    : ALL_ICON_NAMES.filter(name => name.toLowerCase().includes(searchTerm.toLowerCase())).slice(0, 50);

  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-black text-gray-400 uppercase tracking-widest pl-1">{label}</label>}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => setIsModalOpen(true)}
          className="w-14 h-14 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-brand-primary cursor-pointer hover:border-brand-primary hover:bg-brand-primary/5 transition-all shadow-sm group"
        >
          <IconComponent size={24} className="group-hover:scale-110 transition-transform" />
        </div>
        <div className="flex-1 relative">
          <input 
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setIsModalOpen(true)}
            placeholder={placeholder}
            className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:bg-white focus:ring-2 focus:ring-brand-primary transition-all text-sm font-mono"
          />
          <div 
            onClick={() => setIsModalOpen(true)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-brand-primary cursor-pointer"
          >
            <Search size={18} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-brand-dark/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl overflow-hidden"
            >
              <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-display font-bold text-brand-dark">Choose an Icon</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Select from curated or search all Lucide icons</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="p-3 hover:bg-gray-50 rounded-2xl transition-colors text-gray-400 hover:text-brand-dark"
                >
                  <X size={24} />
                </button>
              </div>
              
              <div className="p-8 space-y-8">
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <input 
                    autoFocus
                    type="text"
                    placeholder="Type to search all icons (e.g. 'heart', 'tooth', 'star')..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-16 pr-6 py-5 bg-gray-50 border-none rounded-[24px] text-base focus:ring-2 focus:ring-brand-primary transition-all shadow-inner"
                  />
                </div>
                
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
                  {filteredIcons.map((name) => {
                    const CurrentIcon = (Icons as any)[name];
                    if (!CurrentIcon) return null;
                    
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => {
                          onChange(name);
                          setIsModalOpen(false);
                          setSearchTerm('');
                        }}
                        className={`aspect-square flex flex-col items-center justify-center p-3 rounded-2xl transition-all group ${
                          value === name 
                          ? 'bg-brand-primary text-white shadow-xl shadow-brand-primary/20 scale-105' 
                          : 'bg-white border border-gray-100 text-gray-400 hover:border-brand-primary/30 hover:bg-brand-primary/5 hover:text-brand-primary'
                        }`}
                        title={name}
                      >
                        <CurrentIcon size={24} className="transition-transform group-hover:scale-110" />
                        <span className={`text-[8px] mt-2 font-black truncate w-full text-center uppercase tracking-tighter ${
                          value === name ? 'text-white' : 'text-gray-400 group-hover:text-brand-primary'
                        }`}>
                          {name}
                        </span>
                      </button>
                    );
                  })}
                  {filteredIcons.length === 0 && (
                    <div className="col-span-full py-12 text-center">
                       <p className="text-gray-400 font-bold">No icons found for "{searchTerm}"</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                 <button 
                   onClick={() => setIsModalOpen(false)}
                   className="px-8 py-3 bg-white border border-gray-200 rounded-xl font-bold text-xs uppercase tracking-widest text-gray-500 hover:bg-gray-100 transition-all"
                 >
                   Close
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
