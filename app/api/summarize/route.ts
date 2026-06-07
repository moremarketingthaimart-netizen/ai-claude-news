import { NextRequest, NextResponse } from 'next/server'
import { createServerClient, createAnonClient } from '@/lib/supabase/server'
import { summarizeArticle } from '@/lib/claude/client'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { article_id } = body

  if (!article_id) {
    return NextResponse.json({ error: 'article_id is required' }, { status: 400 })
  }

  const anonClient = createAnonClient()
  const { data: article, error: fetchError } = await anonClient
    .from('articles')
    .select('id, title, content, url')
    .eq('id', article_id)
    .single()

  if (fetchError || !article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }

  const { data: existing } = await anonClient
    .from('summaries')
    .select('id')
    .eq('article_id', article_id)
    .single()

  if (existing) {
    return NextResponse.json({ message: 'Summary already exists', article_id })
  }

  const result = await summarizeArticle(
    article.title,
    article.content || article.title
  )

  const serverClient = createServerClient()
  const { data: summary, error: insertError } = await serverClient
    .from('summaries')
    .insert({
      article_id,
      summary_text: result.summary_text,
      key_points: result.key_points,
      sentiment: result.sentiment,
      model_used: 'claude-sonnet-4-6',
    })
    .select()
    .single()

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 })
  }

  return NextResponse.json({ summary })
}
