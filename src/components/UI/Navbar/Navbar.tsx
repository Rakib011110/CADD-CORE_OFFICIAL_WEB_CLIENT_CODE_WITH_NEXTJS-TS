"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  PhoneCall,
  Clock,
  MapPin,
  Award,
  Users,
  ChevronDown,
  Menu,
  X,
  LogIn,
  LogOut,
  LayoutDashboard,
  GraduationCap,
  Info,
  Briefcase,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { useUser } from "@/context/user.provider";
import { logout } from "@/services/AuthService";
import Notifications from "@/components/Notifications/Notifications";

// Compact About Us dropdown links
const aboutLinks = [
  {
    title: "আমাদের পরিচিতি",
    path: "/about-us",
    icon: Info,
  },
  {
    title: "আমাদের টিম",
    path: "/team",
    icon: Users,
  },
  {
    title: "Career",
    path: "/job",
    icon: Briefcase,
    badge: "Hiring",
  },
  {
    title: "ভেরিফিকেশন সেন্টার",
    path: "/student-corner",
    icon: ShieldCheck,
  },
];

export default function Navbar() {
  const [aboutDropdownOpen, setAboutDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileAboutOpen, setMobileAboutOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const aboutRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);

  const { user, setUser, setIsLoading } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  // Scroll detection to make main navbar stay fixed
  useEffect(() => {
    const handleScroll = () => {
      const threshold = topBarRef.current?.offsetHeight || 32;
      setIsScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setAboutDropdownOpen(false);
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (aboutRef.current && !aboutRef.current.contains(target)) {
        setAboutDropdownOpen(false);
      }
      if (userRef.current && !userRef.current.contains(target)) {
        setUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setUser(null);
    setIsLoading(false);
    setUserDropdownOpen(false);
    router.push("/");
  };

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/") return true;
    if (path !== "/" && pathname?.startsWith(path)) return true;
    return false;
  };

  return (
    <header
      style={{ fontFamily: "banglaFont, system-ui, sans-serif" }}
      className="w-full relative z-50 selection:bg-red-500 selection:text-white"
    >
      {/* ============================================================== */}
      {/* TIER 1: TOP MICRO UTILITY BAR (COMPACT & SLEEK)                 */}
      {/* ============================================================== */}
      <div
        ref={topBarRef}
        className="bg-[#0b0c10] text-zinc-300 border-b border-white/10 text-[11.5px] sm:text-xs py-1 px-4 lg:px-8"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
          {/* Left contact info */}
          <div className="flex items-center gap-3 sm:gap-5 flex-wrap">
            <a
              href="tel:+8801611223631"
              className="flex items-center gap-1.5 font-medium hover:text-white transition-colors group"
              title="কল করুন"
            >
              <div className="w-4 h-4 rounded-full bg-red-600/30 text-red-400 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                <PhoneCall size={9} />
              </div>
              <span className="tracking-wide">+880 1611-223631</span>
            </a>

            <div className="hidden sm:flex items-center gap-1.5 text-zinc-400">
              <Clock size={11} className="text-red-500" />
              <span>সকাল ৯টা - সন্ধ্যা ৭টা</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-zinc-400">
              <MapPin size={11} className="text-red-500" />
              <span>ফার্মগেট, ঢাকা</span>
            </div>
          </div>

          {/* Right badges & community */}
          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/autodesk-authorised-training-institute-courses"
              className="hidden lg:flex items-center gap-1 text-zinc-300 hover:text-amber-400 transition-colors"
            >
              <Award size={12} className="text-amber-400" />
              <span className="font-medium">Autodesk® ATC</span>
            </Link>

            <a
              href="https://www.facebook.com/groups/caddcore"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-zinc-300 hover:text-white transition-colors"
            >
              <Users size={11} className="text-blue-400" />
              <span>কমিউনিটি</span>
            </a>

            {/* Live Seminar Badge */}
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLScZysZu-d44Md-KbsIPXOX-wuoobxWbcBaXN04ITkgWYNR6Fw/viewform"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-white bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 px-2 py-0.5 rounded-full text-[10.5px] font-semibold transition-all shadow-sm"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white"></span>
              </span>
              <span>ফ্রি লাইভ সেমিনার</span>
            </a>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TIER 2: MAIN MODERN NAVIGATION BAR                             */}
      {/* ============================================================== */}
      <nav
        className={`w-full transition-all duration-200 ${
          isScrolled
            ? "fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#ba161c] via-[#dc2626] to-[#ba161c] border-b border-red-900/50 shadow-xl shadow-black/25"
            : "relative z-40 bg-gradient-to-r from-[#ba161c] via-[#dc2626] to-[#ba161c] border-b border-red-900/40 shadow-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2 flex items-center justify-between relative">
          {/* Logo (Clean, no Autodesk Partner badge) */}
          <Link href="/" className="flex items-center py-0.5">
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="cursor-pointer transition-transform"
            >
              <img
                src="https://res.cloudinary.com/dalpf8iip/image/upload/v1755492733/Cadd_core_logo_white_png_v3fdci.png"
                alt="CADD CORE Logo"
                className="h-8 md:h-9 w-auto object-contain"
              />
            </motion.div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center gap-1 text-white font-medium text-[14.5px]">
            {/* Home */}
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center ${
                isActive("/")
                  ? "bg-white/20 text-white font-bold backdrop-blur-sm border border-white/20 shadow-sm"
                  : "text-white/95 hover:text-white hover:bg-white/15"
              }`}
            >
              <span>হোম</span>
            </Link>

            {/* Courses - Direct Link with LIVE badge (No dropdown) */}
            <Link
              href="/courses"
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
                isActive("/courses")
                  ? "bg-white/20 text-white font-bold backdrop-blur-sm border border-white/20 shadow-sm"
                  : "text-white/95 hover:text-white hover:bg-white/15"
              }`}
            >
              <span>কোর্স সমূহ</span>
              <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9.5px] font-extrabold bg-amber-400 text-zinc-950 uppercase leading-none shadow-sm animate-pulse">
                LIVE
              </span>
            </Link>

            {/* One to One Training */}
            <Link
              href="/one-to-one-training"
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center ${
                isActive("/one-to-one-training")
                  ? "bg-white/20 text-white font-bold backdrop-blur-sm border border-white/20 shadow-sm"
                  : "text-white/95 hover:text-white hover:bg-white/15"
              }`}
            >
              <span>ওয়ান টু ওয়ান ট্রেনিং</span>
            </Link>

            {/* Industrial Attachment (Clean, no LIVE badge) */}
            <Link
              href="/industrial-attachment-training"
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center ${
                isActive("/industrial-attachment-training")
                  ? "bg-white/20 text-white font-bold backdrop-blur-sm border border-white/20 shadow-sm"
                  : "text-white/95 hover:text-white hover:bg-white/15"
              }`}
            >
              <span>ইন্ডাস্ট্রিয়াল এটাচমেন্ট</span>
            </Link>

            {/* Student Corner */}
            <Link
              href="/student-corner"
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center ${
                isActive("/student-corner")
                  ? "bg-white/20 text-white font-bold backdrop-blur-sm border border-white/20 shadow-sm"
                  : "text-white/95 hover:text-white hover:bg-white/15"
              }`}
            >
              <span>স্টুডেন্ট কর্নার</span>
            </Link>

            {/* About Us (Clean compact dropdown) */}
            <div
              ref={aboutRef}
              className="relative"
              onMouseEnter={() => setAboutDropdownOpen(true)}
              onMouseLeave={() => setAboutDropdownOpen(false)}
            >
              <button
                onClick={() => setAboutDropdownOpen(!aboutDropdownOpen)}
                className={`px-3 py-1.5 rounded-lg transition-all duration-200 flex items-center gap-1 focus:outline-none ${
                  isActive("/about-us") ||
                  isActive("/team") ||
                  isActive("/job") ||
                  aboutDropdownOpen
                    ? "bg-white/20 text-white font-bold backdrop-blur-sm border border-white/20 shadow-sm"
                    : "text-white/95 hover:text-white hover:bg-white/15"
                }`}
              >
                <span>আমাদের সম্পর্কে</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${
                    aboutDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <AnimatePresence>
                {aboutDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-1.5 w-52 bg-white text-zinc-800 rounded-xl shadow-xl border border-gray-100 p-1.5 z-50 overflow-hidden"
                  >
                    <div className="flex flex-col gap-0.5">
                      {aboutLinks.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Link
                            key={item.title}
                            href={item.path}
                            onClick={() => setAboutDropdownOpen(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-red-50 text-zinc-700 hover:text-red-600 transition-colors text-sm font-medium"
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon size={15} className="text-red-500" />
                              <span>{item.title}</span>
                            </div>
                            {item.badge && (
                              <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500 text-white">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2.5">
                {/* Notifications */}
                <div className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-sm">
                  <Notifications iconClassName="w-4 h-4 text-white" />
                </div>

                {/* User Dropdown Pill */}
                <div ref={userRef} className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all backdrop-blur-sm focus:outline-none"
                  >
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.name || "User"}
                        className="w-6 h-6 rounded-md object-cover border border-white/30"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-md bg-white text-red-600 font-black text-xs flex items-center justify-center">
                        {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                      </div>
                    )}

                    <span className="text-xs font-bold text-white max-w-[90px] truncate">
                      {user.name || "প্রোফাইল"}
                    </span>

                    <ChevronDown
                      size={13}
                      className={`text-white/80 transition-transform duration-200 ${
                        userDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* User Profile Popover */}
                  <AnimatePresence>
                    {userDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 6, scale: 0.98 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className="absolute right-0 top-full mt-1.5 w-56 bg-white text-zinc-800 rounded-xl shadow-xl border border-gray-100 p-2 z-50 overflow-hidden"
                      >
                        <div className="p-2 rounded-lg bg-zinc-50 border border-zinc-100 mb-1.5">
                          <div className="font-bold text-zinc-900 text-xs truncate">
                            {user.name}
                          </div>
                          <div className="text-[11px] text-zinc-500 truncate">
                            {user.email}
                          </div>
                        </div>

                        <div className="flex flex-col gap-0.5 text-xs font-medium">
                          <Link
                            href="/dashboard/manage-courses"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LayoutDashboard size={14} />
                            <span>ড্যাশবোর্ড</span>
                          </Link>

                          <Link
                            href="/dashboard/certificate-stutus"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-zinc-700 hover:text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <GraduationCap size={14} />
                            <span>সার্টিফিকেট স্ট্যাটাস</span>
                          </Link>
                        </div>

                        <div className="border-t border-gray-100 my-1 pt-1">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-red-600 hover:bg-red-50 font-semibold transition-colors text-xs"
                          >
                            <LogOut size={14} />
                            <span>লগআউট করুন</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-white hover:bg-red-50 text-red-600 hover:text-red-700 font-bold px-3.5 py-1.5 rounded-lg shadow-sm hover:shadow transition-all duration-200 flex items-center gap-1.5 text-xs group"
              >
                <LogIn
                  size={14}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
                <span>সাইন ইন করুন</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="lg:hidden flex items-center gap-2">
            {user && (
              <div className="p-1 rounded bg-white/10 text-white">
                <Notifications iconClassName="w-4 h-4 text-white" />
              </div>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent layout shift when main navbar is fixed */}
      {isScrolled && (
        <div className="h-[49px] md:h-[53px] w-full pointer-events-none" aria-hidden="true" />
      )}

      {/* ============================================================== */}
      {/* MOBILE SLIDE-OVER DRAWER MENU (FULL VIEWPORT)                  */}
      {/* ============================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="lg:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />

            {/* Drawer Sheet */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 250 }}
              className="fixed top-0 right-0 bottom-0 w-[80%] max-w-sm bg-gradient-to-b from-zinc-950 via-zinc-900 to-red-950 text-white shadow-2xl z-[100] flex flex-col overflow-y-auto border-l border-white/10"
            >
              {/* Drawer Header */}
              <div className="p-3.5 border-b border-white/10 flex items-center justify-between">
                <img
                  src="https://res.cloudinary.com/dalpf8iip/image/upload/v1755492733/Cadd_core_logo_white_png_v3fdci.png"
                  alt="CADD CORE Logo"
                  className="h-7 w-auto object-contain"
                />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Direct Call Button */}
              <div className="p-3 border-b border-white/10">
                <a
                  href="tel:+8801611223631"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white py-2 rounded-xl font-bold text-xs shadow-md"
                >
                  <PhoneCall size={14} />
                  <span>হটলাইন: +880 1611-223631</span>
                </a>
              </div>

              {/* Navigation Links */}
              <div className="flex-1 p-3 space-y-1 text-sm font-medium">
                {/* Home */}
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    isActive("/")
                      ? "bg-red-600 text-white font-bold"
                      : "text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  হোম
                </Link>

                {/* Courses with LIVE badge */}
                <Link
                  href="/courses"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
                    isActive("/courses")
                      ? "bg-red-600 text-white font-bold"
                      : "text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  <span>কোর্স সমূহ</span>
                  <span className="text-[9.5px] font-extrabold px-1.5 py-0.5 rounded-full bg-amber-400 text-zinc-950 uppercase">
                    LIVE
                  </span>
                </Link>

                {/* One to One Training */}
                <Link
                  href="/one-to-one-training"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    isActive("/one-to-one-training")
                      ? "bg-red-600 text-white font-bold"
                      : "text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  ওয়ান টু ওয়ান ট্রেনিং
                </Link>

                {/* Industrial Attachment */}
                <Link
                  href="/industrial-attachment-training"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    isActive("/industrial-attachment-training")
                      ? "bg-red-600 text-white font-bold"
                      : "text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  ইন্ডাস্ট্রিয়াল এটাচমেন্ট
                </Link>

                {/* Student Corner */}
                <Link
                  href="/student-corner"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg transition-colors ${
                    isActive("/student-corner")
                      ? "bg-red-600 text-white font-bold"
                      : "text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  স্টুডেন্ট কর্নার
                </Link>

                {/* About Us Accordion */}
                <div className="rounded-lg overflow-hidden bg-white/5 border border-white/10">
                  <button
                    onClick={() => setMobileAboutOpen(!mobileAboutOpen)}
                    className="w-full flex items-center justify-between px-3 py-2 text-left font-medium text-zinc-200 hover:text-white"
                  >
                    <span>আমাদের সম্পর্কে</span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform duration-200 text-zinc-400 ${
                        mobileAboutOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {mobileAboutOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="bg-black/40 px-2 py-1 space-y-0.5 border-t border-white/5 text-xs"
                      >
                        {aboutLinks.map((item) => (
                          <Link
                            key={item.title}
                            href={item.path}
                            onClick={() => setMobileMenuOpen(false)}
                            className="block py-1.5 px-2 rounded text-zinc-300 hover:text-white hover:bg-white/10"
                          >
                            {item.title}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Mobile Auth / Footer */}
              <div className="p-3 border-t border-white/10 bg-black/40">
                {user ? (
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5 p-2 bg-white/5 rounded-lg border border-white/10">
                      {user.profilePhoto ? (
                        <img
                          src={user.profilePhoto}
                          alt={user.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-red-600 text-white font-bold flex items-center justify-center text-xs">
                          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs text-white truncate">
                          {user.name}
                        </div>
                        <div className="text-[10px] text-zinc-400 truncate">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <Link
                      href="/dashboard/manage-courses"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-bold text-xs transition-colors"
                    >
                      <LayoutDashboard size={14} />
                      <span>ড্যাশবোর্ড</span>
                    </Link>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-center gap-2 bg-white/10 hover:bg-red-600 text-zinc-200 hover:text-white py-1.5 rounded-lg font-semibold text-xs transition-colors"
                    >
                      <LogOut size={14} />
                      <span>লগআউট করুন</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <Link
                      href="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center justify-center gap-2 bg-white text-red-600 py-2 rounded-lg font-bold text-xs shadow-md"
                    >
                      <LogIn size={14} />
                      <span>সাইন ইন করুন</span>
                    </Link>

                    <a
                      href="https://forms.gle/XnZP35yKbjXGCtGz7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-1.5 bg-red-600/30 border border-red-500/30 text-white py-1.5 rounded-lg font-medium text-[11px] text-center"
                    >
                      <span>ফ্রি লাইভ সেমিনার</span>
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </header>
  );
}
