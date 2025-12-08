
import React, { useState, useEffect, useRef } from 'react';
import { TrainingPlanData, WorkoutSession, Exercise } from '../types';
import { Input, Select, TextArea } from './ui/Input';
import { Button } from './ui/Button';
import { ExerciseLibrary } from './ExerciseLibrary';

interface Props {
  onComplete: (data: TrainingPlanData) => void;
  onBack: () => void;
  initialData?: {
    studentName: string;
    goal: string;
  };
}

const emptyExercise = (): Exercise => ({
  id: Math.random().toString(36).substr(2, 9),
  name: '',
  sets: '3',
  reps: '10-12',
  rest: '60s',
  technique: ''
});

const emptyWorkout = (letter: string): WorkoutSession => ({
  id: Math.random().toString(36).substr(2, 9),
  letter,
  name: '',
  days: [],
  exercises: [emptyExercise()],
  notes: ''
});

const DAYS_OF_WEEK = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const EXERCISE_BATCH_SIZE = 5;

export const TrainingForm: React.FC<Props> = ({ onComplete, onBack, initialData }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<TrainingPlanData>({
    studentName: initialData?.studentName || '',
    goal: initialData?.goal || 'Hipertrofia',
    startDate: new Date().toISOString().split('T')[0],
    durationWeeks: 4,
    splitType: 'ABC',
    frequencyComments: '',
    workouts: [emptyWorkout('A'), emptyWorkout('B'), emptyWorkout('C')]
  });

  const [activeTab, setActiveTab] = useState(0);
  const [showLibrary, setShowLibrary] = useState(false);
  const [visibleExercises, setVisibleExercises] = useState(EXERCISE_BATCH_SIZE);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVisibleExercises(EXERCISE_BATCH_SIZE);
  }, [activeTab]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          setVisibleExercises((prev) => prev + EXERCISE_BATCH_SIZE);
        }
      },
      { root: null, rootMargin: '20px', threshold: 0.1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [loaderRef, activeTab]);

  const updateWorkout = (index: number, field: keyof WorkoutSession, value: any) => {
    const newWorkouts = [...data.workouts];
    newWorkouts[index] = { ...newWorkouts[index], [field]: value };
    setData({ ...data, workouts: newWorkouts });
  };

  const toggleDay = (workoutIndex: number, day: string) => {
    const newWorkouts = [...data.workouts];
    const currentDays = newWorkouts[workoutIndex].days;
    if (currentDays.includes(day)) {
      newWorkouts[workoutIndex].days = currentDays.filter(d => d !== day);
    } else {
      newWorkouts[workoutIndex].days = [...currentDays, day];
    }
    setData({ ...data, workouts: newWorkouts });
  };

  const updateExercise = (workoutIndex: number, exerciseIndex: number, field: keyof Exercise, value: string) => {
    const newWorkouts = [...data.workouts];
    const exercises = [...newWorkouts[workoutIndex].exercises];
    exercises[exerciseIndex] = { ...exercises[exerciseIndex], [field]: value };

    newWorkouts[workoutIndex] = { ...newWorkouts[workoutIndex], exercises };
    setData({ ...data, workouts: newWorkouts });
  };

  const addExercise = (workoutIndex: number) => {
    const newWorkouts = [...data.workouts];
    const exercises = [...newWorkouts[workoutIndex].exercises, emptyExercise()];
    newWorkouts[workoutIndex] = { ...newWorkouts[workoutIndex], exercises };

    setData({ ...data, workouts: newWorkouts });
    setVisibleExercises(prev => Math.max(prev, exercises.length));
  };

  const removeExercise = (workoutIndex: number, exerciseIndex: number) => {
    const newWorkouts = [...data.workouts];
    const exercises = newWorkouts[workoutIndex].exercises.filter((_, i) => i !== exerciseIndex);
    newWorkouts[workoutIndex] = { ...newWorkouts[workoutIndex], exercises };
    setData({ ...data, workouts: newWorkouts });
  };

  const addWorkout = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nextLetter = letters[data.workouts.length] || '?';
    setData({ ...data, workouts: [...data.workouts, emptyWorkout(nextLetter)] });
    setActiveTab(data.workouts.length);
  };

  const removeWorkout = (index: number) => {
    if (data.workouts.length <= 1) return;
    const newWorkouts = data.workouts.filter((_, i) => i !== index);
    setData({ ...data, workouts: newWorkouts });
    setActiveTab(Math.max(0, activeTab - 1));
  };

  const handleImportFromLibrary = (exercises: Exercise[]) => {
    setData((prevData) => {
      const newWorkouts = prevData.workouts.map((workout, index) => {
        if (index !== activeTab) return workout;
        let currentExercises = [...workout.exercises];
        if (currentExercises.length === 1 && currentExercises[0].name === '') {
          currentExercises = [];
        }
        return {
          ...workout,
          exercises: [...currentExercises, ...exercises]
        };
      });
      return { ...prevData, workouts: newWorkouts };
    });

    setVisibleExercises((prev) => prev + exercises.length);
    setShowLibrary(false);

    setTimeout(() => {
      const listContainer = document.getElementById('exercise-list-container');
      if (listContainer) listContainer.scrollTop = listContainer.scrollHeight;
    }, 100);
  };

  const renderStep1 = () => (
    <div className="animate-fade-in">
      <h3 className="text-xl font-bold text-white mb-1">Configuração do Plano</h3>
      <p className="text-xs text-emerald-400 mb-8 uppercase tracking-widest font-bold">Passo 1 de 2 • Informações Gerais</p>

      <Input label="Nome do Aluno" value={data.studentName} onChange={(e) => setData({ ...data, studentName: e.target.value })} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Objetivo do Ciclo" placeholder="Ex: Hipertrofia, Força..." value={data.goal} onChange={(e) => setData({ ...data, goal: e.target.value })} />
        <Input label="Início" type="date" value={data.startDate} onChange={(e) => setData({ ...data, startDate: e.target.value })} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Duração (Semanas)" type="number" value={data.durationWeeks} onChange={(e) => setData({ ...data, durationWeeks: parseInt(e.target.value) })} />
        <Input label="Divisão (Ex: ABC)" value={data.splitType} onChange={(e) => setData({ ...data, splitType: e.target.value })} />
      </div>
      <TextArea label="Observações de Frequência" placeholder="Ex: Treinar 4 dias seguidos e descansar 1..." value={data.frequencyComments} onChange={(e) => setData({ ...data, frequencyComments: e.target.value })} />

      <div className="flex gap-4 mt-6">
        <Button variant="secondary" onClick={onBack} className="flex-1 py-4">Voltar</Button>
        <Button onClick={() => setStep(2)} className="flex-1 py-4">Montar Treinos</Button>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const currentWorkout = data.workouts[activeTab];
    const displayedExercises = currentWorkout.exercises.slice(0, visibleExercises);

    if (showLibrary) {
      return (
        <div className="fixed inset-0 z-[60] bg-slate-950 flex flex-col h-[100dvh] w-screen overflow-hidden">
          <div className="flex-1 h-full w-full">
            <ExerciseLibrary
              onBack={() => setShowLibrary(false)}
              onImport={handleImportFromLibrary}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="animate-fade-in pb-8">
        <div className="flex justify-between items-end mb-1">
          <h3 className="text-xl font-bold text-white">Montagem dos Treinos</h3>
          <p className="text-xs text-emerald-400 uppercase tracking-widest font-bold">Passo 2 de 2</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {data.workouts.map((w, i) => (
            <button
              key={w.id}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 rounded-lg font-bold text-sm whitespace-nowrap transition-all ${activeTab === i
                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                }`}
            >
              Treino {w.letter}
            </button>
          ))}
          <button onClick={addWorkout} className="px-3 py-2 rounded-lg bg-slate-800 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/10 font-bold">+</button>
        </div>

        <div className="bg-slate-900/50 border border-slate-700 rounded-xl p-4 sm:p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-lg font-black text-white flex items-center gap-2">
              <span className="bg-emerald-500 w-6 h-6 rounded flex items-center justify-center text-xs text-black">{currentWorkout.letter}</span>
              Editor de Sessão
            </h4>
            {data.workouts.length > 1 && (
              <button onClick={() => removeWorkout(activeTab)} className="text-red-400 text-xs hover:text-red-300 font-bold uppercase">Excluir</button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <Input label="Nome do Treino" placeholder="Ex: Peito e Tríceps" value={currentWorkout.name} onChange={(e) => updateWorkout(activeTab, 'name', e.target.value)} />

            <div className="flex flex-col gap-1 mb-4">
              <label className="text-sm font-medium text-slate-400">Dias da Semana</label>
              <div className="flex flex-wrap gap-2 mt-2">
                {DAYS_OF_WEEK.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleDay(activeTab, day)}
                    className={`w-8 h-8 rounded text-[10px] font-bold uppercase transition-all ${currentWorkout.days.includes(day)
                      ? 'bg-emerald-500 text-black'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold uppercase text-slate-500 tracking-wider">Lista de Exercícios</span>
            <button
              onClick={() => setShowLibrary(true)}
              className="flex items-center gap-1 text-xs font-bold text-violet-400 hover:text-violet-300 bg-violet-500/10 px-3 py-1.5 rounded-full border border-violet-500/30 transition-colors"
            >
              <span>📚</span> Importar da Biblioteca
            </button>
          </div>

          <div id="exercise-list-container" className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
            {displayedExercises.map((ex, exIndex) => (
              <div key={ex.id} className="bg-slate-800 p-3 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors group relative">
                <button
                  onClick={() => removeExercise(activeTab, exIndex)}
                  className="absolute top-2 right-2 text-slate-600 hover:text-red-400 p-1"
                >
                  ×
                </button>

                <div className="grid grid-cols-12 gap-2">
                  {/* Name - Full width on mobile */}
                  <div className="col-span-12">
                    <label className="text-[10px] text-slate-500 font-bold uppercase mb-1 block">Exercício</label>
                    <input
                      className="w-full bg-transparent text-white font-bold placeholder-slate-600 focus:outline-none text-base border-b border-slate-700/50 pb-2 focus:border-emerald-500 transition-colors appearance-none"
                      placeholder="Nome do Exercício"
                      value={ex.name}
                      onChange={(e) => updateExercise(activeTab, exIndex, 'name', e.target.value)}
                    />
                  </div>

                  {/* Metrics Row */}
                  <div className="col-span-4 sm:col-span-2">
                    <label className="text-[9px] text-slate-500 text-center uppercase block mb-1">Séries</label>
                    <input
                      className="w-full bg-slate-900/50 rounded px-2 py-3 text-base sm:text-sm text-emerald-400 font-mono text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none"
                      placeholder="3"
                      value={ex.sets}
                      onChange={(e) => updateExercise(activeTab, exIndex, 'sets', e.target.value)}
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <label className="text-[9px] text-slate-500 text-center uppercase block mb-1">Reps</label>
                    <input
                      className="w-full bg-slate-900/50 rounded px-2 py-3 text-base sm:text-sm text-emerald-400 font-mono text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none"
                      placeholder="12"
                      value={ex.reps}
                      onChange={(e) => updateExercise(activeTab, exIndex, 'reps', e.target.value)}
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <label className="text-[9px] text-slate-500 text-center uppercase block mb-1">Descanso</label>
                    <input
                      className="w-full bg-slate-900/50 rounded px-2 py-3 text-base sm:text-sm text-slate-300 font-mono text-center focus:outline-none focus:ring-1 focus:ring-emerald-500 appearance-none"
                      placeholder="60s"
                      value={ex.rest}
                      onChange={(e) => updateExercise(activeTab, exIndex, 'rest', e.target.value)}
                    />
                  </div>

                  {/* Technique - Full width below metrics */}
                  <div className="col-span-12 sm:col-span-6 mt-1">
                    <label className="text-[9px] text-slate-500 uppercase block mb-1">Técnica / Obs</label>
                    <input
                      className="w-full bg-slate-900/30 rounded px-3 py-3 text-base sm:text-sm text-slate-400 focus:outline-none focus:text-white appearance-none"
                      placeholder="Ex: Falha, Drop-set..."
                      value={ex.technique}
                      onChange={(e) => updateExercise(activeTab, exIndex, 'technique', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            {currentWorkout.exercises.length > visibleExercises && (
              <div ref={loaderRef} className="h-4 w-full flex justify-center items-center py-2">
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce mx-0.5"></span>
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce mx-0.5 [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 bg-slate-600 rounded-full animate-bounce mx-0.5 [animation-delay:0.4s]"></span>
              </div>
            )}
          </div>

          <button
            onClick={() => addExercise(activeTab)}
            className="w-full py-3 mt-4 border border-dashed border-slate-600 text-slate-400 text-sm font-bold uppercase rounded-lg hover:bg-slate-800 hover:text-white transition-colors"
          >
            + Adicionar Exercício Manual
          </button>

          <div className="mt-6">
            <TextArea label={`Observações do Treino ${currentWorkout.letter}`} placeholder="Recomendações específicas..." value={currentWorkout.notes} onChange={(e) => updateWorkout(activeTab, 'notes', e.target.value)} rows={2} />
          </div>

        </div>

        <div className="flex gap-4 mt-6">
          <Button variant="secondary" onClick={() => setStep(1)} className="flex-1 py-4">Voltar</Button>
          <Button onClick={() => onComplete(data)} className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-700 py-4 shadow-lg shadow-emerald-500/30">Gerar PDF</Button>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {!showLibrary && (
        <div className="flex justify-between mb-8 px-1 relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-800 -z-10 -translate-y-1/2 rounded"></div>
          {[1, 2].map(i => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full transition-all duration-500 border-2 ${step >= i ? 'bg-emerald-500 border-emerald-500 shadow-[0_0_10px_#10B981] scale-125' : 'bg-slate-900 border-slate-600'}`}
            />
          ))}
        </div>
      )}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
    </div>
  );
};
