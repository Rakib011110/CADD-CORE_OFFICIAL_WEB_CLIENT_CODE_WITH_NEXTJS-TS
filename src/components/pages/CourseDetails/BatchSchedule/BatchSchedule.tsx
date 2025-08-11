"use client"

import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { Calendar, MapPin, Clock, Users, ArrowRight, Hourglass } from "lucide-react";

// You can replace this with your actual TCourse type definition
export type TCourse = {
  schedule: {
    startingDate: string;
    days: string;
    time: string;
    mode: string;
  };
};

// Mock data for demonstration purposes.
// You can remove this and pass the `course` prop from your application.


// TimeDisplay Component for the Countdown
const TimeDisplay = ({ value, type, isLast = false }: { value: number; type: string; isLast?: boolean }) => (
    <div className="flex items-center">
        <div className="flex flex-col items-center w-20">
            <span className="text-4xl lg:text-5xl font-bold text-slate-800 tracking-tight">{String(value).padStart(2, '0')}</span>
            <span className="text-xs text-slate-500 uppercase mt-1">{type}</span>
        </div>
        {!isLast && <span className="text-4xl lg:text-5xl text-slate-300 mx-2">:</span>}
    </div>
);

// DetailItem Component for schedule details
const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
    <div className="flex items-start text-left">
        <div className="flex-shrink-0 mt-1">
            {icon}
        </div>
        <div className="ml-4">
            <p className="font-semibold text-slate-700">{label}</p>
            <p className="text-slate-500">{value}</p>
        </div>
    </div>
);


export default function BatchSchedule({ course  }: { course?: TCourse }) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [isClient, setIsClient] = useState(false);

    // This effect runs once on mount to confirm we are on the client side.
    useEffect(() => {
        setIsClient(true);
    }, []);

    // This effect sets up the countdown timer.
    useEffect(() => {
        if (!isClient || !course?.schedule?.startingDate) return;

        const timer = setInterval(() => {
            const targetDate = new Date(course.schedule.startingDate).getTime();
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference > 0) {
                setTimeLeft({
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                });
            } else {
                // If the date has passed, clear the interval and set time to 0.
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                clearInterval(timer);
            }
        }, 1000);

        // Cleanup interval on component unmount.
        return () => clearInterval(timer);
    }, [isClient, course?.schedule?.startingDate]);
    
    // Format the start date for display.
    const formattedStartDate = course?.schedule?.startingDate 
        ? new Date(course.schedule.startingDate).toLocaleDateString('en-US', {
            year: 'numeric', month: 'long', day: 'numeric'
          })
        : 'Not announced';

    return (
        <section id="batch-schedule" className=" py-8 sm:py-10">
            <div className="max-w-7xl mx-auto ">
                {/* Section Header */}
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
                        পরবর্তী ব্যাচের সময়সূচী
                    </h2>
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600">
                        সীমিত আসনে আমাদের পরবর্তী ব্যাচ শুরু হতে যাচ্ছে। আজই আপনার আসনটি নিশ্চিত করুন।
                    </p>
                    <div className="mt-5 flex justify-center">
                        <span className="inline-block w-24 h-1 bg-red-500 rounded-full"></span>
                    </div>
                </div>

                {/* New Unified Schedule Card */}
                <div className="mt-12 max-w-6xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden ring-1 ring-slate-200/50">
                        <div className="p-8 sm:p-10 flex flex-col items-center text-center">
                            
                            {/* Countdown Timer Section */}
                            <div className="flex items-center text-red-600 mb-2">
                                <Hourglass size={20} />
                                <h3 className="ml-2 text-base font-semibold uppercase tracking-wider">Batch Starts In</h3>
                            </div>
                            
                            {isClient ? (
                                <div className="flex flex-wrap justify-center items-center">
                                    <TimeDisplay value={timeLeft.days} type="Days" />
                                    <TimeDisplay value={timeLeft.hours} type="Hours" />
                                    <TimeDisplay value={timeLeft.minutes} type="Mins" />
                                    <TimeDisplay value={timeLeft.seconds} type="Secs" isLast={true} />
                                </div>
                            ) : (
                                <div className="h-20 flex items-center justify-center">
                                    <p className="text-slate-500">Loading countdown...</p>
                                </div>
                            )}

                            {/* Divider */}
                            <div className="w-full my-8">
                                <div className="h-px bg-slate-200 w-1/2 mx-auto"></div>
                            </div>
                            
                            {/* Schedule Details Section */}
                          <div className="w-full grid grid-cols-1 sm:grid-cols-4 gap-4 items-center justify-center">
  {[
    {
      icon: <Calendar className="w-5 h-5 text-red-500" />,
      label: "Starting Date",
      value: formattedStartDate
    },
    {
      icon: <Users className="w-5 h-5 text-red-500" />,
      label: "Class Days",
      value: course?.schedule?.days || 'TBD'
    },
    {
      icon: <Clock className="w-5 h-5 text-red-500" />,
      label: "Class Time",
      value: course?.schedule?.time || 'TBD'
    },
    {
      icon: <MapPin className="w-5 h-5 text-red-500" />,
      label: "Platform",
      value: course?.schedule?.mode || 'TBD'
    }
  ].map((item, index) => (
    <div 
      key={index}
      className="p-4 border border-gray-100 rounded-lg bg-red-50 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-center  justify-center">
        
        <div>
          <p className="text-sm font-medium text-red-500"> <span></span> {item.label}</p>
          <p className="mt-1 text-base font-semibold text-gray-800  ">
            {item.value}
          </p>
        </div>
      </div>
    </div>
  ))}
</div>

                            {/* Call to Action Button */}
                            {/* <div className="mt-10 w-full max-w-sm">
                                <Link
                                    href={"https://docs.google.com/forms/d/e/1FAIpQLScZysZu-d44Md-KbsIPXOX-wuoobxWbcBaXN04ITkgWYNR6Fw/viewform"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center px-8 py-3 bg-red-600 text-white font-bold rounded-lg shadow-lg hover:bg-red-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                >
                                    <span>Confirm Your Seat</span>
                                    <ArrowRight size={20} className="ml-2" />
                                </Link>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
