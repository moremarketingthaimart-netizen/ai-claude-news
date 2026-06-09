import { createAnonClient } from '@/lib/supabase/server'
import { SummaryPanel } from '@/components/summary-panel'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'

export const revalidate = 600

interface Props {
  params: Promise<{ id: string }>
}

const categoryStyle: Record<string, string> = {
  ai: 'bg-sky-950/60 text-sky-400/30',
  tech: 'bg-violet-950/60 text-violet-400/30',
  security: 'bg-red-950/60 text-red-400/30',
  general: 'bg-zinc-900 text-zinc-500/30',
}

export default async function ArticlePage({ params }: Props) {
  const { id } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any

  const { data: article } = await supabase
    .from('articles')
    .select('*, summaries(*)')
    .eq('id', id)
    .single() as {
    data: {
      id: string
      title: string
      url: string
      content: string | null
      source_name: string | null
      category: string
      published_at: string | null
      summaries: Array<{
        summary_text: string
        key_points: string[]
        sentiment: 'positive' | 'neutral' | 'negative' | null
      }>
    } | null
  }

  if (!article) notFound()

  const summary = article.summaries?.[0]
  const catKey = (article.category || 'general').toLowerCase()
  const heroStyle = categoryStyle[catKey] ?? categoryStyle.general

  const timeAgo = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true, locale: th })
    : null

  const initials = (article.source_name || article.category)
    .split(' ')
    .map((w: string) => w[0] ?? '')
    .join('')
    .slice(0, 4)
    .toUpperCase()

  return (
    <div className="max-w-2xl mx-auto">
      {/* Visual hero placeholder */}
      <div className={`w-full h-36 rounded mb-8 flex items-center justify-center ${heroStyle}`}>
        <span className="text-5xl font-black tracking-widest opacity-30">
          {initials}
        </span>
      </div>

      {/* Category eyebrow */}
      <p className="text-xs font-black tracking-widest uppercase text-sky-400 mb-3">
        {article.category}
      </p>

      {/* Headline */}
      <h1 className="text-2xl font-bold tracking-tight leading-snug mb-5">
        {article.title}
      </h1>

      {/* Byline row */}
      <div className="flex items-center gap-3 text-xs text-muted-foreground pb-6 mb-8 border-b border-border/40">
        {article.source_name && (
          <span className="font-semibold text-foreground/70">{article.source_name}</span>
        )}
        {timeAgo && <span>· {timeAgo}</span>}
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto font-medium text-sky-400 hover:text-sky-300 transition-colors"
        >
          อ่านต้นฉบับ →
        </a>
      </div>

      {/* Summary panel */}
      {summary ? (
        <SummaryPanel summary={summary} />
      ) : (
        <div className="border border-border/40 rounded p-6 text-sm text-muted-foreground">
          ยังไม่มีการสรุปบทความนี้
        </div>
      )}
    </div>
  )
}
