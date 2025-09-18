import Image from "next/image";

const courseAudiences = [
  { name: "গ্র্যাজুয়েট ", image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105843/MicrosoftTeams-image-8-300x300_zimtlr.png" },
  { name: "শিক্ষার্থী ", image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105920/Student-type-5-300x300_snjnjv.png" },
  { name: "চাকরিতে ইচ্ছুক", image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105969/Student-type-3-300x300_bkmhak.png" },
  { name: "ফ্রিল্যান্সিং ইচ্ছুক", image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106306/Student-type-2-300x300_djztig.png" },
  { name: "উদ্যোক্তা", image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744107860/Student-type-1_f9z7es.png" },
];

export const CourseForWhom = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-white py-16 px-4 text-center mb-8 mt-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            কোর্সটি যাদের জন্য
          </h2>
          <div className="flex justify-center mb-2">
            <span className="inline-block w-24 h-1 bg-gradient-to-r from-red-500 to-red-600 rounded-full"></span>
          </div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            এই কোর্সটি বিভিন্ন ব্যাকগ্রাউন্ডের শিক্ষার্থীদের জন্য ডিজাইন করা হয়েছে
          </p>
        </div>

        {/* Audience Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
          {courseAudiences.map((audience, index) => (
            <div
              key={audience.name}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image Container */}
              <div className="relative p-6 bg-gradient-to-br from-red-50 to-red-100">
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <Image
                    src={audience.image}
                    alt={audience.name}
                    className="w-full h-full object-cover rounded-full border-4 border-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                    width={96}
                    height={96}
                  />
                  {/* Decorative ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-red-200 animate-pulse"></div>
                </div>

                {/* Floating icon */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 bg-white">
                <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-red-600 transition-colors duration-300">
                  {audience.name}
                </h3>
                <div className="w-full h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-red-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
            </div>
          ))}
        </div>

        {/* Bottom decorative element */}
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-2">
            <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-red-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};
  