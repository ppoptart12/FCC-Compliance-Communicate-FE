import { Bell, FileText, Home, Settings } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export function Sidebar() {
  return (
    <div className="hidden border-r bg-muted/40 lg:block">
      <div className="flex h-[calc(100vh-3.5rem)] flex-col gap-2">
        <ScrollArea className="flex-1 p-4">
          <div className="flex flex-col gap-2">
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="/">
                <Home className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="/documents">
                <FileText className="h-4 w-4" />
                Documents
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="/alerts">
                <Bell className="h-4 w-4" />
                Alerts
              </Link>
            </Button>
          </div>
          <Separator className="my-4" />
          <div className="flex flex-col gap-2">
            <Button variant="ghost" className="w-full justify-start gap-2" asChild>
              <Link href="/settings">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </Button>
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}

