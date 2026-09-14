# FinStock AI — เว็บวิเคราะห์หุ้นอเมริกาด้วย AI

โครงงานจบ: เว็บวิเคราะห์หุ้นอเมริกา ใช้งานได้จริง สร้างด้วย Next.js (Frontend + Backend
ในโปรเจกต์เดียว) ดึงข้อมูลหุ้นจริงจาก Yahoo Finance และใช้ Gemini (Google AI) ช่วยวิเคราะห์หุ้น
มีระบบ Login/Watchlist ผ่าน Supabase และแชทบอท AI ในตัว

ไฟล์นี้คือแพ็กเกจสมบูรณ์ ย้ายไปตั้งเครื่องใหม่ได้เลยตามขั้นตอนด้านล่าง

---

## สิ่งที่ต้องมีก่อนเริ่ม (Prerequisites)

ติดตั้งให้ครบก่อนบนเครื่องใหม่:

1. **Node.js เวอร์ชัน 18 ขึ้นไป** — ดาวน์โหลดที่ https://nodejs.org (เลือก LTS)
   เช็คว่าติดตั้งสำเร็จ: เปิด PowerShell/Terminal แล้วรัน
   ```
   node -v
   npm -v
   ```
2. **บัญชี Google** — สำหรับขอ Gemini API key ฟรีที่ https://aistudio.google.com
3. **บัญชี Supabase** — สำหรับระบบ Login/Watchlist ฟรีที่ https://supabase.com (ถ้ายังไม่เคยสร้างโปรเจกต์ไว้)

---

## ขั้นตอนติดตั้งบนเครื่องใหม่

### 1. แตกไฟล์ zip และเข้าโฟลเดอร์
```bash
cd finstock-ai
```

### 2. ติดตั้ง dependencies
```bash
npm install
```

### 3. สร้างไฟล์ environment variables
```bash
cp .env.local.example .env.local
```
(บน Windows PowerShell ใช้ `Copy-Item .env.local.example .env.local` แทนได้)

เปิดไฟล์ `.env.local` แล้วใส่ค่า:
```
GEMINI_API_KEY=ใส่คีย์จาก aistudio.google.com
NEXT_PUBLIC_SUPABASE_URL=ใส่ URL จาก Supabase project settings > API
NEXT_PUBLIC_SUPABASE_ANON_KEY=ใส่ anon public key จาก Supabase
NEXT_PUBLIC_BASE_URL=  (ปล่อยว่างตอน dev บนเครื่อง จะใช้ localhost:3000 อัตโนมัติ)
```

### 4. ตั้งค่าฐานข้อมูล Supabase (ถ้ายังไม่เคยทำ หรือย้ายไปโปรเจกต์ Supabase ใหม่)
1. สร้างโปรเจกต์ใหม่ที่ https://supabase.com
2. Project Settings > API → คัดลอก `Project URL` และ `anon public` key ใส่ `.env.local` ตามข้อ 3
3. เปิด SQL Editor > New query → คัดลอกเนื้อหาไฟล์ `supabase/schema.sql` ในนี้ไปวางแล้วกด Run
   (สร้างตาราง `watchlist` พร้อม Row Level Security ให้อัตโนมัติ)
4. ไปที่ Authentication > Providers > Email → ปิด "Confirm email" (แนะนำระหว่างพัฒนา/เดโม
   เพื่อให้สมัครแล้วเข้าใช้ได้ทันที ไม่ต้องกดยืนยันอีเมล)

### 5. รันโปรเจกต์
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ http://localhost:3000

### 6. ทดสอบว่า build ผ่าน (แนะนำก่อน deploy จริง)
```bash
npm run build
```
ถ้ามี error ให้ส่งข้อความ error เต็มๆ มาดูได้

---

## โครงสร้างไฟล์ทั้งหมด

