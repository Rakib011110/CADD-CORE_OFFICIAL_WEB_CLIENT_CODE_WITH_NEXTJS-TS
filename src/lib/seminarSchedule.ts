import { TSeminar } from "./types/TSeminars";

// Seminar dates and times are Bangladesh time (UTC+6, no daylight saving).
// The API calculates the next session the same way; this copy powers the
// dashboard preview while a seminar is being edited.
const BD_OFFSET_MS = 6 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;
const TIME_ZONE = "Asia/Dhaka";

export const DEFAULT_SEMINAR_URL =
  "https://docs.google.com/forms/d/e/1FAIpQLScZysZu-d44Md-KbsIPXOX-wuoobxWbcBaXN04ITkgWYNR6Fw/viewform";

export const seminarInstant = (date: string, time: string) => new Date(`${date}T${(time || "00:00").slice(0, 5)}:00+06:00`);
const bdDate = (d: Date) => new Date(d.getTime() + BD_OFFSET_MS).toISOString().slice(0, 10);

type ScheduleInput = Pick<TSeminar, "date" | "time" | "durationMinutes" | "repeat" | "repeatEveryWeeks" | "repeatUntil" | "skipDates">;

/** The next `count` sessions that have not ended yet (or the single session of a one-time seminar). */
export function upcomingSessions(s: ScheduleInput, count = 4, now = new Date()): Date[] {
  const first = seminarInstant(s.date, s.time);
  if (!s.date || isNaN(first.getTime())) return [];
  const durationMs = (s.durationMinutes || 90) * 60 * 1000;
  if (s.repeat !== "weekly") return now.getTime() < first.getTime() + durationMs ? [first] : [];

  const stepMs = Math.max(1, s.repeatEveryWeeks || 1) * 7 * DAY_MS;
  const skip = new Set(s.skipDates || []);
  const passed = now.getTime() - first.getTime() - durationMs;
  const sessions: Date[] = [];
  for (let n = passed < 0 ? 0 : Math.floor(passed / stepMs) + 1; sessions.length < count && n < 1000; n++) {
    const start = new Date(first.getTime() + n * stepMs);
    if (s.repeatUntil && bdDate(start) > s.repeatUntil) break;
    if (!skip.has(bdDate(start))) sessions.push(start);
  }
  return sessions;
}

/**
 * Seminars to show on the website, soonest first. Uses the API's next session and falls back
 * to calculating it here when the API doesn't send it yet (server not updated).
 */
export function visibleSeminars(seminars: TSeminar[], now = new Date()): TSeminar[] {
  return seminars
    .map((s) => {
      if (s.nextStartsAt) return s;
      const [start] = upcomingSessions(s, 1, now);
      if (!start) return s;
      const end = new Date(start.getTime() + (s.durationMinutes || 90) * 60 * 1000);
      return { ...s, nextTime: s.time, nextStartsAt: start.toISOString(), nextEndsAt: end.toISOString() };
    })
    .filter((s) => s.isActive !== false && s.status !== "ended" && s.nextStartsAt)
    .sort((a, b) => a.nextStartsAt!.localeCompare(b.nextStartsAt!));
}

// "রাত ৯:০০"
export const seminarTimeBn = (time: string) => {
  const [h = 0, m = 0] = time.split(":").map(Number);
  const period = h < 4 ? "রাত" : h < 6 ? "ভোর" : h < 12 ? "সকাল" : h < 15 ? "দুপুর" : h < 18 ? "বিকাল" : h < 20 ? "সন্ধ্যা" : "রাত";
  const hour12 = h % 12 || 12;
  return `${period} ${hour12.toLocaleString("bn-BD")}:${m.toLocaleString("bn-BD", { minimumIntegerDigits: 2 })}`;
};

// "Fri, 17 Oct 2026, 9:00 PM" for the dashboard
export const seminarDateEn = (d: Date) =>
  d.toLocaleString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: TIME_ZONE,
  });
