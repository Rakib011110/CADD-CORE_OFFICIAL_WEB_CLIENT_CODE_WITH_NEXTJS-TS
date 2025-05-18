import { TCourse } from "@/lib/courses";
import Image from "next/image";

export default function SoftwareTaught({ course }: { course: TCourse }) {
  return (
    <div id="software-taught">
      <section className="max-w-6xl mx-auto px-4 py-10">
        {/* Section Title */}
        <h2 className="text-3xl font-bold text-center">
          যে সকল সফটওয়্যার শেখানো হবে
        </h2>
        <div className="flex justify-center mb-8">
          <span className="inline-block w-44 h-1 bg-red-500 rounded"></span>
        </div>

        {/* Software Grid */}
        <div className="justify-center items-center grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {course.softwaresTaught?.map((software, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              {software.photoUrl ? (
                <Image width={1000} height={1000}
                  src={software.photoUrl}
                  alt={software.softwareTitle}
                  className="h-32 w-full mb-4"
                />
              ) : (
                <div className="h-20 w-20 flex items-center justify-center bg-gray-100 text-gray-400 text-sm mb-4 rounded">
                  No Image
                </div>
              )}
              <h4 className="text-lg font-semibold">{software.softwareTitle}</h4>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
