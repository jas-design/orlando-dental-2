import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Renders a title string with support for:
 * 1. <br /> tags for line breaks
 * 2. {text} for brand-primary colored highlights
 */
export function renderTitle(title: string) {
  if (!title) return null;
  
  return title.split('<br />').map((line, lineIndex) => {
    const parts = line.split(/(\{.*?\})/);
    
    return (
      <React.Fragment key={lineIndex}>
        {parts.map((part, partIndex) => {
          if (part.startsWith('{') && part.endsWith('}')) {
            const text = part.slice(1, -1);
            return <span key={partIndex} className="text-brand-primary">{text}</span>;
          }
          return part;
        })}
        {lineIndex < title.split('<br />').length - 1 && <br />}
      </React.Fragment>
    );
  });
}
