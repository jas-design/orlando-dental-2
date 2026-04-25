import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Curated list of icons that are most likely to be used in this context
const COMMON_ICONS = [
  'Target', 'ShieldCheck', 'Award', 'Users', 'Heart', 'Stethoscope', 'Activity', 
  'Clock', 'MapPin', 'Phone', 'Star', 'Smile', 'ThumbsUp', 'Calendar', 'Briefcase',
  'Clipboard', 'CheckCircle', 'Info', 'HelpCircle', 'Zap', 'Leaf', 'Gem', 'Crown',
  'Sparkles', 'Medal', 'Trophy', 'Lightbulb', 'Search', 'Bell', 'Settings',
  'User', 'Mail', 'Link', 'Image', 'Camera', 'Video', 'Mic', 'Music', 'Globe',
  'Sun', 'Moon', 'Cloud', 'Umbrella', 'Coffee', 'Trash2', 'Edit', 'Save',
  'Plus', 'Minus', 'ChevronRight', 'ChevronLeft', 'ArrowRight', 'ArrowLeft',
  'Eye', 'Lock', 'Unlock', 'Database', 'FileText', 'PieChart', 'BarChart', 'Layers'
];

interface IconPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (iconName: string) => void;
  currentIcon?: string;
}

export function IconPickerModal({ isOpen, onClose, onSelect, currentIcon }: IconPickerModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredIcons = COMMON_ICONS.filter(name => 
    name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Choose an Icon</h3>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input 
                type="text"
                placeholder="Search icons..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-primary transition-all"
              />
            </div>
            
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3 max-h-[400px] overflow-y-auto p-2 scrollbar-hide">
              {filteredIcons.map((name) => {
                const IconComponent = (Icons as any)[name];
                if (!IconComponent) return null;
                
                return (
                  <button
                    key={name}
                    onClick={() => {
                      onSelect(name);
                      onClose();
                    }}
                    className={`aspect-square flex flex-col items-center justify-center p-2 rounded-2xl transition-all group ${
                      currentIcon === name 
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20 scale-105' 
                      : 'bg-gray-50 text-gray-400 hover:bg-brand-primary/10 hover:text-brand-primary'
                    }`}
                  >
                    <IconComponent size={24} className="transition-transform group-hover:scale-110" />
                    <span className={`text-[9px] mt-2 font-bold truncate w-full text-center uppercase tracking-tighter ${
                      currentIcon === name ? 'text-white' : 'text-gray-400 group-hover:text-brand-primary'
                    }`}>
                      {name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
