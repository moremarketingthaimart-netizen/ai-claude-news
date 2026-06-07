import { NextRequest, NextResponse } from 'next/server'
import { createAnonClient, createServerClient } from '@/lib/supabase/server'
import { fetchAllSources } from '@/lib/news/fetcher'
import { NEWS_SOURCES } from '@/lib/news/sources'

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

  return NextResponse.json({ articles: data, count: data?.length || 0 })
}

export async function POST() {
  const supabase = createServerClient()
  const { articles, errors } = await fetchAllSources(NEWS_SOURCES)

  if (articles.length === 0) {
    return NextResponse.json({ message: 'No articles fetched', errors }, { status: 200 })
  }

  const { error } = await supabase
    .from('articles')
    .upsert(articles, { onConflict: 'url', ignoreDuplicates: true })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({
    message: `Fetched and saved ${articles.length} articles`,
    count: articles.length,
    errors,
  })
}
