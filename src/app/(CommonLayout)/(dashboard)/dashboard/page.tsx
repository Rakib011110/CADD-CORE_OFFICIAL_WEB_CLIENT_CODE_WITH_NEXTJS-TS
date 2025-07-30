"use client"
import { useGetAllCertificatesQuery } from "@/redux/api/certificatesApi";
import { useGetAllCourseQuery } from "@/redux/api/courseApi";
import { useGetAllUsersQuery } from "@/redux/api/userApi";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/UI/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/UI/table";
import { Badge } from "@/components/UI/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/UI/avatar";
import { format, formatDistanceToNow } from "date-fns";
import { useUser } from "@/context/user.provider";
import { BookOpen, FileText, Users, GraduationCap, Briefcase, FileStack, ArrowUpRight, Activity, TrendingUp, Calendar, CheckCircle, Clock } from "lucide-react";
import { Skeleton } from "@/components/UI/skeleton";
import { motion } from "framer-motion";
import { Progress } from "@/components/UI/progress";
import { useGetAllPaymentsQuery } from "@/redux/api/payment/paymentApi";
import { useGetAllJobsQuery } from "@/redux/api/jobsApi/jobAPi";
import { useGetAllJobApplicationsQuery } from "@/redux/api/jobsApi/jobApplicationApi";
import { TCourse } from "@/lib/courses";
import { IPayment } from "@/types";

