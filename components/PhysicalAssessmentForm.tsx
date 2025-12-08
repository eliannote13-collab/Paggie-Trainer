
import React, { useState } from 'react';
import { PhysicalAssessmentData } from '../types';
import { Input, Select, TextArea } from './ui/Input';
import { Button } from './ui/Button';

interface Props {
  onComplete: (data: PhysicalAssessmentData) => void;
  onBack: () => void;
  initialStudentName?: string;
  initialData?: PhysicalAssessmentData | null;
}

const defaultData: PhysicalAssessmentData = {
    studentName: '', 
    date: new Date().toISOString().split('T')[0], 
    age: 0, 
    gender: 'Masculino',
    restingHR: '', vo2Max: '', testCooper: '',
    pushUpTest: '', sitUpTest: '', squatTest: '', plankTest: '',
    sitAndReach: '',
    postureHead: '', postureShoulders: '', postureSpine: '', postureHips: '', postureKnees: '', postureFeet: '',
    considerations: ''
};

export const PhysicalAssessmentForm: React.FC<Props> = ({ onComplete, onBack, initialStudentName, initialData }) => {
  const [step, setStep] = useState(1);
  
  const [data, setData] = useState<PhysicalAssessmentData>(() => {
      if (initialData) return initialData;
      return {
          ...defaultData,
          studentName: initialStudentName || ''
      };
  });

  const nextStep = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s + 1); };
  const prevStep = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s - 1); };

  const renderStep1 = () => (
    <div className="animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-1">Passo 1: Dados & Cardio</h3>
        <p className="text-xs text-rose-500 mb-6 uppercase tracking-widest font-bold">Identificação e Capacidade Aeróbica</p>

        <div className="space-y-4 mb-8">
            <Input label="Nome do Aluno" value={data.studentName} onChange={(e) => setData({ ...data, studentName: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="Idade" type="number" value={data.age} onChange={(e) => setData({ ...data, age: parseInt(e.target.value) })} />
                <Select label="Gênero" value={data.gender} onChange={(e) => setData({ ...data, gender: e.target.value as any })}>
                    <option>Masculino</option><option>Feminino</option>
                </Select>
                <Input label="Data" type="date" value={data.date} onChange={(e) => setData({ ...data, date: e.target.value })} />
            </div>
        </div>

        <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Testes Cardiorrespiratórios</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="FC Repouso (bpm)" value={data.restingHR} onChange={(e) => setData({ ...data, restingHR: e.target.value })} />
                <Input label="Teste de Cooper (Metros)" placeholder="Ex: 2400" value={data.testCooper} onChange={(e) => setData({ ...data, testCooper: e.target.value })} />
                <Input label="VO2 Max (Estimado)" placeholder="ml/kg/min" value={data.vo2Max} onChange={(e) => setData({ ...data, vo2Max: e.target.value })} />
            </div>
        </div>

        <div className="flex gap-4 mt-6">
            <Button variant="secondary" onClick={onBack} className="flex-1">Voltar</Button>
            <Button onClick={nextStep} className="flex-1 bg-rose-600 hover:bg-rose-500" disabled={!data.studentName}>Próximo</Button>
        </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-1">Passo 2: Força & Flexibilidade</h3>
        <p className="text-xs text-rose-500 mb-6 uppercase tracking-widest font-bold">Resistência Muscular Localizada</p>

        <div className="space-y-4 mb-8">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Testes Neuromusculares (1 min)</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <Input label="Flexão de Braço (Reps)" value={data.pushUpTest} onChange={(e) => setData({ ...data, pushUpTest: e.target.value })} />
                <Input label="Abdominal Remador (Reps)" value={data.sitUpTest} onChange={(e) => setData({ ...data, sitUpTest: e.target.value })} />
                <Input label="Agachamento (Reps)" value={data.squatTest} onChange={(e) => setData({ ...data, squatTest: e.target.value })} />
                <Input label="Prancha (Tempo)" value={data.plankTest} onChange={(e) => setData({ ...data, plankTest: e.target.value })} />
            </div>
        </div>

        <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flexibilidade</h4>
            <Input label="Banco de Wells (cm)" placeholder="Ex: 30" value={data.sitAndReach} onChange={(e) => setData({ ...data, sitAndReach: e.target.value })} />
        </div>

        <div className="flex gap-4 mt-6">
            <Button variant="secondary" onClick={prevStep} className="flex-1">Voltar</Button>
            <Button onClick={nextStep} className="flex-1 bg-rose-600 hover:bg-rose-500">Próximo</Button>
        </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-1">Passo 3: Análise Postural</h3>
        <p className="text-xs text-rose-500 mb-6 uppercase tracking-widest font-bold">Avaliação Estática</p>

        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Cabeça" placeholder="Ex: Anteriorizada" value={data.postureHead} onChange={(e) => setData({ ...data, postureHead: e.target.value })} />
                <Input label="Ombros" placeholder="Ex: Protusos" value={data.postureShoulders} onChange={(e) => setData({ ...data, postureShoulders: e.target.value })} />
                <Input label="Coluna" placeholder="Ex: Escoliose lombar" value={data.postureSpine} onChange={(e) => setData({ ...data, postureSpine: e.target.value })} />
                <Input label="Quadril" placeholder="Ex: Desnivelado D>E" value={data.postureHips} onChange={(e) => setData({ ...data, postureHips: e.target.value })} />
                <Input label="Joelhos" placeholder="Ex: Valgo dinâmico" value={data.postureKnees} onChange={(e) => setData({ ...data, postureKnees: e.target.value })} />
                <Input label="Pés" placeholder="Ex: Plano" value={data.postureFeet} onChange={(e) => setData({ ...data, postureFeet: e.target.value })} />
            </div>
        </div>

        <div className="mt-6">
            <TextArea label="Considerações Finais do Avaliador" value={data.considerations} onChange={(e) => setData({ ...data, considerations: e.target.value })} rows={3} />
        </div>

        <div className="flex gap-4 mt-6">
            <Button variant="secondary" onClick={prevStep} className="flex-1">Voltar</Button>
            <Button onClick={() => onComplete(data)} className="flex-1 bg-gradient-to-r from-rose-500 to-rose-700 shadow-lg shadow-rose-500/30">Gerar Relatório</Button>
        </div>
    </div>
  );

  return (
    <div className="w-full max-w-3xl mx-auto">
         <div className="flex justify-between mb-8 px-1 relative">
             <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -z-10 -translate-y-1/2 rounded"></div>
            {[1,2,3].map(i => (
                <div key={i} className={`w-6 h-6 rounded-full transition-all duration-500 border-2 flex items-center justify-center text-[10px] font-bold ${step >= i ? 'bg-rose-500 border-rose-500 shadow-[0_0_10px_#F43F5E] scale-110 text-white' : 'bg-slate-900 border-slate-600 text-slate-500'}`}>
                    {i}
                </div>
            ))}
        </div>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
    </div>
  );
};
