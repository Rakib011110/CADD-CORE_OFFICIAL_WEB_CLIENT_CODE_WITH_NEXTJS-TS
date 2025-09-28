
import { TCourse } from "@/lib/courses";
import Image from "next/image";
import { FaCheckCircle } from "react-icons/fa";

export default function SoftwareTaught({ course }: { course: TCourse }) {
  return (
  <div id="software-taught" className="bg-gradient-to-b  ">
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        {/* Section Header */}
        <div className="text-center ">
          <h2 className="text-4xl sm:text-5xl  font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-red-400 mb-2 ">
            যে সকল সফটওয়্যার শেখানো হবে
          </h2>
          <div className="flex justify-center mb-4">
            <span className="block w-28 h-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-400"></span>
          </div>
          <p className="mt-2 max-w-2xl mx-auto text-lg text-gray-700">
            কোর্সে ব্যবহৃত প্রফেশনাল সফটওয়্যার সমূহ
          </p>
        </div>

        {/* Software Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {course.softwaresTaught?.map((software, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-7 bg-gradient-to-br from-white via-red-50 to-red-100 rounded-2xl border border-gray-200 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-red-500 relative"
            >
              <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
                {software.photoUrl ? (
                  <Image
                    src={software.photoUrl}
                    alt={software.softwareTitle}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full drop-shadow-md"
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
                <span className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-2 shadow-lg">
                  <FaCheckCircle size={20} />
                </span>
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">
                {software.softwareTitle}
              </h4>
              <span className="text-xs text-gray-500">Professional Tool</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}