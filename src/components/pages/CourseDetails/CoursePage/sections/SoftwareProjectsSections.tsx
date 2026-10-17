import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { TCourse } from "@/lib/courses";
import CourseSection from "./CourseSection";
import { AutoGrid, CARD } from "./ui";
import { toBn } from "../courseUtils";

export function SoftwareSection({ course }: { course: TCourse }) {
  const items = (course.softwaresTaught || []).filter((s) => s?.softwareTitle);
  if (!items.length) return null;
  return (
    <CourseSection id="software" title="যে সকল সফটওয়্যার শেখানো হবে">
      <AutoGrid sm={2} xl={4} gap="0.75rem">
        {items.map((s) => (
          <div key={s.softwareTitle} className={`${CARD} flex flex-col items-center gap-3 p-5 text-center`}>
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-50 ring-1 ring-zinc-100">
              {s.photoUrl ? (
                <Image src={s.photoUrl} alt="" width={64} height={64} className="h-11 w-11 object-contain" />
              ) : (
                <span className="text-xl font-bold text-zinc-400">{s.softwareTitle.charAt(0)}</span>
              )}
            </span>
            <span className="text-sm font-semibold leading-snug text-zinc-800">{s.softwareTitle}</span>
          </div>
        ))}
      </AutoGrid>
    </CourseSection>
  );
}

export function ProjectsSection({ course }: { course: TCourse }) {
  const projects = (course.learningProject || []).filter((p) => p?.title || p?.photoUrl);
  if (!projects.length) return null;
  return (
    <CourseSection id="projects" title="যে সকল প্রজেক্ট নিয়ে কাজ করবেন">
      <AutoGrid sm={2} xl={3}>
        {projects.map((p, i) => (
          <a
            key={p.title || i}
            href={p.photoUrl || undefined}
            target="_blank"
            rel="noopener noreferrer"
            className={`${CARD} group flex flex-col overflow-hidden`}>
            <div className="relative h-56 overflow-hidden bg-zinc-100">
              {p.photoUrl ? (
                <Image
                  src={p.photoUrl}
                  alt={p.title || `প্রজেক্ট ${i + 1}`}
                  fill
                  sizes="(min-width: 1280px) 280px, (min-width: 640px) 45vw, 92vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.03]"
                />
              ) : null}
              <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-zinc-700 opacity-0 shadow transition group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </div>
            <div className="flex flex-1 flex-col gap-1 p-4">
              <span className="text-xs font-semibold text-red-600">প্রজেক্ট {toBn(i + 1)}</span>
              {p.title ? <span className="font-semibold leading-snug text-zinc-900">{p.title}</span> : null}
              {p.description ? <span className="line-clamp-2 text-sm text-zinc-500">{p.description}</span> : null}
            </div>
          </a>
        ))}
      </AutoGrid>
    </CourseSection>
  );
}
