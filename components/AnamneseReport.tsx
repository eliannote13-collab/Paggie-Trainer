
import React, { useState, useEffect } from 'react';
import { AnamneseData, TrainerProfile } from '../types';

interface Props {
  trainer: TrainerProfile;
  data: AnamneseData;
  onBack: () => void;
  onHome: () => void;
}

export const AnamneseReport: React.FC<Props> = ({ trainer, data, onBack, onHome }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const originalTitle = document.title;
    return () => { document.title = originalTitle; };
  }, []);

  const getSafeFilename = (ext: string) => {
    const rawName = data.studentName || "Paciente";
    const safeName = rawName.toString().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9\s-_]/g, "").trim().replace(/\s+/g, "_");
    const dateStr = new Date().toISOString().split('T')[0];
    return `Prontuario_${safeName}_${dateStr}.${ext}`;
  };

  // Image download removed as requested


  const handleDownloadPDF = async () => {
    setIsGenerating(true);
    try {
      const { exportReport } = await import('../utils/export');
      const result = await exportReport({
        elementId: 'anamnese-content',
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

  const SectionHeader = ({ num, title }: { num: string, title: string }) => (
    <div className="flex items-center gap-2 mb-3 mt-6 border-b pb-1" style={{ borderColor: `${trainer.primaryColor}30` }}>
      <span className="text-xs font-black uppercase px-2 py-0.5 rounded text-white" style={{ backgroundColor: trainer.primaryColor }}>{num}</span>
      <h3 className="text-sm font-bold uppercase text-slate-800">{title}</h3>
    </div>
  );

  const Field = ({ label, value }: { label: string, value: string }) => (
    <div className="mb-3 w-full">
      <span className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">{label}</span>
      <span className="text-sm font-medium text-slate-900 border-b border-dotted border-slate-300 block w-full pb-0.5 min-h-[20px] leading-relaxed break-words">{value || '-'}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-slate-950 overflow-y-auto z-50">

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

      <div className="mt-20 sm:mt-28 mb-10 w-full flex justify-center px-0">
        <div id="anamnese-content" className="w-full max-w-[210mm] bg-white min-h-[297mm] text-slate-800 shadow-none md:shadow-2xl relative flex flex-col font-sans mx-auto">

          {/* HEADER - Responsive Stack */}
          <header className="p-6 sm:p-8 border-b-4 flex flex-col md:flex-row justify-between items-center md:items-start gap-4 text-center md:text-left" style={{ borderColor: trainer.primaryColor }}>
            <div className="flex flex-col md:flex-row items-center gap-4">
              {trainer.logoUrl && (
                <div className="w-16 h-16 object-contain flex items-center justify-center">
                  <img src={trainer.logoUrl} className="max-w-full max-h-full" />
                </div>
              )}
              <div>
                <h1 className="text-lg sm:text-xl font-black uppercase text-slate-900 leading-tight">{trainer.name}</h1>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500">Prontuário de Avaliação e Anamnese</p>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-xl sm:text-2xl font-black text-slate-300">ANAMNESE</div>
              <div className="text-xs font-bold text-slate-600">{new Date(data.date).toLocaleDateString('pt-BR')}</div>
            </div>
          </header>

          <main className="p-6 sm:p-8 text-sm leading-snug">

            {/* I. IDENTIFICAÇÃO - Mobile Stack to Grid */}
            <SectionHeader num="I" title="Identificação e Dados Gerais" />
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
              <div className="sm:col-span-2"><Field label="Nome" value={data.studentName} /></div>
              <div><Field label="Idade" value={`${data.age} anos`} /></div>
              <div><Field label="Gênero" value={data.gender} /></div>
              <div><Field label="Data Nasc." value={data.birthDate} /></div>
              <div><Field label="Estado Civil" value={data.maritalStatus} /></div>
              <div className="sm:col-span-2"><Field label="Profissão" value={data.profession} /></div>
              <div className="sm:col-span-2"><Field label="Contatos" value={`${data.phone} | ${data.email}`} /></div>
              <div className="sm:col-span-2"><Field label="Endereço" value={data.address} /></div>
            </div>

            {/* II. QUEIXA PRINCIPAL */}
            <SectionHeader num="II" title="Queixa Principal (QP)" />
            <div className="bg-slate-50 p-4 rounded border border-slate-100 mb-4">
              <Field label="Descrição da Queixa" value={data.mainComplaint} />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <Field label="Duração" value={data.complaintDuration} />
                <Field label="Sintomas Acompanhantes" value={data.associatedSymptoms} />
              </div>
            </div>

            {/* III. HDA */}
            <SectionHeader num="III" title="História da Doença Atual (HDA)" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <Field label="Início" value={data.hdaOnset} />
              <Field label="Evolução" value={data.hdaEvolution} />
              <Field label="Fatores Melhora/Piora" value={data.hdaFactors} />
              <Field label="Intensidade" value={data.hdaIntensity} />
            </div>
            <Field label="Tratamentos Prévios" value={data.previousTreatments} />

            {/* IV, V, VI - Stack on Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
              <div>
                <SectionHeader num="IV" title="Antecedentes Pessoais" />
                <Field label="Doenças Crônicas" value={data.chronicDiseases} />
                <Field label="Cirurgias/Internações" value={`${data.surgeries} ${data.hospitalizations}`} />
                <Field label="Alergias" value={data.allergies} />
              </div>
              <div>
                <SectionHeader num="V" title="Medicamentos" />
                <Field label="Em uso" value={data.medications} />
                <Field label="Aderência" value={data.adherence} />
                <Field label="Suplementos" value={data.supplements} />
              </div>
            </div>

            <SectionHeader num="VI" title="Antecedentes Familiares" />
            <Field label="Histórico Familiar Relevante" value={data.familyHistory} />

            <div className="html2pdf__page-break"></div>

            {/* VII. HÁBITOS */}
            <SectionHeader num="VII" title="Hábitos de Vida" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
              <Field label="Tabagismo" value={data.smoking} />
              <Field label="Etilismo" value={data.alcohol} />
              <Field label="Atividade Física" value={data.physicalActivity} />
              <Field label="Sono" value={data.sleep} />
              <Field label="Estresse" value={data.stressLevel} />
              <Field label="Água" value={`${data.waterIntake} L`} />
            </div>
            <Field label="Alimentação" value={data.diet} />

            {/* VIII. SISTEMAS */}
            <SectionHeader num="VIII" title="Revisão por Sistemas" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4 text-xs">
              <div className="border-b border-slate-100 pb-1"><span className="font-bold uppercase text-slate-500 mr-2">Geral:</span> {data.systemGeneral || 'Nada digno de nota'}</div>
              <div className="border-b border-slate-100 pb-1"><span className="font-bold uppercase text-slate-500 mr-2">Respiratório:</span> {data.systemRespiratory || 'Nada digno de nota'}</div>
              <div className="border-b border-slate-100 pb-1"><span className="font-bold uppercase text-slate-500 mr-2">Cardiovascular:</span> {data.systemCardiovascular || 'Nada digno de nota'}</div>
              <div className="border-b border-slate-100 pb-1"><span className="font-bold uppercase text-slate-500 mr-2">Gastrointestinal:</span> {data.systemGastro || 'Nada digno de nota'}</div>
              <div className="border-b border-slate-100 pb-1"><span className="font-bold uppercase text-slate-500 mr-2">Neurológico:</span> {data.systemNeuro || 'Nada digno de nota'}</div>
              <div className="border-b border-slate-100 pb-1"><span className="font-bold uppercase text-slate-500 mr-2">Psíquico:</span> {data.systemPsych || 'Nada digno de nota'}</div>
            </div>

            {/* IX. EXAME FÍSICO */}
            <SectionHeader num="IX" title="Exame Físico Básico" />
            <div className="bg-slate-50 border border-slate-200 p-4 rounded mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                <Field label="PA (mmHg)" value={data.bp} />
                <Field label="FC (bpm)" value={data.hr} />
                <Field label="Peso (kg)" value={data.weight} />
                <Field label="Altura (m)" value={data.height} />
              </div>
              <div className="border-t border-slate-200 pt-3">
                <Field label="Inspeção Geral" value={data.generalInspection} />
              </div>
            </div>

            {/* X. PLANO */}
            <SectionHeader num="X" title="Considerações e Conduta" />
            <div className="border border-slate-200 p-4 rounded mb-8 min-h-[100px]">
              <Field label="Hipóteses Diagnósticas" value={data.diagnosisHypothesis} />
              <div className="mt-4"><Field label="Conduta Terapêutica (Plano)" value={data.therapeuticPlan} /></div>
              <div className="mt-4"><Field label="Exames Solicitados" value={data.requestedExams} /></div>
            </div>

            {/* ASSINATURAS */}
            <div className="flex flex-col sm:flex-row gap-10 mt-auto pt-8 break-inside-avoid">
              <div className="flex-1 text-center">
                <div className="border-b border-black mb-2 h-8 w-3/4 mx-auto"></div>
                <span className="text-xs font-bold uppercase">{data.studentName}</span>
                <span className="block text-[8px] text-slate-400 uppercase">Paciente / Aluno</span>
              </div>
              <div className="flex-1 text-center">
                <div className="border-b border-black mb-2 h-8 w-3/4 mx-auto"></div>
                <span className="text-xs font-bold uppercase">{trainer.name}</span>
                <span className="block text-[8px] text-slate-400 uppercase">Profissional Responsável</span>
              </div>
            </div>

          </main>
        </div>
      </div>
    </div>
  );
};
