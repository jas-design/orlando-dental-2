import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: ReactNode;
  to?: string;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'dark';
  className?: string;
  type?: 'button' | 'submit';
}

export function Button({ 
  children, 
  to, 
  href,
  onClick, 
  variant = 'primary', 
  className = '',
  type = 'button' 
}: ButtonProps) {
  const baseStyles = "px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md inline-flex items-center justify-center";
  
  const variants = {
    primary: "bg-brand-primary text-brand-dark hover:bg-opacity-90",
    secondary: "bg-brand-secondary text-brand-dark hover:bg-opacity-90",
    outline: "border-2 border-brand-primary text-gray-800 hover:bg-brand-primary/10",
    dark: "bg-brand-dark text-white hover:bg-opacity-90",
  };

  const combinedClasses = `${baseStyles} ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={combinedClasses} onClick={onClick}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} className={combinedClasses} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <button type={type} onClick={onClick} className={combinedClasses}>
      {children}
    </button>
  );
}
