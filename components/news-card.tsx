import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'
import type { ArticleWithSummary } from '@/types'

interface NewsCardProps {
  article: ArticleWithSummary
  featured?: boolean
}

const categoryStyle: Record<string, string> = {
  ai: 'bg-sky-950 text-sky-400',
  tech: 'bg-violet-950 text-violet-400',
  security: 'bg-red-950 text-red-400',
  general: 'bg-zinc-800 text-zinc-500',
}

const sentimentDot: Record<string, string> = {
  positive: 'bg-emerald-400',
  neutral: 'bg-zinc-500',
  negative: 'bg-red-400',
}

function getThumbStyle(category: string): string {
  return categoryStyle[category.toLowerCase()] ?? categoryStyle.general
}

function getInitials(source: string | null, category: string): string {
  const text = source || category
  const initials = text.split(' ').map((w) => w[0] ?? '').join('').slice(0, 3).toUpperCase()
  return initials.length > 1 ? initials : text.slice(0, 2).toUpperCase()
}

const thumbOpacities = ['opacity-35', 'opacity-40', 'opacity-45', 'opacity-40'] as const
function getThumbOpacity(title: string): string {
  return thumbOpacities[(title.charCodeAt(0) || 0) % thumbOpacities.length]
}

export function NewsCard({ article, featured = false }: NewsCardProps) {
  const summary = article.summaries?.[0]
  const timeAgo = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true, locale: th })
    : null
  const thumbStyle = getThumbStyle(article.category)
  const initials = getInitials(article.source_name, article.category)
  const thumbOpacity = getThumbOpacity(article.title)
  const sentiment = summary?.sentiment

  if (featured) {
    return (
      <div className="flex gap-6 border-b border-border/40 pb-8 mb-8">
        {/* Thumbnail placeholder */}
        <div className={`shrink-0 w-48 h-32 rounded flex items-center justify-center text-sm font-black tracking-widest ${thumbOpacity} ${thumbStyle}`}>
          {initials}
        </div>

        <div className="flex-1 min-w-0 py-1">
          <p className="text-xs font-black tracking-widest uppercase text-sky-400 mb-2">
            {article.category}
          </p>
          <Link href={`/news/${article.id}`} className="group block mb-3">
            <h2 className="text-xl font-bold tracking-tight leading-snug group-hover:text-sky-400 transition-colors">
              {article.title}
            </h2>
          </Link>
          {summary && (
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-3">
              {summary.summary_text}
            </p>
          )}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {article.source_name && (
              <span className="font-semibold text-foreground/70">{article.source_name}</span>
            )}
            {timeAgo && <span>· {timeAgo}</span>}
            {sentiment && (
              <span className="flex items-center gap-1.5 ml-auto">
                <span className={`w-1.5 h-1.5 rounded-full ${sentimentDot[sentiment] ?? sentimentDot.neutral}`} />
                <span className="capitalize">{sentiment}</span>
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-start gap-4 border-b border-border/30 py-4 last:border-0">
      {/* Thumbnail placeholder — small */}
      <div className={`shrink-0 w-14 h-14 rounded flex items-center justify-center text-xs font-black tracking-wider ${thumbOpacity} ${thumbStyle}`}>
        {initials}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground/60 mb-1">
          {article.category}
        </p>
        <Link href={`/news/${article.id}`} className="group block mb-1">
          <h3 className="text-sm font-semibold tracking-tight leading-snug group-hover:text-sky-400 transition-colors">
            {article.title}
          </h3>
        </Link>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {article.source_name && <span>{article.source_name}</span>}
          {timeAgo && <span>· {timeAgo}</span>}
          {sentiment && (
            <span className="ml-auto">
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${sentimentDot[sentiment] ?? sentimentDot.neutral}`} />
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
