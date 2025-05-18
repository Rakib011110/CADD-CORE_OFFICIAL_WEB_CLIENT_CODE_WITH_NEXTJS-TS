"use client";

import { useState } from "react";
import { Button } from "@/components/UI/button";
import { Card, CardContent } from "@/components/UI/card";
import Link from "next/link";
import { useGetAllJobsQuery } from "@/redux/api/jobsApi/jobAPi";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";

const categories = [
  "Engineering",
  "Graphic & Creative",
  "Web & IT",
  "Marketing",
  "Finance",
  "General Service",
  "Administration",
];

export default function JobBoard() {
  const [activeTab, setActiveTab] = useState<string>("View All");
  const { data: allJob, isLoading, isError } = useGetAllJobsQuery({});

  if (isLoading) {
    return <div className=""> 
    <LoadingSpinner/>
    </div>;
  }

  if (isError || !allJob?.data) {
    return <div className="text-center py-16 text-red-500 font-semibold">Failed to load jobs</div>;
  }

  const jobs = allJob.data;

  const filteredJobs =
    activeTab === "View All"
      ? jobs
      : jobs.filter((job: any) => job.category === activeTab);

  return (
    <section className="max-w-6xl mx-auto px-4 py-14">
      <motion.div 
        className="text-center mb-12"
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="inline-block px-4 py-1 rounded-full bg-blue-50 text-red-500 font-semibold mb-3 tracking-wide">
          CADD CORE is hiring!
        </p>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Join Our <span className="text-red-500">Creative Team</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto text-base md:text-lg">
          We value innovation, dedication, and design excellence. Be a part of a thriving culture and elevate your career.
        </p>
      </motion.div>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        <Button
          variant={activeTab === "View All" ? "default" : "outline"}
          onClick={() => setActiveTab("View All")}
        >
          View All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat}
            variant={activeTab === cat ? "default" : "outline"}
            onClick={() => setActiveTab(cat)}
          >
            {cat}
          </Button>
        ))}
      </div>

      <motion.div
  className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
  initial="hidden"
  animate="visible"
  variants={{
    visible: { transition: { staggerChildren: 0.1 } },
  }}
>
  {filteredJobs.map((job: any, index: number) => (
    <motion.div
      key={index}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
      }}
    >
      <div className="group relative overflow-hidden rounded-xl border border-blue-50 bg-white backdrop-blur-md shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-red-100">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-blue-500 to-red-500 animate-pulse"></div>

        <div className="p-6 relative z-10">
          <h2 className="text-xl font-bold mb-1 text-red-500 group-hover:text-blue-600 transition-colors">
            {job.title}
          </h2>

          <p className="text-sm mb-1 text-gray-700">
            🪙 {job.duration ? `Paid Internship (${job.duration}) ৳` : job.salary || "Negotiable"}
          </p>
          <p className="text-sm mb-1 text-gray-700">⏱ {job.type}</p>
          <p className="text-sm text-gray-700">📅 {job.date}</p>

          <div className="mt-4">
            <Link
              href={`/job/${job.slug}`}
              className="inline-block text-sm font-semibold text-blue-600 underline hover:text-red-500 transition"
            >
              See details →
            </Link>
          </div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-tr from-red-500 to-blue-50 opacity-10 group-hover:opacity-40 transition-opacity"></div>
        <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-red-500 opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity duration-300"></div>
      </div>
    </motion.div>
  ))}
</motion.div>

    </section>
  );
}
