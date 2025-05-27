"use client";
import { useGetMeQuery } from "@/redux/api/userApi";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiDollarSign, FiBookOpen, FiCheckCircle, FiClock, FiMail, FiPhone, FiEdit2 } from "react-icons/fi";
import { Progress } from "@/components/UI/progress";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { useGetMyPaymentsQuery } from "@/redux/api/payment/paymentApi";

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

type EnrolledCourse = {
  id: string;
  name: string;
  price: number;
  status: "completed" | "in-progress" | "not-started";
  progress: number;
  photoUrl: string;
};

type PaymentHistoryItem = {
  id: string;
  date: string;
  amount: number;
  course: string;
  method: string;
  status: "completed" | "pending" | "failed";
};

export default function UserProfile() {
  const { data: userData } = useGetMeQuery({});
  const user = userData?.data;
  const userId = user?._id;
  const { data: paymentsData, isLoading, isError } = useGetMyPaymentsQuery(userId);

  // Transform payment data
  const myPayments: Payment[] = paymentsData?.data || [];
  
  const enrolledCourses: EnrolledCourse[] = myPayments.map(payment => ({
    id: payment._id,
    name: payment.course?.title || "Unknown Course",
    price: payment.amount,
    status: payment.status === "completed" ? "completed" : "in-progress",
    progress: payment.status === "completed" ? 100 : 100, // Changed to 100% for all
    photoUrl: payment.course?.photoUrl || "/default-course.jpg"
  }));

  const paymentHistory: PaymentHistoryItem[] = myPayments.map(payment => ({
    id: payment._id,
    date: payment.createdAt,
    amount: payment.amount,
    course: payment.course?.title || "Unknown Course",
    method: "bKash", // Replace with actual payment method if available
    status: payment.status === "completed" ? "completed" : payment.status
  }));

  // Calculate summary metrics
  const totalSpent = myPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const completedPayments = myPayments.filter(payment => payment.status === "completed").length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-xl">Loading profile...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-red-500 text-xl">Error loading profile data</div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-4 py-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 col-span-1"
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-24 relative">
            <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dbkwiwoll/image/upload/v1746349680/Artboard_1_1_-Picsart-AiImageEnhancer_dccum8.png')] bg-cover bg-center bg-no-repeat opacity-20" />
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2"
            >
              <div className="relative h-24 w-24 rounded-full border-4 border-white overflow-hidden shadow-lg">
                <Image
                  src={user?.profilePhoto || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
                  alt={user?.name || "User"}
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>

          <div className="pt-16 pb-6 px-6 text-center">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-800"
            >
              {user?.name || "User"}
            </motion.h2>
            
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-indigo-600 font-medium mb-4"
            >
              CADD Core Student
            </motion.p>

            <div className="flex justify-center gap-2 mb-6">
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-100">
                {user?.status || "ACTIVE"}
              </Badge>
              <Badge variant="outline" className="bg-green-50 text-green-600 border-green-100">
                {user?.emailVerified ? "Verified" : "Unverified"}
              </Badge>
            </div>

            <div className="space-y-4 text-left mb-6">
              <div className="flex items-center gap-3">
                <FiMail className="text-indigo-600" />
                <span className="text-gray-600">{user?.email || "No email"}</span>
              </div>
              <div className="flex items-center gap-3">
                <FiPhone className="text-indigo-600" />
                <span className="text-gray-600">{user?.mobileNumber || "Not provided"}</span>
              </div>
              <div className="flex items-center gap-3">
                <FiClock className="text-indigo-600" />
                <span className="text-gray-600">
                  Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </span>
              </div>
            </div>

            <Button variant="outline" className="w-full gap-2">
              <FiEdit2 size={16} />
              Edit Profile
            </Button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Payment Summary */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <FiDollarSign className="text-indigo-600" />
              Payment Summary
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg p-4 border border-indigo-100"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Total Spent</span>
                  <div className="bg-indigo-100 p-2 rounded-full">
                    <FiDollarSign className="text-indigo-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">৳{totalSpent.toLocaleString()}</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-green-50 to-teal-50 rounded-lg p-4 border border-green-100"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Courses Enrolled</span>
                  <div className="bg-green-100 p-2 rounded-full">
                    <FiBookOpen className="text-green-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">{enrolledCourses.length}</p>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.03 }}
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Completed Payments</span>
                  <div className="bg-purple-100 p-2 rounded-full">
                    <FiCheckCircle className="text-purple-600" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-gray-800 mt-2">{completedPayments}</p>
              </motion.div>
            </div>
          </motion.div>

          {/* Enrolled Courses */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FiBookOpen className="text-indigo-600" />
              Enrolled Courses
              <Badge variant="secondary" className="ml-auto">
                {enrolledCourses.length} Courses
              </Badge>
            </h3>
            
            <div className="space-y-4">
              {enrolledCourses.length > 0 ? (
                enrolledCourses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="p-4 border rounded-lg hover:shadow-md transition-shadow flex items-start gap-4"
                  >
                    <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                      <Image
                        src={course.photoUrl}
                        alt={course.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{course.name}</h4>
                          <p className="text-sm text-gray-500">৳{course.price.toLocaleString()}</p>
                        </div>
                        <Badge 
                          variant={
                            course.status === "completed" ? "default" : 
                            course.status === "in-progress" ? "secondary" : "outline"
                          }
                          className="ml-2"
                        >
                          {course.status === "completed" ? "Completed" : 
                           course.status === "in-progress" ? "In Progress" : "Not Started"}
                        </Badge>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span>{course.progress}%</span>
                        </div>
                        <Progress value={course.progress} className="h-2" />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No courses enrolled yet</p>
                  <Button variant="outline" className="mt-4">
                    Browse Courses
                  </Button>
                </div>
              )}
            </div>
          </motion.div>

          {/* Payment History */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <FiDollarSign className="text-indigo-600" />
              Payment History
              <Badge variant="secondary" className="ml-auto">
                {paymentHistory.length} Transactions
              </Badge>
            </h3>
            
            {paymentHistory.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paymentHistory.map((payment) => (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {new Date(payment.date).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.course}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                          ৳{payment.amount.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {payment.method}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge 
                            variant={
                              payment.status === "completed" ? "default" : 
                              payment.status === "pending" ? "secondary" : "destructive"
                            }
                            className="text-xs"
                          >
                            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No payment history found</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}