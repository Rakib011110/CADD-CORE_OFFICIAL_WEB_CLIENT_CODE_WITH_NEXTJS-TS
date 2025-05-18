'use client';
import Image from 'next/image';
import { Briefcase, Headset, Monitor, Check, Users, MapPin,  Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const IndustrialSupportAndTraining = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-white py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-transparent -z-0"></div>
        <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-red-100 text-red-600 text-sm font-medium mb-6">
              Industry-Ready Engineers
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
              ডিপ্লোমা ইঞ্জিনিয়ারিং <br className="md:hidden" />
              <span className="text-red-600">ইন্ডাস্ট্রিয়াল এক্সপোজার</span> প্রোগ্রাম
            </h1>
            <div className="flex justify-center mb-8">
              <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full"></div>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              সরাসরি সাইট ভিজিটের মাধ্যমে বাস্তব প্রকৌশল জ্ঞান অর্জন
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section - Student Support */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="p-8">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-red-50 text-red-600 mr-4">
                  <Headset className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  প্রফেশনাল সাপোর্ট সিস্টেম
                </h2>
              </div>
              
              <div className="space-y-5">
                <div className="flex items-start">
                  <Check className="flex-shrink-0 mt-1 mr-3 text-red-600" />
                  <p className="text-gray-700">
                    ইন্ডাস্ট্রি এক্সপার্টদের সাথে সরাসরি পরামর্শ (হোয়াটসঅ্যাপ, ফোন বা ভিডিও কল)
                  </p>
                </div>
                
                <div className="flex items-start">
                  <Monitor className="flex-shrink-0 mt-1 mr-3 text-red-600" />
                  <p className="text-gray-700">
                    লাইভ সেশন ও ব্যবহারিক নির্দেশনায় বাস্তব সমস্যা সমাধান
                  </p>
                </div>
                
                <div className="flex items-start">
                  <Users className="flex-shrink-0 mt-1 mr-3 text-red-600" />
                  <p className="text-gray-700">
                    এক্সক্লুসিভ ইন্ডাস্ট্রি নেটওয়ার্কিং ইভেন্টে অংশগ্রহণ
                  </p>
                </div>
              </div>
              
            <div className="mt-10 group perspective-1000">
  <div className="relative preserve-3d group-hover:rotate-x-5 transition-all duration-500 ease-out">
    {/* Shadow layer */}
    <div className="absolute inset-0 rounded-xl shadow-xl shadow-gray-400/30 group-hover:shadow-gray-400/50 transition-shadow duration-500"></div>
    
    {/* Image with overlay */}
    <div className="overflow-hidden rounded-lg border border-gray-200 relative">
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent z-10"></div>
      <Image 
        src="https://res.cloudinary.com/dalpf8iip/image/upload/v1747216270/WhatsApp_Image_2025-05-14_at_2_13_54_PM-Picsart-AiImageEnhancer_1_xkkw77.png" 
        alt="Student Support" 
        width={600} 
        height={400} 
        className="w-full h-auto object-cover transform group-hover:scale-105 transition duration-700 ease-out"
      />
    </div>
    
    {/* 3D edge effect */}
    <div className="absolute inset-0 rounded-lg border-2 border-white/10 pointer-events-none"></div>
  </div>
</div>
            </div>
          </motion.div>

          {/* Right Section - Industrial Exposure */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
            id='on-job-training'
          >
            <div className="p-8 h-full flex flex-col">
              <div className="flex items-center mb-8">
                <div className="p-3 rounded-lg bg-red-50 text-red-600 mr-4">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">
                  সাইট ভিজিট প্রোগ্রাম
                </h2>
              </div>
              
              <div className="flex-1">
               <p className="text-gray-700 mb-6">
  ডিপ্লোমা ইঞ্জিনিয়ারিং শিক্ষার্থীদের জন্য সাইট ভিজিট হলো এমন একটি বাস্তবমুখী অভিজ্ঞতা, যেখানে তারা সরাসরি প্রকল্প সাইটে গিয়ে নির্মাণ, পরিকল্পনা, নিরাপত্তা ব্যবস্থাপনা, কোয়ালিটি কন্ট্রোল, মেশিন ও প্রযুক্তির ব্যবহার, এবং প্রকল্প পরিচালনার পদ্ধতি সম্পর্কে শিখবে।  
  <br /><br />
  প্রতিটি ভিজিটে একজন অভিজ্ঞ ইন্ডাস্ট্রি এক্সপার্ট সরাসরি শিক্ষার্থীদের গাইড করবেন, প্রকল্পের বিভিন্ন ধাপ ব্যাখ্যা করবেন এবং শিক্ষার্থীদের প্রশ্নের উত্তর দেবেন। এই প্রক্রিয়ায় শিক্ষার্থীরা বইয়ের বাইরে বাস্তব ইঞ্জিনিয়ারিং প্রয়োগ এবং সমস্যার সমাধান কৌশলগুলো বোঝার সুযোগ পাবে, যা তাদের ভবিষ্যৎ ক্যারিয়ারের জন্য অপরিহার্য অভিজ্ঞতা হিসেবে কাজ করবে।
</p>
                <div className="space-y-5 mb-8">
                  <div className="flex items-start">
                    <div className="p-2 rounded-lg bg-red-50 mr-4">
                      <MapPin className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">সাইট ভিজিট</h4>
                      <p className="text-gray-600">
                        পুরো প্রোগ্রামের মধ্যে শিক্ষার্থীরা ১০টিরও বেশি লাইভ প্রজেক্ট সাইট ভিজিটের সুযোগ পাবে, যেখানে বাস্তব কাজের পর্যবেক্ষণ ও শেখার ব্যবস্থা থাকবে।
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 rounded-lg bg-red-50 mr-4">
                      <Clock className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">সময়কাল</h4>
                      <p className="text-gray-600">
                        অফলাইন: ফুলটাইম ট্রেনিং (৯টা-৫টা) চলবে নির্দিষ্ট সময়কাল জুড়ে (সকাল ৯টা থেকে বিকাল ৪টা)
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="p-2 rounded-lg bg-red-50 mr-4">
                      <Check className="w-5 h-5 text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">বিশেষ সুবিধা</h4>
                     <p className="text-gray-600 text-sm">
                    ইন্ডাস্ট্রি এক্সপোজার সার্টিফিকেট 
                    নেটওয়ার্কিং সুযোগ সহ জব প্লেসমেন্ট সহায়তা
                  </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r">
                <p className="text-red-800 font-medium flex items-start">
                  <span className="font-bold mr-2">নোট:</span> 
                  সাইট ভিজিটের জন্য পূর্বে রেজিস্ট্রেশন আবশ্যক এবং নিরাপত্তা গিয়ার/ড্রেস কোড মানতে হবে।
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default IndustrialSupportAndTraining;