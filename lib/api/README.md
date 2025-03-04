# FCC Compliance API Integration

This directory contains the API integration for the FCC Compliance Document Scanning feature.

## Structure

- `config.ts` - API configuration (base URLs, endpoints)
- `client.ts` - Base API client with request/response handling
- `documentService.ts` - Document scanning service
- `index.ts` - Exports all API-related services and utilities

## Usage

### Document Scanning

```typescript
import { documentService } from '@/lib/api';

// Scan a single document
const scanDocument = async (file: File, organizationContext) => {
  try {
    const response = await documentService.scanDocument(file, organizationContext);
    console.log('Document scanned:', response.document);
  } catch (error) {
    console.error('Error scanning document:', error);
  }
};

// Get a detailed compliance report
const getReport = async (documentId: string) => {
  try {
    const report = await documentService.getDocumentReport(documentId);
    console.log('Compliance report:', report);
  } catch (error) {
    console.error('Error getting report:', error);
  }
};
```

## Configuration

The API is configured using environment variables:

- `NEXT_PUBLIC_API_BASE_URL` - Base URL for the API (default: http://127.0.0.1:8000)
- `NEXT_PUBLIC_USE_MOCK_API` - Set to 'true' to use mock API responses (for development)

These can be set in the `.env.local` file at the root of the project.

## Backend API Endpoints

The backend API implements the following endpoints:

### POST /api/v1/unauth/pdf_compliance_scan

Scans a PDF document for FCC compliance. The AI backend automatically analyzes the document content and determines compliance without requiring specific questions from the user.

**Request:**
- `pdf_file`: The PDF document file to scan (Form field)
- `org_context`: Organization context as a JSON string (Form field)

**Organization Context Structure:**
```json
{
  "callSign": "WXYZ",
  "frequency": "98.7 MHz",
  "serviceType": "fm",
  "licenseType": "commercial",
  "market": "New York",
  "ownershipStructure": "group",
  "lastRenewal": "2022-05-15",
  "publicFileType": "online"
}
```

**Response:**
```json
{
  "document": {
    "id": "123",
    "name": "document.pdf",
    "size": "1.2 MB",
    "uploadTime": "2023-01-01T12:00:00Z",
    "progress": 100,
    "status": "complete",
    "complianceStatus": "compliant",
    "complianceMessage": "Document is compliant with FCC regulations",
    "detailedReport": {
      "compliance_score": 95,
      "compliance_status": "compliant",
      "summary_of_findings": "Document meets FCC requirements",
      "section_breakdown": "All sections compliant",
      "specific_issues": "",
      "recommendations": "",
      "section_scores": {
        "section1": 100,
        "section2": 90
      }
    }
  },
  "message": "Document scanned successfully"
}
```

### GET /api/v1/unauth/documents/:documentId/report

Gets a detailed compliance report for a document.

**Response:** Detailed compliance report object

### GET /api/v1/unauth/documents

Gets a list of scanned documents.

**Response:**
```json
{
  "documents": [
    {
      "id": "123",
      "name": "document.pdf",
      "size": "1.2 MB",
      "uploadTime": "2023-01-01T12:00:00Z",
      "progress": 100,
      "status": "complete",
      "complianceStatus": "compliant",
      "complianceMessage": "Document is compliant with FCC regulations"
    }
  ],
  "total": 1
}
```

## Backend Implementation Details

The backend API is implemented in Python using FastAPI. The endpoint processes the uploaded PDF file and organization context as follows:

1. Receives the PDF file as `pdf_file` and organization context as `org_context` (JSON string)
2. Extracts text from the PDF document
3. Processes the text along with the organization context
4. Generates a comprehensive compliance scan report based on FCC regulations
5. Returns the compliance scan results

The backend uses a `ComplianceScanAgent` to analyze the document and generate the compliance report. The agent considers:

- The text content of the PDF
- The organization context (service type, license type, etc.)
- Relevant FCC regulations based on the organization's profile

## AI Processing Guidelines

The backend AI should:

1. **Extract and analyze text** from the PDF document
2. **Consider the organization context** to apply relevant FCC regulations
3. **Identify compliance issues** based on FCC regulations for the specific service type
4. **Generate a compliance score** based on the severity and number of issues found
5. **Provide actionable recommendations** for addressing any compliance issues
6. **Categorize issues by section** (e.g., public file, ownership disclosure, programming)

Common FCC compliance areas to check include:
- Public file maintenance
- EEO compliance
- Ownership reporting
- Programming and commercial limits
- Technical standards compliance
- License renewal requirements
- Political broadcasting rules
- Children's programming requirements (for TV)
- Contest rules
- Sponsorship identification 