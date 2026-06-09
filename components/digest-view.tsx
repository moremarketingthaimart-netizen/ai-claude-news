'use client'

import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import type { Digest } from '@/types'

interface DigestViewProps {
  digest: Digest | null
  recentDigests: Array<{ id: string; digest_date: string; title: string; articles_count: number }>
  today: string
}

function renderDigestContent(content: string): ReactNode[] {
  const elements: ReactNode[] = []
  let key = 0

  for (const line of content.split('\n')) {
    const t = line.trim()

    if (!t) {
      elements.push(<div key={key++} className="h-1" />)
    } else if (t.startsWith('# ')) {
      // Skip — title shown in page header
    } else if (t === '---') {
      elements.push(<hr key={key++} className="border-border/30 my-5" />)
    } else if (t.startsWith('## ')) {
      elements.push(
        <p key={key++} className="text-xs font-black tracking-widest uppercase text-muted-foreground mt-6 mb-3">
          {t.replace(/^## /, '')}
        </p>
      )
    } else if (t.startsWith('### ')) {
      elements.push(
        <h3 key={key++} className="text-sm font-bold tracking-tight mt-5 mb-1.5">
          {t.replace(/^### /, '')}
        </h3>
      )
    } else if (t.startsWith('🔗 ')) {
      const match = t.match(/🔗 \[(.+?)\]\((.+?)\)/)
      if (match) {
        elements.push(
          <a
            key={key++}
            href={match[2]}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 transition-colors mb-3"
          >
            {match[1]} →
          </a>
        )
      }
    } else if (t.startsWith('*') && t.endsWith('*')) {
      elements.push(
        <p key={key++} className="text-xs text-muted-foreground/40 italic mt-4">
          {t.replace(/^\*|\*$/g, '')}
        </p>
      )
    } else {
      elements.push(
        <p key={key++} className="text-sm text-foreground/80 leading-relaxed">
          {t}
        </p>
      )
    }
  }

  return elements
}

export function DigestView({ digest, recentDigests, today }: DigestViewProps) {
  const [loading, setLoading] = useState(false)
  const [currentDigest, setCurrentDigest] = useState<Digest | null>(digest)
  const [error, setError] = useState<string | null>(null)

  async function generateDigest() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: today }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || `Server error (${res.status})`)
        return
      }
      if (data.digest) setCurrentDigest(data.digest)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
      {/* Main content */}
      <div className="lg:col-span-3">
        {currentDigest ? (
          <div>
            {/* Digest meta */}
            <div className="flex items-center gap-3 text-xs text-muted-foreground pb-5 mb-6 border-b border-border/40">
              <span className="font-semibold text-foreground/60">{currentDigest.digest_date}</span>
              <span>·</span>
              <span>{currentDigest.articles_count} บทความ</span>
            </div>
            {/* Digest body */}
            <div className="space-y-0.5">
              {renderDigestContent(currentDigest.content)}
            </div>
          </div>
        ) : (
          <div className="border border-border/40 rounded p-12 text-center space-y-4">
            <p className="text-xs font-black tracking-widest uppercase text-muted-foreground">
              Daily Digest
            </p>
            <p className="text-sm text-muted-foreground">ยังไม่มี digest สำหรับวันนี้</p>
            <Button
              onClick={generateDigest}
              disabled={loading}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              {loading ? 'กำลังสร้าง...' : 'สร้าง Digest วันนี้'}
            </Button>
            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}
          </div>
        )}
      </div>

      {/* History sidebar */}
      <div>
        <p className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-4">
          History
        </p>
        {recentDigests.length === 0 ? (
          <p className="text-xs text-muted-foreground/50">ยังไม่มีประวัติ</p>
        ) : (
          <div className="space-y-0">
            {recentDigests.map((d) => (
              <div
                key={d.id}
                className="border-b border-border/30 py-3 cursor-pointer group"
              >
                <p className="text-xs font-medium truncate group-hover:text-sky-400 transition-colors">
                  {d.title.replace(/^📰 /, '')}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground/60 mt-0.5">
                  <span>{d.digest_date}</span>
                  <span>{d.articles_count} บทความ</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
