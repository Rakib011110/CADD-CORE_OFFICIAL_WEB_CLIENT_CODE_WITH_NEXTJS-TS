import HeroVideoDialog from "@/components/magicui/hero-video-dialog";

export default function WhyChoosUsForIndustrial() {
  return (
    <section id="why-choose-us" className="bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4 relative inline-block">
            কেন আমাদের সাথে <span className="text-red-500">ইন্ডাস্ট্রিয়াল ট্রেনিং</span> করবেন?
            <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1.5 bg-red-600 rounded-full"></span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            বাস্তব অভিজ্ঞতা ও পেশাদার দক্ষতা উন্নয়নের জন্য অনন্য একটি প্রশিক্ষণ প্রোগ্রাম
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Video */}
          <div className="shadow-xl rounded-xl overflow-hidden transform hover:scale-[1.02] transition-all duration-300">
            <HeroVideoDialog
              className="w-full"
              // animationStyle="fade-in"
              videoSrc="https://www.youtube.com/embed/iNZhdae4maY?si=VYgdY7hZsL_GOOQ0"
              thumbnailSrc="https://res.cloudinary.com/dbkwiwoll/image/upload/v1746017829/dae04d9d-6ccc-42f3-bf76-c65111cfe67a_rvfwjj.jpg"
              thumbnailAlt="ইন্ডাস্ট্রিয়াল ট্রেনিং ভিডিও"
            />
          </div>

          {/* Right Column: Features */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-full flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">বাস্তব প্রকল্পের অভিজ্ঞতা</h3>
                <p className="text-gray-600">
                  শুধু তত্ত্ব নয়, সরাসরি ইন্ডাস্ট্রি স্ট্যান্ডার্ড প্রকল্পে কাজ করার সুযোগ। আমাদের ৮৫% শিক্ষার্থী ট্রেনিং শেষে চাকরি পেয়েছেন।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-full flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">ইন্ডাস্ট্রি এক্সপার্ট মেন্টরশিপ</h3>
                <p className="text-gray-600">
                  ১০+ বছর অভিজ্ঞতা সম্পন্ন  ইঞ্জিনিয়ারদের সরাসরি তত্ত্বাবধানে প্রশিক্ষণ। প্রতিটি সেশনে সমস্যা সমাধানের প্র্যাকটিক্যাল গাইডলাইন।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-full flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">আধুনিক টুলস ও সফটওয়্যার</h3>
                <p className="text-gray-600">
                  AutoCAD, ETABS, Revit, Primavera সহ ইন্ডাস্ট্রিতে ব্যবহৃত সবচেয়ে ডিমান্ডেড সফটওয়্যারে হাতে-কলমে প্রশিক্ষণ।
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-indigo-100 p-3 rounded-full flex-shrink-0">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">ক্যারিয়ার সাপোর্ট সিস্টেম</h3>
                <p className="text-gray-600">
                  ট্রেনিং শেষে CV তৈরি, ইন্টারভিউ প্রস্তুতি এবং আমাদের পার্টনার কোম্পানিগুলোতে জব প্লেসমেন্ট সুবিধা।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}