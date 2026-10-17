import Image from "next/image";
import { Check, Headphones, Briefcase, Globe2, MessageCircle, Phone, Video, Facebook } from "lucide-react";
import CourseSection from "./CourseSection";
import { AutoGrid, CARD, CARD_STATIC, ICON_TILE } from "./ui";

// Content carried over from the previous SupportAndTraining, FreelancingGuide and CourseForWhom blocks.

const SUPPORT_IMAGE =
  "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744107410/WhatsApp-Image-2024-08-29-at-11.45.03-AM-1536x1023.jpeg_pvewlx.webp";

const SUPPORT_CHANNELS = [
  { label: "হোয়াটসঅ্যাপ", icon: MessageCircle },
  { label: "ফেসবুক", icon: Facebook },
  { label: "ফোন কল", icon: Phone },
  { label: "গুগল মিট", icon: Video },
];

const OJT_POINTS = [
  "মোড: অনলাইন বা অফলাইন",
  "অনলাইন: ফুলটাইম (৯টা-৫টা, ১ সপ্তাহ) অথবা পার্টটাইম (৬টা-১০টা, ১ মাস)",
  "অফলাইন: ফুলটাইম (৯টা-৫টা), নিজস্ব ল্যাপটপ আবশ্যক",
  "মূল্যায়ন: ট্রেনিংয়ের আগে কাজ পর্যালোচনা",
  "উপস্থিতি: নিয়মিত উপস্থিতি বাধ্যতামূলক",
  "ফলাফল: সিভি আপডেট ও জব সেলে জমা",
];

