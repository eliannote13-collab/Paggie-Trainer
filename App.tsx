
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { Auth } from './components/Auth';
import { Onboarding } from './components/Onboarding';
import { ModeSelection } from './components/ModeSelection';
import { AssessmentForm } from './components/AssessmentForm';
import { TrainingForm } from './components/TrainingForm';
import { ReportPreview } from './components/ReportPreview';
import { TrainingReportPreview } from './components/TrainingReportPreview';
import { ExerciseLibrary } from './components/ExerciseLibrary';
import { AnamneseForm } from './components/AnamneseForm';
import { AnamneseReport } from './components/AnamneseReport';
import { PhysicalAssessmentForm } from './components/PhysicalAssessmentForm';
import { PhysicalAssessmentReport } from './components/PhysicalAssessmentReport';
import { ForgotPassword } from './components/ForgotPassword';
import { ResetPassword } from './components/ResetPassword';
import { ChatPaggie } from './components/ChatPaggie';
import { TrainerProfile, AssessmentData, AppStep, AIAnalysisResult, TrainingPlanData, AnamneseData, PhysicalAssessmentData } from './types';
import { generateAssessmentReport } from './services/groqService';
import { supabase, getCurrentUserProfile, saveUserProfile } from './services/supabase';

const App = () => {
  const [step, setStep] = useState<AppStep>('auth');
  const [trainer, setTrainer] = useState<TrainerProfile | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  // Processing Context
  const [processingContext, setProcessingContext] = useState<'assessment' | 'training'>('assessment');
  const [loadingText, setLoadingText] = useState('');

  // Data States
  const [assessmentData, setAssessmentData] = useState<AssessmentData | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlanData | null>(null);
  const [anamneseData, setAnamneseData] = useState<AnamneseData | null>(null);
  const [physicalAssessmentData, setPhysicalAssessmentData] = useState<PhysicalAssessmentData | null>(null);

  // SUPABASE AUTH LISTENER
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setStep('reset-password');
      }
      handleSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSession = async (session: any) => {
    if (!session) {
      setTrainer(null);
      setStep('auth');
      setIsLoadingAuth(false);
      return;
    }

    // Check if user has a profile
    const profile = await getCurrentUserProfile();
    if (profile) {
      setTrainer(profile);
      setStep('mode-selection');
    } else {
      setStep('onboarding');
    }
    setIsLoadingAuth(false);
  };

  // Effect to cycle loading text
  useEffect(() => {
    if (step === 'analyzing') {
      let messages = [];
      if (processingContext === 'assessment') {
        messages = [
          "Conectando Neural Engine...",
          "Analisando composição corporal...",
          "Calculando diferenciais de performance...",
          "Gerando estratégia personalizada..."
        ];
      } else {
        messages = [
          "Estruturando periodização...",
          "Calculando volume de treino...",
          "Otimizando layout visual...",
          "Finalizando documento inteligente..."
        ];
      }

      let i = 0;
      setLoadingText(messages[0]);
      const interval = setInterval(() => {
        i = (i + 1) % messages.length;
        setLoadingText(messages[i]);
      }, 800);

      return () => clearInterval(interval);
    }
  }, [step, processingContext]);

  const handleOnboardingComplete = async (profile: TrainerProfile) => {
    try {
      await saveUserProfile(profile);
      setTrainer(profile);
      setStep('mode-selection');
    } catch (e) {
      console.error("Erro ao salvar perfil:", e);
      alert("Erro ao salvar dados. Tente novamente.");
    }
  };

  const handleEditProfile = () => {
    setStep('onboarding');
  };

  const handleLogout = async () => {
    if (window.confirm("Deseja realmente sair da sua conta?")) {
      await supabase.auth.signOut();
      setTrainer(null);
      setStep('auth');
      window.scrollTo(0, 0);
    }
  };

  const handleModeSelect = (mode: 'assessment' | 'training' | 'library' | 'anamnese' | 'physical-assessment' | 'chat-paggie') => {
    if (mode === 'assessment') {
      setStep('assessment');
    } else if (mode === 'library') {
      setStep('library');
    } else if (mode === 'anamnese') {
      setStep('anamnese-form');
    } else if (mode === 'physical-assessment') {
      setStep('physical-assessment-form');
    } else if (mode === 'chat-paggie') {
      setStep('chat-paggie');
    } else {
      setStep('training-form');
    }
  };

  const handleAssessmentComplete = async (data: AssessmentData) => {
    setAssessmentData(data);
    setProcessingContext('assessment');
    setStep('analyzing');

    try {
      const result = await generateAssessmentReport(data);
      setAnalysis(result);
      setStep('report');
    } catch (e) {
      console.error(e);
      setStep('report');
    }
  };

  const handleTrainingComplete = (data: TrainingPlanData) => {
    setTrainingPlan(data);
    setProcessingContext('training');
    setStep('analyzing');

    setTimeout(() => {
      setStep('training-report');
    }, 2000); // Reduced delay for better UX
  };

  const handleAnamneseComplete = (data: AnamneseData) => {
    setAnamneseData(data);
    setStep('anamnese-report');
  };

  const handlePhysicalAssessmentComplete = (data: PhysicalAssessmentData) => {
    setPhysicalAssessmentData(data);
    setStep('physical-assessment-report');
  };

  const handleGoHome = () => {
    setStep('mode-selection');
  };

  // --- SMART NAVIGATION BRIDGE ---
  const handleSwitchToTraining = () => {
    if (trainingPlan) {
      setStep('training-report');
    } else {
      setStep('training-form');
    }
  };

  const handleSwitchToAssessment = () => {
    if (assessmentData && analysis) {
      setStep('report');
    } else {
      setStep('assessment');
    }
  };

  const renderContent = () => {
    if (isLoadingAuth) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-paggie-cyan border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    switch (step) {
      case 'auth':
        return <Auth onForgotPassword={() => setStep('forgot-password')} />;

      case 'forgot-password':
        return <ForgotPassword onBack={() => setStep('auth')} />;

      case 'reset-password':
        return <ResetPassword onSuccess={() => setStep('auth')} />;

      case 'onboarding':
        return <Onboarding onComplete={handleOnboardingComplete} initialData={trainer} />;

      case 'mode-selection':
        return <ModeSelection
          onSelect={handleModeSelect}
          trainerName={trainer?.name || ''}
          onEditProfile={handleEditProfile}
          onLogout={handleLogout}
        />;

      case 'library':
        return <ExerciseLibrary onBack={handleGoHome} onImport={() => { }} />;

      case 'anamnese-form':
        return <AnamneseForm onComplete={handleAnamneseComplete} onBack={handleGoHome} />;

      case 'anamnese-report':
        if (!trainer || !anamneseData) return null;
        return <AnamneseReport trainer={trainer} data={anamneseData} onBack={() => setStep('anamnese-form')} onHome={handleGoHome} />;

      case 'physical-assessment-form':
        // Data Bridge: Try to find existing student name
        const existingName = assessmentData?.studentName || trainingPlan?.studentName || anamneseData?.studentName;
        return (
          <PhysicalAssessmentForm
            onComplete={handlePhysicalAssessmentComplete}
            onBack={handleGoHome}
            initialStudentName={existingName}
            initialData={physicalAssessmentData}
          />
        );

      case 'physical-assessment-report':
        if (!trainer || !physicalAssessmentData) return null;
        return <PhysicalAssessmentReport trainer={trainer} data={physicalAssessmentData} onBack={() => setStep('physical-assessment-form')} onHome={handleGoHome} />;

      case 'chat-paggie':
        if (!trainer) return null;
        return <ChatPaggie trainer={trainer} onBack={handleGoHome} />;

      case 'assessment':
        return (
          <AssessmentForm
            onComplete={handleAssessmentComplete}
            onBack={handleGoHome}
            initialStudentName={trainingPlan?.studentName || anamneseData?.studentName}
          />
        );

      case 'training-form':
        return (
          <TrainingForm
            onComplete={handleTrainingComplete}
            onBack={handleGoHome}
            initialData={assessmentData ? {
              studentName: assessmentData.studentName,
              goal: assessmentData.goal
            } : undefined}
          />
        );

      case 'analyzing':
        return (
          <div className="flex flex-col items-center justify-center py-20 relative animate-fade-in min-h-[60vh]">
            <div className="absolute inset-0 bg-paggie-cyan/5 blur-[100px] animate-pulse"></div>

            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-paggie-cyan border-r-transparent border-b-paggie-blue border-l-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl animate-pulse">
                  {processingContext === 'assessment' ? '🧠' : '⚡'}
                </span>
              </div>
            </div>

            <h2 className="text-2xl font-black text-white mb-2 tracking-tight">
              {processingContext === 'assessment' ? 'PROCESSANDO DADOS' : 'GERANDO RELATÓRIO'}
            </h2>
            <div className="flex flex-col gap-1 items-center h-12">
              <p className="text-paggie-cyan text-xs font-bold uppercase tracking-[0.2em] animate-fade-in">
                {loadingText}
              </p>
            </div>
          </div>
        );

      case 'report':
        if (!trainer || !assessmentData || !analysis) return null;
        return (
          <ReportPreview
            trainer={trainer}
            student={assessmentData}
            analysis={analysis}
            onBack={() => setStep('assessment')}
            onHome={handleGoHome}
            onSwitchToTraining={handleSwitchToTraining}
            hasTrainingData={!!trainingPlan}
          />
        );

      case 'training-report':
        if (!trainer || !trainingPlan) return null;
        return (
          <TrainingReportPreview
            trainer={trainer}
            plan={trainingPlan}
            onBack={() => setStep('training-form')}
            onHome={handleGoHome}
            onSwitchToAssessment={handleSwitchToAssessment}
            hasAssessmentData={!!assessmentData}
          />
        );

      default:
        return null;
    }
  };

  if (step === 'report' || step === 'training-report' || step === 'anamnese-report' || step === 'physical-assessment-report' || step === 'chat-paggie') {
    return renderContent();
  }

  return (
    <Layout>
      {renderContent()}
    </Layout>
  );
};

export default App;
