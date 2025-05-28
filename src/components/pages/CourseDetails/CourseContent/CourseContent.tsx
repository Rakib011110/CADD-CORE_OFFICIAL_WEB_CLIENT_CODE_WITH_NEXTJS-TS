"use client";

import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
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
    <section style={{ fontFamily: "banglaFont" }}  className="bg-[#e8f8f8] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          এই কোর্সে যা যা থাকবে
        </h2>

         <div className="space-y-4">
          {course?.topicsCovered && course.topicsCovered.length > 0 ? (
            course.topicsCovered.map((topic, index) => (
              <motion.div
                key={topic._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100"
              >
                <div
                  className="flex items-center justify-between px-6 py-5 cursor-pointer"
                  onClick={() => handleToggle(topic._id as string)}
                >
                  {/* Icon + Title */}
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="p-2 bg-red-50 rounded-full"
                    >
                      <CheckCircle className="text-red-500 w-6 h-6" />
                    </motion.div>
                    <h4 className="text-lg font-semibold text-gray-800">
                      {topic.topicTitle || "শিরোনাম পাওয়া যায়নি"}
                    </h4>
                  </div>

                  {/* Chevron Icon */}
                  <motion.div
                    animate={{
                      rotate: openItem === topic._id ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="p-1 rounded-full bg-gray-100"
                  >
                    {openItem === topic._id ? (
                      <ChevronUp className="w-5 h-5 text-red-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-red-500" />
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
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5">
                        <motion.p
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                          className="text-gray-600 border-l-4 border-red-400 pl-4 text-sm leading-relaxed"
                        >
                          {topic.topicDescription || "বর্ণনা পাওয়া যায়নি"}
                        </motion.p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-gray-500 py-8"
            >
              কোনো তথ্য পাওয়া যায়নি।
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
}
