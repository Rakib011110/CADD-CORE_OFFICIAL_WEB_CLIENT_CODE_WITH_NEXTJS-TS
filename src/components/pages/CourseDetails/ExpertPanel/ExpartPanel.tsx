import { TCourse } from "@/lib/courses";

export default function ExpertPanel({ course }: { course: TCourse }) {
  const advisors = course?.expertPanel?.advisors || [];
  const teachers = course?.expertPanel?.teachers || [];

  if (advisors.length === 0 && teachers.length === 0) return null;

  const renderPanelSection = (
    title: string,
    description: string,
    members: { name: string; title?: string; role?: string; photoUrl: string }[],
    isAdvisor: boolean = false
  ) => (
    <div className="mb-16">
      {/* Enhanced Header Section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center mb-3">
         
          <h2 className="text-4xl md:text-4xl font-bold text-gray-800">
            {title}
          </h2>
        </div>

        <div className="flex justify-center mb-8">
          <span className="inline-block w-32 h-1 bg-gradient-to-r from-red-500 via-red-600 to-red-500 rounded-full"></span>
        </div>

        <p className="text-gray-600 text-lg max-w-3xl mx-auto leading-relaxed">
          {description}
        </p>
      </div>

      {/* Professional Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {members.map((member, idx) => (
          <div
            key={idx}
            className="group relative bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 overflow-hidden"
            style={{ animationDelay: `${idx * 150}ms` }}
          >
            {/* Image Container with Enhanced Styling */}
            <div className="relative h-64 overflow-hidden bg-gray-100">
              {member.photoUrl ? (
                <>
                  <img
                    src={member.photoUrl}
                    alt={member.name}
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const fallback = target.parentElement?.querySelector('.fallback-image') as HTMLElement;
                      if (fallback) {
                        fallback.style.display = 'flex';
                        fallback.classList.remove('hidden');
                      }
                    }}
                    loading="lazy"
                  />

                  {/* Fallback for broken images */}
                  <div className="fallback-image absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 items-center justify-center hidden">
                    <div className="text-center text-gray-500">
                      <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm font-medium">{member.name.charAt(0).toUpperCase()}</p>
                    </div>
                  </div>

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>

                  {/* Decorative Elements */}
                  <div className="absolute top-4 left-4">
                    <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    </div>
                  </div>

                  {/* Floating Badge */}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                      {isAdvisor ? "Advisor" : "Instructor"}
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <svg className="w-16 h-16 mx-auto mb-2 opacity-50" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-medium">{member.name.charAt(0).toUpperCase()}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6 bg-white">
              {/* Name and Title */}
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-1 group-hover:text-red-600 transition-colors duration-300">
                  {member.name}
                </h3>
                <p className="text-gray-600 text-sm font-medium">
                  {member.title || member.role || "Expert Professional"}
                </p>
              </div>

              {/* Expertise Indicators */}
              <div className="flex items-center justify-between">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>

                {/* Social/Connect Button */}
                <button className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-2 group-hover:translate-x-0 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg hover:shadow-xl">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {/* Bottom Accent Line */}
              <div className="mt-4 w-full h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-red-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"></div>
          </div>
        ))}
      </div>

      {/* Section Separator */}
      <div className="mt-12 flex justify-center">
        <div className="w-px h-12 bg-gradient-to-b from-red-300 to-transparent"></div>
      </div>
    </div>
  );

  return (
    <section className="bg-gradient-to-br from-gray-50 via-white to-gray-50 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {advisors.length > 0 &&
          renderPanelSection(
            "অ্যাডভাইজর",
            "কোর্স পরিচালনায় নিযুক্ত আমাদের বিশিষ্ট অ্যাডভাইজরদের সঙ্গে পরিচিত হোন",
            advisors,
            true
          )}

        {teachers.length > 0 &&
          renderPanelSection(
            "কোর্স টিচার্স প্যানেল",
            "প্রফেশনাল সাপোর্ট ইঞ্জিনিয়ার্স এবং ইনস্ট্রাক্টর",
            teachers,
            false
          )}
      </div>
    </section>
  );
}
