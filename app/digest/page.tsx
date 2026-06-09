import { createAnonClient } from '@/lib/supabase/server'
import { DigestView } from '@/components/digest-view'

export const dynamic = 'force-dynamic'

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
      <div className="mb-10 pb-8 border-b border-border/40">
        <p className="text-xs font-black tracking-widest uppercase text-sky-400 mb-3">Editorial</p>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Daily Digest</h1>
        <p className="text-sm text-muted-foreground">สรุปข่าวสำคัญประจำวัน — อัปเดตทุกเช้า</p>
      </div>
      <DigestView digest={digest} recentDigests={recentDigests || []} today={today} />
    </div>
  )
}
