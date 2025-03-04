"use client"

import { useCallback, useState } from "react"
import { FileText, Upload } from "lucide-react"
import { useDropzone } from "react-dropzone"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"

interface FileWithPreview extends File {
  preview: string
}

export function FileUploadZone() {
  const [files, setFiles] = useState<FileWithPreview[]>([])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles((prevFiles) => [
      ...prevFiles,
      ...acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    ])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
  })

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={`flex min-h-[300px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
              isDragActive ? "border-primary bg-muted/50" : "border-muted-foreground/25"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mb-4 h-8 w-8 text-muted-foreground" />
            <h3 className="mb-1 text-lg font-medium">Drop your files here</h3>
            <p className="mb-4 text-sm text-muted-foreground">or click to browse</p>
            <Button variant="secondary" size="sm">
              Browse Files
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <div className="border-b p-4">
            <h3 className="text-lg font-medium">Uploaded Files</h3>
          </div>
          <ScrollArea className="h-[300px]">
            {files.length === 0 ? (
              <div className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                No files uploaded yet
              </div>
            ) : (
              <div className="space-y-4 p-4">
                {files.map((file) => (
                  <div key={file.name} className="flex items-center gap-4">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">{file.name}</p>
                      <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}

