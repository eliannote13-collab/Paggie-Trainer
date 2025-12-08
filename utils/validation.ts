/**
 * Validation utilities for form inputs, file uploads, and data validation
 */

// File Upload Validation
export const MAX_FILE_SIZE = parseInt(import.meta.env.VITE_MAX_FILE_SIZE || '5242880', 10); // 5MB default
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export const validateFileUpload = (file: File | null | undefined): FileValidationResult => {
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo selecionado.' };
  }

  // Check file type
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de arquivo não permitido. Use: ${ALLOWED_IMAGE_TYPES.join(', ')}`
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = (MAX_FILE_SIZE / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Arquivo muito grande. Tamanho máximo: ${maxSizeMB}MB`
    };
  }

  return { valid: true };
};

// Text Input Validation
export const validateTextLength = (text: string, maxLength: number, fieldName: string = 'Campo'): FileValidationResult => {
  if (text.length > maxLength) {
    return {
      valid: false,
      error: `${fieldName} deve ter no máximo ${maxLength} caracteres.`
    };
  }
  return { valid: true };
};

export const validateRequired = (value: string | number | null | undefined, fieldName: string = 'Campo'): FileValidationResult => {
  if (value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')) {
    return {
      valid: false,
      error: `${fieldName} é obrigatório.`
    };
  }
  return { valid: true };
};

// Numeric Validation
export interface NumericRange {
  min?: number;
  max?: number;
}

export const validateNumericRange = (
  value: number,
  range: NumericRange,
  fieldName: string = 'Campo'
): FileValidationResult => {
  if (range.min !== undefined && value < range.min) {
    return {
      valid: false,
      error: `${fieldName} deve ser no mínimo ${range.min}.`
    };
  }
  if (range.max !== undefined && value > range.max) {
    return {
      valid: false,
      error: `${fieldName} deve ser no máximo ${range.max}.`
    };
  }
  return { valid: true };
};

// Email Validation
export const validateEmail = (email: string): FileValidationResult => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: 'E-mail inválido.'
    };
  }
  return { valid: true };
};

// Password Validation
export interface PasswordValidationResult extends FileValidationResult {
  strength?: 'weak' | 'medium' | 'strong';
  suggestions?: string[];
}

export const validatePassword = (password: string): PasswordValidationResult => {
  if (!password) {
    return {
      valid: false,
      error: 'Senha é obrigatória.',
      strength: 'weak'
    };
  }

  if (password.length < 6) {
    return {
      valid: false,
      error: 'Senha deve ter no mínimo 6 caracteres.',
      strength: 'weak',
      suggestions: ['Use pelo menos 6 caracteres']
    };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  let strength: 'weak' | 'medium' | 'strong' = 'weak';
  const suggestions: string[] = [];

  if (password.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers) {
    strength = hasSpecialChar ? 'strong' : 'medium';
  } else if (password.length >= 6) {
    strength = 'medium';
  }

  if (!hasUpperCase) suggestions.push('Adicione letras maiúsculas');
  if (!hasLowerCase) suggestions.push('Adicione letras minúsculas');
  if (!hasNumbers) suggestions.push('Adicione números');
  if (!hasSpecialChar && password.length < 8) suggestions.push('Adicione caracteres especiais para maior segurança');

  return {
    valid: password.length >= 6,
    error: password.length < 6 ? 'Senha deve ter no mínimo 6 caracteres.' : undefined,
    strength,
    suggestions: suggestions.length > 0 ? suggestions : undefined
  };
};

// Date Validation
export const validateDate = (date: string, fieldName: string = 'Data'): FileValidationResult => {
  if (!date) {
    return { valid: false, error: `${fieldName} é obrigatória.` };
  }

  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: `${fieldName} inválida.` };
  }

  return { valid: true };
};

// Phone Validation (Brazilian format)
export const validatePhone = (phone: string): FileValidationResult => {
  const phoneRegex = /^[\d\s\(\)\-\+]+$/;
  if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
    return {
      valid: false,
      error: 'Telefone inválido. Use o formato: (XX) XXXXX-XXXX'
    };
  }
  return { valid: true };
};




