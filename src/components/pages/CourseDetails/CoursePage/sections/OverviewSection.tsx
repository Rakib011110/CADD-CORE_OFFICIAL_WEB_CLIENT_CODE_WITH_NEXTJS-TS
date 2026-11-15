"use client";

import { useState } from "react";
import { Award, BadgeCheck, Briefcase, CalendarClock, FileBadge, FolderKanban, GraduationCap, Headphones, MonitorPlay } from "lucide-react";
import { TCourse } from "@/lib/courses";
import CourseSection from "./CourseSection";
import { AutoGrid, CARD_STATIC, ICON_TILE } from "./ui";
import { toEmbedUrl } from "../courseUtils";

const INCLUDE_ITEMS = [
  { key: "duration", label: "সময়কাল", icon: CalendarClock },
  { key: "liveSessions", label: "লাইভ সেশন", icon: MonitorPlay },
  { key: "projects", label: "প্রজেক্ট", icon: FolderKanban },
  { key: "certificate", label: "সার্টিফিকেট", icon: Award },
  { key: "onJobTraining", label: "অন-জব ট্রেইনিং", icon: Briefcase },
  { key: "internship", label: "ইন্টার্নশিপ", icon: GraduationCap },
  { key: "experienceLetter", label: "এক্সপেরিয়েন্স লেটার", icon: FileBadge },
  { key: "liveSupport", label: "লাইভ সাপোর্ট", icon: Headphones },
] as const;

export default function OverviewSection({ course }: { course: TCourse }) {
  const [expanded, setExpanded] = useState(false);
  const description = course.overview?.overviewDescription?.trim();
  const videoUrl = toEmbedUrl(course.overview?.videoUrl);
  const fixed = INCLUDE_ITEMS.map((item) => ({
    key: item.key as string,
    label: item.label as string,
    icon: item.icon,
    value: (course.courseIncludes as Record<string, string | undefined> | undefined)?.[item.key]?.trim(),
  }));
  // Extra tiles added from the dashboard (label + value)
  const extra = (course.courseIncludes?.extra || []).map((e, i) => ({
    key: `extra-${i}`,
    label: e.label?.trim() || "",
    icon: BadgeCheck,
    value: e.value?.trim(),
  }));
  const includes = [...fixed, ...extra].filter((i) => i.value);
  if (!description && !videoUrl && !includes.length) return null;

  const isLong = (description?.length || 0) > 420;

  return (
    <CourseSection id="overview" title="মাস্টারকোর্স ওভারভিউ">
      {description || videoUrl ? (
        // Text on the left, video on the right; both cards share the row height
        <div className={`grid items-stretch gap-5 ${description && videoUrl ? "xl:grid-cols-2" : ""}`}>
          {description ? (
            <div className={`${CARD_STATIC} flex flex-col p-6`}>
              <div className={`relative ${!expanded && isLong ? "max-h-[15.5rem] overflow-hidden" : ""}`}>
                <p className="whitespace-pre-line leading-[1.85] text-zinc-700">{description}</p>
                {!expanded && isLong ? (
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" />
                ) : null}
              </div>
              {isLong ? (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="mt-auto self-start pt-3 text-sm font-semibold text-red-600 hover:text-red-700">
                  {expanded ? "সংক্ষেপে দেখুন" : "আরও পড়ুন"}
                </button>
              ) : null}
            </div>
          ) : null}
          {videoUrl ? (
            <div className={`${CARD_STATIC} flex items-center overflow-hidden bg-zinc-950 p-0`}>
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src={videoUrl}
                  title={`${course.title} – পরিচিতি ভিডিও`}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      {includes.length ? (
        <div className="mt-5">
          <AutoGrid sm={2} xl={3} gap="0.75rem">
            {includes.map(({ key, label, icon: Icon, value }) => (
              <div key={key} className={`${CARD_STATIC} flex items-center gap-3 p-4`}>
                <span className={`${ICON_TILE} h-11 w-11`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs text-zinc-500">{label}</span>
                  <span className="block font-semibold leading-snug text-zinc-900">{value}</span>
                </span>
              </div>
            ))}
          </AutoGrid>
        </div>
      ) : null}
    </CourseSection>
  );
}
