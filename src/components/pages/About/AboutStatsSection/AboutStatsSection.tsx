"use client"
import CountUp from "react-countup";

export default function AboutStatsSection() {
  const stats = [
    {
      title: "সফল গ্র্যাজুয়েট",
      value: 12000,
      suffix: "+",
      description: "আমাদের প্রশিক্ষণ পেয়ে ১২,০০০ এরও বেশি শিক্ষার্থী তাদের ক্যারিয়ারে উন্নতি করেছেন",
    },


    
    {
      title: "কর্মসংস্থানে সাফল্য",
      value: 10000,
      suffix: "+",
      description: "১০,০০০ এর বেশি শিক্ষার্থীকে আমরা বিভিন্ন শিল্পে চাকরি পেতে সহায়তা করেছি",
    },
    {
      title: "শিক্ষার্থী সন্তুষ্টির হার",
      value: 95,
      suffix: "%",
      description: "আমাদের শিক্ষার্থীদের ৯৫% আমাদের কোর্স এবং প্রশিক্ষণের মানে সন্তুষ্ট",
    },
    {
      title: "ইন্ডাস্ট্রি পার্টনার",
      value: 200,
      suffix: "+",
      description: "২০০ এর বেশি প্রতিষ্ঠান আমাদের গ্র্যাজুয়েটদের নিয়োগ করেছে",
    },
  ];

  return (
  <div>

<div className="bg-black w-full mx-auto  mb-10 text-white py-10 px-2">
      <div className="max-w-6xl   mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-gray-900 p-4 rounded-lg text-center shadow-lg"
          >
            <h3 className="text-md font-semibold mb-2">{stat.title}</h3>
            <h2 className="text-2xl font-bold">
              <CountUp start={0} end={stat.value} duration={3} />{stat.suffix}
            </h2>
            <p className="text-gray-400 mt-2">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
  );
}
