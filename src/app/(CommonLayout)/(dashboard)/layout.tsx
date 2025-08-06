"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navigationSections = [
  {
    title: "� Users Management",
    icon: "👥",
    links: [
      {
        label: "Create New User",
        href: "/dashboard/register",
        icon: "👤",
        color: "",
      },
      {
        label: "Manage All Users",
        href: "/dashboard/manage-all-users",
        icon: "👥",
        color: "",
      },
     
    ],
  },
  {
    title: "� Payment Management",
    icon: "💳",
    links: [
      {
        label: "Payment History",
        href: "/dashboard/payments/success-payments",
        icon: "📊",
        color: "",
      },
       {
        label: "Payment Management",
        href: "/dashboard/payments/payment-management",
        icon: "💰",
        color: "",
      },
       {
        label: "Installment Plan",
        href: "/dashboard/payments/installment-plan",
        icon: "💰",
        color: "",
      },
      {
        label: "Manage Coupon",
        href: "/dashboard/payments/manage-coupon",
        icon: "🎫",
        color: "",
      },
     
    ],
  },
  {
    title: "📚 Course Management",
    icon: "📚",
    links: [
      {
        label: "Manage Courses",
        href: "/dashboard/manage-courses",
        icon: "📋",
        color: "",
      },
      {
        label: "Manage Schedule",
        href: "/dashboard/course-schedule-mange",
        icon: "📅",
        color: "",
      },
      {
        label: "Create New Course",
        href: "/dashboard/create-course",
        icon: "➕",
        color: "",
      },
      {
        label: "Add Seminar Time",
        href: "/dashboard/add-seminar-time",
        icon: "🕒",
        color: "",
      },
     
     
    ], 
  },
  {
    title: "🏭 Industrial Management",
    icon: "🏭",
    links: [
      {
        label: "Create Industrial Course",
        href: "/dashboard/industrial-training/create-industrial-courses",
        icon: "🏭",
        color: "",
      },
      {
        label: "Manage Industrial Courses",
        href: "/dashboard/industrial-training/manage-industrial-courses",
        icon: "📋",
        color: "",
      },
      {
        label: "Add Industrial Banner",
        href: "/dashboard/industrial-training/add-industrial-banner",
        icon: "🖼️",
        color: "",
      },
      {
        label: "Add Offer/Seminar Banner",
        href: "/dashboard/industrial-training/add-industrial-offer-Banner",
        icon: "🎯",
        color: "",
      },
     
     
    ],
  },
  {
    title: "💼 Job Application Management",
    icon: "💼",
    links: [
      {
        label: "Create New Job",
        href: "/dashboard/jobs/create-job",
        icon: "📝",
        color: "",
      },
      {
        label: "Manage All Jobs",
        href: "/dashboard/jobs/manage-jobs",
        icon: "✅",
        color: "",
      },
      {
        label: "Job Applications",
        href: "/dashboard/jobs/all-aplications",
        icon: "📂",
        color: "",
      },
      {
        label: "Instructor Applications",
        href: "/dashboard/jobs/instructor-aplications",
        icon: "🧑‍💼",
        color: "",
      },
      
    ],
  },
  {
    title: "🎓 Certificate Management",
    icon: "🎓",
    links: [
      {
        label: "Create Certificate",
        href: "/dashboard/create-certificate",
        icon: "📝",
        color: "",
      },
      {
        label: "Manage Certificates",
        href: "/dashboard/manage-certificates",
        icon: "📂",
        color: "",
      },
      {
        label: "Approved Certificates",
        href: "/dashboard/certificate-stutus",
        icon: "✅",
        color: "",
      },
    ],
  },
  {
    title: "� Student Feedback",
    icon: "💬",
    links: [
      {
        label: "Add Student Feedback",
        href: "/dashboard/add-feedback-and-reviews",
        icon: "➕",
        color: "",
      },
      {
        label: "Manage Feedback",
        href: "/dashboard/student-feedback",
        icon: "📋",
        color: "",
      },
    ],
  },
  {
    title: "👥 Team & Partners",
    icon: "🤝",
    links: [
      {
        label: "Manage Team Members",
        href: "/dashboard/manage-team-members",
        icon: "🧑‍💼",
        color: "",
      },
      {
        label: "Create Our Clients and Partners",
        href: "/dashboard/create-client-and-partners",
        icon: "🤝",
        color: "",
      },
      {
        label: "Manage Our Partners",
        href: "/dashboard/manage-clients-partners",
        icon: "🔧",
        color: "",
      },
     
    ],
  },
  {
    title: "📆 Events & Engagements",
    icon: "📆",
    links: [
      {
        label: "Manage Events and Engagements",
        href: "/dashboard/manage-events-engagements",
        icon: "🗓️",
        color: "",
      },
    ],
  },
];


