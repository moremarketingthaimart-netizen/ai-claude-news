import { createAnonClient } from '@/lib/supabase/server'
import { NewsCard } from './news-card'
import type { ArticleWithSummary } from '@/types'

export async function NewsFeed() {
  const supabase = createAnonClient()

  const { data: articles, error } = await supabase
    .from('articles')
    .select('*, summaries(id, summary_text, key_points, sentiment)')
    .order('published_at', { ascending: false })
    .limit(20)

  if (error) {
    return (
      <div className="border border-border/40 rounded p-10 text-center">
        <p className="text-sm text-muted-foreground">ไม่สามารถโหลดข่าวได้ กรุณาลองใหม่</p>
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="border border-border/40 rounded p-12 text-center space-y-2">
        <p className="text-sm text-muted-foreground">ยังไม่มีข่าว</p>
        <p className="text-xs text-muted-foreground/50">
          รอการ fetch ครั้งแรก หรือ POST /api/news
        </p>
      </div>
    )
  }

  return (
    <div>
      {(articles as ArticleWithSummary[]).map((article, idx) => (
        <NewsCard key={article.id} article={article} featured={idx === 0} />
      ))}
    </div>
  )
}
