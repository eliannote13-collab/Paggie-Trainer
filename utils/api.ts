/**
 * API utilities with timeout handling and error management
 */

const DEFAULT_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000', 10); // 30 seconds default

export interface ApiCallOptions {
  timeout?: number;
  signal?: AbortSignal;
}

/**
 * Create a timeout promise that rejects after specified milliseconds
 */
const createTimeout = (ms: number): Promise<never> => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Request timeout após ${ms}ms`));
    }, ms);
  });
};

/**
 * Execute a promise with timeout
 */
export const withTimeout = <T>(
  promise: Promise<T>,
  timeoutMs: number = DEFAULT_TIMEOUT
): Promise<T> => {
  return Promise.race([
    promise,
    createTimeout(timeoutMs)
  ]);
};

/**
 * Wrapper for API calls with timeout and error handling
 */
export const safeApiCall = async <T>(
  apiCall: () => Promise<T>,
  options: ApiCallOptions = {}
): Promise<{ success: boolean; data?: T; error?: string }> => {
  const timeout = options.timeout || DEFAULT_TIMEOUT;
  const controller = new AbortController();
  const signal = options.signal || controller.signal;

  try {
    const result = await withTimeout(apiCall(), timeout);
    return { success: true, data: result };
  } catch (error: any) {
    if (signal.aborted) {
      return {
        success: false,
        error: 'Request cancelado pelo usuário.'
      };
    }

    if (error.message?.includes('timeout')) {
      return {
        success: false,
        error: 'Tempo de espera esgotado. Verifique sua conexão e tente novamente.'
      };
    }

    return {
      success: false,
      error: error.message || 'Erro ao processar requisição.'
    };
  }
};




