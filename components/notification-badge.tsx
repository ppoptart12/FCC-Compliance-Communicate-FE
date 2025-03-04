"use client"

import { Bell } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const notifications = [
  {
    id: 1,
    title: "License Renewal Required",
    description: "WXYZ-FM license renewal due in 30 days",
    time: "1h ago",
    unread: true,
  },
  {
    id: 2,
    title: "New Compliance Alert",
    description: "Updated RF exposure requirements",
    time: "2h ago",
    unread: true,
  },
  {
    id: 3,
    title: "Document Uploaded",
    description: "Annual ownership report processed",
    time: "5h ago",
    unread: false,
  },
]

export function NotificationBadge() {
  const unreadCount = notifications.filter((n) => n.unread).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
              {unreadCount}
            </span>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[380px]">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="max-h-[300px] overflow-auto">
          {notifications.map((notification) => (
            <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-4">
              <div className="flex w-full items-start justify-between gap-2">
                <span className="font-medium">{notification.title}</span>
                <span className="text-xs text-muted-foreground">{notification.time}</span>
              </div>
              <span className="text-sm text-muted-foreground">{notification.description}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="w-full text-center font-medium">View all notifications</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

