import React from "react";
import Image from "next/image";
import { TCourse } from "@/lib/courses";

const OurCertificate = ({ course }: { course: TCourse }) => {
  const validCertificates = Array.isArray(course?.demoCertificate)
    ? course.demoCertificate.filter(c => c?.photoUrl?.trim())
    : [];

  if (!course || validCertificates.length === 0) return null;

  return (
    <div className="bg-blue-100">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 uppercase border-b-4 border-red-600 pb-2 mb-6">
          কোর্স কমপ্লিশন এবং অটোডেস্ক সার্টিফিকেট
        </h2>
s
        <p className="text-center text-gray-700 max-w-3xl mx-auto mb-10">
          আমাদের কোর্স সম্পন্ন করার পর আপনি পাবেন অটোডেস্ক কর্তৃক প্রদত্ত সার্টিফিকেট।  
          এছাড়াও, আমাদের নিজস্ব সার্টিফিকেট প্রদান করা হয় যা আপনার দক্ষতা এবং অর্জিত জ্ঞানকে স্বীকৃতি দেয়।
        </p>

        <div
          className={`grid ${
            validCertificates.length === 1 ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2"
          } gap-8 justify-items-center`}
        >
          {validCertificates.map((certificate, index) => (
            <div
              key={index}
              className="bg-white p-4 w-full max-w-xl rounded-2xl shadow-md hover:shadow-lg transition duration-300"
            >
              <Image
                src={certificate.photoUrl.trim()}
                alt={`Certificate ${index + 1}`}
                width={1000}
                height={600}
                className="object-contain max-h-96 w-full rounded-lg"
              />
              {certificate.title && (
                <p className="mt-4 text-center text-md text-gray-800 font-medium">
                  {certificate.title}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurCertificate;
