import { TrendTags } from '@/components/trend-tags'

export const dynamic = 'force-dynamic'

export default function TrendsPage() {
  return (
    <div>
      <div className="mb-10 pb-8 border-b border-border/40">
        <p className="text-xs font-black tracking-widest uppercase text-sky-400 mb-3">Analysis</p>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Trending Topics</h1>
        <p className="text-sm text-muted-foreground">วิเคราะห์ความถี่ keyword จากข่าวล่าสุด</p>
      </div>
      <TrendTags />
    </div>
  )
}