```
finstock-ai/
├── .env.local.example          template ของ environment variables
├── package.json
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── postcss.config.mjs
├── supabase/
│   └── schema.sql              SQL สร้างตาราง watchlist + RLS
├── lib/
│   ├── yahooFinance.ts         client เชื่อม Yahoo Finance (รองรับทั้ง v2/v3+)
│   ├── supabaseClient.ts       client เชื่อม Supabase
│   └── AuthContext.tsx         เก็บสถานะผู้ใช้ทั้งแอป (useAuth hook)
├── components/
│   ├── Header.tsx              เมนูบนสุด + เมนูมือถือ (hamburger)
│   ├── TickerTape.tsx          แถบราคาสดเลื่อนอัตโนมัติ
│   ├── Footer.tsx
│   ├── SearchBar.tsx           ค้นหาหุ้นแบบ autocomplete
│   ├── PopularStocks.tsx       การ์ดหุ้นยอดนิยมพร้อมราคาสด
│   ├── FeatureHighlights.tsx   การ์ด 3 ฟีเจอร์เด่นหน้าแรก
│   ├── StockChart.tsx          กราฟแท่งเทียน (lightweight-charts) + SMA
│   ├── RangeSelector.tsx       ปุ่มเลือกช่วงเวลากราฟ (1M-5Y)
│   ├── StockStatsGrid.tsx      ตาราง fundamentals (P/E, Market Cap ฯลฯ)
│   ├── AIAnalysisCard.tsx      การ์ดผลวิเคราะห์จาก Gemini
│   ├── WatchlistButton.tsx     ปุ่มเพิ่ม/ลบ watchlist
│   ├── BackButton.tsx          ปุ่มย้อนกลับในหน้าหุ้น
│   └── ChatWidget.tsx          แชทบอท AI ลอยมุมจอ
└── app/
    ├── layout.tsx               root layout (ประกอบทุก component ข้างบน)
    ├── globals.css              CSS + keyframe animations
    ├── icon.svg                 favicon
    ├── page.tsx                 หน้าแรก
    ├── login/page.tsx           สมัคร/เข้าสู่ระบบ
    ├── watchlist/page.tsx       รายการหุ้นที่บันทึกไว้
    ├── stock/[symbol]/
    │   ├── page.tsx             หน้ารายละเอียดหุ้น
    │   └── loading.tsx          skeleton ระหว่างโหลด
    └── api/
        ├── search/route.ts          ค้นหาหุ้น
        ├── stock/[symbol]/route.ts  ดึงราคา+กราฟ+indicator (มีแคช 5 นาที)
        ├── ai-analysis/route.ts     เรียก Gemini วิเคราะห์หุ้น
        └── chat/route.ts            แชทบอท
```

---

## ฟีเจอร์ทั้งหมดที่มีในเวอร์ชันนี้

- ค้นหาหุ้นแบบ autocomplete
- กราฟแท่งเทียนพร้อม SMA20/SMA50 และตัวเลือกช่วงเวลา 1M/3M/6M/1Y/5Y
- คำนวณ RSI14 (แสดงในข้อมูลที่ส่งให้ AI วิเคราะห์)
- ปุ่ม "วิเคราะห์เลย" ให้ Gemini สรุปแนวโน้ม/สัญญาณเทคนิค/ความเสี่ยง
- แชทบอท AI ลอยมุมจอ รู้บริบทหุ้นที่กำลังดูอยู่
- ระบบ Login/Signup + Watchlist (Supabase, มี Row Level Security)
- ปุ่มย้อนกลับในหน้าหุ้น
- Ticker tape ราคาสดเลื่อนอัตโนมัติทุกหน้า
- หน้าแรกพร้อมฟีเจอร์ไฮไลต์ + การ์ดหุ้นยอดนิยมราคาสด
- Responsive เต็มรูปแบบ (เมนูมือถือ, กราฟปรับความสูงอัตโนมัติ)
- Loading skeleton ระหว่างรอข้อมูล
- แคชฝั่งเซิร์ฟเวอร์ 5 นาที + ทยอยดึงข้อมูลแทนยิงพร้อมกัน (กันโดน Yahoo rate-limit)

---

## ปัญหาที่เจอบ่อย และวิธีแก้

