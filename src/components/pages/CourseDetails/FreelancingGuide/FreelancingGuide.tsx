import Image from "next/image";

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
    <div className="bg-gradient-to-b from-[#E8F8F8] to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
            <span className="relative inline-block">
              ফ্রিল্যান্সিং গাইড
              <span className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-red-500 transform translate-y-2"></span>
            </span>
          </h2>
          <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
            বিশ্বসেরা ফ্রিল্যান্সিং প্ল্যাটফর্মে কাজ করার সম্পূর্ণ গাইডলাইন
          </p>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {freelancingPlatforms.map((platform) => (
            <div 
              key={platform.name} 
              className="group relative bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="aspect-w-16 aspect-h-9 w-full h-40 p-4 flex items-center justify-center">
                <Image 
                  src={platform.logo} 
                  alt={platform.name} 
                  width={200}
                  height={100}
                  className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white font-medium text-sm sm:text-base">
                  {platform.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        {/* <div className="mt-12 text-center">
          <button className="px-8 py-3 bg-gradient-to-r from-amber-400 to-red-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            গাইড দেখুন
          </button>
        </div> */}
      </div>
    </div>
  );
};