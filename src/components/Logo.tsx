import React from 'react';
import { IMAGES } from '../assets';
import { useContent } from '../context/ContentContext';

interface LogoProps {
  className?: string;
  variant?: 'light' | 'dark';
}

const ToothIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Main Tooth Body */}
    <path
      d="M7.4 3.5C5 3.5 4 6 4 9C4 11.5 5 14.5 7 17C8 18.2 8.5 20.5 8.5 20.5C8.5 20.5 10 21.5 12 21.5C14 21.5 15.5 20.5 15.5 20.5C15.5 20.5 16 18.2 17 17C19 14.5 20 11.5 20 9C20 6 19 3.5 16.6 3.5C14.5 3.5 13.5 5 12 5C10.5 5 9.5 3.5 7.4 3.5Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Interior Detail / Gloss */}
    <path
      d="M14 7.5C14.5 7.5 16 8 16 9.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    {/* Sparkle */}
    <circle cx="18" cy="5" r="1.5" fill="currentColor" className="animate-pulse" />
  </svg>
);

export function Logo({ className = "", variant = 'dark' }: LogoProps) {
  const [imageError, setImageError] = React.useState(false);
  const { content } = useContent();
  const dynamicLogo = content.contactInfo.logoUrl;

  if (!imageError) {
    return (
      <img
        src={dynamicLogo || IMAGES.logo}
        alt="Dental Care Clinic"
        className={`${variant === 'light' ? 'brightness-0 invert' : ''} h-full w-auto object-contain transition-transform hover:scale-[1.02] ${className}`}
        onError={() => setImageError(true)}
        referrerPolicy="no-referrer"
      />
    );
  }

  // Fallback Text-based logo with the "smile" below "Dental"
  const textColor = variant === 'light' ? 'text-white' : 'text-brand-dark';

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <div className="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
        <ToothIcon className="text-white w-6 h-6" />
      </div>
      <div className={`flex flex-col font-display font-bold text-2xl leading-none tracking-tight ${textColor}`}>
        <div className="flex items-center">
          <span>Dental</span>
          <div className="relative mx-1">
            <span className="text-brand-primary">Care</span>
            {/* The "Little Smile" Arc below the word Care */}
            <svg
              viewBox="0 0 100 20"
              className="absolute -bottom-2 left-0 w-full h-2 text-brand-primary"
              preserveAspectRatio="none"
            >
              <path
                d="M10,5 Q50,15 90,5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="ml-1">Clinic</span>
        </div>
      </div>
    </div>
  );
}
