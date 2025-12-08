
export interface TrainerProfile {
  name: string;
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'heavy' | 'athlete';
export type CommitmentLevel = 'Excelente' | 'Bom' | 'Regular' | 'Baixo';

export interface BodyMetrics {
  weight: number;
  bodyFat: number; // %
  neck: number;
  shoulders: number;
  chest: number;
  armRight: number;
  armLeft: number;
  forearmRight: number;
  forearmLeft: number;
  waist: number;
  abdomen: number;
  hips: number;
  thighRight: number;
  thighLeft: number;
  calfRight: number;
  calfLeft: number;
}

export interface PhysicalTests {
  pushups: number; // reps
  squats: number; // reps (1 min)
  plank: number; // seconds
  pullups: number; // reps
  restingHR: number; // bpm
  run12min: number; // meters
  pace: string; // min/km
}

export interface AssessmentData {
  // Header Info
  studentName: string;
  age: number;
  height: number; // cm
  gender: 'male' | 'female';
  goal: string;
  date: string;
  
  // Section 1: General Summary
  commitment: CommitmentLevel;
  adherenceRate: number; // %
  workoutsPerMonth: number;
  generalComments: string;

  // Comparative Data (Sections 2, 3, 5, 6)
  initial: BodyMetrics;
  current: BodyMetrics;
  
  initialTests: PhysicalTests;
  currentTests: PhysicalTests;

  // Section 4: Photos (Base64)
  photos: {
    frontBefore?: string;
    frontAfter?: string;
    sideBefore?: string;
    sideAfter?: string;
    backBefore?: string;
    backAfter?: string;
  };

  // Section 7: Analysis (Input by User or AI)
  manualTechnicalAnalysis: string; 

  // Section 8: Recommendations (Input by User)
  recLoad: string;
  recIntensity: string;
  recHabits: string;
  nextGoal: string;
  manualConclusion: string;
}

// --- PHYSICAL ASSESSMENT (TESTS) TYPES ---
export interface PhysicalAssessmentData {
    studentName: string;
    date: string;
    age: number;
    gender: 'Masculino' | 'Feminino';
    
    // Cardiorespiratory
    restingHR: string;
    vo2Max: string; // Estimated
    testCooper: string; // Distance in m

    // Neuromuscular
    pushUpTest: string; // Reps
    sitUpTest: string; // Reps
    squatTest: string; // Reps
    plankTest: string; // Time

    // Flexibility
    sitAndReach: string; // Wells cm

    // Postural Analysis
    postureHead: string; // e.g., "Protrusa"
    postureShoulders: string; // e.g., "Protusos", "Deprimidos"
    postureSpine: string; // e.g., "Hipercifose", "Hiperlordose"
    postureHips: string; // e.g., "Anteversão"
    postureKnees: string; // e.g., "Valgo", "Varo"
    postureFeet: string; // e.g., "Plano", "Cavo"
    
    // Final
    considerations: string;
}

// --- NEW TYPES FOR TRAINING PLAN ---

export interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  rest: string; // seconds or description
  technique: string; // e.g., "Falha concêntrica", "Drop-set"
}

export interface WorkoutSession {
  id: string;
  letter: string; // A, B, C...
  name: string; // "Peito e Tríceps"
  days: string[]; // ["Seg", "Qui"]
  exercises: Exercise[];
  notes: string;
}

export interface TrainingPlanData {
  studentName: string;
  goal: string;
  startDate: string;
  durationWeeks: number;
  splitType: string; // "ABC", "Full Body", etc.
  frequencyComments: string; // "Treinar 4x na semana"
  workouts: WorkoutSession[];
}

export interface AIAnalysisResult {
  // AI Generated Content
  analysisText: string; // Narrativa técnica completa
  conclusion: string; // Fechamento curto
}

// --- EXERCISE LIBRARY TYPES ---
export interface LibraryItem {
  id: string;
  name: string;
  category: string;
  defaultSets?: string;
  defaultReps?: string;
}

// --- ANAMNESE TYPES (CLINICAL CHECKLIST) ---
export interface AnamneseData {
    // I. Identificação
    studentName: string;
    date: string;
    birthDate: string;
    age: number;
    gender: 'Masculino' | 'Feminino' | 'Outro';
    maritalStatus: string;
    profession: string;
    phone: string;
    email: string;
    address: string;

    // II. Queixa Principal (QP)
    mainComplaint: string;
    complaintDuration: string;
    associatedSymptoms: string;

    // III. História da Doença Atual (HDA)
    hdaOnset: string; // Início
    hdaEvolution: string; // Evolução
    hdaFactors: string; // Melhora/Piora
    hdaIntensity: string; // 0-10
    previousTreatments: string;

    // IV. História Médica Pregressa
    chronicDiseases: string; // Diabetes, Hipertensão...
    surgeries: string;
    hospitalizations: string;
    traumas: string;
    vaccinationStatus: string;
    allergies: string;

    // V. Medicamentos
    medications: string; // Nome, dose, motivo
    adherence: string; // Toma corretamente?
    supplements: string;

    // VI. Antecedentes Familiares
    familyHistory: string; // Pais, irmãos, doenças hereditárias

    // VII. Hábitos de Vida
    smoking: string; // Fuma? Quanto tempo?
    alcohol: string; // Frequência
    substances: string; // Outras
    diet: string; // Padrão alimentar
    physicalActivity: string; // Atual
    sleep: string; // Qualidade/Duração
    stressLevel: string;
    waterIntake: string; // Ingestão de água

    // VIII. Revisão por Sistemas
    systemGeneral: string; // Febre, peso...
    systemRespiratory: string;
    systemCardiovascular: string;
    systemGastro: string;
    systemNeuro: string;
    systemPsych: string;

    // IX. Exame Físico
    bp: string; // Pressão Arterial
    hr: string; // Freq Cardíaca
    respRate: string; // Freq Respiratória
    temp: string; // Temperatura
    weight: string;
    height: string;
    bmi: string; // IMC
    waistCirc: string;
    generalInspection: string;

    // X. Considerações Finais e Plano
    diagnosisHypothesis: string;
    requestedExams: string;
    therapeuticPlan: string; // Conduta
    nextVisit: string;
}

// --- CHAT TYPES ---
export interface ChatMessage {
    id: string;
    role: 'user' | 'model';
    text: string;
    timestamp: number;
}

export type AppStep = 'auth' | 'onboarding' | 'mode-selection' | 'library' | 'assessment' | 'training-form' | 'analyzing' | 'report' | 'training-report' | 'anamnese-form' | 'anamnese-report' | 'physical-assessment-form' | 'physical-assessment-report' | 'chat-paggie';
