"use client";

import { useEffect, useState } from "react";
import Countdown from "@/components/UI/Countdown/Countdown";
import HomeSection, { Highlight } from "@/components/Home/HomeSection";
import { DEFAULT_SEMINAR_URL, seminarTimeBn, visibleSeminars } from "@/lib/seminarSchedule";
import { TSeminar } from "@/lib/types/TSeminars";
import { useGetAllSeminarQuery } from "@/redux/api/seminarApi";
import { ArrowRight, CalendarDays, Clock, MapPin, Repeat } from "lucide-react";

const TZ = "Asia/Dhaka";
const placeText = (place: string) => (/online|অনলাইন|zoom|meet/i.test(place) ? "অনলাইন" : place);
const repeatText = (s: TSeminar) => {
  if (s.repeat !== "weekly") return null;
  const every = s.repeatEveryWeeks || 1;
  return every === 1 ? "প্রতি সপ্তাহে" : `প্রতি ${every.toLocaleString("bn-BD")} সপ্তাহে`;
};

// Columns that fit the number of cards, so a row is never half empty
const gridCols = (n: number) =>
  n === 1 ? "mx-auto max-w-sm" : n === 2 ? "mx-auto max-w-3xl sm:grid-cols-2" : n === 3 ? "sm:grid-cols-2 lg:grid-cols-3" : "sm:grid-cols-2 xl:grid-cols-4";

function SeminarCard({ seminar, onEnd }: { seminar: TSeminar; onEnd: () => void }) {
  const start = new Date(seminar.nextStartsAt!);
  const repeat = repeatText(seminar);
  const date = (opts: Intl.DateTimeFormatOptions) => start.toLocaleDateString("bn-BD", { ...opts, timeZone: TZ });
  const chip = "inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-1 ring-1 ring-white/15";

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06),0_16px_40px_-24px_rgba(0,0,0,0.35)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_1px_3px_rgba(0,0,0,0.06),0_28px_50px_-24px_rgba(0,0,0,0.45)]">
      {/* Ticket top: what and when */}
      <div className="relative isolate flex flex-1 flex-col overflow-hidden bg-zinc-950 p-5 pb-7 text-white">
        <span aria-hidden="true" className="absolute -right-14 -top-16 -z-10 h-48 w-48 rounded-full bg-red-600/40 blur-3xl transition duration-500 group-hover:bg-red-600/60" />
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:22px_22px]"
        />

        <div className="flex items-center justify-between gap-2 text-[11px] font-semibold text-zinc-100">
          {repeat ? (
            <span className={chip}>
              <Repeat className="h-3 w-3" /> {repeat}
            </span>
          ) : (
            <span />
          )}
          <span className={chip}>
            <MapPin className="h-3 w-3" /> {placeText(seminar.place)}
          </span>
        </div>

        <h3 title={seminar.topic} className="mt-4 line-clamp-2 text-lg font-bold leading-[1.4] sm:h-[2.8em]">{seminar.topic}</h3>

        <div className="mt-auto flex items-end gap-3 pt-5">
          <span className="text-5xl font-bold leading-[0.85]">{date({ day: "numeric" })}</span>
          <span className="text-sm leading-snug">
            <span className="block font-semibold text-red-400">
              {date({ month: "long" })} · {date({ weekday: "long" })}
            </span>
            <span className="flex items-center gap-1.5 text-zinc-300">
              <Clock className="h-3.5 w-3.5" /> {seminarTimeBn(seminar.nextTime || seminar.time)}
            </span>
          </span>
        </div>
      </div>

      {/* Ticket bottom: countdown and action. The notches use the section's background colour. */}
      <div className="relative space-y-4 p-5">
        <span aria-hidden="true" className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-zinc-50" />
        <span aria-hidden="true" className="absolute -right-3 -top-3 h-6 w-6 rounded-full bg-zinc-50" />
        <span aria-hidden="true" className="absolute inset-x-6 top-0 border-t-2 border-dashed border-zinc-200" />
        <div className="pt-2">
          <Countdown startsAt={seminar.nextStartsAt!} endsAt={seminar.nextEndsAt} onEnd={onEnd} />
        </div>
        <a
          href={seminar.registrationUrl || DEFAULT_SEMINAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-3 font-semibold text-white transition hover:bg-red-700">
          যোগ দিন <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </a>
      </div>
    </article>
  );
}

export default function SeminarSchedule() {
  // The API returns each seminar's next session; weekly seminars move to the
  // following week automatically once a session is over.
  const { data, isLoading, refetch } = useGetAllSeminarQuery({ upcoming: true });

  // Re-check every 15s so the order stays current
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 15000);
    return () => clearInterval(id);
  }, []);

  const seminars = visibleSeminars(data?.data || [], new Date(now));

  return (
    <HomeSection
      id="seminar-time"
      tone="muted"
      eyebrow="আপকামিং সেমিনার"
      title={
        <>
          ফ্রি/পেইড সেমিনারের <Highlight>সময়সূচী</Highlight>
        </>
      }
      action={{ label: "রেজিস্ট্রেশন ফর্ম", href: DEFAULT_SEMINAR_URL, external: true }}
      subtitle="">
        {isLoading ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4" aria-busy="true">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-[22rem] animate-pulse rounded-2xl bg-zinc-100" />
            ))}
          </div>
        ) : seminars.length ? (
          <div className={`grid gap-5 ${gridCols(seminars.length)}`}>
            {seminars.map((s) => (
              <SeminarCard key={`${s._id}-${s.nextStartsAt}`} seminar={s} onEnd={refetch} />
            ))}
          </div>
        ) : (
          <div className="mx-auto flex max-w-xl flex-col items-center rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-10 text-center">
            <CalendarDays className="h-8 w-8 text-red-500" />
            <p className="mt-3 font-semibold text-zinc-900">পরবর্তী সেমিনারের তারিখ শীঘ্রই ঘোষণা করা হবে</p>
            <p className="mt-1 text-sm text-zinc-600">ফর্মটি পূরণ করে রাখুন, তারিখ ঠিক হলে আমরা আপনাকে জানিয়ে দেব।</p>
            <a
              href={DEFAULT_SEMINAR_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
              রেজিস্ট্রেশন করুন <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        )}
    </HomeSection>
  );
}
