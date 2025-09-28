import React from "react";
import Image from "next/image";
import { TCourse } from "@/lib/courses";

const Certificate = ({ course }: { course: TCourse }) => {
  // Safely filter valid certificates
  const validCertificates = Array.isArray(course?.InternationaldemoCertificate)
    ? course.InternationaldemoCertificate.filter(c => c?.photoUrl?.trim())
    : [];

  // Don't render anything if course is missing or no valid certificates
  if (!course || validCertificates.length === 0) return null;

  return (
    <div className="bg-gradient-to-br from-red-50 via-teal-50 to-cyan-100 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-green-600 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 18c1.657 0 3-4.03 3-9s-1.343-9-3-9" />
            </svg>
          </div>
          <h2 className="text-4xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            আন্তর্জাতিকভাবে স্বীকৃতি অর্জন করুন
          </h2>
          <div className="flex justify-center mb-6">
            <div className="w-32 h-1 bg-gradient-to-r from-red-600 to-red-600 rounded-full"></div>
          </div>
          <p className="text-md text-gray-700 max-w-4xl mx-auto leading-relaxed">
            আপনার দক্ষতাকে বিশ্বমানের করে তুলুন। আমাদের আন্তর্জাতিক সার্টিফিকেটগুলো আপনার ক্যারিয়ারকে নতুন উচ্চতায় নিয়ে যাবে।
          </p>
        </div>

        {/* Certificates Grid */}
        <div className={`grid gap-8 justify-items-center ${
          validCertificates.length === 1
            ? "grid-cols-1 max-w-2xl mx-auto"
            : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-2"
        }`}>
          {validCertificates.map((certificate, index) => (
            <div
              key={index}
              className="group bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-6 w-full max-w-2xl"
            >
              {/* Certificate Image Container */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 p-4 shadow-inner">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src={certificate.photoUrl.trim()}
                  alt={`Certificate ${index + 1}`}
                  width={800}
                  height={600}
                  className="object-contain w-full h-80 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                />
                {/* Decorative corner elements */}
                <div className="absolute top-2 left-2 w-6 h-6 border-l-4 border-t-4 border-green-500 rounded-tl-lg opacity-60"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-r-4 border-t-4 border-teal-500 rounded-tr-lg opacity-60"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-l-4 border-b-4 border-teal-500 rounded-bl-lg opacity-60"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r-4 border-b-4 border-green-500 rounded-br-lg opacity-60"></div>
              </div>

              {/* Certificate Title */}
              {certificate?.certificateTitle && (
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-300">
                    {certificate.certificateTitle}
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full mx-auto"></div>
                </div>
              )}

              {/* Certificate Badge */}
              <div className="mt-4 flex justify-center">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-500 text-white text-sm font-semibold rounded-full shadow-md">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
                  </svg>
                  International Recognition
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call-to-Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              বিশ্বমানের স্বীকৃতি
            </h3>
            <p className="text-gray-600 mb-6">
              এই আন্তর্জাতিক সার্টিফিকেটগুলো আপনার দক্ষতাকে বিশ্বব্যাপী স্বীকৃত করে। এগুলো আপনার ক্যারিয়ারের দরজা খুলে দেবে।
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-5 h-5 text-emerald-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-1.657 0-3-4.03-3-9s1.343-9 3-9m0 18c1.657 0 3-4.03 3-9s-1.343-9-3-9" />
                </svg>
                Global Standard
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-5 h-5 text-teal-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Industry Trusted
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-5 h-5 text-cyan-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                Career Advancement
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
