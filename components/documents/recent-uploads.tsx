import { Clock, FileText } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

const recentUploads = [
  {
    id: 1,
    name: "Annual EEO Report 2024.pdf",
    uploadedAt: "2 minutes ago",
    status: "pending",
  },
  {
    id: 2,
    name: "Q1 Public File Certification.pdf",
    uploadedAt: "1 hour ago",
    status: "approved",
  },
  {
    id: 3,
    name: "Technical Specifications Update.pdf",
    uploadedAt: "3 hours ago",
    status: "pending",
  },
  {
    id: 4,
    name: "License Renewal Application.pdf",
    uploadedAt: "5 hours ago",
    status: "needs_attention",
  },
]

export function RecentUploads() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle>Recent Uploads</CardTitle>
          <CardDescription>Recently uploaded documents that need your attention</CardDescription>
        </div>
        <Button variant="secondary" size="sm" className="gap-2">
          <Clock className="h-4 w-4" />
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex w-max space-x-4 p-1">
            {recentUploads.map((doc) => (
              <Link
                key={doc.id}
                href={`/documents/${doc.id}`}
                className="relative overflow-hidden rounded-lg border bg-muted/40 p-3 hover:bg-muted/60 transition-colors"
              >
                <div className="flex flex-col items-center gap-2 px-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <div className="space-y-1 text-center">
                    <p className="w-[150px] truncate text-sm font-medium">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.uploadedAt}</p>
                  </div>
                  <div
                    className={`absolute right-2 top-2 h-2 w-2 rounded-full ${
                      doc.status === "approved"
                        ? "bg-green-500"
                        : doc.status === "needs_attention"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                    }`}
                  />
                </div>
              </Link>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </CardContent>
    </Card>
  )
}

