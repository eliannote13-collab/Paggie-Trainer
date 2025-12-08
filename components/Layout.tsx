
import React from 'react';

// Simplified Hexagon Logo Component
const PaggieLogo = () => (
  <svg width="48" height="48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-[0_0_15px_rgba(0,174,239,0.5)] w-10 h-10 sm:w-12 sm:h-12">
    <path d="M50 5 L93.3 30 V80 L50 105 L6.7 80 V30 L50 5Z" stroke="url(#paint0_linear)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M50 5 V55 L93.3 30" stroke="url(#paint0_linear)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="50" cy="55" r="12" fill="url(#paint0_linear)" className="animate-pulse" />
    <defs>
      <linearGradient id="paint0_linear" x1="6.7" y1="5" x2="93.3" y2="105" gradientUnits="userSpaceOnUse">
        <stop stopColor="#00AEEF" />
        <stop offset="1" stopColor="#0072BC" />
      </linearGradient>
    </defs>
  </svg>
);

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-0 sm:py-8 px-0 sm:px-4 no-print relative bg-slate-950 overflow-x-hidden selection:bg-paggie-cyan selection:text-white">

      {/* Premium Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[500px] bg-paggie-cyan/10 blur-[120px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="w-full max-w-[1400px] z-10 flex flex-col items-center flex-grow">

        {/* Header Branding */}
        <div className="mt-4 sm:mt-0 mb-6 flex flex-row items-center gap-3 sm:gap-4 text-left w-full justify-center sm:justify-start px-4">
          <div className="transition-transform hover:scale-110 duration-500 shrink-0">
            <PaggieLogo />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-none">
              PAGGIE <span className="text-transparent bg-clip-text bg-gradient-to-r from-paggie-cyan to-paggie-blue">TRAINER</span>
            </h1>
            <p className="text-slate-400 text-[8px] sm:text-[10px] font-bold tracking-[0.3em] uppercase opacity-70">Performance Intelligence</p>
          </div>
        </div>

        {/* Main Glass Container - Edge to Edge on Mobile */}
        <div className="w-full bg-slate-900/60 backdrop-blur-xl border-y sm:border border-white/5 rounded-none sm:rounded-3xl p-0 sm:p-1 shadow-2xl ring-1 ring-white/10 flex flex-col flex-grow">
          <div className="bg-slate-950/50 rounded-none sm:rounded-[22px] px-4 py-6 sm:p-8 relative flex-grow flex flex-col w-full">
            {/* Inner Glow */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-paggie-cyan/30 to-transparent opacity-50"></div>
            {children}
          </div>
        </div>

        <div className="mt-6 mb-2 text-slate-700 text-[10px] sm:text-xs uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity cursor-default px-4 text-center">
          System Ready • v3.3 Mobile Optimized
        </div>
      </div>
    </div>
  );
};
