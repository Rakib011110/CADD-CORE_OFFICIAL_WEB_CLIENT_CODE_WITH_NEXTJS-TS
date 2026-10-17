"use client";

import { MessageCircle, Phone } from "lucide-react";
import HomeSection, { Highlight } from "@/components/Home/HomeSection";

type Service = {
  id: number;
  title: string;
  desc: string;
  image: string;
};

const servicesData: Service[] = [
  {
    id: 1,
    title: "২৪/৭ সাপোর্ট",
    desc: "২৪ ঘণ্টা ৭ দিন সার্বক্ষণিক সাপোর্ট ও সহযোগিতা, যাতে আপনার যেকোনো প্রশ্নের দ্রুত সমাধান পাওয়া যায়।",
    image: "/services/support.png",
  },
  {
    id: 2,
    title: "অনলাইন ডিজিটাল লাইব্রেরি",
    desc: "ডিজিটাল লাইব্রেরি যেখানে কোর্স ম্যাটেরিয়াল, রিসোর্স, ইবুক ইত্যাদি রয়েছে।",
    image: "/services/digital-library.png",
  },
  {
    id: 3,
    title: "জব প্লেসমেন্ট",
    desc: "প্রশিক্ষণ শেষে চাকরির সুযোগ বা ইন্টার্নশিপের সুপারিশ প্রদান।",
    image: "/services/job-placement.png",
  },
  {
    id: 4,
    title: "শ্রেণীকক্ষের সকল রিসোর্স",
    desc: "ভিডিও লেকচার, স্লাইড, নোট এবং অনলাইন সাপোর্ট—all in one place।",
    image: "/services/classroom-resources.png",
  },
  {
    id: 5,
    title: "অন-জব ট্রেনিং",
    desc: "মূল কোর্সের ৭০% সম্পন্ন করার পর অন-জব ট্রেনিংয়ের জন্য আবেদন করতে পারবেন।",
    image: "/services/on-job-training.png",
  },
  {
    id: 6,
    title: "সার্টিফিকেট (জাতীয় ও আন্তর্জাতিক)",
    desc: "আপনার সাফল্যকে স্বীকৃতি দিতে জাতীয় ও আন্তর্জাতিক সার্টিফিকেট প্রদান।",
    image: "/services/certificate.png",
  },
];

const WHATSAPP_URL = "https://wa.me/8801611223631";
const PHONE_URL = "tel:+8801611223631";

// A soft tint per icon so the grid feels lively without strong colours
const TINTS = [
  "from-sky-50 to-sky-100/70 ring-sky-100",
  "from-violet-50 to-violet-100/70 ring-violet-100",
  "from-amber-50 to-amber-100/70 ring-amber-100",
  "from-emerald-50 to-emerald-100/70 ring-emerald-100",
  "from-rose-50 to-rose-100/70 ring-rose-100",
  "from-indigo-50 to-indigo-100/70 ring-indigo-100",
];

export default function OurServices() {
  return (
    <HomeSection
      id="services"
      tone="soft"
      eyebrow="কেন CADD CORE"
      title={
        <>
          আমাদের <Highlight>সেবা সমূহ</Highlight>
        </>
      }
      subtitle="ভর্তি থেকে ক্যারিয়ার পর্যন্ত, প্রতিটি ধাপে আমরা আপনার পাশে আছি।"
      action={{ label: "আরও জানুন", href: WHATSAPP_URL, external: true }}>
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        {/* Highlight card */}
        <div className="relative isolate flex flex-col overflow-hidden rounded-3xl bg-zinc-950 p-7 text-white">
          <span aria-hidden="true" className="absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-red-600/35 blur-3xl" />
          <span aria-hidden="true" className="absolute -bottom-24 -left-16 -z-10 h-56 w-56 rounded-full bg-rose-500/15 blur-3xl" />
          <span
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-[0.06] [background-image:linear-gradient(white_1px,transparent_1px),linear-gradient(90deg,white_1px,transparent_1px)] [background-size:24px_24px]"
          />

          <span className="inline-flex items-center gap-2 self-start rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-zinc-200 ring-1 ring-white/15">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> সাপোর্ট টিম
          </span>
          <h3 className="mt-5 text-2xl font-bold leading-snug">কোর্স নিয়ে কোনো প্রশ্ন আছে?</h3>
          <p className="mt-3 leading-relaxed text-zinc-300">
            কোর্স, ব্যাচের সময়সূচী, ফি, কিস্তি সুবিধা বা ক্যারিয়ার নিয়ে যেকোনো প্রশ্ন থাকলে আমাদের অভিজ্ঞ টিমের সাথে সরাসরি কথা বলুন।
            আপনার জন্য সঠিক কোর্স বেছে নিতে আমরা সাহায্য করব।
          </p>

          <div className="mt-auto space-y-3 pt-8">
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 font-semibold text-white transition hover:bg-emerald-400">
              <MessageCircle className="h-5 w-5" /> WhatsApp এ কথা বলুন
            </a>
            <a
              href={PHONE_URL}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/10 py-3 font-semibold text-white ring-1 ring-white/15 transition hover:bg-white/15">
              <Phone className="h-4 w-4" /> +880 1611-223631
            </a>
          </div>
        </div>

        {/* Services */}
        <ul className="grid gap-4 sm:grid-cols-2">
          {servicesData.map((service, i) => (
            <li
              key={service.id}
              className="group flex gap-4 rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-red-200 hover:shadow-[0_18px_40px_-24px_rgba(220,38,38,0.35)]">
              <span
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ring-1 transition duration-300 group-hover:-rotate-3 group-hover:scale-105 ${TINTS[i % TINTS.length]}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={service.image} alt="" loading="lazy" className="h-11 w-11 object-contain" />
              </span>
              <span className="min-w-0">
                <span className="block font-bold leading-snug text-zinc-900 transition-colors group-hover:text-red-600">{service.title}</span>
                <span className="mt-1.5 block text-sm leading-relaxed text-zinc-600">{service.desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </HomeSection>
  );
}
