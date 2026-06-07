# Task Board — ai-claude-news

_อัปเดตล่าสุด: 2026-06-07_

---

## Phase 1: Setup & Infrastructure ✅

- [x] Initialize Next.js 15 project (TypeScript + Tailwind + App Router)
- [x] Install dependencies: Supabase, Anthropic SDK, rss-parser, shadcn/ui
- [x] Create `.claude/` structure (agents, commands, hooks, settings)
- [x] Create `lib/` files (Supabase client/server, Claude client, prompts)
- [x] Create `lib/news/` (fetcher, sources)
- [x] Create API routes (news, summarize, digest, trends)
- [x] Create pages (home, article, digest, trends)
- [x] Create components (NewsCard, NewsFeed, SummaryPanel, DigestView, TrendTags)
- [x] Create CLAUDE.md, project.md, task.md
- [x] Create global skill `~/.claude/skills/ai-claude-news/`
- [x] Setup Supabase project and schema via MCP
- [x] Create GitHub repository
- [x] First commit and push

---

## Phase 2: Core Features 🚧

- [ ] **Test API routes** locally หลัง env vars ครบ
  - POST `/api/news` — ดึงข่าวจริงจาก RSS/HN
  - POST `/api/summarize` — สรุปบทความด้วย Claude
  - POST `/api/digest` — สร้าง daily digest
  - GET `/api/trends` — วิเคราะห์ trends
- [ ] **Seed initial news** — รัน POST /api/news ครั้งแรก
- [ ] **Verify UI** — ตรวจสอบ home feed, article page, digest, trends
- [ ] **Connect Vercel** — import repo แล้วกรอก env vars
- [ ] **Test production build** — `npm run build` ผ่านโดยไม่มี errors
- [ ] **Setup Vercel Cron** — auto-fetch news ทุก 6 ชั่วโมง

---

## Phase 3: Polish & Features 📋

- [ ] Add loading states สำหรับทุก page
- [ ] Add error boundaries
- [ ] Category filter UI บน home feed
- [ ] Pagination หรือ infinite scroll
- [ ] Improve summary prompt (Thai quality)
- [ ] Add "Generate Summary" button บน article page
- [ ] Responsive mobile layout check
- [ ] SEO: OpenGraph tags, sitemap
- [ ] Dark mode toggle (optional)

---

## Backlog 💡

- [ ] User authentication + bookmarks (Supabase Auth)
- [ ] Email newsletter digest (Resend)
- [ ] Search by keyword
- [ ] Thai-only news sources
- [ ] RSS source management UI (admin)
- [ ] Article view tracking
- [ ] Related articles suggestion

---

## Notes

- Supabase service role key → ใช้เฉพาะ server-side API routes
- Claude API → ระวัง rate limits, ใช้ max_tokens: 500 สำหรับ summary
- RSS feeds บางแหล่งอาจ CORS block → fetch จาก server เท่านั้น
