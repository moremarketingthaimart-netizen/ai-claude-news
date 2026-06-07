import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAnonClient } from '@/lib/supabase/server'
import { buildDigest } from '@/lib/claude/client'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0]

  const supabase = createAnonClient()
  const { data, error } = await supabase
    .from('digests')
    .select('*')
    .eq('digest_date', date)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json({ digest: null, date })
  }

  return NextResponse.json({ digest: data })
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const date = body.date || new Date().toISOString().split('T')[0]
  const force = body.force === true

  const supabase = createServerClient()
  const anonClient = createAnonClient()

  if (!force) {
    const { data: existing } = await anonClient
      .from('digests')
      .select('id')
      .eq('digest_date', date)
      .single()

    if (existing) {
      return NextResponse.json({ message: 'Digest already exists for this date', date })
    }
  }

  const startOfDay = `${date}T00:00:00.000Z`
  const endOfDay = `${date}T23:59:59.999Z`

  const { data: articles } = await anonClient
    .from('articles')
    .select('id, title, url, summaries(summary_text)')
    .gte('published_at', startOfDay)
    .lte('published_at', endOfDay)
    .order('published_at', { ascending: false })
    .limit(20)

  if (!articles || articles.length < 3) {
    return NextResponse.json(
      { error: 'Not enough articles to build a digest (minimum 3)' },
      { status: 422 }
    )
  }

  const articleList = articles.map((a) => ({
    title: a.title,
    url: a.url,
    summary: (a.summaries as Array<{ summary_text: string }>)?.[0]?.summary_text,
  }))

  const result = await buildDigest(articleList)

  const { data: digest, error: upsertError } = await supabase
    .from('digests')
    .upsert(
      {
        digest_date: date,
        title: result.title,
        content: result.content,
        article_ids: articles.map((a) => a.id),
        articles_count: articles.length,
      },
      { onConflict: 'digest_date' }
    )
    .select()
    .single()

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  return NextResponse.json({ digest })
}
