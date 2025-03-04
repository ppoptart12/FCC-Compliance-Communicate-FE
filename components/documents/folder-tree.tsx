"use client"

import type React from "react"

import { ChevronRight, FileText, Folder, FolderOpen } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useDocumentStore } from "@/lib/store"
import type { FolderItem, Item } from "@/lib/types"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { DraggableItem } from "@/components/documents/draggable-item"
import { DroppableFolder } from "@/components/documents/droppable-folder"

interface ExpandedState {
  [key: string]: boolean
}

export function FolderTree() {
  const { items, currentPath, setCurrentPath } = useDocumentStore()
  const [expandedFolders, setExpandedFolders] = useState<ExpandedState>({})

  const isWorkspacePath = (path: string[]) => {
    return path.length === currentPath.length && path.every((segment, index) => currentPath[index] === segment)
  }

  const toggleFolder = (folderId: string, event: React.MouseEvent) => {
    event.stopPropagation()
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }))
  }

  const navigateWorkspace = (path: string[]) => {
    setCurrentPath(path)
  }

  const getFolderContents = (folder: FolderItem): Item[] => {
    if (!folder.children) return []
    return folder.children
  }

  const renderFolder = (folder: FolderItem, level = 0) => {
    const folderPath = [...folder.path, folder.name]
    const isSelected = isWorkspacePath(folderPath)
    const isExpanded = expandedFolders[folder.id]
    const contents = getFolderContents(folder)
    const hasContents = contents.length > 0

    return (
      <DroppableFolder key={folder.id} path={folderPath}>
        <div>
          <DraggableItem item={folder}>
            <div className="group relative flex items-center">
              <div className="absolute left-0 flex h-full items-center" style={{ paddingLeft: `${level * 12}px` }}>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => toggleFolder(folder.id, e)}>
                  <ChevronRight
                    className={cn(
                      "h-4 w-4 transition-transform duration-200",
                      isExpanded && "rotate-90",
                      !hasContents && "text-muted-foreground",
                    )}
                  />
                </Button>
              </div>
              <Button
                variant="ghost"
                className={cn("w-full justify-start pl-8", isSelected ? "bg-muted" : "")}
                onClick={() => navigateWorkspace(folderPath)}
              >
                <div className="flex items-center" style={{ paddingLeft: `${level * 12}px` }}>
                  {isExpanded ? (
                    <FolderOpen className="mr-2 h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Folder className="mr-2 h-4 w-4 text-muted-foreground" />
                  )}
                  {folder.name}
                </div>
              </Button>
            </div>
          </DraggableItem>

          <Collapsible open={isExpanded}>
            <CollapsibleContent>
              {contents.map((item) => {
                if (item.type === "folder") {
                  return renderFolder(item as FolderItem, level + 1)
                }
                return (
                  <DraggableItem key={item.id} item={item}>
                    <div
                      style={{ paddingLeft: `${(level + 2) * 12}px` }}
                      className="group flex items-center gap-2 rounded-sm py-1.5 pl-6 pr-2 hover:bg-muted"
                    >
                      <FileText className="h-4 w-4 text-muted-foreground" />
                      <span className="truncate text-sm">{item.name}</span>
                    </div>
                  </DraggableItem>
                )
              })}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </DroppableFolder>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <div className="pr-4">
        {items.filter((item): item is FolderItem => item.type === "folder").map((folder) => renderFolder(folder))}
      </div>
    </ScrollArea>
  )
}

