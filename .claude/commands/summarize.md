---
description: สรุปบทความข่าวด้วย Claude รับ URL หรือ article ID เป็น argument ถ้าไม่ระบุจะสรุป articles ที่ยังไม่มี summary ทั้งหมด
---

# /summarize

สรุปบทความด้วย Claude Sonnet

## Usage

```
/summarize                              # สรุป articles ที่ยังไม่มี summary (batch)
/summarize https://example.com/article  # สรุป URL ที่ระบุ
/summarize <article-uuid>               # สรุปจาก article ID
```

## สิ่งที่ agent ต้องทำ

1. ถ้าไม่มี argument → query articles ที่ไม่มี summary แล้ว batch สรุป (max 10 ต่อครั้ง)
2. ถ้ามี URL → fetch content จาก URL แล้วสรุป
3. ถ้ามี UUID → query article จาก Supabase แล้วสรุป
4. สร้าง summary ด้วย `lib/claude/client.ts` + prompts ใน `lib/claude/prompts.ts`
5. Upsert ลง `summaries` table
6. Report: "สรุป X บทความ"

Arguments: $ARGUMENTS
