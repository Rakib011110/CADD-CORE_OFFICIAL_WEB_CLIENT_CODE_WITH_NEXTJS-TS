"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useUser } from "@/context/user.provider";
import { logout } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Notifications from "@/components/Notifications/Notifications";

const navLinks = [
  { name: "হোম", path: "/" },
  { name: "কোর্স সমূহ", path: "/courses" },
   { name: "ATC® কোর্স সমূহ", path: "/autodesk-authorised-training-institute-courses" },

  { name: "ইন্ডাস্ট্রিয়াল এটাচমেন্ট", path: "/industrial-attachment-training" },
  { name: "স্টুডেন্ট কর্নার", path: "/student-corner" },
  // { name: "লাইভ ইভেন্ট", path: "https://docs.google.com/forms/d/e/1FAIpQLScZysZu-d44Md-KbsIPXOX-wuoobxWbcBaXN04ITkgWYNR6Fw/viewform" },
];

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, setUser, setIsLoading } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setUser(null);
    setIsLoading(false);
    router.push("/");
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

 

  return (
    <nav style={{ fontFamily: "banglaFont" }}  className="bg-gradient-to-r  from-red-500 to-red-400 px-6 py-4 flex items-center justify-between relative z-50">
      {/* Logo */}
      <Link href="/" className="w-36">
        <motion.div whileHover={{ scale: 1.05 }} className="cursor-pointer">
          <img
            src="https://cdn-ilbhfhh.nitrocdn.com/GQAjASDcQJAOSFnCNbjHAwgJDnuIafbo/assets/images/optimized/rev-f913869/caddcore.net/wp-content/uploads/2023/03/cropped-cadd-01.png"
            alt="Logo"
          />
        </motion.div>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6 text-white font-semibold">
        {navLinks.map(({ name, path }) => (
          <motion.div key={name} whileHover={{ scale: 1.05, y: -1 }}>
            <Link
              href={path}
             
              className="transition-all duration-300 hover:border-b-2 border-white pb-1"
            >
              {name}
            </Link>
          </motion.div>
        ))}

        {/* Dropdown */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={toggleDropdown}
            className="flex items-center focus:outline-none"
          >
       <Link href={"/about-us"}> 
       আমাদের সম্পর্কে
       </Link> <ChevronDown size={16} className="ml-1" />
          </motion.button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-2 w-40 bg-white text-black shadow-md rounded-md z-50"
              >
                <Link
                  href="/team"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  আমাদের টিম
                </Link>
                <Link
                  href="/job"
                  className="block px-4 py-2 hover:bg-gray-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  Career
                </Link> 

                
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop Auth */}
      <div className="hidden md:flex items-center space-x-6 text-white font-semibold">
        {user ? (
          <> 
            <motion.div whileHover={{ scale: 1.05 }}>
              <Notifications />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }}>
              <Link href="/dashboard/manage-courses">ড্যাশবোর্ড</Link>
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleLogout}
              className="bg-white text-red-500 font-bold px-4 py-2 rounded-lg shadow-md hover:bg-gray-100"
            >
              লগআউট
            </motion.button>
          </>
        ) : (
          <motion.div whileHover={{ scale: 1.05 }}>
            <Link
              href="https://docs.google.com/forms/d/e/1FAIpQLScZysZu-d44Md-KbsIPXOX-wuoobxWbcBaXN04ITkgWYNR6Fw/viewform"
              target="_blank"
              className="bg-white text-red-500 font-bold px-4 py-2 rounded-lg shadow-md hover:bg-gray-100"
            >
              লাইভ ইভেন্ট
            </Link>
          </motion.div>
        )}
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden">
        <button onClick={toggleMobileMenu} className="text-white">
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="absolute top-full left-0 w-full bg-red-500 text-white flex flex-col space-y-4 py-4 md:hidden overflow-hidden z-40"
          >
            {navLinks.map(({ name, path }) => (
              <Link
                key={name}
                href={path}
              
                className="px-6 hover:underline"
                onClick={() => setMobileMenuOpen(false)}
              >
                {name}
              </Link>
            ))}

            {/* Dropdown in Mobile */}
            <div className="px-6">
              <button
                onClick={toggleDropdown}
                className="flex items-center w-full focus:outline-none"
              >
               <Link href={"/about-us"}> 
       আমাদের সম্পর্কে
       </Link> <ChevronDown size={16} className="ml-1" />
              </button>
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2 ml-4 bg-white text-black rounded-md shadow-md"
                  >
                    <Link
                      href="/team"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => {
                        setDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      আমাদের টিম
                    </Link>
                    <Link
                      href="/job"
                      className="block px-4 py-2 hover:bg-gray-200"
                      onClick={() => {
                        setDropdownOpen(false);
                        setMobileMenuOpen(false);
                      }}
                    >
                      Career
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Auth */}
            {user ? (
             <div>
              {/* <div>
                <Notifications />
              </div> */}

<button
                onClick={handleLogout}
                className="px-6 text-white bg-red-700 py-2 rounded-lg"
              >
                লগআউট
              </button>

             </div>
            ) : (
              <Link
                href="https://forms.gle/XnZP35yKbjXGCtGz7"
                target="_blank"
                className="px-6 text-white bg-blue-500 py-2 rounded-lg"
              >
                লাইভ ইভেন্ট
              </Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
