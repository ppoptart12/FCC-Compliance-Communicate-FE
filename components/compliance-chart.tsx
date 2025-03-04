"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { date: "Feb 1", score: 65 },
  { date: "Feb 5", score: 68 },
  { date: "Feb 10", score: 72 },
  { date: "Feb 15", score: 75 },
  { date: "Feb 20", score: 71 },
  { date: "Feb 25", score: 74 },
  { date: "Mar 1", score: 78 },
]

export function ComplianceChart() {
  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis dataKey="date" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip />
          <Line type="monotone" dataKey="score" stroke="#000" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

