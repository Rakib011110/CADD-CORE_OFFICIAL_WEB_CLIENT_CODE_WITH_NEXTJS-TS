"use client";

import { TCourse } from "@/lib/courses";
import { useGetAllCourseQuery } from "@/redux/api/courseApi";
import CourseCard from "@/components/UI/CourseCard/CourseCard";
import HomeSection, { Highlight } from "@/components/Home/HomeSection";

// Two full rows of three on large screens
const HOME_COURSE_LIMIT = 6;

export default function OurCourses() {
  const { data, isLoading } = useGetAllCourseQuery({});
  const courses: TCourse[] = data?.data || [];

  return (
    <HomeSection
      id="courses"
      eyebrow="মাস্টারকোর্স"
      title={
        <>
          আমাদের <Highlight>জনপ্রিয় কোর্স</Highlight> সমূহ
        </>
      }
      action={{
        label: `সব কোর্স দেখুন${courses.length ? ` (${courses.length.toLocaleString("bn-BD")})` : ""}`,
        href: "/courses",
      }}
      subtitle="">
      {isLoading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[26rem] animate-pulse rounded-2xl bg-zinc-100" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, HOME_COURSE_LIMIT).map((course) => (
            <CourseCard key={course._id} {...course} />
          ))}
        </div>
      )}

    </HomeSection>
  );
}
