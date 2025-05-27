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
import { BookOpen, FileText, Users, CreditCard, Briefcase, FileStack, ArrowUpRight, Activity } from "lucide-react";
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

  const stats = [
    {
      title: "Total Courses",
      value: courses?.data?.length || 0,
      icon: <BookOpen className="h-5 w-5" />,
      change: "+12%",
      trend: "up",
      color: "text-blue-600"
    },
    {
      title: "Active Users",
      value: users?.data?.length || 0,
      icon: <Users className="h-5 w-5" />,
      change: "+5%",
      trend: "up",
      color: "text-green-600"
    },
    {
      title: "Certificates",
      value: certificates?.data?.length || 0,
      icon: <FileText className="h-5 w-5" />,
      change: "+8%",
      trend: "up",
      color: "text-purple-600"
    },
    {
      title: "Revenue",
      value: `৳${(totalRevenue / 1000).toFixed(1)}হাজার`,
      icon: <CreditCard className="h-5 w-5" />,
      change: "+15%",
      trend: "up",
      color: "text-amber-600"
    },
  ];

  const recentCourses = courses?.data?.slice(0, 5).map((course: any) => ({
    id: course._id || course.id,
    title: course.title || "Untitled Course",
    date: safeFormatDate(course?.createdAt, "MMM dd, yyyy"),
    status: "Active"
  }));

  const recentPayments = payments?.data?.slice(0, 5).map((payment: any) => ({
    id: payment._id,
    user: payment.user?.name || "Unknown",
    amount: `৳${(payment.amount || 0).toFixed(2)}`,
    status: payment.status || "Pending",
    date: safeFormatDate(payment?.createdAt, "MMM dd")
  }));

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
    <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900 uppercase">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
              <Activity className="h-4 w-4 mr-1" />
              Live
            </Badge>
            <p className="text-sm text-gray-500">
              Last updated: {safeFormatDate(new Date().toISOString(), "MMM dd, h:mm a")}
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {/* Welcome Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Card className="border-0 shadow-sm bg-gradient-to-r from-blue-600 to-blue-800">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-semibold text-white">Welcome back, {user?.name || 'Admin'}!</h2>
                  <p className="mt-1 text-blue-100">
                    Here's what's happening with your platform today.
                  </p>
                </div>
                <div className="bg-white/10 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid gap-6 mb-8 md:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="hover:shadow-md transition-shadow duration-200 border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                      <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
                    </div>
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.color.replace('text', 'bg')}/10`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center">
                    <Badge variant={stat.trend === "up" ? "default" : "destructive"} className="px-2 py-0.5 text-xs">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      {stat.change}
                    </Badge>
                    <span className="text-xs text-gray-500 ml-2">vs last month</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity Section */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Courses Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
                  Recent Courses
                </CardTitle>
                <CardDescription>Latest courses added to the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course Title</TableHead>
                   
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentCourses?.map((course: TCourse, index: number) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{course.title}</TableCell>
                        
                        <TableCell className="text-right">
                          <Badge variant="outline">Ative</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payments Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-amber-600" />
                  Recent Transactions
                </CardTitle>
                <CardDescription>Latest payment activities</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentPayments?.map((payment: IPayment, index: number) => (
                      <TableRow key={index} className="hover:bg-gray-50">
                        <TableCell>{payment.user}</TableCell>
                        <TableCell className="font-medium">{payment.amount}</TableCell>
                        <TableCell className="text-right">
                          <Badge 
                            variant={
                              payment.status === 'completed' ? 'default' : 
                              payment.status === 'pending' ? 'secondary' : 'destructive'
                            }
                          >
                            {payment.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Jobs Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6"
        >
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-green-600" />
                Jobs Overview
              </CardTitle>
              <CardDescription>Current job postings and applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Active Jobs</p>
                      <h3 className="text-2xl font-bold mt-1">{jobs?.data?.length || 0}</h3>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-green-600" />
                    </div>
                  </div>
                  <Progress value={75} className="h-2 mt-4 bg-green-600" />
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Total Applications</p>
                      <h3 className="text-2xl font-bold mt-1">{applications?.data?.length || 0}</h3>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                      <FileStack className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                  <Progress value={60} className="h-2 mt-4 bg-red-500"  />
                </div>

                <div className="border rounded-lg p-4">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Hiring Rate</p>
                      <h3 className="text-2xl font-bold mt-1">24%</h3>
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Users className="h-5 w-5 text-purple-600" />
                    </div>
                  </div>
                  <Progress value={24} className="h-2 mt-4 bg-red-500"  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
}