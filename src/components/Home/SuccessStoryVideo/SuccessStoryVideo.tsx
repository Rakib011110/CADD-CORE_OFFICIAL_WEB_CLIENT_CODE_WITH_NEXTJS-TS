"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Rocket, Star } from "lucide-react";
import { Highlight, SectionHeader } from "@/components/Home/HomeSection";
import { VideoCard } from "./SuccessVideoCard";

export interface Video {
  id: string;
  title: string;
  engineer: string;
  category: string;
  company: string;
  views: string;
  date: string;
  duration: string;
  thumbnail: string;
  avatar: string;
  videoUrl: string;
}

const allVideosData: Video[] = [
  {
    id: "1",
    title: "রাতুলের অসাধারণ অর্জন — ক্যাড কোর ট্রেনিং-এ তার সাফল্যের গল্প",
    engineer: "রাতুল",
    category: "সিভিল",
    company: "ক্যাড কোর ট্রেনিং ইনস্টিটিউট",
    views: "৫.৪ হাজার ভিউ",
    date: "১ সপ্তাহ আগে",
    duration: "৫:২০",
    thumbnail: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748758084/sddefault_qicg3z.jpg",
    avatar: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756316/blue-circle-with-white-user_78370-4707_hbsduv.avif",
    videoUrl: "https://www.youtube.com/watch?v=0Xh35t9iR98",
  },
  {
    id: "2",
    title: "তনময়ের বাস্তব অভিজ্ঞতা — ক্যাড কোর ট্রেনিং ইনস্টিটিউটের একজন সফল শিক্ষার্থী",
    engineer: "তনময়",
    category: "সিভিল",
    company: "ক্যাড কোর ট্রেনিং ইনস্টিটিউট",
    views: "৬.৮ হাজার ভিউ",
    date: "২ সপ্তাহ আগে",
    duration: "৭:৪৫",
    thumbnail: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748757970/sddefault_bqukws.jpg",
    avatar: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756316/blue-circle-with-white-user_78370-4707_hbsduv.avif",
    videoUrl: "https://www.youtube.com/watch?v=iNZhdae4maY&t=25s",
  },
  {
    id: "3",
    title: "শরিফুল ইসলামের আর্কিটেকচারাল যাত্রা — একজন প্রশিক্ষণের অনন্য সাফল্য",
    engineer: "শরিফুল ইসলাম",
    category: "আর্কিটেকচারাল",
    company: "ক্যাড কোর ট্রেনিং ইনস্টিটিউট",
    views: "৭.২ হাজার ভিউ",
    date: "৩ সপ্তাহ আগে",
    duration: "৬:১০",
    thumbnail: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756211/sddefault_qnyxg1.jpg",
    avatar: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756316/blue-circle-with-white-user_78370-4707_hbsduv.avif",
    videoUrl: "https://www.youtube.com/watch?v=UOfg2IU91oM",
  },
  {
    id: "4",
    title: "ওবায়দুল হকের সফলতা — মেকানিক্যাল ক্যাড কোর্স থেকে ক্যারিয়ার গড়ার গল্প",
    engineer: "ওবায়দুল হক",
    category: "মেকানিক্যাল",
    company: "ক্যাড কোর ট্রেনিং ইনস্টিটিউট",
    views: "৮.১ হাজার ভিউ",
    date: "১ মাস আগে",
    duration: "৮:০০",
    thumbnail: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748757868/sddefault_mptn4a.jpg",
    avatar: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756316/blue-circle-with-white-user_78370-4707_hbsduv.avif",
    videoUrl: "https://www.youtube.com/watch?v=ko155egKjho",
  },
  {
    id: "5",
    title: "রাহাতের অনুপ্রেরণাদায়ক সাফল্য — বিআইএম কোর্সে দক্ষতা অর্জনের গল্প",
    engineer: "রাহাত",
    category: "বিম",
    company: "ক্যাড কোর ট্রেনিং ইনস্টিটিউট",
    views: "৯.৩ হাজার ভিউ",
    date: "২ মাস আগে",
    duration: "৯:১৫",
    thumbnail: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748757868/sddefault_mptn4a.jpg",
    avatar: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756316/blue-circle-with-white-user_78370-4707_hbsduv.avif",
    videoUrl: "https://www.youtube.com/watch?v=someOtherVideoID19",
  },
  {
    id: "6",
    title: "সাকিবের ইলেকট্রিক্যাল ডিজাইন দক্ষতা — এক অনন্য অভিজ্ঞতার ভিডিও",
    engineer: "সাকিব",
    category: "ইলেকট্রিক্যাল",
    company: "ক্যাড কোর ট্রেনিং ইনস্টিটিউট",
    views: "৪.৫ হাজার ভিউ",
    date: "৩ দিন আগে",
    duration: "৪:৩০",
    thumbnail: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756211/sddefault_qnyxg1.jpg",
    avatar: "https://res.cloudinary.com/dalpf8iip/image/upload/v1748756316/blue-circle-with-white-user_78370-4707_hbsduv.avif",
    videoUrl: "https://www.youtube.com/watch?v=someOtherVideoID20",
  }
];

const filters = ["সব", "সিভিল", "আর্কিটেকচারাল", "মেকানিক্যাল", "ইলেকট্রিক্যাল", "বিম"];
const VIDEOS_PER_PAGE = 3;

