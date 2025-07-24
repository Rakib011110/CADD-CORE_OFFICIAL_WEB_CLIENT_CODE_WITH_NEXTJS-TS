"use client"
import Image from "next/image";
import { Link } from "react-scroll";

export default function Footer() {
  const links = [
    { id: 1, link: "seminar-time", label: "ফ্রি সেমিনারের সময়সূচি" },
    { id: 2, link: "success-story", label: "সাকসেস স্টোরি" },
  ];

  return (
    <footer className="bg-black text-white py-10 px-5 md:px-10">
       <div className="bg-gray-900 mb-2 text-white py-6">
      {/* This is the main container. 
        I've added `px-4 sm:px-6 lg:px-8` to create responsive horizontal padding.
        - px-4: Adds padding on mobile.
        - sm:px-6: Adds slightly more padding on small screens and up.
        - lg:px-8: Adds the most padding on large screens and up.
      */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Contact Section */}
        <div>
          <h2 className="text-lg font-bold mb-4">যোগাযোগ</h2>
          <p className="text-gray-300">ঠিকানা</p>
          <p className="text-gray-200 text-sm">
            ১৪৯/এ, এয়ারপোর্ট রোড, বায়তুশ শরফ মসজিদ কমপ্লেক্স, মনিপুরীপাড়া, তেজগাঁও, ঢাকা-১২১৫
          </p>
          <p className="mt-4 text-gray-300">মোবাইল</p>
          <p className="text-gray-200 text-sm">
            +880 1611-223631 | +880 1611-223637
          </p>
          <p className="mt-4 text-gray-300">ইমেইল</p>
          <p className="text-gray-200 text-sm">caddcorebd@gmail.com</p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-bold mb-4">কুইক লিংক</h2>
          {/* I've cleaned up this list to use proper <li> tags for each link */}
          <ul className="text-gray-200 space-y-2 text-sm">
            {links.map(({ id, link, label }) => (
              <li key={id}>
                <Link
                  to={link}
                  smooth={true}
                  duration={500}
                  offset={-70}
                  className="cursor-pointer hover:text-white"
                >
                  {label}
                </Link>
              </li>
            ))}
            <li>
              <a href="/about-us" className="hover:text-white">আমাদের সম্পর্কে</a>
            </li>
            <li>
              <a href="/student-corner" className="hover:text-white">Verification Center</a>
            </li>
            {/* <li><a href="#" className="hover:text-white">ক্যারিয়ার</a></li> */}
          </ul>
        </div>

        {/* Others */}
        <div>
          <h2 className="text-lg font-bold mb-4">অন্যান্য</h2>
          <ul className="text-gray-200 space-y-2 text-sm">
            <li><a href="https://www.facebook.com/groups/caddcore" className="hover:text-white">ইঞ্জিনিয়ারিং কমিউনিটি গ্রুপ</a></li>
            <li><a href="https://www.facebook.com/caddcorebd" className="hover:text-white">ফেসবুক পেজ</a></li>
            <li><a href="https://www.caddcore.net/privecy-policy" className="hover:text-white">প্রাইভেসি পলিসি</a></li>
            <li><a href="https://www.caddcore.net/privecy-policy" className="hover:text-white">রিফান্ড পলিসি</a></li>
             <div className="mt-4">
            <Image 
            className="bg-white"
              src="https://res.cloudinary.com/dalpf8iip/image/upload/v1753341425/autodesk-atc-logo-2022_clwrbr.png"
              width={150}
              height={100}
              alt="Caddcore Logo"
            />
          </div>
          </ul>
        </div>
            
        {/* Support Center */}
        <div>
          <h2 className="text-lg font-bold mb-4">সাপোর্ট সেন্টার</h2>
          <p className="text-red-400 font-bold text-xl">+880 9613-202060</p>
          <p className="text-gray-200 text-sm mt-2">সকাল ৯ টা - সন্ধ্যা ৭ টা</p>
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com/caddcorebd" className="text-gray-200 hover:text-white text-xl" aria-label="Facebook">📘</a>
            <a href="https://linkedin.com/company/caddcore" className="text-gray-200 hover:text-white text-xl" aria-label="LinkedIn">🔗</a>
            <a href="https://youtube.com/c/caddcore" className="text-gray-200 hover:text-white text-xl" aria-label="Youtube">▶️</a>
          </div>
          <div className="mt-4">
            <Image
              src="https://res.cloudinary.com/dalpf8iip/image/upload/v1749027587/images__8_-removebg-preview_qfukeu.png"
              width={150}
              height={100}
              alt="Caddcore Logo"
            />
          </div>
        </div>
      </div>
    </div>
<div className=" mx-auto max-w-6xl ">
            <Image 
            className="w-full mx-auto h-auto bg-black rounded-md"
              src="https://res.cloudinary.com/dalpf8iip/image/upload/v1753097013/0_c8xd5e.png"
              width={1000}
              height={1000}
              alt="payment method"
            />
          </div>
  <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center mt-8 text-gray-300 text-sm gap-2">
        <p>© 2023 Caddcore. All rights reserved.</p>
        <p>Trade License:  000257</p>
        <p>V: 1.0.0</p>
      </div>
    </footer>
  );
}
