# ai-claude-news

AI-powered news aggregator ที่รวบรวมข่าว Tech/AI จากหลายแหล่ง สรุปด้วย Claude Sonnet และสร้าง daily digest

## Quick Start

```bash
npm install
cp .env.example .env.local
# กรอก SUPABASE_URL, ANON_KEY, SERVICE_ROLE_KEY, ANTHROPIC_API_KEY
npm run dev
# → http://localhost:3000
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 App Router + TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| AI | Claude Sonnet (claude-sonnet-4-6) |
| Deploy | Vercel |

## Project Structure

```
app/                    # Next.js App Router
  page.tsx              # Home — news feed
  news/[id]/page.tsx    # Article detail + summary
  digest/page.tsx       # Daily digest
  trends/page.tsx       # Trending topics
  api/                  # API routes
    news/route.ts       # GET (list) | POST (fetch)
    summarize/route.ts  # POST (summarize article)
    digest/route.ts     # GET | POST (generate)
    trends/route.ts     # GET (analyze)
components/             # React components
lib/
  supabase/             # client.ts | server.ts | types.ts
  claude/               # client.ts | prompts.ts
  news/                 # fetcher.ts | sources.ts
types/index.ts
```

## Agents

| Agent | หน้าที่ |
|-------|---------|
| `news-hunter` | ดึงข่าวจาก RSS/HackerNews |
| `content-summarizer` | สรุปบทความด้วย Claude |
| `trend-analyzer` | วิเคราะห์ trending topics |
| `digest-builder` | สร้าง daily digest |
| `supabase-admin` | จัดการ DB schema/data |

## Commands

| Command | ทำอะไร |
|---------|--------|
| `/fetch-news` | ดึงข่าวใหม่จากทุก sources |
| `/summarize [url\|id]` | สรุปบทความ |
| `/digest [date]` | สร้างหรือดู daily digest |
| `/trends [--48h\|--week]` | ดู trending topics |
| `/seed-news` | เพิ่ม sample data (dev only) |

## Database Schema

```
articles    — ข่าวดิบ (url unique key)
summaries   — AI summaries (FK: article_id)
digests     — Daily digests (unique: digest_date)
sources     — แหล่งข่าวที่ configure
```

## Supabase Client Pattern

```typescript
// Server component / API route — ใช้ service role (can write)
import { createServerClient } from '@/lib/supabase/server'

// Browser component — ใช้ anon key (read-only via RLS)
import { createClient } from '@/lib/supabase/client'

// Server component read-only (cheaper)
import { createAnonClient } from '@/lib/supabase/server'
```

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=        # ต้องมี
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # ต้องมี
SUPABASE_SERVICE_ROLE_KEY=       # ต้องมี (server only)
ANTHROPIC_API_KEY=               # ต้องมี
NEWS_API_KEY=                    # optional
```

## News Sources

กำหนดใน `lib/news/sources.ts`:
- Hacker News (top stories API)
- The Verge (RSS)
- TechCrunch AI (RSS)
- MIT Technology Review (RSS)
- VentureBeat AI (RSS)

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/news` | GET | ดึง articles (params: limit, category, offset) |
| `/api/news` | POST | Fetch จาก sources แล้วบันทึก Supabase |
| `/api/summarize` | POST | สรุปบทความ (body: {article_id}) |
| `/api/digest` | GET | ดู digest ของวัน (param: date) |
| `/api/digest` | POST | สร้าง digest (body: {date, force}) |
| `/api/trends` | GET | วิเคราะห์ trends (param: hours) |

## Deployment

### Vercel
1. Import repo ที่ `vercel.com/new`
2. กรอก Environment Variables ทั้งหมด
3. Deploy

### Supabase
- Project URL และ Keys ได้จาก Supabase Dashboard
- ใช้ Supabase MCP tool สำหรับ schema changes

## Design Reference

`DESIGN-raycast.md` — Raycast-inspired dark UI design system สำหรับ reference
