// ============================================================
// API SERVICE - HTTP CLIENT CONFIGURATION
// Split Lease Application - Base API Configuration
// ============================================================

import { ApiError } from '../types';

// ============================================================
// API CONFIGURATION
// ============================================================

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';
const API_TIMEOUT = 30000; // 30 seconds

// ============================================================
// HTTP CLIENT CLASS
// ============================================================

class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private defaultHeaders: Record<string, string>;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  // Set authorization token
  setAuthToken(token: string): void {
    this.defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  // Remove authorization token
  clearAuthToken(): void {
    delete this.defaultHeaders['Authorization'];
  }

  // Build full URL
  private buildUrl(endpoint: string, params?: Record<string, string>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`, window.location.origin);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value);
      });
    }
    return url.toString();
  }

  // Handle API errors
  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const apiError: ApiError = {
        code: response.status,
        message: errorData.message || this.getErrorMessage(response.status),
        details: errorData.details,
      };
      throw apiError;
    }

    // Handle empty responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json();
    }
    return {} as T;
  }

  // Get error message based on status code
  private getErrorMessage(status: number): string {
    switch (status) {
      case 400:
        return 'Invalid request. Please check your input.';
      case 401:
        return 'Unauthorized. Please log in again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 429:
        return 'Too many requests. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return 'An unexpected error occurred.';
    }
  }

  // Create AbortController with timeout
  private createAbortController(): { controller: AbortController; timeoutId: NodeJS.Timeout } {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    return { controller, timeoutId };
  }

  // GET request
  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const { controller, timeoutId } = this.createAbortController();

    try {
      const response = await fetch(this.buildUrl(endpoint, params), {
        method: 'GET',
        headers: this.defaultHeaders,
        signal: controller.signal,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw { code: 408, message: 'Request timeout. Please try again.' } as ApiError;
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // POST request
  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const { controller, timeoutId } = this.createAbortController();

    try {
      const response = await fetch(this.buildUrl(endpoint), {
        method: 'POST',
        headers: this.defaultHeaders,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw { code: 408, message: 'Request timeout. Please try again.' } as ApiError;
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // PUT request
  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const { controller, timeoutId } = this.createAbortController();

    try {
      const response = await fetch(this.buildUrl(endpoint), {
        method: 'PUT',
        headers: this.defaultHeaders,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw { code: 408, message: 'Request timeout. Please try again.' } as ApiError;
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const { controller, timeoutId } = this.createAbortController();

    try {
      const response = await fetch(this.buildUrl(endpoint), {
        method: 'PATCH',
        headers: this.defaultHeaders,
        body: data ? JSON.stringify(data) : undefined,
        signal: controller.signal,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw { code: 408, message: 'Request timeout. Please try again.' } as ApiError;
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<T> {
    const { controller, timeoutId } = this.createAbortController();

    try {
      const response = await fetch(this.buildUrl(endpoint), {
        method: 'DELETE',
        headers: this.defaultHeaders,
        signal: controller.signal,
      });
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw { code: 408, message: 'Request timeout. Please try again.' } as ApiError;
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export class for custom instances
export { ApiClient };
