
import React from 'react';

interface Props {
  onSelect: (mode: 'assessment' | 'training' | 'library' | 'anamnese' | 'physical-assessment' | 'chat-paggie') => void;
  trainerName: string;
  onEditProfile: () => void;
  onLogout: () => void;
}

// Icons
const ChartIcon = () => (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 20V10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const DumbbellIcon = () => (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.5 6.5H17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6.5 17.5H17.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M15 4V20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 17.5H4C2.89543 17.5 2 16.6046 2 15.5V8.5C2 7.39543 2.89543 6.5 4 6.5H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M19 6.5H20C21.1046 6.5 22 7.39543 22 8.5V15.5C22 16.6046 21.1046 17.5 20 17.5H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const LibraryIcon = () => (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 7h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M9 11h6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);
const AnamneseIcon = () => (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 5a2 2 0 012-2h2a2 2 0 012 2v0a2 2 0 01-2 2h-2a2 2 0 01-2-2v0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const RunnerIcon = () => (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);
const BotIcon = () => (<svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 2a2 2 0 0 1 2 2v2h-4V4a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/><path d="M5 8h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z" stroke="currentColor" strokeWidth="2"/><path d="M8 14h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M16 14h.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/><path d="M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>);

export const ModeSelection: React.FC<Props> = ({ onSelect, trainerName, onEditProfile, onLogout }) => {
  return (
    <div className="animate-fade-in w-full max-w-7xl mx-auto flex flex-col min-h-[70vh] relative">
      
      {/* Header Section */}
      <div className="text-center mb-8 sm:mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 backdrop-blur-md shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-slate-300 font-bold">Painel de Controle</span>
        </div>
        
        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
          Olá, <span className="text-transparent bg-clip-text bg-gradient-to-r from-paggie-cyan to-paggie-blue">{trainerName}</span>
        </h2>
        <p className="text-slate-400 font-light text-sm max-w-lg mx-auto leading-relaxed">
          Selecione uma ferramenta abaixo para iniciar um novo atendimento.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-20 sm:mb-12">
        
        <DashboardCard 
            onClick={() => onSelect('assessment')}
            icon={<ChartIcon />}
            title="Evolução Física"
            desc="Comparativo de medidas e fotos."
            color="paggie-cyan"
            cta="Nova Avaliação"
        />

        <DashboardCard 
            onClick={() => onSelect('training')}
            icon={<DumbbellIcon />}
            title="Ficha de Treino"
            desc="Montagem de planilhas."
            color="emerald-500"
            cta="Criar Treino"
        />

        <DashboardCard 
            onClick={() => onSelect('library')}
            icon={<LibraryIcon />}
            title="Biblioteca"
            desc="Banco de exercícios."
            color="violet-500"
            cta="Acessar Banco"
        />

        <DashboardCard 
            onClick={() => onSelect('anamnese')}
            icon={<AnamneseIcon />}
            title="Anamnese"
            desc="Prontuário clínico."
            color="amber-500"
            cta="Novo Prontuário"
        />

        <DashboardCard 
            onClick={() => onSelect('physical-assessment')}
            icon={<RunnerIcon />}
            title="Testes Físicos"
            desc="Performance e análise postural."
            color="rose-500"
            cta="Novos Testes"
        />

        <DashboardCard 
            onClick={() => onSelect('chat-paggie')}
            icon={<BotIcon />}
            title="ChatPAGGIE"
            desc="IA p/ sugestão de treinos."
            color="indigo-500"
            cta="Consultar IA"
        />

      </div>

      {/* Footer / Logout - FIXED BUTTONS */}
      <div className="mt-auto pt-4 flex flex-col sm:flex-row justify-center gap-4 pb-safe-bottom z-[100] sticky bottom-4 sm:relative sm:bottom-auto px-4">
        
        {/* Edit Profile */}
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onEditProfile(); }}
          className="group flex-1 sm:flex-none items-center justify-center gap-3 px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 hover:border-paggie-cyan transition-all duration-300 shadow-lg active:scale-95 cursor-pointer backdrop-blur-md"
        >
           <svg className="w-5 h-5 text-paggie-cyan transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
           <span className="text-xs font-bold uppercase tracking-widest text-white">Editar Perfil</span>
        </button>

        {/* Logout */}
        <button 
          type="button"
          onClick={(e) => { e.stopPropagation(); onLogout(); }}
          className="group flex-1 sm:flex-none items-center justify-center gap-3 px-6 py-3 rounded-full bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 hover:border-red-500 transition-all duration-300 shadow-lg active:scale-95 cursor-pointer backdrop-blur-md"
        >
           <svg className="w-5 h-5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
           <span className="text-xs font-bold uppercase tracking-widest">Sair</span>
        </button>

      </div>

    </div>
  );
};

const DashboardCard = ({ onClick, icon, title, desc, color, cta }: any) => {
    const colorMap: Record<string, string> = {
        'paggie-cyan': '#00AEEF',
        'emerald-500': '#10B981',
        'violet-500': '#8B5CF6',
        'amber-500': '#F59E0B',
        'rose-500': '#F43F5E',
        'indigo-500': '#6366f1'
    };
    const hex = colorMap[color] || '#cbd5e1';

    return (
        <button 
          onClick={onClick}
          className="group relative flex flex-col p-6 sm:p-5 h-full min-h-[160px] bg-slate-900 border border-slate-800 rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl overflow-hidden text-left w-full active:scale-98"
          style={{ '--card-color': hex } as React.CSSProperties}
        >
          <div className="absolute inset-0 bg-[var(--card-color)] opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--card-color)] blur-[80px] opacity-0 group-hover:opacity-20 transition-opacity rounded-full pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="mb-4">
                <div 
                    className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center transition-all duration-300 shadow-lg group-hover:scale-110 group-hover:rotate-3 text-white"
                    style={{ color: hex, borderColor: `color-mix(in srgb, ${hex} 30%, transparent)` }}
                >
                    {icon}
                </div>
            </div>
            
            <h3 className="text-lg sm:text-base font-bold text-white mb-1">{title}</h3>
            <p className="text-sm sm:text-xs text-slate-500 group-hover:text-slate-400 leading-relaxed mb-4 flex-grow">
              {desc}
            </p>

            <div 
                className="mt-auto flex items-center gap-2 text-[10px] sm:text-[9px] font-bold uppercase tracking-wider transition-colors"
                style={{ color: hex }}
            >
              <span>{cta}</span>
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 w-full h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" style={{ backgroundColor: hex }}></div>
        </button>
    );
}
