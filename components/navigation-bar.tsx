"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const routes = [
  {
    label: "Overview",
    href: "/",
  },
  {
    label: "Documents",
    href: "/documents",
  },
  {
    label: "Compliance",
    href: "/compliance",
  },
  {
    label: "Reports",
    href: "/reports",
  },
]

export function NavigationBar() {
  const pathname = usePathname()
  const segments = pathname.split("/").filter(Boolean)
  const currentRoute = routes.find((route) => route.href === pathname) || routes[0]

  return (
    <div className="border-b bg-muted/40">
      <div className="container flex h-12 items-center gap-4">
        <div className="flex flex-1 items-center gap-1 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          {segments.length > 0 && (
            <>
              <ChevronRight className="h-4 w-4" />
              <span className="font-medium text-foreground">{currentRoute.label}</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

