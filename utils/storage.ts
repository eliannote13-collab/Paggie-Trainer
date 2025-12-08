/**
 * LocalStorage utilities with quota checking and error handling
 */

export interface StorageResult {
  success: boolean;
  error?: string;
}

/**
 * Check if LocalStorage is available and has quota
 */
export const checkLocalStorageQuota = (): { available: boolean; error?: string } => {
  try {
    if (typeof Storage === 'undefined') {
      return { available: false, error: 'LocalStorage não está disponível neste navegador.' };
    }

    // Try to write a test value
    const testKey = '__storage_test__';
    const testValue = 'test';
    localStorage.setItem(testKey, testValue);
    localStorage.removeItem(testKey);

    return { available: true };
  } catch (e: any) {
    // QuotaExceededError or other storage errors
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      return {
        available: false,
        error: 'Armazenamento local cheio. Limpe alguns dados e tente novamente.'
      };
    }
    return {
      available: false,
      error: 'Erro ao acessar armazenamento local.'
    };
  }
};

/**
 * Safely set item in LocalStorage with quota checking
 */
export const safeSetItem = (key: string, value: string): StorageResult => {
  const quotaCheck = checkLocalStorageQuota();
  if (!quotaCheck.available) {
    return {
      success: false,
      error: quotaCheck.error || 'Armazenamento local não disponível.'
    };
  }

  try {
    localStorage.setItem(key, value);
    return { success: true };
  } catch (e: any) {
    if (e.name === 'QuotaExceededError' || e.code === 22) {
      return {
        success: false,
        error: 'Armazenamento local cheio. Limpe alguns dados e tente novamente.'
      };
    }
    return {
      success: false,
      error: 'Erro ao salvar no armazenamento local.'
    };
  }
};

/**
 * Safely get item from LocalStorage
 */
export const safeGetItem = (key: string): { success: boolean; value: string | null; error?: string } => {
  try {
    const value = localStorage.getItem(key);
    return { success: true, value };
  } catch (e: any) {
    return {
      success: false,
      value: null,
      error: 'Erro ao ler do armazenamento local.'
    };
  }
};

/**
 * Safely remove item from LocalStorage
 */
export const safeRemoveItem = (key: string): StorageResult => {
  try {
    localStorage.removeItem(key);
    return { success: true };
  } catch (e: any) {
    return {
      success: false,
      error: 'Erro ao remover do armazenamento local.'
    };
  }
};

/**
 * Get estimated storage usage (approximate)
 */
export const getStorageUsage = (): { used: number; available: boolean } => {
  try {
    let total = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return { used: total, available: true };
  } catch {
    return { used: 0, available: false };
  }
};




