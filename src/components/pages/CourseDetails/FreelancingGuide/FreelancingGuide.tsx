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
      <div className="bg-[#E8F8F8] mt-10 py-3 px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          <span className="  ">ফ্রিল্যান্সিং গাইড</span>

          <div className="flex justify-center mb-6">
        <span className="inline-block w-32 h-1 bg-red-500 rounded"></span>
      </div>
        </h2>
        <div className="grid grid-cols-2  md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {freelancingPlatforms.map((platform) => (
            <div key={platform.name} className="bg-white  shadow rounded-md border-2 border-black p-5 flex items-center justify-center">
              <Image src={platform.logo} alt={platform.name} className="h-28 w-full object-cover"  width={1000} height={1000}/>
            </div>
          ))}
        </div>
      </div>
    );
  };
  