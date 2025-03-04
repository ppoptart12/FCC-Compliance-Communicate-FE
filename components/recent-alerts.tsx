import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react"

const alerts = [
  {
    id: 1,
    title: "License Renewal Required",
    description: "WXYZ-FM license renewal due in 30 days",
    type: "critical",
    date: "1h ago",
  },
  {
    id: 2,
    title: "Quarterly Report Submitted",
    description: "Q4 2023 report successfully processed",
    type: "success",
    date: "2h ago",
  },
  {
    id: 3,
    title: "Missing Documentation",
    description: "Annual ownership report needs updating",
    type: "warning",
    date: "5h ago",
  },
  {
    id: 4,
    title: "New Regulation Notice",
    description: "Updated RF exposure requirements effective June 2024",
    type: "warning",
    date: "1d ago",
  },
]

export function RecentAlerts() {
  return (
    <div className="space-y-4">
      {alerts.map((alert) => (
        <div key={alert.id} className="flex items-start gap-4 rounded-lg border p-3">
          {alert.type === "critical" && <AlertCircle className="h-5 w-5 text-destructive" />}
          {alert.type === "warning" && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
          {alert.type === "success" && <CheckCircle2 className="h-5 w-5 text-green-500" />}
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">{alert.title}</p>
            <p className="text-sm text-muted-foreground">{alert.description}</p>
          </div>
          <div className="text-xs text-muted-foreground">{alert.date}</div>
        </div>
      ))}
    </div>
  )
}

