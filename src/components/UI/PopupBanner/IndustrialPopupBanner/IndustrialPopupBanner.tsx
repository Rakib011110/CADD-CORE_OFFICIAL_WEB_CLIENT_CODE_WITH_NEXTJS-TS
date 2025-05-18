"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/UI/button";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useGetAllindustrialOfferBannerQuery } from "@/redux/api/industrialOfferBannerApi";
import Link from "next/link";

const PopupBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [shownOnce, setShownOnce] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [selectedBanner, setSelectedBanner] = useState<any>(null);

  const { data, isLoading } = useGetAllindustrialOfferBannerQuery({});

  // ✅ Random Offer Select
  useEffect(() => {
    if (data?.data?.length) {
      const activeOffers = data.data.filter((offer: any) => {
        const now = new Date().getTime();
        const offerEnd = new Date(`${offer.date}T${offer.time}`).getTime();
        return offerEnd > now; // অফার এখনো Active কিনা
      });

      if (activeOffers.length) {
        const randomIndex = Math.floor(Math.random() * activeOffers.length);
        setSelectedBanner(activeOffers[randomIndex]);
      }
    }
  }, [data]);

  // ✅ Scroll করলে ১বার Banner দেখানো
  useEffect(() => {
    const handleScroll = () => {
      if (!shownOnce && window.scrollY > 200 && selectedBanner) {
        setShowBanner(true);
        setShownOnce(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shownOnce, selectedBanner]);

  // ✅ Auto-hide after 10 seconds if not hovering
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showBanner && !isHovering) {
      timer = setTimeout(() => setShowBanner(false), 10000);
    }
    return () => clearTimeout(timer);
  }, [showBanner, isHovering]);

  // ✅ Countdown Timer Calculation
  useEffect(() => {
    if (!selectedBanner?.date || !selectedBanner?.time) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const offerEnd = new Date(`${selectedBanner.date}T${selectedBanner.time}`).getTime();
      const distance = offerEnd - now;

      if (distance <= 0) {
        setTimeLeft("সময় শেষ!");
        setShowBanner(false); // সময় শেষ হলে ব্যানার hide
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(
          `${days} দিন ${hours} ঘণ্টা ${minutes} মিনিট ${seconds} সেকেন্ড`
        );
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [selectedBanner]);

  if (isLoading || !selectedBanner) return null;

  return (
    <AnimatePresence>
    {showBanner && (
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="relative bg-gradient-to-br from-red-500 via-white to-blue-50 dark:from-red-700 dark:via-gray-900 dark:to-blue-900 rounded-3xl shadow-2xl p-8 max-w-4xl w-full mx-4 overflow-hidden border border-white/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 text-red-500 hover:bg-white/20"
            onClick={() => setShowBanner(false)}
          >
            <X className="h-6 w-6" />
          </Button>
  
          {/* Grid Layout */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Image Section */}
            <motion.div
              className="relative  rounded-xl overflow-hidden shadow-lg"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <img
                src={selectedBanner.photoUrl}
                alt="Special Offer"
                className="object-cover w-full h-auto"
              />
            </motion.div>
  
            {/* Text Section */}
            <div className="flex flex-col justify-center text-gray-900 dark:text-white">
              <h2 className="text-3xl font-bold mb-4 animate-pulse">
                {selectedBanner.title}
              </h2>
              <p className="text-base mb-6 leading-relaxed">
                {selectedBanner.description}
              </p>
  
              {/* Timer */}
              <div className="bg-red-500/10 p-4 rounded-lg mb-6 text-center text-red-600 dark:text-red-300">
                <p className="font-semibold">
                  ⏳সময়: {timeLeft} বাকি আছে!
                </p>
              </div>
  
              {/* Buttons */}
              <div className="flex gap-4">
                {/* <Button 
                disabled
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold"
                  onClick={() => {
                    window.open(selectedBanner.buyNowLink, "_blank");
                  }}
                >
                 Join {selectedBanner.buyNowText || "Buy Now"}
                </Button>  */}

                <Link href={selectedBanner.buyNowText} target="_blank">
                  <Button className="flex-1 bg-red-500 animate-pulse text-2xl hover:bg-red-600 text-white font-bold cursor-pointer">
                    Join Now
                  </Button>
                </Link>
               
               
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
  
  );
};

export default PopupBanner;
