'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Digest } from '@/types'

interface DigestViewProps {
  digest: Digest | null
  recentDigests: Array<{ id: string; digest_date: string; title: string; articles_count: number }>
  today: string
}

export function DigestView({ digest, recentDigests, today }: DigestViewProps) {
  const [loading, setLoading] = useState(false)
  const [currentDigest, setCurrentDigest] = useState<Digest | null>(digest)

  async function generateDigest() {
    setLoading(true)
    try {
      const res = await fetch('/api/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today }),
      })
      const data = await res.json()
      if (data.digest) setCurrentDigest(data.digest)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        {currentDigest ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentDigest.title}</CardTitle>
              <div className="flex gap-2 text-xs text-muted-foreground">
                <span>{currentDigest.digest_date}</span>
                <span>·</span>
                <span>{currentDigest.articles_count} บทความ</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-invert prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {currentDigest.content}
                </pre>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center space-y-4">
              <p className="text-muted-foreground">ยังไม่มี digest สำหรับวันนี้</p>
              <Button onClick={generateDigest} disabled={loading}>
                {loading ? 'กำลังสร้าง...' : 'สร้าง Digest วันนี้'}
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium mb-3">Digests ล่าสุด</p>
        {recentDigests.length === 0 ? (
          <p className="text-xs text-muted-foreground">ยังไม่มีประวัติ</p>
        ) : (
          recentDigests.map((d) => (
            <div key={d.id} className="border rounded p-2 text-xs hover:bg-accent cursor-pointer">
              <p className="font-medium truncate">{d.title}</p>
              <div className="flex gap-2 text-muted-foreground mt-0.5">
                <span>{d.digest_date}</span>
                <Badge variant="secondary" className="text-xs h-4">{d.articles_count}</Badge>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
