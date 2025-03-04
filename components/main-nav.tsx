"use client"

import { ChevronDown, FileText, Home, LayoutDashboard, Radio, Settings, Shield, Zap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NavigationBar } from "@/components/navigation-bar"
import { NotificationBadge } from "@/components/notification-badge"

export function MainNav() {
  const pathname = usePathname()

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="flex items-center gap-2 font-semibold">
          <Radio className="h-6 w-6" />
          <Link href="/" className="text-lg">
            Communicate
          </Link>
        </div>

        <nav className="flex flex-1 items-center gap-6 px-6">
          <Link
            href="/"
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground",
            )}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="link"
                className={cn(
                  "h-auto gap-1 p-0 hover:text-primary",
                  pathname.startsWith("/documents") ? "text-primary" : "text-muted-foreground",
                )}
              >
                <FileText className="h-4 w-4" />
                Documents
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Document Management</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/documents" className="flex items-center">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  All Documents
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/documents/quick-scan" className="flex items-center">
                  <Zap className="mr-2 h-4 w-4" />
                  Quick Scan
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/documents/compliance" className="flex items-center">
                  <Shield className="mr-2 h-4 w-4" />
                  Compliance Files
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/documents/licenses" className="flex items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  License Records
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="link"
                className={cn(
                  "h-auto gap-1 p-0 hover:text-primary",
                  pathname.startsWith("/compliance") ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Shield className="h-4 w-4" />
                Compliance
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Compliance Center</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Compliance Overview</DropdownMenuItem>
              <DropdownMenuItem>Risk Assessment</DropdownMenuItem>
              <DropdownMenuItem>Audit History</DropdownMenuItem>
              <DropdownMenuItem>Requirements Tracker</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="link"
                className={cn(
                  "h-auto gap-1 p-0 hover:text-primary",
                  pathname.startsWith("/reports") ? "text-primary" : "text-muted-foreground",
                )}
              >
                <FileText className="h-4 w-4" />
                Reports
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuLabel>Report Center</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Compliance Reports</DropdownMenuItem>
              <DropdownMenuItem>License Status</DropdownMenuItem>
              <DropdownMenuItem>Document Analytics</DropdownMenuItem>
              <DropdownMenuItem>Custom Reports</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        <div className="flex items-center gap-4">
          <NotificationBadge />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Settings</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile?tab=preferences">Preferences</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/profile?tab=notifications">Notifications</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <NavigationBar />
    </div>
  )
}

