import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Shared look for home page sections: same width, spacing, heading style and
// alternating soft backgrounds.

export type SectionAction = { label: string; href: string; external?: boolean };

// Title on the left, optional "view all" style button on the right
export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
}: {
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: SectionAction;
}) {
  const actionClass =
    "group/action inline-flex shrink-0 items-center gap-2 self-start rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:border-red-600 hover:bg-red-600 hover:text-white sm:self-end";
  const actionContent = action ? (
    <>
      {action.label}
      <ArrowRight className="h-4 w-4 transition-transform group-hover/action:translate-x-0.5" />
    </>
  ) : null;

  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-red-600">
          <span className="h-0.5 w-6 rounded-full bg-red-600" />
          {eyebrow}
        </p>
        <h2 className="text-2xl font-bold leading-tight text-zinc-900 md:text-3xl">{title}</h2>
        {subtitle ? <p className="mt-2 leading-relaxed text-zinc-600">{subtitle}</p> : null}
      </div>
      {action ? (
        action.external ? (
          <a href={action.href} target="_blank" rel="noopener noreferrer" className={actionClass}>
            {actionContent}
          </a>
        ) : (
          <Link href={action.href} className={actionClass}>
            {actionContent}
          </Link>
        )
      ) : null}
    </div>
  );
}

export default function HomeSection({
  id,
  eyebrow,
  title,
  subtitle,
  action,
  tone = "white",
  children,
}: {
  id?: string;
  eyebrow: string;
  title: ReactNode;
  subtitle?: ReactNode;
  action?: SectionAction;
  // soft = a very light rose to grey wash
  tone?: "white" | "muted" | "soft";
  children: ReactNode;
}) {
  const background = {
    white: "bg-white",
    muted: "bg-zinc-50",
    soft: "bg-gradient-to-br from-rose-50/70 via-white to-zinc-50",
  }[tone];
  return (
    <section id={id} className={`${background} py-12 sm:py-14`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow={eyebrow} title={title} subtitle={subtitle} action={action} />
        {children}
      </div>
    </section>
  );
}

// Red highlight for part of a section title
export const Highlight = ({ children }: { children: ReactNode }) => <span className="text-red-600">{children}</span>;
