import { NextRequest, NextResponse } from "next/server";

// Priority order: largest/best multilingual models first, smaller fallbacks last
const FREE_MODELS = [
  "meta-llama/llama-3.3-70b-instruct:free",        // Meta Llama 70B — best multilingual
  "openai/gpt-oss-120b:free",                       // OpenAI OSS 120B — very capable
  "google/gemma-4-31b-it:free",                     // Google Gemma 4 31B
  "google/gemma-4-26b-a4b-it:free",                 // Google Gemma 4 26B
  "qwen/qwen3-next-80b-a3b-instruct:free",          // Qwen3 80B — good for Bengali
  "qwen/qwen3-coder:free",                          // Qwen3 Coder
  "nousresearch/hermes-3-llama-3.1-405b:free",      // Hermes 405B — massive model
  "nvidia/nemotron-3-ultra-550b-a55b:free",         // NVIDIA 550B — largest
  "nvidia/nemotron-3-super-120b-a12b:free",         // NVIDIA 120B
  "cognitivecomputations/dolphin-mistral-24b-venice-edition:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free",
  "nvidia/nemotron-nano-9b-v2:free",
  "meta-llama/llama-3.2-3b-instruct:free",          // Llama 3.2 3B — small fallback
  "openai/gpt-oss-20b:free",                        // OpenAI OSS 20B
  "nex-agi/nex-n2-pro:free",
  "poolside/laguna-m.1:free",
  "poolside/laguna-xs.2:free",
  "liquid/lfm-2.5-1.2b-instruct:free",             // Tiny fallback
  "liquid/lfm-2.5-1.2b-thinking:free",             // Last resort
];

const BASE_SYSTEM = `You are a helpful AI assistant for CADD CORE Training Institute, Bangladesh's leading professional training institute.

About CADD CORE:
- Established in 2014, Autodesk Certified and BTEB-authorized training center
- Location: 149/A, Baitush Sharaf Complex (5th Floor), Airport Road, Farmgate, Dhaka-1215
- Phone: +880 1611-223631
- Website: caddcore.net
- Trained 6,000+ students and professionals
- Working hours: Saturday to Friday, 9:00 AM - 7:00 PM
- Facebook: facebook.com/caddcorebd

IMPORTANT INSTRUCTIONS:
- Answer in the SAME language the user writes in (Bengali → Bengali, English → English)
- Be friendly, concise, and professional
- For enrollment or payment, always suggest calling +880 1611-223631
- Only answer about CADD CORE topics; politely redirect off-topic questions

FORMATTING (responses render as Markdown):
- Use **bold** for key terms, course names, prices, and phone numbers
- Use bullet lists (- ) for multiple items or steps
- Use tables only when comparing 2-4 items; keep columns short
- Keep answers focused — avoid very long replies; 3-6 short points is ideal`;

async function fetchCoursesFromDB(): Promise<string> {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://caddcoreapi-ten.vercel.app/api";
    const res = await fetch(`${apiUrl}/courses`, {
      next: { revalidate: 300 }, // cache 5 minutes
    });

    if (!res.ok) return "";

    const data = await res.json();
    const courses = Array.isArray(data) ? data : data?.data ?? [];

    if (!courses.length) return "";

    const courseList = courses
      .map((c: { title?: string; name?: string; duration?: string; price?: number; fee?: number; description?: string; category?: string }) => {
        const name = c.title || c.name || "Unknown";
        const duration = c.duration ? `Duration: ${c.duration}` : "";
        const price = c.price ?? c.fee;
        const priceText = price ? `Price: ৳${price}` : "";
        const desc = c.description ? `Info: ${c.description.slice(0, 100)}` : "";
        const category = c.category ? `Category: ${c.category}` : "";
        return [name, category, duration, priceText, desc].filter(Boolean).join(" | ");
      })
      .join("\n");

    return `\n\nLIVE COURSE DATA FROM DATABASE (use this for accurate answers):\n${courseList}`;
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

    // Fetch real course data from database
    const liveData = await fetchCoursesFromDB();
    const systemPrompt = BASE_SYSTEM + liveData;

    // Try each model in order until one succeeds
    let reply = "";
    let lastError = "";

    for (const model of FREE_MODELS) {
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
      });

      if (!response.ok) {
        const errorData = await response.json();
        lastError = errorData?.error?.message ?? "unknown error";
        console.warn(`Model ${model} failed (${response.status}): ${lastError}`);
        // 429 = rate limited, 404 = not available — try next model
        if (response.status === 429 || response.status === 404) continue;
        // Other errors (auth, bad request) — no point retrying
        break;
      }

      const data = await response.json();
      reply = data.choices?.[0]?.message?.content ?? "";
      if (reply) break;
    }

    if (!reply) {
      console.error("All models failed. Last error:", lastError);
      return NextResponse.json({ error: "AI service unavailable" }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
