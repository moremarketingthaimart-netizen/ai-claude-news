import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface SummaryPanelProps {
  summary: {
    summary_text: string
    key_points: string[]
    sentiment: 'positive' | 'neutral' | 'negative' | null
  }
}

const sentimentConfig = {
  positive: { label: 'Positive', dot: 'bg-emerald-400' },
  neutral: { label: 'Neutral', dot: 'bg-zinc-500' },
  negative: { label: 'Negative', dot: 'bg-red-400' },
}

export function SummaryPanel({ summary }: SummaryPanelProps) {
  const sentiment = summary.sentiment ? sentimentConfig[summary.sentiment] : null

  return (
    <Card className="border-border/40">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xs font-black tracking-widest uppercase text-muted-foreground">
            Summary
          </CardTitle>
          {sentiment && (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={`w-1.5 h-1.5 rounded-full ${sentiment.dot}`} />
              {sentiment.label}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-sm leading-relaxed text-foreground/90">{summary.summary_text}</p>

        {summary.key_points && summary.key_points.length > 0 && (
          <div className="border-t border-border/40 pt-4">
            <p className="text-xs font-black tracking-widest uppercase text-muted-foreground mb-3">
              Key Points
            </p>
            <ul className="space-y-2.5">
              {(summary.key_points as string[]).map((point, i) => (
                <li key={i} className="flex gap-3 text-sm text-foreground/80">
                  <span className="text-sky-400 shrink-0 font-mono text-xs mt-0.5 w-5">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="leading-relaxed">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="text-xs text-muted-foreground/40 border-t border-border/20 pt-3">
          Extractive summary · ai-claude-news
        </p>
      </CardContent>
    </Card>
  )
}
