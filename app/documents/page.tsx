"use client"

import { DocumentsHeader } from "@/components/documents/documents-header"
import { DocumentsView } from "@/components/documents/documents-view"
import { ResizableSidebar } from "@/components/documents/resizable-sidebar"
import { DndProviderWrapper } from "@/components/dnd-provider"

export default function DocumentsPage() {
  return (
    <div className="flex-1 space-y-8 p-8 pt-6">
      <DocumentsHeader />
      <DndProviderWrapper>
        <div className="grid grid-cols-[auto,1fr] gap-6">
          <ResizableSidebar />
          <main>
            <DocumentsView />
          </main>
        </div>
      </DndProviderWrapper>
    </div>
  )
}

