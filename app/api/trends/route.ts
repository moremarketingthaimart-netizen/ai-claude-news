import { NextRequest, NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase/server'
import { countTrends } from '@/lib/summarize/extractive'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const hours = Number(searchParams.get('hours') || '24')
  const clampedHours = Math.min(Math.max(hours, 1), 168)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = createAnonClient() as any
  const since = new Date(Date.now() - clampedHours * 60 * 60 * 1000).toISOString()

  const { data: articles, error } = await supabase
    .from('articles')
    .select('title, category')
    .gte('published_at', since)
    .order('published_at', { ascending: false })
    .limit(100) as { data: Array<{ title: string; category: string }> | null; error: Error | null }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!articles || articles.length < 10) {
    return NextResponse.json({
      trending_topics: [],
      keywords: [],
      analyzed_at: new Date().toISOString(),
      message: 'Not enough articles for trend analysis',
    })
  }

  const trends = countTrends(articles)

  return NextResponse.json({ ...trends, analyzed_at: new Date().toISOString() })
}
