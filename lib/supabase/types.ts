export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      articles: {
        Row: {
          id: string
          title: string
          url: string
          content: string | null
          source_name: string | null
          source_url: string | null
          category: string
          published_at: string | null
          fetched_at: string
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          url: string
          content?: string | null
          source_name?: string | null
          source_url?: string | null
          category?: string
          published_at?: string | null
          fetched_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          url?: string
          content?: string | null
          source_name?: string | null
          source_url?: string | null
          category?: string
          published_at?: string | null
          fetched_at?: string
          created_at?: string
        }
      }
      summaries: {
        Row: {
          id: string
          article_id: string
          summary_text: string
          key_points: Json
          sentiment: 'positive' | 'neutral' | 'negative' | null
          model_used: string
          created_at: string
        }
        Insert: {
          id?: string
          article_id: string
          summary_text: string
          key_points?: Json
          sentiment?: 'positive' | 'neutral' | 'negative' | null
          model_used?: string
          created_at?: string
        }
        Update: {
          id?: string
          article_id?: string
          summary_text?: string
          key_points?: Json
          sentiment?: 'positive' | 'neutral' | 'negative' | null
          model_used?: string
          created_at?: string
        }
      }
      digests: {
        Row: {
          id: string
          digest_date: string
          title: string
          content: string
          article_ids: Json
          articles_count: number
          created_at: string
        }
        Insert: {
          id?: string
          digest_date: string
          title: string
          content: string
          article_ids?: Json
          articles_count?: number
          created_at?: string
        }
        Update: {
          id?: string
          digest_date?: string
          title?: string
          content?: string
          article_ids?: Json
          articles_count?: number
          created_at?: string
        }
      }
      sources: {
        Row: {
          id: string
          name: string
          feed_url: string | null
          site_url: string | null
          category: string
          active: boolean
          last_fetched_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          feed_url?: string | null
          site_url?: string | null
          category?: string
          active?: boolean
          last_fetched_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          feed_url?: string | null
          site_url?: string | null
          category?: string
          active?: boolean
          last_fetched_at?: string | null
          created_at?: string
        }
      }
    }
  }
}

export type Article = Database['public']['Tables']['articles']['Row']
export type ArticleInsert = Database['public']['Tables']['articles']['Insert']
export type Summary = Database['public']['Tables']['summaries']['Row']
export type SummaryInsert = Database['public']['Tables']['summaries']['Insert']
export type Digest = Database['public']['Tables']['digests']['Row']
export type DigestInsert = Database['public']['Tables']['digests']['Insert']
export type Source = Database['public']['Tables']['sources']['Row']
