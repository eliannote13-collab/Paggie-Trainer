import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { LibraryItem, Exercise } from '../types';
import { Button } from './ui/Button';

interface Props {
  onBack: () => void;
  onImport: (exercises: Exercise[]) => void;
}

const EXERCISE_DB: LibraryItem[] = [
  // PEITO
  { id: 'p1', category: 'Peito', name: 'Supino Reto (Barra)' },
  { id: 'p2', category: 'Peito', name: 'Supino Inclinado (Halter)' },
  { id: 'p3', category: 'Peito', name: 'Crucifixo Máquina' },
  { id: 'p4', category: 'Peito', name: 'Crossover Polia Alta' },
  { id: 'p5', category: 'Peito', name: 'Flexão de Braços' },
  { id: 'p6', category: 'Peito', name: 'Supino Vertical (Máquina)' },
  { id: 'p7', category: 'Peito', name: 'Peck Deck (Voador)' },
  { id: 'p8', category: 'Peito', name: 'Supino Declinado' },
  { id: 'p9', category: 'Peito', name: 'Pullover com Halter' },
  // COSTAS
  { id: 'c1', category: 'Costas', name: 'Puxada Alta (Frente)' },
  { id: 'c2', category: 'Costas', name: 'Remada Curvada (Barra)' },
  { id: 'c3', category: 'Costas', name: 'Remada Baixa (Triângulo)' },
  { id: 'c4', category: 'Costas', name: 'Pulldown Corda' },
  { id: 'c5', category: 'Costas', name: 'Barra Fixa' },
  { id: 'c6', category: 'Costas', name: 'Remada Unilateral (Serrote)' },
  { id: 'c7', category: 'Costas', name: 'Levantamento Terra' },
  { id: 'c8', category: 'Costas', name: 'Remada Cavalinho' },
  { id: 'c9', category: 'Costas', name: 'Puxada Triângulo' },
  // PERNAS
  { id: 'l1', category: 'Pernas', name: 'Agachamento Livre' },
  { id: 'l2', category: 'Pernas', name: 'Leg Press 45' },
  { id: 'l3', category: 'Pernas', name: 'Cadeira Extensora' },
  { id: 'l4', category: 'Pernas', name: 'Mesa Flexora' },
  { id: 'l5', category: 'Pernas', name: 'Stiff (Halter)' },
  { id: 'l6', category: 'Pernas', name: 'Elevação Pélvica' },
  { id: 'l7', category: 'Pernas', name: 'Afundo / Passada' },
  { id: 'l8', category: 'Pernas', name: 'Agachamento Búlgaro' },
  { id: 'l9', category: 'Pernas', name: 'Panturrilha em Pé' },
  { id: 'l10', category: 'Pernas', name: 'Panturrilha Sentado' },
  { id: 'l11', category: 'Pernas', name: 'Hack Machine' },
  { id: 'l12', category: 'Pernas', name: 'Agachamento Sumô' },
  // OMBROS
  { id: 'o1', category: 'Ombros', name: 'Desenvolvimento Militar' },
  { id: 'o2', category: 'Ombros', name: 'Elevação Lateral' },
  { id: 'o3', category: 'Ombros', name: 'Elevação Frontal' },
  { id: 'o4', category: 'Ombros', name: 'Facepull' },
  { id: 'o5', category: 'Ombros', name: 'Crucifixo Inverso' },
  { id: 'o6', category: 'Ombros', name: 'Remada Alta' },
  { id: 'o7', category: 'Ombros', name: 'Desenvolvimento Arnold' },
  // BRAÇOS
  { id: 'b1', category: 'Braços', name: 'Rosca Direta (Barra)' },
  { id: 'b2', category: 'Braços', name: 'Rosca Martelo' },
  { id: 'b3', category: 'Braços', name: 'Rosca Scott' },
  { id: 'b4', category: 'Braços', name: 'Tríceps Corda' },
  { id: 'b5', category: 'Braços', name: 'Tríceps Testa' },
  { id: 'b6', category: 'Braços', name: 'Tríceps Francês' },
  { id: 'b7', category: 'Braços', name: 'Mergulho (Banco/Paralela)' },
  { id: 'b8', category: 'Braços', name: 'Rosca Concentrada' },
  { id: 'b9', category: 'Braços', name: 'Tríceps Coice' },
  // ABDOMEN
  { id: 'a1', category: 'Abdômen', name: 'Prancha Isométrica' },
  { id: 'a2', category: 'Abdômen', name: 'Abdominal Supra' },
  { id: 'a3', category: 'Abdômen', name: 'Infra (Elevação de Pernas)' },
  { id: 'a4', category: 'Abdômen', name: 'Abdominal Remador' },
  { id: 'a5', category: 'Abdômen', name: 'Russian Twist' },
];

