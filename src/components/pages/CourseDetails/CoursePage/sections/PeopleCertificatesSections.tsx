import Image from "next/image";
import { Award, Maximize2 } from "lucide-react";
import { TCourse } from "@/lib/courses";
import CourseSection from "./CourseSection";
import { AutoGrid, CARD, SubHeading } from "./ui";

type Person = { name: string; subtitle?: string; photoUrl?: string };

// Compact profile card: soft band, round photo, name and role.
// Long advisor titles are cut to three lines; the full text shows on hover.
function PersonCard({ p }: { p: Person }) {
  return (
    <div className={`${CARD} group relative flex flex-col items-center overflow-hidden px-3 pb-5 pt-5 text-center sm:px-4`}>
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[4.5rem] bg-gradient-to-br from-rose-100 via-rose-50 to-red-100 transition-colors duration-300 group-hover:from-red-100 group-hover:to-rose-200"
      />
      <span className="relative block rounded-full bg-white p-1 shadow-[0_8px_20px_-8px_rgba(0,0,0,0.35)]">
        {p.photoUrl ? (
          <Image
            src={p.photoUrl}
            alt={p.name}
            width={112}
            height={112}
            className="h-20 w-20 rounded-full bg-zinc-100 object-cover object-top transition duration-300 group-hover:scale-105 sm:h-24 sm:w-24"
          />
        ) : (
          <span className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-3xl font-bold text-red-600 sm:h-24 sm:w-24">
            {p.name.charAt(0)}
          </span>
        )}
      </span>
      <span className="relative mt-3 text-sm font-bold leading-snug text-zinc-900 sm:text-base">{p.name}</span>
      <span className="relative mt-2 h-0.5 w-6 rounded-full bg-red-600 transition-all duration-300 group-hover:w-10" />
      {p.subtitle ? (
        <span title={p.subtitle} className="relative mt-2 line-clamp-3 text-xs leading-relaxed text-zinc-500">
          {p.subtitle}
        </span>
      ) : null}
    </div>
  );
}

export function InstructorsSection({ course }: { course: TCourse }) {
  const teachers: Person[] = (course.expertPanel?.teachers || [])
    .filter((t) => t?.name)
    .map((t) => ({ name: t.name, subtitle: t.role, photoUrl: t.photoUrl }));
  const advisors: Person[] = (course.expertPanel?.advisors || [])
    .filter((a) => a?.name)
    .map((a) => ({ name: a.name, subtitle: a.title, photoUrl: a.photoUrl }));
  if (!teachers.length && !advisors.length) return null;

  return (
    <CourseSection id="instructors" title="এক্সপার্ট প্যানেল" subtitle="ইন্ডাস্ট্রিতে কাজ করা প্রকৌশলীরাই আপনাকে শেখাবেন">
      <div className="space-y-8">
        {teachers.length ? (
          <div>
            <SubHeading>ইন্সট্রাক্টর</SubHeading>
            <AutoGrid xs={2} sm={2} xl={4} gap="0.875rem">
              {teachers.map((p) => (
                <PersonCard key={p.name} p={p} />
              ))}
            </AutoGrid>
          </div>
        ) : null}
        {advisors.length ? (
          <div>
            <SubHeading>এক্সপেরিয়েন্সড অ্যাডভাইজার</SubHeading>
            <AutoGrid xs={2} sm={2} xl={4} gap="0.875rem">
              {advisors.map((p) => (
                <PersonCard key={p.name} p={p} />
              ))}
            </AutoGrid>
          </div>
        ) : null}
      </div>
    </CourseSection>
  );
}

type Cert = { title: string; photoUrl: string; overview?: string; kind: "own" | "international" };

const CERT_BADGE: Record<Cert["kind"], { label: string; className: string }> = {
  own: { label: "CADD CORE", className: "bg-red-600 text-white" },
  international: { label: "আন্তর্জাতিক", className: "bg-zinc-900 text-white" },
};

