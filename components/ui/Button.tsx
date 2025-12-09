import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  fullWidth = false,
  className = '',
  ...props
}) => {
  const baseStyles = "px-8 py-4 rounded-xl font-bold text-sm tracking-wide transition-all duration-300 transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 relative overflow-hidden group";

  const variants = {
    primary: "bg-white text-slate-950 hover:bg-slate-200 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] border border-transparent",
    secondary: "bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 hover:border-slate-600 hover:text-white",
    outline: "bg-transparent border border-slate-700 text-slate-400 hover:border-paggie-cyan hover:text-paggie-cyan"
  };

  // Special handling for the gradient/brand primary button if strictly requested, 
  // but "White on Dark" is very premium for primary actions in dark mode apps (like Vercel/Linear).
  // However, Paggie has a Cyan brand. Let's make a "brand" variant or keep primary as Brand Gradient?
  // The user asked for "Notion, Stripe, Apple". Apple uses Blue/White. Stripe uses Blurple.
  // Let's stick to Paggie Cyan for strict brand buttons, but make it premium.

  const premiumVariants = {
    primary: "bg-gradient-to-r from-paggie-cyan to-paggie-blue text-white shadow-lg shadow-paggie-cyan/25 hover:shadow-paggie-cyan/40 border border-white/10 hover:-translate-y-0.5",
    secondary: "bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800 hover:text-white hover:border-slate-700 shadow-sm",
    outline: "bg-transparent border border-slate-700 text-slate-400 hover:border-paggie-cyan hover:text-paggie-cyan hover:bg-paggie-cyan/5"
  };

  return (
    <button
      className={`${baseStyles} ${premiumVariants[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">{children}</span>
      {variant === 'primary' && <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 blur-md"></div>}
    </button>
  );
};