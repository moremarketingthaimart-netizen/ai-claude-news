import Anthropic from '@anthropic-ai/sdk'
import { SUMMARIZE_PROMPT, DIGEST_PROMPT, TRENDS_PROMPT } from './prompts'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const MODEL = 'claude-sonnet-4-6'

export interface SummaryResult {
  summary_text: string
  key_points: string[]
  sentiment: 'positive' | 'neutral' | 'negative'
}

export interface DigestResult {
  title: string
  content: string
}

export interface TrendsResult {
  trending_topics: Array<{ topic: string; count: number; sentiment: string }>
  keywords: string[]
  analyzed_at: string
}

export async function summarizeArticle(
  title: string,
  content: string
): Promise<SummaryResult> {
  const truncated = content.length > 5000 ? content.slice(0, 5000) + '...[truncated]' : content

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 500,
    system: SUMMARIZE_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Title: ${title}\n\nContent: ${truncated}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return { summary_text: text, key_points: [], sentiment: 'neutral' }
  }
  return JSON.parse(jsonMatch[0]) as SummaryResult
}

export async function buildDigest(
  articles: Array<{ title: string; url: string; summary?: string }>
): Promise<DigestResult> {
  const articleList = articles
    .map((a, i) => `${i + 1}. ${a.title}\n   URL: ${a.url}${a.summary ? `\n   Summary: ${a.summary}` : ''}`)
    .join('\n\n')

  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 1500,
    system: DIGEST_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Articles for today's digest:\n\n${articleList}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return { title: 'Daily Digest', content: text }
  }
  return JSON.parse(jsonMatch[0]) as DigestResult
}

export async function analyzeTrends(titles: string[]): Promise<TrendsResult> {
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 800,
    system: TRENDS_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Analyze these news titles:\n\n${titles.join('\n')}`,
      },
    ],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const jsonMatch = text.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    return { trending_topics: [], keywords: [], analyzed_at: new Date().toISOString() }
  }
  const result = JSON.parse(jsonMatch[0])
  return { ...result, analyzed_at: new Date().toISOString() }
}
