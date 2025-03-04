import { AlertCircle, ShieldCheck } from "lucide-react"
import Link from "next/link"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ComplianceChart } from "@/components/compliance-chart"
import { DocumentsNeeded } from "@/components/documents-needed"
import { RecentAlerts } from "@/components/recent-alerts"

export default function Page() {
  return (
    <div className="flex-1 space-y-6 p-6">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-3">
              <div className="text-2xl font-bold">78%</div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Licenses</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12/15</div>
            <p className="text-xs text-muted-foreground">3 licenses expiring soon</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Required Documents</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89%</div>
            <p className="text-xs text-muted-foreground">42 of 47 documents filed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14d</div>
            <p className="text-xs text-muted-foreground">March 12, 2024</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Compliance Trend</CardTitle>
            <CardDescription>Your compliance score over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ComplianceChart />
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>Latest compliance notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentAlerts />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Critical Action Required</AlertTitle>
          <AlertDescription>
            Station WXYZ-FM license renewal application due in 30 days.{" "}
            <Link href="/documents" className="underline">
              Submit now
            </Link>
          </AlertDescription>
        </Alert>

        <DocumentsNeeded />
      </div>
    </div>
  )
}

