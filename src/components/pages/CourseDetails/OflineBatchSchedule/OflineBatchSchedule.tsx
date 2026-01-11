import Link from "next/link";

export default function OfflineBatchSchedule() {
  return (
    <div className="max-w-6xl mx-auto p-3">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-100">
        {/* Header with Gradient */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-3">
          <div className="text-center">
            <h2 className="text-xl font-bold mb-1">অফলাইন ব্যাচ এর সময়সূচী</h2>
            <p className="text-red-100 text-xs">আমাদের পূর্ণাঙ্গ প্রশিক্ষণ প্রোগ্রামে যোগ দিন</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4">
          {/* Schedule Information Cards */}
          <div className="grid lg:grid-cols-2 gap-4 mb-4">

            {/* Schedule Details Card - January Batch */}
            <div className="bg-gray-50 rounded-md p-3 border  border-gray-200 hover:shadow-sm transition-all duration-300">
              <div className="flex items-center mb-3 ">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <h3 className="text-base font-bold text-black">ক্লাস সূচি (ফেব্রুয়ারি ব্যাচ)</h3>
              </div>
   <div className="flex items-center justify-between p-3 bg-black rounded border border-gray-100">
                  <span className="text-white text-lg mt-2 font-medium">শুরুর তারিখ:</span>
                  <span className="text-white font-medium font-serif text-lg mt-2">৫ ফেব্রুয়ারি, ২০২৬</span>
                </div>
              <div className="space-y-2">
                {/* Days */}
                <div className="flex items-center justify-between p-3 bg-black rounded border border-gray-100">
                  <span className="text-white text-lg mt-2 font-medium">দিন:</span>
                  <span className="text-white font-medium text-lg mt-2">সোমবার ও বৃহস্পতিবার</span>
                </div>

                {/* Time */}
                <div className="flex items-center justify-between p-3 bg-black rounded border border-gray-950">
                  <span className="text-white text-lg mt-2 font-medium">সময়:</span>
                  <span className="text-white font-medium text-lg mt-2">সন্ধ্যা ৬টা - রাত ৮টা</span>
                </div> 

              
              </div>
            </div>
            <div className="bg-gray-50 rounded-md p-3 border border-gray-200 hover:shadow-sm transition-all duration-300">
              <div className="flex items-center mb-3">
                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                <h3 className="text-base font-bold text-black">কোর্স ফি  </h3>
              </div>

              <div className="space-y-2">
                {/* Regular Fee */}
                <div className="p-3 bg-white rounded border border-gray-100">
                  <div className="text-center">
                    <p className="text-gray-600 text-xs mb-1">নিয়মিত কোর্স ফি</p>
                    <p className="text-xl font-bold text-black">৳১২,০০০</p>
                  </div>
                </div>

                {/* Discounted Fee */}
                <div className="p-3 bg-gradient-to-br from-red-50 to-red-100 rounded border-2 border-red-200 relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-bl">
                    ২০% ছাড়
                  </div>
                  <div className="text-center">
                    <p className="text-red-700 text-xs font-semibold mb-1">সম্পূর্ণ পেমেন্ট একসাথে</p>
                    <p className="text-lg font-bold text-red-600 mb-1">৳৯,৬০০</p>
                    <p className="text-red-700 text-xs">সম্পূর্ণ  পরিশোধ করলে সাশ্রয় হবে ৳২,৪০০</p>
                  </div>
                </div>
                   <div className=" mt-4  text-center">
            <button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-2 px-6 rounded-md transition-all duration-300 transform hover:scale-105 hover:shadow-md text-sm">
        <a  href="https://docs.google.com/forms/d/e/1FAIpQLSe27ZcsU6VdsyYPMD4JO5VwW4d9CI3_HtTG8YRxyo43gyzGWA/viewform"
                target="_blank">
         
            পেমেন্ট করুন
        
        </a> 

        
            </button>
            <p className="text-gray-500 text-xs mt-3 ">
              নিরাপদ পেমেন্ট • সহজ কিস্তি সুবিধা 
            </p>
          </div>
              </div>
            </div>
          </div>

          {/* Action Section */}
         

          {/* Important Notice */}
          <div className="mt-4 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-md border-l-4 border-red-500">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-red-500 rounded-full mt-0.5"></div>
              </div>
              <div className="ml-2">
                <h4 className="font-semibold text-black text-xs mb-1">গুরুত্বপূর্ণ নির্দেশনা</h4>
                <p className="text-gray-700 text-xs">
                 অফলাইন ব্যাচ এর আসন সংখ্যা সীমিত। আপনার স্থান নিশ্চিত করতে দ্রুত রেজিস্ট্রেশন করুন।
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
