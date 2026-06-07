import { NextRequest, NextResponse } from 'next/server'
import { createAnonClient } from '@/lib/supabase/server'
import { analyzeTrends } from '@/lib/claude/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const hours = Number(searchParams.get('hours') || '24')
  const clampedHours = Math.min(Math.max(hours, 1), 168)

  const supabase = createAnonClient()
  const since = new Date(Date.now() - clampedHours * 60 * 60 * 1000).toISOString()

  const { data: articles, error } = await supabase
    .from('articles')
    .select('title, category')
    .gte('published_at', since)
    .order('published_at', { ascending: false })
    .limit(100)

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

  const titles = articles.map((a) => a.title)
  const trends = await analyzeTrends(titles)

  return NextResponse.json(trends)
}
