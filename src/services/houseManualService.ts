// ============================================================
// HOUSE MANUAL SERVICE
// Split Lease Application - House Manual API Integration
// ============================================================

import { apiClient } from './api';
import {
  HouseManual,
  HouseManualSection,
  CreateHouseManualRequest,
  CreateHouseManualResponse,
  ApiError,
  PaginationParams,
  PaginatedResponse,
} from '../types';

// ============================================================
// API ENDPOINTS
// ============================================================

const ENDPOINTS = {
  HOUSE_MANUALS: '/house-manuals',
  CREATE_VISIT_MANUAL: '/workflows/CORE-create-each-visit-house-manual',
  SECTIONS: (manualId: string) => `/house-manuals/${manualId}/sections`,
};

// ============================================================
// HOUSE MANUAL SERVICE CLASS
// ============================================================

class HouseManualService {
  /**
   * Get a house manual by ID
   * @param manualId - The house manual ID
   * @param accessToken - Optional access token for magic link users
   */
  async getHouseManual(manualId: string, accessToken?: string): Promise<HouseManual> {
    const params = accessToken ? { access_token: accessToken } : undefined;
    return apiClient.get<HouseManual>(`${ENDPOINTS.HOUSE_MANUALS}/${manualId}`, params);
  }

  /**
   * Get all house manuals for a property
   * @param propertyId - The property ID
   * @param pagination - Pagination parameters
   */
  async getHouseManualsByProperty(
    propertyId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<HouseManual>> {
    const params: Record<string, string> = { property_id: propertyId };
    if (pagination) {
      params.page = pagination.page.toString();
      params.limit = pagination.limit.toString();
      if (pagination.sortBy) params.sort_by = pagination.sortBy;
      if (pagination.sortOrder) params.sort_order = pagination.sortOrder;
    }
    return apiClient.get<PaginatedResponse<HouseManual>>(ENDPOINTS.HOUSE_MANUALS, params);
  }

  /**
   * Get house manuals for a user (visitor/reviewer)
   * @param userId - The user ID
   * @param pagination - Pagination parameters
   */
  async getHouseManualsByUser(
    userId: string,
    pagination?: PaginationParams
  ): Promise<PaginatedResponse<HouseManual>> {
    const params: Record<string, string> = { user_id: userId };
    if (pagination) {
      params.page = pagination.page.toString();
      params.limit = pagination.limit.toString();
    }
    return apiClient.get<PaginatedResponse<HouseManual>>(ENDPOINTS.HOUSE_MANUALS, params);
  }

  /**
   * Create a new house manual for a visit
   * Workflow: CORE-create-each-visit-house-manual
   * @param request - Create house manual request data
   */
  async createVisitHouseManual(request: CreateHouseManualRequest): Promise<CreateHouseManualResponse> {
    try {
      const response = await apiClient.post<CreateHouseManualResponse>(
        ENDPOINTS.CREATE_VISIT_MANUAL,
        {
          visitor_user_id: request.visitorUserId,
          property_id: request.propertyId,
          house_manual_template_id: request.houseManualTemplateId,
          title: request.title,
          description: request.description,
          created_at: new Date().toISOString(),
        }
      );
      return response;
    } catch (error) {
      const apiError = error as ApiError;
      return {
        success: false,
        error: {
          code: apiError.code || 500,
          message: apiError.message || 'Failed to create house manual',
          details: apiError.details,
        },
      };
    }
  }

  /**
   * Update a house manual
   * @param manualId - The house manual ID
   * @param updates - Partial house manual data to update
   */
  async updateHouseManual(
    manualId: string,
    updates: Partial<HouseManual>
  ): Promise<HouseManual> {
    return apiClient.patch<HouseManual>(`${ENDPOINTS.HOUSE_MANUALS}/${manualId}`, updates);
  }

  /**
   * Delete a house manual
   * @param manualId - The house manual ID
   */
  async deleteHouseManual(manualId: string): Promise<void> {
    return apiClient.delete(`${ENDPOINTS.HOUSE_MANUALS}/${manualId}`);
  }

  /**
   * Get sections for a house manual
   * @param manualId - The house manual ID
   */
  async getManualSections(manualId: string): Promise<HouseManualSection[]> {
    return apiClient.get<HouseManualSection[]>(ENDPOINTS.SECTIONS(manualId));
  }

  /**
   * Add a section to a house manual
   * @param manualId - The house manual ID
   * @param section - Section data
   */
  async addSection(
    manualId: string,
    section: Omit<HouseManualSection, 'id' | 'manualId' | 'createdAt' | 'updatedAt'>
  ): Promise<HouseManualSection> {
    return apiClient.post<HouseManualSection>(ENDPOINTS.SECTIONS(manualId), section);
  }

  /**
   * Update a section
   * @param manualId - The house manual ID
   * @param sectionId - The section ID
   * @param updates - Partial section data to update
   */
  async updateSection(
    manualId: string,
    sectionId: string,
    updates: Partial<HouseManualSection>
  ): Promise<HouseManualSection> {
    return apiClient.patch<HouseManualSection>(
      `${ENDPOINTS.SECTIONS(manualId)}/${sectionId}`,
      updates
    );
  }

  /**
   * Delete a section
   * @param manualId - The house manual ID
   * @param sectionId - The section ID
   */
  async deleteSection(manualId: string, sectionId: string): Promise<void> {
    return apiClient.delete(`${ENDPOINTS.SECTIONS(manualId)}/${sectionId}`);
  }

  /**
   * Check if user has access to a house manual
   * @param manualId - The house manual ID
   * @param userId - The user ID
   */
  async checkAccess(manualId: string, userId: string): Promise<{ hasAccess: boolean; permissions: string[] }> {
    return apiClient.get(`${ENDPOINTS.HOUSE_MANUALS}/${manualId}/access`, { user_id: userId });
  }

  /**
   * Validate magic link access token
   * @param manualId - The house manual ID
   * @param accessToken - The access token from magic link
   */
  async validateAccessToken(
    manualId: string,
    accessToken: string
  ): Promise<{ isValid: boolean; expiresAt?: string }> {
    return apiClient.post(`${ENDPOINTS.HOUSE_MANUALS}/${manualId}/validate-token`, {
      access_token: accessToken,
    });
  }
}

// Export singleton instance
export const houseManualService = new HouseManualService();

// Export class for testing
export { HouseManualService };
