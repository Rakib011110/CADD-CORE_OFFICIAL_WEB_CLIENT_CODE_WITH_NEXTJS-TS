"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function IndustrialFormSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="bg-[#fff1f1] py-16"
    >
      <div className="max-w-5xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">
          আপনার ইন্ডাস্ট্রিয়াল এটাচমেন্ট  ট্রেনিং এর জন্য বিস্তারিত জানুন
        </h2>
        <p className="text-gray-600 mb-8">
          প্রশিক্ষণ সংক্রান্ত সকল তথ্য ও ফর্ম পূরণ করতে নিচের বাটনে ক্লিক করুন।
        </p>
        <Link href="https://docs.google.com/forms/d/e/1FAIpQLSfXXXXXXXXXXX/viewform" passHref>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-red-500 hover:bg-red-600 transition text-white font-semibold py-3 px-8 rounded-full text-lg shadow-md"
          >
            বিস্তারিত জানুন / ফর্ম পূরণ করুন
          </motion.button>
        </Link>
      </div>
    </motion.section>
  );
}
