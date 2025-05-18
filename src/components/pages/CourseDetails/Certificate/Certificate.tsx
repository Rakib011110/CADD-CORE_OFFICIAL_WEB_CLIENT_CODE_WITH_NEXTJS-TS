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
    <div className="bg-blue-100 flex ">
      <div className="max-w-6xl mx-auto items-center justify-center content-center  py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 uppercase border-b-4 border-red-600 pb-2 mb-8">
          আন্তর্জাতিক স্বীকৃতি অর্জন করুন
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {validCertificates.map((certificate, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-lg transition duration-300"
            >
              <Image
                src={certificate.photoUrl.trim()}
                alt={`Certificate ${index + 1}`}
                width={800}
                height={600}
                className="w-full h-auto object-contain rounded-lg"
              />
              {certificate?.certificateTitle && (
                <p className="mt-2 text-center text-md text-gray-800">
                  {certificate.certificateTitle}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Certificate;
