"use client";

import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp, BookOpen, Clock, Target } from "lucide-react";
import { TCourse } from "@/lib/courses";
import { AnimatePresence, motion } from "framer-motion";

export default function CourseContentList({ course }: { course: TCourse }) {
  const [openItem, setOpenItem] = useState<string | null>(null);

  // Toggle function to expand/collapse an item
  const handleToggle = (id: string) => {
    setOpenItem((prev) => (prev === id ? null : id));
  };

  console.log("Topics Covered:", course?.topicsCovered); // Debugging

  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-red-50 py-12 px-4" style={{ fontFamily: "banglaFont" }}>
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-600 to-red-700 rounded-full mb-4 shadow-lg">
            <BookOpen className="w-8 h-8 text-white" />
          </div> */}
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
            এই কোর্সে যা যা থাকবে
          </h2>
          <div className="flex justify-center mb-4">
            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-red-700 rounded-full"></div>
          </div>
          <p className="text-base text-gray-700 max-w-3xl mx-auto leading-relaxed">
            আপনার শিক্ষার যাত্রায় প্রয়োজনীয় সব কিছু এখানে পাবেন। বিস্তারিত কারিকুলাম দেখে নিশ্চিত হোন।
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{course?.duration || "N/A"}</h3>
            <p className="text-gray-600 font-medium">কোর্সের সময়কাল</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow duration-300"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full mb-4">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{course?.lessons || "N/A"}</h3>
            <p className="text-gray-600 font-medium">পাঠের সংখ্যা</p>
          </motion.div>
        </div>

        {/* Topics List */}
        <div className="space-y-4">
          {course?.topicsCovered && course.topicsCovered.length > 0 ? (
            course.topicsCovered.map((topic, index) => (
              <motion.div
                key={topic._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 group"
              >
                <div
                  className="flex items-center justify-between px-6 py-5 cursor-pointer group-hover:bg-red-50/50 transition-colors duration-300"
                  onClick={() => handleToggle(topic._id as string)}
                >
                  {/* Icon + Title + Index */}
                  <div className="flex items-center gap-5">
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="relative"
                    >
                      <div className="absolute inset-0 bg-red-100 rounded-full scale-0 group-hover:scale-100 transition-transform duration-300"></div>
                      <div className="relative p-3 w-12 h-12 text-center justify-center items-center bg-gradient-to-r from-red-500 to-red-600 rounded-full shadow-lg">
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                    </motion.div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 group-hover:text-red-600 transition-colors duration-300 mb-1">
                        {topic.topicTitle || "শিরোনাম পাওয়া যায়নি"}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        
                        <span className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          সম্পূর্ণ গাইডেড
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Chevron Icon */}
                  <motion.div
                    animate={{
                      rotate: openItem === topic._id ? 180 : 0,
                      scale: openItem === topic._id ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className="p-3 rounded-full bg-red-100 group-hover:bg-red-200 transition-colors duration-300"
                  >
                    {openItem === topic._id ? (
                      <ChevronUp className="w-6 h-6 text-red-600" />
                    ) : (
                      <ChevronDown className="w-6 h-6 text-red-600" />
                    )}
                  </motion.div>
                </div>

                {/* Collapsible Content */}
                <AnimatePresence>
                  {openItem === topic._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6">
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="bg-gradient-to-r from-red-50 to-transparent border-l-4 border-red-500 p-4 rounded-r-lg"
                        >
                          <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-full">
                              <Target className="w-5 h-5 text-red-600" />
                            </div>
                            <div>
                              <h5 className="font-semibold text-gray-900 mb-2">এই টপিকে আপনি শিখবেন:</h5>
                              <p className="text-gray-700 leading-relaxed">
                                {topic.topicDescription || "বর্ণনা পাওয়া যায়নি"}
                              </p>
                            </div>
                          </div>

                          {/* Learning Outcomes */}
                          {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.3 }}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>প্র্যাকটিক্যাল এক্সারসাইজ</span>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.4 }}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>রিয়েল প্রজেক্ট ওয়ার্ক</span>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.5 }}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>ইন্ডাস্ট্রি স্ট্যান্ডার্ড</span>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.6 }}
                              className="flex items-center gap-2 text-sm text-gray-600"
                            >
                              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                              <span>সার্টিফিকেট প্রাপ্তি</span>
                            </motion.div>
                          </div> */}
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 bg-white rounded-2xl shadow-lg"
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">কোনো তথ্য পাওয়া যায়নি</h3>
              <p className="text-gray-500">এই কোর্সের বিস্তারিত তথ্য শীঘ্রই যোগ করা হবে।</p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
