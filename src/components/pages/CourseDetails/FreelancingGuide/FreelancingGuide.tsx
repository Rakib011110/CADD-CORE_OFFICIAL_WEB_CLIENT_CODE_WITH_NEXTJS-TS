
import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

export const FreelancingGuide = () => {
  const freelancingPlatforms = [
    { name: "Sketchfab", logo: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106359/sketchfab-01-768x432_hdlotg.png" },
    { name: "Guru", logo: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106408/guru-01-600x338_u71hkr.png" },
    { name: "Freelancer", logo: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106451/freelancer-01-600x338_yt0atk.png" },
    { name: "Fiverr", logo: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106489/fiverr-01_xvgkxz.png" },
    { name: "Upwork", logo: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106526/Upwork-01-768x432_tdsnga.png" },
    { name: "PeoplePerHour", logo: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106596/PeoplePerHour-01-300x300_m2kvwm.png" },
  ];

  return (
    <div className="bg-gradient-to-b  py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold  bg-clip-text bg-gradient-to-r from-red-500 via-red-700 to-rose-500 mb-2">
            ফ্রিল্যান্সিং গাইড
          </h2>
          <div className="flex justify-center mb-4">
            <span className="block w-32 h-1 rounded-full bg-gradient-to-r from-gray-900 to-red-700"></span>
          </div>
          <p className="mt-2 text-lg text-gray-700 max-w-2xl mx-auto">
            বিশ্বসেরা ফ্রিল্যান্সিং প্ল্যাটফর্মে কাজ করার সম্পূর্ণ গাইডলাইন
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          {freelancingPlatforms.map((platform) => (
            <div
              key={platform.name}
              className="group relative bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 hover:border-amber-400"
            >
              <div className="aspect-w-16 aspect-h-9 w-full h-40 p-4 flex items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#e0e7ff]">
                <Image
                  src={platform.logo}
                  alt={platform.name}
                  width={200}
                  height={100}
                  className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-semibold text-base drop-shadow-lg">
                  {platform.name}
                </span>
              </div>
              {/* <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="inline-flex items-center gap-1 text-xs bg-amber-400 text-white px-2 py-1 rounded-full shadow">
                  আরও জানুন <FaArrowRight className="ml-1" />
                </span>
              </div> */}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        {/* <div className="mt-14 text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-amber-400 to-red-500 text-white font-semibold rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto">
            গাইড দেখুন <FaArrowRight />
          </button>
        </div> */}
      </div>
    </div>
  );
};