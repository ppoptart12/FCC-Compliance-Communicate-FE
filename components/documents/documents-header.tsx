"use client"

import { FileUp, Filter, FolderPlus, Grid, List, Search, SlidersHorizontal } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { FileUploadDialog } from "@/components/documents/file-upload-dialog"
import { NewFolderDialog } from "@/components/documents/new-folder-dialog"

export function DocumentsHeader() {
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isNewFolderOpen, setIsNewFolderOpen] = useState(false)
  const [viewType, setViewType] = useState<"grid" | "list">("grid")

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Document Manager</h1>
          <p className="text-muted-foreground">Organize and manage your documents</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setIsNewFolderOpen(true)}>
            <FolderPlus className="mr-2 h-4 w-4" />
            New Folder
          </Button>
          <Button onClick={() => setIsUploadOpen(true)}>
            <FileUp className="mr-2 h-4 w-4" />
            Upload
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search documents..." className="pl-8" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuLabel>Filter By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>PDF Documents</DropdownMenuItem>
              <DropdownMenuItem>Recently Added</DropdownMenuItem>
              <DropdownMenuItem>Recently Modified</DropdownMenuItem>
              <DropdownMenuItem>Favorites</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <SlidersHorizontal className="h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[200px]">
              <DropdownMenuLabel>Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
              <DropdownMenuItem>Date Modified</DropdownMenuItem>
              <DropdownMenuItem>Date Created</DropdownMenuItem>
              <DropdownMenuItem>Size</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-1 border rounded-md">
          <Button
            variant={viewType === "grid" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-none"
            onClick={() => setViewType("grid")}
          >
            <Grid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>
          <Button
            variant={viewType === "list" ? "secondary" : "ghost"}
            size="icon"
            className="rounded-none"
            onClick={() => setViewType("list")}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
        </div>
      </div>

      <FileUploadDialog open={isUploadOpen} onOpenChange={setIsUploadOpen} />
      <NewFolderDialog open={isNewFolderOpen} onOpenChange={setIsNewFolderOpen} />
    </div>
  )
}

