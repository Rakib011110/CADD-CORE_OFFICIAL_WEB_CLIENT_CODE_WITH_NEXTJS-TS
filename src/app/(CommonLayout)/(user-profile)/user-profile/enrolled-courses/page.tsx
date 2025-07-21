"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiBookOpen, 
  FiPlay, 
  FiClock, 
  FiUsers, 
  FiCalendar, 
  FiDownload,
  FiStar,
  FiFileText,
  FiExternalLink,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiBarChart,
  FiAlertCircle,
  FiCheckCircle,
  FiVideo
} from "react-icons/fi";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { Progress } from "@/components/UI/progress";
import { useGetMeQuery } from "@/redux/api/userApi";
import { useGetMyPaymentsQuery } from "@/redux/api/payment/paymentApi";
import Image from "next/image";
import Link from "next/link";

// --- TYPE DEFINITIONS ---
type Course = {
  _id: string;
  title: string;
  slug: string;
  photoUrl: string;
  duration: string;
};

type Payment = {
  _id: string;
  amount: number;
  status: "pending" | "completed" | "failed";
  createdAt: string;
  course: Course;
  transactionId: string;
};

type EnrolledCourseDetailed = {
  id: string;
  title: string;
  instructor: string;
  duration: string;
  progress: number;
  status: "not-started" | "in-progress" | "completed";
  enrolledDate: string;
  completionDate?: string;
  thumbnailUrl: string;
  rating?: number;
  totalLessons: number;
  completedLessons: number;
  certificateEligible: boolean;
  amount: number;
  transactionId: string;
  paymentStatus: "pending" | "completed" | "failed";
};