// Certificate preview in an A4-landscape frame, so every card lines up
function CertPreview({ c, sizes }: { c: Cert; sizes: string }) {
  return (
    <div className="relative aspect-[1.414/1] w-full overflow-hidden bg-[radial-gradient(120%_120%_at_50%_0%,#ffffff_0%,#f4f4f5_100%)]">
      <Image
        src={c.photoUrl}
        alt={c.title}
        fill
        sizes={sizes}
        className="object-contain p-4 drop-shadow-[0_8px_16px_rgba(0,0,0,0.12)] transition duration-300 group-hover:scale-[1.03]"
      />
      <span className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold shadow-sm ${CERT_BADGE[c.kind].className}`}>
        {CERT_BADGE[c.kind].label}
      </span>
      <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-zinc-600 opacity-0 shadow transition group-hover:opacity-100">
        <Maximize2 className="h-4 w-4" />
      </span>
    </div>
  );
}

function CertCaption({ c }: { c: Cert }) {
  return (
    <span className="flex items-start gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
        <Award className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block font-semibold leading-snug text-zinc-900">{c.title}</span>
        {c.overview ? <span className="mt-1 line-clamp-3 block text-sm leading-relaxed text-zinc-500">{c.overview}</span> : null}
      </span>
    </span>
  );
}

export function CertificatesSection({ course }: { course: TCourse }) {
  const certs: Cert[] = [
    ...(course.demoCertificate || [])
      .filter((c) => c?.photoUrl?.trim())
      .map((c) => ({ title: c.title?.trim() || "কোর্স কমপ্লিশন সার্টিফিকেট", photoUrl: c.photoUrl.trim(), kind: "own" as const })),
    ...(course.InternationaldemoCertificate || [])
      .filter((c) => c?.photoUrl?.trim())
      .map((c) => ({
        title: c.certificateTitle?.trim() || "আন্তর্জাতিক সার্টিফিকেট",
        photoUrl: c.photoUrl.trim(),
        overview: c.certificateOverview,
        kind: "international" as const,
      })),
  ];
  if (!certs.length) return null;

  return (
    <CourseSection
      id="certificates"
      title="সার্টিফিকেট"
      subtitle={
        certs.some((c) => c.kind === "international")
          ? "কোর্স সম্পন্ন করার পর আমাদের নিজস্ব সার্টিফিকেটের পাশাপাশি পাবেন আন্তর্জাতিক সার্টিফিকেট। বড় করে দেখতে ছবিতে ক্লিক করুন।"
          : "কোর্স সম্পন্ন করার পর যে সার্টিফিকেট পাবেন। বড় করে দেখতে ছবিতে ক্লিক করুন।"
      }>
      {certs.length === 1 ? (
        // One certificate: a wide side-by-side card instead of a stretched empty one
        <a
          href={certs[0].photoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`${CARD} group grid overflow-hidden md:grid-cols-[1.4fr_1fr]`}>
          <CertPreview c={certs[0]} sizes="(min-width: 768px) 480px, 92vw" />
          <span className="flex flex-col justify-center gap-4 border-t border-zinc-100 p-6 md:border-l md:border-t-0">
            <CertCaption c={certs[0]} />
            <span className="text-sm font-semibold text-red-600">বড় করে দেখুন →</span>
          </span>
        </a>
      ) : (
        <AutoGrid sm={2} xl={3}>
          {certs.map((c, i) => (
            <a
              key={c.photoUrl + i}
              href={c.photoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${CARD} group flex flex-col overflow-hidden`}>
              <CertPreview c={c} sizes="(min-width: 1280px) 300px, (min-width: 640px) 45vw, 92vw" />
              <span className="flex-1 border-t border-zinc-100 p-4">
                <CertCaption c={c} />
              </span>
            </a>
          ))}
        </AutoGrid>
      )}
    </CourseSection>
  );
}
