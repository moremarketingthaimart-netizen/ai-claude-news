const TECH_KEYWORDS = [
  'ai', 'llm', 'gpt', 'claude', 'gemini', 'openai', 'anthropic', 'google', 'microsoft',
  'ml', 'machine learning', 'deep learning', 'neural', 'model', 'training',
  'open source', 'github', 'developer', 'api', 'cloud', 'aws', 'azure',
  'startup', 'funding', 'launch', 'release', 'update', 'feature',
  'security', 'breach', 'vulnerability', 'privacy', 'data',
  'robot', 'autonomous', 'agent', 'rag', 'vector', 'embedding',
]

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'are', 'was', 'were', 'be',
  'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will',
  'would', 'could', 'should', 'may', 'might', 'can', 'that', 'this',
  'it', 'its', 'its', 'we', 'our', 'you', 'your', 'they', 'their',
  'new', 'one', 'two', 'also', 'more', 'into', 'over', 'after', 'about',
  'up', 'out', 'just', 'now', 'how', 'than', 'then', 'so', 'all',
])

export function extractSummary(content: string | null, title: string, maxSentences = 2): string {
  if (!content || content.trim().length < 30) return title

  const cleaned = content
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30 && s.length < 500)

  if (sentences.length === 0) return cleaned.slice(0, 200)

  return sentences.slice(0, maxSentences).join(' ')
}

export function extractKeyPoints(content: string | null, title: string, maxPoints = 3): string[] {
  if (!content || content.trim().length < 50) return [title]

  const cleaned = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()

  const sentences = cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 30 && s.length < 300)

  const scored = sentences.map((s) => {
    const lower = s.toLowerCase()
    const score = TECH_KEYWORDS.filter((kw) => lower.includes(kw)).length
    return { text: s, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPoints)
    .map((s) => s.text)
}

export function guessSentiment(title: string, content: string | null): 'positive' | 'neutral' | 'negative' {
  const text = `${title} ${content || ''}`.toLowerCase()

  const positive = ['launch', 'release', 'improve', 'better', 'faster', 'new', 'best',
    'success', 'grow', 'fund', 'raise', 'open source', 'free', 'win', 'breakthrough']
  const negative = ['breach', 'hack', 'vulnerability', 'bug', 'fail', 'down', 'outage',
    'ban', 'sue', 'lawsuit', 'concern', 'risk', 'danger', 'exploit', 'leak', 'layoff']

  const posScore = positive.filter((w) => text.includes(w)).length
  const negScore = negative.filter((w) => text.includes(w)).length

  if (posScore > negScore) return 'positive'
  if (negScore > posScore) return 'negative'
  return 'neutral'
}

export function countTrends(articles: Array<{ title: string; category: string }>): {
  trending_topics: Array<{ topic: string; count: number; sentiment: string }>
  keywords: string[]
} {
  const topicGroups: Record<string, { count: number; keywords: string[] }> = {}
  const allWords: Record<string, number> = {}

  for (const { title } of articles) {
    const lower = title.toLowerCase()

    const words = lower
      .split(/\W+/)
      .filter((w) => w.length > 3 && !STOP_WORDS.has(w))

    for (const w of words) {
      allWords[w] = (allWords[w] || 0) + 1
    }

    const matchedTopics = TECH_KEYWORDS.filter((kw) => lower.includes(kw))
    for (const topic of matchedTopics) {
      if (!topicGroups[topic]) topicGroups[topic] = { count: 0, keywords: [] }
      topicGroups[topic].count++
    }
  }

  const trending_topics = Object.entries(topicGroups)
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, 5)
    .map(([topic, { count }]) => ({ topic, count, sentiment: 'neutral' }))

  const keywords = Object.entries(allWords)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word)

  return { trending_topics, keywords }
}

export function buildExtractiveDigest(
  articles: Array<{ title: string; url: string; summary?: string }>,
  date: string
): { title: string; content: string } {
  const formattedDate = new Date(date).toLocaleDateString('th-TH', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const title = `📰 AI & Tech Digest — ${formattedDate}`

  const lines = [
    `# ${title}`,
    '',
    `รวม ${articles.length} ข่าวเด่น Tech/AI ประจำวันนี้`,
    '',
    '---',
    '',
    '## ข่าวเด่น',
    '',
    ...articles.slice(0, 8).flatMap((a, i) => [
      `### ${i + 1}. ${a.title}`,
      a.summary ? a.summary : '',
      `🔗 [อ่านต่อ](${a.url})`,
      '',
    ]),
    '---',
    `*Aggregated by ai-claude-news · ${new Date().toLocaleString('th-TH')}*`,
  ]

  return { title, content: lines.filter((l, i, arr) => !(l === '' && arr[i - 1] === '')).join('\n') }
}
