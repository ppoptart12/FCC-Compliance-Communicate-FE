/**
 * Document Service
 * Handles API calls related to document scanning and compliance checking
 */

import { apiClient, ApiResponse } from './client';
import { API_ENDPOINTS } from './config';

// Types based on the existing ScannedDocument and DetailedComplianceReport interfaces
export interface ScannedDocument {
  id: string;
  name: string;
  size: string;
  uploadTime: string;
  progress: number;
  status: "scanning" | "complete" | "error";
  complianceStatus?: "compliant" | "issues" | "review";
  complianceMessage?: string;
  detailedReport?: DetailedComplianceReport;
}

export interface DetailedComplianceReport {
  compliance_score: number;
  compliance_status: string;
  summary_of_findings: string;
  section_breakdown: string;
  specific_issues: string;
  recommendations: string;
  section_scores: Record<string, number>;
}

export interface OrganizationContext {
  callSign: string;
  frequency: string;
  serviceType: "am" | "fm" | "tv" | "satellite" | "cable" | "other";
  licenseType: "commercial" | "noncommercial" | "lpfm" | "lpam" | "lptv";
  market: string;
  ownershipStructure: "single" | "group" | "network";
  lastRenewal: string;
  publicFileType: "online" | "physical" | "hybrid";
}

export interface ScanDocumentResponse {
  document: ScannedDocument;
  message: string;
}

export interface GetDocumentsResponse {
  documents: ScannedDocument[];
  total: number;
}

/**
 * Document Service for FCC compliance scanning
 */
export const documentService = {
  /**
   * Scan a document for FCC compliance
   * The AI will automatically analyze the document based on the PDF content and organization context
   * @param file The PDF file to scan
   * @param context Organization context for better compliance analysis
   */
  async scanDocument(file: File, context?: OrganizationContext): Promise<ScanDocumentResponse> {
    // Create FormData object to match the backend's expected format
    const formData = new FormData();
    
    // Add the PDF file with the key 'pdf_file' as expected by the backend
    formData.append('pdf_file', file);
    
    // Add organization context as a JSON string with the key 'org_context'
    if (context) {
      formData.append('org_context', JSON.stringify(context));
    } else {
      // If no context is provided, send an empty object to avoid backend errors
      formData.append('org_context', JSON.stringify({}));
    }
    
    // Send the request to the backend
    const response = await apiClient.postFormData<any>(
      API_ENDPOINTS.DOCUMENTS.SCAN,
      formData
    );
    
    // Transform the backend response to match our frontend's expected format
    // This assumes the backend response structure might be different
    return transformBackendResponse(response, file);
  },
  
  /**
   * Get a detailed compliance report for a document
   * @param documentId The ID of the document
   */
  async getDocumentReport(documentId: string): Promise<DetailedComplianceReport> {
    return apiClient.get<DetailedComplianceReport>(
      API_ENDPOINTS.DOCUMENTS.GET_REPORT(documentId)
    );
  },
  
  /**
   * Get a list of scanned documents
   */
  async getDocuments(): Promise<GetDocumentsResponse> {
    return apiClient.get<GetDocumentsResponse>(
      API_ENDPOINTS.DOCUMENTS.LIST
    );
  }
};

/**
 * Transform the backend response to match our frontend's expected format
 * @param backendResponse The response from the backend
 * @param file The original file that was uploaded
 */
function transformBackendResponse(backendResponse: any, file: File): ScanDocumentResponse {
  // Extract the document from the response
  const responseDoc = backendResponse.document || {};
  
  // Generate a random ID if one is not provided by the backend
  const id = responseDoc.id || Math.random().toString(36).substring(7);
  
  // Extract the detailed report from the response document
  const responseDetailedReport = responseDoc.detailedReport || {};
  
  // Map the compliance status from the backend to our frontend's expected values
  let complianceStatus: "compliant" | "issues" | "review" = "review";
  if (responseDoc.complianceStatus) {
    complianceStatus = responseDoc.complianceStatus;
  } else if (responseDetailedReport.compliance_status) {
    if (responseDetailedReport.compliance_status.toLowerCase().includes("compliant")) {
      complianceStatus = "compliant";
    } else if (responseDetailedReport.compliance_status.toLowerCase().includes("issue")) {
      complianceStatus = "issues";
    }
  }
  
  // Create a detailed report object from the backend data
  const detailedReport: DetailedComplianceReport = {
    compliance_score: responseDetailedReport.compliance_score || 0,
    compliance_status: responseDetailedReport.compliance_status || "Unknown",
    summary_of_findings: responseDetailedReport.summary_of_findings || "",
    section_breakdown: responseDetailedReport.section_breakdown || "",
    specific_issues: responseDetailedReport.specific_issues || "",
    recommendations: responseDetailedReport.recommendations || "",
    section_scores: responseDetailedReport.section_scores || {}
  };
  
  // Create the document object
  const document: ScannedDocument = {
    id,
    name: responseDoc.name || file.name,
    size: responseDoc.size || `${(file.size / 1024 / 1024).toFixed(2)} MB`,
    uploadTime: responseDoc.uploadTime || new Date().toLocaleString(),
    progress: 100,
    status: responseDoc.status || "complete",
    complianceStatus,
    complianceMessage: responseDoc.complianceMessage || responseDetailedReport.summary_of_findings || "",
    detailedReport
  };
  
  // Return the transformed response
  return {
    document,
    message: backendResponse.message || "Document scanned successfully"
  };
} 