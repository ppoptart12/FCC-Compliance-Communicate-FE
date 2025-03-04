"use client"

import { useState } from "react"
import {
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
  Loader2,
  ChevronDown,
  Radio,
  Tv,
  Satellite,
  Building,
  Calendar,
  FileCheck,
  Settings,
  Antenna,
  Signal,
  AirplayIcon as Broadcast,
  Wifi,
  Zap,
  Info,
  BarChart4,
  FileWarning,
  ListChecks,
  ShieldAlert,
  ArrowRight,
  Download,
  Printer,
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { documentService } from "@/lib/api"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useDocumentStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import type { FileItem } from "@/lib/types"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { OrganizationContext as ApiOrganizationContext, ScannedDocument as ApiScannedDocument } from "@/lib/api"

// Generate random compliance status for demo purposes
const generateComplianceStatus = (context?: OrganizationContext) => {
  // If we have context, we can make the compliance check more relevant
  if (context) {
    // For AM stations, check for RF exposure compliance
    if (context.serviceType === "am") {
      if (Math.random() > 0.7) {
        return {
          status: "issues",
          message:
            "Potential RF exposure compliance issues detected. AM stations must maintain compliance with 47 CFR § 1.1310.",
        }
      }
    }

    // For FM stations, check for EAS compliance
    if (context.serviceType === "fm") {
      if (Math.random() > 0.6) {
        return {
          status: "review",
          message: "EAS test logs may be incomplete. Review required per 47 CFR § 11.61.",
        }
      }
    }

    // For TV stations, check for children's programming requirements
    if (context.serviceType === "tv") {
      if (Math.random() > 0.5) {
        return {
          status: "issues",
          message: "Children's programming reporting requirements may not be met. See 47 CFR § 73.671.",
        }
      }
    }

    // For LPFM, check for unauthorized commercial content
    if (context.licenseType === "lpfm") {
      if (Math.random() > 0.7) {
        return {
          status: "review",
          message:
            "Document may contain commercial content prohibited for LPFM stations. Review under 47 CFR § 73.503.",
        }
      }
    }
  }

  // Default random statuses if no context or no specific rules triggered
  const statuses = [
    { status: "compliant", message: "Document complies with FCC regulations" },
    {
      status: "issues",
      message: "Potential compliance issues detected with 47 CFR § 73.3526 public file requirements",
    },
    { status: "review", message: "Manual review recommended for ownership disclosure compliance" },
  ]
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// Generate detailed compliance report
const generateDetailedComplianceReport = (docName: string, context?: OrganizationContext) => {
  // Base score and status
  const complianceScore = Math.floor(Math.random() * 40) + 60 // 60-100
  let complianceStatus = "COMPLIANT"

  if (complianceScore < 80) {
    complianceStatus = "PARTIAL"
  }
  if (complianceScore < 70) {
    complianceStatus = "NON_COMPLIANT"
  }

  // Generate section scores
  const sectionScores = {
    "Public File Requirements": Math.floor(Math.random() * 30) + 70,
    "Technical Compliance": Math.floor(Math.random() * 20) + 80,
    "Ownership Disclosure": Math.floor(Math.random() * 40) + 60,
    "EAS Compliance": Math.floor(Math.random() * 25) + 75,
    "RF Exposure": Math.floor(Math.random() * 15) + 85,
  }

  // Generate issues based on context and scores
  const issues = []

  if (sectionScores["Public File Requirements"] < 80) {
    issues.push("Missing required elements in public file documentation")
  }

  if (sectionScores["Ownership Disclosure"] < 75) {
    issues.push("Incomplete ownership disclosure information")
  }

  if (context?.serviceType === "fm" && sectionScores["EAS Compliance"] < 85) {
    issues.push("EAS test logs appear to be incomplete or improperly documented")
  }

  if (context?.serviceType === "am" && sectionScores["RF Exposure"] < 90) {
    issues.push("RF exposure documentation may not meet current FCC requirements")
  }

  // Add random issues if we don't have enough
  const potentialIssues = [
    "Document formatting does not conform to FCC standards",
    "Missing required signatures on certification pages",
    "Outdated references to superseded regulations",
    "Inconsistent station identification throughout document",
    "Improper use of technical terminology per FCC guidelines",
  ]

  while (issues.length < 2) {
    const randomIssue = potentialIssues[Math.floor(Math.random() * potentialIssues.length)]
    if (!issues.includes(randomIssue)) {
      issues.push(randomIssue)
    }
  }

  // Generate recommendations based on issues
  const recommendations = issues.map((issue) => {
    if (issue.includes("public file")) {
      return "Review 47 CFR § 73.3526 and ensure all required elements are included in public file"
    }
    if (issue.includes("ownership")) {
      return "Update ownership disclosure with current information and file with the FCC"
    }
    if (issue.includes("EAS")) {
      return "Conduct a review of EAS test logs and ensure compliance with 47 CFR § 11.61"
    }
    if (issue.includes("RF exposure")) {
      return "Update RF exposure documentation to comply with current standards in 47 CFR § 1.1310"
    }
    if (issue.includes("formatting")) {
      return "Reformat document according to FCC guidelines before submission"
    }
    if (issue.includes("signatures")) {
      return "Obtain required signatures from authorized personnel"
    }
    return "Review document for compliance with current FCC regulations"
  })

  // Generate section breakdown
  const sectionBreakdown = Object.entries(sectionScores)
    .map(([section, score]) => {
      let status = "COMPLIANT"
      if (score < 80) status = "PARTIAL"
      if (score < 70) status = "NON_COMPLIANT"

      return `${section}: ${score}% (${status})`
    })
    .join("\n")

  // Generate summary
  let summary = ""
  if (complianceStatus === "COMPLIANT") {
    summary = `Document "${docName}" is compliant with FCC regulations with an overall score of ${complianceScore}%. Minor improvements recommended.`
  } else if (complianceStatus === "PARTIAL") {
    summary = `Document "${docName}" is partially compliant with FCC regulations with a score of ${complianceScore}%. Several issues require attention.`
  } else {
    summary = `Document "${docName}" does not meet FCC compliance standards with a score of ${complianceScore}%. Immediate action required.`
  }

  return {
    compliance_score: complianceScore,
    compliance_status: complianceStatus,
    summary_of_findings: summary,
    section_breakdown: sectionBreakdown,
    specific_issues: issues.join("\n"),
    recommendations: recommendations.join("\n"),
    section_scores: sectionScores,
  }
}

// Generate random PDF content for fallback
const generateRandomPdfContent = (fileName: string) => {
  const contentTypes = [
    [
      "FCC COMPLIANCE REPORT",
      "This document certifies that station operations comply with all applicable FCC regulations.",
      "Signed: ________________\nDate: " + new Date().toLocaleDateString(),
    ],
    [
      "TECHNICAL SPECIFICATIONS",
      "Transmitter: Harris HPX\nPower Output: 50kW\nAntenna Height: 150m HAAT\nFrequency: 93.9 MHz",
      "This document must be kept in the station's public file.",
    ],
    [
      "OWNERSHIP DISCLOSURE",
      "This document discloses the ownership structure of the station as required by FCC regulations.",
      "All changes in ownership must be reported to the FCC within 30 days.",
    ],
    [
      "EMERGENCY ALERT SYSTEM TEST LOG",
      "Weekly Tests:\n- " +
        new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toLocaleDateString() +
        "\n- " +
        new Date().toLocaleDateString(),
      "Monthly Tests:\n- " + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toLocaleDateString(),
    ],
  ]

  const randomIndex = Math.floor(Math.random() * contentTypes.length)
  const content = contentTypes[randomIndex]

  // Add file-specific information
  content.push(`File: ${fileName}\nUploaded: ${new Date().toLocaleString()}`)

  return content
}

interface ScannedDocument {
  id: string
  name: string
  size: string
  uploadTime: string
  progress: number
  status: "scanning" | "complete" | "error"
  complianceStatus?: "compliant" | "issues" | "review"
  complianceMessage?: string
  detailedReport?: DetailedComplianceReport
  originalFile?: File
}

interface DetailedComplianceReport {
  compliance_score: number
  compliance_status: string
  summary_of_findings: string
  section_breakdown: string
  specific_issues: string
  recommendations: string
  section_scores: Record<string, number>
}

interface OrganizationContext {
  callSign: string
  frequency: string
  serviceType: "am" | "fm" | "tv" | "satellite" | "cable" | "other"
  licenseType: "commercial" | "noncommercial" | "lpfm" | "lpam" | "lptv"
  market: string
  ownershipStructure: "single" | "group" | "network"
  lastRenewal: string
  publicFileType: "online" | "physical" | "hybrid"
}

export default function QuickScanPage() {
  const [scannedDocs, setScannedDocs] = useState<ScannedDocument[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [retryingDocIds, setRetryingDocIds] = useState<string[]>([])
  const [contextExpanded, setContextExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")
  const [contextTab, setContextTab] = useState("station")
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null)
  const [reportTab, setReportTab] = useState("summary")
  const [organizationContext, setOrganizationContext] = useState<OrganizationContext>({
    callSign: "",
    frequency: "",
    serviceType: "fm",
    licenseType: "commercial",
    market: "",
    ownershipStructure: "single",
    lastRenewal: "",
    publicFileType: "online",
  })
  const { addFiles, currentPath } = useDocumentStore()

  const updateContext = (field: keyof OrganizationContext, value: string) => {
    setOrganizationContext((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const simulateScan = async (file: File): Promise<ScannedDocument> => {
    const id = Math.random().toString(36).substring(7)
    const newDoc: ScannedDocument = {
      id,
      name: file.name,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
      uploadTime: new Date().toLocaleString(),
      progress: 0,
      status: "scanning",
      originalFile: file,
    }

    setScannedDocs((prev) => [...prev, newDoc])

    // For development/demo purposes, we'll use the existing simulation
    // In production, this would be replaced with the actual API call
    if (process.env.NEXT_PUBLIC_USE_MOCK_API === 'true') {
      // Simulate scanning progress
      return new Promise((resolve) => {
        let progress = 0
        const interval = setInterval(() => {
          progress += 10

          setScannedDocs((prev) => prev.map((doc) => (doc.id === id ? { ...doc, progress } : doc)))

          if (progress >= 100) {
            clearInterval(interval)

            // Generate compliance status based on organization context
            const { status, message } = generateComplianceStatus(organizationContext)

            // Generate detailed compliance report
            const detailedReport = generateDetailedComplianceReport(file.name, organizationContext)

            const completedDoc = {
              ...newDoc,
              progress: 100,
              status: "complete" as const,
              complianceStatus: status as "compliant" | "issues" | "review",
              complianceMessage: message,
              detailedReport,
            }

            setScannedDocs((prev) => prev.map((doc) => (doc.id === id ? completedDoc : doc)))

            resolve(completedDoc)
          }
        }, 300)
      })
    } else {
      // Use the actual API service
      try {
        // Show progress updates to improve user experience
        const updateProgress = (progress: number) => {
          setScannedDocs((prev) => prev.map((doc) => (doc.id === id ? { ...doc, progress } : doc)))
        }
        
        // Initial progress update - preparing to send
        updateProgress(10)
        
        // Call the API to scan the document with the organization context
        // The API expects 'pdf_file' and 'org_context' fields
        updateProgress(30)
        const response = await documentService.scanDocument(file, organizationContext)
        
        // API call completed
        updateProgress(90)
        
        // Get the document from the response
        const apiDoc = response.document
        
        // Create the completed document object
        const completedDoc = {
          ...newDoc,
          id: apiDoc.id || id, // Use API-provided ID if available
          progress: 100,
          status: apiDoc.status,
          complianceStatus: apiDoc.complianceStatus,
          complianceMessage: apiDoc.complianceMessage,
          detailedReport: apiDoc.detailedReport,
        }
        
        // Update the document in the state
        setScannedDocs((prev) => prev.map((doc) => (doc.id === id ? completedDoc : doc)))
        
        return completedDoc
      } catch (error) {
        console.error("Error scanning document:", error)
        
        // Update the document to show error
        const errorDoc = {
          ...newDoc,
          progress: 100,
          status: "error" as const,
          complianceMessage: "Failed to scan document. Please try again.",
          originalFile: file, // Preserve the original file for retry
        }
        
        setScannedDocs((prev) => prev.map((doc) => (doc.id === id ? errorDoc : doc)))
        
        // Show error toast
        toast.error("Failed to scan document. Please try again.")
        
        return errorDoc
      }
    }
  }

  const onDrop = async (acceptedFiles: File[]) => {
    // Check file size (10MB limit)
    const validFiles = acceptedFiles.filter((file) => file.size <= 10 * 1024 * 1024)
    const invalidFiles = acceptedFiles.filter((file) => file.size > 10 * 1024 * 1024)

    if (invalidFiles.length > 0) {
      toast.error(`${invalidFiles.length} file(s) exceeded the 10MB limit`)
    }

    if (validFiles.length === 0) return

    setIsScanning(true)
    setActiveTab("results")

    try {
      // Process files in sequence for better UX in this case
      for (const file of validFiles) {
        await simulateScan(file)

        // Add to document store
        const fileItem: Partial<FileItem> = {
          name: file.name,
          type: "file",
          modified: new Date().toISOString(),
          size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          path: [...currentPath],
          content: generateRandomPdfContent(file.name),
          file: file,
          url: URL.createObjectURL(file),
        }

        addFiles([fileItem])
      }

      toast.success(
        validFiles.length === 1
          ? "Document scanned successfully"
          : `${validFiles.length} documents scanned successfully`,
      )
    } catch (error) {
      toast.error("Scanning failed. Please try again.")
    } finally {
      setIsScanning(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: isScanning,
  })

  const clearScannedDocs = () => {
    setScannedDocs([])
    setSelectedDocId(null)
  }

  // Helper function to determine if context is filled out enough
  const hasMinimalContext = () => {
    return organizationContext.callSign && organizationContext.serviceType
  }

  // Get service type icon
  const getServiceIcon = () => {
    switch (organizationContext.serviceType) {
      case "am":
      case "fm":
        return <Radio className="h-5 w-5" />
      case "tv":
        return <Tv className="h-5 w-5" />
      case "satellite":
        return <Satellite className="h-5 w-5" />
      case "cable":
        return <Wifi className="h-5 w-5" />
      default:
        return <Broadcast className="h-5 w-5" />
    }
  }

  // Helper function to get status icon background color
  const getStatusIconBgColor = (doc: ScannedDocument) => {
    if (doc.status !== "complete") return "bg-muted"

    switch (doc.complianceStatus) {
      case "compliant":
        return "bg-green-100"
      case "issues":
        return "bg-red-100"
      case "review":
        return "bg-yellow-100"
      default:
        return "bg-muted"
    }
  }

  // Helper function to get status icon text color
  const getStatusIconTextColor = (doc: ScannedDocument) => {
    if (doc.status !== "complete") return "text-muted-foreground"

    switch (doc.complianceStatus) {
      case "compliant":
        return "text-green-600"
      case "issues":
        return "text-red-600"
      case "review":
        return "text-yellow-600"
      default:
        return "text-muted-foreground"
    }
  }

  // Helper function to get status badge color
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "compliant":
        return "bg-green-100 text-green-700"
      case "issues":
        return "bg-red-100 text-red-700"
      case "review":
        return "bg-yellow-100 text-yellow-700"
      default:
        return ""
    }
  }

  // Helper function to get compliance status color
  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case "COMPLIANT":
        return "text-green-600"
      case "PARTIAL":
        return "text-yellow-600"
      case "NON_COMPLIANT":
        return "text-red-600"
      default:
        return "text-muted-foreground"
    }
  }

  // Helper function to get compliance score color
  const getComplianceScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  // Get selected document
  const selectedDoc = selectedDocId ? scannedDocs.find((doc) => doc.id === selectedDocId) : null

  // Add a retry function to rescan a document
  const retryDocumentScan = async (docId: string) => {
    // Find the document
    const docToRetry = scannedDocs.find(doc => doc.id === docId)
    
    if (!docToRetry || !docToRetry.originalFile) {
      toast.error("Cannot retry scan: original file not found")
      return
    }
    
    // Set loading state
    setRetryingDocIds(prev => [...prev, docId])
    
    // Show initial toast notification
    toast.info(`Retrying scan for document: ${docToRetry.name}`, {
      duration: 2000,
    })
    
    try {
      // Remove the old document
      setScannedDocs(prev => prev.filter(doc => doc.id !== docId))
      
      // Rescan the document
      await simulateScan(docToRetry.originalFile)
      toast.success(`Document "${docToRetry.name}" scan restarted successfully`, {
        description: "The document is being processed again.",
        duration: 4000,
      })
    } catch (error) {
      toast.error(`Failed to retry scan for "${docToRetry.name}"`, {
        description: "Please try again or upload a new copy of the document.",
        duration: 5000,
      })
    } finally {
      // Clear loading state
      setRetryingDocIds(prev => prev.filter(id => id !== docId))
    }
  }

  // Add a rescan function for documents that were successfully scanned
  const rescanDocument = async (docId: string) => {
    // Find the document
    const docToRescan = scannedDocs.find(doc => doc.id === docId)
    
    if (!docToRescan || !docToRescan.originalFile) {
      toast.error("Cannot rescan document: original file not found")
      return
    }
    
    // Set loading state
    setRetryingDocIds(prev => [...prev, docId])
    
    // Show initial toast notification
    toast.info(`Rescanning document: ${docToRescan.name}`, {
      duration: 2000,
    })
    
    try {
      // Remove the old document
      setScannedDocs(prev => prev.filter(doc => doc.id !== docId))
      
      // Rescan the document
      await simulateScan(docToRescan.originalFile)
      toast.success(`Document "${docToRescan.name}" rescanned successfully`, {
        description: "The document has been rescanned with the latest compliance rules.",
        duration: 4000,
      })
    } catch (error) {
      toast.error(`Failed to rescan "${docToRescan.name}"`, {
        description: "Please try again or contact support if the issue persists.",
        duration: 5000,
      })
    } finally {
      // Clear loading state
      setRetryingDocIds(prev => prev.filter(id => id !== docId))
    }
  }

  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quick Scan</h1>
          <p className="text-muted-foreground">Quickly scan documents for FCC compliance issues</p>
        </div>
        <div className="flex items-center gap-2">
          {hasMinimalContext() && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm">
                    {getServiceIcon()}
                    <span className="font-medium">{organizationContext.callSign}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Scanning with {organizationContext.callSign} context</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {scannedDocs.length > 0 && (
            <Button variant="outline" onClick={clearScannedDocs}>
              Clear Results
            </Button>
          )}
        </div>
      </div>

      <Collapsible open={contextExpanded} onOpenChange={setContextExpanded} className="w-full space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings
              className={cn("h-5 w-5 transition-colors", contextExpanded ? "text-primary" : "text-muted-foreground")}
            />
            <h2
              className={cn(
                "text-xl font-semibold transition-colors",
                contextExpanded ? "text-primary" : "text-foreground",
              )}
            >
              Organization Context
            </h2>
            {hasMinimalContext() && (
              <Badge variant="outline" className="ml-2 bg-primary/5">
                Active
              </Badge>
            )}
          </div>
          <Button
            variant={contextExpanded ? "secondary" : "outline"}
            size="sm"
            className="gap-2"
            onClick={() => setContextExpanded(!contextExpanded)}
          >
            {contextExpanded ? "Hide Context" : "Configure Context"}
            <ChevronDown
              className={cn("h-4 w-4 transition-transform duration-200", contextExpanded ? "rotate-180" : "")}
            />
          </Button>
        </div>

        <CollapsibleContent className="space-y-4 pt-4">
          <Card className="overflow-hidden border-2 border-primary/10 shadow-md transition-all hover:border-primary/20">
            <CardHeader className="bg-muted/50 pb-2">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Antenna className="h-5 w-5 text-primary" />
                FCC Compliance Context
              </CardTitle>
              <CardDescription>
                Provide details about your organization to improve compliance scanning accuracy
              </CardDescription>
            </CardHeader>

            <Tabs value={contextTab} onValueChange={setContextTab} className="p-6">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="station" className="gap-2">
                  <Signal className="h-4 w-4" />
                  Station Info
                </TabsTrigger>
                <TabsTrigger value="license" className="gap-2">
                  <FileCheck className="h-4 w-4" />
                  License Details
                </TabsTrigger>
                <TabsTrigger value="organization" className="gap-2">
                  <Building className="h-4 w-4" />
                  Organization
                </TabsTrigger>
              </TabsList>

              <TabsContent value="station" className="space-y-6 mt-0">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="callSign" className="flex items-center gap-1">
                      Station Call Sign
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Your FCC-assigned call sign (e.g., WXYZ-FM)</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="relative">
                      <Input
                        id="callSign"
                        placeholder="WXYZ-FM"
                        value={organizationContext.callSign}
                        onChange={(e) => updateContext("callSign", e.target.value)}
                        className="pl-9 transition-all focus:border-primary"
                      />
                      <Radio className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency" className="flex items-center gap-1">
                      Frequency/Channel
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Your broadcast frequency (e.g., 98.7 MHz) or channel number</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="relative">
                      <Input
                        id="frequency"
                        placeholder="98.7 MHz"
                        value={organizationContext.frequency}
                        onChange={(e) => updateContext("frequency", e.target.value)}
                        className="pl-9 transition-all focus:border-primary"
                      />
                      <Zap className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2 sm:col-span-2">
                    <Label className="flex items-center gap-1">
                      Service Type
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">The type of broadcast service you provide</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </Label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { value: "am", label: "AM Radio", icon: <Radio className="h-4 w-4" /> },
                        { value: "fm", label: "FM Radio", icon: <Radio className="h-4 w-4" /> },
                        { value: "tv", label: "Television", icon: <Tv className="h-4 w-4" /> },
                        { value: "satellite", label: "Satellite", icon: <Satellite className="h-4 w-4" /> },
                        { value: "cable", label: "Cable", icon: <Wifi className="h-4 w-4" /> },
                        { value: "other", label: "Other", icon: <Broadcast className="h-4 w-4" /> },
                      ].map((service) => (
                        <div
                          key={service.value}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-md border p-3 transition-all hover:border-primary/50 hover:bg-muted",
                            organizationContext.serviceType === service.value
                              ? "border-primary bg-primary/5"
                              : "border-muted-foreground/20",
                          )}
                          onClick={() => updateContext("serviceType", service.value)}
                        >
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
                              organizationContext.serviceType === service.value
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted-foreground/10 text-muted-foreground",
                            )}
                          >
                            {service.icon}
                          </div>
                          <span
                            className={cn(
                              "text-sm font-medium",
                              organizationContext.serviceType === service.value
                                ? "text-primary"
                                : "text-muted-foreground",
                            )}
                          >
                            {service.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="license" className="space-y-6 mt-0">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>License Type</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { value: "commercial", label: "Commercial" },
                        { value: "noncommercial", label: "Non-Commercial" },
                        { value: "lpfm", label: "Low Power FM (LPFM)" },
                        { value: "lpam", label: "Low Power AM (LPAM)" },
                        { value: "lptv", label: "Low Power TV (LPTV)" },
                      ].map((license) => (
                        <div
                          key={license.value}
                          className={cn(
                            "flex cursor-pointer items-center gap-3 rounded-md border p-3 transition-all hover:border-primary/50",
                            organizationContext.licenseType === license.value
                              ? "border-primary bg-primary/5"
                              : "border-muted-foreground/20",
                          )}
                          onClick={() => updateContext("licenseType", license.value)}
                        >
                          <div className="flex h-5 w-5 items-center justify-center">
                            <div
                              className={cn(
                                "h-3 w-3 rounded-full transition-colors",
                                organizationContext.licenseType === license.value
                                  ? "bg-primary"
                                  : "bg-muted-foreground/20",
                              )}
                            />
                          </div>
                          <span className="text-sm font-medium">{license.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="market" className="flex items-center gap-1">
                        Market/Location
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Your station's primary market or city of license</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="relative">
                        <Input
                          id="market"
                          placeholder="New York, NY"
                          value={organizationContext.market}
                          onChange={(e) => updateContext("market", e.target.value)}
                          className="pl-9 transition-all focus:border-primary"
                        />
                        <Building className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="lastRenewal" className="flex items-center gap-1">
                        Last License Renewal
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Date of your most recent license renewal</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Label>
                      <div className="relative">
                        <Input
                          id="lastRenewal"
                          type="date"
                          value={organizationContext.lastRenewal}
                          onChange={(e) => updateContext("lastRenewal", e.target.value)}
                          className="pl-9 transition-all focus:border-primary"
                        />
                        <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="organization" className="space-y-6 mt-0">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Ownership Structure</Label>
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { value: "single", label: "Single Station", description: "Independently owned and operated" },
                        { value: "group", label: "Group Owner", description: "Part of a broadcast group" },
                        {
                          value: "network",
                          label: "Network Affiliate",
                          description: "Affiliated with a major network",
                        },
                      ].map((ownership) => (
                        <div
                          key={ownership.value}
                          className={cn(
                            "flex cursor-pointer flex-col rounded-md border p-3 transition-all hover:border-primary/50",
                            organizationContext.ownershipStructure === ownership.value
                              ? "border-primary bg-primary/5"
                              : "border-muted-foreground/20",
                          )}
                          onClick={() => updateContext("ownershipStructure", ownership.value)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-5 w-5 items-center justify-center">
                              <div
                                className={cn(
                                  "h-3 w-3 rounded-full transition-colors",
                                  organizationContext.ownershipStructure === ownership.value
                                    ? "bg-primary"
                                    : "bg-muted-foreground/20",
                                )}
                              />
                            </div>
                            <span className="text-sm font-medium">{ownership.label}</span>
                          </div>
                          <p className="ml-8 mt-1 text-xs text-muted-foreground">{ownership.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Public File Type</Label>{" "}
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        {
                          value: "online",
                          label: "Online",
                          description: "Maintained on the FCC's online public file system",
                        },
                        {
                          value: "physical",
                          label: "Physical",
                          description: "Maintained at the station's main studio",
                        },
                        { value: "hybrid", label: "Hybrid", description: "Combination of online and physical files" },
                      ].map((fileType) => (
                        <div
                          key={fileType.value}
                          className={cn(
                            "flex cursor-pointer flex-col rounded-md border p-3 transition-all hover:border-primary/50",
                            organizationContext.publicFileType === fileType.value
                              ? "border-primary bg-primary/5"
                              : "border-muted-foreground/20",
                          )}
                          onClick={() => updateContext("publicFileType", fileType.value)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="flex h-5 w-5 items-center justify-center">
                              <div
                                className={cn(
                                  "h-3 w-3 rounded-full transition-colors",
                                  organizationContext.publicFileType === fileType.value
                                    ? "bg-primary"
                                    : "bg-muted-foreground/20",
                                )}
                              />
                            </div>
                            <span className="text-sm font-medium">{fileType.label}</span>
                          </div>
                          <p className="ml-8 mt-1 text-xs text-muted-foreground">{fileType.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <CardFooter className="flex justify-between bg-muted/30 px-6 py-4">
              <div className="text-sm text-muted-foreground">
                {hasMinimalContext() ? (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Context active for scanning</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <span>Add station call sign to activate context</span>
                  </div>
                )}
              </div>
              <Button variant="default" onClick={() => setContextExpanded(false)} className="gap-2">
                <CheckCircle className="h-4 w-4" />
                Apply Context
              </Button>
            </CardFooter>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {selectedDoc ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="icon" onClick={() => setSelectedDocId(null)}>
                <ArrowRight className="h-4 w-4 rotate-180" />
              </Button>
              <div>
                <h2 className="text-xl font-semibold">{selectedDoc.name}</h2>
                <p className="text-sm text-muted-foreground">Uploaded {selectedDoc.uploadTime}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                Download Report
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Printer className="h-4 w-4" />
                Print
              </Button>
            </div>
          </div>

          {selectedDoc.detailedReport && (
            <Card className="overflow-hidden border-2 shadow-md">
              <CardHeader className="bg-muted/50 pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <FileCheck className="h-5 w-5 text-primary" />
                    Compliance Report
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-medium">Score:</span>
                      <span
                        className={cn(
                          "text-lg font-bold",
                          getComplianceScoreColor(selectedDoc.detailedReport.compliance_score),
                        )}
                      >
                        {selectedDoc.detailedReport.compliance_score}%
                      </span>
                    </div>
                    <Badge
                      className={cn(
                        "ml-2 px-3 py-1",
                        selectedDoc.detailedReport.compliance_status === "COMPLIANT" && "bg-green-100 text-green-800",
                        selectedDoc.detailedReport.compliance_status === "PARTIAL" && "bg-yellow-100 text-yellow-800",
                        selectedDoc.detailedReport.compliance_status === "NON_COMPLIANT" && "bg-red-100 text-red-800",
                      )}
                    >
                      {selectedDoc.detailedReport.compliance_status}
                    </Badge>
                  </div>
                </div>
                <CardDescription>Detailed compliance analysis for {selectedDoc.name}</CardDescription>
              </CardHeader>

              <Tabs value={reportTab} onValueChange={setReportTab} className="p-6">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="summary" className="gap-2">
                    <BarChart4 className="h-4 w-4" />
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="issues" className="gap-2">
                    <FileWarning className="h-4 w-4" />
                    Issues
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="gap-2">
                    <ListChecks className="h-4 w-4" />
                    Recommendations
                  </TabsTrigger>
                  <TabsTrigger value="sections" className="gap-2">
                    <ShieldAlert className="h-4 w-4" />
                    Section Analysis
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-6 mt-0">
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Summary of Findings</h3>
                    <p className="text-muted-foreground">{selectedDoc.detailedReport.summary_of_findings}</p>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex flex-col items-center">
                        <div className="relative h-32 w-32">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span
                              className={cn(
                                "text-3xl font-bold",
                                getComplianceScoreColor(selectedDoc.detailedReport.compliance_score),
                              )}
                            >
                              {selectedDoc.detailedReport.compliance_score}%
                            </span>
                          </div>
                          <svg className="h-32 w-32" viewBox="0 0 100 100">
                            <circle
                              className="text-muted stroke-current"
                              strokeWidth="10"
                              fill="transparent"
                              r="40"
                              cx="50"
                              cy="50"
                            />
                            <circle
                              className={cn(
                                "stroke-current",
                                selectedDoc.detailedReport.compliance_score >= 80
                                  ? "text-green-500"
                                  : selectedDoc.detailedReport.compliance_score >= 70
                                    ? "text-yellow-500"
                                    : "text-red-500",
                              )}
                              strokeWidth="10"
                              strokeDasharray={`${selectedDoc.detailedReport.compliance_score * 2.51} 251`}
                              strokeLinecap="round"
                              fill="transparent"
                              r="40"
                              cx="50"
                              cy="50"
                              transform="rotate(-90 50 50)"
                            />
                          </svg>
                        </div>
                        <span className="mt-2 text-sm font-medium">Overall Score</span>
                      </div>

                      <div className="flex-1 ml-8">
                        <h4 className="text-sm font-medium mb-3">Key Metrics</h4>
                        <div className="space-y-4">
                          {Object.entries(selectedDoc.detailedReport.section_scores).map(([section, score]) => (
                            <div key={section} className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span>{section}</span>
                                <span
                                  className={cn(
                                    "font-medium",
                                    score >= 80 ? "text-green-600" : score >= 70 ? "text-yellow-600" : "text-red-600",
                                  )}
                                >
                                  {score}%
                                </span>
                              </div>
                              <Progress
                                value={score}
                                className={cn(
                                  "h-2",
                                  score >= 80 ? "bg-green-100" : score >= 70 ? "bg-yellow-100" : "bg-red-100",
                                )}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="issues" className="space-y-6 mt-0">
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Specific Issues Identified</h3>
                    <div className="space-y-4">
                      {selectedDoc.detailedReport.specific_issues.split("\n").map((issue, index) => (
                        <div key={index} className="flex items-start gap-3 rounded-md bg-muted/50 p-3">
                          <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600" />
                          <div>
                            <p className="font-medium">Issue #{index + 1}</p>
                            <p className="text-sm text-muted-foreground">{issue}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-6 mt-0">
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Actionable Recommendations</h3>
                    <div className="space-y-4">
                      {selectedDoc.detailedReport.recommendations.split("\n").map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 rounded-md bg-green-50 p-3">
                          <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                          <div>
                            <p className="font-medium">Recommendation #{index + 1}</p>
                            <p className="text-sm text-muted-foreground">{recommendation}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sections" className="space-y-6 mt-0">
                  <div className="rounded-lg border bg-card p-6">
                    <h3 className="text-lg font-semibold mb-4">Section-by-Section Analysis</h3>
                    <div className="space-y-6">
                      {Object.entries(selectedDoc.detailedReport.section_scores).map(([section, score]) => (
                        <div key={section} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{section}</h4>
                            <Badge
                              className={cn(
                                "ml-2",
                                score >= 80
                                  ? "bg-green-100 text-green-800"
                                  : score >= 70
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800",
                              )}
                            >
                              {score >= 80 ? "COMPLIANT" : score >= 70 ? "PARTIAL" : "NON_COMPLIANT"}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="relative h-16 w-16">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <span
                                  className={cn(
                                    "text-lg font-bold",
                                    score >= 80 ? "text-green-600" : score >= 70 ? "text-yellow-600" : "text-red-600",
                                  )}
                                >
                                  {score}%
                                </span>
                              </div>
                              <svg className="h-16 w-16" viewBox="0 0 100 100">
                                <circle
                                  className="text-muted stroke-current"
                                  strokeWidth="10"
                                  fill="transparent"
                                  r="40"
                                  cx="50"
                                  cy="50"
                                />
                                <circle
                                  className={cn(
                                    "stroke-current",
                                    score >= 80 ? "text-green-500" : score >= 70 ? "text-yellow-500" : "text-red-500",
                                  )}
                                  strokeWidth="10"
                                  strokeDasharray={`${score * 2.51} 251`}
                                  strokeLinecap="round"
                                  fill="transparent"
                                  r="40"
                                  cx="50"
                                  cy="50"
                                  transform="rotate(-90 50 50)"
                                />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <Progress
                                value={score}
                                className={cn(
                                  "h-2",
                                  score >= 80 ? "bg-green-100" : score >= 70 ? "bg-yellow-100" : "bg-red-100",
                                )}
                              />
                              <p className="mt-2 text-sm text-muted-foreground">
                                {score >= 80
                                  ? "This section meets FCC compliance requirements."
                                  : score >= 70
                                    ? "This section needs minor improvements to meet FCC requirements."
                                    : "This section requires significant updates to meet FCC requirements."}
                              </p>
                            </div>
                          </div>
                          <Separator className="my-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          )}
        </div>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="results" className="gap-2">
              <FileText className="h-4 w-4" />
              Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="mt-6">
            <Card className="overflow-hidden border-2 transition-all hover:border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Document
                </CardTitle>
                <CardDescription>
                  Drag and drop or click to upload a PDF document for quick compliance scanning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  {...getRootProps()}
                  className={cn(
                    "flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors",
                    isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
                    isScanning && "pointer-events-none opacity-50",
                  )}
                >
                  <input {...getInputProps()} />
                  <div
                    className={cn(
                      "mb-4 flex h-24 w-24 items-center justify-center rounded-full transition-all",
                      isDragActive ? "bg-primary/10" : "bg-muted",
                    )}
                  >
                    <Upload className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <h3 className="mb-1 text-lg font-medium">
                    {isScanning ? "Scanning document..." : "Drop your document here"}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">or click to browse</p>
                  <Button
                    variant="secondary"
                    size="sm"
                    disabled={isScanning}
                    className="transition-all hover:bg-primary hover:text-primary-foreground"
                  >
                    {isScanning ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      "Browse Files"
                    )}
                  </Button>
                  <p className="mt-4 text-xs text-muted-foreground">Supported format: PDF (max 10MB)</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between bg-muted/30 px-6 py-4">
                <div className="text-sm text-muted-foreground">
                  {hasMinimalContext() ? (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span>Using {organizationContext.callSign} context for scanning</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                      <span>Configure context for better results</span>
                    </div>
                  )}
                </div>
                <Button variant="outline" onClick={() => setContextExpanded(!contextExpanded)} className="gap-2">
                  <Settings className="h-4 w-4" />
                  {contextExpanded ? "Hide Context" : "Configure Context"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="results" className="mt-6">
            <Card className="overflow-hidden border-2 transition-all hover:border-primary/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Scan Results
                </CardTitle>
                <CardDescription>View compliance scan results for uploaded documents</CardDescription>
              </CardHeader>
              <CardContent>
                {scannedDocs.length === 0 ? (
                  <div className="flex h-[300px] flex-col items-center justify-center text-center text-muted-foreground">
                    <div className="mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                      <FileText className="h-12 w-12" />
                    </div>
                    <p className="text-lg font-medium">No documents scanned yet</p>
                    <p className="text-sm">Upload a document to see results</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {scannedDocs.map((doc) => (
                      <div
                        key={doc.id}
                        className="rounded-lg border p-4 transition-all hover:border-primary/20 hover:bg-muted/20"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            <div
                              className={cn(
                                "flex h-10 w-10 items-center justify-center rounded-full",
                                getStatusIconBgColor(doc),
                              )}
                            >
                              <FileText className={cn("h-5 w-5", getStatusIconTextColor(doc))} />
                            </div>
                            <div>
                              <p className="font-medium">{doc.name}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{doc.size}</span>
                                <span>•</span>
                                <span>{doc.uploadTime}</span>
                              </div>
                            </div>
                          </div>
                          {doc.status === "complete" && doc.complianceStatus && (
                            <div
                              className={cn(
                                "flex h-6 items-center rounded-full px-3 text-xs font-medium",
                                getStatusBadgeColor(doc.complianceStatus),
                              )}
                            >
                              {doc.complianceStatus === "compliant" && "Compliant"}
                              {doc.complianceStatus === "issues" && "Issues Found"}
                              {doc.complianceStatus === "review" && "Review Needed"}
                            </div>
                          )}
                        </div>

                        {doc.status === "scanning" ? (
                          <div className="mt-4">
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span>Scanning document...</span>
                              <span>{doc.progress}%</span>
                            </div>
                            <Progress value={doc.progress} className="h-2" />
                          </div>
                        ) : doc.status === "complete" ? (
                          <>
                            <div className="mt-4 flex items-start gap-2 rounded-md bg-muted/50 p-3">
                              {doc.complianceStatus === "compliant" ? (
                                <CheckCircle className="mt-0.5 h-5 w-5 text-green-600" />
                              ) : (
                                <AlertCircle className="mt-0.5 h-5 w-5 text-yellow-600" />
                              )}
                              <p className="text-sm">{doc.complianceMessage}</p>
                            </div>

                            {doc.detailedReport && (
                              <div className="mt-4 rounded-md bg-muted/30 p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <BarChart4 className="h-4 w-4 text-primary" />
                                    <span className="font-medium">Compliance Score</span>
                                  </div>
                                  <span
                                    className={cn(
                                      "font-bold",
                                      getComplianceScoreColor(doc.detailedReport.compliance_score),
                                    )}
                                  >
                                    {doc.detailedReport.compliance_score}%
                                  </span>
                                </div>
                                <Progress
                                  value={doc.detailedReport.compliance_score}
                                  className={cn(
                                    "h-2 mb-3",
                                    doc.detailedReport.compliance_score >= 80
                                      ? "bg-green-100"
                                      : doc.detailedReport.compliance_score >= 70
                                        ? "bg-yellow-100"
                                        : "bg-red-100",
                                  )}
                                />
                                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                                  {doc.detailedReport.summary_of_findings}
                                </p>
                              </div>
                            )}

                            <div className="mt-4 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 transition-all hover:bg-primary hover:text-primary-foreground"
                                onClick={() => setSelectedDocId(doc.id)}
                              >
                                <FileText className="h-4 w-4" />
                                View Detailed Report
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 transition-all hover:bg-primary hover:text-primary-foreground"
                              >
                                <CheckCircle className="h-4 w-4" />
                                Save to Documents
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 transition-all hover:bg-primary hover:text-primary-foreground"
                                onClick={() => rescanDocument(doc.id)}
                                disabled={retryingDocIds.includes(doc.id)}
                              >
                                {retryingDocIds.includes(doc.id) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Zap className="h-4 w-4" />
                                )}
                                {retryingDocIds.includes(doc.id) ? "Rescanning..." : "Rescan"}
                              </Button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="mt-4 flex items-start gap-2">
                              <AlertCircle className="mt-0.5 h-4 w-4 text-red-600" />
                              <p className="text-sm text-muted-foreground">Error scanning document</p>
                            </div>
                            <div className="mt-4 flex gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 transition-all hover:bg-primary hover:text-primary-foreground"
                                onClick={() => retryDocumentScan(doc.id)}
                                disabled={retryingDocIds.includes(doc.id)}
                              >
                                {retryingDocIds.includes(doc.id) ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Loader2 className="h-4 w-4" />
                                )}
                                {retryingDocIds.includes(doc.id) ? "Retrying..." : "Retry Scan"}
                              </Button>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* Detailed Report Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <span className="hidden">Open Report</span>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle>Detailed Compliance Report</DialogTitle>
                <DialogDescription>Comprehensive analysis of document compliance with FCC regulations</DialogDescription>
              </div>
              {selectedDoc && selectedDoc.status === "complete" && (
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => selectedDoc.id && rescanDocument(selectedDoc.id)}
                >
                  <Zap className="h-4 w-4" />
                  Rescan
                </Button>
              )}
            </div>
          </DialogHeader>
          <ScrollArea className="h-[70vh]">
            <div className="p-4 space-y-6">
              {selectedDoc?.detailedReport && (
                <>
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">{selectedDoc.name}</h3>
                    <Badge
                      className={cn(
                        "ml-2 px-3 py-1",
                        selectedDoc.detailedReport.compliance_status === "COMPLIANT" && "bg-green-100 text-green-800",
                        selectedDoc.detailedReport.compliance_status === "PARTIAL" && "bg-yellow-100 text-yellow-800",
                        selectedDoc.detailedReport.compliance_status === "NON_COMPLIANT" && "bg-red-100 text-red-800",
                      )}
                    >
                      {selectedDoc.detailedReport.compliance_status}
                    </Badge>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-2">Summary of Findings</h4>
                    <p className="text-sm text-muted-foreground">{selectedDoc.detailedReport.summary_of_findings}</p>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-2">Section Breakdown</h4>
                    <div className="space-y-4">
                      {selectedDoc.detailedReport.section_breakdown.split("\n").map((section, index) => (
                        <div key={index} className="text-sm">
                          {section}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-2">Specific Issues</h4>
                    <div className="space-y-2">
                      {selectedDoc.detailedReport.specific_issues.split("\n").map((issue, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                          <p className="text-sm">{issue}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg border p-4">
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <div className="space-y-2">
                      {selectedDoc.detailedReport.recommendations.split("\n").map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                          <p className="text-sm">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}

