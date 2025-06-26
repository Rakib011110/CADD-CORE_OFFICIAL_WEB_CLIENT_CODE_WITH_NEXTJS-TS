"use client"; 

type Service = {
  id: number;
  title: string;
  desc: string;
  image: string; 
};

const servicesData: Service[] = [
 {
  id: 1,
  title: "২৪/৭ সাপোর্ট",
  desc: "২৪ ঘণ্টা ৭ দিন সার্বক্ষণিক সাপোর্ট ও সহযোগিতা, যাতে আপনার যেকোনো প্রশ্নের দ্রুত সমাধান পাওয়া যায়।",
  image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744104797/Icon-02-300x300_rblsoq.png",
}
,
  {
    id: 2,
    title: "অনলাইন ডিজিটাল লাইব্রেরি",
    desc: "ডিজিটাল লাইব্রেরি যেখানে কোর্স ম্যাটেরিয়াল, রিসোর্স, ইবুক ইত্যাদি রয়েছে।",
    image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744104869/Icon-06-100x100_rvh6ag.png",
  },
  {
    id: 3,
    title: "জব প্লেসমেন্ট",
    desc: "প্রশিক্ষণ শেষে চাকরির সুযোগ বা ইন্টার্নশিপের সুপারিশ প্রদান।",
    image: "https://cdn-ilbhfhh.nitrocdn.com/GQAjASDcQJAOSFnCNbjHAwgJDnuIafbo/assets/images/optimized/rev-f913869/caddcore.net/wp-content/uploads/2023/03/Icon-04.png",
  },
  {
    id: 4,
    title: "শ্রেণীকক্ষের সকল রিসোর্স",
    desc: "ভিডিও লেকচার, স্লাইড, নোট এবং অনলাইন সাপোর্ট—all in one place।",
    image: "https://cdn-ilbhfhh.nitrocdn.com/GQAjASDcQJAOSFnCNbjHAwgJDnuIafbo/assets/images/optimized/rev-f913869/caddcore.net/wp-content/uploads/2023/03/Icon-01.png",
  },
  {
    id: 5,
    title: "অন-জব ট্রেনিং",
    desc: "মূল কোর্সের ৭০% সম্পন্ন করার পর অন-জব ট্রেনিংয়ের জন্য আবেদন করতে পারবেন।",
    image: "https://cdn-ilbhfhh.nitrocdn.com/GQAjASDcQJAOSFnCNbjHAwgJDnuIafbo/assets/images/optimized/rev-f913869/caddcore.net/wp-content/uploads/2023/03/Icon-04.png",
  },
  {
    id: 6,
    title: "সার্টিফিকেট (জাতীয় ও আন্তর্জাতিক)",
    desc: "আপনার সাফল্যকে স্বীকৃতি দিতে জাতীয় ও আন্তর্জাতিক সার্টিফিকেট প্রদান।",
    image: "https://cdn-ilbhfhh.nitrocdn.com/GQAjASDcQJAOSFnCNbjHAwgJDnuIafbo/assets/images/optimized/rev-f913869/caddcore.net/wp-content/uploads/2023/03/Icon-03.png",
  },
];



export default function OurServices() {
  return (
    <section className="max-w-6xl mx-auto px-4 py-10">
      {/* Section Title */}
      <h2 className="text-3xl font-bold text-center ">
        আমাদের সেবা সমূহ
      </h2>
      <div className="flex justify-center mb-8">
        <span className="inline-block w-24 h-1 bg-red-500 rounded"></span>
      </div>
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {servicesData.map((service) => (
          <div
            key={service.id}
            className="flex items-start gap-4 p-6 bg-white border border-gray-800  rounded-md shadow-sm"
          >
            {/* Service Image (Icon) */}
            <img
              src={service.image}
              alt={service.title}
              className="w-20 h-20 object-contain"
            />

            {/* Text Content */}
            <div>
              <h3 className="text-xl font-semibold text-red-500">
                {service.title}
              </h3>
              <p className="text-gray-700 mt-2 leading-relaxed">
                {service.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
