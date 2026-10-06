# กลับบ้านข้าวมันไก่ — Front End V2

อัปไฟล์ทั้งหมดในโฟลเดอร์นี้ทับ V1 ใน repository เดิมได้เลย แล้ว Commit / Push ตามปกติ

## สิ่งที่เปลี่ยนใน V2
- OUR MENU ใหม่: ราคาใหญ่ขึ้น, เลือกธรรมดา/พิเศษหรือ S/M/L ก่อนเพิ่มตะกร้า, เพิ่มข้าวมัน 15 บาท/ถ้วย
- Cart เพิ่ม/ลด/ลบรายการและคำนวณยอด realtime
- ภาพใหม่ 18 ภาพ ครอบคลุม Hero, Menu, Signature, Scrollytelling และ Gallery
- Scrollytelling 6 ฉากหลังช่วงเมนู
- Graphic system แดง/เขียว: วงกลม, ข้าวหลามตัด, กรอบเส้นคู่, ป้ายวินเทจ
- รองรับ desktop/mobile และ Sticky Cart บนมือถือ

## ฟอนต์ DB Urbanist X
เพื่อความปลอดภัย ไฟล์ ZIP นี้ไม่ได้แนบไฟล์ฟอนต์ที่คุณอัปโหลดมาให้ กรุณานำไฟล์ต้นฉบับ 3 ไฟล์ของคุณวางไว้ที่ `assets/fonts/` ด้วยชื่อเดิม:
- `DB Urbanist X.woff2`
- `DB Urbanist X Bd.woff2`
- `DB Urbanist X Li.woff2`

CSS เตรียม @font-face ไว้ให้แล้ว เมื่อใส่ไฟล์ครบเว็บจะใช้ฟอนต์ดังกล่าวทันที

## V2.1 typography fix
- DB Urbanist X is now mapped to discrete weights 200–900 for more reliable mobile rendering.
- Font URLs use URL-encoded spaces for GitHub Pages/mobile browser consistency.
- Negative heading tracking was removed and Thai text spacing/line-height increased for readability.
- Keep the three original font files in `assets/fonts/` with these exact names:
  - `DB Urbanist X.woff2`
  - `DB Urbanist X Bd.woff2`
  - `DB Urbanist X Li.woff2`
