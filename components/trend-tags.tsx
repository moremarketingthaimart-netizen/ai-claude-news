'use client'

import { useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import type { TrendsData } from '@/types'

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
      <div className="space-y-10">
        <div className="space-y-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 border-b border-border/30 py-4">
              <Skeleton className="w-4 h-3 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-0.5 w-3/5" />
              </div>
              <Skeleton className="w-12 h-3 shrink-0" />
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-7 w-16 rounded" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return <p className="text-sm text-muted-foreground">{error}</p>
  }

  if (!trends || trends.trending_topics.length === 0) {
    return (
      <div className="border border-border/40 rounded p-12 text-center">
        <p className="text-sm text-muted-foreground">
          {trends?.message || 'ยังไม่มีข้อมูล trends — รอให้มีข่าวอย่างน้อย 10 บทความ'}
        </p>
      </div>
    )
  }

  const maxCount = trends.trending_topics[0]?.count ?? 1

  return (
    <div className="space-y-12">
      {/* Trending Topics */}
      <div>
        <p className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-6">
          Trending Topics
          {trends.fallbackUsed && (
            <span className="ml-2 text-muted-foreground/40 normal-case tracking-normal font-normal">
              (all-time)
            </span>
          )}
        </p>
        <div>
          {trends.trending_topics.map((topic, i) => {
            const barWidth = Math.round((topic.count / maxCount) * 100)
            const isTop = i === 0
            return (
              <div key={i} className="flex items-center gap-5 border-b border-border/30 py-5 group">
                <span className={`font-mono text-xs shrink-0 w-4 text-right tabular-nums ${isTop ? 'text-sky-400' : 'text-muted-foreground/30'}`}>
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className={`font-semibold tracking-tight capitalize ${isTop ? 'text-base text-foreground' : 'text-sm text-foreground/80'}`}>
                      {topic.topic}
                    </span>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {topic.count} บทความ
                    </span>
                  </div>
                  <div className="h-px bg-border/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${isTop ? 'bg-sky-400' : 'bg-border/60'}`}
                      style={{ width: `${barWidth}%` }}
                    />
                  </div>
                </div>
                <span className={`text-xs shrink-0 font-medium ${
                  topic.sentiment === 'positive' ? 'text-emerald-400' :
                  topic.sentiment === 'negative' ? 'text-red-400' :
                  'text-muted-foreground/40'
                }`}>
                  {topic.sentiment}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Keywords */}
      <div>
        <p className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-4">
          Keywords
        </p>
        <div className="flex flex-wrap gap-2">
          {trends.keywords.map((kw, i) => (
            <span
              key={i}
              className={`px-2.5 py-1 text-xs font-medium rounded border ${
                i < 3
                  ? 'border-sky-500/30 text-sky-400 bg-sky-950/20'
                  : 'border-border/40 text-muted-foreground bg-muted/20'
              }`}
            >
              {kw}
            </span>
          ))}
        </div>
        <p className="text-xs text-muted-foreground/30 mt-5">
          วิเคราะห์เมื่อ {new Date(trends.analyzed_at).toLocaleString('th-TH')}
        </p>
      </div>
    </div>
  )
}
