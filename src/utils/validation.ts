// ============================================================
// VALIDATION UTILITIES
// Split Lease Application - Form & Data Validation
// ============================================================

import { ValidationError } from '../types';

// ============================================================
// EMAIL VALIDATION
// ============================================================

/**
 * Validate email format
 * @param email - Email to validate
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate email with detailed error
 * @param email - Email to validate
 */
export const validateEmail = (email: string): ValidationError | null => {
  if (!email || email.trim() === '') {
    return { field: 'email', message: 'Email is required' };
  }
  if (!isValidEmail(email)) {
    return { field: 'email', message: 'Please enter a valid email address' };
  }
  return null;
};

// ============================================================
// PASSWORD VALIDATION
// ============================================================

interface PasswordStrength {
  isValid: boolean;
  score: number; // 0-4
  feedback: string[];
}

/**
 * Check password strength
 * @param password - Password to check
 */
export const checkPasswordStrength = (password: string): PasswordStrength => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('Password must be at least 8 characters');
  }

  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one uppercase letter');
  }

  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one lowercase letter');
  }

  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('Include at least one number');
  }

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    score += 1;
  }

  return {
    isValid: score >= 4,
    score: Math.min(score, 4),
    feedback,
  };
};

/**
 * Validate password
 * @param password - Password to validate
 */
export const validatePassword = (password: string): ValidationError | null => {
  if (!password || password.trim() === '') {
    return { field: 'password', message: 'Password is required' };
  }

  const strength = checkPasswordStrength(password);
  if (!strength.isValid) {
    return { field: 'password', message: strength.feedback.join('. ') };
  }

  return null;
};

/**
 * Validate password confirmation
 * @param password - Original password
 * @param confirmPassword - Confirmation password
 */
export const validatePasswordConfirmation = (
  password: string,
  confirmPassword: string
): ValidationError | null => {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return { field: 'confirmPassword', message: 'Please confirm your password' };
  }
  if (password !== confirmPassword) {
    return { field: 'confirmPassword', message: 'Passwords do not match' };
  }
  return null;
};

// ============================================================
// PHONE NUMBER VALIDATION
// ============================================================

/**
 * Format phone number to E.164 format
 * @param phone - Phone number to format
 * @param countryCode - Country code (default: US +1)
 */
export const formatPhoneNumber = (phone: string, countryCode: string = '1'): string => {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // If already has country code, return as is
  if (digits.startsWith(countryCode)) {
    return `+${digits}`;
  }

  // Add country code
  return `+${countryCode}${digits}`;
};

/**
 * Validate phone number
 * @param phone - Phone number to validate
 */
export const validatePhoneNumber = (phone: string): ValidationError | null => {
  if (!phone || phone.trim() === '') {
    return null; // Phone is optional
  }

  const digits = phone.replace(/\D/g, '');
  if (digits.length < 10 || digits.length > 15) {
    return { field: 'phoneNumber', message: 'Please enter a valid phone number' };
  }

  return null;
};

/**
 * Check if phone number is valid
 * @param phone - Phone number to check
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 15;
};

// ============================================================
// NAME VALIDATION
// ============================================================

/**
 * Validate name
 * @param name - Name to validate
 * @param fieldName - Field name for error message
 * @param required - Whether the field is required
 */
export const validateName = (
  name: string,
  fieldName: string = 'Name',
  required: boolean = false
): ValidationError | null => {
  if (!name || name.trim() === '') {
    if (required) {
      return { field: fieldName.toLowerCase(), message: `${fieldName} is required` };
    }
    return null;
  }

  if (name.trim().length < 2) {
    return { field: fieldName.toLowerCase(), message: `${fieldName} must be at least 2 characters` };
  }

  if (name.trim().length > 100) {
    return { field: fieldName.toLowerCase(), message: `${fieldName} must be less than 100 characters` };
  }

  return null;
};

// ============================================================
// VERIFICATION CODE VALIDATION
// ============================================================

/**
 * Validate verification code
 * @param code - Code to validate
 * @param length - Expected code length (default: 6)
 */
export const validateVerificationCode = (
  code: string,
  length: number = 6
): ValidationError | null => {
  if (!code || code.trim() === '') {
    return { field: 'code', message: 'Verification code is required' };
  }

  const digits = code.replace(/\D/g, '');
  if (digits.length !== length) {
    return { field: 'code', message: `Please enter a ${length}-digit code` };
  }

  return null;
};

// ============================================================
// FORM VALIDATION
// ============================================================

interface SignupFormValidation {
  email: string;
  fullName: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
  privacyPolicyAccepted: boolean;
}

/**
 * Validate signup form
 * @param formData - Form data to validate
 */
export const validateSignupForm = (formData: SignupFormValidation): ValidationError[] => {
  const errors: ValidationError[] = [];

  const emailError = validateEmail(formData.email);
  if (emailError) errors.push(emailError);

  const nameError = validateName(formData.fullName, 'Full name', false);
  if (nameError) errors.push(nameError);

  const phoneError = validatePhoneNumber(formData.phoneNumber);
  if (phoneError) errors.push(phoneError);

  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.push(passwordError);

  const confirmError = validatePasswordConfirmation(formData.password, formData.confirmPassword);
  if (confirmError) errors.push(confirmError);

  if (!formData.termsAccepted) {
    errors.push({ field: 'termsAccepted', message: 'You must accept the terms of service' });
  }

  if (!formData.privacyPolicyAccepted) {
    errors.push({
      field: 'privacyPolicyAccepted',
      message: 'You must accept the privacy policy',
    });
  }

  return errors;
};

interface ShareFormValidation {
  recipientEmail: string;
  recipientPhone?: string;
  deliveryMethod: 'email' | 'sms' | 'both';
}

/**
 * Validate share form
 * @param formData - Form data to validate
 */
export const validateShareForm = (formData: ShareFormValidation): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (formData.deliveryMethod === 'email' || formData.deliveryMethod === 'both') {
    const emailError = validateEmail(formData.recipientEmail);
    if (emailError) errors.push(emailError);
  }

  if (formData.deliveryMethod === 'sms' || formData.deliveryMethod === 'both') {
    if (!formData.recipientPhone || formData.recipientPhone.trim() === '') {
      errors.push({ field: 'recipientPhone', message: 'Phone number is required for SMS delivery' });
    } else {
      const phoneError = validatePhoneNumber(formData.recipientPhone);
      if (phoneError) errors.push(phoneError);
    }
  }

  return errors;
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Check if form has errors
 * @param errors - Array of validation errors
 */
export const hasErrors = (errors: ValidationError[]): boolean => {
  return errors.length > 0;
};

/**
 * Get error for a specific field
 * @param errors - Array of validation errors
 * @param fieldName - Field name to get error for
 */
export const getFieldError = (
  errors: ValidationError[],
  fieldName: string
): string | undefined => {
  const error = errors.find((e) => e.field === fieldName);
  return error?.message;
};

/**
 * Clear error for a specific field
 * @param errors - Array of validation errors
 * @param fieldName - Field name to clear error for
 */
export const clearFieldError = (
  errors: ValidationError[],
  fieldName: string
): ValidationError[] => {
  return errors.filter((e) => e.field !== fieldName);
};
