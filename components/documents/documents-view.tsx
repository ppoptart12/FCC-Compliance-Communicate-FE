"use client"

import { ChevronRight, File, Folder, MoreVertical } from "lucide-react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useDocumentStore } from "@/lib/store"
import type { FileItem, Item } from "@/lib/types"
import { DraggableItem } from "@/components/documents/draggable-item"
import { DroppableFolder } from "@/components/documents/droppable-folder"
import { PdfViewer } from "@/components/documents/pdf-viewer"

export function DocumentsView() {
  const { currentPath, setCurrentPath, getCurrentItems, selectFile } = useDocumentStore()
  const [refreshKey, setRefreshKey] = useState(0)
  const items = getCurrentItems()

  useEffect(() => {
    setRefreshKey((prev) => prev + 1)
  }, [items]) // Refresh when items change

  const handlePathClick = (index: number) => {
    setCurrentPath(currentPath.slice(0, index + 1))
  }

  const handleItemClick = (item: Item) => {
    if (item.type === "folder") {
      setCurrentPath([...currentPath, item.name])
    } else if (item.type === "file") {
      // Open the PDF viewer
      selectFile(item as FileItem)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        {currentPath.map((item, index) => (
          <div key={item} className="flex items-center">
            <Button
              variant="link"
              className="h-auto p-0 text-muted-foreground hover:text-primary"
              onClick={() => handlePathClick(index)}
            >
              {item}
            </Button>
            {index < currentPath.length - 1 && <ChevronRight className="mx-1 h-4 w-4" />}
          </div>
        ))}
      </div>

      <DroppableFolder path={currentPath} className="rounded-lg border bg-card" key={refreshKey}>
        <div className="grid grid-cols-[1fr,100px,80px] gap-6 p-4 text-sm font-medium text-muted-foreground">
          <div>Name</div>
          <div>Modified</div>
          <div>Size</div>
        </div>
        <div className="divide-y">
          {items.map((item) => (
            <DraggableItem key={item.id} item={item}>
              <div className="grid grid-cols-[1fr,100px,80px] gap-6 p-4 hover:bg-muted/50">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleItemClick(item)}>
                  {item.type === "folder" ? (
                    <Folder className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <File className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="font-medium">{item.name}</span>
                </div>
                <div className="text-sm text-muted-foreground">{new Date(item.modified).toLocaleDateString()}</div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{item.type === "file" ? item.size : "—"}</span>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {item.type === "folder" ? (
                        <DropdownMenuItem onClick={() => handleItemClick(item)}>Open</DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem onClick={() => handleItemClick(item)}>View</DropdownMenuItem>
                      )}
                      <DropdownMenuItem>Move</DropdownMenuItem>
                      <DropdownMenuItem>Rename</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </DraggableItem>
          ))}
        </div>
      </DroppableFolder>

      <PdfViewer />
    </div>
  )
}

