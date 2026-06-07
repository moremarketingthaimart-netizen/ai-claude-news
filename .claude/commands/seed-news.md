---
description: เพิ่ม sample news articles ลง Supabase สำหรับ development และ testing เท่านั้น ห้ามใช้ใน production
---

# /seed-news

Seed database ด้วย sample articles สำหรับ dev environment

## Usage

```
/seed-news          # seed 10 sample articles
/seed-news --count 20   # seed จำนวนที่ระบุ
/seed-news --clear  # ลบทุก articles แล้ว seed ใหม่
```

## ⚠️ Warning

**ใช้ได้เฉพาะ development เท่านั้น** — ตรวจสอบ `NODE_ENV !== 'production'` ก่อนเสมอ

## Sample Data

สร้าง articles เกี่ยวกับ:
- Claude / Anthropic news
- OpenAI / GPT updates
- Google Gemini
- Open source LLM
- AI tools และ frameworks

## สิ่งที่ agent ต้องทำ

1. ตรวจสอบว่า NODE_ENV ไม่ใช่ production
2. สร้าง mock article objects
3. Insert ลง Supabase (ไม่ตรวจ duplicate)
4. Report จำนวน articles ที่ seed แล้ว

Arguments: $ARGUMENTS
