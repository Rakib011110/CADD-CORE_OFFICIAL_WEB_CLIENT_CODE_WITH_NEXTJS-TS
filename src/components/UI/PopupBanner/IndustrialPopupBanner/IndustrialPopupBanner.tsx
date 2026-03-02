"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/UI/button";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useGetAllindustrialOfferBannerQuery } from "@/redux/api/industrialOfferBannerApi";

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

  // ✅ Auto-hide after 5 minutes if not hovering
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showBanner && !isHovering) {
      timer = setTimeout(() => setShowBanner(false), 300000); // 5 minutes
    }
    return () => clearTimeout(timer);
  }, [showBanner, isHovering]);

  // ✅ Countdown Timer Calculation
  useEffect(() => {
    if (!selectedBanner?.date || !selectedBanner?.time) return;

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const offerEnd = new Date(
        `${selectedBanner.date}T${selectedBanner.time}`,
      ).getTime();
      const distance = offerEnd - now;

      if (distance <= 0) {
        setTimeLeft("সময় শেষ!");
        setShowBanner(false); // সময় শেষ হলে ব্যানার hide
        clearInterval(interval);
      } else {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft(
          `${days} দিন ${hours} ঘণ্টা ${minutes} মিনিট ${seconds} সেকেন্ড`,
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
            className="relative bg-gradient-to-br from-red-500 via-white to-blue-50 dark:from-red-700 dark:via-gray-900 dark:to-blue-900 rounded-3xl shadow-2xl p-8 max-w-6xl w-full mx-4 overflow-hidden border border-white/20"
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
              className="absolute top-5 text-xl lg:right-4 md:right-0 right-0 z-50 bg-gray-950 text-white text-md w-10 h-10 rounded-full hover:bg-gray-400"
              onClick={() => setShowBanner(false)}
            >
              <X className="h-10 w-10" />
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
                <h2 className="text-3xl font-bold mb-4 ">
                  {selectedBanner.title}
                </h2>
                <p className="text-base mb-6 leading-relaxed">
                  {selectedBanner.description}
                </p>

                {/* Timer */}
                <div className="bg-red-600 p-4 rounded-xl mb-6 text-center text-white shadow-[0_0_20px_rgba(239,68,68,0.7)] border-2 border-red-400 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20  duration-700"></div>
                  <div className="font-bold text-yellow-100 text-sm md:text-base uppercase tracking-wider mb-2 relative z-10 flex flex-col items-center justify-center">
                    <span className="flex items-center gap-2">
                      সীমিত আসন! স্কলারশিপ শেষ হওয়ার আগেই দ্রুত রেজিস্ট্রেশন
                      করুন।
                    </span>
                  </div>
                  <div className="font-extrabold text-xl md:text-2xl drop-shadow-md relative z-10 bg-black/20 py-2 rounded-lg border border-red-500/50">
                    ⏳ {timeLeft}
                  </div>
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

                  {/* <Link href={selectedBanner.buyNowText} target="_blank">
                    <Button className="flex-1 bg-red-500 animate-pulse text-2xl hover:bg-red-600 text-white font-bold cursor-pointer">
                      Join Now
                    </Button>
                  </Link> */}
                </div>

                {/* Contact Options */}
                <div className="mt-6 flex flex-col gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 w-full">
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1 text-center">
                    বিস্তারিত জানতে বা ভর্তি হতে যোগাযোগ করুন:
                  </p>

                  <a
                    href={`https://api.whatsapp.com/send?phone=8801611223631&text=Hello,%20I'm%20interested%20in%20the%20"${encodeURIComponent(selectedBanner.title)}"`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center items-center gap-2 bg-[#25D366] hover:bg-[#1ebd5c] text-white py-3 px-6 rounded-lg font-bold text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 w-full"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 1.833 6.366L0 24l5.808-1.503A11.94 11.94 0 0 0 11.944 24c6.627 0 12-5.373 12-12s-5.373-12-12-12zm.056 21.94c-1.898 0-3.729-.485-5.36-1.408l-3.86 1l1.026-3.712A10.02 10.02 0 0 1 2 12C2 6.477 6.477 2 12 2s10 10 10 10-4.477 10-10 10zm5.49-7.394c-.304-.152-1.782-.871-2.057-.973-.275-.102-.477-.152-.68.152s-.782.973-.96 1.173-.346.223-.65.071c-3.14-1.576-4.576-3.515-5.111-4.43-.106-.182.011-.282.164-.433.136-.135.304-.356.456-.534.152-.178.203-.305.304-.508.102-.203.051-.381-.025-.533-.076-.152-.68-1.638-.934-2.242-.246-.588-.496-.508-.68-.517h-.58c-.203 0-.533.076-.812.381-.279.305-1.066 1.042-1.066 2.541s1.091 2.946 1.244 3.149c.152.203 2.146 3.277 5.19 4.549 2.053.861 2.825.922 3.862.774 1.134-.162 3.49-1.426 3.982-2.804.492-1.378.492-2.559.346-2.804-.146-.245-.526-.397-.83-.55z" />
                    </svg>
                    WhatsApp - 01611 22 36 31
                  </a>

                  <a
                    href="tel:09613202060"
                    className="flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-bold text-lg shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 w-full"
                  >
                    <span>📞</span> Hotline - 09613 20 20 60
                  </a>
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
