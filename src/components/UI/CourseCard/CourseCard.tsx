import React from "react";
import { Book, Clock, Plus, Settings } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { TCourse } from "@/lib/courses";

// One row of logos, the rest as "+N"
const MAX_SOFTWARE = 4;

// Compact card: image, two-line title, one meta line, one row of software
// and a details button. Every card lines up.
const CourseCard: React.FC<TCourse> = ({ title, duration, lessons, projects, photoUrl, slug, softwaresTaught }) => {
  const isRecorded = slug === "professional-electrical-design-mastercourse";
  const software = softwaresTaught || [];
  const extraSoftware = software.length - MAX_SOFTWARE;
  const stats = [
    { icon: Clock, value: duration },
    { icon: Book, value: lessons },
    { icon: Settings, value: projects },
  ].filter((s) => s.value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="group h-full">
      <Link
        href={`/courses/${slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1.5 hover:border-red-200 hover:shadow-[0_24px_48px_-24px_rgba(220,38,38,0.35)]">
        {/* Image with live badge */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-100">
          <Image
            src={photoUrl}
            alt={title}
            fill
            sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
          />
          <span
            className={`absolute right-3 top-3 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide text-white shadow-md ${
              isRecorded ? "bg-blue-600" : "bg-red-600"
            }`}>
            {!isRecorded ? (
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            ) : null}
            {isRecorded ? "RECORDED" : "LIVE"}
          </span>
        </div>

        {/* Soft warm tint that fades in from white */}
        <div className="flex flex-1 flex-col bg-gradient-to-b from-white via-white to-rose-50/70 p-4 transition-colors duration-300 group-hover:to-rose-50 sm:p-5">
          <h3
            title={title}
            className="line-clamp-2 min-h-[2.75rem] text-[1.05rem] font-bold leading-snug text-zinc-900 transition-colors group-hover:text-red-600">
            {title}
          </h3>

          {/* Duration, classes and projects on one line */}
          {stats.length ? (
            <p className="mt-2.5 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-sm text-zinc-600">
              {stats.map(({ icon: Icon, value }, i) => (
                <span key={i} className="flex items-center gap-1.5 whitespace-nowrap">
                  <Icon className="h-4 w-4 shrink-0 text-red-500" />
                  {value}
                </span>
              ))}
            </p>
          ) : null}

          {/* Software, always one row */}
          {software.length ? (
            <div className="mt-4 mb-4 flex items-center gap-1.5" aria-label="যে সফটওয়্যার শিখবেন">
              {software.slice(0, MAX_SOFTWARE).map((s, idx) => (
                <span
                  key={idx}
                  title={s.softwareTitle}
                  className="flex h-9 w-14 shrink-0 items-center justify-center rounded-lg bg-white p-1 ring-1 ring-zinc-200">
                  <Image src={s.photoUrl} alt={s.softwareTitle || ""} width={56} height={36} className="max-h-full w-auto object-contain" />
                </span>
              ))}
              {extraSoftware > 0 ? (
                <span
                  title={software
                    .slice(MAX_SOFTWARE)
                    .map((s) => s.softwareTitle)
                    .join(", ")}
                  className="flex h-9 shrink-0 items-center rounded-lg bg-zinc-100 px-2.5 text-xs font-semibold text-zinc-600">
                  +{extraSoftware.toLocaleString("bn-BD")}
                </span>
              ) : null}
            </div>
          ) : null}

          {/* Footer: details button */}
          <div className="mt-auto border-t border-rose-100/80 pt-4">
            <span className="flex items-center justify-between rounded-xl border border-red-200 bg-white py-1.5 pl-4 pr-1.5 text-sm font-semibold text-red-600 transition duration-300 group-hover:border-red-600 group-hover:bg-red-600 group-hover:text-white">
              বিস্তারিত দেখুন
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-50 transition duration-300 group-hover:rotate-90 group-hover:bg-white/20">
                <Plus className="h-4 w-4" />
              </span>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CourseCard;
