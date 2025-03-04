"use client"

import type React from "react"

import { useState } from "react"
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useDocumentStore } from "@/lib/store"

interface NewFolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewFolderDialog({ open, onOpenChange }: NewFolderDialogProps) {
  const [folderName, setFolderName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { currentPath, addFolder } = useDocumentStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Validate folder name
      if (!folderName.trim()) {
        throw new Error("Folder name cannot be empty")
      }

      // Add the folder
      addFolder(folderName.trim(), currentPath)

      // Show success message
      toast.success("Folder created successfully")

      // Close dialog and reset state
      onOpenChange(false)
      setFolderName("")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create folder")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Folder</DialogTitle>
          <DialogDescription>Create a new folder in {currentPath.join(" / ")}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Folder Name</Label>
              <Input
                id="name"
                placeholder="Enter folder name"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!folderName.trim() || isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

