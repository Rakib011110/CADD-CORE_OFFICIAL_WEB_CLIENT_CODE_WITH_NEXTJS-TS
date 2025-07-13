"use client";

import Countdown from "@/components/UI/Countdown/Countdown";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";
import { TSeminar } from "@/lib/types/TSeminars";
import { useGetAllSeminarQuery } from "@/redux/api/seminarApi";
import { motion } from "framer-motion";
import { ArrowRightIcon, CalendarDaysIcon, CalendarIcon, ClockIcon, MapPinIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

// Format ISO date (YYYY-MM-DD) to DD-MM-YYYY
const formatDate = (isoDate: string) => {
  if (!isoDate) return "";
  const [year, month, day] = isoDate.split("-");
  return `${day}-${month}-${year}`;
};


const formatTime = (timeStr: string) => {
  if (!timeStr) return "";
  const timeParts = timeStr.split(":");
  // Get the hour and minute safely (handle missing values)
  const hour = parseInt(timeParts[0] || "0", 10);
  const minute = timeParts[1] ? parseInt(timeParts[1], 10) : 0;
  const ampm = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12; // Convert 0 to 12 in 12-hour format
  return `${hour12}:${minute.toString().padStart(2, "0")} ${ampm}`;
};

// Calculate the number of days remaining from today's date to the seminar date
const getRemainingTime = (isoDate: string) => {
  if (!isoDate) return "";

  const seminarDate = new Date(isoDate);
  const now = new Date();

  const diffMs = seminarDate.getTime() - now.getTime();

  if (diffMs <= 0) return "0"; // Seminar started or passed

  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 1) {
    return `${diffDays} days`;
  } else if (diffHours > 0) {
    return `${diffHours} hours`;
  } else if (diffMinutes > 0) {
    return `${diffMinutes} minutes`;
  } else {
    return "0";
  }
};

export default function SeminarSchedule() {
  const { data: seminars, isLoading } = useGetAllSeminarQuery({});
// Date formatting helpers
const formatDay = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('bn-BD', { day: 'numeric' });
};

const formatMonthYear = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('bn-BD', { 
    month: 'long', 
    year: 'numeric' 
  });
};
  return (
 <motion.section 
  id="seminar-time"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.6 }}
  className="py-16 bg-gradient-to-b from-white to-red-50"
>
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-14">
      <motion.h2 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
      >
        ফ্রি/পেইড সেমিনারের <span className="text-red-600">সময়সূচী</span>
      </motion.h2>
      <div className="w-24 h-1 bg-gradient-to-r from-red-400 to-red-600 mx-auto rounded-full"></div>
    </div>

    {isLoading ? (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner  />
      </div>
    ) : (
      <div className="grid gap-6">
        {seminars?.data?.map((seminar: TSeminar, index: number) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 items-center">
              {/* Date Badge */}
              <div className="md:col-span-2">
                <div className="bg-gray-50 p-3 rounded-lg text-center border border-red-100">
                  <div className="text-red-600 font-bold text-lg">
                    {formatDay(seminar.date)}   {formatMonthYear(seminar.date)}
                  </div>
                  <div className="text-gray-700 text-sm">
                    {/* {formatMonthYear(seminar.date)} */}
                  </div>
                  <div className="flex items-center justify-center mt-1 text-red-500">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    <span className="text-sm">{formatTime(seminar.time)}</span>
                  </div>
                </div>
              </div>
              
              {/* Seminar Details */}
              <div className="md:col-span-5">
                <div className="flex items-start space-x-3">
                  <div className="bg-red-100 p-2 rounded-lg mt-1">
                    <CalendarIcon className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{seminar.topic}</h3>
                    <div className="flex items-center text-gray-600">
                      <MapPinIcon className="w-4 h-4 mr-1.5 text-red-400" />
                      <span>{seminar.place}</span>
                    </div>
                    {seminar.type && (
                      <span className={`inline-block mt-2 px-2 py-1 text-xs rounded-full 
                        ${seminar.type === 'ফ্রি' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {seminar.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Countdown */}
              <div className="md:col-span-3">
                <div className="bg-gray-50 p-3 rounded-lg border  border-gray-200">
                  <div className="text-xs font-medium text-gray-500 mb-1">শুরু হতে বাকি</div>
                  <Countdown 
                    date={seminar.date} 
                    time={seminar.time}
                  />
                </div>
              </div>
              
              {/* Join Button */}
              <div className="md:col-span-2 flex justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="bg-[#F01A24] hover:bg-gray-900 text-white py-2.5 px-5 rounded-lg font-medium 
                    flex items-center space-x-2 transition-colors duration-200 shadow-sm"
                >
                  <Link href="https://docs.google.com/forms/d/e/1FAIpQLScZysZu-d44Md-KbsIPXOX-wuoobxWbcBaXN04ITkgWYNR6Fw/viewform">যোগ দিন</Link>
                  <ArrowRightIcon className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
</motion.section>


  );
}
