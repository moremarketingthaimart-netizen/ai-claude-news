import Parser from 'rss-parser'
import type { ArticleInsert } from '@/lib/supabase/types'
import type { NewsSource } from './sources'

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'ai-claude-news/1.0' },
})

const HN_API = 'https://hacker-news.firebaseio.com/v0'

export async function fetchRSSFeed(source: NewsSource, limit = 20): Promise<ArticleInsert[]> {
  if (!source.feedUrl) return []

  try {
    const feed = await parser.parseURL(source.feedUrl)
    return (feed.items || [])
      .slice(0, limit)
      .filter((item) => item.link && item.title)
      .map((item) => ({
        title: item.title!.trim(),
        url: item.link!,
        content: item.contentSnippet || item.summary || null,
        source_name: source.name,
        source_url: source.siteUrl,
        category: source.category,
        published_at: item.pubDate ? new Date(item.pubDate).toISOString() : null,
      }))
  } catch {
    console.error(`[fetcher] RSS error for ${source.name}`)
    return []
  }
}

export async function fetchHackerNews(
  type: 'top' | 'best' | 'new' = 'top',
  limit = 30
): Promise<ArticleInsert[]> {
  try {
    const idsRes = await fetch(`${HN_API}/${type}stories.json`)
    const ids: number[] = await idsRes.json()
    const top = ids.slice(0, limit)

    const items = await Promise.allSettled(
      top.map((id) => fetch(`${HN_API}/item/${id}.json`).then((r) => r.json()))
    )

    return items
      .filter((r): r is PromiseFulfilledResult<{ url?: string; title?: string; time?: number }> =>
        r.status === 'fulfilled' && !!r.value?.url && !!r.value?.title
      )
      .map(({ value }) => ({
        title: value.title!,
        url: value.url!,
        content: null,
        source_name: 'Hacker News',
        source_url: 'https://news.ycombinator.com',
        category: 'tech',
        published_at: value.time ? new Date(value.time * 1000).toISOString() : null,
      }))
  } catch {
    console.error('[fetcher] HackerNews API error')
    return []
  }
}

export async function fetchAllSources(sources: NewsSource[]): Promise<{
  articles: ArticleInsert[]
  errors: string[]
}> {
  const results: ArticleInsert[] = []
  const errors: string[] = []

  for (const source of sources) {
    if (!source) continue
    if (source.type === 'hackernews') {
      const articles = await fetchHackerNews('top', 30)
      results.push(...articles)
    } else if (source.type === 'rss') {
      const articles = await fetchRSSFeed(source, 20)
      results.push(...articles)
    }
  }

  return { articles: results, errors }
}
