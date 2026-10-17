"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, Play } from "lucide-react";
import { TCourse } from "@/lib/courses";
import CourseSection from "./CourseSection";
import { AutoGrid, CARD } from "./ui";
import { toEmbedUrl, youTubeId } from "../courseUtils";

// Videos load only when clicked, so the page stays fast.
export function FreeSessionsSection({ course }: { course: TCourse }) {
  const sessions = (course.freeTrainingSessions || []).filter((s) => s?.videoUrl);
  const [playing, setPlaying] = useState<Set<number>>(new Set());
  if (!sessions.length) return null;

  return (
    <CourseSection id="free-sessions" title="ফ্রি ট্রেনিং সেশন" subtitle="ভর্তির আগে আমাদের ক্লাস কেমন, দেখে নিন">
      <AutoGrid sm={2} xl={3}>
        {sessions.map((s, i) => {
          const id = youTubeId(s.videoUrl);
          return (
            <figure key={s.videoUrl + i} className={`${CARD} flex flex-col overflow-hidden`}>
              <div className="relative aspect-video bg-zinc-900">
                {playing.has(i) || !id ? (
                  <iframe
                    className="h-full w-full"
                    src={`${toEmbedUrl(s.videoUrl)}?rel=0&modestbranding=1&autoplay=1`}
                    title={s.title || `ফ্রি সেশন ${i + 1}`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setPlaying((p) => new Set(p).add(i))}
                    className="group absolute inset-0"
                    aria-label={`ভিডিও চালান: ${s.title || ""}`}>
                    <Image
                      src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 92vw"
                      className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
                    />
                    <span className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-600 text-white shadow-lg ring-4 ring-white/30 transition-transform group-hover:scale-105">
                      <Play className="ml-0.5 h-6 w-6 fill-current" />
                    </span>
                  </button>
                )}
              </div>
              <figcaption className="flex-1 p-4 text-sm font-semibold leading-snug text-zinc-900">
                {s.title || `ফ্রি সেশন ${i + 1}`}
              </figcaption>
            </figure>
          );
        })}
      </AutoGrid>
    </CourseSection>
  );
}

export function FaqSection({ course }: { course: TCourse }) {
  const faqs = (course.faqs || []).filter((f) => f?.question && f?.answer);
  const [open, setOpen] = useState<number | null>(0);
  if (!faqs.length) return null;

  return (
    <CourseSection id="faq" title="সচরাচর জিজ্ঞাসিত প্রশ্ন">
      <div className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {faqs.map((f, i) => (
          <div key={f.question}>
            <button
              type="button"
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-3 bg-white px-4 py-3.5 text-left font-medium text-zinc-900 hover:bg-zinc-50">
              {f.question}
              <ChevronDown className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform ${open === i ? "rotate-180" : ""}`} />
            </button>
            {open === i ? (
              <p className="whitespace-pre-line bg-zinc-50/70 px-4 pb-4 pt-1 text-sm leading-relaxed text-zinc-600">{f.answer}</p>
            ) : null}
          </div>
        ))}
      </div>
    </CourseSection>
  );
}
