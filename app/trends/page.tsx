import { TrendTags } from '@/components/trend-tags'

export const revalidate = 3600

export default function TrendsPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Trending Topics</h1>
        <p className="text-muted-foreground text-sm">วิเคราะห์ข่าว 24 ชั่วโมงล่าสุดด้วย Claude</p>
      </div>
      <TrendTags />
    </div>
  )
}
