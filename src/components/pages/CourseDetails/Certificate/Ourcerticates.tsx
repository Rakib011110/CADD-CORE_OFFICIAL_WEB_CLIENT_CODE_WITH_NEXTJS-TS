import React from "react";
import Image from "next/image";
import { TCourse } from "@/lib/courses";
import CertificateVerification from "../../StudentCornar/CertificateVerification/CertificateVerification";

const OurCertificate = ({ course }: { course: TCourse }) => {
  const validCertificates = Array.isArray(course?.demoCertificate)
    ? course.demoCertificate.filter(c => c?.photoUrl?.trim())
    : [];

  if (!course || validCertificates.length === 0) return null;

  return (
    <div className=" min-h-screen ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          {/* <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-600 to-red-700 rounded-full mb-6 shadow-lg">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div> */}
          <h2 className="text-4xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
            কোর্স কমপ্লিশন এবং অটোডেস্ক সার্টিফিকেট
          </h2>
          <div className="flex justify-center mb-6">
            <div className="w-32 h-1 bg-gradient-to-r from-red-600 to-red-600 rounded-full"></div>
          </div>
          <p className="text-md text-gray-700 max-w-4xl mx-auto leading-relaxed">
            আমাদের কোর্স সম্পন্ন করার পর আপনি পাবেন অটোডেস্ক কর্তৃক প্রদত্ত সার্টিফিকেট।
            এছাড়াও, আমাদের নিজস্ব সার্টিফিকেট প্রদান করা হয় যা আপনার দক্ষতা এবং অর্জিত জ্ঞানকে স্বীকৃতি দেয়।
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
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Image
                  src={certificate.photoUrl.trim()}
                  alt={`Certificate ${index + 1}`}
                  width={1000}
                  height={600}
                  className="object-contain w-full h-80 rounded-xl shadow-lg group-hover:scale-105 transition-transform duration-500"
                />
                {/* Decorative corner elements */}
                <div className="absolute top-2 left-2 w-6 h-6 border-l-4 border-t-4 border-blue-500 rounded-tl-lg opacity-60"></div>
                <div className="absolute top-2 right-2 w-6 h-6 border-r-4 border-t-4 border-purple-500 rounded-tr-lg opacity-60"></div>
                <div className="absolute bottom-2 left-2 w-6 h-6 border-l-4 border-b-4 border-purple-500 rounded-bl-lg opacity-60"></div>
                <div className="absolute bottom-2 right-2 w-6 h-6 border-r-4 border-b-4 border-blue-500 rounded-br-lg opacity-60"></div>
              </div>

              {/* Certificate Title */}
              {certificate.title && (
                <div className="mt-6 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {certificate.title}
                  </h3>
                  <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto"></div>
                </div>
              )}

              {/* Certificate Badge */}
              <div className="mt-4 flex justify-center">
                <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-sm font-semibold rounded-full shadow-md">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Verified Certificate
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Call-to-Action */}
        <div className="text-center mt-12 mb-10">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-4xl mx-auto">
            <div className="text-2xl font-bold text-gray-900 mb-4">
            <CertificateVerification />
            </div>
            <p className="text-gray-600 mb-6">
              এই সার্টিফিকেটগুলো আপনার দক্ষতা এবং অঙ্গীকারের প্রমাণ। এগুলো আপনার ক্যারিয়ারে একটি মূল্যবান সম্পদ হিসেবে কাজ করবে।
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Industry Recognized
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Secure & Verified
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <svg className="w-5 h-5 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Career Booster
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OurCertificate;
