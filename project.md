# Project: ai-claude-news

## Overview

AI-powered news aggregator สำหรับ Tech/AI news — รวบรวมข่าวจากหลายแหล่ง, ใช้ Claude Sonnet สรุปเนื้อหา, และสร้าง daily digest อัตโนมัติ

**URL:** https://ai-claude-news.vercel.app (หลัง deploy)
**GitHub:** https://github.com/moremarketingthaimart-netizen/ai-claude-news
**Supabase Project:** ai-claude-news

---

## Architecture Decisions

### ADR-001: Next.js App Router
**Decision:** ใช้ Next.js 15 App Router (ไม่ใช้ Pages Router)
**Reason:** Server Components ลด client-side JS ได้มาก, ISR ทำ revalidation ง่าย, streaming support สำหรับ AI responses

### ADR-002: Supabase เป็น Database
**Decision:** ใช้ Supabase (PostgreSQL) แทน SQLite/PlanetScale
**Reason:** Free tier ใช้ได้, มี MCP integration, built-in RLS, real-time ถ้าต้องการในอนาคต

### ADR-003: Claude Sonnet สำหรับ Summarization
**Decision:** ใช้ claude-sonnet-4-6 แทน Haiku หรือ Opus
**Reason:** Balance ระหว่าง cost/quality — Sonnet สรุปได้ดีในราคาที่ยอมรับได้, Haiku คุณภาพต่ำเกินไป

### ADR-004: RSS + HN API แทน Commercial News API
**Decision:** ใช้ RSS feeds + HackerNews API เป็น default sources
**Reason:** ฟรี 100%, ไม่ต้องการ API key, ครอบคลุม Tech/AI news ได้ดี

### ADR-005: No User Auth (MVP)
**Decision:** ไม่มี user authentication ใน Phase 1
**Reason:** ลด complexity, focus ที่ core features, RLS public read policy เพียงพอ

---

## Database Schema

### articles

| Column | Type | Constraint |
|--------|------|-----------|
| id | UUID | PK, DEFAULT gen_random_uuid() |
| title | TEXT | NOT NULL |
| url | TEXT | UNIQUE NOT NULL |
| content | TEXT | nullable |
| source_name | TEXT | nullable |
| source_url | TEXT | nullable |
| category | TEXT | DEFAULT 'general' |
| published_at | TIMESTAMPTZ | nullable |
| fetched_at | TIMESTAMPTZ | DEFAULT NOW() |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### summaries

| Column | Type | Constraint |
|--------|------|-----------|
| id | UUID | PK |
| article_id | UUID | FK articles.id ON DELETE CASCADE |
| summary_text | TEXT | NOT NULL |
| key_points | JSONB | DEFAULT '[]' |
| sentiment | TEXT | CHECK IN ('positive','neutral','negative') |
| model_used | TEXT | DEFAULT 'claude-sonnet-4-6' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### digests

| Column | Type | Constraint |
|--------|------|-----------|
| id | UUID | PK |
| digest_date | DATE | UNIQUE NOT NULL |
| title | TEXT | NOT NULL |
| content | TEXT | NOT NULL (Markdown) |
| article_ids | JSONB | DEFAULT '[]' |
| articles_count | INTEGER | DEFAULT 0 |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### sources

| Column | Type | Constraint |
|--------|------|-----------|
| id | UUID | PK |
| name | TEXT | NOT NULL |
| feed_url | TEXT | nullable (RSS) |
| site_url | TEXT | nullable |
| category | TEXT | DEFAULT 'tech' |
| active | BOOLEAN | DEFAULT TRUE |
| last_fetched_at | TIMESTAMPTZ | nullable |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

---

## API Design

### GET /api/news
Query articles from Supabase
- `?limit=20` — number of articles (max 50)
- `?category=ai` — filter by category
- `?offset=0` — pagination

### POST /api/news
Trigger news fetch from all sources
- Fetches RSS + HackerNews
- Upserts to Supabase (deduplication by URL)
- Returns `{ count, errors }`

### POST /api/summarize
Summarize a single article with Claude
- Body: `{ article_id: string }`
- Calls Claude Sonnet with SUMMARIZE_PROMPT
- Returns `{ summary }`

### GET /api/digest
Get digest for a date
- `?date=2025-06-07` (default: today)
- Returns `{ digest }` or `{ digest: null }`

### POST /api/digest
Generate digest for a date
- Body: `{ date?, force? }`
- Requires ≥3 articles for that date
- Returns `{ digest }`

### GET /api/trends
Analyze trending topics
- `?hours=24` (default, max 168)
- Returns `{ trending_topics, keywords, analyzed_at }`

---

## News Sources Config (lib/news/sources.ts)

| Source | Type | Category |
|--------|------|----------|
| Hacker News | HN API | tech |
| The Verge | RSS | tech |
| TechCrunch | RSS | ai |
| MIT Tech Review | RSS | ai |
| VentureBeat | RSS | ai |

---

## Future Features (Post-MVP)

- [ ] User authentication + bookmarks (Supabase Auth)
- [ ] Email newsletter digest
- [ ] More news sources
- [ ] Search functionality
- [ ] Article categories filter UI
- [ ] Scheduled auto-fetch (Vercel Cron Jobs)
- [ ] Thai language summarization toggle
