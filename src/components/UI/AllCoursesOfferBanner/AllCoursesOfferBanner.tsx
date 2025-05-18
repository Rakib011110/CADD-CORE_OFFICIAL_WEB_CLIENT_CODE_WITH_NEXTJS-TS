"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/UI/button";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// 📦 Popup Data
const popupBannerData = {
  title: "🎉 বিশেষ অফার!",
  description: "৫০% ডিসকাউন্টে পাচ্ছেন আমাদের প্রিমিয়াম কোর্সটি। এখনই এনরোল করুন এবং ক্যারিয়ার ডেভেলপ করুন!",
  offerEndTime: new Date().getTime() + 6 * 60 * 60 * 1000, // এখন থেকে ৬ ঘণ্টা পরে শেষ হবে
  buyNowText: "এখনই কিনুন",
  learnMoreText: "বিস্তারিত জানুন",
  imageUrl: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1745812636/Blue_Modern_Online_Courses_Instagram_Post_dcefi8.png",
  watermarkText: "বিজ্ঞাপন",
};

const AllCoursesPopupBanner = () => { 
  const [showBanner, setShowBanner] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [shownOnce, setShownOnce] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  
  useEffect(() => {
    const handleScroll = () => {
      if (!shownOnce && window.scrollY > 200) {
        setShowBanner(true);
        setShownOnce(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shownOnce]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showBanner && !isHovering) {
      timer = setTimeout(() => setShowBanner(false), 10000); // ১০ সেকেন্ড পরে হাইড
    }
    return () => clearTimeout(timer);
  }, [showBanner, isHovering]);

  // ⏳ Countdown Logic
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = popupBannerData.offerEndTime - now;

      if (distance < 0) {
        setTimeLeft("সময় শেষ!");
        clearInterval(interval);
      } else {
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(`${hours} ঘণ্টা ${minutes} মিনিট ${seconds} সেকেন্ড`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <motion.div
            className={`relative bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-2xl w-full mx-4 transition-all ${
              isHovering ? "scale-105" : "scale-100"
            }`}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.4 }}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute -top-10 -right-10 text-white hover:bg-white/10"
              onClick={() => setShowBanner(false)}
            >
              <X className="h-6 w-6" />
            </Button>

            {/* Content Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Image Section */}
              <div className="relative h-64 rounded-lg overflow-hidden">
                <img
                  src={popupBannerData.imageUrl}
                  alt="Special Offer"
                  className="object-cover w-full h-full"
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-col justify-center">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {popupBannerData.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {popupBannerData.description}
                </p>

                {/* Timer */}
                <div className="bg-primary/10 p-4 rounded-lg mb-6">
                  <p className="text-primary font-semibold text-center">
                    ⏳ অফার শেষ হতে বাকি: {timeLeft}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <Button className="flex-1 bg-primary hover:bg-primary/90">
                    {popupBannerData.buyNowText}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    {popupBannerData.learnMoreText}
                  </Button>
                </div>
              </div>
            </div>

            {/* Watermark Text */}
            {/* <p className="absolute bottom-4 right-4 text-sm text-gray-400">
              {popupBannerData.watermarkText}
            </p> */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AllCoursesPopupBanner;