const safeFormatDate = (dateString: string | undefined | null, formatString: string) => {
  if (!dateString) return "N/A";
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Invalid date" : format(date, formatString);
  } catch {
    return "Invalid date";
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function Dashboard() {
  const { data: courses } = useGetAllCourseQuery({});
  const { user } = useUser();
  const { data: certificates } = useGetAllCertificatesQuery({});
  const { data: users } = useGetAllUsersQuery({});
  const { data: payments } = useGetAllPaymentsQuery({});
  const { data: jobs } = useGetAllJobsQuery({});
  const { data: applications } = useGetAllJobApplicationsQuery({});

  const totalRevenue = payments?.data?.reduce((sum: number, payment: any) => sum + (payment.amount || 0), 0) || 0;
  const enrolledStudents = payments?.data?.filter((payment: any) => payment.status === 'completed')?.length || 0;

  const stats = [
    {
      title: "Total Courses",
      value: courses?.data?.length || 0,
      icon: <BookOpen className="h-6 w-6" />,
      change: "+12%",
      trend: "up",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200"
    },
    {
      title: "Total Students",
      value: enrolledStudents,
      icon: <Users className="h-6 w-6" />,
      change: "+18%",
      trend: "up",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200"
    },
    {
      title: "Certificates Issued",
      value: certificates?.data?.length || 0,
      icon: <FileText className="h-6 w-6" />,
      change: "+8%",
      trend: "up",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200"
    },
  
  ];

  const recentCourses = courses?.data?.slice(0, 5).map((course: any) => ({
    id: course._id || course.id,
    title: course.title || "Untitled Course",
    date: safeFormatDate(course?.createdAt, "MMM dd, yyyy"),
    status: "Active",
    students: Math.floor(Math.random() * 50) + 10 // Mock data for students count
  }));

  // Filter completed payments and get recent enrollments
  const recentEnrollments = payments?.data
    ?.filter((payment: any) => payment.status === 'completed')
    ?.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) // Sort by most recent first
    ?.slice(0, 5)
    ?.map((payment: any) => ({
      id: payment._id,
      studentName: payment.user?.name || "Unknown Student",
      phoneNo: payment.user?.mobileNumber || payment.user?.phone || "N/A", // Add phone number
      course: payment.course?.title || "Unknown Course",
      enrollDate: safeFormatDate(payment?.createdAt, "MMM dd"),
      timeAgo: formatDistanceToNow(new Date(payment?.createdAt || Date.now()), { addSuffix: true }),
      status: "Enrolled"
    })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Enhanced Header */}
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                  <p className="text-sm text-slate-600">Welcome back, {user?.name || 'Admin'}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 px-3 py-1">
                <div className="h-2 w-2 bg-emerald-500 rounded-full mr-2 animate-pulse"></div>
                Live Data
              </Badge>
              <div className="hidden sm:flex items-center text-sm text-slate-500">
                <Clock className="h-4 w-4 mr-2" />
                Updated {safeFormatDate(new Date().toISOString(), "MMM dd, h:mm a")}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Enhanced Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-3"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className={`hover:shadow-lg transition-all duration-300 border-0 shadow-md ${stat.bgColor} ${stat.borderColor} border-l-4`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">{stat.title}</p>
                      <h3 className="text-3xl font-bold mt-2 text-slate-900">{stat.value}</h3>
                      <div className="mt-4 flex items-center">
                        <Badge variant="secondary" className={`${stat.bgColor} ${stat.color} border-0 px-2 py-1 text-xs font-semibold`}>
                          <TrendingUp className="h-3 w-3 mr-1" />
                          {stat.change}
                        </Badge>
                        <span className="text-xs text-slate-500 ml-2">vs last month</span>
                      </div>
                    </div>
                    <div className={`h-14 w-14 rounded-xl ${stat.bgColor} flex items-center justify-center ${stat.color}`}>
                      {stat.icon}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Activity Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Enhanced Courses Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
                <CardTitle className="flex items-center text-lg font-bold text-slate-900">
                  <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  Recent Courses
                </CardTitle>
                <CardDescription className="text-slate-600">Latest courses added to the platform</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="font-semibold text-slate-700">Course Title</TableHead>
                      <TableHead className="font-semibold text-slate-700">Students</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentCourses?.map((course: any, index: number) => (
                      <TableRow key={index} className="hover:bg-slate-50 transition-colors duration-200">
                        <TableCell className="font-medium text-slate-900 py-4">
                          <div>
                            <p className="font-semibold">{course.title}</p>
                            <p className="text-sm text-slate-500">Added {course.date}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2 text-slate-400" />
                            {course.students}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 font-semibold">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Recently Enrolled Students */}
         <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 border-b border-emerald-100">
                <CardTitle className="flex items-center text-lg font-bold text-slate-900">
                  <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center mr-3">
                    <GraduationCap className="h-5 w-5 text-emerald-600" />
                  </div>
                  Recent Enrollments
                </CardTitle>
                <CardDescription className="text-slate-600">New student enrollments and registrations (most recent first)</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-200">
                      <TableHead className="font-semibold text-slate-700">Student</TableHead>
                      <TableHead className="font-semibold text-slate-700">Phone</TableHead>
                      <TableHead className="font-semibold text-slate-700">Course</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentEnrollments?.length > 0 ? (
                      recentEnrollments.map((enrollment: any, index: number) => (
                        <TableRow key={index} className="hover:bg-slate-50 transition-colors duration-200">
                          <TableCell className="py-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-10 w-10 border-2 border-emerald-100">
                                <AvatarFallback className="bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 font-semibold text-sm">
                                  {enrollment.studentName?.charAt(0)?.toUpperCase() || 'S'}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-semibold text-slate-900">{enrollment.studentName}</p>
                                <p className="text-sm text-slate-500">{enrollment.timeAgo}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            <div className="flex items-center">
                              <span className="text-sm font-medium">{enrollment.mobileNumber}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600">
                            <div>
                              <p className="font-medium">{enrollment.course}</p>
                              <p className="text-sm text-slate-500">Enrolled {enrollment.enrollDate}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <Badge variant="default" className="bg-emerald-100 text-emerald-700 border-emerald-200 font-semibold">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              {enrollment.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                          <div className="flex flex-col items-center">
                            <GraduationCap className="h-12 w-12 text-slate-300 mb-3" />
                            <p className="font-medium">No recent enrollments</p>
                            <p className="text-sm">New enrollments will appear here</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

        </div>

        {/* Enhanced Jobs Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 border-b border-slate-200">
              <CardTitle className="flex items-center text-xl font-bold text-slate-900">
                <div className="h-8 w-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3">
                  <Briefcase className="h-5 w-5 text-slate-600" />
                </div>
                Jobs & Career Overview
              </CardTitle>
              <CardDescription className="text-slate-600">Employment opportunities and application insights</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-6 md:grid-cols-3">
                <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-emerald-700 uppercase tracking-wide">Active Jobs</p>
                      <h3 className="text-3xl font-bold mt-2 text-emerald-900">{jobs?.data?.length || 0}</h3>
                      <p className="text-sm text-emerald-600 mt-1">Available positions</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-emerald-200 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-emerald-700" />
                    </div>
                  </div>
                  <Progress value={75} className="h-3 mt-4" />
                  <p className="text-xs text-emerald-600 mt-2">75% growth rate</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Applications</p>
                      <h3 className="text-3xl font-bold mt-2 text-blue-900">{applications?.data?.length || 0}</h3>
                      <p className="text-sm text-blue-600 mt-1">Total submissions</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-blue-200 flex items-center justify-center">
                      <FileStack className="h-6 w-6 text-blue-700" />
                    </div>
                  </div>
                  <Progress value={60} className="h-3 mt-4" />
                  <p className="text-xs text-blue-600 mt-2">60% response rate</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-6 hover:shadow-md transition-shadow duration-300">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-semibold text-purple-700 uppercase tracking-wide">Success Rate</p>
                      <h3 className="text-3xl font-bold mt-2 text-purple-900">24%</h3>
                      <p className="text-sm text-purple-600 mt-1">Hiring success</p>
                    </div>
                    <div className="h-12 w-12 rounded-xl bg-purple-200 flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-purple-700" />
                    </div>
                  </div>
                  <Progress value={24} className="h-3 mt-4" />
                  <p className="text-xs text-purple-600 mt-2">Above industry average</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}