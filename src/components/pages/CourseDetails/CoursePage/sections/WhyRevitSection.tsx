import Image from "next/image";
import { ArrowRight, BookOpen, Building2, DraftingCompass, LayoutTemplate, Lightbulb, Quote, Rocket, Users } from "lucide-react";
import CourseSection from "./CourseSection";
import { AutoGrid, CARD, CARD_STATIC, ICON_TILE, SubHeading } from "./ui";

// Content carried over from the previous RevitSectionProps block (BIM course only).

const FEATURES = [
  {
    icon: Building2,
    title: "BIM প্ল্যাটফর্ম",
    description: "এটি শুধু ডিজাইন সফটওয়্যার নয় – একটি সম্পূর্ণ Building Information Modeling (BIM) ইকোসিস্টেম।",
  },
  {
    icon: LayoutTemplate,
    title: "প্রজেক্ট লাইফসাইকেল ম্যানেজমেন্ট",
    description: "একই প্ল্যাটফর্ম থেকে পুরো প্রজেক্ট শুরু থেকে শেষ পর্যন্ত পরিচালনা করুন।",
  },
  {
    icon: Rocket,
    title: "ইন্ডাস্ট্রি স্ট্যান্ডার্ড",
    description: "আজকের দিনে Revit শেখা বিলাসিতা নয়, বরং আবশ্যকতা।",
  },
];

const EVOLUTION = [
  {
    stage: "পুরোনো ধারা",
    name: "হ্যান্ড ড্রাফটিং",
    icon: DraftingCompass,
    description: "পুরোনো দিনের হাতে আঁকা ডিজাইন পদ্ধতি",
    people: "প্রয়োজন ১০০ জন মানুষ",
    imageUrl:
      "https://res.cloudinary.com/dalpf8iip/image/upload/v1750237555/office-life-before-the-invention-of-autocad-and-other-_mx9vvi.webp",
    tone: { pill: "bg-amber-50 text-amber-700", icon: "bg-amber-50 text-amber-600", bar: "bg-amber-400" },
  },
  {
    stage: "পরিবর্তনের ধাপ",
    name: "AutoCAD",
    icon: BookOpen,
    description: "2D ডিজিটাল ডিজাইনের যুগে প্রবেশ",
    people: "প্রয়োজন ১০ জন মানুষ",
    imageUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1750239308/Employees-working-in-open-office_qy3qu1.webp",
    tone: { pill: "bg-sky-50 text-sky-700", icon: "bg-sky-50 text-sky-600", bar: "bg-sky-400" },
  },
  {
    stage: "আধুনিক BIM",
    name: "Revit BIM",
    icon: Lightbulb,
    description: "ডেটা সংযুক্ত 3D স্মার্ট মডেলিং",
    people: "প্রয়োজন মাত্র ১ জন",
    imageUrl: "https://res.cloudinary.com/dalpf8iip/image/upload/v1750752010/2149313795_suozvl.jpg",
    tone: { pill: "bg-emerald-50 text-emerald-700", icon: "bg-emerald-50 text-emerald-600", bar: "bg-emerald-500" },
  },
];

export default function WhyRevitSection() {
  return (
    <CourseSection
      id="why-revit"
      title="কেন Revit শেখা আবশ্যক"
      subtitle="Revit কেবল একটি ডিজাইন টুল নয় — এটি একটি আধুনিক BIM (Building Information Modeling) প্ল্যাটফর্ম। যেখানে আপনি প্রজেক্ট শুরু, ম্যানেজ এবং শেষ করতে পারবেন একটি সমন্বিত ডিজিটাল পরিবেশে।">
      {/* Key message */}
      <figure className={`${CARD_STATIC} relative overflow-hidden p-6 pl-7`}>
        <span className="absolute inset-y-0 left-0 w-1.5 bg-red-600" aria-hidden="true" />
        <Quote className="absolute right-5 top-4 h-10 w-10 text-red-100" aria-hidden="true" />
        <blockquote className="relative text-lg font-semibold leading-relaxed text-zinc-900">
          আজকের প্রতিযোগিতামূলক ইন্ডাস্ট্রিতে Revit জানা শুধুই সুবিধা নয় – এটি বাধ্যতামূলক।
        </blockquote>
        <figcaption className="relative mt-3 text-sm leading-relaxed text-zinc-600">
          Revit আপনাকে শুধু ডিজাইন শেখায় না, এটি শেখায় কীভাবে একটি ভবনের প্রতিটি উপাদানকে বোঝা এবং যুক্তিযুক্তভাবে প্রয়োগ করা
          যায়। এটি আপনাকে আরও দক্ষ আর্কিটেক্ট বা ইঞ্জিনিয়ার হতে সহায়তা করে।
        </figcaption>
      </figure>

      {/* Benefits */}
      <div className="mt-5">
        <AutoGrid sm={3} xl={3} gap="0.875rem">
          {FEATURES.map(({ icon: Icon, title, description }) => (
            <div key={title} className={`${CARD} flex flex-col gap-3 p-5`}>
              <span className={`${ICON_TILE} h-11 w-11`}>
                <Icon className="h-5 w-5" />
              </span>
              <span className="font-bold leading-snug text-zinc-900">{title}</span>
              <span className="text-sm leading-relaxed text-zinc-600">{description}</span>
            </div>
          ))}
        </AutoGrid>
      </div>

      {/* Evolution of design technology */}
      <div className="mt-10">
        <SubHeading>ডিজাইন টেকনোলজির বিবর্তন</SubHeading>
        <p className="-mt-1 mb-4 text-sm text-zinc-500">সময় ও প্রযুক্তির সঙ্গে পরিবর্তিত হয়েছে ডিজাইনিংয়ের ধরণ</p>
        <ol className="grid gap-4 sm:grid-cols-3">
          {EVOLUTION.map((step, i) => {
            const Icon = step.icon;
            return (
              <li key={step.name} className="relative flex">
                <div className={`${CARD} flex flex-1 flex-col overflow-hidden`}>
                  <div className="relative h-36 overflow-hidden bg-zinc-100">
                    <Image
                      src={step.imageUrl}
                      alt={`${step.name} যুগের কাজের পরিবেশ`}
                      fill
                      sizes="(min-width: 1280px) 260px, (min-width: 640px) 30vw, 92vw"
                      className="object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 h-1">
                      <span className={`block h-full ${step.tone.bar}`} />
                    </span>
                    <span className="absolute left-2.5 top-2.5 flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-zinc-800 shadow-sm">
                      <Users className="h-3.5 w-3.5 text-zinc-500" />
                      {step.people}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <span className={`self-start rounded-full px-2 py-0.5 text-[11px] font-semibold ${step.tone.pill}`}>
                      ধাপ {["১", "২", "৩"][i]} · {step.stage}
                    </span>
                    <span className="flex items-center gap-2.5">
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${step.tone.icon}`}>
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-base font-bold text-zinc-900">{step.name}</span>
                    </span>
                    <span className="text-sm leading-relaxed text-zinc-600">{step.description}</span>
                  </div>
                </div>
                {/* Arrow to the next step (side by side layouts only) */}
                {i < EVOLUTION.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute -right-[1.15rem] top-[4.5rem] z-10 hidden h-7 w-7 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 shadow-sm sm:flex">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </CourseSection>
  );
}
