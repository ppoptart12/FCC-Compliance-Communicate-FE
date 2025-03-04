"use client"

import { useCallback, useEffect, useState } from "react"
import { FolderTree } from "@/components/documents/folder-tree"

interface ResizableSidebarProps {
  minWidth?: number
  maxWidth?: number
  defaultWidth?: number
}

export function ResizableSidebar({ minWidth = 200, maxWidth = 600, defaultWidth = 250 }: ResizableSidebarProps) {
  const [width, setWidth] = useState(defaultWidth)
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    // Load saved width from localStorage
    const savedWidth = localStorage.getItem("sidebarWidth")
    if (savedWidth) {
      setWidth(Number(savedWidth))
    }
  }, [])

  useEffect(() => {
    // Save width to localStorage when it changes
    localStorage.setItem("sidebarWidth", width.toString())
  }, [width])

  const handleMouseDown = useCallback(() => {
    setIsResizing(true)
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return

      let newWidth = e.clientX
      // Constrain width between min and max values
      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))
      setWidth(newWidth)
    }

    const handleMouseUp = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isResizing, minWidth, maxWidth])

  return (
    <aside className="relative flex border-r bg-background" style={{ width: `${width}px` }}>
      <div className="flex-1 overflow-hidden">
        <FolderTree />
      </div>
      <div
        className={`group absolute -right-1 top-0 h-full w-2 cursor-col-resize transition-colors ${
          isResizing ? "bg-primary/20" : "hover:bg-primary/10"
        }`}
        onMouseDown={handleMouseDown}
      >
        <div
          className={`absolute right-1 top-1/2 h-16 w-[2px] -translate-y-1/2 rounded-full transition-colors ${
            isResizing ? "bg-primary" : "bg-border group-hover:bg-primary/50"
          }`}
        />
      </div>
    </aside>
  )
}

