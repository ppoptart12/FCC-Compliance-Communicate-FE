"use client"

import type React from "react"

import { useDrag } from "react-dnd"
import type { Item } from "@/lib/types"

interface DraggableItemProps {
  item: Item
  children: React.ReactNode
}

export function DraggableItem({ item, children }: DraggableItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: item.type === "folder" ? "FOLDER" : "FILE",
    item: {
      id: item.id,
      type: item.type === "folder" ? "FOLDER" : "FILE",
      path: item.path,
      item,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }))

  return (
    <div ref={drag} className={`${isDragging ? "opacity-50" : "opacity-100"}`} style={{ cursor: "move" }}>
      {children}
    </div>
  )
}

