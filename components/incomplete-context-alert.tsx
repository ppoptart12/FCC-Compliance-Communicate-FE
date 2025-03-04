"use client"

import { AlertCircle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

export function IncompleteContextAlert() {
  return (
    <div className="fixed top-0 z-[100] w-full flex h-12 items-center justify-between gap-4 border-b bg-destructive px-4 text-destructive-foreground">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <span className="text-sm font-medium">
          Complete your compliance context setup to enable full AI capabilities
        </span>
      </div>
      <Button asChild variant="secondary" size="sm" className="hover:bg-secondary/90">
        <Link href="/profile?tab=context">Complete Setup</Link>
      </Button>
    </div>
  )
}

