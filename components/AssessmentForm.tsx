
import React, { useState } from 'react';
import { AssessmentData, BodyMetrics, PhysicalTests } from '../types';
import { Select, TextArea, Input as StandardInput } from './ui/Input';
import { Button } from './ui/Button';

// Utility for dual inputs (Before | After) - Mobile Optimized
const DualInput = ({ label, unit, val1, val2, onChange1, onChange2 }: any) => (
  <div className="mb-5 w-full">
    <div className="flex justify-between items-end mb-2 px-1">
      <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">{label}</label>
      {val2 && val1 ? (
        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${val2 > val1 ? 'bg-emerald-500/10 text-emerald-400' : val2 < val1 ? 'bg-blue-500/10 text-blue-400' : 'text-slate-500'}`}>
          {(val2 - val1) > 0 ? '+' : ''}{(val2 - val1).toFixed(1)} {unit}
        </span>
      ) : null}
    </div>
    <div className="flex flex-col sm:flex-row items-center gap-px bg-slate-800 rounded-lg border border-slate-700 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-paggie-cyan focus-within:border-transparent transition-all">
      <div className="relative flex-1 w-full border-b sm:border-b-0 border-slate-700">
        <input
          type="number"
          step="0.1"
          inputMode="decimal"
          className="w-full bg-slate-900/30 px-3 py-4 text-slate-400 text-base text-center focus:outline-none placeholder-slate-600 appearance-none"
          placeholder="Antes"
          value={val1 || ''}
          onChange={(e) => onChange1(parseFloat(e.target.value))}
        />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-600 uppercase pointer-events-none opacity-50">Ant.</span>
      </div>
      <div className="hidden sm:block w-px h-6 bg-slate-700"></div>
      <div className="relative flex-1 w-full bg-slate-800/50">
        <input
          type="number"
          step="0.1"
          inputMode="decimal"
          className="w-full bg-transparent px-3 py-4 text-white font-bold text-base text-center focus:outline-none placeholder-slate-600 appearance-none"
          placeholder="Atual"
          value={val2 || ''}
          onChange={(e) => onChange2(parseFloat(e.target.value))}
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-paggie-cyan/50 uppercase pointer-events-none">{unit}</span>
      </div>
    </div>
  </div>
);

interface Props {
  onComplete: (data: AssessmentData) => void;
  onBack: () => void;
  initialStudentName?: string;
}

const initialMetrics: BodyMetrics = {
  weight: '' as any, bodyFat: '' as any, neck: '' as any, shoulders: '' as any, chest: '' as any,
  armRight: '' as any, armLeft: '' as any, forearmRight: '' as any, forearmLeft: '' as any,
  waist: '' as any, abdomen: '' as any, hips: '' as any, thighRight: '' as any, thighLeft: '' as any,
  calfRight: '' as any, calfLeft: '' as any
};

const initialTests: PhysicalTests = {
  pushups: '' as any, squats: '' as any, plank: '' as any, pullups: '' as any,
  restingHR: '' as any, run12min: '' as any, pace: '0:00'
};

export const AssessmentForm: React.FC<Props> = ({ onComplete, onBack, initialStudentName }) => {
  const [step, setStep] = useState(1);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [data, setData] = useState<AssessmentData>({
    studentName: initialStudentName || '',
    age: '' as any, height: '' as any, gender: '' as any, goal: '', date: new Date().toISOString().split('T')[0],
    commitment: '' as any, adherenceRate: '' as any, workoutsPerMonth: '' as any, generalComments: '',
    initial: { ...initialMetrics }, current: { ...initialMetrics },
    initialTests: { ...initialTests }, currentTests: { ...initialTests },
    photos: {}, manualTechnicalAnalysis: '', manualConclusion: '',
    recLoad: '', recIntensity: '', recHabits: '', nextGoal: ''
  });

  const updateMetric = (type: 'initial' | 'current', field: keyof BodyMetrics, value: number) => {
    setData(prev => ({ ...prev, [type]: { ...prev[type], [field]: value } }));
  };

  const updateTest = (type: 'initialTests' | 'currentTests', field: keyof PhysicalTests, value: any) => {
    setData(prev => ({ ...prev, [type]: { ...prev[type], [field]: value } }));
  };

  const handlePhoto = (field: keyof typeof data.photos, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingField(field);

    // Validate file
    import('../utils/validation').then(({ validateFileUpload }) => {
      const validation = validateFileUpload(file);
      if (!validation.valid) {
        alert(validation.error || 'Erro ao validar arquivo');
        setUploadingField(null);
        return;
      }

      const reader = new FileReader();
      reader.onerror = () => {
        alert('Erro ao ler o arquivo. Tente novamente.');
        setUploadingField(null);
      };
      reader.onloadend = () => {
        if (reader.result) {
          setData(prev => ({ ...prev, photos: { ...prev.photos, [field]: reader.result } }));
        }
        setUploadingField(null);
      };
      reader.readAsDataURL(file);
    });
  };

  const nextStep = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s + 1); };
  const prevStep = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s - 1); };

  // Common Stepper Component
  const Stepper = () => (
    <div className="flex justify-between items-center mb-8 px-2 relative w-full max-w-md mx-auto">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -z-10 -translate-y-1/2 rounded"></div>
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-500 border-2 ${step >= i ? 'bg-paggie-cyan border-paggie-cyan shadow-[0_0_15px_rgba(0,174,239,0.3)] text-white scale-110' : 'bg-slate-900 border-slate-700 text-slate-600'}`}>
          {i}
        </div>
      ))}
    </div>
  );

  // --- STEP 1 ---
  const renderStep1 = () => (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white">Identificação</h3>
        <p className="text-xs text-slate-500 uppercase tracking-widest">Resumo Geral</p>
      </div>

      <StandardInput label="Nome do Aluno" value={data.studentName} onChange={(e) => setData({ ...data, studentName: e.target.value })} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StandardInput label="Idade" type="number" inputMode="numeric" value={data.age} onChange={(e) => setData({ ...data, age: e.target.value === '' ? '' : parseInt(e.target.value) as any })} placeholder="Ex: 30" />
        <StandardInput label="Altura (cm)" type="number" inputMode="numeric" value={data.height} onChange={(e) => setData({ ...data, height: e.target.value === '' ? '' : parseInt(e.target.value) as any })} placeholder="Ex: 175" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Gênero" value={data.gender} onChange={(e) => setData({ ...data, gender: e.target.value as any })}>
          <option value="" disabled>Selecione</option>
          <option value="male">Masculino</option><option value="female">Feminino</option>
        </Select>
        <StandardInput label="Objetivo Principal" value={data.goal} onChange={(e) => setData({ ...data, goal: e.target.value })} placeholder="Ex: Hipertrofia" />
      </div>

      <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 shadow-sm space-y-4">
        <h4 className="text-xs font-black text-paggie-cyan uppercase tracking-widest mb-2">Engajamento</h4>
        <Select label="Comprometimento" value={data.commitment} onChange={(e) => setData({ ...data, commitment: e.target.value as any })}>
          <option value="" disabled>Selecione</option>
          <option value="Excelente">Excelente</option><option value="Bom">Bom</option><option value="Regular">Regular</option><option value="Baixo">Baixo</option>
        </Select>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <StandardInput label="Adesão (%)" type="number" inputMode="numeric" value={data.adherenceRate} onChange={(e) => setData({ ...data, adherenceRate: e.target.value === '' ? '' : parseFloat(e.target.value) as any })} placeholder="Ex: 95" />
          <StandardInput label="Treinos (Mês)" type="number" inputMode="numeric" value={data.workoutsPerMonth} onChange={(e) => setData({ ...data, workoutsPerMonth: e.target.value === '' ? '' : parseInt(e.target.value) as any })} placeholder="Ex: 20" />
        </div>
        <TextArea label="Comentários Gerais" value={data.generalComments} onChange={(e) => setData({ ...data, generalComments: e.target.value })} />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button variant="secondary" onClick={onBack} className="flex-1 order-2 sm:order-1 py-4">Cancelar</Button>
        <Button onClick={nextStep} className="flex-1 order-1 sm:order-2 py-4" disabled={!data.studentName}>Próximo</Button>
      </div>
    </div>
  );

  // --- STEP 2 ---
  const renderStep2 = () => (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-white">Biometria</h3>
        <p className="text-xs text-slate-500 uppercase tracking-widest">Evolução Corporal</p>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl border border-slate-700/50">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <DualInput label="Peso" unit="kg" val1={data.initial.weight} val2={data.current.weight} onChange1={(v: number) => updateMetric('initial', 'weight', v)} onChange2={(v: number) => updateMetric('current', 'weight', v)} />
          <DualInput label="% Gordura" unit="%" val1={data.initial.bodyFat} val2={data.current.bodyFat} onChange1={(v: number) => updateMetric('initial', 'bodyFat', v)} onChange2={(v: number) => updateMetric('current', 'bodyFat', v)} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 pl-1 border-b border-slate-800 pb-2">Tronco & Braços</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <DualInput label="Peitoral" unit="cm" val1={data.initial.chest} val2={data.current.chest} onChange1={(v: number) => updateMetric('initial', 'chest', v)} onChange2={(v: number) => updateMetric('current', 'chest', v)} />
            <DualInput label="Abdômen" unit="cm" val1={data.initial.abdomen} val2={data.current.abdomen} onChange1={(v: number) => updateMetric('initial', 'abdomen', v)} onChange2={(v: number) => updateMetric('current', 'abdomen', v)} />
            <DualInput label="Cintura" unit="cm" val1={data.initial.waist} val2={data.current.waist} onChange1={(v: number) => updateMetric('initial', 'waist', v)} onChange2={(v: number) => updateMetric('current', 'waist', v)} />
            <DualInput label="Braço Dir." unit="cm" val1={data.initial.armRight} val2={data.current.armRight} onChange1={(v: number) => updateMetric('initial', 'armRight', v)} onChange2={(v: number) => updateMetric('current', 'armRight', v)} />
            <DualInput label="Braço Esq." unit="cm" val1={data.initial.armLeft} val2={data.current.armLeft} onChange1={(v: number) => updateMetric('initial', 'armLeft', v)} onChange2={(v: number) => updateMetric('current', 'armLeft', v)} />
          </div>
        </div>
        <div>
          <h4 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-4 pl-1 border-b border-slate-800 pb-2">Membros Inferiores</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4">
            <DualInput label="Quadril" unit="cm" val1={data.initial.hips} val2={data.current.hips} onChange1={(v: number) => updateMetric('initial', 'hips', v)} onChange2={(v: number) => updateMetric('current', 'hips', v)} />
            <DualInput label="Coxa Dir." unit="cm" val1={data.initial.thighRight} val2={data.current.thighRight} onChange1={(v: number) => updateMetric('initial', 'thighRight', v)} onChange2={(v: number) => updateMetric('current', 'thighRight', v)} />
            <DualInput label="Coxa Esq." unit="cm" val1={data.initial.thighLeft} val2={data.current.thighLeft} onChange1={(v: number) => updateMetric('initial', 'thighLeft', v)} onChange2={(v: number) => updateMetric('current', 'thighLeft', v)} />
            <DualInput label="Panturrilha D." unit="cm" val1={data.initial.calfRight} val2={data.current.calfRight} onChange1={(v: number) => updateMetric('initial', 'calfRight', v)} onChange2={(v: number) => updateMetric('current', 'calfRight', v)} />
            <DualInput label="Panturrilha E." unit="cm" val1={data.initial.calfLeft} val2={data.current.calfLeft} onChange1={(v: number) => updateMetric('initial', 'calfLeft', v)} onChange2={(v: number) => updateMetric('current', 'calfLeft', v)} />
          </div>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <Button variant="secondary" onClick={prevStep} className="flex-1 py-4">Voltar</Button>
        <Button onClick={nextStep} className="flex-1 py-4">Próximo</Button>
      </div>
    </div>
  );

  // --- STEP 3, 4, 5 ---
  const renderStep3 = () => (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-6"><h3 className="text-xl font-bold text-white">Performance</h3></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
        <DualInput label="Flexões" unit="reps" val1={data.initialTests.pushups} val2={data.currentTests.pushups} onChange1={(v: any) => updateTest('initialTests', 'pushups', v)} onChange2={(v: any) => updateTest('currentTests', 'pushups', v)} />
        <DualInput label="Agachamento" unit="reps" val1={data.initialTests.squats} val2={data.currentTests.squats} onChange1={(v: any) => updateTest('initialTests', 'squats', v)} onChange2={(v: any) => updateTest('currentTests', 'squats', v)} />
        <DualInput label="Prancha" unit="s" val1={data.initialTests.plank} val2={data.currentTests.plank} onChange1={(v: any) => updateTest('initialTests', 'plank', v)} onChange2={(v: any) => updateTest('currentTests', 'plank', v)} />
      </div>
      <div className="flex gap-3 mt-6"><Button variant="secondary" onClick={prevStep} className="flex-1 py-4">Voltar</Button><Button onClick={nextStep} className="flex-1 py-4">Próximo</Button></div>
    </div>
  );

  const renderStep4 = () => {
    const photoSections = [
      { label: 'Frente', keys: { before: 'frontBefore', after: 'frontAfter' } },
      { label: 'Lateral', keys: { before: 'sideBefore', after: 'sideAfter' } },
      { label: 'Costas', keys: { before: 'backBefore', after: 'backAfter' } }
    ];

    return (
      <div className="animate-fade-in space-y-6">
        <div className="text-center mb-6"><h3 className="text-xl font-bold text-white">Fotos</h3></div>
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center text-slate-500 text-sm">
          <p className="mb-4">Upload de fotos comparativas (Antes vs Depois).</p>
          <div className="space-y-6">
            {photoSections.map((section) => (
              <div key={section.label}>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 text-left pl-1">{section.label}</h4>
                <div className="grid grid-cols-2 gap-4">
                  {['before', 'after'].map((type) => {
                    // @ts-ignore
                    const fieldKey = section.keys[type] as keyof typeof data.photos;
                    const isUploading = uploadingField === fieldKey;

                    return (
                      <label key={fieldKey} className={`aspect-[3/4] bg-slate-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-slate-700 transition relative overflow-hidden group border border-slate-700 hover:border-slate-500 ${isUploading ? 'opacity-70 pointer-events-none' : ''}`}>
                        <span className="text-[10px] uppercase font-bold relative z-10 text-slate-500 group-hover:text-white transition-colors">{type === 'before' ? 'Antes' : 'Atual'}</span>
                        <input type="file" className="hidden" accept="image/*" onChange={(e) => handlePhoto(fieldKey, e)} disabled={isUploading} />
                        {data.photos[fieldKey] && <img src={data.photos[fieldKey]} className="absolute inset-0 w-full h-full object-cover" />}

                        {/* Empty/Add Indicator */}
                        {!data.photos[fieldKey] && !isUploading && (
                          <div className="absolute inset-0 bg-slate-800 group-hover:bg-slate-700 transition-colors flex items-center justify-center">
                            <span className="text-2xl opacity-20 group-hover:opacity-50 transition-opacity">+</span>
                          </div>
                        )}

                        {/* Loading Spinner */}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-20">
                            <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                          </div>
                        )}
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3 mt-6"><Button variant="secondary" onClick={prevStep} className="flex-1 py-4">Voltar</Button><Button onClick={nextStep} className="flex-1 py-4">Próximo</Button></div>
      </div>
    );
  };

  const renderStep5 = () => (
    <div className="animate-fade-in space-y-6">
      <div className="text-center mb-6"><h3 className="text-xl font-bold text-white">Finalização</h3></div>
      <TextArea label="Análise Técnica (Input Manual)" value={data.manualTechnicalAnalysis} onChange={(e) => setData({ ...data, manualTechnicalAnalysis: e.target.value })} rows={6} placeholder="Digite sua análise detalhada aqui..." />
      <TextArea label="Conclusão" value={data.manualConclusion} onChange={(e) => setData({ ...data, manualConclusion: e.target.value })} rows={3} placeholder="Frase de fechamento..." />
      <div className="flex gap-3 mt-6"><Button variant="secondary" onClick={prevStep} className="flex-1 py-4">Voltar</Button><Button onClick={() => onComplete(data)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 py-4 shadow-lg shadow-emerald-500/30">Gerar Relatório</Button></div>
    </div>
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Stepper />
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
      {step === 4 && renderStep4()}
      {step === 5 && renderStep5()}
    </div>
  );
};
