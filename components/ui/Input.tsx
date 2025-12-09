
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div className="group flex flex-col gap-2 mb-5 w-full">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-paggie-cyan transition-colors duration-300">{label}</label>
      <input
        className={`bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-4 text-white text-base focus:outline-none focus:border-paggie-cyan/50 focus:ring-4 focus:ring-paggie-cyan/10 transition-all duration-300 placeholder-slate-700 shadow-sm w-full font-medium ${className}`}
        {...props}
      />
    </div>
  );
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, className, ...props }) => {
  return (
    <div className="group flex flex-col gap-2 mb-5 w-full">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-paggie-cyan transition-colors duration-300">{label}</label>
      <div className="relative">
        <select
          className={`bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-4 text-white text-base focus:outline-none focus:border-paggie-cyan/50 focus:ring-4 focus:ring-paggie-cyan/10 transition-all duration-300 appearance-none w-full font-medium cursor-pointer hover:bg-slate-900 ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-500 group-focus-within:text-paggie-cyan transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
    </div>
  );
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, className, ...props }) => {
  return (
    <div className="group flex flex-col gap-2 mb-5 w-full">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest ml-1 group-focus-within:text-paggie-cyan transition-colors duration-300">{label}</label>
      <textarea
        className={`bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-4 text-white text-base focus:outline-none focus:border-paggie-cyan/50 focus:ring-4 focus:ring-paggie-cyan/10 transition-all duration-300 placeholder-slate-700 resize-none w-full font-medium shadow-sm ${className}`}
        {...props}
      />
    </div>
  );
};
