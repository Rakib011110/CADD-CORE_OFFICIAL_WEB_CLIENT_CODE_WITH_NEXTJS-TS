import Image from "next/image";

const courseAudiences = [
  {
    name: "গ্র্যাজুয়েট",
    role: "ইঞ্জিনিয়ারিং ও টেকনিক্যাল ব্যাকগ্রাউন্ড",
    image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105843/MicrosoftTeams-image-8-300x300_zimtlr.png",
  },
  {
    name: "শিক্ষার্থী",
    role: "পলিটেকনিক ও ভার্সিটি শিক্ষার্থী",
    image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105920/Student-type-5-300x300_snjnjv.png",
  },
  {
    name: "চাকরিতে ইচ্ছুক",
    role: "জব মার্কেটে দ্রুত ক্যারিয়ার গড়ায়",
    image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744105969/Student-type-3-300x300_bkmhak.png",
  },
  {
    name: "ফ্রিল্যান্সিং ইচ্ছুক",
    role: "রিমোট ও আন্তর্জাতিক মার্কেটপ্লেসে",
    image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744106306/Student-type-2-300x300_djztig.png",
  },
  {
    name: "উদ্যোক্তা",
    role: "নিজস্ব ফার্ম বা কনসালটেন্সি শুরু করতে",
    image: "https://res.cloudinary.com/dbkwiwoll/image/upload/v1744107860/Student-type-1_f9z7es.png",
  },
];

export const CourseForWhom = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-zinc-50/70 via-white to-zinc-50/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 border border-red-100 uppercase tracking-wider mb-3">
            Target Audience
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-900 tracking-tight">
            কোর্সটি যাদের জন্য
          </h2>
          <p className="mt-2 text-sm sm:text-base text-zinc-500">
            বিভিন্ন ব্যাকগ্রাউন্ডের শিক্ষার্থীদের জন্য বিশেষভাবে ডিজাইন করা হয়েছে
          </p>
        </div>

        {/* Symmetrical 5-column responsive grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 sm:gap-4 md:gap-5">
          {courseAudiences.map((audience, index) => (
            <div
              key={audience.name}
              className={`group relative rounded-2xl p-[1px] bg-gradient-to-b from-zinc-200/90 via-zinc-100 to-zinc-200/40 hover:from-red-500 hover:via-rose-500 hover:to-red-600 transition-all duration-300 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_14px_30px_-10px_rgba(220,38,38,0.18)] hover:-translate-y-1.5 cursor-default ${
                index === 4 ? "col-span-2 sm:col-span-1 max-w-[260px] sm:max-w-none mx-auto w-full" : ""
              }`}
            >
              <div className="relative h-full bg-white rounded-[15px] p-4 sm:p-5 flex flex-col items-center text-center overflow-hidden">
                {/* Subtle ambient light on hover */}
                <div className="absolute -top-8 -right-8 w-16 h-16 bg-red-500/[0.05] rounded-full blur-xl group-hover:bg-red-500/[0.12] transition-colors pointer-events-none" />

                {/* Layered Avatar Container */}
                <div className="relative mb-3 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 opacity-0 group-hover:opacity-20 blur-md transition-opacity duration-300" />
                  <div className="relative h-20 w-20 sm:h-22 sm:w-22 rounded-2xl p-1.5 bg-gradient-to-br from-red-50/80 via-white to-rose-50/50 border border-red-100/80 shadow-sm group-hover:scale-105 group-hover:border-red-200 transition-all duration-300 flex items-center justify-center overflow-hidden">
                    <Image
                      src={audience.image}
                      alt={audience.name}
                      width={84}
                      height={84}
                      className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                </div>

                {/* Persona Name */}
                <h3 className="text-sm sm:text-[15px] font-bold text-zinc-900 group-hover:text-red-600 transition-colors duration-200">
                  {audience.name}
                </h3>

                {/* Role Context */}
                <p className="mt-1 text-[11px] sm:text-xs text-zinc-500 leading-relaxed font-normal line-clamp-2">
                  {audience.role}
                </p>

                {/* Subtle hover accent line */}
                <div className="mt-3 h-0.5 w-6 rounded-full bg-zinc-200 group-hover:w-12 group-hover:bg-red-600 transition-all duration-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};