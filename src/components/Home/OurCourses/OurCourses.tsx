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




export default function OurCourses() {
const { data: courses, isLoading } = useGetAllCourseQuery({});

if (isLoading) {
    return <div className="text-center py-10 text-lg font-semibold">Loading...</div>;  

}
  return (
    <section>

<div className="max-w-6xl mx-auto ">
      <h2 className="text-3xl font-bold text-center mb-6">
        আমাদের জনপ্রিয় কোর্স সমূহ
      </h2>
      <div className="flex justify-center mb-6">
        <span className="inline-block w-24 h-1 bg-red-500 rounded"></span>
      </div>

      <Carousel opts={{ align: "center" }} className="w-full max-w-7xl mx-auto">
        <CarouselContent>
          {courses?.data?.map((course:TCourse) => ( 

            
            <CarouselItem
              key={course._id}
              className="md:basis-1/2 lg:basis-1/3 p-4"
            >
             <CourseCard key={course._id} {...course}/>
            </CarouselItem>
          ))}
        </CarouselContent>

      
        <CarouselPrevious className="bg-red-600 text-white" />
        <CarouselNext  className="bg-red-600 text-white"/>
      </Carousel>

  
      <div className="text-center mt-6">
        <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-semibold">
          <Link href={"/courses"}> 
          সকল কোর্স
          </Link>
        </button>
      </div>
    </div>
    </section>
  );
}
