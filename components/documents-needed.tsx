import { FileUp } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const missingDocuments = [
  {
    id: 1,
    name: "Annual Ownership Report",
    due: "March 15, 2024",
  },
  {
    id: 2,
    name: "RF Exposure Compliance Statement",
    due: "March 30, 2024",
  },
  {
    id: 3,
    name: "EEO Public File Report",
    due: "April 1, 2024",
  },
]

export function DocumentsNeeded() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Required Documents</CardTitle>
        <CardDescription>Documents needed for full compliance</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {missingDocuments.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{doc.name}</p>
                <p className="text-sm text-muted-foreground">Due {doc.due}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/documents">
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

