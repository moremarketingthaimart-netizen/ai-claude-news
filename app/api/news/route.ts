import { NextRequest, NextResponse } from 'next/server'
import { createAnonClient, createServerClient } from '@/lib/supabase/server'
import { fetchAllSources } from '@/lib/news/fetcher'
import { NEWS_SOURCES } from '@/lib/news/sources'
import { extractSummary, extractKeyPoints, guessSentiment } from '@/lib/summarize/extractive'
import type { ArticleWithSummary } from '@/types'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const limit = Math.min(Number(searchParams.get('limit') || '20'), 50)
  const category = searchParams.get('category')
  const offset = Number(searchParams.get('offset') || '0')

  const supabase = createAnonClient()
  let query = supabase
    .from('articles')
    .select('*, summaries(id, summary_text, key_points, sentiment)')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ articles: data as unknown as ArticleWithSummary[], count: data?.length || 0 })
}

export async function POST() {
  const supabase = createServerClient()
  const { articles, errors } = await fetchAllSources(NEWS_SOURCES)

  if (articles.length === 0) {
    return NextResponse.json({ message: 'No articles fetched', errors }, { status: 200 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: saved, error } = await (supabase as any)
    .from('articles')
    .upsert(articles, { onConflict: 'url', ignoreDuplicates: true })
    .select('id, title, content')

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Auto-generate extractive summaries for newly saved articles
  const newArticles = (saved as Array<{ id: string; title: string; content: string | null }>) || []
  if (newArticles.length > 0) {
    const summaries = newArticles.map((a) => ({
      article_id: a.id,
      summary_text: extractSummary(a.content, a.title),
      key_points: extractKeyPoints(a.content, a.title),
      sentiment: guessSentiment(a.title, a.content),
      model_used: 'extractive',
    }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any)
      .from('summaries')
      .upsert(summaries, { onConflict: 'article_id', ignoreDuplicates: true })
  }

  return NextResponse.json({
    message: `Fetched ${articles.length} articles, summarized ${newArticles.length}`,
    count: articles.length,
    errors,
  })
}
