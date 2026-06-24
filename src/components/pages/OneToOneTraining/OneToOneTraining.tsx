"use client";

import { useMemo, useState } from "react";
import CourseCard from "@/components/UI/CourseCard/CourseCard";
import { TCourse } from "@/lib/courses";
import { useGetAllCourseQuery } from "@/redux/api/courseApi";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";

// One-to-One training banner image.
// 👉 এখানে আপনার হোস্ট করা ব্যানারের URL বসান (সাইটের অন্য ব্যানারগুলোর মতো
//    একটা Cloudinary লিংক)। প্রস্তাবিত সাইজ ~2172×724 (≈ 3:1)।
const BANNER_IMG = "https://res.cloudinary.com/dalpf8iip/image/upload/v1782211594/ChatGPT_Image_Jun_23_2026_04_29_50_PM_ssjnzb.png";

// Normalize a course's `categories` (string | string[]) into a clean list.
const normalizeCategories = (categories: unknown): string[] => {
  if (!categories) return [];
  const arr = Array.isArray(categories) ? categories : [categories];
  return arr
    .flatMap((c) => String(c).split(","))
    .map((c) => c.trim())
    .filter(Boolean);
};

export default function OneToOneTraining() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const { data: coursesResponse, isLoading } = useGetAllCourseQuery({});

  // Only One-to-One training courses belong on this page.
  const oneToOneCourses = useMemo(
    () =>
      (coursesResponse?.data || []).filter(
        (course: any) => course.courseType === "one-to-one"
      ),
    [coursesResponse]
  );

  // Build tabs dynamically from the categories actually present.
  const categories = useMemo(() => {
    const set = new Set<string>();
    oneToOneCourses.forEach((course: any) =>
      normalizeCategories(course.categories).forEach((c) => set.add(c))
    );
    return ["All", ...Array.from(set)];
  }, [oneToOneCourses]);

  const filteredCourses = useMemo(() => {
    if (selectedCategory === "All") return oneToOneCourses;
    return oneToOneCourses.filter((course: any) =>
      normalizeCategories(course.categories).includes(selectedCategory)
    );
  }, [oneToOneCourses, selectedCategory]);

  return (
    <div style={{ fontFamily: "banglaFont" }}>
      {/* ---------- Banner (image) ---------- */}
      <section className="w-full bg-white border-b-4 border-gray-400">
        <img
          src={BANNER_IMG}
          alt="One to One Professional Training — CAD, BIM, Structural Design"
          className="block w-full h-auto"
        />
      </section>

      {/* ---------- Tabs + Courses ---------- */}
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Filter Buttons */}
          {categories.length > 1 && (
            <div className="flex justify-center mb-10">
              <div className="bg-gray-100 rounded-full p-1.5 flex flex-wrap justify-center gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 sm:px-6 py-2.5 rounded-md text-sm font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50
                      ${
                        selectedCategory === category
                          ? "bg-black text-white shadow-md"
                          : "bg-transparent text-black hover:bg-white hover:shadow-sm"
                      }`}
                  >
                    {category === "All" ? "All Courses" : category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="col-span-full flex justify-center items-center min-h-[200px]">
                <LoadingSpinner />
              </div>
            ) : filteredCourses.length > 0 ? (
              filteredCourses.map((course: TCourse) => (
                <CourseCard key={course._id} {...course} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 text-lg">
                  এই মুহূর্তে কোনো One to One Training কোর্স পাওয়া যায়নি।
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