export default function EnrolledCourses() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterStatus, setFilterStatus] = useState<"all" | "in-progress" | "completed" | "not-started">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Data fetching
  const { data: userData, isLoading: userLoading } = useGetMeQuery({});
  const user = userData?.data;
  const userId = user?._id;
  const { data: paymentsData, isLoading: paymentsLoading, isError } = useGetMyPaymentsQuery(userId, { 
    skip: !userId 
  });

  // Transform payment data to course data
  const myPayments: Payment[] = paymentsData?.data || [];
  
  const courses: EnrolledCourseDetailed[] = myPayments
    .filter(payment => payment.status === 'completed') // Only show courses for completed payments
    .map(payment => ({
      id: payment._id,
      title: payment.course?.title || "Unknown Course",
      instructor: "CADD Core Instructor", // Default instructor
      duration: payment.course?.duration || "N/A",
      progress: Math.floor(Math.random() * 80) + 20, // Random progress between 20-100%
      status: Math.random() > 0.3 ? "in-progress" : "completed" as "in-progress" | "completed",
      enrolledDate: payment.createdAt,
      thumbnailUrl: payment.course?.photoUrl || "https://placehold.co/400x225/DC2626/FFFFFF?text=Course",
      rating: 4.5 + Math.random() * 0.5, // Random rating between 4.5-5.0
      totalLessons: Math.floor(Math.random() * 30) + 10, // Random lessons between 10-40
      completedLessons: 0, // Will be calculated based on progress
      certificateEligible: false, // Will be set based on progress
      amount: payment.amount,
      transactionId: payment.transactionId,
      paymentStatus: payment.status
    }))
    .map(course => ({
      ...course,
      completedLessons: Math.floor((course.progress / 100) * course.totalLessons),
      certificateEligible: course.progress >= 90 && course.status === "completed"
    }));

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || course.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const totalCourses = courses.length;
  const completedCourses = courses.filter(c => c.status === "completed").length;
  const inProgressCourses = courses.filter(c => c.status === "in-progress").length;
  const totalSpent = myPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "in-progress": return "bg-red-100 text-red-800 border-red-200";
      case "not-started": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const isLoading = userLoading || paymentsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-950 font-medium">Loading your courses...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[400px] text-center">
        <FiAlertCircle className="text-red-500 text-5xl mb-4"/>
        <h2 className="text-2xl font-bold text-red-600 mb-2">Error Loading Courses</h2>
        <p className="text-gray-600">We couldn't fetch your course data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-500 to-red-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <FiBookOpen size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">My Enrolled Courses</h1>
            <p className="text-red-100 text-lg">Track your learning progress and access course materials</p>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Courses</p>
              <p className="text-2xl font-bold text-gray-950">{totalCourses}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FiBookOpen className="text-red-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-950">{completedCourses}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiCheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-bold text-gray-950">{inProgressCourses}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FiClock className="text-yellow-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-950">৳{totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-full">
              <FiBarChart className="text-red-600" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Course Video Access Instructions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
      >
        <h3 className="text-xl font-bold text-gray-950 mb-4 flex items-center gap-2">
          <FiVideo className="text-red-600" />
          Access Your Course Content
        </h3>
        <div className="bg-red-50 border-l-4 border-red-500 text-red-800 p-4 rounded-r-lg space-y-3">
          <p className="font-semibold">Important Instructions:</p>
          <p>
            Once your payment is successfully completed, we will send your unique <strong>Student ID and Password</strong> to your registered email address before your official course start date.
          </p>
          <p>
            After receiving your credentials, please use them to log in to our learning portal to access all your course videos and materials.
          </p>
        </div>
        <div className="mt-4 text-center">
          <a href="https://engineeringitskills.com/" target="_blank" rel="noopener noreferrer">
            <Button className="w-full md:w-auto gap-2 bg-red-600 hover:bg-red-700 text-white">
              <FiExternalLink size={16} />
              Go to Learning Portal
            </Button>
          </a>
          <p className="text-sm text-gray-500 mt-2">Happy Learning!</p>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="all">All Courses</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="not-started">Not Started</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className={`gap-2 ${viewMode === "grid" ? "bg-red-600 hover:bg-red-700" : "border-gray-300 text-gray-950 hover:bg-red-50 hover:text-red-600"}`}
            >
              <FiGrid size={16} />
              Grid
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className={`gap-2 ${viewMode === "list" ? "bg-red-600 hover:bg-red-700" : "border-gray-300 text-gray-950 hover:bg-red-50 hover:text-red-600"}`}
            >
              <FiList size={16} />
              List
            </Button>
          </div>
        </div>
      </div>

      {/* Courses Display */}
      {filteredCourses.length > 0 ? (
        <div className={`${
          viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" 
            : "space-y-4"
        }`}>
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 hover:border-red-200 ${
                viewMode === "list" ? "flex gap-6 p-6" : ""
              }`}
            >
              {/* Course Image */}
              <div className={`relative ${
                viewMode === "list" ? "w-48 h-32 flex-shrink-0" : "h-48 w-full"
              } overflow-hidden`}>
                <Image
                  src={course.thumbnailUrl}
                  alt={course.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-3 left-3">
                  <Badge className={getStatusColor(course.status)}>
                    {course.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    ৳{course.amount.toLocaleString()}
                  </Badge>
                </div>
                {course.status === "in-progress" && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <Progress value={course.progress} className="h-2 bg-white/20" />
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className={`${viewMode === "list" ? "flex-1" : "p-6"}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-950 mb-1">{course.title}</h3>
                    <p className="text-gray-600 text-sm">{course.instructor}</p>
                  </div>
                  {course.rating && (
                    <div className="flex items-center gap-1 text-sm">
                      <FiStar className="text-yellow-400 fill-current" size={16} />
                      <span className="font-medium text-gray-950">{course.rating.toFixed(1)}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FiClock size={14} />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiPlay size={14} />
                      <span>{course.completedLessons}/{course.totalLessons} lessons</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FiCalendar size={14} />
                      <span>{new Date(course.enrolledDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {course.status === "in-progress" && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-950 font-medium">Progress</span>
                        <span className="text-gray-950 font-medium">{course.progress}%</span>
                      </div>
                      <Progress value={course.progress} className="h-2" />
                    </div>
                  )}

                  {course.status === "completed" && course.certificateEligible && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800 font-medium">
                        🎉 Certificate Available!
                      </p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {course.status === "completed" ? (
                    <>
                      <Button size="sm" className="flex-1 gap-2 bg-red-600 hover:bg-red-700">
                        <FiFileText size={14} />
                        Review Course
                      </Button>
                      {course.certificateEligible && (
                        <Button size="sm" variant="outline" className="gap-2 border-gray-300 text-gray-950 hover:bg-red-50 hover:text-red-600">
                          <FiDownload size={14} />
                          Certificate
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      <Button size="sm" className="flex-1 gap-2 bg-red-600 hover:bg-red-700">
                        <FiPlay size={14} />
                        {course.status === "not-started" ? "Start Course" : "Continue"}
                      </Button>
                      <Link href="https://engineeringitskills.com/" target="_blank">
                        <Button size="sm" variant="outline" className="gap-2 border-gray-300 text-gray-950 hover:bg-red-50 hover:text-red-600">
                          <FiExternalLink size={14} />
                          Portal
                        </Button>
                      </Link>
                    </>
                  )}
                </div>

                {/* Course Details */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Transaction ID</p>
                      <p className="font-medium text-gray-950 text-xs">{course.transactionId}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Payment Status</p>
                      <Badge className={course.paymentStatus === "completed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                        {course.paymentStatus}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-200">
          <FiBookOpen size={64} className="mx-auto mb-4 text-gray-300" />
          <h3 className="text-xl font-semibold text-gray-950 mb-2">No Courses Found</h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterStatus !== "all" 
              ? "No courses match your current filters." 
              : "You haven't enrolled in any courses yet. Complete a payment to see your courses here."}
          </p>
          {(!searchTerm && filterStatus === "all" && totalCourses === 0) && (
            <Link href="/courses">
              <Button className="bg-red-600 hover:bg-red-700 text-white">Browse Available Courses</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
