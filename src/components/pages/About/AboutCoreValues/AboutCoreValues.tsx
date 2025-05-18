"use client";

import { motion } from "framer-motion";
import Image from "next/image"; 
import { DotLottieReact } from '@lottiefiles/dotlottie-react';



export default function AboutCoreValues() {
  return (
    <div>
     <div className="flex flex-col lg:flex-row items-center max-w-6xl mx-auto py-10 px-5 gap-10">
      {/* Animated Image */}
      <motion.div
        className="relative w-full lg:w-1/2 rounded-lg overflow-hidden"
        whileHover={{ scale: 1.05, rotate: 2 }} // Hover effect (Bangla: নড়াচড়া)
        transition={{ duration: 0.5, ease: "backInOut" }}
      >
        <img
          src="https://res.cloudinary.com/dbkwiwoll/image/upload/v1744028131/149528833_5341628802544327_2717259404816850657_n_l4v9vv.jpg"
          alt="আমাদের মূল ভিত্তি"
          className="w-full h-auto rounded-lg  "
        />
        <div className="absolute   inset-0 bg-gradient-to-t from-black/70 via-black/75 to-transparent flex items-center justify-center">
          <h2 className="text-white text-3xl font-bold">আমাদের মূল ভিত্তি</h2>
        </div>
      </motion.div>

      {/* Content */}
      <div className="w-full lg:w-1/2 space-y-5">
        {[
          { icon: "📘", title: "গুণগত প্রশিক্ষণ", text: "আমরা বাস্তবমুখী প্রশিক্ষণের মাধ্যমে শিক্ষার্থীদের ক্যারিয়ার গড়তে সহায়তা করি" },
          { icon: "📚", title: "ইন্ডাস্ট্রি-কেন্দ্রিক কোর্স", text: "আমাদের কোর্সগুলো প্রকৌশল খাতের প্রয়োজন অনুযায়ী ডিজাইন করা হয়েছে" },
          { icon: "💡", title: "ইনোভেশন ও সৃজনশীলতা", text: "শিক্ষার্থীদের চিন্তা-ভাবনা এবং সমস্যা সমাধানের দক্ষতা উন্নয়নে জোর দেওয়া হয়" },
          { icon: "🎯", title: "ক্যারিয়ার সহায়তা", text: "কোর্স শেষে চাকরির প্রস্তুতি এবং প্লেসমেন্ট সাপোর্ট প্রদান করা হয়" },
        ].map((item, index) => (
          <div key={index} className="flex items-start gap-4">
            <div className="text-purple-600 text-3xl">{item.icon}</div>
            <div>
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-gray-600">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="max-w-6xl mx-auto px-4 py-10">
  <div className="flex flex-col md:flex-row items-stretch gap-10">
    {/* Text Section */}
    <div className="md:w-1/2 flex items-center">
      <div>
        <h1 className="text-base text-justify md:text-md leading-relaxed text-gray-800">
          ইঞ্জিনারিং শিক্ষার গুরুত্ব ক্রমেই বৃদ্ধি পাচ্ছে, কিন্তু অনেক শিক্ষার্থী এবং
          পেশাজীবী এখনো দক্ষতা উন্নয়নের জন্য কার্যকর প্রশিক্ষণ পদ্ধতির অভাবে পিছিয়ে
          আছেন। CADD CORE Engineering Training Institute বিশ্বাস করে, বর্তমান সময়েই
          প্রযুক্তিগত জ্ঞান এবং প্রকৌশল দক্ষতার উন্নয়ন জরুরি।
          <br className="my-2" />
          আমাদের লক্ষ্য শুধুমাত্র প্রশিক্ষণ প্রদান নয়; বরং বাস্তবিক দক্ষতা অর্জনের মাধ্যমে
          শিক্ষার্থীদের প্রকৌশল খাতে সক্ষমতা বৃদ্ধি করা। আমরা অত্যাধুনিক প্রশিক্ষণ
          পদ্ধতি, সর্বশেষ CAD সফটওয়্যার এবং বিশ্ব-মানের প্রজেক্টের মাধ্যমে শিক্ষার্থীদের
          ভবিষ্যতের প্রস্তুতি নিতে সহায়তা করি।
          <br className="my-2" />
          প্রতিটি কোর্স ডিজাইন করা হয়েছে এমনভাবে যাতে শিক্ষার্থীরা সহজে, আনন্দের সাথে,
          এবং হাতে-কলমে কাজের মাধ্যমে শিখতে পারে। Eng. Hachnayen Ahmed এর নেতৃত্বে
          আমাদের অভিজ্ঞ প্রশিক্ষক দল শিক্ষার্থীদের হাতে কলমে দক্ষতা অর্জন করাতে
          প্রতিশ্রুতিবদ্ধ।
        </h1>
      </div>
    </div>

    {/* Animation Section */}
    <div className="md:w-1/2 bg-[#ffc5c5eb] border-2 p-1 flex items-center justify-center">
      <div className="w-full h-full max-h-[400px]">
        <DotLottieReact
          src="https://lottie.host/bbcb3f40-c2b1-4b38-b93f-1efb16edad4b/Yh4062vRn8.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  </div>
</div>

    </div>
  );
}