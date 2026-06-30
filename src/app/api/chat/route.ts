import { NextRequest, NextResponse } from "next/server";

// Free models on OpenRouter (verified live via /api/v1/models).
// The handler tries them in order: if one is rate-limited (429), unavailable (404),
// or times out, it automatically falls through to the next one.
//
// Ordering strategy: capable, good-at-Bengali models that are LESS contended come
// first. The most popular free models (llama-3.3-70b, gpt-oss-120b) are almost always
// rate-limited on the free tier, so they sit lower — otherwise every request wastes a
// failed round-trip on them before falling through (this was the cause of 8–26s replies).
// Smaller models are last-resort fallbacks. Reasoning/thinking/code-only/vision/safety
// variants are intentionally excluded — they can emit junk or aren't chat-suited.
const FREE_MODELS = [
  "qwen/qwen3-next-80b-a3b-instruct:free",          // Qwen3 80B — strong Bengali/multilingual
  "google/gemma-4-31b-it:free",                     // Gemma 4 31B — good multilingual
  "google/gemma-4-26b-a4b-it:free",                 // Gemma 4 26B
  "nvidia/nemotron-3-super-120b-a12b:free",         // NVIDIA 120B
  "nousresearch/hermes-3-llama-3.1-405b:free",      // Hermes 405B
  "nvidia/nemotron-3-ultra-550b-a55b:free",         // NVIDIA 550B — largest
  "meta-llama/llama-3.3-70b-instruct:free",         // Llama 70B — excellent, but often rate-limited
  "openai/gpt-oss-120b:free",                       // GPT-OSS 120B — capable, but often rate-limited
  "qwen/qwen3-coder:free",                          // Qwen3 Coder (1M context)
  "cognitivecomputations/dolphin-mistral-24b-venice-edition:free", // Mistral 24B
  "nvidia/nemotron-3-nano-30b-a3b:free",            // NVIDIA Nano 30B
  "openai/gpt-oss-20b:free",                        // GPT-OSS 20B
  "nvidia/nemotron-nano-9b-v2:free",                // small fallback
  "meta-llama/llama-3.2-3b-instruct:free",          // Llama 3.2 3B — small fallback
  "liquid/lfm-2.5-1.2b-instruct:free",              // tiny last resort
];

// Per-model timeout (ms). If a model hangs, abort and fall through to the next one
// instead of leaving the user staring at a spinner.
const MODEL_TIMEOUT_MS = 20000;

const BASE_SYSTEM = `You are a helpful AI assistant for CADD CORE Training Institute, Bangladesh's leading professional training institute.

About CADD CORE:
- Established in 2014, Autodesk Certified and BTEB-authorized training center
- Location: 149/A, Baitush Sharaf Complex (5th Floor), Airport Road, Farmgate, Dhaka-1215
- Phone: +880 1611-223631
- Website: caddcore.net
- Trained 6,000+ students and professionals
- Working hours: Saturday to Friday, 9:00 AM - 7:00 PM
- Facebook: facebook.com/caddcorebd

SEMINARS / FREE SEMINARS:
- CADD CORE regularly holds free seminars. We do NOT keep a fixed public seminar date/time here.
- When a user asks about seminars (সেমিনার), joining a seminar, or the seminar schedule/time, give them this seminar registration form link: https://docs.google.com/forms/d/e/1FAIpQLScZysZu-d44Md-KbsIPXOX-wuoobxWbcBaXN04ITkgWYNR6Fw/viewform
- Tell them: fill up this form to register for the next seminar, and our team will contact you via SMS/email with the exact seminar date and time.
- Present the link as a clickable Markdown link, e.g. [সেমিনার রেজিস্ট্রেশন ফর্ম](the-link).

IMPORTANT INSTRUCTIONS:
- Answer in the SAME language the user writes in (Bengali → Bengali, English → English)
- Be friendly, concise, and professional
- For course fees, schedules, start dates, class times, and duration, ALWAYS answer using the "LIVE COURSE DATA FROM DATABASE" section below. This data is accurate and up to date.
- Match the course the user asks about to the closest title in the live data (titles may be in English while the user writes in Bengali). If a course exists in the data, give its fee/schedule/duration — do NOT say the information is unavailable.
- Only say information is unavailable if the course genuinely does not appear in the live data below.
- For payment plans / installments (কিস্তি): if a course in the live data lists its own "Payment plans", tell the user exactly those.
- If a course does NOT list its own payment plans, do NOT quote any fixed discount or "standard" plan, and do NOT mention a specific percentage. Instead say that installment options and current offers may vary for that course, and ask them to check the course page link or call +880 1611-223631 for the latest payment plans and offers.
- You may mention that installment (কিস্তি) facilities and seasonal offers are often available, but NEVER promise a specific discount percentage unless it is explicitly listed for that specific course.
- For enrollment or payment, always suggest calling +880 1611-223631
- Only answer about CADD CORE topics; politely redirect off-topic questions

FORMATTING (responses render as Markdown):
- Use **bold** for key terms, course names, prices, and phone numbers
- Use bullet lists (- ) for multiple items or steps
- Use tables only when comparing 2-4 items; keep columns short
- Keep answers focused — avoid very long replies; 3-6 short points is ideal`;

// Shape of a course as returned by the CADD CORE backend (/courses).
// Field names here MUST match the real API response — the chatbot can only
// tell users about data it actually receives in the system prompt.
interface PaymentPlan {
  name?: string;
  installments?: number;
  discountPercent?: number;
  isActive?: boolean;
}

