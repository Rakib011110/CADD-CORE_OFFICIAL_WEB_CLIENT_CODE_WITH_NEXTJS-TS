"use client";
import { useState } from "react";
import CoursesBanner from "@/components/pages/@courses/CourseBanner";
import CourseCard from "@/components/UI/CourseCard/CourseCard";
import { Category, TCourse } from "@/lib/courses";
import { useGetAllCourseQuery } from "@/redux/api/courseApi";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";

type CategoryWithAll = Category | "All";

export default function AllCourses() {
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryWithAll>("All");

  // Our array of categories (including 'All')
  const categories: CategoryWithAll[] = [
    "All",
    "Civil",
    "Architectural",
    "BIM",
    "Mechanical",
    "Project Management",
  ];

  const { data: coursesResponse, error, isLoading } = useGetAllCourseQuery({});

  // Always work with an array of courses
  const coursesArray = coursesResponse?.data || [];

  // ✅ Simplified filtering logic
  const filteredCourses = selectedCategory === "All" 
    ? coursesArray
    : coursesArray.filter((course: any) => {
        // Ensure categories exists and handle both string and array
        if (!course.categories) return false;
        
        // Convert to array if it's a string
        const categoryArray = Array.isArray(course.categories) 
          ? course.categories 
          : [course.categories];
        
        // Check if selected category exists in the array
        return categoryArray.includes(selectedCategory);
      });

  return (
    <div style={{ fontFamily: "banglaFont" }}>
      <CoursesBanner />

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Filter Buttons */}
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

          {/* Course Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              <div className="container mx-auto flex justify-center items-center min-h-[200px]">
                <LoadingSpinner />
              </div>
            ) : filteredCourses.length > 0 ? (
              filteredCourses.map((course: TCourse) => (
                <CourseCard key={course._id} {...course} />
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-gray-500 text-lg">
                  No courses found for "{selectedCategory}" category.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}