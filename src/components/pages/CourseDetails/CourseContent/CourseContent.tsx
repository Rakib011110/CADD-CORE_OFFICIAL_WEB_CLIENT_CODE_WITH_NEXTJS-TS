"use client";

import { useState } from "react";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import { TCourse } from "@/lib/courses";

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
            course.topicsCovered.map((topic) => (
              <div
                key={topic._id}
                className="bg-white shadow-sm rounded-md p-4 cursor-pointer"
                onClick={() => handleToggle(topic._id as any) }
              >
                {/* Header: Check Icon + Title + Chevron */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="text-yellow-500 w-5 h-5" />
                    <span className="text-gray-800 font-medium">
                      {topic.topicTitle || "শিরোনাম পাওয়া যায়নি"}
                    </span>
                  </div>

                  {/* Chevron Icon */}
                  {openItem === topic._id ? (
                    <ChevronUp className="text-gray-600 w-5 h-5" />
                  ) : (
                    <ChevronDown className="text-gray-600 w-5 h-5" />
                  )}
                </div>

                {/* Collapsible Content */}
                {openItem === topic._id && (
                  <div className="mt-3 text-gray-700 border-l-2 border-yellow-500 pl-3">
                    {topic.topicDescription || "বর্ণনা পাওয়া যায়নি"}
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">কোনো তথ্য পাওয়া যায়নি।</p>
          )}
        </div>
      </div>
    </section>
  );
}
