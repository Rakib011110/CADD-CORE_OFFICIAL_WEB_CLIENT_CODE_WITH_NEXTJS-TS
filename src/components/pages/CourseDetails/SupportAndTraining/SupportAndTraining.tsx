'use client';

import Image from 'next/image';

const SupportAndTraining = () => {
  return (
    <div className="bg-gradient-to-br  min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            আপনার মাস্টারকোর্স জার্নি সফল করুন আমাদের প্রফেশনাল সহায়তায়।
          </h2>
          <div className="flex justify-center">
            <div className="w-32 h-1 bg-gradient-to-r from-red-500 to-pink-500 rounded-full"></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Section - Dedicated Student Support */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                ডেডিকেটেড <span className="text-red-600">স্টুডেন্ট সাপোর্ট</span>
              </h3>
              <div className="w-16 h-1 bg-red-500 rounded-full"></div>
            </div>
            <p className="text-lg font-semibold text-gray-800 mb-4">
              রিয়েল প্রজেক্ট হ্যান্ডস-অন এক্সপেরিয়েন্স!
            </p>
            <p className="text-gray-700 mb-8 leading-relaxed">
              আমাদের মাস্টারকোর্সে শুধু ক্লাস নয়, আপনার সফলতার জন্য প্রয়োজনীয় সমস্ত কিছুই পাওয়া যাবে। ইন্ডাস্ট্রি স্পেশালিস্টদের দ্বারা তাৎক্ষণিক সহায়তা পাওয়ার সুযোগ পাবেন।
              হোয়াটস এপ, ফেসবুক বা ফোন কলের মাধ্যমে যেকোনো সময় প্রশ্ন করুন এবং আমাদের প্রফেশনাল সাপোর্ট ইঞ্জিনিয়াররা আপনাকে তাৎক্ষণিকভাবে সমাধান প্রদান করবেন। গুগল মিট, ফোন কল বা ব্যবহারিক নির্দেশনার মাধ্যমে আপনার শিক্ষার যাত্রা আরো সহজ হবে।
            </p>
            <div className="relative overflow-hidden rounded-xl shadow-lg">
              <Image
                src="https://res.cloudinary.com/dbkwiwoll/image/upload/v1744107410/WhatsApp-Image-2024-08-29-at-11.45.03-AM-1536x1023.jpeg_pvewlx.webp"
                alt="Support"
                width={500}
                height={300}
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Right Section - On-Job Training */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow duration-300">
            <div className="mb-6">
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                <span className="text-red-600 border-b-4 border-red-500 pb-1">অন-জব ট্রেইনিং</span>
              </h3>
            </div>
            <p className="text-gray-700 mb-6 leading-relaxed">
              অন-জব ট্রেনিং হলো একটি শিক্ষামূলক প্রক্রিয়া যেখানে একজন ব্যক্তি একটি নির্দিষ্ট পেশায় বা কাজের ক্ষেত্রে প্রশিক্ষণ পায়, প্রকৃত কার্যক্ষেত্রে কাজ করার মাধ্যমে। এটি একটি ব্যবহারিক শিক্ষার পদ্ধতি, যেখানে শিক্ষার্থীরা তাদের শিক্ষাগত জ্ঞানকে বাস্তব পরিস্থিতিতে প্রয়োগ করার সুযোগ পায়।
              <br /><br />
              <span className="font-bold text-gray-900">মূল কোর্সের ৭০% সম্পন্ন করার সাথে সাথে আপনি অনজব ট্রেনিংয়ের জন্য আবেদন করতে পারবেন।</span> এই ট্রেনিংয়ে আপনি একজন অভিজ্ঞ প্রকৌশলীর সরাসরি তত্ত্বাবধানে বাস্তব প্রকল্পগুলোর কাজ শুরু থেকে শেষ পর্যন্ত সম্পন্ন করার সুযোগ পাবেন।
            </p>
            <ul className="space-y-3 mb-6">
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="font-medium text-gray-800">মোড: অনলাইন বা অফলাইন</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="font-medium text-gray-800">অনলাইন: ফুলটাইম (৯টা -৫টা , ১ সপ্তাহ) অথবা পার্টটাইম (৬টা -১০টা , ১ মাস)</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="font-medium text-gray-800">অফলাইন: ফুলটাইম (৯টা -৫টা ), নিজস্ব ল্যাপটপ আবশ্যক</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="font-medium text-gray-800">মূল্যায়ন: ট্রেনিংয়ের আগে কাজ পর্যালোচনা</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="font-medium text-gray-800">উপস্থিতি: নিয়মিত উপস্থিতি বাধ্যতামূলক</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="font-medium text-gray-800">ফলাফল: সিভি আপডেট ও জব সেলে জমা</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-3 mt-1">✓</span>
                <span className="font-medium text-gray-800">উদ্দেশ্য: বাস্তব কাজের প্রস্তুতি</span>
              </li>
            </ul>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <p className="text-sm font-semibold text-yellow-800">
                <span className="font-bold">মনে রাখবেন:</span> অন-জব ট্রেনিং একটি জবের মতো। অনিয়মিততা কাজের গতি বাধাগ্রস্ত করতে পারে।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportAndTraining;