const WHATSAPP_URL = "https://wa.me/8801611223631";

export default function SuccessStoriesPageVideo() {
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  const filteredVideos =
    activeFilter === "সব" ? allVideosData : allVideosData.filter((video) => video.category === activeFilter);
  const totalPages = Math.ceil(filteredVideos.length / VIDEOS_PER_PAGE);
  const currentVideos = filteredVideos.slice((currentPage - 1) * VIDEOS_PER_PAGE, currentPage * VIDEOS_PER_PAGE);

  // Back to the first page when the filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter]);

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  };

  const pageButton = "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition";

  return (
    <section id="success-stories" className="bg-zinc-50 py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="শিক্ষার্থীদের কথা"
          title={
            <>
              ক্যাড কোর <Highlight>সাফল্যের গল্প</Highlight>
            </>
          }
          subtitle="আমাদের ক্যাড কোর প্রশিক্ষণ কমিউনিটির যুগান্তকারী প্রকল্প এবং উদ্ভাবন আবিষ্কার করুন"
        />

        {/* Category filter */}
        <div className="-mx-4 mb-6 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <div role="tablist" aria-label="বিভাগ" className="inline-flex gap-1 rounded-full bg-white p-1 ring-1 ring-zinc-200">
            {filters.map((filter) => {
              const active = filter === activeFilter;
              return (
                <button
                  key={filter}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setActiveFilter(filter)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active ? "bg-zinc-900 text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                  }`}>
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Videos */}
        <div ref={gridRef} className="scroll-mt-24">
          {currentVideos.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {currentVideos.map((video, index) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}>
                  <VideoCard video={video} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-12 text-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400">
                <Rocket className="h-7 w-7" />
              </span>
              <p className="mt-4 font-semibold text-zinc-800">এই বিভাগে এখনো কোনো ভিডিও নেই</p>
              <p className="mt-1 text-sm text-zinc-500">অনুগ্রহ করে অন্য একটি বিভাগ নির্বাচন করুন</p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 ? (
          <nav aria-label="পৃষ্ঠা" className="mt-8 flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              aria-label="আগের পৃষ্ঠা"
              className={`${pageButton} bg-white text-zinc-700 ring-1 ring-zinc-200 hover:ring-zinc-400 disabled:opacity-40`}>
              <ArrowLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => goToPage(page)}
                aria-current={page === currentPage ? "page" : undefined}
                className={`${pageButton} ${
                  page === currentPage ? "bg-red-600 text-white shadow-sm" : "bg-white text-zinc-700 ring-1 ring-zinc-200 hover:ring-zinc-400"
                }`}>
                {page.toLocaleString("bn-BD")}
              </button>
            ))}
            <button
              type="button"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              aria-label="পরের পৃষ্ঠা"
              className={`${pageButton} bg-white text-zinc-700 ring-1 ring-zinc-200 hover:ring-zinc-400 disabled:opacity-40`}>
              <ArrowRight className="h-4 w-4" />
            </button>
          </nav>
        ) : null}

        {/* Testimonial and share your story */}
        <div className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <figure className="relative isolate overflow-hidden rounded-3xl bg-zinc-950 p-6 text-white sm:p-8">
            <span aria-hidden="true" className="absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-red-600/30 blur-3xl" />
            <Quote aria-hidden="true" className="absolute right-6 top-6 h-12 w-12 text-white/10" />
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://res.cloudinary.com/dalpf8iip/image/upload/v1752395972/caddcoreuser_irg7qa.jpg"
                alt=""
                className="h-16 w-16 shrink-0 rounded-full object-cover ring-4 ring-white/10"
              />
              <div>
                <div className="mb-3 flex gap-0.5" aria-label="৫ এর মধ্যে ৫ রেটিং">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="leading-relaxed text-zinc-100 sm:text-lg">
                  &ldquo;CAD কোর্সটি করার পর আমি AutoCAD-এ confident হয়ে উঠি এবং নিজের একটি portfolio তৈরি করি। কোর্সের practical
                  assignment আর real-life project guideline গুলো আমাকে industry-ready করে তোলে। এখন আমি একটি leading architectural
                  firm-এ কাজ করছি — এ কোর্সটা আমার career-এর turning point ছিল!&rdquo;
                </blockquote>
                <figcaption className="mt-4 text-sm">
                  <span className="font-semibold text-white">সাবরিন হোসেন, Junior CAD Designer</span>
                  <span className="block text-zinc-400">ArchiZone Ltd. | ২০২৩ Best Newcomer Award</span>
                </figcaption>
              </div>
            </div>
          </figure>

          <div className="flex flex-col justify-between gap-6 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8">
            <div>
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                <Rocket className="h-6 w-6" />
              </span>
              <h3 className="mt-4 text-xl font-bold leading-snug text-zinc-900">আপনার ইঞ্জিনিয়ারিং সাফল্য শেয়ার করুন</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                আপনার উদ্ভাবনী প্রকল্প এবং সমাধান প্রদর্শন করে পরবর্তী প্রজন্মের প্রকৌশলীদের অনুপ্রাণিত করুন
              </p>
            </div>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-zinc-900 px-5 py-3 font-semibold text-white transition hover:bg-red-600">
              আপনার সাফল্য জমা দিন
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
