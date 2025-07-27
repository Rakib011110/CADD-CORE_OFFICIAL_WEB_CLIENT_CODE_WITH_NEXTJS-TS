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
            className=" "
              src="https://res.cloudinary.com/dalpf8iip/image/upload/v1753593763/Pi7_autodesk-learning-partner-logo-rgb-black_wpqshs.webp"
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

  {/* Facebook */}
  <a href="https://facebook.com/caddcorebd" 
     target="_blank" 
     rel="noopener noreferrer" 
     className="text-[#1877F2] hover:text-white " 
     aria-label="Facebook">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v2.385z"></path>
    </svg>
  </a>
{/* YouTube (Using your provided link) */}
  <a href="https://www.youtube.com/c/caddcorebd" 
     target="_blank" 
     rel="noopener noreferrer" 
     className="text-red-500 hover:text-white" 
     aria-label="Youtube">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
    </svg>
  </a>
  {/* LinkedIn */}
  <a href="https://www.linkedin.com/company/cadd-core-ltd/" 
     target="_blank" 
     rel="noopener noreferrer" 
     className="text-[#0A66C2] hover:text-white" 
     aria-label="LinkedIn">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
    </svg>
  </a>

   {/* WhatsApp */}
  <a href="https://wa.me/+8801611223637" 
     target="_blank" 
     rel="noopener noreferrer" 
     className="text-green-400 hover:text-white" 
     aria-label="WhatsApp">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.459l-6.353 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.267.655 4.398 1.804 6.166l-1.32 4.825 4.918-1.284z"/>
    </svg>
  </a>


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
