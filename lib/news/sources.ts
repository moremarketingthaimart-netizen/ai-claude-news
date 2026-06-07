export interface NewsSource {
  name: string
  feedUrl?: string
  siteUrl: string
  category: string
  type: 'rss' | 'hackernews' | 'api'
}

export const NEWS_SOURCES: NewsSource[] = [
  {
    name: 'Hacker News',
    siteUrl: 'https://news.ycombinator.com',
    category: 'tech',
    type: 'hackernews',
  },
  {
    name: 'The Verge',
    feedUrl: 'https://www.theverge.com/rss/index.xml',
    siteUrl: 'https://www.theverge.com',
    category: 'tech',
    type: 'rss',
  },
  {
    name: 'TechCrunch AI',
    feedUrl: 'https://techcrunch.com/feed/',
    siteUrl: 'https://techcrunch.com',
    category: 'ai',
    type: 'rss',
  },
  {
    name: 'MIT Technology Review',
    feedUrl: 'https://www.technologyreview.com/feed/',
    siteUrl: 'https://www.technologyreview.com',
    category: 'ai',
    type: 'rss',
  },
  {
    name: 'VentureBeat AI',
    feedUrl: 'https://venturebeat.com/feed/',
    siteUrl: 'https://venturebeat.com',
    category: 'ai',
    type: 'rss',
  },
]
