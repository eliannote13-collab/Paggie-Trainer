import Groq from "groq-sdk";
import { AssessmentData, AIAnalysisResult, ChatMessage } from "../types";

// ==============================================================================
// 🔑 CONFIGURAÇÃO DA IA
// Configure a API Key através da variável de ambiente VITE_GROQ_API_KEY
// Obtenha em: https://console.groq.com/keys
// ==============================================================================

const GROQ_MODEL = "llama-3.3-70b-versatile";

// Helper para obter chave de variáveis de ambiente
const getValidKey = (): string | null => {
  const envKey = import.meta.env.VITE_GROQ_API_KEY;
  if (envKey && envKey.trim() !== '') {
    // Log de segurança (apenas primeiros caracteres)
    console.log("✅ Groq API Key encontrada:", envKey.substring(0, 8) + "...");
    return envKey.trim();
  }
  console.warn("⚠️ Groq API Key NÃO encontrada em VITE_GROQ_API_KEY");
  return null;
};

// Instância do Cliente Groq
// dangerouslyAllowBrowser: true é necessário pois estamos no Vite (Client-side)
const getClient = () => {
  const apiKey = getValidKey();
  if (!apiKey) return null;

  return new Groq({
    apiKey,
    dangerouslyAllowBrowser: true
  });
};

// Função de Fallback (Caso a IA falhe ou não tenha chave)
const getManualFallback = (assessment: AssessmentData): AIAnalysisResult => {
  const analysisBody = assessment.manualTechnicalAnalysis
    ? assessment.manualTechnicalAnalysis.replace(/\n/g, '<br>')
    : "Análise técnica pendente. Dados insuficientes para geração automática.<br><br>Por favor, configure VITE_GROQ_API_KEY no arquivo <b>.env</b> para ativar a Inteligência Artificial.";

  const conclusionText = assessment.manualConclusion || `Adesão: ${assessment.adherenceRate}%. Foco: ${assessment.nextGoal || "Consistência"}.`;

  return {
    analysisText: analysisBody,
    conclusion: conclusionText
  };
};

/**
 * Tenta limpar e parsear JSON de respostas que podem vir com markdown
 */
const safeJsonParse = (text: string): any => {
  try {
    // Tenta parse direto
    return JSON.parse(text);
  } catch {
    // Remove code blocks ```json ou ```
    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    try {
      return JSON.parse(cleanText);
    } catch {
      return null;
    }
  }
};

export const generateAssessmentReport = async (
  assessment: AssessmentData
): Promise<AIAnalysisResult> => {
  const client = getClient();

  if (!client) {
    console.warn("API Key não encontrada. Usando modo offline/manual.");
    return getManualFallback(assessment);
  }

  try {
    const prompt = `
      ATENÇÃO: VOCÊ AGORA É UM "CONTROLADOR DE QUALIDADE DE IA ESPECIALISTA EM FITNESS".
      
      SUA MISSÃO:
      Analisar os dados de entrada, detectar inconsistências e gerar um relatório técnico perfeito, honesto e motivador.
      Você NÃO deve apenas descrever os dados, deve INTERPRETAR a realidade fisiológica por trás deles.

      1. DADOS DE ENTRADA:
      Nome: ${assessment.studentName}
      Objetivo: ${assessment.goal}
      Adesão Declarada: ${assessment.adherenceRate}%
      
      2. MÉTRICAS (Início -> Atual):
      - Peso Corporal: ${assessment.initial.weight.toFixed(1)}kg -> ${assessment.current.weight.toFixed(1)}kg
      - % Gordura: ${assessment.initial.bodyFat.toFixed(1)}% -> ${assessment.current.bodyFat.toFixed(1)}%
      - Cintura: ${assessment.initial.waist.toFixed(1)}cm -> ${assessment.current.waist.toFixed(1)}cm
      
      3. CONTEXTO DO TREINADOR:
      "${assessment.manualTechnicalAnalysis}"

      4. PROTOCOLO DE VALIDAÇÃO (QC):
      [CRÍTICO] CHECAGEM DE DADOS ZERADOS:
      - Se (Peso Inicial == 0 OR Gordura Inicial == 0), você ESTÁ PROIBIDO de calcular "perda" ou "ganho".
      - Neste caso, escreva: "Ainda não possuímos dados iniciais suficientes para um comparativo detalhado de composição corporal, mas [fale sobre a adesão ou o peso atual]."
      
      [CRÍTICO] CHECAGEM DE LÓGICA:
      - Se (Peso caiu E Gordura Subiu) -> Alerta de perda de massa magra.
      - Se (Peso subiu E Gordura Caiu) -> Elogio máximo (Recomposição corporal).
      - Se (Adesão < 70%) -> Seja firme sobre a necessidade de constância, sem ser rude.

      5. REGRAS DE FORMATAÇÃO (ESTRITAS):
      - Use APENAS HTML para formatação.
      - <b>Texto em Negrito</b> para destacar conquistas e números.
      - <br> para pular linhas.
      - PROIBIDO: Markdown (**, ##, -), Listas com hífens (use frases fluidas).

      6. SAÍDA JSON REQUERIDA:
      {
        "analysisText": "Texto corrido, analítico e formatado em HTML (2-3 parágrafos).",
        "conclusion": "Uma frase de fechamento motivacional curta (Max 15 palavras)."
      }
    `;

    const completion = await client.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: "Você é um assistente JSON que gera análises de fitness. Responda APENAS com JSON válido."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.5, // Lower temperature for JSON stability
      response_format: { type: "json_object" }
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      throw new Error("Conteúdo da resposta vazio.");
    }

    const jsonResult = safeJsonParse(content);

    if (jsonResult) {
      return {
        analysisText: jsonResult.analysisText || "Análise gerada.",
        conclusion: jsonResult.conclusion || "Continue focado."
      };
    } else {
      console.warn("Falha no parse JSON da IA. Usando texto bruto.");
      return {
        analysisText: content,
        conclusion: "Foco nos resultados."
      };
    }

  } catch (error: any) {
    console.error("Erro ao gerar relatório com IA:", error);
    if (error?.message) console.error("Detalhes:", error.message);
    return getManualFallback(assessment);
  }
};

