import { ReactNode } from "react";

// Shared frame for every section on the course page: same heading and spacing.
// Background bands alternate automatically (see .course-sections in globals.css).
export default function CourseSection({
  id,
  title,
  subtitle,
  aside,
  children,
}: {
  id: string;
  title: string;
  subtitle?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-6 py-14">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <span className="mb-3 block h-1 w-10 rounded-full bg-red-600" aria-hidden="true" />
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-[1.65rem]">{title}</h2>
          {subtitle ? <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-zinc-500">{subtitle}</p> : null}
        </div>
        {aside ? <div className="text-sm text-zinc-500">{aside}</div> : null}
      </div>
      {children}
    </section>
  );
}
