---
description: สร้าง daily digest สำหรับวันที่ระบุ (default: วันนี้) ถ้า digest มีอยู่แล้วจะ return ของเดิม
---

# /digest

สร้างหรือดู daily digest ด้วย Claude

## Usage

```
/digest             # digest วันนี้
/digest 2025-06-07  # digest ของวันที่ระบุ
/digest --force     # สร้างใหม่ แม้จะมีอยู่แล้ว
```

## สิ่งที่ agent ต้องทำ

1. ตรวจสอบว่ามี digest ของวันนี้ใน Supabase แล้วหรือยัง
2. ถ้ามีแล้ว (และไม่มี --force) → แสดง digest เดิม
3. ถ้าไม่มี → query top articles ของวันนี้
4. ใช้ Claude สร้าง narrative digest
5. Upsert ลง `digests` table
6. แสดงผล digest ใน terminal

Arguments: $ARGUMENTS
