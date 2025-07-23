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
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Contact Section */}
        <div>
          <h2 className="text-lg font-bold mb-4">যোগাযোগ</h2>
          <p className="text-gray-300">ঠিকানা</p>
          <p className="text-gray-200 text-sm">
            ১৪৯/এ,বায়তুশ শরফ কমপ্লেক্স(২য় তলা), এয়ারপোর্ট রোড,ফার্মগেট, ঢাকা-১২১৫
          </p>
          <p className="mt-2 text-gray-300">মোবাইল</p>
          <p className="text-gray-200 text-sm">
            +880 1611-223631 | +880 1611-223637
          </p>
          <p className="mt-2 text-gray-300">ইমেইল</p>
          <p className="text-gray-200 text-sm">caddcorebd@gmail.com</p>
        </div>

        {/* Quick Links */}
        <div>
          <h2 className="text-lg font-bold mb-4">কুইক লিংক</h2>
          <ul className="text-gray-200 space-y-2  text-sm">
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
  <a href="/about-us" className="hover:text-white ">আমাদের সম্পর্কে</a> 
<br /> <li className="">  </li>
           <a href="/student-corner" className="hover:text-white ">Verification Center</a> <br /> 
          
         
          
            {/* <li><a href="#" className="hover:text-white">ক্যারিয়ার</a></li> */}
          </ul> 
         
        </div>

        {/* Others */}
        <div>
          <h2 className="text-lg font-bold mb-4">অন্যান্য</h2>
          <ul className="text-gray-200 space-y-2 text-sm">
         <li><a href="https://www.facebook.com/groups/caddcore" className="hover:text-white">ইঞ্জিনিয়ারিং কমিউনিটি গ্রুপ</a></li>
         <li><a href="https://www.facebook.com/caddcorebd" className="hover:text-white">ফেসবুক পেজ</a></li>

            <li><a href="http://localhost:3000/privecy-policy" className="hover:text-white">প্রাইভেসি পলিসি</a></li>
            <li><a href="#" className="hover:text-white">রিফান্ড পলিসি</a></li>
          </ul>
        </div>
            
        {/* Support Center */}
        <div>
          <h2 className="text-lg font-bold mb-4">সাপোর্ট সেন্টার</h2>
          <p className="text-red-400 font-bold text-xl">+880 9613-202060</p>
          <p className="text-gray-200 text-sm mt-2">সকাল ৯ টা - সন্ধ্যা ৭ টা</p>
          <div className="flex space-x-4 mt-4">
            <a href="#" className="text-gray-200 hover:text-white text-xl">📘</a>
            <a href="#" className="text-gray-200 hover:text-white text-xl">🔗</a>
            <a href="#" className="text-gray-200 hover:text-white text-xl">💬</a>
          </div> 

          <div className="mt-">
            <Image
              src="https://res.cloudinary.com/dalpf8iip/image/upload/v1749027587/images__8_-removebg-preview_qfukeu.png"
              width={140}
              height={100}
              alt="Caddcore Logo"
            />
          </div> 

          
        </div> 

        
      </div>
<div className="max-w-6xl mx-auto mt-3 ">
            <Image 
            className="w-full mx-auto h-auto bg-black"
              src="https://res.cloudinary.com/dalpf8iip/image/upload/v1753097013/0_c8xd5e.png"
              width={1000}
              height={1000}
              alt="payment method"
            />
          </div>

      
    </footer>
  );
}
