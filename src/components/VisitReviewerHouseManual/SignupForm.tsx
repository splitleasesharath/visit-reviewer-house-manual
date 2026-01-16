// ============================================================
// SIGNUP FORM COMPONENT
// Split Lease Application - Guest Signup From House Manual
// ============================================================

import React, { useState, useEffect } from 'react';
import { SignupFormData, ValidationError } from '../../types';
import { validateSignupForm, getFieldError, clearFieldError, checkPasswordStrength } from '../../utils';
import { Button } from '../common';

// ============================================================
// TYPES
// ============================================================

interface SignupFormProps {
  houseManualId: string;
  propertyId?: string;
  onSubmit: (data: SignupFormData) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  error?: string | null;
}

// ============================================================
// ICONS
// ============================================================

const EyeIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const XCircleIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
);

// ============================================================
// PASSWORD STRENGTH INDICATOR
// ============================================================

interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ password }) => {
  const strength = checkPasswordStrength(password);

  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      {/* Strength Bar */}
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={`
              h-1 flex-1 rounded-full
              ${index < strength.score ? strengthColors[strength.score - 1] : 'bg-gray-200'}
            `}
          />
        ))}
      </div>
      <p className="text-xs text-gray-500">
        Password strength: {strength.score > 0 ? strengthLabels[strength.score - 1] : 'Too weak'}
      </p>

      {/* Requirements */}
      {strength.feedback.length > 0 && (
        <ul className="text-xs space-y-1">
          {strength.feedback.map((feedback, index) => (
            <li key={index} className="flex items-center gap-1 text-gray-500">
              <XCircleIcon className="h-3 w-3 text-gray-400" />
              {feedback}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ============================================================
// FORM INPUT COMPONENT
// ============================================================

interface FormInputProps {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  autoComplete,
  disabled = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';
  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`
            w-full px-3 py-2
            border rounded-lg
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${isPasswordField ? 'pr-10' : ''}
          `}
        />
        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOffIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

// ============================================================
// CHECKBOX COMPONENT
// ============================================================

interface CheckboxProps {
  id: string;
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  error?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  checked,
  onChange,
  error,
  disabled = false,
}) => {
  return (
    <div>
      <label className="flex items-start gap-2 cursor-pointer">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="
            mt-1 h-4 w-4
            rounded border-gray-300
            text-blue-600
            focus:ring-blue-500
          "
        />
        <span className="text-sm text-gray-600">{label}</span>
      </label>
      {error && <p className="mt-1 text-sm text-red-600 ml-6">{error}</p>}
    </div>
  );
};

// ============================================================
// SIGNUP FORM COMPONENT
// ============================================================

export const SignupForm: React.FC<SignupFormProps> = ({
  houseManualId,
  propertyId,
  onSubmit,
  onCancel,
  isLoading = false,
  error,
}) => {
  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    fullName: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false,
    privacyPolicyAccepted: false,
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validate on form data change (only for touched fields)
  useEffect(() => {
    const validationErrors = validateSignupForm(formData);
    setErrors(validationErrors);
  }, [formData]);

  const handleFieldChange = (field: keyof SignupFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => clearFieldError(prev, field));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    // Validate
    const validationErrors = validateSignupForm(formData);
    setErrors(validationErrors);

    if (validationErrors.length > 0) {
      return;
    }

    await onSubmit(formData);
  };

  const getError = (field: string) => {
    if (!touched[field]) return undefined;
    return getFieldError(errors, field);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Banner */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Email */}
      <FormInput
        id="email"
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(value) => handleFieldChange('email', value)}
        error={getError('email')}
        placeholder="your@email.com"
        required
        autoComplete="email"
        disabled={isLoading}
      />

      {/* Full Name */}
      <FormInput
        id="fullName"
        label="Full Name"
        value={formData.fullName}
        onChange={(value) => handleFieldChange('fullName', value)}
        error={getError('fullName')}
        placeholder="John Doe"
        autoComplete="name"
        disabled={isLoading}
      />

      {/* Phone Number */}
      <FormInput
        id="phoneNumber"
        label="Phone Number"
        type="tel"
        value={formData.phoneNumber}
        onChange={(value) => handleFieldChange('phoneNumber', value)}
        error={getError('phoneNumber')}
        placeholder="+1 (555) 123-4567"
        autoComplete="tel"
        disabled={isLoading}
      />

      {/* Password */}
      <div>
        <FormInput
          id="password"
          label="Password"
          type="password"
          value={formData.password}
          onChange={(value) => handleFieldChange('password', value)}
          error={getError('password')}
          placeholder="Create a password"
          required
          autoComplete="new-password"
          disabled={isLoading}
        />
        <PasswordStrengthIndicator password={formData.password} />
      </div>

      {/* Confirm Password */}
      <FormInput
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        value={formData.confirmPassword}
        onChange={(value) => handleFieldChange('confirmPassword', value)}
        error={getError('confirmPassword')}
        placeholder="Confirm your password"
        required
        autoComplete="new-password"
        disabled={isLoading}
      />

      {/* Terms and Privacy */}
      <div className="space-y-3 pt-2">
        <Checkbox
          id="termsAccepted"
          label={
            <>
              I agree to the{' '}
              <a href="/terms" className="text-blue-600 hover:underline" target="_blank">
                Terms of Service
              </a>
            </>
          }
          checked={formData.termsAccepted}
          onChange={(checked) => handleFieldChange('termsAccepted', checked)}
          error={getError('termsAccepted')}
          disabled={isLoading}
        />

        <Checkbox
          id="privacyPolicyAccepted"
          label={
            <>
              I agree to the{' '}
              <a href="/privacy" className="text-blue-600 hover:underline" target="_blank">
                Privacy Policy
              </a>
            </>
          }
          checked={formData.privacyPolicyAccepted}
          onChange={(checked) => handleFieldChange('privacyPolicyAccepted', checked)}
          error={getError('privacyPolicyAccepted')}
          disabled={isLoading}
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isLoading}
            fullWidth
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          fullWidth
        >
          Create Account
        </Button>
      </div>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-600">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Log in
        </a>
      </p>
    </form>
  );
};

export default SignupForm;