### `Call new YahooFinance() first` หรือ `This expression is not constructable`
เกิดจาก `yahoo-finance2` เปลี่ยน API ระหว่างเวอร์ชัน (v2 เป็น object ตรงๆ, v3+ ต้อง `new`)
ไฟล์ `lib/yahooFinance.ts` ในนี้แก้ปัญหานี้แล้วโดยเช็ค runtime อัตโนมัติ ไม่ต้องแก้อะไรเพิ่ม
ถ้าเจออีกให้เช็คว่าไฟล์ `lib/yahooFinance.ts` มีบรรทัด `typeof exported === "function"` อยู่จริง

### `Too Many Requests` จาก Yahoo Finance
Yahoo จำกัดจำนวนคำขอต่อ IP ถ้าเจอตอนพัฒนา:
- รอ 15-30 นาทีให้ rate limit รีเซ็ต
- อย่าเปิดหลายแท็บ/รีเฟรชถี่ๆ ระหว่างเทส (แต่ละครั้งดึงหุ้นหลายตัวพร้อมกัน)
- โค้ดมีแคช 5 นาที + ทยอยดึงอยู่แล้ว ช่วยลดโอกาสเจอปัญหานี้ได้มาก แต่ไม่ได้ป้องกัน 100%
- ถ้าเจอ `ConnectTimeoutError` (เชื่อมต่อไม่ติดเลย ไม่ใช่แค่ถูกปฏิเสธ) อาจเป็นปัญหาเครือข่าย/ISP
  ลองเข้า https://finance.yahoo.com ตรงๆ ผ่านเบราว์เซอร์เพื่อเช็คว่าเข้าถึงได้ปกติไหม

### Build ผ่านแต่หน้าเว็บไม่มีปุ่ม Login
เช็คว่าไฟล์ `app/layout.tsx` ห่อด้วย `<AuthProvider>` และมี `lib/AuthContext.tsx` อยู่จริง
ลบโฟลเดอร์ `.next` แล้วรัน `npm run dev` ใหม่เสมอหลังแก้โค้ดสำคัญ

### แก้โค้ดแล้วไม่มีผล
ลบ `.next` cache ก่อนรันใหม่ทุกครั้งที่แก้ไฟล์สำคัญ (เช่น `lib/`, `app/layout.tsx`):
```powershell
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
npm run dev
```

---

## Deploy ขึ้น Vercel (สรุปสั้น)

1. Push โค้ดขึ้น GitHub (**ต้อง commit `package-lock.json` ด้วย** ไม่งั้น Vercel อาจได้ dependency คนละเวอร์ชันกับที่เทสบนเครื่อง)
2. ไปที่ vercel.com → สมัครด้วย GitHub → Add New Project → เลือก repo นี้
3. ก่อนกด Deploy ไปที่ Environment Variables ใส่ตัวแปรเดียวกับ `.env.local` ทั้งหมด
   (ตั้ง `NEXT_PUBLIC_BASE_URL` เป็น URL ที่ Vercel จะให้ เช่น `https://finstock-ai.vercel.app`)
4. กด Deploy
5. **สำคัญ**: กลับไปที่ Supabase → Authentication > URL Configuration → เปลี่ยน Site URL และ
   Redirect URLs เป็นโดเมนจริงบน Vercel ไม่งั้นระบบ Login จะใช้ไม่ได้บนเว็บจริง

---

## หมายเหตุสำคัญสำหรับรายงานโครงงาน

- `yahoo-finance2` เป็น unofficial library ไม่ใช่ API ทางการของ Yahoo — ควรระบุข้อจำกัดนี้ในรายงาน
- Gemini free tier มี rate limit ของตัวเอง แยกจากปัญหา Yahoo rate limit
- อย่าลืมใส่ disclaimer ว่าเว็บนี้เพื่อการศึกษา ไม่ใช่คำแนะนำการลงทุน (มีอยู่ใน footer และในผลลัพธ์ AI วิเคราะห์แล้ว)
