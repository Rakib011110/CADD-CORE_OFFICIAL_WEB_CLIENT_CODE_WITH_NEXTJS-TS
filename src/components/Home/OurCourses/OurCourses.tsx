import { Card } from "@/components/UI/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/UI/carousel";
import { TCourse } from "@/lib/courses";
import { useGetAllCourseQuery } from "@/redux/api/courseApi";
import Link from "next/link";
import { Book, Clock, Settings } from 'lucide-react';
import CourseCard from "@/components/UI/CourseCard/CourseCard";
import { useEffect, useState } from "react";
import Autoplay from "embla-carousel-autoplay";
import Loading from "@/app/(CommonLayout)/(dashboard)/loading";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";

export default function OurCourses() {
  const { data: courses, isLoading } = useGetAllCourseQuery({});
  const [isHovered, setIsHovered] = useState(false);

  if (isLoading) {
    return <div className="text-center py-10 text-lg font-semibold"> 
    
    <LoadingSpinner/>
    </div>;
  }

  return (
    <section>
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mt-8 mb-4">
          আমাদের জনপ্রিয় কোর্স সমূহ
        </h2>
        <div className="flex justify-center mb-6">
          <span className="inline-block w-24 h-1 bg-red-500 rounded"></span>
        </div>

        <div 
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Carousel 
            opts={{ 
              align: "center",
              loop: true,
            }}
            plugins={[
              Autoplay({ 
                delay: 3000,
                stopOnInteraction: false,
                stopOnMouseEnter: true,
              }) as any // Add 'as any' to bypass type incompatibility if needed
            ]}
            className="w-full max-w-7xl mx-auto relativ  p-2"
          >
            <CarouselContent>
              {courses?.data?.map((course: TCourse) => (
                <CarouselItem
                  key={course._id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <CourseCard key={course._id} {...course} />
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Only show arrows when hovered */}
        
              <>
               <div className="hidden md:block">
                 <CarouselPrevious className="bg-gray-950  text-white" />
        <CarouselNext  className="bg-gray-950 text-white "/>
               </div>
              </>
        
          </Carousel>
        </div>

        <div className="text-center mt-6">
          <button className="bg-red-500 hover:bg-gray-950 text-white px-6 py-3 rounded-full font-semibold transition-colors duration-300">
            <Link href={"/courses"}>
              সকল কোর্স
            </Link>
          </button>
        </div>
      </div>
    </section>
  );
}