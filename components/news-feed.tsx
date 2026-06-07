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
      <div className="text-center py-12 text-muted-foreground text-sm">
        ไม่สามารถโหลดข่าวได้ กรุณาลองใหม่
      </div>
    )
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        ยังไม่มีข่าว — รอการ fetch ครั้งแรก
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {(articles as ArticleWithSummary[]).map((article) => (
        <NewsCard key={article.id} article={article} />
      ))}
    </div>
  )
}