export default function AdminLayout({ children }: {children: React.ReactNode}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarExpanded(false);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);

    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setSidebarExpanded(!sidebarExpanded);
    }
  };

  const closeSidebar = () => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Mobile Header with Hamburger - Only show when main navbar is not visible */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-gray-950 border-b-2 border-red-500 p-4">
          <div className="flex items-center justify-between">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:from-red-500 hover:to-red-600 transition-all duration-300"
              onClick={toggleSidebar}
            >
              <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                <motion.span
                  animate={sidebarOpen ? { rotate: 45, y: 6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block h-0.5 w-6 bg-white rounded-full"
                />
                <motion.span
                  animate={sidebarOpen ? { opacity: 0 } : { opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="block h-0.5 w-6 bg-white rounded-full mt-1.5"
                />
                <motion.span
                  animate={sidebarOpen ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="block h-0.5 w-6 bg-white rounded-full mt-1.5"
                />
              </div>
            </motion.button>
            
            <h1 className="font-bold text-lg text-white">Dashboard Menu</h1>
            
            <div className="w-12"></div> {/* Spacer for balance */}
          </div>
        </div>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && isMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={closeSidebar}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {(sidebarOpen || !isMobile) && (
          <motion.aside
            initial={isMobile ? { x: -300 } : false}
            animate={{ 
              x: 0,
              width: isMobile ? 300 : (sidebarExpanded ? 280 : 80)
            }}
            exit={isMobile ? { x: -300 } : {}}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={`
              bg-gray-950 
              ${isMobile ? 'fixed h-full top-20 left-0' : 'relative min-h-screen'} 
              border-r-2 border-red-500 z-35
              shadow-2xl overflow-y-auto
            `}
          >
            {/* Desktop Hamburger Toggle Button */}
            {!isMobile && (
              <div className="p-4 border-b border-red-500/20">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative p-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 w-full flex items-center justify-center"
                  onClick={toggleSidebar}
                >
                  <div className="relative w-6 h-6 flex flex-col justify-center items-center">
                    <motion.span
                      animate={{ rotate: 0, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="block h-0.5 w-6 bg-white rounded-full"
                    />
                    <motion.span
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="block h-0.5 w-6 bg-white rounded-full mt-1.5"
                    />
                    <motion.span
                      animate={{ rotate: 0, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="block h-0.5 w-6 bg-white rounded-full mt-1.5"
                    />
                  </div>
                  
                  {/* Tooltip for desktop */}
                  <div className="absolute left-full ml-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                    <div className="bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap border border-red-500">
                      {sidebarExpanded ? 'Collapse Menu' : 'Expand Menu'}
                    </div>
                    <div className="w-2 h-2 bg-gray-900 border-l border-b border-red-500 transform rotate-45 -ml-1 -mt-1"></div>
                  </div>
                </motion.button>
                
                {/* Dashboard Title - only show when expanded */}
                <AnimatePresence>
                  {sidebarExpanded && (
                    <motion.h1 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="font-bold text-xl text-white mt-4 text-center"
                    >
                      Admin Dashboard
                    </motion.h1>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Navigation Menu */}
            <div className={`py-4 space-y-2 ${isMobile ? 'pt-6' : ''}`}>
              {navigationSections.map((section, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                  className="mb-6"
                >
                  {/* Section Header - show when expanded OR on mobile */}
                  <AnimatePresence>
                    {(sidebarExpanded || isMobile) && (
                      <motion.h2 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="rounded-lg font-bold mb-3 p-3 bg-gradient-to-r from-red-600 to-red-700 text-center shadow-lg border border-red-500 text-white mx-2"
                      >
                        {section.title}
                      </motion.h2>
                    )}
                  </AnimatePresence>
                  
                  {/* Section Icon - only show when collapsed */}
                  <AnimatePresence>
                    {!sidebarExpanded && !isMobile && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="group relative flex justify-center mb-3"
                      >
                        <div className="text-3xl p-3 rounded-lg bg-red-600 hover:bg-red-500 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl transform hover:scale-110">
                          {section.icon}
                        </div>
                        
                        {/* Enhanced Section Tooltip */}
                        <div className="absolute left-full ml-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 group-hover:translate-x-2">
                          <div className="bg-gray-900 text-white text-sm px-4 py-3 rounded-lg whitespace-nowrap border-2 border-red-500 shadow-xl">
                            <div className="font-semibold">{section.title}</div>
                            <div className="text-xs text-gray-300 mt-1">{section.links.length} items</div>
                          </div>
                          {/* Enhanced Arrow */}
                          <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2">
                            <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-r-[8px] border-t-transparent border-b-transparent border-r-red-500"></div>
                            <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-gray-900 absolute left-0.5 top-1/2 transform -translate-y-1/2"></div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation Links */}
                  <ul className={`space-y-2 ${!sidebarExpanded && !isMobile ? 'px-0' : 'px-2'}`}>
                    {section.links.map((link, linkIdx) => (
                      <motion.div 
                        key={linkIdx}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: (idx * 0.1) + (linkIdx * 0.05) }}
                        className="group relative overflow-hidden rounded-xl transition-all duration-300"
                      >
                        <li className={`
                          relative overflow-hidden border-2 border-gray-700 text-gray-200 font-semibold 
                          hover:border-red-500 transition-all duration-300 rounded-xl 
                          bg-gray-800 hover:bg-red-600 transform hover:scale-105
                          ${!sidebarExpanded && !isMobile ? 'p-3 flex justify-center' : 'p-3'}
                        `}>
                          {/* Animated background effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                          
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-10 transform -skew-x-12 group-hover:translate-x-full transition-all duration-700"></div>
                          
                          <Link 
                            href={link.href} 
                            className="relative z-10 block group-hover:text-white transition-colors duration-300 w-full"
                            onClick={isMobile ? closeSidebar : undefined}
                          >
                            {!sidebarExpanded && !isMobile ? (
                              /* Collapsed view - icon only */
                              <div className="flex justify-center">
                                <span className="text-2xl transform group-hover:scale-110 transition-transform duration-300">{link.icon}</span>
                              </div>
                            ) : (
                              /* Expanded view - icon + text */
                              <div className="flex items-center space-x-3">
                                <span className="text-lg">{link.icon}</span>
                                <span>{link.label}</span>
                              </div>
                            )}
                          </Link>
                          
                          {/* Enhanced Tooltip for collapsed items */}
                          {!sidebarExpanded && !isMobile && (
                            <div className="absolute left-full ml-6 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-50 group-hover:translate-x-2">
                              <div className="bg-gray-900 text-white text-sm px-4 py-3 rounded-lg whitespace-nowrap border-2 border-red-500 shadow-xl min-w-max">
                                <div className="font-semibold text-red-300">{link.icon}</div>
                                <div className="font-medium">{link.label}</div>
                                <div className="text-xs text-gray-400 mt-1">Click to navigate</div>
                              </div>
                              {/* Enhanced Arrow */}
                              <div className="absolute left-0 top-1/2 transform -translate-x-2 -translate-y-1/2">
                                <div className="w-0 h-0 border-t-[8px] border-b-[8px] border-r-[8px] border-t-transparent border-b-transparent border-r-red-500"></div>
                                <div className="w-0 h-0 border-t-[6px] border-b-[6px] border-r-[6px] border-t-transparent border-b-transparent border-r-gray-900 absolute left-0.5 top-1/2 transform -translate-y-1/2"></div>
                              </div>
                            </div>
                          )}
                          
                          {/* Border glow effect */}
                          <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-red-400 group-hover:shadow-red-400/50 group-hover:shadow-lg transition-all duration-300"></div>
                        </li> 
                      </motion.div>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main 
        className={`
          flex-1 transition-all duration-300 overflow-auto bg-white
          ${isMobile ? 'pt-20' : ''}
        `}
        onClick={isMobile ? closeSidebar : undefined}
      >
        <div className="p-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-full"
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
}