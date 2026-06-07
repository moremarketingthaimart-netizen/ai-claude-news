---
description: ดึงข่าวใหม่จากทุก active sources แล้วบันทึกลง Supabase รับ argument เพิ่มเติมได้: source name หรือ limit
---

# /fetch-news

ดึงข่าวใหม่จากแหล่งข่าวที่กำหนดใน `lib/news/sources.ts`

## Usage

```
/fetch-news              # ดึงจากทุก sources
/fetch-news hackernews   # ดึงเฉพาะ HackerNews
/fetch-news --limit 20   # จำกัด 20 บทความ
```

## สิ่งที่ agent ต้องทำ

1. อ่าน sources จาก `lib/news/sources.ts`
2. ถ้ามี argument → กรองเฉพาะ source นั้น
3. เรียก `lib/news/fetcher.ts` เพื่อ fetch
4. Upsert ลง Supabase `articles` table
5. Report สรุป: "ดึงข่าว X บทความจาก Y sources"

Arguments: $ARGUMENTS
