---
description: วิเคราะห์และแสดง trending topics จากข่าว 24 ชั่วโมงล่าสุด
---

# /trends

วิเคราะห์ trending topics จาก articles ที่สะสมใน Supabase

## Usage

```
/trends           # trends 24h ล่าสุด
/trends --48h     # trends 48h ล่าสุด
/trends --week    # trends 7 วันล่าสุด
```

## สิ่งที่ agent ต้องทำ

1. Query articles จาก Supabase ตาม time window
2. ส่ง titles + categories ให้ Claude วิเคราะห์
3. สร้าง JSON ที่มี trending_topics + keywords
4. แสดงผลเป็น table ใน terminal

## Output Format

```
📊 Trending Topics (Last 24h)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 LLM / Language Models  (15 articles)
⚡ AI Safety              (8 articles)
🛠️  Developer Tools        (6 articles)
☁️  Cloud Computing        (5 articles)
🔐 Cybersecurity          (4 articles)

🏷️ Keywords: Claude, GPT-4o, Gemini, RAG, multimodal
```

Arguments: $ARGUMENTS
