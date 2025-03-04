"use client"

import { useState, useEffect, useRef } from "react"
import { Download, X, Loader2, FileText, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useDocumentStore } from "@/lib/store"

export function PdfViewer() {
  const { selectedFile, selectFile } = useDocumentStore()
  const [loading, setLoading] = useState(true)
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [fallbackMode, setFallbackMode] = useState(false)
  const [currentPage, setCurrentPage] = useState(0)
  const createdObjectUrl = useRef<string | null>(null)

  useEffect(() => {
    if (!selectedFile) return

    setLoading(true)
    setFallbackMode(false)
    setCurrentPage(0)

    // Clean up previous object URL if we created one
    if (createdObjectUrl.current) {
      URL.revokeObjectURL(createdObjectUrl.current)
      createdObjectUrl.current = null
    }

    // Create object URL from file if available
    if (selectedFile.file instanceof File) {
      // Create a blob with the correct MIME type
      const blob = new Blob([selectedFile.file], { type: selectedFile.file.type || "application/pdf" })
      const url = URL.createObjectURL(blob)
      createdObjectUrl.current = url // Track that we created this URL
      setObjectUrl(url)
      setLoading(false)
    } else if (selectedFile.url) {
      setObjectUrl(selectedFile.url)
      setLoading(false)
    } else {
      // No file or URL available, use fallback
      setObjectUrl(null)
      setFallbackMode(true)
      setLoading(false)
    }

    // Cleanup function
    return () => {
      if (createdObjectUrl.current) {
        URL.revokeObjectURL(createdObjectUrl.current)
        createdObjectUrl.current = null
      }
    }
  }, [selectedFile])

  if (!selectedFile) {
    return null
  }

  const closeViewer = () => {
    // Clean up object URL if we created one
    if (createdObjectUrl.current) {
      URL.revokeObjectURL(createdObjectUrl.current)
      createdObjectUrl.current = null
    }
    selectFile(null)
  }

  const downloadPdf = () => {
    if (objectUrl) {
      const link = document.createElement("a")
      link.href = objectUrl
      link.download = selectedFile.name
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const openInNewTab = () => {
    if (objectUrl) {
      window.open(objectUrl, "_blank")
    }
  }

  const nextPage = () => {
    if (selectedFile.content && currentPage < selectedFile.content.length - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative flex h-[90vh] w-[90vw] max-w-5xl flex-col rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-medium">{selectedFile.name}</h3>
          <div className="flex items-center gap-2">
            {objectUrl && (
              <Button variant="outline" size="sm" onClick={openInNewTab}>
                <ExternalLink className="mr-2 h-4 w-4" />
                Open in New Tab
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={downloadPdf} disabled={!objectUrl}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
            <Button variant="ghost" size="icon" onClick={closeViewer}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>
        </div>

        {/* PDF Content */}
        <div className="flex-1 overflow-auto bg-gray-100 p-8">
          {loading ? (
            <div className="flex h-full items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : fallbackMode || !objectUrl ? (
            // Fallback to text content
            <div className="mx-auto flex min-h-[800px] max-w-3xl flex-col rounded-md bg-white p-12 shadow-lg">
              <div className="mb-4 flex items-center justify-center">
                <FileText className="h-16 w-16 text-muted-foreground" />
              </div>
              {selectedFile.content && selectedFile.content.length > 0 ? (
                <div className="flex-1 whitespace-pre-line">{selectedFile.content[currentPage]}</div>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No content available for this document.
                </div>
              )}

              {/* Navigation for text content */}
              {selectedFile.content && selectedFile.content.length > 1 && (
                <div className="mt-8 flex items-center justify-between">
                  <Button variant="outline" onClick={prevPage} disabled={currentPage === 0}>
                    Previous Page
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage + 1} of {selectedFile.content.length}
                  </span>
                  <Button
                    variant="outline"
                    onClick={nextPage}
                    disabled={currentPage === selectedFile.content.length - 1}
                  >
                    Next Page
                  </Button>
                </div>
              )}
            </div>
          ) : (
            // Use object tag to display PDF instead of iframe
            <div className="flex h-full flex-col items-center justify-center">
              <object data={objectUrl} type="application/pdf" className="h-full w-full rounded-md bg-white shadow-lg">
                <div className="flex h-full flex-col items-center justify-center p-8 text-center">
                  <FileText className="mb-4 h-16 w-16 text-muted-foreground" />
                  <p className="mb-4 text-lg font-medium">Unable to display PDF</p>
                  <p className="mb-6 text-muted-foreground">
                    Your browser cannot display this PDF inline. Please use the buttons above to download or open in a
                    new tab.
                  </p>
                  <Button onClick={openInNewTab}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Open in New Tab
                  </Button>
                </div>
              </object>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