export const sendChatMessage = async (
  history: ChatMessage[],
  newMessage: string
): Promise<string> => {
  console.log("📨 Enviando mensagem para ChatPaggie...", newMessage);
  const client = getClient();

  if (!client) {
    console.error("❌ Cliente Groq não pode ser inicializado (Sem Chave).");
    return "⚠️ Erro de Configuração: API Key não encontrada no arquivo .env (VITE_GROQ_API_KEY).";
  }

  try {
    const systemInstruction = `
      Você é o ChatPAGGIE, um Assistente Especialista em Prescrição de Treinamento Físico e Fisiologia do Exercício.
      
      SUA MISSÃO:
      Fornecer sugestões de treino estruturadas, seguras e baseadas em ciência para Personal Trainers.
      
      REGRAS DE COMPORTAMENTO:
      1. FOCO TOTAL: Você só responde sobre musculação, cardio, reabilitação, periodização e nutrição esportiva básica. Se perguntarem sobre política, código ou receitas de bolo, recuse educadamente e volte ao tema fitness.
      2. FORMATO DE RESPOSTA:
         - Seja direto. Não enrole.
         - Ao sugerir treinos, use listas ou "bullet points".
         - Exemplo: "Treino A (Peito): 1. Supino (3x10)..."
      3. SEGURANÇA: Se o usuário mencionar lesões graves (ex: "Hérnia de disco aguda"), sugira exercícios adaptados mas sempre recomende avaliação médica.
      4. TOM: Profissional, técnico mas acessível (Senior Coach).
    `;

    // Map Types to Groq API
    const messages = history.map(msg => ({
      role: msg.role === 'model' ? 'assistant' : 'user',
      content: msg.text
    } as const));

    console.log("📤 Payload para Groq:", { model: GROQ_MODEL, messages: messages });

    const completion = await client.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemInstruction },
        ...messages,
        { role: "user", content: newMessage }
      ],
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    console.log("📥 Resposta recebida:", response ? "Conteúdo OK" : "Vazio");

    return response || "Desculpe, a IA retornou uma resposta vazia.";

  } catch (error: any) {
    console.error("❌ Erro CRÍTICO no ChatPAGGIE:", error);

    // Extrair mensagem de erro detalhada da API Groq se disponível
    const apiError = error?.error?.message || error?.message || JSON.stringify(error);

    if (apiError.includes('401')) {
      return `⛔ Erro de Autenticação (401): Sua API Key parece inválida ou expirada.`;
    }
    if (apiError.includes('429')) {
      return `⏳ Limite de requisições excedido (429). Tente novamente em alguns segundos.`;
    }

    return `⚠️ Erro no processamento: ${apiError}`;
  }
};
