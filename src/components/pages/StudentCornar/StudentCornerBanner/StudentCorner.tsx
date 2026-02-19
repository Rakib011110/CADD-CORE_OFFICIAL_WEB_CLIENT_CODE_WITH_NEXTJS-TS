import { PhoneCall, FileText, ShieldCheck, ArrowRight } from "lucide-react";
import CertificateVerification from "../CertificateVerification/CertificateVerification";

export const metadata = {
  title: "Student Corner - CADD CORE",
  description:
    "Verify certificates, explore popular courses, and access student support at CADD CORE Student Corner.",
  keywords: [
    "Student Corner",
    "Certificate Verification",
    "Popular Courses",
    "Support Forms",
    "CADD CORE",
  ],
  openGraph: {
    title: "Student Corner - CADD CORE",
    description:
      "Everything a student needs: certificate verification, popular courses, and full support at CADD CORE Student Corner.",
    type: "website",
  },

  authors: [{ name: "CADD CORE" }],
  creator: "CADD CORE",
  publisher: "CADD CORE",
};

export default function StudentCornerBannar() {
  return (
    <section className="bg-white py-16 px-6 border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header Section - Redesigned for Full Width & Better Look */}
        <div className="w-full bg-gradient-to-b from-red-50/50 to-white py-12 px-6 md:px-12 rounded-3xl mb-12 border border-red-50 text-center relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern
                  id="grid-pattern"
                  width="40"
                  height="40"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M0 40L40 0H20L0 20M40 40V20L20 40"
                    stroke="#DC2626"
                    strokeWidth="2"
                    fill="none"
                  />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-pattern)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto space-y-8">
            <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-tight">
              স্টুডেন্টস <span className="text-red-600">কর্নার</span>
            </h2>

            <div className="h-1.5 w-32 bg-red-600 mx-auto rounded-full"></div>

            <p className="text-xl md:text-2xl text-gray-700 leading-relaxed font-medium">
              সফলতার জন্য ক্যাড কোর ছাত্র ছাত্রী এবং সকল শুভাকাঙ্ক্ষীদের অবদান
              অপরিসীম। ক্যাড কোরে আপনার সাফল্যকে আমাদের সাফল্য হিসেবে বিবেচনা
              করি এবং এই লক্ষে আপনাকে সকল সুবিধা প্রদানে আমরা প্রতিশ্রুতিবদ্ধ।
            </p>
          </div>
        </div>

        {/* Certificate Application Section - Full Width Banner */}
        <div className="w-full mb-16">
          <div className="relative overflow-hidden bg-gradient-to-r from-red-700 to-rose-900 rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10 group transition-all hover:shadow-red-900/20">
            {/* Decorative Orbs */}
            <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-red-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-rose-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>

            {/* Content */}
            <div className="relative z-10 text-white space-y-6 max-w-3xl text-center lg:text-left">
              <div className="flex flex-col lg:flex-row items-center gap-4 justify-center lg:justify-start">
                <div className="bg-white/10 p-4 rounded-full backdrop-blur-md border border-white/20 shadow-inner">
                  <FileText className="text-white w-10 h-10" strokeWidth={2} />
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                  সার্টিফিকেটের জন্য আবেদন
                </h3>
              </div>
              <p className="text-red-50 text-lg md:text-xl leading-relaxed font-light">
                আপনার কোর্স সম্পন্ন হলে নিচের বাটনে ক্লিক করে সার্টিফিকেটের জন্য
                আবেদন ফর্মটি পূরণ করুন। আপনার এই অর্জন আমাদের গর্বের।
              </p>
            </div>

            {/* Action Button */}
            <div className="relative z-10 shrink-0">
              <a
                href="https://forms.gle/AQudHSVWKkteouY6A"
                target="_blank"
                rel="noopener noreferrer"
                className="group/btn relative inline-flex items-center gap-3 bg-white text-red-700 hover:bg-red-50 px-10 py-5 rounded-full font-bold text-lg shadow-xl shadow-black/10 transition-all duration-300 transform hover:scale-105 active:scale-95 ring-4 ring-white/10"
              >
                <span>আবেদন ফর্ম খুলুন</span>
                <span className="bg-red-100/50 p-1 rounded-full group-hover/btn:translate-x-1 transition-transform">
                  <ArrowRight size={20} className="text-red-700" />
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Info Text & Video Section (2-Column) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mt-12 mb-12">
          {/* Left Column: Info Text */}
          <div className="bg-red-50 p-8 rounded-2xl border border-red-100 h-full flex flex-col justify-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              প্রিয় শিক্ষার্থীবৃন্দ! 👋
            </h3>
            <p className="text-gray-700 font-medium text-lg leading-relaxed">
              স্টুডেন্ট কর্নারের মাধ্যমে আপনি যে কোনো ধরনের{" "}
              <span className="text-red-600 font-bold">সেবা অনুরোধ</span>, আপনার{" "}
              <span className="text-red-600 font-bold">মূল্যবান মতামত</span>,
              কিংবা কোনো <span className="text-red-600 font-bold">অভিযোগ</span>{" "}
              আমাদের জানাতে পারেন। আমরা আপনার মতামতকে গুরুত্ব সহকারে বিবেচনা
              করি।
            </p>
          </div>

          {/* Right Column: Video */}
          <div className="w-full h-full min-h-[250px] md:min-h-[300px] rounded-2xl overflow-hidden shadow-lg border border-gray-200">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/O9L-fCFBKr4?si=Cl9wzm7GF2Nyj8xQ"
              title="Student Support Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* 3-Grid Layout */}
        {/* 3-Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {/* Grid Item 1: Student Complaint Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center group">
            <div className="bg-red-50 p-5 rounded-full mb-6 group-hover:bg-red-100 transition-colors">
              <FileText className="text-red-600 w-10 h-10" strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-red-600 transition-colors">
              স্টুডেন্ট কমপ্লেইন ফর্ম
            </h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              আপনার কোনো অভিযোগ থাকলে আমাদের জানান, আমরা দ্রুত সমাধানের চেষ্টা
              করব।
            </p>
            <a
              href="#"
              className="mt-auto inline-flex items-center gap-2 text-red-600 font-semibold hover:text-red-700 transition-colors group/link"
            >
              <span>অভিযোগ করুন</span>
              <ArrowRight
                size={18}
                className="group-hover/link:translate-x-1 transition-transform"
              />
            </a>
          </div>

          {/* Grid Item 2: Service Request Form */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center group">
            <div className="bg-blue-50 p-5 rounded-full mb-6 group-hover:bg-blue-100 transition-colors">
              <PhoneCall
                className="text-blue-600 w-10 h-10"
                strokeWidth={1.5}
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
              সার্ভিস রিকোয়েস্ট ফর্ম
            </h3>
            <p className="text-gray-600 text-center mb-6 leading-relaxed">
              যেকোনো একাডেমিক বা প্রশাসনিক সেবার জন্য সরাসরি আবেদন করুন।
            </p>
            <a
              href="#"
              className="mt-auto inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors group/link"
            >
              <span>রিকোয়েস্ট করুন</span>
              <ArrowRight
                size={18}
                className="group-hover/link:translate-x-1 transition-transform"
              />
            </a>
          </div>

          {/* Grid Item 3: Certificate Verification */}
          <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center group h-full">
            <div className="bg-green-50 p-5 rounded-full mb-6 group-hover:bg-green-100 transition-colors">
              <ShieldCheck
                className="text-green-600 w-10 h-10"
                strokeWidth={1.5}
              />
            </div>
            <div className="w-full">
              <CertificateVerification />
            </div>
          </div>
        </div>

        {/* Buttons Section */}
        <div className="mt-16 flex flex-col md:flex-row justify-center gap-6">
          {/* Button 1 */}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdMEJoWiucoRsaWMFO-ewUcPNwRfKkWKOH_MQnDb2VdrKxGWQ/viewform"
            className="flex items-center justify-center gap-3 bg-white text-red-600 px-8 py-4 rounded-full font-bold text-lg shadow-md hover:shadow-xl hover:bg-red-50 hover:-translate-y-1 transition-all duration-300 border border-red-100 group"
          >
            <div className="bg-red-100 p-2 rounded-full group-hover:bg-white transition-colors">
              <PhoneCall size={20} className="text-red-600" />
            </div>
            <span>সি.ই.ও এর সাথে কথা বলুন</span>
          </a>

          {/* Button 2 */}
          <a
            href="tel:09613202060"
            className="flex items-center justify-center gap-3 bg-red-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-red-500/30 hover:bg-red-700 hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className="bg-white/20 p-2 rounded-full group-hover:bg-white/30 transition-colors">
              <PhoneCall size={20} className="text-white" />
            </div>
            <span>কাস্টমার সার্ভিসে যোগাযোগ করুন</span>
          </a>
        </div>
      </div>
    </section>
  );
}
