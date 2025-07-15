"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const navigationSections = [
  {
    title: "📚 Users Management",
    links: [
      {
        label: "📋 Create New User",
        href: "/dashboard/register",
        color: "",
      },
      {
        label: "➕ Manage All Users",
        href: "/dashboard/manage-all-users",
        color: "",
      },
     
    ],
  },
  {
    title: "📚 Payment Management",
    links: [
       {
        label: "💳 Payment Management",
        href: "/dashboard/payments/payment-management",
        color: "",
      },
      {
        label: "📊 Payment History",
        href: "/dashboard/payments/payment-history",
        color: "",
      },
      {
        label: "📇 Manage Coupon",
        href: "/dashboard/payments/manage-coupon",
        color: "",
      },
     
    ],
  },
  {
    title: "📚 Course Management",
    links: [
      {
        label: "📋 Manage Courses",
        href: "/dashboard/manage-courses",
        color: "",
      },
      {
        label: "📋 Manage Schedule",
        href: "/dashboard/course-schedule-mange",
        color: "",
      },
      {
        label: "➕ Create New Course",
        href: "/dashboard/create-course",
        color: "",
      },
      {
        label: "🕒 Add Seminar Time",
        href: "/dashboard/add-seminar-time",
        color: "",
      },
      {
        label: "💰 Installment Plan",
        href: "/dashboard/payments/installment-plan",
        color: "",
      },
     
    ], 
  },
  {
    title: "📚 Industrial Management",
    links: [
      {
        label: "➕ Create Industrial Course",
        href: "/dashboard/industrial-training/create-industrial-courses",
        color: "",
      },
      {
        label: "📋 Manage Industrial Courses",
        href: "/dashboard/industrial-training/manage-industrial-courses",
        color: "",
      },
      {
        label: "📇 Add Industrial Bannar",
        href: "/dashboard/industrial-training/add-industrial-banner",
        color: "",
      },
      {
        label: "📇 Add Offer/Seminar Bannar",
        href: "/dashboard/industrial-training/add-industrial-offer-Banner",
        color: "",
      },
     
     
    ],
  },
  {
    title: "🎓 Job Application Management",
    links: [
      {
        label: "📝 Create New Job",
        href: "/dashboard/jobs/create-job",
        color: "",
      },
      {
        label: "✅ Manage All Jobs",
        href: "/dashboard/jobs/manage-jobs",
        color: "",
      },
      {
        label: "📂Job Aplications",
        href: "/dashboard/jobs/all-aplications",
        color: "",
      },
      {
        label: "🧑‍💼 Instructor Aplications",
        href: "/dashboard/jobs/instructor-aplications",
        color: "",
      },
      
    ],
  },
  {
    title: "🎓 Certificate Management",
    links: [
      {
        label: "📝 Create Certificate",
        href: "/dashboard/create-certificate",
        color: "",
      },
      {
        label: "📂 Manage Certificates",
        href: "/dashboard/manage-certificates",
        color: "",
      },
      {
        label: "✅ Approved Certificates",
        href: "/dashboard/certificate-stutus",
        color: "",
      },
    ],
  },
  {
    title: "🗣️ Student Feedback",
    links: [
      {
        label: "➕Add Student Feedback",
        href: "/dashboard/add-feedback-and-reviews",
        color: "",
      },
      {
        label: "📋Manage Feedback",
        href: "/dashboard/student-feedback",
        color: "",
      },
    ],
  },
  {
    title: "👥 Team & Partners",
    links: [
      {
        label: "🧑‍💼 Manage Team Members",
        href: "/dashboard/manage-team-members",
        color: "",
      },
      {
        label: "🤝 Create Our Clients and Partners",
        href: "/dashboard/create-client-and-partners",
        color: "",
      },
      {
        label: "🔧 Manage Our  Partners",
        href: "/dashboard/manage-clients-partners",
        color: "",
      },
     
    ],
  },
  {
    title: "📆 Events & Engagements",
    links: [
      {
        label: "🗓️ Manage Events and Engagements",
        href: "/dashboard/manage-events-engagements",
        color: "",
      },
    ],
  },
];


export default function AdminLayout({ children }: {children: React.ReactNode}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col  bg-[#f2effffb]">
      <div className="md:hidden p-4 flex justify-between items-center bg-white shadow">
        <div className="font-bold">Dashboard</div>
        <button
          className="p-2 border rounded text-gray-600"
          onClick={() => setSidebarOpen(!sidebarOpen)}>
          {/* Hamburger Icon */}
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 ">
        {/* Sidebar */}
        <aside
          className={`
            bg-gray-900 w-64 p-6 border-r transform top-0 left-0 
            md:relative md:translate-x-0 md:shadow-none shadow-md
            transition-transform duration-200 ease-in-out
            ${
              sidebarOpen
                ? "translate-x-0 absolute z-10"
                : "-translate-x-full absolute"
            }
          `}>
          <div className="space-y-6 text-white ">
            {navigationSections.map((section, idx) => (
              <div key={idx}>
                <h2 className="rounded-md font-bold mb-2   border-2 border-b-0 border-red-500 text-center">{section.title}</h2>
                <ul className="space-y-1 text-white p-1">
                  {section.links.map((link, linkIdx) => (
                   
  <motion.div 
  key={linkIdx}
  initial={{ x: -100, opacity: 10 }}
  whileInView={{ x: 0, opacity: 2 }}
  transition={{ duration: 0.2 }}
  className="group relative overflow-hidden  rounded-xl  shadow-md hover:shadow-xl transition duration-300     "
>
<li className="border-white  p-2  text-gray-200 border-red border-2   font-semibold  hover:border-2  group-hover:border-red-500 transition-all duration-500" >
                      <Link href={link.href} className={link.color}>
                        {link.label}
                      </Link>
                    </li> 
</motion.div>


                  ))}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}

        <main className="flex-1 p-4 max-w-6xl mx-auto" onClick={() => setSidebarOpen(false)}>
          {children}
        </main>
      </div>
    </div>
  );
}