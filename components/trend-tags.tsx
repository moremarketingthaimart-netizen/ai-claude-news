'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { TrendsData } from '@/types'

const sentimentColor = {
  positive: 'border-green-700 text-green-400',
  neutral: 'border-gray-700 text-gray-400',
  negative: 'border-red-700 text-red-400',
} as const

export function TrendTags() {
  const [trends, setTrends] = useState<TrendsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/trends')
      .then((r) => r.json())
      .then(setTrends)
      .catch(() => setError('ไม่สามารถโหลด trends ได้'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-muted-foreground">{error}</p>
  }

  if (!trends || trends.trending_topics.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {trends?.message || 'ยังไม่มีข้อมูล trends — รอให้มีข่าวอย่างน้อย 10 บทความ'}
      </p>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Trending Topics (24h)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {trends.trending_topics.map((topic, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-sm font-mono text-muted-foreground w-5">{i + 1}</span>
                <span className="flex-1 font-medium">{topic.topic}</span>
                <Badge
                  variant="outline"
                  className={sentimentColor[topic.sentiment as keyof typeof sentimentColor] || ''}
                >
                  {topic.sentiment}
                </Badge>
                <span className="text-sm text-muted-foreground">{topic.count} บทความ</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Keywords</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {trends.keywords.map((kw, i) => (
              <Badge key={i} variant="secondary">{kw}</Badge>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            วิเคราะห์เมื่อ {new Date(trends.analyzed_at).toLocaleString('th-TH')}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
