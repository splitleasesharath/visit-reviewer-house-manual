// ============================================================
// USE MAGIC LINK HOOK
// Split Lease Application - Magic Link Management Hook
// ============================================================

import { useState, useCallback } from 'react';
import { magicLinkService } from '../services';
import { MagicLink, MagicLinkRequest, ApiError } from '../types';

// ============================================================
// USE CREATE MAGIC LINK HOOK
// ============================================================

interface UseCreateMagicLinkReturn {
  createLink: (request: MagicLinkRequest) => Promise<MagicLink | null>;
  isLoading: boolean;
  error: string | null;
  magicLink: MagicLink | null;
  shortUrl: string | null;
  qrCodeUrl: string | null;
  clearError: () => void;
  reset: () => void;
}

export const useCreateMagicLink = (): UseCreateMagicLinkReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [magicLink, setMagicLink] = useState<MagicLink | null>(null);
  const [shortUrl, setShortUrl] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const createLink = useCallback(
    async (request: MagicLinkRequest): Promise<MagicLink | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await magicLinkService.createMagicLink(request);

        if (response.success && response.magicLink) {
          setMagicLink(response.magicLink);
          setShortUrl(response.shortUrl || null);
          setQrCodeUrl(response.qrCodeUrl || null);
          return response.magicLink;
        } else {
          setError(response.error || 'Failed to create magic link');
          return null;
        }
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Failed to create magic link');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setMagicLink(null);
    setShortUrl(null);
    setQrCodeUrl(null);
  }, []);

  return {
    createLink,
    isLoading,
    error,
    magicLink,
    shortUrl,
    qrCodeUrl,
    clearError,
    reset,
  };
};

// ============================================================
// USE VALIDATE MAGIC LINK HOOK
// ============================================================

interface UseValidateMagicLinkReturn {
  validateLink: (token: string) => Promise<boolean>;
  isValidating: boolean;
  isValid: boolean | null;
  houseManualId: string | null;
  expiresAt: string | null;
  error: string | null;
  reset: () => void;
}

export const useValidateMagicLink = (): UseValidateMagicLinkReturn => {
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [houseManualId, setHouseManualId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateLink = useCallback(async (token: string): Promise<boolean> => {
    setIsValidating(true);
    setError(null);

    try {
      const result = await magicLinkService.validateMagicLink(token);

      setIsValid(result.isValid);
      setHouseManualId(result.houseManualId || null);
      setExpiresAt(result.expiresAt || null);

      if (!result.isValid) {
        if (result.isExpired) {
          setError('This link has expired');
        } else if (result.isUsed) {
          setError('This link has already been used');
        } else {
          setError(result.error || 'Invalid link');
        }
      }

      return result.isValid;
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message || 'Failed to validate link');
      setIsValid(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsValid(null);
    setHouseManualId(null);
    setExpiresAt(null);
    setError(null);
  }, []);

  return {
    validateLink,
    isValidating,
    isValid,
    houseManualId,
    expiresAt,
    error,
    reset,
  };
};

// ============================================================
// USE SHARE MANUAL HOOK
// ============================================================

interface UseShareManualReturn {
  shareViaEmail: (
    houseManualId: string,
    recipientEmail: string,
    expirationHours?: number
  ) => Promise<boolean>;
  shareViaSMS: (
    houseManualId: string,
    recipientPhone: string,
    expirationHours?: number
  ) => Promise<boolean>;
  shareWithQR: (houseManualId: string, expirationHours?: number) => Promise<string | null>;
  copyLink: (houseManualId: string, expirationHours?: number) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  shareUrl: string | null;
  qrCodeUrl: string | null;
  clearError: () => void;
}

export const useShareManual = (): UseShareManualReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);

  const createAndDeliverLink = useCallback(
    async (
      houseManualId: string,
      deliveryMethod: 'email' | 'sms' | 'qr' | 'direct',
      recipientEmail?: string,
      recipientPhone?: string,
      expirationHours: number = 48
    ): Promise<{ success: boolean; shortUrl?: string; qrCodeUrl?: string }> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await magicLinkService.createMagicLink({
          houseManualId,
          recipientEmail,
          recipientPhone,
          expirationHours,
          deliveryMethod,
        });

        if (response.success && response.magicLink) {
          setShareUrl(response.shortUrl || null);
          setQrCodeUrl(response.qrCodeUrl || null);

          // Deliver the link
          if (deliveryMethod === 'email' && recipientEmail) {
            await magicLinkService.sendViaEmail(response.magicLink, recipientEmail);
          } else if (deliveryMethod === 'sms' && recipientPhone) {
            await magicLinkService.sendViaSMS(response.magicLink, recipientPhone);
          }

          return {
            success: true,
            shortUrl: response.shortUrl,
            qrCodeUrl: response.qrCodeUrl,
          };
        }

        setError(response.error || 'Failed to create share link');
        return { success: false };
      } catch (err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Failed to share manual');
        return { success: false };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const shareViaEmail = useCallback(
    async (
      houseManualId: string,
      recipientEmail: string,
      expirationHours?: number
    ): Promise<boolean> => {
      const result = await createAndDeliverLink(
        houseManualId,
        'email',
        recipientEmail,
        undefined,
        expirationHours
      );
      return result.success;
    },
    [createAndDeliverLink]
  );

  const shareViaSMS = useCallback(
    async (
      houseManualId: string,
      recipientPhone: string,
      expirationHours?: number
    ): Promise<boolean> => {
      const result = await createAndDeliverLink(
        houseManualId,
        'sms',
        undefined,
        recipientPhone,
        expirationHours
      );
      return result.success;
    },
    [createAndDeliverLink]
  );

  const shareWithQR = useCallback(
    async (houseManualId: string, expirationHours?: number): Promise<string | null> => {
      const result = await createAndDeliverLink(
        houseManualId,
        'qr',
        undefined,
        undefined,
        expirationHours
      );
      return result.qrCodeUrl || null;
    },
    [createAndDeliverLink]
  );

  const copyLink = useCallback(
    async (houseManualId: string, expirationHours?: number): Promise<boolean> => {
      const result = await createAndDeliverLink(
        houseManualId,
        'direct',
        undefined,
        undefined,
        expirationHours
      );

      if (result.success && result.shortUrl) {
        try {
          await navigator.clipboard.writeText(result.shortUrl);
          return true;
        } catch {
          setError('Failed to copy link to clipboard');
          return false;
        }
      }
      return false;
    },
    [createAndDeliverLink]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    shareViaEmail,
    shareViaSMS,
    shareWithQR,
    copyLink,
    isLoading,
    error,
    shareUrl,
    qrCodeUrl,
    clearError,
  };
};

export default useCreateMagicLink;
