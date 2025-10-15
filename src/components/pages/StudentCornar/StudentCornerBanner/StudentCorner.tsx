import { PhoneCall } from "lucide-react";
import CertificateVerification from "../CertificateVerification/CertificateVerification";


export const metadata = {
  title: "Student Corner - CADD CORE",
  description: "Verify certificates, explore popular courses, and access student support at CADD CORE Student Corner.",
  keywords: ["Student Corner", "Certificate Verification", "Popular Courses", "Support Forms", "CADD CORE"],
  openGraph: {
    title: "Student Corner - CADD CORE",
    description: "Everything a student needs: certificate verification, popular courses, and full support at CADD CORE Student Corner.",
    type: "website",
  },
 
  authors: [{ name: "CADD CORE" }],
  creator: "CADD CORE",
  publisher: "CADD CORE",
};


export default function StudentCornerBannar() {
  return (
    <section className="bg-white py-16 px-6 border-b border-gray-200">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-black">স্টুডেন্টস কর্নার</h2>

        <p className="text-lg text-gray-700 mt-4">
          সফলতার জন্য ক্যাড কোর ছাত্র ছাত্রী এবং সকল শুভাকাঙ্ক্ষীদের অবদান অপরিসীম। ক্যাড কোরে আপনার
          সফলাকে আমাদের সাফল্য হিসেবে বিবেচনা করি এবং এই লক্ষ্য আপনাকে সকল সুবিধা প্রদান প্রতিশ্রুতিবদ্ধ।
        </p>

        <p className="text-lg text-gray-700 mt-2">
          স্টুডেন্ট কর্নারের মাধ্যমে আপনি যে কোনো ধরনের সেবা অনুরোধ, আপনার মূল্যবান মতামত, কিংবা কোনো অভিযোগ আমাদের জানাতে পারেন।
        </p>

        <CertificateVerification />

        {/* Buttons Section */}
        <div className="mt-8 flex flex-col md:flex-row justify-center gap-4">
          {/* Button 1 */}
          <a
            href="https://docs.google.com/forms/d/e/1FAIpQLSdMEJoWiucoRsaWMFO-ewUcPNwRfKkWKOH_MQnDb2VdrKxGWQ/viewform"
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-red-700 transition border border-red-600"
          >
            <PhoneCall size={20} />
            সি.ই.ও এর সাথে কথা বলুন
          </a>

          {/* Button 2 */}
          <a
            href="tel:09613202060"
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-semibold text-lg shadow-lg hover:bg-red-700 transition border border-red-600"
          >
            <PhoneCall size={20} />
            কাস্টমার সার্ভিসে যোগাযোগ করুন
          </a>
        </div>
      </div>
    </section>
  );
}
