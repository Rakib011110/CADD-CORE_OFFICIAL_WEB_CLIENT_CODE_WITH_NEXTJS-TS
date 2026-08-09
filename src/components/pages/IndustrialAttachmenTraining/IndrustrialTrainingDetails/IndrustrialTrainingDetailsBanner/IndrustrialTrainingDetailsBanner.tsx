"use client";
import React, { useCallback, useEffect, useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";

import { TCourse } from "@/lib/courses";
import Link from "next/link";
import DetailsHeadNav from "@/components/pages/CourseDetails/DetailsHeadNav/DetailsHeadNav";
import Image from "next/image";

export default function IndrustrialTrainingDetailsBanner({ course }: { course: TCourse }) {
  // Extract all available banner slide URLs
  const slides: string[] = React.useMemo(() => {
    // 1. If bannerImages explicitly added in DB, use them
    if (course?.bannerImages && Array.isArray(course.bannerImages) && course.bannerImages.length > 0) {
      const urls = course.bannerImages
        .map((item: any) => (typeof item === "string" ? item : item?.photoUrl))
        .filter((url): url is string => Boolean(url && url.trim().length > 0));
      if (urls.length > 0) return urls;
    }

    // 2. Otherwise combine available courseBanner, photoUrl, and demoCertificates so every course gets a live slider
    const list: string[] = [];
    if (course?.courseBanner && course.courseBanner.trim().length > 0) {
      list.push(course.courseBanner);
    }
    if (
      course?.photoUrl &&
      course.photoUrl.trim().length > 0 &&
      !list.includes(course.photoUrl)
    ) {
      list.push(course.photoUrl);
    }
    if (Array.isArray(course?.demoCertificate)) {
      course.demoCertificate.forEach((cert: any) => {
        const url = typeof cert === "string" ? cert : cert?.photoUrl;
        if (url && typeof url === "string" && url.trim().length > 0 && !list.includes(url)) {
          list.push(url);
        }
      });
    }

    return list.length > 0
      ? list
      : ["https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"];
  }, [course]);

  // Setup Embla Carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  // Autoplay loop every 3.5 seconds
  useEffect(() => {
    if (!emblaApi || slides.length <= 1) return;
    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3500);
    return () => clearInterval(interval);
  }, [emblaApi, slides.length]);

  return (
    <section className="max-w-7xl mx-auto px-2">
      {/* Use flex-col on mobile, row on md+ */}
      <div className="flex flex-col md:flex-row gap-7">
        <div className="md:w-1/4 order-2 md:order-1">
          <DetailsHeadNav />
        </div>

        <div className="md:w-3/4 order-1 md:order-2">
          <div
            className="relative bg-cover bg-center bg-no-repeat rounded-lg overflow-hidden"
            style={{
              backgroundImage: `url(https://res.cloudinary.com/dbkwiwoll/image/upload/v1745483393/a1af9617-b96a-494d-870e-37c3c96e766b_jpbfzz.jpg)`,
            }}
          >
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Banner Slider Container */}
            <div className="relative z-30 max-w-5xl mx-auto border-4 border-t-0 border-b-0 border-red-500 overflow-hidden group shadow-2xl">
              {slides.length > 1 ? (
                <div className="relative">
                  {/* Embla Viewport */}
                  <div className="overflow-hidden" ref={emblaRef}>
                    <div className="flex">
                      {slides.map((slideUrl, idx) => (
                        <div key={idx} className="flex-[0_0_100%] min-w-0 relative">
                          <Image
                            className="w-full h-auto object-cover max-h-[500px]"
                            src={slideUrl}
                            width={1000}
                            height={600}
                            alt={`${course?.title || "Course"} Banner Slide ${idx + 1}`}
                            priority={idx === 0}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Slider Controls (Prev / Next Buttons) */}
                  <button
                    onClick={scrollPrev}
                    type="button"
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-red-600 text-white p-2.5 rounded-full shadow-lg transition-all duration-300 z-40 border border-white/20"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={scrollNext}
                    type="button"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-red-600 text-white p-2.5 rounded-full shadow-lg transition-all duration-300 z-40 border border-white/20"
                    aria-label="Next Slide"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* Slider Pagination Dots */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-40 bg-black/40 px-3 py-1.5 rounded-full backdrop-blur-xs">
                    {slides.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => scrollTo(idx)}
                        type="button"
                        className={`h-2.5 rounded-full transition-all duration-300 ${
                          selectedIndex === idx ? "w-6 bg-red-600" : "w-2.5 bg-white/70 hover:bg-white"
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                /* Single Image fallback */
                <Image
                  className="w-full h-auto object-cover max-h-[500px]"
                  src={slides[0] || course?.courseBanner || "https://www.freeiconspng.com/thumbs/no-image-icon/no-image-icon-6.png"}
                  width={1000}
                  height={600}
                  alt={course?.title || "Course Banner"}
                />
              )}
            </div>  
            <div className="backdrop-filter backdrop-blur-sm  rounded-md shadow-lg p-6 md:p-8">
                {/* SubTitle */}
                {/* <h4 className="text-sm md:text-base text-red-500 font-semibold mb-2">
                 

                  ইঞ্জিনিয়ারিং এক্সপার্টদের সাথে ক্যারিয়ার গড়ুন
                </h4> */}

                {/* Main Title */}
                {/* <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-100 leading-snug mb-4">
                  {course?.title}
                </h2> */}

             
                <div className="flex flex-wrap items-center gap-5 text-gray-300 font-semibold ">
                  {/* Duration */}

                  <div className="flex flex-wrap gap-4">
                  {/* <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold">
                    ফ্রি ক্লাস দেখতে চাই
                  </button> */}
                 
                 <Link href="https://docs.google.com/forms/d/e/1FAIpQLSe27ZcsU6VdsyYPMD4JO5VwW4d9CI3_HtTG8YRxyo43gyzGWA/viewform">
                 <button className="bg-white text-red-500 border border-red-500 hover:bg-red-50 px-5 py-2 rounded-md font-semibold">
                 ভর্তি ফর্ম
                  </button> 
                 </Link>

                  {/* <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold">
                  কোর্স ফি {formattedFee} টাকা
                  </button> */}
                </div>
                  <div className="flex items-center gap-2 border-l-4 border-red-500 pl-3">
                    <CheckCircle className="text-red-500 w-5 " />
                    <span>{course?.courseIncludes.duration}</span>
                  </div>

                  {/* Lessons */}
                  <div className="flex items-center gap-2 border-l-4 border-red-500 pl-3">
                    <CheckCircle className="text-red-500 w-5 " />
                    <span>{course?.lessons}</span>
                  </div>

                  {/* Projects */}
                  <div className="flex items-center gap-2 border-l-4 border-red-500 pl-3">
                    <CheckCircle className="text-red-500 w-5 " />
                    <span>{course?.projects}</span>
                  </div>
                </div>

                {/* Buttons */}
              
              </div>

          </div>
      </div>
    </div>
  </section>
  );
}
