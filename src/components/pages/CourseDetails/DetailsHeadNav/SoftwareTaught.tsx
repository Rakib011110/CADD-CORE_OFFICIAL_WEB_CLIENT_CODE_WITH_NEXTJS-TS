import { TCourse } from "@/lib/courses";
import Image from "next/image";

export default function SoftwareTaught({ course }: { course: TCourse }) {
  return (
    <div id="software-taught" className="bg-gray-50">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        {/* Section Header */}
        <div className="text-center mb-12 mt-10" >
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            যে সকল সফটওয়্যার শেখানো হবে
          </h2> 


          
          <div className="mt-4 flex justify-center">
            <span className="inline-block w-24 h-1.5 bg-gradient-to-r from-red-500 to-amber-500 rounded-full"></span>
          </div>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
            কোর্সে ব্যবহৃত প্রফেশনাল সফটওয়্যার সমূহ
          </p>
        </div>

        {/* Software Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {course.softwaresTaught?.map((software, index) => (
            <div
              key={index}
              className="flex flex-col content-center mx-auto items-center text-center p-6 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="relative w-full h-28 mb-6 flex items-center justify-center">
                {software.photoUrl ? (
                  <Image
                    src={software.photoUrl}
                    alt={software.softwareTitle}
                    width={160}
                    height={160}
                    className="object-contain w-full h-full"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400 rounded-lg">
                    <svg
                      className="w-12 h-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
              </div>
              <h4 className="text-xl font-semibold text-gray-800">
                {software.softwareTitle}
              </h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}