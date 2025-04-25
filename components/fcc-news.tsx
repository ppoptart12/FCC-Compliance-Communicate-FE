"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { fccNews } from "@/data/fcc-news"
import { format } from "date-fns"
import { ChevronRight } from "lucide-react"

export function FCCNews() {
  const [selectedNews, setSelectedNews] = useState<typeof fccNews[0] | null>(null)

  return (
    <>
      <Card className="bg-gradient-to-br from-white to-gray-50">
        <CardHeader className="border-b">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Latest FCC News
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {fccNews.map((news) => (
              <div 
                key={news.id} 
                className="group relative rounded-lg p-4 transition-all hover:bg-blue-50/50 cursor-pointer"
                onClick={() => setSelectedNews(news)}
              >
                <div className="absolute -left-2 top-4 h-2 w-2 rounded-full bg-blue-500 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="space-y-2">
                  <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-700 transition-colors">
                    {news.headline}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {news.summary}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-blue-600">
                        {format(new Date(news.date), "MMM d, yyyy")}
                      </span>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-500">FCC Update</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span>Read more</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedNews} onOpenChange={() => setSelectedNews(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              {selectedNews?.headline}
            </DialogTitle>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {selectedNews && (
                <>
                  <span>{format(new Date(selectedNews.date), "MMMM d, yyyy")}</span>
                  <span>•</span>
                  <span>FCC Update</span>
                </>
              )}
            </div>
          </DialogHeader>
          <div className="mt-4 prose prose-blue max-w-none">
            {selectedNews?.fullText.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
} 