
import React, { useEffect, useState } from 'react';
import { TrainingPlanData, TrainerProfile } from '../types';

interface Props {
  trainer: TrainerProfile;
  plan: TrainingPlanData;
  onBack: () => void;
  onHome: () => void;
  onSwitchToAssessment: () => void;
  hasAssessmentData: boolean;
}

export const TrainingReportPreview: React.FC<Props> = ({ trainer, plan, onBack, onHome, onSwitchToAssessment, hasAssessmentData }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    return () => {
      document.title = originalTitle;
    };
  }, []);

  // Image download removed as requested


  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    const rawName = plan.studentName || "Aluno";
    const safeName = rawName.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s-_]/g, "").trim().replace(/\s+/g, "_");
    const dateStr = new Date().toISOString().split('T')[0];
    const filename = `Paggie_Treino_${safeName}_${dateStr}.pdf`;

    try {
      const { exportReport } = await import('../utils/export');
      const result = await exportReport({
        elementId: 'training-report-content',
        filename,
        type: 'pdf'
      });

      if (!result.success) {
        alert(result.error || "Erro ao gerar PDF.");
      }
    } catch (error) {
      console.error("PDF generation failed", error);
      alert("Erro ao gerar PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 overflow-y-auto z-50">

      {/* TOOLBAR */}
      <div className="fixed top-0 left-0 right-0 p-2 sm:p-3 flex flex-col bg-slate-900/95 backdrop-blur-md border-b border-slate-800 no-print z-50 shadow-lg">
        <div className="flex flex-row justify-between items-center mb-2 max-w-7xl mx-auto w-full">
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
              className="text-black px-6 py-2 rounded-full font-bold text-xs disabled:opacity-80 active:scale-95 flex items-center gap-1 opacity-90 hover:opacity-100"
              style={{ backgroundColor: trainer.primaryColor, color: '#fff' }}
            >
              {isGenerating ? <span className="animate-spin">C</span> : <span>Compartilhar</span>}
            </button>
          </div>
        </div>

        <div className="flex justify-center px-4 pb-1">
          <div className="bg-slate-800 p-1 rounded-lg flex items-center gap-1">
            <button
              onClick={onSwitchToAssessment}
              className="px-4 py-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 text-xs font-medium transition-all flex items-center gap-2"
            >
              Avaliação
              {hasAssessmentData ? (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              ) : (
                <span className="text-[9px] opacity-50">+</span>
              )}
            </button>
            <button
              className="px-4 py-1.5 rounded-md text-white text-xs font-bold shadow-sm cursor-default"
              style={{ backgroundColor: trainer.primaryColor }}
            >
              Treino
            </button>
          </div>
        </div>
      </div>

      <div className="mt-28 sm:mt-32 mb-10 w-full flex justify-center px-0">
        <div id="training-report-content" className="w-full max-w-[210mm] bg-white min-h-[297mm] text-slate-800 shadow-none md:shadow-2xl rounded-none md:rounded-sm relative overflow-hidden flex flex-col font-sans mx-auto">

          {/* HEADER */}
          <header className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-center md:items-end bg-slate-50 border-b gap-6 md:gap-0" style={{ borderBottomWidth: '4px', borderBottomColor: trainer.primaryColor }}>
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 text-center md:text-left">
              {trainer.logoUrl && (
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden p-1 shrink-0 flex items-center justify-center">
                  <img src={trainer.logoUrl} className="max-w-full max-h-full object-contain" alt="Logo" />
                </div>
              )}
              <div>
                <h1 className="text-xl md:text-3xl font-black uppercase tracking-tighter leading-none text-slate-900 break-words max-w-[250px] md:max-w-none">{trainer.name}</h1>
                <div
                  className="inline-block text-white text-[9px] md:text-[10px] font-bold px-2 py-0.5 uppercase tracking-[0.2em] mt-2 rounded-sm"
                  style={{ backgroundColor: trainer.secondaryColor }}
                >
                  Planilha de Treinamento
                </div>
              </div>
            </div>
            <div className="text-center md:text-right w-full md:w-auto border-t md:border-0 border-slate-200 pt-4 md:pt-0">
              <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Periodização</div>
              <div className="text-base md:text-lg font-bold text-slate-900">{plan.splitType} • {plan.durationWeeks} Semanas</div>
            </div>
          </header>

          {/* Info Strip */}
          <div className="bg-slate-900 text-white px-6 py-4 flex flex-col md:flex-row gap-3 md:justify-between items-center text-xs md:text-sm">
            <div className="flex flex-col sm:flex-row gap-1 sm:gap-6 text-center sm:text-left">
              <span><span className="text-slate-500 uppercase text-[10px] font-bold mr-2">Aluno</span> {plan.studentName}</span>
              <span><span className="text-slate-500 uppercase text-[10px] font-bold mr-2">Objetivo</span> {plan.goal}</span>
            </div>
            <div>
              <span><span className="text-slate-500 uppercase text-[10px] font-bold mr-2">Início</span> {new Date(plan.startDate).toLocaleDateString('pt-BR')}</span>
            </div>
          </div>

          <main className="p-4 md:p-8 space-y-6">

            {plan.frequencyComments && (
              <div
                className="p-4 rounded-lg flex items-start gap-3 border"
                style={{
                  backgroundColor: `${trainer.primaryColor}0d`,
                  borderColor: `${trainer.primaryColor}30`
                }}
              >
                <span className="text-xl">💡</span>
                <div>
                  <h4
                    className="text-xs font-bold uppercase mb-1"
                    style={{ color: trainer.secondaryColor }}
                  >
                    Recomendações
                  </h4>
                  <p className="text-sm text-slate-800 leading-snug">{plan.frequencyComments}</p>
                </div>
              </div>
            )}

            {plan.workouts.map((workout, idx) => (
              <section key={workout.id} className="break-inside-avoid mb-6">
                <div className="flex items-center justify-between mb-2 border-b-2 border-slate-800 pb-2">
                  <div className="flex items-center gap-3">
                    <span
                      className="text-white w-8 h-8 flex items-center justify-center rounded font-black text-lg"
                      style={{ backgroundColor: trainer.primaryColor }}
                    >
                      {workout.letter}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 uppercase leading-none">{workout.name}</h3>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                        {workout.days.length > 0 ? workout.days.join(' • ') : 'Dias flexíveis'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* RESPONSIVE TABLE/CARD CONTAINER */}
                <div className="border border-slate-200 rounded-lg overflow-hidden w-full">
                  <table className="w-full table-auto md:table-fixed">
                    <thead className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider border-b border-slate-200 hidden md:table-header-group">
                      <tr>
                        <th className="py-2 px-3 text-left w-[40%]">Exercício</th>
                        <th className="py-2 px-2 text-center w-[15%]">Séries</th>
                        <th className="py-2 px-2 text-center w-[15%]">Reps</th>
                        <th className="py-2 px-2 text-center w-[15%]">Descanso</th>
                        <th className="py-2 px-3 text-left w-[15%]">Obs</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-200">
                      {workout.exercises.map((ex, i) => (
                        <tr key={i} className={`flex flex-col md:table-row p-3 md:p-0 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                          <td className="py-1 md:py-3 px-0 md:px-3 font-bold text-slate-800 text-base md:text-sm align-middle w-full md:w-auto">
                            {ex.name}
                          </td>

                          {/* Desktop View */}
                          <td className="hidden md:table-cell py-3 px-2 text-center font-mono text-slate-600 text-sm align-middle">{ex.sets}</td>
                          <td className="hidden md:table-cell py-3 px-2 text-center font-mono text-slate-600 text-sm align-middle">{ex.reps}</td>
                          <td className="hidden md:table-cell py-3 px-2 text-center font-mono text-slate-500 text-xs align-middle">{ex.rest}</td>
                          <td className="hidden md:table-cell py-3 px-3 text-xs text-slate-500 italic align-middle truncate">{ex.technique}</td>

                          {/* Mobile View - Card-like */}
                          <td className="md:hidden block py-1 px-0 w-full" colSpan={4}>
                            <div className="flex gap-2 text-xs text-slate-600 font-mono mt-1 mb-1">
                              <span className="bg-slate-200/60 px-2 py-1 rounded font-bold text-slate-700">S: {ex.sets}</span>
                              <span className="bg-slate-200/60 px-2 py-1 rounded font-bold text-slate-700">R: {ex.reps}</span>
                              <span className="bg-slate-200/60 px-2 py-1 rounded text-slate-500">{ex.rest}</span>
                            </div>
                            {ex.technique && <div className="text-xs text-slate-500 italic pl-1 border-l-2 border-slate-300">{ex.technique}</div>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {workout.notes && (
                  <div className="mt-2 text-xs text-slate-500 bg-slate-50 p-2 rounded border border-slate-100 italic">
                    <span className="font-bold not-italic mr-1">Nota:</span> {workout.notes}
                  </div>
                )}
              </section>
            ))}

            <section className="pt-8 pb-4 break-inside-avoid">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6 md:gap-0">
                <div className="w-full md:w-1/2 text-center md:text-left">
                  <div className="border-t-2 border-slate-900 pt-2 w-48 mx-auto md:mx-0"></div>
                  <p className="font-bold text-slate-900 uppercase tracking-wide text-sm">{trainer.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Personal Trainer</p>
                </div>
                <div className="text-center md:text-right w-full md:w-auto">
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest">Gerado via Paggie Trainer</p>
                </div>
              </div>
            </section>

          </main>
        </div>
      </div>
    </div>
  );
}
