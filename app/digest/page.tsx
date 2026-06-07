import { createAnonClient } from '@/lib/supabase/server'
import { DigestView } from '@/components/digest-view'

export const revalidate = 600

export default async function DigestPage() {
  const supabase = createAnonClient()
  const today = new Date().toISOString().split('T')[0]

  const { data: digest } = await supabase
    .from('digests')
    .select('*')
    .eq('digest_date', today)
    .single()

  const { data: recentDigests } = await supabase
    .from('digests')
    .select('id, digest_date, title, articles_count')
    .order('digest_date', { ascending: false })
    .limit(7)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-1">Daily Digest</h1>
        <p className="text-muted-foreground text-sm">สรุปข่าวสำคัญประจำวันโดย Claude</p>
      </div>
      <DigestView digest={digest} recentDigests={recentDigests || []} today={today} />
    </div>
  )
}
