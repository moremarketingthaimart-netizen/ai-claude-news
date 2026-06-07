import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'
import type { ArticleWithSummary } from '@/types'

interface NewsCardProps {
  article: ArticleWithSummary
}

const sentimentColors = {
  positive: 'text-green-400',
  neutral: 'text-gray-400',
  negative: 'text-red-400',
} as const

export function NewsCard({ article }: NewsCardProps) {
  const summary = article.summaries?.[0]
  const timeAgo = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true, locale: th })
    : null

  return (
    <Card className="hover:bg-accent/50 transition-colors">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/news/${article.id}`} className="hover:underline font-medium leading-snug">
            {article.title}
          </Link>
          <Badge variant="outline" className="shrink-0 text-xs">
            {article.category}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {article.source_name && <span>{article.source_name}</span>}
          {timeAgo && <span>· {timeAgo}</span>}
          {summary?.sentiment && (
            <span className={`ml-auto ${sentimentColors[summary.sentiment] || ''}`}>
              {summary.sentiment}
            </span>
          )}
        </div>
      </CardHeader>

      {summary && (
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground line-clamp-2">{summary.summary_text}</p>
          {summary.key_points && summary.key_points.length > 0 && (
            <ul className="mt-2 space-y-1">
              {(summary.key_points as string[]).slice(0, 2).map((point, i) => (
                <li key={i} className="text-xs text-muted-foreground flex gap-1.5">
                  <span className="shrink-0">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      )}
    </Card>
  )
}