const FREELANCING_PLATFORMS = [
  { name: "Upwork", logo: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106526/Upwork-01-768x432_tdsnga.png" },
  { name: "Fiverr", logo: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106489/fiverr-01_xvgkxz.png" },
  { name: "Freelancer", logo: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106451/freelancer-01-600x338_yt0atk.png" },
  { name: "PeoplePerHour", logo: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106596/PeoplePerHour-01-300x300_m2kvwm.png" },
  { name: "Guru", logo: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106408/guru-01-600x338_u71hkr.png" },
  { name: "Sketchfab", logo: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106359/sketchfab-01-768x432_hdlotg.png" },
];

const AUDIENCES = [
  {
    name: "গ্র্যাজুয়েট",
    role: "ইঞ্জিনিয়ারিং ও টেকনিক্যাল ব্যাকগ্রাউন্ড",
    image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105843/MicrosoftTeams-image-8-300x300_zimtlr.png",
  },
  {
    name: "শিক্ষার্থী",
    role: "পলিটেকনিক ও ভার্সিটি শিক্ষার্থী",
    image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105920/Student-type-5-300x300_snjnjv.png",
  },
  {
    name: "চাকরিতে ইচ্ছুক",
    role: "জব মার্কেটে দ্রুত ক্যারিয়ার গড়ায়",
    image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105969/Student-type-3-300x300_bkmhak.png",
  },
  {
    name: "ফ্রিল্যান্সিং ইচ্ছুক",
    role: "রিমোট ও আন্তর্জাতিক মার্কেটপ্লেসে",
    image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106306/Student-type-2-300x300_djztig.png",
  },
  {
    name: "উদ্যোক্তা",
    role: "নিজস্ব ফার্ম বা কনসালটেন্সি শুরু করতে",
    image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744107860/Student-type-1_f9z7es.png",
  },
];

function CardTitle({ icon: Icon, children }: { icon: typeof Headphones; children: React.ReactNode }) {
  return (
    <h3 className="flex items-center gap-3 text-lg font-bold text-zinc-900">
      <span className={`${ICON_TILE} h-10 w-10`}>
        <Icon className="h-5 w-5" />
      </span>
      {children}
    </h3>
  );
}

export function CareerSupportSection() {
  return (
    <CourseSection id="career-support" title="ক্যারিয়ার সাপোর্ট" subtitle="ক্লাসের বাইরেও আপনার সফলতার জন্য প্রয়োজনীয় সহায়তা">
      {/* Two cards side by side, always the same height */}
      <div className="grid items-stretch gap-4 xl:grid-cols-2">
        <div className={`${CARD_STATIC} flex flex-col overflow-hidden`}>
          <div className="relative h-44 w-full">
            <Image src={SUPPORT_IMAGE} alt="স্টুডেন্ট সাপোর্ট সেশন" fill sizes="(min-width: 1280px) 420px, 92vw" className="object-cover" />
          </div>
          <div className="flex flex-1 flex-col p-6">
            <CardTitle icon={Headphones}>ডেডিকেটেড স্টুডেন্ট সাপোর্ট</CardTitle>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              যেকোনো সময় প্রশ্ন করুন। আমাদের প্রফেশনাল সাপোর্ট ইঞ্জিনিয়াররা ব্যবহারিক নির্দেশনার মাধ্যমে আপনাকে দ্রুত সমাধান দেবেন।
            </p>
            <ul className="mt-auto grid grid-cols-2 gap-2 pt-5">
              {SUPPORT_CHANNELS.map(({ label, icon: Icon }) => (
                <li key={label} className="flex items-center gap-2 rounded-lg bg-zinc-50 px-3 py-2 text-sm font-medium text-zinc-700">
                  <Icon className="h-4 w-4 text-red-600" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={`${CARD_STATIC} flex flex-col p-6`}>
          <CardTitle icon={Briefcase}>অন-জব ট্রেইনিং</CardTitle>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600">
            মূল কোর্সের ৭০% সম্পন্ন করার পর অন-জব ট্রেনিংয়ের জন্য আবেদন করতে পারবেন। একজন অভিজ্ঞ প্রকৌশলীর তত্ত্বাবধানে বাস্তব
            প্রকল্পের কাজ শুরু থেকে শেষ পর্যন্ত করবেন।
          </p>
          <ul className="mt-4 grid gap-2.5">
            {OJT_POINTS.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-sm text-zinc-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-50">
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-auto pt-5 text-xs font-medium text-amber-800">
            <span className="block rounded-lg bg-amber-50 px-3 py-2">মনে রাখবেন: অন-জব ট্রেনিং একটি জবের মতো। অনিয়মিততা কাজের গতি বাধাগ্রস্ত করতে পারে।</span>
          </p>
        </div>
      </div>

      <div className={`${CARD_STATIC} mt-4 p-6`}>
        <CardTitle icon={Globe2}>ফ্রিল্যান্সিং গাইড</CardTitle>
        <p className="mt-2 text-sm text-zinc-600">বিশ্বসেরা ফ্রিল্যান্সিং প্ল্যাটফর্মে কাজ করার সম্পূর্ণ গাইডলাইন</p>
        <div className="mt-5">
          <AutoGrid sm={3} xl={6} gap="0.75rem">
            {FREELANCING_PLATFORMS.map((p) => (
              <div key={p.name} className="flex h-20 items-center justify-center rounded-xl bg-zinc-50 p-3 ring-1 ring-zinc-100" title={p.name}>
                <Image src={p.logo} alt={p.name} width={140} height={70} className="max-h-12 w-auto object-contain" />
              </div>
            ))}
          </AutoGrid>
        </div>
      </div>
    </CourseSection>
  );
}

export function AudienceSection() {
  return (
    <CourseSection id="audience" title="কোর্সটি যাদের জন্য" subtitle="বিভিন্ন ব্যাকগ্রাউন্ডের শিক্ষার্থীদের জন্য ডিজাইন করা হয়েছে">
      {/* Symmetrical 5-column layout on desktop, responsive on tablet/mobile */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-3.5 md:gap-4">
        {AUDIENCES.map((a, index) => (
          <div
            key={a.name}
            className={`group relative rounded-2xl p-[1px] bg-gradient-to-b from-zinc-200/90 via-zinc-100 to-zinc-200/40 hover:from-red-500 hover:via-rose-500 hover:to-red-600 transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_30px_-10px_rgba(220,38,38,0.18)] hover:-translate-y-1.5 cursor-default ${
              index === 4 ? "col-span-2 sm:col-span-1 max-w-[260px] sm:max-w-none mx-auto w-full" : ""
            }`}
          >
            <div className="relative h-full bg-white rounded-[15px] p-4 sm:p-4.5 flex flex-col items-center text-center overflow-hidden">
              {/* Subtle ambient light on hover */}
              <div className="absolute -top-8 -right-8 w-16 h-16 bg-red-500/[0.05] rounded-full blur-xl group-hover:bg-red-500/[0.12] transition-colors pointer-events-none" />

              {/* Layered Avatar Container */}
              <div className="relative mb-3 flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
                <div className="relative h-20 w-20 sm:h-22 sm:w-22 rounded-2xl p-1.5 bg-gradient-to-br from-red-50/80 via-white to-rose-50/50 border border-red-100/80 shadow-sm group-hover:scale-105 group-hover:border-red-200 transition-all duration-300 flex items-center justify-center overflow-hidden">
                  <Image
                    src={a.image}
                    alt={a.name}
                    width={84}
                    height={84}
                    className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
              </div>

              {/* Persona Name */}
              <h3 className="text-sm sm:text-[15px] font-bold text-zinc-900 group-hover:text-red-600 transition-colors duration-200">
                {a.name}
              </h3>

              {/* Role Context */}
              <p className="mt-1 text-[11px] sm:text-xs text-zinc-500 leading-relaxed font-normal line-clamp-2">
                {a.role}
              </p>

              {/* Subtle hover accent line */}
              <div className="mt-3 h-0.5 w-6 rounded-full bg-zinc-200 group-hover:w-12 group-hover:bg-red-600 transition-all duration-300" />
            </div>
          </div>
        ))}
      </div>
    </CourseSection>
  );
}
