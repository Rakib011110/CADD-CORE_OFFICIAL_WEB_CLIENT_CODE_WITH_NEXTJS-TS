import Image from "next/image";

// const courseAudiences = [
//     { name: "গ্র্যাজুয়েট ", image: "https://caddcore.net/storage/2023/04/MicrosoftTeams-image-8-300x300.png" },
//     { name: "শিক্ষার্থী ", image: "https://caddcore.net/storage/2023/03/Student-type-5-300x300.png" },
//     { name: "চাকরিতে ইচ্ছুক", image: "https://caddcore.net/storage/2023/03/Student-type-3-300x300.png" },
//     { name: "ফ্রিল্যান্সিং ইচ্ছুক", image: "https://caddcore.net/storage/2023/03/Student-type-2-300x300.png" },
//     { name: "উদ্যোক্তা", image: "https://caddcore.net/storage/2023/03/Student-type-1-300x300.png" },
//   ];


  const courseAudiences = [
    { name: "গ্র্যাজুয়েট ", image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105843/MicrosoftTeams-image-8-300x300_zimtlr.png" },
    { name: "শিক্ষার্থী ", image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105920/Student-type-5-300x300_snjnjv.png" },
    { name: "চাকরিতে ইচ্ছুক", image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105969/Student-type-3-300x300_bkmhak.png" },
    { name: "ফ্রিল্যান্সিং ইচ্ছুক", image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106306/Student-type-2-300x300_djztig.png" },
    { name: "উদ্যোক্তা", image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744107860/Student-type-1_f9z7es.png" },
  ];


 export const CourseForWhom = () => {
    return (
      <div className="bg-[#fcfcfc] py-10 px-4 text-center mb-7 mt-7">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
          <span className="">কোর্সটি যাদের জন্য</span>
          <div className="flex justify-center mb-6">
        <span className="inline-block w-32 h-1 bg-red-500 rounded"></span>
      </div>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
          {courseAudiences.map((audience) => (
            <div key={audience.name} className="text-center">
              <Image src={audience.image} alt={audience.name} className="w-36h-36 rounded-full  mx-auto" width={1000} height={1000} />
              <p className="text-gray-700 border-b-4 rounded-b-full p-3 border-red-400 mt-2 text-lg font-bold md:text-base ">{audience.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  };
  