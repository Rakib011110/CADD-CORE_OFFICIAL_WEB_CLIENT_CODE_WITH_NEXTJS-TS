"use client";
import { useState } from "react";
import CoursesBanner from "@/components/pages/@courses/CourseBanner";
import CourseCard from "@/components/UI/CourseCard/CourseCard";
import { Category } from "@/lib/courses";
import { useGetAllCourseQuery } from "@/redux/api/courseApi";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";



type CategoryWithAll = Category | "All";

export default function AllCourses() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithAll>("All");

  // Our array of categories (including 'All')
  const categories: CategoryWithAll[] = ["All", "Civil", "Architectural", "Mechanical", "Electrical", "Bim"];

  const { data: coursesResponse, error, isLoading } = useGetAllCourseQuery({});

  // Always work with an array of courses
  const coursesArray = coursesResponse?.data || [];

  const filteredCourses =
  selectedCategory === "All"
    ? Array.from(
        new Map(
          coursesArray.map((course: any) => [course.slug, course])
        ).values()
      )
    : coursesArray.filter((course: any) => course.categories === selectedCategory);

  return (
    <div style={{ fontFamily: "banglaFont" }}>
      <CoursesBanner />

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-3 mb-8 items-center justify-center text-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 rounded-md text-sm font-medium transition-colors
                  ${selectedCategory === category
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-blue-200 hover:bg-blue-50"
                  }`}
              >
                {category === "All" ? "All Courses" : category}
              </button>
            ))}
          </div>

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
             <div className="container mx-auto flex  justify-evenly items-center ">
              <LoadingSpinner/>
             
             </div>
            ) : (
              filteredCourses.map((course: any) => (
                <CourseCard key={course._id} {...course} />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
