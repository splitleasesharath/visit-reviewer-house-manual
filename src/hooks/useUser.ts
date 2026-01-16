// ============================================================
// USE USER HOOK
// Split Lease Application - User Management Hook
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { userService } from '../services';
import {
  User,
  SignupGuestRequest,
  PhoneVerificationRequest,
  VerifyCodeRequest,
  ApiError,
} from '../types';

// ============================================================
// USE CURRENT USER HOOK
// ============================================================

interface UseCurrentUserReturn {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useCurrentUser = (): UseCurrentUserReturn => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<ApiError | null>(null);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const currentUser = await userService.getCurrentUser();
      setUser(currentUser);
    } catch (err) {
      const apiError = err as ApiError;
      // 401 is expected when not authenticated
      if (apiError.code !== 401) {
        setError(apiError);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    try {
      await userService.logout();
      setUser(null);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError);
    }
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    error,
    refetch: fetchUser,
    logout,
  };
};

// ============================================================
// USE GUEST SIGNUP HOOK
// ============================================================

interface UseGuestSignupReturn {
  signup: (request: SignupGuestRequest) => Promise<boolean>;
  isLoading: boolean;
  error: ApiError | null;
  user: User | null;
  clearError: () => void;
}

export const useGuestSignup = (): UseGuestSignupReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const signup = useCallback(async (request: SignupGuestRequest): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userService.signupGuestFromHouseManual(request);

      if (response.success && response.user) {
        setUser(response.user);
        return true;
      } else {
        setError(response.error || { code: 500, message: 'Signup failed' });
        return false;
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError({
        code: apiError.code || 500,
        message: apiError.message || 'An unexpected error occurred',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    signup,
    isLoading,
    error,
    user,
    clearError,
  };
};

// ============================================================
// USE PHONE VERIFICATION HOOK
// ============================================================

interface UsePhoneVerificationReturn {
  requestVerification: (request: PhoneVerificationRequest) => Promise<string | null>;
  verifyCode: (request: VerifyCodeRequest) => Promise<boolean>;
  isLoading: boolean;
  isSending: boolean;
  isVerifying: boolean;
  error: string | null;
  remainingAttempts: number | null;
  verificationId: string | null;
  isVerified: boolean;
  clearError: () => void;
  reset: () => void;
}

export const usePhoneVerification = (): UsePhoneVerificationReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean>(false);

  const requestVerification = useCallback(
    async (request: PhoneVerificationRequest): Promise<string | null> => {
      setIsLoading(true);
      setIsSending(true);
      setError(null);

      try {
        const response = await userService.requestPhoneVerification(request);

        if (response.success && response.verificationId) {
          setVerificationId(response.verificationId);
          setRemainingAttempts(3); // Default max attempts
          return response.verificationId;
        } else {
          setError(response.error || 'Failed to send verification code');
          return null;
        }
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Failed to send verification code');
        return null;
      } finally {
        setIsLoading(false);
        setIsSending(false);
      }
    },
    []
  );

  const verifyCode = useCallback(async (request: VerifyCodeRequest): Promise<boolean> => {
    setIsLoading(true);
    setIsVerifying(true);
    setError(null);

    try {
      const response = await userService.verifyPhoneCode(request);

      if (response.isVerified) {
        setIsVerified(true);
        return true;
      } else {
        if (response.remainingAttempts !== undefined) {
          setRemainingAttempts(response.remainingAttempts);
        }
        setError(response.error || 'Invalid verification code');
        return false;
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Verification failed');
      return false;
    } finally {
      setIsLoading(false);
      setIsVerifying(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setVerificationId(null);
    setRemainingAttempts(null);
    setIsVerified(false);
  }, []);

  return {
    requestVerification,
    verifyCode,
    isLoading,
    isSending,
    isVerifying,
    error,
    remainingAttempts,
    verificationId,
    isVerified,
    clearError,
    reset,
  };
};

// ============================================================
// USE LOGIN HOOK
// ============================================================

interface UseLoginReturn {
  login: (email: string, password: string) => Promise<boolean>;
  loginWithMagicLink: (token: string) => Promise<boolean>;
  isLoading: boolean;
  error: ApiError | null;
  clearError: () => void;
}

export const useLogin = (): UseLoginReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await userService.login(email, password);
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError({
        code: apiError.code || 401,
        message: apiError.message || 'Invalid email or password',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithMagicLink = useCallback(async (token: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await userService.loginWithMagicLink(token);
      return true;
    } catch (err) {
      const apiError = err as ApiError;
      setError({
        code: apiError.code || 401,
        message: apiError.message || 'Invalid or expired link',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    login,
    loginWithMagicLink,
    isLoading,
    error,
    clearError,
  };
};

export default useCurrentUser;
