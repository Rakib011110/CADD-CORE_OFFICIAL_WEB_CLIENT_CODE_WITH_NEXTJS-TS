"use client";
import { ArrowRight, CheckCircle } from "lucide-react";
import DetailsHeadNav from "../DetailsHeadNav/DetailsHeadNav";
import { TCourse } from "@/lib/courses";

import { useUser } from "@/context/user.provider";
import EnrollModal from "../EnrollCourse/EnrollModal";
import { useState } from "react";
import { Link as ScrollLink } from "react-scroll";
import Link from "next/link";

export default function DetailsBannar({ course }: { course: TCourse }) {
  const { user } = useUser();
  const [showModal, setShowModal] = useState(false);

  // const formattedFee = new Intl.NumberFormat("en-IN").format(
  //   course?.courseFee || 0
  // );

  return (
    <section className="max-w-6xl mx-auto px-">
      {/* Use flex-col on mobile, row on md+ */}
      <div className="flex flex-col md:flex-row gap-7">
        <div className="md:w-1/4 order-2 md:order-1">
          <DetailsHeadNav />
        </div>

        <div className="md:w-3/4 order-1 md:order-2">
          <div
            className="relative bg-cover bg-center bg-no-repeat py-12 mb-6"
            style={{
              backgroundImage: `url(https://res.cloudinary.com/dbkwiwoll/image/upload/v1745303896/vecteezy_abstract-digital-background-with-technology-circuit-board_7872260_tzdhgv.jpg`,
            }}>
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Banner Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4">
              {/* White Card */}
              <div className="backdrop-filter backdrop-blur-sm  rounded-md shadow-lg p-6 md:p-8">
                {/* SubTitle */}
                <h4 className="text-sm md:text-base bg-white p-1 rounded-md w-fit text-red-500 font-semibold mb-2">
                  {/* {banner.subTitle} */}
                  ইঞ্জিনিয়ারিং এক্সপার্টদের সাথে ক্যারিয়ার গড়ুন
                </h4>

                {/* Main Title */}
                <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-100 leading-snug mb-4">
                  {course?.title}
                </h2>

                <p className=" text-gray-100 leading-relaxed mb-4 text-justify">
                  {course?.description}
                </p>

               <div className="flex border-2 p-2 border--700  flex-wrap items-center gap-2 text-gray-300 font-semibold mb-6 text-sm">
  {/* Duration */}
  {course?.courseIncludes?.duration && (
    <div className="flex items-center gap-2 border-l-4 border-red-500 pl-2">
      <CheckCircle className="text-gray-200 w-4 h-4" />
      <span>{course.courseIncludes.duration}</span>
    </div>
  )}

 

  

  {/* Live Sessions */}
  {course?.courseIncludes?.liveSessions && (
    <div className="flex items-center gap-2 border-l-4 border-red-500 pl-2">
      <CheckCircle className="text-gray-200 w-4 h-4" />
      <span>{course.courseIncludes.liveSessions}</span>
    </div>
  )}

  {/* Certificate */}
  {course?.courseIncludes?.certificate && (
    <div className="flex items-center gap-2 border-l-4 border-red-500 pl-2">
      <CheckCircle className="text-gray-200 w-4 h-4" />
      <span>{course.courseIncludes.certificate}</span>
    </div>
  )}

  {/* On Job Training */}
  {course?.courseIncludes?.onJobTraining && (
    <div className="flex items-center gap-2 border-l-4 border-red-500 pl-2">
      <CheckCircle className="text-gray-200 w-4 h-4" />
      <span>{course.courseIncludes.onJobTraining}</span>
    </div>
  )}

  {/* Projects */}
  {course?.courseIncludes?.projects && (
    <div className="flex items-center gap-2 border-l-4 border-red-500 pl-2">
      <CheckCircle className="text-gray-200 w-4 h-4" />
      <span>{course.courseIncludes.projects}</span>
    </div>
  )}
  {/* Experience Letter */}
  {course?.courseIncludes?.experienceLetter && (
    <div className="flex items-center gap-2 border-l-4 border-red-500 pl-2">
      <CheckCircle className="text-gray-200 w-4 h-4" />
      <span>{course.courseIncludes.experienceLetter}</span>
    </div>
  )}

  

</div>





                <div className="flex flex-wrap gap-4">
                

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                   <ScrollLink
                    to="payment-section" // Target ID for the enrollment/payment section
                    smooth={true}
                    duration={800}
                    offset={-100}
                  >
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-transform duration-300 hover:scale-105 shadow-lg shadow-red-500/20">
                      <span>ভর্তি হোন</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </ScrollLink>
                  
                  <ScrollLink
                to="payment-section" 
                    smooth={true}
                    duration={800}
                    offset={-100}
                  >
                    <button className="w-full sm:w-auto bg-gray-950 border border-white/20 hover:bg-white/20 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                      কোর্স ফি দেখুন
                    </button>
                  </ScrollLink>
                    <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-semibold transition-transform duration-300 hover:scale-105 shadow-lg shadow-red-500/20">
                     <Link href="https://docs.google.com/forms/d/e/1FAIpQLScZysZu-d44Md-KbsIPXOX-wuoobxWbcBaXN04ITkgWYNR6Fw/viewform">  জয়েন ফ্রি সেমিনার  </Link>
                    </button>
                </div>

                  <div className="payment-section">
                    <EnrollModal
                      open={showModal}
                      onClose={() => setShowModal(false)}
                      courseId={course._id}
                      courseTitle={course.title}
                      courseFee={course.courseFee}
                      startDate={course?.schedule.startingDate}
                      user={user}
                      // initiatePayment={initiatePayment}
                    />

                    {/* <button
                      onClick={() => setShowModal(true)}
                      className="bg-red-500 text-white px-5 py-2 rounded-md">
                      Enroll করুন
                    </button> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
