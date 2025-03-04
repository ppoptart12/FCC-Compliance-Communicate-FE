import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"

import { MainNav } from "@/components/main-nav"
import { cn } from "@/lib/utils"
// Temporarily removing the IncompleteContextAlert import
// import { IncompleteContextAlert } from "@/components/incomplete-context-alert"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className)}>
        <div className="relative flex min-h-screen flex-col">
          {/* Temporarily removing the IncompleteContextAlert component */}
          {/* <IncompleteContextAlert /> */}
          <MainNav />
          <div className="pt-[56px]">{children}</div>
          <Toaster position="top-right" />
        </div>
      </body>
    </html>
  )
}

import './globals.css'

export const metadata = {
      generator: 'v0.dev'
    };
