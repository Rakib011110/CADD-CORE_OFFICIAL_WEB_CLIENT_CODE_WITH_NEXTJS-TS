import React from "react";
import Image from "next/image";
import { TCourse } from "@/lib/courses";

const OurCertificate = ({ course }: { course: TCourse }) => {
  const validCertificates = Array.isArray(course?.demoCertificate)
    ? course.demoCertificate.filter(c => c?.photoUrl?.trim())
    : [];

  if (!course || validCertificates.length === 0) return null;

  return (
    <div className="bg-blue-100 ">
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 uppercase border-b-4 border-red-600 pb-2 mb-8">
        ডেমো কোর্স কমপ্লিশন সার্টিফিকেট
        </h2>
        <div className=" max-w-7xl  mx-auto">
          {validCertificates.map((certificate, index) => (
            <div
              key={index}
              className="bg-white p-4 flex justify-center items-center rounded-xl shadow-md hover:shadow-lg transition duration-300"
            >
              <Image
                src={certificate.photoUrl.trim()}
                alt={`Certificate ${index + 1}`}
                width={1000}
                height={600}
                className=" max-h-96 mx-auto object-contain rounded-lg"
              />
              {certificate.title && (
                <p className="mt-2 text-center text-md text-gray-800">{certificate.title}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OurCertificate;
