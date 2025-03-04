/**
 * API Client
 * Provides utility functions for making API requests
 */

import { REQUEST_TIMEOUT } from './config';

// Types for API responses
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

// Error class for API errors
export class ApiError extends Error {
  status: number;
  data?: any;

  constructor(message: string, status: number, data?: any) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

/**
 * Handles API response and error parsing
 */
async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { message: 'Unknown error occurred' };
    }
    
    throw new ApiError(
      errorData.message || `API Error: ${response.status}`,
      response.status,
      errorData
    );
  }

  // For successful responses
  const data = await response.json();
  return data as T;
}

/**
 * Base fetch function with timeout and error handling
 */
async function fetchWithTimeout(
  url: string, 
  options: RequestInit = {}
): Promise<Response> {
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeout = setTimeout(() => {
    controller.abort();
  }, REQUEST_TIMEOUT);
  
  try {
    return await fetch(url, {
      ...options,
      signal,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new ApiError('Request timeout', 408);
    }
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * API client methods
 */
export const apiClient = {
  /**
   * GET request
   */
  async get<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetchWithTimeout(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    return handleResponse<T>(response);
  },
  
  /**
   * POST request
   */
  async post<T>(url: string, data?: any, options: RequestInit = {}): Promise<T> {
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
    
    return handleResponse<T>(response);
  },
  
  /**
   * POST request with FormData (for file uploads)
   */
  async postFormData<T>(url: string, formData: FormData, options: RequestInit = {}): Promise<T> {
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      // Don't set Content-Type header as the browser will set it with the boundary
      headers: {
        ...options.headers,
      },
      body: formData,
      ...options,
    });
    
    return handleResponse<T>(response);
  },
  
  /**
   * PUT request
   */
  async put<T>(url: string, data: any, options: RequestInit = {}): Promise<T> {
    const response = await fetchWithTimeout(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
    });
    
    return handleResponse<T>(response);
  },
  
  /**
   * DELETE request
   */
  async delete<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetchWithTimeout(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });
    
    return handleResponse<T>(response);
  },
}; 