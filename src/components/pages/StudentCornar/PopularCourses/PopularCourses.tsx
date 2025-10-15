"use client"
import OurCourses from "@/components/Home/OurCourses/OurCourses";
import { Card } from "@/components/UI/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/UI/carousel";
import {  TCourse } from "@/lib/courses";
import { useGetAllCourseQuery } from "@/redux/api/courseApi";
import { Book, Clock, Settings } from "lucide-react";
import Link from "next/link";

export default function PopularCourses() { 

const { data: courses, isLoading } = useGetAllCourseQuery({});

if (isLoading) {
    return <div className="text-center py-10 text-lg font-semibold">Loading...</div>;
}

  return (
    <div className="max-w-6xl mx-auto mb-10">
   <OurCourses/>
    </div>
  );
}