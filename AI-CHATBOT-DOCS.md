# CADD CORE AI Chatbot — সম্পূর্ণ ডকুমেন্টেশন

## এক নজরে পুরো সিস্টেম

```
User (Browser)
    │
    │  click করে 💬 button
    ▼
ChatBot.tsx  (Frontend UI)
    │
    │  POST /api/chat  { messages: [...] }
    ▼
route.ts  (Next.js Backend — Server-side)
    │
    ├──→  তোমার DB (localhost:5000/api/courses)  ← Real course data
    │
    └──→  OpenRouter API  (google/gemma-4-31b-it:free)
              │
              ▼
         AI response আসে
              │
              ▼
    route.ts → ChatBot.tsx → User দেখতে পায়
```

---

## ফাইল ১: `src/app/api/chat/route.ts`
**ধরন:** Next.js API Route (Server-side)
**কাজ:** সব কিছুর brain — AI-কে call করে এবং DB থেকে data আনে

### এই ফাইলে কী আছে?

#### ১. BASE_SYSTEM (System Prompt)
```
const BASE_SYSTEM = `You are a helpful AI assistant for CADD CORE...`
```
**কী:** AI-কে দেওয়া "নির্দেশনা পত্র"।
**কেন:** AI নিজে থেকে জানে না সে কোন institute-এর assistant।
এই text পড়ে AI বুঝতে পারে:
- সে CADD CORE-এর assistant
- বাংলায় প্রশ্ন হলে বাংলায় উত্তর দিতে হবে
- Phone number, location কী
- Off-topic প্রশ্নে redirect করতে হবে

#### ২. fetchCoursesFromDB() ফাংশন
```typescript
async function fetchCoursesFromDB(): Promise<string>
```
**কী:** তোমার backend থেকে `/courses` endpoint hit করে real data আনে।

**কেন:** System Prompt-এ hardcoded data দিলে তুমি course update করলে AI জানবে না।
এই ফাংশন প্রতিটা request-এ (৫ মিনিট cache সহ) fresh data আনে।

**কীভাবে কাজ করে:**
```
1. process.env.NEXT_PUBLIC_API_BASE_URL থেকে backend URL নেয়
2. GET /courses call করে
3. প্রতিটা course-এর name, category, duration, price format করে
4. একটা text string বানায়:
   "AutoCAD Basic | Category: CAD | Duration: 3 months | Price: ৳8000"
5. এই text টা AI-এর system prompt-এ যোগ করে
```

**Cache কেন:** প্রতি request-এ DB call করলে slow হবে।
`next: { revalidate: 300 }` মানে ৫ মিনিটে একবার DB hit করবে।

#### ৩. POST handler
```typescript
export async function POST(req: NextRequest)
```
**কী:** Browser থেকে আসা request handle করে।

**ধাপে ধাপে:**
```
Step 1: Request থেকে messages array বের করে
Step 2: .env থেকে OPENROUTER_API_KEY চেক করে
Step 3: fetchCoursesFromDB() call করে live data আনে
Step 4: BASE_SYSTEM + liveData = final system prompt বানায়
Step 5: OpenRouter API-তে সব কিছু পাঠায়
Step 6: AI-এর reply browser-এ return করে
```

**Security:** API key এখানে থাকে — browser-এ কখনো যায় না।
User যদি Network tab দেখে, শুধু `/api/chat` দেখবে, OpenRouter key দেখবে না।

---

## ফাইল ২: `src/components/UI/ChatBot/ChatBot.tsx`
**ধরন:** React Client Component (`"use client"`)
**কাজ:** User যা দেখে এবং interact করে — পুরো UI

### এই ফাইলে কী আছে?

#### ১. Message Interface
```typescript
interface Message {
  role: "user" | "assistant";
  content: string;
}
```
**কী:** প্রতিটা message-এর structure।
- `role: "user"` → তুমি যা লিখেছ (নীল bubble)
- `role: "assistant"` → AI যা বলেছে (সাদা bubble)

#### ২. State Variables (React useState)
```typescript
const [isOpen, setIsOpen] = useState(false);      // chat window খোলা/বন্ধ
const [messages, setMessages] = useState([...]);   // সব messages এর list
const [input, setInput] = useState("");             // input box-এ যা টাইপ করছ
const [isLoading, setIsLoading] = useState(false); // AI reply আসছে কিনা
```
**কেন useState:** এগুলো বদলালে React automatically UI update করে।
তুমি টাইপ করলে `input` বদলায় → input box-এ দেখায়।

#### ৩. messagesEndRef (useRef)
```typescript
const messagesEndRef = useRef<HTMLDivElement>(null);
```
**কী:** একটা invisible div যা message list-এর একদম শেষে আছে।
**কেন:** নতুন message আসলে `scrollIntoView()` call করে automatically নিচে scroll করে।

#### ৪. handleToggle ফাংশন
```typescript
const handleToggle = () => {
  setIsOpen((prev) => !prev);
}
```
**কী:** 💬 button click করলে chat window খোলে বা বন্ধ করে।
`isOpen: false → true` হলে window দেখা যায়।
`isOpen: true → false` হলে window লুকিয়ে যায়।

