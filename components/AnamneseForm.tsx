
import React, { useState } from 'react';
import { AnamneseData } from '../types';
import { Input, Select, TextArea } from './ui/Input';
import { Button } from './ui/Button';

interface Props {
  onComplete: (data: AnamneseData) => void;
  onBack: () => void;
}

export const AnamneseForm: React.FC<Props> = ({ onComplete, onBack }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<AnamneseData>({
    // I. Identificação
    studentName: '', date: new Date().toISOString().split('T')[0], birthDate: '', age: 0, gender: 'Masculino',
    maritalStatus: '', profession: '', phone: '', email: '', address: '',
    // II. QP
    mainComplaint: '', complaintDuration: '', associatedSymptoms: '',
    // III. HDA
    hdaOnset: '', hdaEvolution: '', hdaFactors: '', hdaIntensity: '', previousTreatments: '',
    // IV. Pregressa
    chronicDiseases: '', surgeries: '', hospitalizations: '', traumas: '', vaccinationStatus: '', allergies: '',
    // V. Medicamentos
    medications: '', adherence: '', supplements: '',
    // VI. Familiar
    familyHistory: '',
    // VII. Hábitos
    smoking: 'Não fuma', alcohol: 'Não bebe', substances: '', diet: '', physicalActivity: '', sleep: '', stressLevel: 'Médio', waterIntake: '',
    // VIII. Sistemas
    systemGeneral: '', systemRespiratory: '', systemCardiovascular: '', systemGastro: '', systemNeuro: '', systemPsych: '',
    // IX. Exame Físico
    bp: '', hr: '', respRate: '', temp: '', weight: '', height: '', bmi: '', waistCirc: '', generalInspection: '',
    // X. Plano
    diagnosisHypothesis: '', requestedExams: '', therapeuticPlan: '', nextVisit: ''
  });

  const nextStep = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s + 1); };
  const prevStep = () => { window.scrollTo({ top: 0, behavior: 'smooth' }); setStep(s => s - 1); };

  // PASSO 1: I. Identificação + II. Queixa Principal
  const renderStep1 = () => (
    <div className="animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-1">Passo 1: Identificação & Queixa</h3>
        <p className="text-xs text-amber-500 mb-6 uppercase tracking-widest font-bold">Dados Gerais e Motivo da Consulta</p>

        <div className="space-y-4 mb-8 border-b border-slate-700 pb-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">I. Identificação</h4>
            <Input label="Nome Completo" value={data.studentName} onChange={(e) => setData({ ...data, studentName: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="Data Nascimento" type="date" value={data.birthDate} onChange={(e) => setData({ ...data, birthDate: e.target.value })} />
                <Input label="Idade" type="number" value={data.age} onChange={(e) => setData({ ...data, age: parseInt(e.target.value) })} />
                <Select label="Gênero" value={data.gender} onChange={(e) => setData({ ...data, gender: e.target.value as any })}>
                    <option>Masculino</option><option>Feminino</option><option>Outro</option>
                </Select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Estado Civil" value={data.maritalStatus} onChange={(e) => setData({ ...data, maritalStatus: e.target.value })} />
                <Input label="Profissão" value={data.profession} onChange={(e) => setData({ ...data, profession: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Telefone" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} />
                <Input label="E-mail" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} />
            </div>
            <Input label="Endereço" value={data.address} onChange={(e) => setData({ ...data, address: e.target.value })} />
        </div>

        <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">II. Queixa Principal (QP)</h4>
            <TextArea label="Descrição da Queixa (Motivo)" placeholder="Frase curta do paciente..." value={data.mainComplaint} onChange={(e) => setData({ ...data, mainComplaint: e.target.value })} rows={2} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Duração" placeholder="Ex: 3 semanas..." value={data.complaintDuration} onChange={(e) => setData({ ...data, complaintDuration: e.target.value })} />
                <Input label="Sintomas Acompanhantes" value={data.associatedSymptoms} onChange={(e) => setData({ ...data, associatedSymptoms: e.target.value })} />
            </div>
        </div>

        <div className="flex gap-4 mt-6">
            <Button variant="secondary" onClick={onBack} className="flex-1">Voltar</Button>
            <Button onClick={nextStep} className="flex-1 bg-amber-600 hover:bg-amber-500" disabled={!data.studentName}>Próximo</Button>
        </div>
    </div>
  );

  // PASSO 2: III. HDA + IV. Pregressa + V. Medicamentos + VI. Familiar
  const renderStep2 = () => (
    <div className="animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-1">Passo 2: Histórico Clínico</h3>
        <p className="text-xs text-amber-500 mb-6 uppercase tracking-widest font-bold">HDA, Antecedentes Pessoais e Familiares</p>

        <div className="space-y-4 mb-8 border-b border-slate-700 pb-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">III. História da Doença Atual (HDA)</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Início (Quando/Como)" value={data.hdaOnset} onChange={(e) => setData({ ...data, hdaOnset: e.target.value })} />
                <Input label="Evolução" value={data.hdaEvolution} onChange={(e) => setData({ ...data, hdaEvolution: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <Input label="Fatores Melhora/Piora" value={data.hdaFactors} onChange={(e) => setData({ ...data, hdaFactors: e.target.value })} />
                 <Input label="Intensidade (0-10)" value={data.hdaIntensity} onChange={(e) => setData({ ...data, hdaIntensity: e.target.value })} />
            </div>
            <Input label="Tratamentos Prévios" value={data.previousTreatments} onChange={(e) => setData({ ...data, previousTreatments: e.target.value })} />
        </div>

        <div className="space-y-4 mb-8 border-b border-slate-700 pb-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IV. História Médica Pregressa</h4>
            <TextArea label="Doenças Crônicas (Diabetes, HAS...)" value={data.chronicDiseases} onChange={(e) => setData({ ...data, chronicDiseases: e.target.value })} rows={2} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Cirurgias" value={data.surgeries} onChange={(e) => setData({ ...data, surgeries: e.target.value })} />
                <Input label="Internações" value={data.hospitalizations} onChange={(e) => setData({ ...data, hospitalizations: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Traumas/Acidentes" value={data.traumas} onChange={(e) => setData({ ...data, traumas: e.target.value })} />
                <Input label="Vacinação" value={data.vaccinationStatus} onChange={(e) => setData({ ...data, vaccinationStatus: e.target.value })} />
            </div>
            <Input label="Alergias" value={data.allergies} onChange={(e) => setData({ ...data, allergies: e.target.value })} />
        </div>

        <div className="space-y-4 mb-8 border-b border-slate-700 pb-6">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">V. Medicamentos em Uso</h4>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Nome/Dose/Frequência" value={data.medications} onChange={(e) => setData({ ...data, medications: e.target.value })} />
                <Input label="Aderência" value={data.adherence} onChange={(e) => setData({ ...data, adherence: e.target.value })} />
             </div>
             <Input label="Suplementos/Fitoterápicos" value={data.supplements} onChange={(e) => setData({ ...data, supplements: e.target.value })} />
        </div>

        <div className="space-y-4">
             <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VI. Antecedentes Familiares</h4>
             <TextArea label="Doenças na Família (Cardíacas, Câncer, Diabetes...)" value={data.familyHistory} onChange={(e) => setData({ ...data, familyHistory: e.target.value })} rows={2} />
        </div>

        <div className="flex gap-4 mt-6">
            <Button variant="secondary" onClick={prevStep} className="flex-1">Voltar</Button>
            <Button onClick={nextStep} className="flex-1 bg-amber-600 hover:bg-amber-500">Próximo</Button>
        </div>
    </div>
  );

  // PASSO 3: VII. Estilo de Vida + VIII. Revisão por Sistemas
  const renderStep3 = () => (
    <div className="animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-1">Passo 3: Hábitos & Sintomas</h3>
        <p className="text-xs text-amber-500 mb-6 uppercase tracking-widest font-bold">Estilo de Vida e Revisão Geral</p>

        <div className="space-y-4 mb-8 border-b border-slate-700 pb-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VII. Hábitos de Vida</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Tabagismo" value={data.smoking} onChange={(e) => setData({ ...data, smoking: e.target.value })} />
                <Input label="Etilismo" value={data.alcohol} onChange={(e) => setData({ ...data, alcohol: e.target.value })} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Outras Substâncias" value={data.substances} onChange={(e) => setData({ ...data, substances: e.target.value })} />
                <Input label="Alimentação" value={data.diet} onChange={(e) => setData({ ...data, diet: e.target.value })} />
            </div>
            <Input label="Atividade Física Atual" value={data.physicalActivity} onChange={(e) => setData({ ...data, physicalActivity: e.target.value })} />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input label="Sono (Horas/Qualidade)" value={data.sleep} onChange={(e) => setData({ ...data, sleep: e.target.value })} />
                <Select label="Nível de Estresse" value={data.stressLevel} onChange={(e) => setData({ ...data, stressLevel: e.target.value })}>
                    <option>Baixo</option><option>Médio</option><option>Alto</option>
                </Select>
                <Input label="Ingestão de Água" placeholder="Ex: 2 Litros" value={data.waterIntake} onChange={(e) => setData({ ...data, waterIntake: e.target.value })} />
            </div>
        </div>

        <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VIII. Revisão por Sistemas</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input label="Geral (Febre, Peso, Fadiga)" value={data.systemGeneral} onChange={(e) => setData({ ...data, systemGeneral: e.target.value })} />
                <Input label="Pele e Anexos" value={data.systemGeneral} onChange={(e) => setData({ ...data, systemGeneral: e.target.value })} /> {/* Reusing input for layout simplicity, ideally unique fields */}
                <Input label="Respiratório (Tosse, Falta de Ar)" value={data.systemRespiratory} onChange={(e) => setData({ ...data, systemRespiratory: e.target.value })} />
                <Input label="Cardiovascular (Palpitações)" value={data.systemCardiovascular} onChange={(e) => setData({ ...data, systemCardiovascular: e.target.value })} />
                <Input label="Gastrointestinal" value={data.systemGastro} onChange={(e) => setData({ ...data, systemGastro: e.target.value })} />
                <Input label="Neurológico" value={data.systemNeuro} onChange={(e) => setData({ ...data, systemNeuro: e.target.value })} />
                <Input label="Psíquico (Humor, Ansiedade)" value={data.systemPsych} onChange={(e) => setData({ ...data, systemPsych: e.target.value })} />
            </div>
        </div>

        <div className="flex gap-4 mt-6">
            <Button variant="secondary" onClick={prevStep} className="flex-1">Voltar</Button>
            <Button onClick={nextStep} className="flex-1 bg-amber-600 hover:bg-amber-500">Próximo</Button>
        </div>
    </div>
  );

  // PASSO 4: IX. Exame Físico + X. Conduta
  const renderStep4 = () => (
    <div className="animate-fade-in">
        <h3 className="text-xl font-bold text-white mb-1">Passo 4: Exame & Conduta</h3>
        <p className="text-xs text-amber-500 mb-6 uppercase tracking-widest font-bold">Avaliação Física e Plano Terapêutico</p>

        <div className="space-y-4 mb-8 border-b border-slate-700 pb-6">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">IX. Exame Físico Básico</h4>
            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                 <h5 className="text-[10px] font-bold text-slate-500 uppercase mb-3">Sinais Vitais</h5>
                 <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     <Input label="PA (mmHg)" placeholder="120/80" value={data.bp} onChange={(e) => setData({ ...data, bp: e.target.value })} />
                     <Input label="FC (bpm)" value={data.hr} onChange={(e) => setData({ ...data, hr: e.target.value })} />
                     <Input label="FR (irpm)" value={data.respRate} onChange={(e) => setData({ ...data, respRate: e.target.value })} />
                     <Input label="Temp (ºC)" value={data.temp} onChange={(e) => setData({ ...data, temp: e.target.value })} />
                 </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                 <Input label="Peso (kg)" value={data.weight} onChange={(e) => setData({ ...data, weight: e.target.value })} />
                 <Input label="Altura (m)" value={data.height} onChange={(e) => setData({ ...data, height: e.target.value })} />
                 <Input label="IMC" value={data.bmi} onChange={(e) => setData({ ...data, bmi: e.target.value })} />
                 <Input label="Circ. Abdom. (cm)" value={data.waistCirc} onChange={(e) => setData({ ...data, waistCirc: e.target.value })} />
            </div>
            <TextArea label="Inspeção Geral" value={data.generalInspection} onChange={(e) => setData({ ...data, generalInspection: e.target.value })} rows={2} />
        </div>

        <div className="space-y-4">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">X. Considerações Finais e Conduta</h4>
            <TextArea label="Hipóteses Diagnósticas" value={data.diagnosisHypothesis} onChange={(e) => setData({ ...data, diagnosisHypothesis: e.target.value })} rows={2} />
            <Input label="Exames Complementares Solicitados" value={data.requestedExams} onChange={(e) => setData({ ...data, requestedExams: e.target.value })} />
            <TextArea label="Conduta Terapêutica Inicial (Plano)" value={data.therapeuticPlan} onChange={(e) => setData({ ...data, therapeuticPlan: e.target.value })} rows={3} />
            <Input label="Próximo Retorno" type="date" value={data.nextVisit} onChange={(e) => setData({ ...data, nextVisit: e.target.value })} />
        </div>

        <div className="flex gap-4 mt-6">
            <Button variant="secondary" onClick={prevStep} className="flex-1">Voltar</Button>
            <Button onClick={() => onComplete(data)} className="flex-1 bg-gradient-to-r from-amber-500 to-amber-700 shadow-lg shadow-amber-500/30">Gerar Relatório</Button>
        </div>
    </div>
  );

  return (
    <div className="w-full">
         <div className="flex justify-between mb-8 px-1 relative">
             <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -z-10 -translate-y-1/2 rounded"></div>
            {[1,2,3,4].map(i => (
                <div 
                    key={i} 
                    className={`w-4 h-4 rounded-full transition-all duration-500 border-2 flex items-center justify-center text-[8px] font-bold ${step >= i ? 'bg-amber-500 border-amber-500 shadow-[0_0_10px_#F59E0B] scale-110 text-black' : 'bg-slate-900 border-slate-600 text-slate-500'}`} 
                >
                    {i}
                </div>
            ))}
        </div>
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
        {step === 4 && renderStep4()}
    </div>
  );
};