const CATEGORIES = Array.from(new Set(EXERCISE_DB.map(i => i.category)));
const BATCH_SIZE = 24;

export const ExerciseLibrary: React.FC<Props> = ({ onBack, onImport }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<LibraryItem[]>([]);

  const [batchSets, setBatchSets] = useState('3');
  const [batchReps, setBatchReps] = useState('10-12');
  const [batchRest, setBatchRest] = useState('60s');

  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const loaderRef = useRef<HTMLDivElement>(null);

  const filteredExercises = useMemo(() => {
    return EXERCISE_DB.filter(ex => {
      const matchesCategory = selectedCategory === 'Todos' || ex.category === selectedCategory;
      const matchesSearch = ex.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
    const grid = document.getElementById('exercise-grid-container');
    if (grid) grid.scrollTop = 0;
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    if (visibleCount < BATCH_SIZE) setVisibleCount(BATCH_SIZE);

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisibleCount((prev) => prev + BATCH_SIZE);
      },
      { root: null, rootMargin: '200px', threshold: 0.1 }
    );

    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => { if (loaderRef.current) observer.unobserve(loaderRef.current); };
  }, [filteredExercises]);

  const toggleSelection = useCallback((item: LibraryItem) => {
    setSelectedItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      return exists ? prev.filter(i => i.id !== item.id) : [...prev, item];
    });
  }, []);

  const handleImport = () => {
    if (selectedItems.length === 0) return;
    const exercises: Exercise[] = selectedItems.map(item => ({
      id: Math.random().toString(36).substr(2, 9),
      name: item.name,
      sets: batchSets,
      reps: batchReps,
      rest: batchRest,
      technique: ''
    }));
    onImport(exercises);
    setSelectedItems([]);
  };

  const displayedExercises = filteredExercises.slice(0, visibleCount);

  return (
    <div className="animate-fade-in w-full h-full flex flex-col md:flex-row bg-slate-950 text-white fixed inset-0 z-50">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex w-72 flex-col gap-2 shrink-0 p-6 border-r border-slate-800 bg-slate-900 z-10 shadow-xl">
        <div className="mb-6">
          <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
            <span className="text-paggie-cyan text-2xl">📚</span> Biblioteca
          </h2>
          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Selecione para importar</p>
        </div>

        <button onClick={() => setSelectedCategory('Todos')} className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border ${selectedCategory === 'Todos' ? 'bg-paggie-cyan/10 border-paggie-cyan text-paggie-cyan shadow-[0_0_15px_rgba(0,174,239,0.2)]' : 'bg-slate-800 border-transparent text-slate-400 hover:bg-slate-800/80 hover:text-white'}`}>Todos</button>
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-2 pr-1">
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`text-left px-4 py-3 rounded-xl text-sm font-bold transition-all border flex justify-between items-center ${selectedCategory === cat ? 'bg-paggie-cyan/10 border-paggie-cyan text-paggie-cyan shadow-[0_0_15px_rgba(0,174,239,0.2)]' : 'bg-slate-800 border-transparent text-slate-400 hover:bg-slate-800/80 hover:text-white'}`}>
              {cat}
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${selectedCategory === cat ? 'bg-paggie-cyan text-black' : 'bg-slate-950 text-slate-600'}`}>{EXERCISE_DB.filter(e => e.category === cat).length}</span>
            </button>
          ))}
        </div>
        <Button variant="secondary" onClick={onBack} className="mt-4 w-full justify-center">Voltar</Button>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden relative bg-slate-950">

        {/* MOBILE HEADER & SEARCH */}
        <div className="shrink-0 p-4 border-b border-slate-800 bg-slate-900/95 backdrop-blur-xl z-30 shadow-lg">
          <div className="flex gap-3 items-center w-full mb-4 md:mb-0">
            <button
              onClick={onBack}
              className="md:hidden w-10 h-10 flex items-center justify-center bg-slate-800 rounded-xl text-slate-400 hover:text-white active:scale-95 transition-all border border-slate-700 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <div className="relative flex-1 group">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-paggie-cyan transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Buscar exercício..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-3 text-white text-base focus:outline-none focus:border-paggie-cyan focus:ring-1 focus:ring-paggie-cyan transition-all placeholder-slate-600 shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white bg-slate-800 rounded-full p-0.5"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg></button>}
            </div>
          </div>

          {/* MOBILE CATEGORY TABS */}
          <div className="md:hidden w-full overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4 mask-linear-fade">
            <div className="flex gap-2 min-w-max">
              <button onClick={() => setSelectedCategory('Todos')} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${selectedCategory === 'Todos' ? 'bg-paggie-cyan text-black border-paggie-cyan shadow-[0_0_15px_rgba(0,174,239,0.3)]' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>Todos</button>
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${selectedCategory === cat ? 'bg-paggie-cyan text-black border-paggie-cyan shadow-[0_0_15px_rgba(0,174,239,0.3)]' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>{cat}</button>
              ))}
            </div>
          </div>
        </div>

        {/* EXERCISE GRID */}
        <div id="exercise-grid-container" className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-950 relative pb-48 sm:pb-32">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {displayedExercises.map(item => {
              const isSelected = !!selectedItems.find(i => i.id === item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleSelection(item)}
                  className={`cursor-pointer p-4 rounded-2xl border-2 transition-all duration-200 group relative select-none flex items-center justify-between min-h-[90px] active:scale-[0.98] ${isSelected ? 'bg-paggie-cyan/5 border-paggie-cyan shadow-[inset_0_0_20px_rgba(0,174,239,0.1)]' : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-800'}`}
                >
                  <div className="flex flex-col gap-1.5 overflow-hidden pr-4">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isSelected ? 'text-paggie-cyan' : 'text-slate-500 group-hover:text-slate-400'}`}>{item.category}</span>
                    <h3 className={`font-bold text-sm sm:text-base leading-tight ${isSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'}`}>{item.name}</h3>
                  </div>
                  <div className={`w-7 h-7 shrink-0 rounded-full border-2 flex items-center justify-center transition-all shadow-sm ${isSelected ? 'bg-paggie-cyan border-paggie-cyan scale-110 shadow-[0_0_10px_rgba(0,174,239,0.4)]' : 'border-slate-700 bg-slate-900 group-hover:border-slate-500'}`}>
                    {isSelected && <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>}
                  </div>
                </div>
              );
            })}
            {displayedExercises.length === 0 && (
              <div className="col-span-full py-24 text-center text-slate-500 flex flex-col items-center">
                <span className="text-4xl mb-4 opacity-50">🔍</span>
                <p className="text-base font-bold text-slate-400">Nenhum exercício encontrado</p>
                <p className="text-xs mt-2 opacity-50">Tente buscar por outro termo</p>
              </div>
            )}
            {/* Loader Sentinel */}
            <div ref={loaderRef} className="h-4 w-full col-span-full"></div>
          </div>
        </div>

        {/* BOTTOM ACTION BAR (Refined) */}
        <div className={`fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-paggie-cyan/20 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-50 transition-transform duration-300 ${selectedItems.length > 0 ? 'translate-y-0' : 'translate-y-full'}`}>
          <div className="max-w-7xl mx-auto p-4 flex flex-col sm:flex-row gap-4 sm:items-center justify-between pb-[calc(1rem+env(safe-area-inset-bottom))]">

            {/* Config Inputs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto scrollbar-hide mask-linear-fade">
              <span className="text-[10px] uppercase font-black text-slate-500 whitespace-nowrap mr-2">Valores Padrão:</span>
              {[
                { l: 'SETS', v: batchSets, s: setBatchSets, w: 'w-12' },
                { l: 'REPS', v: batchReps, s: setBatchReps, w: 'w-16' },
                { l: 'REST', v: batchRest, s: setBatchRest, w: 'w-14' }
              ].map((c, i) => (
                <div key={i} className="flex flex-col bg-slate-950 rounded-lg border border-slate-700 px-3 py-1.5 relative group focus-within:border-paggie-cyan focus-within:ring-1 focus-within:ring-paggie-cyan transition-all">
                  <span className="text-[8px] uppercase text-slate-500 font-bold absolute -top-1.5 left-2 bg-slate-900 px-1">{c.l}</span>
                  <input value={c.v} onChange={(e) => c.s(e.target.value)} className={`bg-transparent text-white text-sm font-mono font-bold text-center focus:outline-none appearance-none ${c.w}`} />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 flex items-center gap-2 min-w-[100px] justify-center">
                <span className="font-black text-paggie-cyan text-xl leading-none">{selectedItems.length}</span>
                <span className="text-[9px] uppercase font-bold text-slate-500 leading-tight">Itens<br />Selec.</span>
              </div>

              <button onClick={handleImport} className="flex-1 sm:flex-none bg-gradient-to-r from-paggie-cyan to-paggie-blue text-white px-8 py-3.5 rounded-xl font-black uppercase tracking-wide text-sm shadow-[0_0_20px_rgba(0,174,239,0.3)] hover:shadow-[0_0_30px_rgba(0,174,239,0.5)] active:scale-95 transition-all flex items-center justify-center gap-2">
                <span>Importar</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