#### ৫. sendMessage ফাংশন (সবচেয়ে গুরুত্বপূর্ণ)
```typescript
const sendMessage = async (text?: string) => { ... }
```
**কী করে ধাপে ধাপে:**
```
1. Input থেকে text নেয়, empty হলে কিছু করে না
2. User message টা messages array-তে যোগ করে (UI-তে দেখায়)
3. Input box clear করে
4. isLoading = true করে ("টাইপ করছে..." দেখায়)
5. POST /api/chat call করে messages পাঠায়
6. AI-এর reply আসলে messages array-তে যোগ করে
7. isLoading = false করে
```

#### ৬. UI Structure
```
<div fixed bottom-right>              ← পুরো component, screen-এ fixed
  {isOpen && (
    <div chat-window>                 ← শুধু isOpen=true হলে দেখায়
      <div header>                    ← নীল header
      <div messages-list>             ← সব message bubbles
        {messages.map(...)}           ← প্রতিটা message render করে
        {isLoading && "টাইপ করছে..."} ← loading indicator
      </div>
      <div input-area>               ← নিচের input + button
    </div>
  )}
  <button onClick={handleToggle}>    ← 💬 floating button
</div>
```

---

## ফাইল ৩: `src/app/layout.tsx`
**কাজ:** `<ChatBot />` সব page-এ add করে

```tsx
<body>
  <Providers>{children}</Providers>
  <ChatBot />    ← এখানে আছে, তাই সব page-এ দেখায়
</body>
```

**কেন layout.tsx-এ:** Next.js-এ layout.tsx সব page-এর wrapper।
একবার এখানে রাখলে Home, About, Courses — সব page-এ automatically আসে।

---

## ফাইল ৪: `.env`
**কাজ:** Secret key এবং URL গুলো রাখে

```env
NEXT_PUBLIC_API_BASE_URL=https://caddcoreapi-ten.vercel.app/api
OPENROUTER_API_KEY=sk-or-v1-xxxxx
```

**NEXT_PUBLIC_ prefix কেন:** এই prefix দিলে browser-এও accessible।
**OPENROUTER_API_KEY-এ prefix নেই কেন:** এটা শুধু server-এ থাকবে, browser-এ যাবে না।

---

## পুরো flow একটা উদাহরণ দিয়ে

**User লিখল:** "AutoCAD course কত টাকা?"

```
1. ChatBot.tsx:
   - input = "AutoCAD course কত টাকা?"
   - Enter press → sendMessage() call হয়
   - messages = [welcome, {role:"user", content:"AutoCAD course কত টাকা?"}]
   - UI-তে নীল bubble দেখায়
   - isLoading = true → "টাইপ করছে..." দেখায়
   - POST /api/chat পাঠায়:
     { messages: [{role:"user", content:"AutoCAD course কত টাকা?"}] }

2. route.ts (server-এ চলে):
   - messages array receive করে
   - fetchCoursesFromDB() → localhost:5000/api/courses hit করে
   - Database থেকে পায়:
     "AutoCAD Basic | Duration: 3 months | Price: ৳8000"
     "AutoCAD Advanced | Duration: 2 months | Price: ৳6000"
   - System Prompt = BASE_SYSTEM + এই course data
   - OpenRouter API call:
     {
       model: "google/gemma-4-31b-it:free",
       messages: [
         { role: "system", content: "তুমি CADD CORE assistant... [course data]" },
         { role: "user",   content: "AutoCAD course কত টাকা?" }
       ]
     }
   - AI বলে: "AutoCAD Basic কোর্স ৳৮০০০ এবং Advanced কোর্স ৳৬০০০"
   - { reply: "AutoCAD Basic কোর্স ৳৮০০০..." } return করে

3. ChatBot.tsx:
   - reply পায়
   - messages array-তে {role:"assistant", content:"..."} যোগ করে
   - isLoading = false
   - সাদা bubble-এ AI-এর উত্তর দেখায়
   - নিচে auto-scroll করে
```

---

## AI কেন Accurate উত্তর দেয়?

AI নিজে CADD CORE সম্পর্কে জানে না। সে জানে কারণ:

```
System Prompt = CADD CORE সম্পর্কে নির্দেশনা + Database-এর real data
```

AI এই text পড়ে প্রশ্নের সাথে মিলিয়ে উত্তর বানায়।
Database update হলে → ৫ মিনিটে AI-ও updated তথ্য পাবে।

---

## ভবিষ্যতে যা করা যাবে

| Feature | কীভাবে |
|---------|---------|
| Course schedule যোগ করা | `fetchCoursesFromDB()` তে `/course-schedule` ও fetch করো |
| Chat history save করা | MongoDB-তে conversation store করো |
| Typing animation | isLoading-এ animated dots দেখাও |
| Multiple language button | Bengali/English toggle button UI-তে |
| WhatsApp redirect | AI উত্তরের সাথে "WhatsApp-এ যোগাযোগ করুন" button |

---

## Quick Reference — কোথায় কী পরিবর্তন করবে

| যা বদলাতে চাও | কোন ফাইল | কোথায় |
|--------------|----------|--------|
| AI-এর personality/tone | `route.ts` | `BASE_SYSTEM` variable |
| CADD CORE-এর static info | `route.ts` | `BASE_SYSTEM` variable |
| AI model পরিবর্তন | `route.ts` | `model: "..."` line |
| UI colors/design | `ChatBot.tsx` | style={{ }} objects |
| Welcome message | `ChatBot.tsx` | `WELCOME` constant |
| API key | `.env` | `OPENROUTER_API_KEY=` |
| Cache time | `route.ts` | `revalidate: 300` (seconds) |
