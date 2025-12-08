
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 mb-4 w-full">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">{label}</label>
      <input
        className={`bg-slate-800 border border-slate-700 rounded-lg px-4 py-3.5 text-white text-base sm:text-sm focus:outline-none focus:border-paggie-cyan focus:ring-1 focus:ring-paggie-cyan transition-all placeholder-slate-600 shadow-inner w-full ${className}`}
        {...props}
      />
    </div>
  );
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }> = ({ label, children, className, ...props }) => {
  return (
    <div className="flex flex-col gap-1.5 mb-4 w-full">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">{label}</label>
      <div className="relative">
        <select
          className={`bg-slate-800 border border-slate-700 rounded-lg px-4 py-3.5 text-white text-base sm:text-sm focus:outline-none focus:border-paggie-cyan focus:ring-1 focus:ring-paggie-cyan transition-all appearance-none w-full ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-500">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
        </div>
      </div>
    </div>
  );
};

export const TextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, className, ...props }) => {
    return (
      <div className="flex flex-col gap-1.5 mb-4 w-full">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wide ml-1">{label}</label>
        <textarea
          className={`bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-base sm:text-sm focus:outline-none focus:border-paggie-cyan focus:ring-1 focus:ring-paggie-cyan transition-all placeholder-slate-600 resize-none w-full ${className}`}
          {...props}
        />
      </div>
    );
  };
