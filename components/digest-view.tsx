'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import type { Digest } from '@/types'

interface DigestViewProps {
  digest: Digest | null
  recentDigests: Array<{ id: string; digest_date: string; title: string; articles_count: number }>
  today: string
}

interface DigestArticleBlock {
  title: string
  body: string
  url: string
}

function parseDigestArticles(content: string): {
  intro: string
  articles: DigestArticleBlock[]
  footer: string
} {
  const lines = content.split('\n')
  let intro = ''
  let footer = ''
  const articles: DigestArticleBlock[] = []
  let current: DigestArticleBlock | null = null

  for (const line of lines) {
    const t = line.trim()
    if (!t || t === '---' || t.startsWith('# ') || t.startsWith('## ')) continue

    if (t.startsWith('### ')) {
      if (current) articles.push(current)
      current = { title: t.replace(/^### \d+\.\s*/, ''), body: '', url: '' }
    } else if (t.startsWith('🔗 ') && current) {
      const match = t.match(/🔗 \[.+?\]\((.+?)\)/)
      if (match) current.url = match[1]
    } else if (t.startsWith('*') && t.endsWith('*')) {
      if (current) { articles.push(current); current = null }
      footer = t.replace(/^\*|\*$/g, '')
    } else if (current) {
      current.body = current.body ? `${current.body} ${t}` : t
    } else {
      if (intro) intro += ' '
      intro += t
    }
  }

  if (current) articles.push(current)
  return { intro, articles, footer }
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
        {currentDigest ? (() => {
          const { intro, articles, footer } = parseDigestArticles(currentDigest.content)
          return (
            <div>
              {/* Digest meta */}
              <div className="flex items-center gap-3 text-xs text-muted-foreground pb-5 mb-6 border-b border-border/40">
                <span className="font-semibold text-foreground/60">{currentDigest.digest_date}</span>
                <span>·</span>
                <span>{currentDigest.articles_count} บทความ</span>
              </div>

              {/* Intro */}
              {intro && (
                <p className="text-sm text-muted-foreground leading-relaxed mb-8">{intro}</p>
              )}

              {/* Article blocks */}
              <div className="space-y-1">
                {articles.map((item, i) => (
                  <div
                    key={i}
                    className="border-l-2 border-border/25 pl-5 py-3 mb-5 hover:border-sky-500/40 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex items-baseline gap-2.5 min-w-0">
                        <span className="text-xs font-mono text-muted-foreground/30 shrink-0 tabular-nums">
                          {String(i + 1).padStart(2, '0')}
                        </span>
                        <h3 className="text-sm font-bold tracking-tight leading-snug">
                          {item.title}
                        </h3>
                      </div>
                      {item.url && (
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="shrink-0 text-muted-foreground/30 hover:text-sky-400 transition-colors text-xs mt-0.5"
                          title="อ่านบทความต้นฉบับ"
                        >
                          ↗
                        </a>
                      )}
                    </div>
                    {item.body && (
                      <p className="text-sm text-foreground/65 leading-[1.75] ml-[1.625rem]">
                        {item.body}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              {footer && (
                <p className="text-xs text-muted-foreground/30 italic mt-6 pt-4 border-t border-border/20">
                  {footer}
                </p>
              )}
            </div>
          )
        })() : (
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
          <div>
            {recentDigests.map((d) => (
              <div
                key={d.id}
                className="border-b border-border/30 py-3 cursor-pointer group"
              >
                <p className="text-xs font-medium truncate group-hover:text-sky-400 transition-colors">
                  {d.title.replace(/^📰 /, '')}
                </p>
                <div className="flex items-center justify-between text-xs text-muted-foreground/50 mt-0.5">
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
