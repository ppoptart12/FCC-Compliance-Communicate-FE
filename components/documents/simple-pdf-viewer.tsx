"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FileItem } from "@/lib/types"

interface SimplePDFViewerProps {
  file: FileItem
}

export default function SimplePDFViewer({ file }: SimplePDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageContent, setPageContent] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!file) return

    setLoading(true)

    try {
      // Use the simulated content or extract text from the real file
      if (file.content && Array.isArray(file.content)) {
        setPageContent(file.content[0] || "")
        setTotalPages(file.content.length)
      } else {
        setPageContent("This document contains content that can't be displayed as text.")
        setTotalPages(1)
      }
    } catch (error) {
      console.error("Error loading document:", error)
      setError("Failed to load document content.")
      setPageContent("Error loading document content.")
      setTotalPages(1)
    } finally {
      setLoading(false)
    }
  }, [file])

  useEffect(() => {
    // When current page changes, update the content
    if (file?.content && currentPage >= 0 && currentPage < file.content.length) {
      setPageContent(file.content[currentPage] || "")
    }
  }, [currentPage, file])

  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {error && (
        <div className="mb-4 rounded-md bg-yellow-50 p-4 text-yellow-800">
          <p>{error}</p>
        </div>
      )}

      <div className="mx-auto flex min-h-[800px] max-w-3xl flex-col rounded-md bg-white p-12 shadow-lg">
        <div className="flex-1 whitespace-pre-line">{pageContent}</div>
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Page {currentPage + 1} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevPage} disabled={currentPage === 0 || loading}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button variant="outline" size="icon" onClick={nextPage} disabled={currentPage === totalPages - 1 || loading}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