interface DBCourse {
  title?: string;
  name?: string;
  slug?: string;
  courseType?: string;
  courseFee?: number;
  price?: number;
  fee?: number;
  duration?: string;
  categories?: string[];
  category?: string;
  schedule?: {
    startingDate?: string;
    days?: string;
    time?: string;
    mode?: string;
  };
  courseIncludes?: { duration?: string };
  overview?: { overviewDescription?: string };
  description?: string;
  paymentPlans?: PaymentPlan[];
}

const stripHtml = (s: string): string =>
  s.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

// Format a list of payment plans into a short readable string, e.g.
// "Full Payment (20% off), Pay in 2 Installments".
function formatPlans(plans: PaymentPlan[]): string {
  return plans
    .filter((p) => p.isActive !== false && p.name)
    .map((p) => {
      const discount = p.discountPercent && p.discountPercent > 0 ? ` (${p.discountPercent}% off)` : "";
      return `${p.name}${discount}`;
    })
    .join(", ");
}

async function fetchCoursesFromDB(): Promise<string> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://caddcoreapi-ten.vercel.app/api";
    const res = await fetch(`${apiUrl}/courses`, {
      next: { revalidate: 300 }, // cache 5 minutes
    });

    if (!res.ok) return "";

    const data = await res.json();
    const courses: DBCourse[] = Array.isArray(data) ? data : data?.data ?? [];

    if (!courses.length) return "";

    const courseList = courses
      .map((c) => {
        const name = c.title || c.name || "Unknown";

        const category = Array.isArray(c.categories)
          ? c.categories.join(", ")
          : c.category;
        const categoryText = category ? `Category: ${category}` : "";

        const typeText = c.courseType ? `Type: ${c.courseType}` : "";

        // Real fee field is `courseFee`; keep price/fee as fallbacks.
        const fee = c.courseFee ?? c.price ?? c.fee;
        const feeText = fee ? `Fee: ৳${fee}` : "";

        // Human-readable duration lives in courseIncludes.duration ("৩ মাস").
        const duration = (c.courseIncludes?.duration || c.duration || "").trim();
        const durationText = duration ? `Duration: ${duration}` : "";

        // Schedule (start date, class days, time, mode) — previously dropped entirely.
        const s: NonNullable<DBCourse["schedule"]> = c.schedule ?? {};
        const scheduleParts = [
          s.startingDate ? `starts ${s.startingDate}` : "",
          s.days,
          s.time,
          s.mode,
        ]
          .filter(Boolean)
          .join(", ");
        const scheduleText = scheduleParts ? `Schedule: ${scheduleParts}` : "";

        // Per-course payment plans override the standard plans when present.
        const coursePlans =
          Array.isArray(c.paymentPlans) && c.paymentPlans.length > 0
            ? formatPlans(c.paymentPlans)
            : "";
        const planText = coursePlans ? `Payment plans: ${coursePlans}` : "";

        const overview = c.overview?.overviewDescription || c.description || "";
        const infoText = overview ? `Info: ${stripHtml(overview).slice(0, 160)}` : "";

        const linkText = c.slug
          ? `Link: https://www.caddcore.net/courses/${c.slug}`
          : "";

        return [name, categoryText, typeText, feeText, durationText, scheduleText, planText, linkText, infoText]
          .filter(Boolean)
          .join(" | ");
      })
      .join("\n");

    return `\n\nLIVE COURSE DATA FROM DATABASE (use this for accurate answers about fees, schedules, durations, and course details. All prices are in Bangladeshi Taka ৳):\n${courseList}`;
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured" }, { status: 500 });
    }

    // Fetch real course data from database (includes any per-course payment plans)
    const liveData = await fetchCoursesFromDB();
    const systemPrompt = BASE_SYSTEM + liveData;

    // Try each model in order until one succeeds
    let reply = "";
    let lastError = "";

    for (const model of FREE_MODELS) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), MODEL_TIMEOUT_MS);

      try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://www.caddcore.net",
            "X-Title": "CADD CORE AI Assistant",
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: "system", content: systemPrompt },
              ...messages,
            ],
            max_tokens: 500,
            temperature: 0.7,
          }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          lastError = errorData?.error?.message ?? `HTTP ${response.status}`;
          console.warn(`Model ${model} failed (${response.status}): ${lastError}`);
          // Account-wide daily free-tier cap: EVERY free model shares this quota, so once
          // it's hit there is no point trying the remaining models — stop immediately.
          if (/per-day|free-models-per-day|daily/i.test(lastError)) break;
          // 429 = rate limited, 404 = not available, 5xx = provider issue — try next model.
          if (response.status === 429 || response.status === 404 || response.status >= 500) continue;
          // Other errors (auth, bad request) — no point retrying other models.
          break;
        }

        const data = await response.json();
        reply = data.choices?.[0]?.message?.content ?? "";
        if (reply) break;
      } catch (err) {
        // Timeout (abort) or network error — log and fall through to the next model.
        lastError = err instanceof Error ? err.message : "network error";
        console.warn(`Model ${model} errored: ${lastError}`);
        continue;
      } finally {
        clearTimeout(timer);
      }
    }

    if (!reply) {
      console.error("All models failed. Last error:", lastError);
      // Don't leave the user with a broken bot. Return a friendly, helpful message
      // (as a normal reply) that points them to the hotline so they're never stuck.
      const fallback =
        "এই মুহূর্তে আমাদের AI সহকারী একটু ব্যস্ত আছে 🙏\n\n" +
        "অনুগ্রহ করে একটু পরে আবার চেষ্টা করুন, অথবা সরাসরি আমাদের সাথে যোগাযোগ করুন:\n\n" +
        "**📞 +880 1611-223631**\n" +
        "(শনিবার – শুক্রবার, সকাল ৯টা – সন্ধ্যা ৭টা)";
      return NextResponse.json({ reply: fallback });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
