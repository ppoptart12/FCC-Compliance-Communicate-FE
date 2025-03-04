"use client"

import type React from "react"

import { useDrop } from "react-dnd"
import type { DragItem } from "@/lib/types"
import { useDocumentStore } from "@/lib/store"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface DroppableFolderProps {
  path: string[]
  children: React.ReactNode
  className?: string
}

export function DroppableFolder({ path, children, className }: DroppableFolderProps) {
  const moveItem = useDocumentStore((state) => state.moveItem)

  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ["FILE", "FOLDER"],
    drop: (dragItem: DragItem) => {
      // Prevent dropping on itself
      if (dragItem.id === path[path.length - 1]) return

      // Prevent dropping a folder into its own descendant
      if (dragItem.type === "FOLDER" && path.join("/").startsWith(dragItem.path.join("/"))) {
        return
      }

      // Create a copy of the item with updated path
      const itemToMove = { ...dragItem.item }

      // Move the item
      moveItem(itemToMove, path)

      // Show success message
      toast.success(`Moved ${dragItem.item.name} to ${path.join("/")}`)

      return { moved: true }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }))

  return (
    <div
      ref={drop}
      className={cn(
        className,
        isOver && canDrop && "bg-primary/10 border-primary border-2",
        isOver && !canDrop && "bg-destructive/10 border-destructive border-2",
        isOver && "transition-all duration-200",
      )}
    >
      {children}
    </div>
  )
}

