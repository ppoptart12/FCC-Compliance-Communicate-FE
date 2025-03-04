"use client"

import { FileUp, Upload } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDocumentStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import type { FileItem } from "@/lib/types"

interface FileWithPreview extends File {
  id: string
  preview: string
  progress: number
  status: "uploading" | "complete" | "error"
}

interface FileUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
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

// Helper function to get MIME type from file extension
const getMimeType = (filename: string): string => {
  const ext = filename.split(".").pop()?.toLowerCase()
  const mimeTypes: Record<string, string> = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    txt: "text/plain",
  }

  return mimeTypes[ext || ""] || "application/octet-stream"
}

export function FileUploadDialog({ open, onOpenChange }: FileUploadDialogProps) {
  const [files, setFiles] = useState<FileWithPreview[]>([])
  const { addFiles, currentPath } = useDocumentStore()
  const [uploading, setUploading] = useState(false)

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setFiles([])
      setUploading(false)
    }
  }, [open])

  // Cleanup function
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  const simulateUpload = useCallback(async (file: FileWithPreview) => {
    return new Promise<void>((resolve) => {
      let progress = 0
      const increment = 20 // Faster increments
      const interval = setInterval(() => {
        progress += increment

        if (progress >= 100) {
          clearInterval(interval)
          setFiles((prevFiles) =>
            prevFiles.map((f) => (f.id === file.id ? { ...f, progress: 100, status: "complete" } : f)),
          )
          resolve()
        } else {
          setFiles((prevFiles) => prevFiles.map((f) => (f.id === file.id ? { ...f, progress } : f)))
        }
      }, 100) // Faster intervals
    })
  }, [])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      // Check file size (10MB limit)
      const validFiles = acceptedFiles.filter((file) => file.size <= 10 * 1024 * 1024)
      const invalidFiles = acceptedFiles.filter((file) => file.size > 10 * 1024 * 1024)

      if (invalidFiles.length > 0) {
        toast.error(`${invalidFiles.length} file(s) exceeded the 10MB limit`)
      }

      if (validFiles.length === 0) return

      setUploading(true)

      const newFiles = validFiles.map((file) => ({
        ...file,
        id: Math.random().toString(36).substring(7),
        preview: URL.createObjectURL(file),
        progress: 0,
        status: "uploading" as const,
      }))

      setFiles((prev) => [...prev, ...newFiles])

      try {
        // Process files in parallel
        await Promise.all(newFiles.map((file) => simulateUpload(file)))

        // Create file items with the actual files
        const fileItems: Partial<FileItem>[] = validFiles.map((file) => {
          // Ensure the file has the correct MIME type
          const mimeType = file.type || getMimeType(file.name)

          // Create a blob with the correct MIME type
          const blob = new Blob([file], { type: mimeType })
          const url = URL.createObjectURL(blob)

          return {
            name: file.name,
            type: "file",
            modified: new Date().toISOString(),
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            path: [...currentPath],
            content: generateRandomPdfContent(file.name), // Fallback content
            file: file, // Store the actual file
            url: url, // Store the blob URL
          }
        })

        // Add files to the store
        addFiles(fileItems)

        // Show success message
        toast.success(
          validFiles.length === 1 ? "File uploaded successfully" : `${validFiles.length} files uploaded successfully`,
        )

        // Reset state and close dialog
        setFiles([])
        onOpenChange(false)
      } catch (error) {
        toast.error("Upload failed. Please try again.")
      } finally {
        setUploading(false)
      }
    },
    [addFiles, currentPath, onOpenChange, simulateUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "text/plain": [".txt"],
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading,
  })

  const handleClose = (open: boolean) => {
    if (!open) {
      if (uploading) {
        toast.error("Please wait for uploads to complete")
        return
      }
      // Clean up and reset state
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
      setFiles([])
      setUploading(false)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Upload Documents</DialogTitle>
          <DialogDescription>Upload documents to {currentPath.join(" / ")}</DialogDescription>
        </DialogHeader>
        <div
          {...getRootProps()}
          className={cn(
            "mt-4 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors",
            isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
            uploading && "pointer-events-none opacity-50",
          )}
        >
          <input {...getInputProps()} />
          <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
          <p className="mb-2 text-sm font-medium">{uploading ? "Upload in progress..." : "Drop your files here"}</p>
          <p className="text-xs text-muted-foreground">PDF, DOC, DOCX, TXT, JPG, PNG files up to 10MB</p>
        </div>
        {files.length > 0 && (
          <ScrollArea className="h-[200px]">
            <div className="space-y-4 p-2">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-4 rounded-lg border bg-muted/40 p-3">
                  <FileUp className="h-8 w-8 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium leading-none">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress
                        value={file.progress}
                        className={cn("h-2 flex-1", file.status === "complete" && "bg-primary/20")}
                      />
                      <span className="text-xs text-muted-foreground">
                        {file.status === "complete" ? "Complete" : `${Math.round(file.progress)}%`}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>
            {uploading ? "Uploading..." : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

