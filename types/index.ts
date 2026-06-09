export type { Article, Summary, Digest, Source } from '@/lib/supabase/types'

export interface ArticleWithSummary {
  id: string
  title: string
  url: string
  content: string | null
  source_name: string | null
  source_url: string | null
  category: string
  published_at: string | null
  created_at: string
  summaries: Array<{
    id: string
    summary_text: string
    key_points: string[]
    sentiment: 'positive' | 'neutral' | 'negative' | null
  }>
}

export interface TrendingTopic {
  topic: string
  count: number
  sentiment: string
}

export interface TrendsData {
  trending_topics: TrendingTopic[]
  keywords: string[]
  analyzed_at: string
  message?: string
  fallbackUsed?: boolean
}
