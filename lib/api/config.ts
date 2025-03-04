/**
 * API Configuration
 * Contains base URLs and endpoints for the FCC Compliance API
 */

// Base API URL - should be updated based on environment
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000';

// API Endpoints
export const API_ENDPOINTS = {
  // Document scanning endpoints
  DOCUMENTS: {
    SCAN: `${API_BASE_URL}/api/v1/unauth/pdf_compliance_scan`,
    GET_REPORT: (documentId: string) => `${API_BASE_URL}/api/v1/unauth/documents/${documentId}/report`,
    LIST: `${API_BASE_URL}/api/v1/unauth/documents`,
  },
};

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000; // 30 seconds 