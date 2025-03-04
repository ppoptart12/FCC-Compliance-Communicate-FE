"use client"

import { useEffect, useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { FileItem } from "@/lib/types"
import * as pdfjs from "pdfjs-dist"

// Initialize PDF.js worker with a proper string URL
// This is the correct way to set the worker source in Next.js
useEffect(() => {
  // Set the worker source to a string URL
  // This must be done inside useEffect to avoid SSR issues
  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
}, [])

interface PDFViewerProps {
  file: FileItem
}

export default function PDFViewerCore({ file }: PDFViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [pdfDocument, setPdfDocument] = useState<pdfjs.PDFDocumentProxy | null>(null)
  const [pageText, setPageText] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [workerInitialized, setWorkerInitialized] = useState(false)

  // Initialize the worker
  useEffect(() => {
    // Set the worker source to a string URL
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`
    setWorkerInitialized(true)
  }, [])

  useEffect(() => {
    if (!file || !workerInitialized) return

    const loadPdf = async () => {
      setLoading(true)
      setError(null)

      try {
        // Check if we have a real file with content
        if (file.file && file.file instanceof File) {
          // For real uploaded files, read the file directly
          const arrayBuffer = await file.file.arrayBuffer()

          // Configure PDF.js with the file data
          const loadingTask = pdfjs.getDocument({
            data: arrayBuffer,
            disableAutoFetch: true,
            disableStream: true,
          })

          const pdf = await loadingTask.promise
          setPdfDocument(pdf)
          setTotalPages(pdf.numPages)
          renderPage(pdf, 1)
        }
        // Check if we have a URL
        else if (file.url && typeof file.url === "string") {
          try {
            // Try to load from URL
            const loadingTask = pdfjs.getDocument({
              url: file.url,
              disableAutoFetch: true,
              disableStream: true,
            })

            const pdf = await loadingTask.promise
            setPdfDocument(pdf)
            setTotalPages(pdf.numPages)
            renderPage(pdf, 1)
          } catch (urlError) {
            console.error("Error loading PDF from URL:", urlError)
            // Fall back to simulated content
            handleSimulatedContent()
          }
        }
        // Fall back to simulated content
        else {
          handleSimulatedContent()
        }
      } catch (error) {
        console.error("Error loading PDF:", error)
        setError("Failed to load PDF. Using text fallback if available.")
        handleSimulatedContent()
      }
    }

    const handleSimulatedContent = () => {
      if (file.content && Array.isArray(file.content) && file.content.length > 0) {
        setPageText(file.content[0] || "")
        setTotalPages(file.content.length)
      } else {
        setPageText("No content available for this document.")
        setTotalPages(1)
      }
      setLoading(false)
    }

    loadPdf()
  }, [file, workerInitialized])

  useEffect(() => {
    // When current page changes, render that page
    if (pdfDocument && currentPage > 0 && currentPage <= totalPages) {
      renderPage(pdfDocument, currentPage)
    } else if (file?.content && currentPage > 0 && currentPage <= file.content.length) {
      // For simulated PDFs
      setPageText(file.content[currentPage - 1] || "")
    }
  }, [currentPage, pdfDocument, totalPages, file])

  const renderPage = async (pdf: pdfjs.PDFDocumentProxy, pageNumber: number) => {
    setLoading(true)
    try {
      // Get the page
      const page = await pdf.getPage(pageNumber)

      // For text extraction
      const textContent = await page.getTextContent()
      const textItems = textContent.items.map((item: any) => item.str).join(" ")
      setPageText(textItems)

      // For rendering the PDF page to canvas
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const context = canvas.getContext("2d")

        if (context) {
          const viewport = page.getViewport({ scale: 1.5 })
          canvas.height = viewport.height
          canvas.width = viewport.width

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          }

          await page.render(renderContext).promise
        }
      }
    } catch (error) {
      console.error("Error rendering page:", error)
      setPageText("Error rendering page")
      setError("Failed to render PDF page. Using text fallback if available.")
    } finally {
      setLoading(false)
    }
  }

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
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
        {pdfDocument ? (
          <canvas ref={canvasRef} className="mx-auto" />
        ) : (
          <div className="flex-1 whitespace-pre-line">{pageText}</div>
        )}
      </div>

      {/* Navigation controls */}
      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevPage} disabled={currentPage === 1 || loading}>
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          <Button variant="outline" size="icon" onClick={nextPage} disabled={currentPage === totalPages || loading}>
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

