import Link from "next/link";
import Image from "next/image";
import { BookOpen, Clock, FolderKanban, Award, ChevronRight } from "lucide-react";
import { TCourse } from "@/lib/courses";

// Wireframe cube in an isometric view (CAD feel). Faces are barely tinted so it
// reads as depth without competing with the text.
function IsoCube({ className = "", accent = false }: { className?: string; accent?: boolean }) {
  return (
    <svg viewBox="0 0 100 116" className={className} fill="none" aria-hidden="true">
      <polygon points="50,2 98,30 50,58 2,30" fill="rgba(255,255,255,0.06)" />
      <polygon points="2,30 50,58 50,114 2,86" fill="rgba(255,255,255,0.025)" />
      <polygon points="50,58 98,30 98,86 50,114" fill={accent ? "rgba(220,38,38,0.14)" : "rgba(255,255,255,0.04)"} />
      <path
        d="M50 2 98 30v56l-48 28L2 86V30L50 2Zm0 56L2 30m48 28 48-28M50 58v56"
        stroke="rgba(255,255,255,0.22)"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      {accent ? <path d="M50 58 98 30" stroke="rgba(248,113,113,0.8)" strokeWidth="1" /> : null}
    </svg>
  );
}

// Banner background, drawn full width behind the hero row: dark base with a
// perspective grid floor, soft glows and floating wireframe cubes. A dark wash
// on the text side keeps the copy fully readable.
function HeroBackground() {
  return (
    <>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-[100vw] -right-[100vw] -z-10 overflow-hidden bg-[linear-gradient(180deg,#0a0a0d_0%,#101014_55%,#170a0c_100%)]">
        {/* Glows */}
        <div className="absolute left-1/2 top-[-30%] h-[130%] w-[60vw] max-w-[900px] rounded-full bg-red-600/20 blur-[120px]" />
        <div className="absolute left-[15%] top-[-20%] h-[80%] w-[40vw] max-w-[600px] rounded-full bg-slate-500/10 blur-[110px]" />

        {/* Perspective grid floor receding to a horizon */}
        <div className="absolute inset-x-0 bottom-0 h-[62%] overflow-hidden [perspective:420px]">
          <div
            className="absolute inset-x-[-50%] bottom-0 h-[220%] origin-bottom [transform:rotateX(68deg)]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(248,113,113,0.22) 1px, transparent 1px), linear-gradient(90deg, rgba(248,113,113,0.22) 1px, transparent 1px)",
              backgroundSize: "64px 64px",
              maskImage: "linear-gradient(to top, black 0%, black 25%, transparent 75%)",
              WebkitMaskImage: "linear-gradient(to top, black 0%, black 25%, transparent 75%)",
            }}
          />
        </div>
        {/* Horizon line */}
        <div className="absolute inset-x-0 top-[38%] h-px bg-gradient-to-r from-transparent via-red-400/25 to-transparent" />

        {/* Fine grid at the top, fading out */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
            maskImage: "linear-gradient(to bottom, black, transparent 45%)",
            WebkitMaskImage: "linear-gradient(to bottom, black, transparent 45%)",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />
      </div>

      {/* Floating cubes, kept to the right of the text */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 -right-[40rem] left-[62%] -z-10 hidden lg:block">
        <IsoCube accent className="absolute left-[2%] top-[10%] w-16 opacity-70 animate-float" />
        <IsoCube className="absolute right-[6%] top-[12%] w-40 opacity-60 animate-float-delay" />
        <IsoCube accent className="absolute right-[18%] bottom-[14%] w-24 opacity-50 animate-float-delay-2" />
      </div>

      {/* Darker wash behind the text column for contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 -left-[100vw] right-[10%] -z-10 bg-[linear-gradient(90deg,rgba(9,9,11,0.85)_0%,rgba(9,9,11,0.55)_70%,transparent_100%)]"
      />
    </>
  );
}

export default function CourseHero({ course }: { course: TCourse }) {
  const facts = [
    { icon: Clock, text: course.courseIncludes?.duration || course.duration },
    { icon: BookOpen, text: course.lessons },
    { icon: FolderKanban, text: course.courseIncludes?.projects || course.projects },
    { icon: Award, text: course.courseIncludes?.certificate },
  ].filter((f) => f.text);
  const teachers = (course.expertPanel?.teachers || []).filter((t) => t?.photoUrl).slice(0, 4);
  const category = course.categories?.[0];

  return (
    <div className="space-y-4 py-8 text-white lg:py-14">
      <HeroBackground />
      <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 text-xs text-zinc-400">
        <Link href="/" className="hover:text-white">হোম</Link>
        <ChevronRight className="h-3 w-3" />
        <Link href="/courses" className="hover:text-white">কোর্সসমূহ</Link>
        {category ? (
          <>
            <ChevronRight className="h-3 w-3" />
            <span>{category}</span>
          </>
        ) : null}
      </nav>

      <div className="flex flex-wrap gap-2">
        {course.courseType === "one-to-one" ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-2.5 py-1 text-xs font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            One to One Training · অফিসে বসে ক্লাস
          </span>
        ) : (
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium text-red-200">
            ইঞ্জিনিয়ারিং এক্সপার্টদের সাথে ক্যারিয়ার গড়ুন
          </span>
        )}
      </div>

      <h1 className="max-w-3xl text-2xl font-bold leading-tight sm:text-3xl lg:text-[2.1rem]">{course.title}</h1>
      {course.description ? (
        <p className="line-clamp-3 max-w-3xl leading-relaxed text-zinc-300">{course.description}</p>
      ) : null}

      {facts.length ? (
        <ul className="flex flex-wrap gap-2 pt-1 text-sm text-zinc-100">
          {facts.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[0.06] px-3 py-1.5 backdrop-blur-sm">
              <Icon className="h-4 w-4 text-red-400" />
              {text}
            </li>
          ))}
        </ul>
      ) : null}

      {teachers.length ? (
        <div className="flex items-center gap-3 pt-1">
          <div className="flex -space-x-2.5">
            {teachers.map((t) => (
              <Image
                key={t.name}
                src={t.photoUrl}
                alt={t.name}
                width={36}
                height={36}
                className="h-9 w-9 rounded-full border-2 border-zinc-950 bg-zinc-800 object-cover"
              />
            ))}
          </div>
          <span className="text-sm text-zinc-300">
            প্রশিক্ষক: <span className="font-medium text-white">{teachers.map((t) => t.name).slice(0, 2).join(", ")}</span>
            {teachers.length > 2 ? " ও অন্যান্য" : ""}
          </span>
        </div>
      ) : null}
    </div>
  );
}
