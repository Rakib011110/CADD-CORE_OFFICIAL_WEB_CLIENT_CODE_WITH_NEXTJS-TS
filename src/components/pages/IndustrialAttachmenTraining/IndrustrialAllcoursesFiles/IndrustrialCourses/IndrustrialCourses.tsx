"use client";
import { useGetAllIndrustrialCourseQuery } from "@/redux/api/indrustrialcourseApi";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import { motion } from "framer-motion";
import { Globe, Briefcase, Award, Zap } from "lucide-react";
import IndustrialCourseCard from "../IndrustrialCourseCard/IndrustrialCourseCard";

export default function IndrustrialAllCourses() {
  const { data: coursesResponse, isLoading } = useGetAllIndrustrialCourseQuery({});
  const coursesArray = coursesResponse?.data || [];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 py-16">
      {/* Animated Hero Section */}
    <motion.div  
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
  className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-20"
>
  <div className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
    ইন্ডাস্ট্রি-রেডি স্কিলস
  </div>
  <h1 className="text-4xl relative md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
    ক্যারিয়ার গড়ার পথে একটি <span className="text-red-500">স্মার্ট শুরু</span> হোক এখান থেকেই!
   <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-red-600 rounded-full"></span>
  </h1>
<p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
  এখনই শিখুন বাস্তব কাজের দক্ষতা।<br />
  ইন্ডাস্ট্রিয়াল কোর্সে শিখুন সফটওয়্যার ও প্রজেক্ট কাজ হাতে-কলমে।
</p>


</motion.div>




      {/* Floating Course Cards */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <LoadingSpinner  />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 relative">
            {/* Decorative elements */}
            <div className="hidden lg:block absolute -top-20 -left-20 w-40 h-40 rounded-full bg-red-200 opacity-20 blur-xl"></div>
            <div className="hidden lg:block absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-red-400 opacity-20 blur-xl"></div>
            
            {coursesArray.map((course: any, index: number) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                whileHover={{ y: -10 }}
                className="relative z-10"
              >
                <IndustrialCourseCard {...course} variant={index % 3} />
              </motion.div>
            ))}
          </div>
        </div>
      )}

     {/* মানসম্পন্ন বৈশিষ্ট্যসমূহ - আমাদের বিশেষত্ব */} 
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
  <motion.div
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="bg-white rounded-2xl shadow-xl overflow-hidden"
  >
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-gray-200">
      
      <div className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 p-3 rounded-full">
            <Globe className="w-8 h-8 text-red-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">ইন্ডাস্ট্রি-অ্যানালাইন্ড কারিকুলাম</h3>
        <p className="text-gray-600">
          ইন্ডাস্ট্রি বিশেষজ্ঞদের সরাসরি পরামর্শে প্রস্তুতকৃত আপডেটেড ও বাস্তবভিত্তিক কোর্স কাঠামো।
        </p>
      </div>

      <div className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-orange-100 p-3 rounded-full">
            <Briefcase className="w-8 h-8 text-orange-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">প্রজেক্ট-ভিত্তিক শিক্ষা</h3>
        <p className="text-gray-600">
          হাতে-কলমে শেখা রিয়েল-ওয়ার্ল্ড প্রজেক্ট ও কেস স্টাডির মাধ্যমে, বাস্তব দক্ষতা অর্জনের নিশ্চয়তা।
        </p>
      </div>

      <div className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-amber-100 p-3 rounded-full">
            <Award className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">প্রফেশনাল সার্টিফিকেশন</h3>
        <p className="text-gray-600">
          কোর্স শেষে স্বীকৃত সার্টিফিকেট যা আপনার পোর্টফোলিও ও ক্যারিয়ারে যুক্ত করবে নতুন মাত্রা।
        </p>
      </div>

      <div className="p-8 text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-yellow-100 p-3 rounded-full">
            <Zap className="w-8 h-8 text-yellow-600" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">দ্রুত গতির শেখা</h3>
        <p className="text-gray-600">
          কম সময়ে বেশি শিখুন — ইন্টেনসিভ ট্রেইনিং যা আপনাকে দ্রুত প্রস্তুত করে তুলবে চাকরি বা ফ্রিল্যান্সিংয়ের জন্য।
        </p>
      </div>

    </div>
  </motion.div>
</div>

    </div>
  );
}