"use client";
import { CheckCircle } from "lucide-react";

import { TCourse } from "@/lib/courses";
import Link from "next/link";
import DetailsHeadNav from "@/components/pages/CourseDetails/DetailsHeadNav/DetailsHeadNav";
import Image from "next/image";

export default function IndrustrialTrainingDetailsBanner({ course }: { course: TCourse }) {
   
  
  // const formattedFee = new Intl.NumberFormat("en-IN").format(course?.courseFee || 0); 

  const formattedFee= new Intl.NumberFormat("en-IN").format(course?.courseFee || 0)



  return (
    <section className="max-w-7xl mx-auto px-">
    {/* Use flex-col on mobile, row on md+ */}
    <div className="flex flex-col md:flex-row gap-7">
     
      <div className="md:w-1/4 order-2 md:order-1">
        <DetailsHeadNav />
      </div>

      <div className="md:w-3/4 order-1 md:order-2">
     
          <div
            className="relative bg-cover  bg-center bg-no-repeat "
            style={{ backgroundImage: `url(https://res.cloudinary.com/dbkwiwoll/image/upload/v1745483393/a1af9617-b96a-494d-870e-37c3c96e766b_jpbfzz.jpg` }}
          >
       
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Banner Content */}
            <div className="relative z-30 max-w-5xl mx-auto  border-4 border-t-0 border-b-0 border-red-500">
              {/* White Card */}
             <Image className=" h-auto " src={"https://res.cloudinary.com/dbkwiwoll/image/upload/v1745729684/Orange_And_White_Gradient_Workshop_Banner_2_hfxdd2.png"} width={1000} height={900} alt=""/>
            </div>  
            <div className="backdrop-filter backdrop-blur-sm  rounded-md shadow-lg p-6 md:p-8">
                {/* SubTitle */}
                {/* <h4 className="text-sm md:text-base text-red-500 font-semibold mb-2">
                 

                  ইঞ্জিনিয়ারিং এক্সপার্টদের সাথে ক্যারিয়ার গড়ুন
                </h4> */}

                {/* Main Title */}
                {/* <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-100 leading-snug mb-4">
                  {course?.title}
                </h2> */}

             
                <div className="flex flex-wrap items-center gap-5 text-gray-300 font-semibold ">
                  {/* Duration */}

                  <div className="flex flex-wrap gap-4">
                  {/* <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold">
                    ফ্রি ক্লাস দেখতে চাই
                  </button> */}
                 
                 <Link href="https://docs.google.com/forms/d/e/1FAIpQLSe27ZcsU6VdsyYPMD4JO5VwW4d9CI3_HtTG8YRxyo43gyzGWA/viewform">
                 <button className="bg-white text-red-500 border border-red-500 hover:bg-red-50 px-5 py-2 rounded-md font-semibold">
                 ভর্তি ফর্ম
                  </button> 
                 </Link>

                  {/* <button className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md font-semibold">
                  কোর্স ফি {formattedFee} টাকা
                  </button> */}
                </div>
                  <div className="flex items-center gap-2 border-l-4 border-red-500 pl-3">
                    <CheckCircle className="text-red-500 w-5 " />
                    <span>{course?.courseIncludes.duration}</span>
                  </div>

                  {/* Lessons */}
                  <div className="flex items-center gap-2 border-l-4 border-red-500 pl-3">
                    <CheckCircle className="text-red-500 w-5 " />
                    <span>{course?.lessons}</span>
                  </div>

                  {/* Projects */}
                  <div className="flex items-center gap-2 border-l-4 border-red-500 pl-3">
                    <CheckCircle className="text-red-500 w-5 " />
                    <span>{course?.projects}</span>
                  </div>
                </div>

                {/* Buttons */}
              
              </div>

          </div>
      </div>
    </div>
  </section>
  );
}
