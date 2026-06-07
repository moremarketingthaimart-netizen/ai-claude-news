import { createAnonClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { SummaryPanel } from '@/components/summary-panel'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'

export const revalidate = 600

interface Props {
  params: Promise<{ id: string }>
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

  const timeAgo = article.published_at
    ? formatDistanceToNow(new Date(article.published_at), { addSuffix: true, locale: th })
    : null

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        <Badge variant="secondary">{article.category}</Badge>
        {article.source_name && <span>{article.source_name}</span>}
        {timeAgo && <span>· {timeAgo}</span>}
      </div>

      <h1 className="text-2xl font-bold mb-4 leading-tight">{article.title}</h1>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1 text-sm text-blue-400 hover:underline mb-8"
      >
        อ่านบทความต้นฉบับ →
      </a>

      {summary ? (
        <SummaryPanel summary={summary} />
      ) : (
        <div className="border rounded-lg p-4 text-sm text-muted-foreground">
          ยังไม่มีการสรุปบทความนี้
        </div>
      )}
    </div>
  )
}
