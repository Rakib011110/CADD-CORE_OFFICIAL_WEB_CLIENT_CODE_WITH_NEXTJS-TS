"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { TCourse } from "@/lib/courses";
import CourseSection from "./CourseSection";
import { toBn } from "../courseUtils";

export default function CurriculumSection({ course }: { course: TCourse }) {
  const topics = (course.topicsCovered || []).filter((t) => t?.topicTitle);
  const [open, setOpen] = useState<Set<number>>(() => new Set([0]));
  if (!topics.length) return null;

  const allOpen = open.size === topics.length;
  const toggle = (i: number) =>
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });

  const meta = [course.duration, course.lessons].filter(Boolean).join(" · ");

  return (
    <CourseSection
      id="curriculum"
      title="এই কোর্সে যা যা থাকবে"
      subtitle={meta ? `${toBn(topics.length)}টি মডিউল · ${meta}` : `${toBn(topics.length)}টি মডিউল`}
      aside={
        <button
          type="button"
          onClick={() => setOpen(allOpen ? new Set() : new Set(topics.map((_, i) => i)))}
          className="font-medium text-red-600 hover:text-red-700">
          {allOpen ? "সব বন্ধ করুন" : "সব খুলুন"}
        </button>
      }>
      <div className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
        {topics.map((topic, i) => {
          const isOpen = open.has(i);
          return (
            <div key={topic._id || i}>
              <button
                type="button"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-3 bg-white px-4 py-3.5 text-left transition-colors hover:bg-zinc-50">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-semibold text-zinc-600">
                  {toBn(i + 1)}
                </span>
                <span className="min-w-0 flex-1 font-semibold text-zinc-900">{topic.topicTitle}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isOpen && topic.topicDescription ? (
                <div className="bg-zinc-50/70 px-4 pb-4 pl-14 pt-1">
                  <p className="whitespace-pre-line text-sm leading-relaxed text-zinc-600">{topic.topicDescription}</p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </CourseSection>
  );
}
