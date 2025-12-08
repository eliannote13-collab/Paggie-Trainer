
import React, { useState, useEffect } from 'react';
import { PhysicalAssessmentData, TrainerProfile } from '../types';

interface Props {
  trainer: TrainerProfile;
  data: PhysicalAssessmentData;
  onBack: () => void;
  onHome: () => void;
}

export const PhysicalAssessmentReport: React.FC<Props> = ({ trainer, data, onBack, onHome }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    return () => { document.title = originalTitle; };
  }, []);

  const getSafeFilename = (ext: string) => {
    const rawName = data.studentName || "Aluno";
    const safeName = rawName.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s-_]/g, "").trim().replace(/\s+/g, "_");
    const dateStr = new Date().toISOString().split('T')[0];
    return `Testes_Fisicos_${safeName}_${dateStr}.${ext}`;
  };

  // Image download removed as requested


  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const { exportReport } = await import('../utils/export');
      const result = await exportReport({
        elementId: 'physical-report-content',
        filename: getSafeFilename('pdf'),
        type: 'pdf'
      });

      if (!result.success) {
        alert(result.error || "Erro ao gerar PDF.");
      }
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  const ResultRow = ({ label, value, unit }: { label: string, value: string, unit?: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
      <span className="text-xs font-bold text-slate-500 uppercase">{label}</span>
      <span className="text-sm font-bold text-slate-800">{value || '-'} <span className="text-[10px] text-slate-400 font-medium">{unit}</span></span>
    </div>
  );

  const PostureItem = ({ label, value }: { label: string, value: string }) => (
    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
      <span className="block text-[9px] font-bold text-slate-400 uppercase mb-1">{label}</span>
      <span className="block text-sm font-medium text-slate-800">{value || 'Normal'}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-950 overflow-y-auto z-50 print:bg-white print:overflow-visible print:inset-auto print:static">
      <style>{`
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          * {
            box-sizing: border-box;
          }
          html, body {
            height: auto !important;
            min-height: 0 !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: visible !important;
          }
          section, div, header, footer {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          header, .header {
            margin-top: 0 !important;
            padding-top: 10px !important;
          }
          header + * {
            margin-top: 0 !important;
            padding-top: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-full-width {
            width: 100% !important;
            max-width: none !important;
          }
          /* Ensure text is standard for print */
          body {
            font-size: 12pt;
          }
        }
      `}</style>

      {/* TOOLBAR */}
      <div className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-lg no-print">
        <div className="flex flex-row justify-between items-center p-2 sm:p-3 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <button onClick={onBack} disabled={isGenerating} className="text-slate-400 hover:text-white flex items-center gap-1 font-medium text-xs transition-colors bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/50">
              <span>←</span> <span className="hidden sm:inline">Editar</span>
            </button>
            <button onClick={onHome} disabled={isGenerating} className="text-paggie-cyan hover:bg-paggie-cyan/10 flex items-center gap-1 font-medium text-xs transition-colors px-3 py-2 rounded-lg border border-transparent hover:border-paggie-cyan/30">
              <span className="hidden sm:inline">Menu</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="text-white px-6 py-2 rounded-full font-bold text-xs shadow-sm active:scale-95 flex items-center gap-1 opacity-90 hover:opacity-100"
              style={{ backgroundColor: trainer.primaryColor }}
            >
              {isGenerating ? <span className="animate-spin">C</span> : <span>Compartilhar</span>}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-20 sm:mt-28 mb-10 w-full flex justify-center px-0 print:mt-0 print:mb-0 print:p-0">
        <div id="physical-report-content" className="w-full max-w-[210mm] bg-white text-slate-800 shadow-none md:shadow-2xl relative flex flex-col font-sans mx-auto print:shadow-none print:w-full print:max-w-none print:min-h-0 print:h-auto print-full-width">

          {/* HEADER */}
          <header className="p-6 sm:p-8 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left border-b-4 print:p-4 break-inside-avoid" style={{ borderColor: trainer.primaryColor }}>
            <div className="flex flex-col md:flex-row items-center gap-4">
              {trainer.logoUrl && (
                <div className="w-16 h-16 object-contain flex items-center justify-center">
                  <img src={trainer.logoUrl} className="max-w-full max-h-full" alt="Logo" />
                </div>
              )}
              <div>
                <h1 className="text-lg sm:text-xl font-black uppercase text-slate-900 leading-tight">{trainer.name}</h1>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Relatório de Performance Atlética</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-xl sm:text-2xl font-black uppercase text-slate-300">Testes Físicos</div>
              <div className="text-xs font-bold text-slate-600">{new Date(data.date).toLocaleDateString('pt-BR')}</div>
            </div>
          </header>

          {/* INFO STRIP */}
          <div className="bg-slate-900 text-white px-6 py-3 flex justify-center md:justify-start gap-6 text-xs print:px-6 print:py-2 break-inside-avoid">
            <span><span className="text-slate-500 uppercase font-bold mr-1">Aluno</span> {data.studentName}</span>
            <span><span className="text-slate-500 uppercase font-bold mr-1">Idade</span> {data.age} anos</span>
            <span><span className="text-slate-500 uppercase font-bold mr-1">Gênero</span> {data.gender}</span>
          </div>

          <main className="p-6 sm:p-8 space-y-6 flex-grow print:p-4 print:space-y-4">

            {/* 1. CARDIO */}
            <section className="break-inside-avoid page-break-inside-avoid">
              <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                <span className="text-white text-xs font-bold px-2 py-1 rounded bg-rose-500 print:bg-rose-500 print:text-white">01</span>
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wide">Capacidade Cardiorrespiratória</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 print:gap-4">
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-center break-inside-avoid print:border-slate-300">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">VO2 Máximo</span>
                  <span className="text-xl font-black text-rose-600 block">{data.vo2Max || '-'}</span>
                  <span className="text-[10px] text-slate-500 block">ml/kg/min</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-center break-inside-avoid print:border-slate-300">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">Teste de Cooper</span>
                  <span className="text-xl font-black text-rose-600 block">{data.testCooper || '-'}</span>
                  <span className="text-[10px] text-slate-500 block">Metros (12min)</span>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm text-center break-inside-avoid print:border-slate-300">
                  <span className="text-[9px] text-slate-400 font-bold uppercase block mb-1">FC Repouso</span>
                  <span className="text-xl font-black text-rose-600 block">{data.restingHR || '-'}</span>
                  <span className="text-[10px] text-slate-500 block">bpm</span>
                </div>
              </div>
            </section>

            {/* 2. FORÇA & FLEXIBILIDADE */}
            <section className="break-inside-avoid page-break-inside-avoid">
              <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                <span className="text-white text-xs font-bold px-2 py-1 rounded bg-rose-500 print:bg-rose-500 print:text-white">02</span>
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wide">Resistência Muscular e Flexibilidade</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:gap-6">
                <div className="bg-slate-50 rounded-xl p-4 break-inside-avoid print:bg-slate-50">
                  <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-2">Teste de Força (1 Minuto)</h4>
                  <div className="space-y-0.5">
                    <ResultRow label="Flexão de Braço" value={data.pushUpTest} unit="reps" />
                    <ResultRow label="Abdominal Remador" value={data.sitUpTest} unit="reps" />
                    <ResultRow label="Agachamento Livre" value={data.squatTest} unit="reps" />
                    <ResultRow label="Prancha Isométrica" value={data.plankTest} unit="tempo" />
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="bg-slate-50 rounded-xl p-4 flex-1 flex flex-col justify-center items-center text-center break-inside-avoid print:bg-slate-50">
                    <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-2">Flexibilidade (Banco de Wells)</h4>
                    <div className="text-3xl font-black text-slate-800">{data.sitAndReach || '-'} <span className="text-base text-slate-400">cm</span></div>
                  </div>
                </div>
              </div>
            </section>

            {/* 3. POSTURAL */}
            <section className="break-inside-avoid page-break-inside-avoid">
              <div className="flex items-center gap-2 mb-3 border-b border-slate-100 pb-2">
                <span className="text-white text-xs font-bold px-2 py-1 rounded bg-rose-500 print:bg-rose-500 print:text-white">03</span>
                <h3 className="text-sm font-black uppercase text-slate-800 tracking-wide">Análise Postural Estática</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <PostureItem label="Cabeça / Cervical" value={data.postureHead} />
                <PostureItem label="Ombros / Escápulas" value={data.postureShoulders} />
                <PostureItem label="Coluna Vertebral" value={data.postureSpine} />
                <PostureItem label="Pelve / Quadril" value={data.postureHips} />
                <PostureItem label="Joelhos" value={data.postureKnees} />
                <PostureItem label="Pés / Tornozelos" value={data.postureFeet} />
              </div>
            </section>

            {/* 4. CONSIDERATIONS */}
            {data.considerations && (
              <div className="bg-rose-50 rounded-xl p-5 border border-rose-100 break-inside-avoid print:bg-rose-50">
                <h4 className="text-[10px] font-black uppercase text-rose-400 mb-2 tracking-widest">Parecer Técnico</h4>
                <p className="text-sm text-slate-700 leading-relaxed font-medium text-justify">{data.considerations}</p>
              </div>
            )}

            {/* FOOTER */}
            <div className="flex flex-col sm:flex-row gap-8 mt-auto pt-6 break-inside-avoid page-break-inside-avoid">
              <div className="flex-1 text-center">
                <div className="border-b-2 border-slate-900 mb-2 h-8 w-3/4 mx-auto opacity-10"></div>
                <span className="text-xs font-bold uppercase block">{data.studentName}</span>
                <span className="block text-[8px] text-slate-400 uppercase">Atleta / Aluno</span>
              </div>
              <div className="flex-1 text-center">
                <div className="border-b-2 border-slate-900 mb-2 h-8 w-3/4 mx-auto"></div>
                <span className="text-xs font-bold uppercase block">{trainer.name}</span>
                <span className="block text-[8px] text-slate-400 uppercase">Avaliador Responsável</span>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};

