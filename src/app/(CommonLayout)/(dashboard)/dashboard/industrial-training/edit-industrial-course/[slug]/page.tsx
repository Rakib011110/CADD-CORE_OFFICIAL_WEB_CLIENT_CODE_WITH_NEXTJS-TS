"use client";

import { useParams } from "next/navigation";
import { useGetIndrustrialCourseBySlugQuery } from "@/redux/api/indrustrialcourseApi";
import CourseForm from "@/components/pages/CourseForm/CourseForm";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";

export default function EditIndustrialCoursePage() {
  const params = useParams();
  const slug = params?.slug as string | undefined;

  const { data, isLoading, isError } = useGetIndrustrialCourseBySlugQuery(slug, {
    skip: !slug,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="p-6 text-center text-lg font-semibold text-red-600">
        Industrial course not found.
      </div>
    );
  }

  return <CourseForm mode="edit" initialData={data.data} isIndustrial={true} />;
}
