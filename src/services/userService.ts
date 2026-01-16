// ============================================================
// USER SERVICE
// Split Lease Application - User Management & Authentication
// ============================================================

import { apiClient } from './api';
import {
  User,
  SignupGuestRequest,
  SignupGuestResponse,
  PhoneVerificationRequest,
  PhoneVerificationResponse,
  VerifyCodeRequest,
  VerifyCodeResponse,
  ApiError,
} from '../types';

// ============================================================
// API ENDPOINTS
// ============================================================

const ENDPOINTS = {
  USERS: '/users',
  CURRENT_USER: '/users/me',
  SIGNUP_GUEST: '/workflows/core-signup-guest-from-house-manual',
  PHONE_VERIFICATION: '/workflows/create-each-house-manual-phone-verification',
  VERIFY_PHONE: '/phone-verification/verify',
};

// ============================================================
// USER SERVICE CLASS
// ============================================================

class UserService {
  /**
   * Get current authenticated user
   */
  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>(ENDPOINTS.CURRENT_USER);
  }

  /**
   * Get user by ID
   * @param userId - The user ID
   */
  async getUserById(userId: string): Promise<User> {
    return apiClient.get<User>(`${ENDPOINTS.USERS}/${userId}`);
  }

  /**
   * Signup a guest user from house manual access
   * Workflow: core-signup-guest-from-house-manual
   * @param request - Signup request data
   */
  async signupGuestFromHouseManual(request: SignupGuestRequest): Promise<SignupGuestResponse> {
    try {
      // Validate email uniqueness check
      const emailExists = await this.checkEmailExists(request.email);
      if (emailExists) {
        return {
          success: false,
          error: {
            code: 400,
            message: 'An account with this email already exists.',
          },
        };
      }

      // Create user account
      const response = await apiClient.post<{
        user_id: string;
        access_token: string;
        user: User;
      }>(ENDPOINTS.SIGNUP_GUEST, {
        email: request.email,
        full_name: request.fullName,
        phone_number: request.phoneNumber,
        password: request.password, // Will be hashed server-side
        house_manual_id: request.houseManualId,
        property_id: request.propertyId,
        terms_accepted: request.termsAccepted,
        privacy_policy_accepted: request.privacyPolicyAccepted,
        referral_source: request.referralSource,
        created_at: new Date().toISOString(),
      });

      // Set the auth token for subsequent requests
      apiClient.setAuthToken(response.access_token);

      return {
        success: true,
        userId: response.user_id,
        accessToken: response.access_token,
        user: response.user,
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: {
          code: apiError.code || 500,
          message: apiError.message || 'Failed to create account. Please try again.',
          details: apiError.details,
        },
      };
    }
  }

  /**
   * Check if email already exists
   * @param email - Email to check
   */
  async checkEmailExists(email: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{ exists: boolean }>(
        `${ENDPOINTS.USERS}/check-email`,
        { email }
      );
      return response.exists;
    } catch {
      return false;
    }
  }

  /**
   * Request phone verification code
   * Workflow: create-each-house-manual-phone-verification
   * @param request - Phone verification request
   */
  async requestPhoneVerification(request: PhoneVerificationRequest): Promise<PhoneVerificationResponse> {
    try {
      const response = await apiClient.post<{
        verification_id: string;
        expires_at: string;
      }>(ENDPOINTS.PHONE_VERIFICATION, {
        user_id: request.userId,
        phone_number: request.phoneNumber,
        created_at: new Date().toISOString(),
      });

      return {
        success: true,
        verificationId: response.verification_id,
        expiresAt: response.expires_at,
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: apiError.message || 'Failed to send verification code',
      };
    }
  }

  /**
   * Verify phone number with code
   * @param request - Verification request with code
   */
  async verifyPhoneCode(request: VerifyCodeRequest): Promise<VerifyCodeResponse> {
    try {
      const response = await apiClient.post<{
        is_verified: boolean;
        remaining_attempts?: number;
      }>(ENDPOINTS.VERIFY_PHONE, {
        verification_id: request.verificationId,
        code: request.code,
      });

      return {
        success: true,
        isVerified: response.is_verified,
        remainingAttempts: response.remaining_attempts,
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        isVerified: false,
        remainingAttempts: (apiError.details as { remaining_attempts?: number })?.remaining_attempts,
        error: apiError.message || 'Verification failed',
      };
    }
  }

  /**
   * Update user profile
   * @param userId - User ID
   * @param updates - Profile updates
   */
  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    return apiClient.patch<User>(`${ENDPOINTS.USERS}/${userId}`, updates);
  }

  /**
   * Update contact preferences
   * @param userId - User ID
   * @param preference - Contact preference ('shown' | 'hidden')
   */
  async updateContactPreference(
    userId: string,
    preference: 'shown' | 'hidden'
  ): Promise<void> {
    await apiClient.patch(`${ENDPOINTS.USERS}/${userId}`, {
      contact_preference: preference,
    });
  }

  /**
   * Login user with email and password
   * @param email - User email
   * @param password - User password
   */
  async login(email: string, password: string): Promise<{ user: User; accessToken: string }> {
    const response = await apiClient.post<{ user: User; access_token: string }>(
      '/auth/login',
      { email, password }
    );

    apiClient.setAuthToken(response.access_token);

    return {
      user: response.user,
      accessToken: response.access_token,
    };
  }

  /**
   * Login user with magic link token
   * @param token - Magic link token
   */
  async loginWithMagicLink(token: string): Promise<{ user: User; accessToken: string }> {
    const response = await apiClient.post<{ user: User; access_token: string }>(
      '/auth/magic-link-login',
      { token }
    );

    apiClient.setAuthToken(response.access_token);

    return {
      user: response.user,
      accessToken: response.access_token,
    };
  }

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout');
    } finally {
      apiClient.clearAuthToken();
    }
  }

  /**
   * Request password reset
   * @param email - User email
   */
  async requestPasswordReset(email: string): Promise<boolean> {
    try {
      await apiClient.post('/auth/request-password-reset', { email });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Reset password with token
   * @param token - Password reset token
   * @param newPassword - New password
   */
  async resetPassword(token: string, newPassword: string): Promise<boolean> {
    try {
      await apiClient.post('/auth/reset-password', {
        token,
        new_password: newPassword,
      });
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const userService = new UserService();

// Export class for testing
export { UserService };
