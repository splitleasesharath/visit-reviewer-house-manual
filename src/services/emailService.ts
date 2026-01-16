// ============================================================
// EMAIL SERVICE
// Split Lease Application - Email Notification Service
// ============================================================

import { apiClient } from './api';
import {
  SendEmailRequest,
  SendEmailResponse,
  NotificationType,
  ApiError,
} from '../types';

// ============================================================
// API ENDPOINTS
// ============================================================

const ENDPOINTS = {
  SEND_EMAIL: '/workflows/core-send-house-manual-user-email',
  EMAIL_TEMPLATES: '/email-templates',
  EMAIL_HISTORY: '/email-notifications',
};

// ============================================================
// EMAIL TEMPLATES
// ============================================================

const EMAIL_TEMPLATE_IDS: Record<NotificationType, string> = {
  [NotificationType.MANUAL_CREATED]: 'house-manual-created',
  [NotificationType.MANUAL_UPDATED]: 'house-manual-updated',
  [NotificationType.ACCESS_SHARED]: 'house-manual-shared',
  [NotificationType.REMINDER]: 'house-manual-reminder',
  [NotificationType.EXPIRATION_WARNING]: 'house-manual-expiration',
};

// ============================================================
// EMAIL SERVICE CLASS
// ============================================================

class EmailService {
  /**
   * Send house manual notification email
   * Workflow: core-send-house-manual-user-email
   * @param request - Send email request data
   */
  async sendHouseManualEmail(request: SendEmailRequest): Promise<SendEmailResponse> {
    try {
      const templateId = EMAIL_TEMPLATE_IDS[request.type];

      const response = await apiClient.post<{
        notification_id: string;
        status: string;
      }>(ENDPOINTS.SEND_EMAIL, {
        recipient_email: request.recipientEmail,
        recipient_user_id: request.recipientUserId,
        notification_type: request.type,
        house_manual_id: request.houseManualId,
        template_id: templateId,
        custom_subject: request.customSubject,
        custom_body: request.customBody,
        template_data: request.templateData,
        queued_at: new Date().toISOString(),
      });

      return {
        success: true,
        notificationId: response.notification_id,
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: apiError.message || 'Failed to send email',
      };
    }
  }

  /**
   * Send manual creation notification
   * @param recipientEmail - Recipient email
   * @param houseManualId - House manual ID
   * @param templateData - Dynamic template data
   */
  async sendManualCreatedEmail(
    recipientEmail: string,
    houseManualId: string,
    templateData?: Record<string, unknown>
  ): Promise<SendEmailResponse> {
    return this.sendHouseManualEmail({
      recipientEmail,
      type: NotificationType.MANUAL_CREATED,
      houseManualId,
      templateData,
    });
  }

  /**
   * Send manual shared notification
   * @param recipientEmail - Recipient email
   * @param houseManualId - House manual ID
   * @param sharedByName - Name of the user who shared
   * @param propertyName - Name of the property
   * @param accessLink - Magic link URL
   */
  async sendManualSharedEmail(
    recipientEmail: string,
    houseManualId: string,
    sharedByName: string,
    propertyName: string,
    accessLink: string
  ): Promise<SendEmailResponse> {
    return this.sendHouseManualEmail({
      recipientEmail,
      type: NotificationType.ACCESS_SHARED,
      houseManualId,
      templateData: {
        shared_by_name: sharedByName,
        property_name: propertyName,
        access_link: accessLink,
      },
    });
  }

  /**
   * Send manual update notification
   * @param recipientEmail - Recipient email
   * @param houseManualId - House manual ID
   * @param updateSummary - Summary of what changed
   */
  async sendManualUpdatedEmail(
    recipientEmail: string,
    houseManualId: string,
    updateSummary: string
  ): Promise<SendEmailResponse> {
    return this.sendHouseManualEmail({
      recipientEmail,
      type: NotificationType.MANUAL_UPDATED,
      houseManualId,
      templateData: {
        update_summary: updateSummary,
      },
    });
  }

  /**
   * Send reminder notification
   * @param recipientEmail - Recipient email
   * @param houseManualId - House manual ID
   * @param reminderMessage - Custom reminder message
   */
  async sendReminderEmail(
    recipientEmail: string,
    houseManualId: string,
    reminderMessage?: string
  ): Promise<SendEmailResponse> {
    return this.sendHouseManualEmail({
      recipientEmail,
      type: NotificationType.REMINDER,
      houseManualId,
      templateData: {
        reminder_message: reminderMessage,
      },
    });
  }

  /**
   * Send expiration warning notification
   * @param recipientEmail - Recipient email
   * @param houseManualId - House manual ID
   * @param expirationDate - When the manual expires
   */
  async sendExpirationWarningEmail(
    recipientEmail: string,
    houseManualId: string,
    expirationDate: string
  ): Promise<SendEmailResponse> {
    return this.sendHouseManualEmail({
      recipientEmail,
      type: NotificationType.EXPIRATION_WARNING,
      houseManualId,
      templateData: {
        expiration_date: expirationDate,
      },
    });
  }

  /**
   * Get email notification history for a user
   * @param userId - User ID
   */
  async getEmailHistory(userId: string): Promise<{
    notifications: {
      id: string;
      type: NotificationType;
      subject: string;
      status: string;
      sentAt?: string;
    }[];
  }> {
    return apiClient.get(ENDPOINTS.EMAIL_HISTORY, { user_id: userId });
  }

  /**
   * Resend a failed email
   * @param notificationId - Original notification ID
   */
  async resendEmail(notificationId: string): Promise<SendEmailResponse> {
    try {
      const response = await apiClient.post<{
        notification_id: string;
      }>(`${ENDPOINTS.EMAIL_HISTORY}/${notificationId}/resend`);

      return {
        success: true,
        notificationId: response.notification_id,
      };
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: apiError.message || 'Failed to resend email',
      };
    }
  }

  /**
   * Cancel a queued email
   * @param notificationId - Notification ID
   */
  async cancelEmail(notificationId: string): Promise<boolean> {
    try {
      await apiClient.delete(`${ENDPOINTS.EMAIL_HISTORY}/${notificationId}`);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Manage unsubscribe preferences
   * @param email - Email address
   * @param unsubscribe - Whether to unsubscribe
   * @param notificationTypes - Specific types to unsubscribe from (optional)
   */
  async manageUnsubscribe(
    email: string,
    unsubscribe: boolean,
    notificationTypes?: NotificationType[]
  ): Promise<boolean> {
    try {
      await apiClient.post('/email-preferences', {
        email,
        unsubscribed: unsubscribe,
        notification_types: notificationTypes,
      });
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();

// Export class for testing
export { EmailService };
