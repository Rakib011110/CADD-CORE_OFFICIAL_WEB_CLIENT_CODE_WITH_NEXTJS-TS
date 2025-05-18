"use client";
import { ArrowBigRight, ArrowDownRightSquareIcon } from "lucide-react";
import { useState } from "react";
// Import from react-scroll for smooth scrolling
import { Link } from "react-scroll";
import { motion } from "framer-motion";

export default function DetailsHeadNav() {
  const [nav, setNav] = useState(false);

  const links = [
    { id: 1, link: "included-courses", label: "কোর্সে যা যা অন্তর্ভুক্ত" },
    { id: 2, link: "batch-schedule", label: "পরবর্তী ব্যাচের সময়সূচী" },
    { id: 3, link: "mastercourse-overview", label: "মাস্টারকোর্স ওভারভিউ" },
    { id: 4, link: "course-content", label: "এই কোর্সে যা যা থাকছে" },
    { id: 5, link: "software-taught", label: "যে সকল সফটওয়্যার শেখানো হবে" },
    { id: 6, link: "freelancing-guide", label: "ফ্রিল্যান্সিং গাইড" },
    { id: 7, link: "target-audience", label: "কোর্সটি যাদের জন্য" },
    { id: 8, link: "student-support", label: "ডেডিকেটেড স্টুডেন্ট সাপোর্ট" },
    { id: 9, link: "on-job-training", label: "অন-জব ট্রেইনিং" },
    { id: 10, link: "certificate-verification", label: "সার্টিফিকেট ভেরিফিকেশন" },
    { id: 11, link: "national-certificate", label: "ন্যাশনাল সার্টিফিকেট" },
    { id: 12, link: "international-certificate", label: "ইন্টারন্যাশনাল সার্টিফিকেট" },
    { id: 13, link: "project-work", label: "যে সকল প্রজেক্ট নিয়ে কাজ করবেন" },
    { id: 14, link: "why-choose-us", label: "কেন আমরা শিক্ষার্থীদের কাছে সেরা" },
    { id: 15, link: "experienced-advisors", label: "এক্সপেরিয়েন্সড অ্যাডভাইজার প্যানেল" },
    { id: 16, link: "professional-support", label: "প্রফেশনাল সাপোর্ট ইঞ্জিনিয়ার্স" },
    { id: 17, link: "faq", label: "FAQ" },
    { id: 18, link: "free-resources", label: "এই কোর্স রিলেটেড বিভিন্ন প্রয়োজনীয় ফ্রি ট্রে" },
  ];
  

  return (
    <nav className=" ">
      <div className=" mt-5 mb-4">

        {/* Desktop Menu */}
        <ul className=" ">
          {links.map(({ id, link, label }) => (
            <div key={id} className="cursor-pointer mt-1 hover:text-red-500 font-semibold ">
            
    
<Link 
             
                to={link}
                smooth={true}
                duration={500}
                offset={-70} 
              >
               
               
               <motion.div 
  initial={{ x: -50, opacity: 0 }}
  whileInView={{ x: 0, opacity: 1 }}
  transition={{ duration: 0.5 }}
  className="flex"
>  
<ArrowBigRight className="text-red-500"/> 
{label}

</motion.div>          
              
              </Link>

            
             
            </div>
          ))}
        </ul>

      
      
      </div>

      {/* Mobile Menu */}
      {nav && (
        <ul className="  px-4 py-2 ">
          {links.map(({ id, link, label }) => (
            <li
              key={id}
              className="cursor-pointer hover:text-red-500 text-xl"
            >
              <Link
                onClick={() => setNav(false)}
                to={link}
                smooth={true}
                duration={500}
                offset={-70}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}
