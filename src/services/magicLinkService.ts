// ============================================================
// MAGIC LINK SERVICE
// Split Lease Application - Magic Link Generation & Validation
// ============================================================

import { apiClient } from './api';
import {
  MagicLink,
  MagicLinkRequest,
  MagicLinkResponse,
  ApiError,
} from '../types';

// ============================================================
// API ENDPOINTS
// ============================================================

const ENDPOINTS = {
  CREATE_MAGIC_LINK: '/workflows/core-create-magic-login-link-for-house-manual',
  CREATE_SHORT_LINK: '/workflows/core-create-short-link-for-house-manual',
  VALIDATE_LINK: '/magic-links/validate',
  MAGIC_LINKS: '/magic-links',
};

// ============================================================
// MAGIC LINK SERVICE CLASS
// ============================================================

class MagicLinkService {
  /**
   * Create a magic login link for house manual access
   * Workflow: core-create-magic-login-link-for-house-manual
   * @param request - Magic link request data
   */
  async createMagicLink(request: MagicLinkRequest): Promise<MagicLinkResponse> {
    try {
      // Step 1: Generate the magic link token
      const magicLinkResponse = await apiClient.post<{
        token: string;
        encrypted_token: string;
        expires_at: string;
        link_id: string;
      }>(ENDPOINTS.CREATE_MAGIC_LINK, {
        house_manual_id: request.houseManualId,
        recipient_email: request.recipientEmail,
        recipient_phone: request.recipientPhone,
        expiration_hours: request.expirationHours || 48,
        is_single_use: request.isSingleUse ?? false,
      });

      // Step 2: Create short URL if needed
      let shortUrl: string | undefined;
      if (request.deliveryMethod !== 'direct') {
        const shortLinkResponse = await this.createShortLink(
          request.houseManualId,
          magicLinkResponse.encrypted_token
        );
        shortUrl = shortLinkResponse.shortUrl;
      }

      // Step 3: Generate QR code if requested
      let qrCodeUrl: string | undefined;
      if (request.deliveryMethod === 'qr') {
        qrCodeUrl = await this.generateQRCode(shortUrl || magicLinkResponse.token);
      }

      const magicLink: MagicLink = {
        id: magicLinkResponse.link_id,
        token: magicLinkResponse.token,
        encryptedToken: magicLinkResponse.encrypted_token,
        shortUrl: shortUrl || '',
        houseManualId: request.houseManualId,
        createdByUserId: '', // Will be set by server
        recipientEmail: request.recipientEmail,
        recipientPhone: request.recipientPhone,
        expiresAt: magicLinkResponse.expires_at,
        isSingleUse: request.isSingleUse ?? false,
        isUsed: false,
        createdAt: new Date().toISOString(),
      };

      return {
        success: true,
        magicLink,
        shortUrl,
        qrCodeUrl,
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: apiError.message || 'Failed to create magic link',
      };
    }
  }

  /**
   * Create a short link for the house manual
   * Workflow: core-create-short-link-for-house-manual
   * @param houseManualId - The house manual ID
   * @param token - The magic link token
   */
  async createShortLink(
    houseManualId: string,
    token: string
  ): Promise<{ shortUrl: string; shortCode: string }> {
    return apiClient.post(ENDPOINTS.CREATE_SHORT_LINK, {
      house_manual_id: houseManualId,
      token,
      created_at: new Date().toISOString(),
    });
  }

  /**
   * Validate a magic link token
   * @param token - The magic link token
   */
  async validateMagicLink(token: string): Promise<{
    isValid: boolean;
    houseManualId?: string;
    expiresAt?: string;
    isExpired?: boolean;
    isUsed?: boolean;
    error?: string;
  }> {
    try {
      const response = await apiClient.post<{
        is_valid: boolean;
        house_manual_id?: string;
        expires_at?: string;
        is_expired?: boolean;
        is_used?: boolean;
      }>(ENDPOINTS.VALIDATE_LINK, { token });

      return {
        isValid: response.is_valid,
        houseManualId: response.house_manual_id,
        expiresAt: response.expires_at,
        isExpired: response.is_expired,
        isUsed: response.is_used,
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        isValid: false,
        error: apiError.message || 'Invalid or expired magic link',
      };
    }
  }

  /**
   * Mark a magic link as used
   * @param linkId - The magic link ID
   * @param ipAddress - Optional IP address of the user
   * @param userAgent - Optional user agent string
   */
  async markAsUsed(
    linkId: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await apiClient.patch(`${ENDPOINTS.MAGIC_LINKS}/${linkId}`, {
      is_used: true,
      used_at: new Date().toISOString(),
      ip_address: ipAddress,
      user_agent: userAgent,
    });
  }

  /**
   * Revoke a magic link
   * @param linkId - The magic link ID
   */
  async revokeMagicLink(linkId: string): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.MAGIC_LINKS}/${linkId}`);
  }

  /**
   * Get all magic links for a house manual
   * @param houseManualId - The house manual ID
   */
  async getMagicLinksForManual(houseManualId: string): Promise<MagicLink[]> {
    return apiClient.get<MagicLink[]>(ENDPOINTS.MAGIC_LINKS, {
      house_manual_id: houseManualId,
    });
  }

  /**
   * Generate QR code for a URL
   * @param url - The URL to encode in QR code
   */
  private async generateQRCode(url: string): Promise<string> {
    // Using a QR code generation service
    // In production, this could be a self-hosted service or third-party API
    const encodedUrl = encodeURIComponent(url);
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedUrl}`;
  }

  /**
   * Send magic link via email
   * @param magicLink - The magic link object
   * @param recipientEmail - Email address to send to
   */
  async sendViaEmail(magicLink: MagicLink, recipientEmail: string): Promise<boolean> {
    try {
      await apiClient.post('/notifications/send-magic-link-email', {
        magic_link_id: magicLink.id,
        recipient_email: recipientEmail,
        short_url: magicLink.shortUrl,
        expires_at: magicLink.expiresAt,
      });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Send magic link via SMS
   * @param magicLink - The magic link object
   * @param phoneNumber - Phone number to send to
   */
  async sendViaSMS(magicLink: MagicLink, phoneNumber: string): Promise<boolean> {
    try {
      await apiClient.post('/notifications/send-magic-link-sms', {
        magic_link_id: magicLink.id,
        phone_number: phoneNumber,
        short_url: magicLink.shortUrl,
        expires_at: magicLink.expiresAt,
      });
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const magicLinkService = new MagicLinkService();

// Export class for testing
export { MagicLinkService };
