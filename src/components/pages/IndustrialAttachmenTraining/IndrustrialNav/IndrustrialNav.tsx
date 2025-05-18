"use client";
import { ArrowBigRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-scroll";
import { motion } from "framer-motion";

export default function IndustrialTrainingNav() {
  const [nav, setNav] = useState(false);

  const links = [
    { id: 1, link: "overview", label: "ট্রেইনিং ওভারভিউ" },
    { id: 2, link: "departments", label: "ডিপার্টমেন্ট অনুযায়ী ট্রেইনিং" },
    { id: 9, link: "contact-form", label: "বিস্তারিত জানুন / ফর্ম পূরণ করুন" },
    { id: 3, link: "included-videos", label: "ফ্রি ভিডিও কনটেন্ট" },
    { id: 4, link: "training-benefits", label: "ট্রেইনিংয়ের উপকারিতা" },
    { id: 5, link: "career-path", label: "ক্যারিয়ার পাথ" },
    { id: 6, link: "job-placement", label: "জব প্লেসমেন্ট সাপোর্ট" },
    { id: 7, link: "certificate-info", label: "সার্টিফিকেট সম্পর্কিত তথ্য" },
    { id: 8, link: "faq", label: "FAQ" },
  ];

  return (
    <nav className="">
      <div className="mb-4">
        <ul className="">
          {links.map(({ id, link, label }) => (
            <div
              key={id}
              className="cursor-pointer mt-2  border-2 p-1 hover:text-red-500 font-semibold"
            >
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
                  <ArrowBigRight className="text-red-500" />
                  {label}
                </motion.div>
              </Link>
            </div>
          ))}
        </ul>
      </div>

      {nav && (
        <ul className="px-4 py-2">
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
