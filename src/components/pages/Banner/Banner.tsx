"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import Aos from "aos";
import { useGetAllBannersQuery, IBannerItem } from "@/redux/api/bannerApi";
import { ChevronLeft, ChevronRight } from "lucide-react";

const FALLBACK_BANNER_IMAGE =
  "https://res.cloudinary.com/dbkwiwoll/image/upload/v1746349680/Artboard_1_1_-Picsart-AiImageEnhancer_dccum8.png";

export default function Banner() {
  const { data } = useGetAllBannersQuery({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  // Filter valid active banners from database
  const banners: IBannerItem[] =
    data?.data?.filter((item) => item.isActive !== false && Boolean(item.photoUrl)) || [];

  const hasMultipleBanners = banners.length > 1;

  // Autoplay slider when multiple banners exist
  useEffect(() => {
    if (!hasMultipleBanners || isHovered) return;

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [hasMultipleBanners, banners.length, isHovered]);

  const handlePrev = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  // Render image with natural dimensions directly from the image itself
  const renderBannerContent = (photoUrl: string, title?: string, link?: string) => {
    const imgElement = (
      <img
        src={photoUrl}
        alt={title || "bannar"}
        className="w-full h-auto block"
      />
    );

    if (link && link.trim() !== "") {
      const isExternal = link.startsWith("http://") || link.startsWith("https://");
      return (
        <Link
          href={link}
          target={isExternal ? "_blank" : "_self"}
          rel={isExternal ? "noopener noreferrer" : undefined}
          className="block w-full cursor-pointer"
        >
          {imgElement}
        </Link>
      );
    }

    return imgElement;
  };

  return (
    <section
      className="relative w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div data-aos="fade-up" className="w-full">
        {/* If no data in database, show the current hardcoded image */}
        {banners.length === 0 ? (
          <div className="w-full">
            {renderBannerContent(FALLBACK_BANNER_IMAGE, "bannar")}
          </div>
        ) : banners.length === 1 ? (
          /* Single dynamic banner from database */
          <div className="w-full">
            {renderBannerContent(
              banners[0].photoUrl,
              banners[0].title,
              banners[0].link
            )}
          </div>
        ) : (
          /* Multiple dynamic banners with smooth navigation */
          <div className="relative w-full">
            <div className="w-full">
              {banners.map((banner, index) => (
                <div
                  key={banner._id || index}
                  className={`w-full transition-opacity duration-700 ease-in-out ${
                    index === currentIndex ? "block opacity-100" : "hidden opacity-0"
                  }`}
                >
                  {renderBannerContent(
                    banner.photoUrl,
                    banner.title,
                    banner.link
                  )}
                </div>
              ))}
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrev}
              aria-label="Previous Banner"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-105"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button
              onClick={handleNext}
              aria-label="Next Banner"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all duration-200 opacity-80 hover:opacity-100 hover:scale-105"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Dot Indicators */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {banners.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                  className={`transition-all duration-300 rounded-full ${
                    dotIdx === currentIndex
                      ? "w-8 h-2 bg-sky-500 shadow-md"
                      : "w-2 h-2 bg-white/60 hover:bg-white/90"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}