"use client";

import { useGetMeQuery } from "@/redux/api/userApi";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiDollarSign, FiBookOpen, FiCheckCircle, FiClock, FiMail, FiPhone, FiEdit2, FiVideo, FiAlertCircle, FiUser, FiAward, FiBriefcase, FiExternalLink } from "react-icons/fi";
import { Progress } from "@/components/UI/progress";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { useGetMyPaymentsQuery } from "@/redux/api/payment/paymentApi";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

// --- TYPE DEFINITIONS ---
// It's good practice to keep type definitions clear and at the top.
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

type User = {
    _id: string;
    name: string;
    email: string;
    profilePhoto: string;
    mobileNumber: string;
    status: string;
    emailVerified: boolean;
    createdAt: string;
}

// --- SUB-COMPONENTS ---
// Breaking the UI into smaller components makes the code easier to read and maintain.

/**
 * ProfileCard Component: Displays user's personal information.
 */
const ProfileCard = ({ user }: { user: User | undefined }) => (
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
            src={user?.profilePhoto || "https://placehold.co/96x96/EFEFEF/333333?text=User"}
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
        <Badge variant="outline" className={user?.emailVerified ? "bg-green-50 text-green-600 border-green-100" : "bg-yellow-50 text-yellow-600 border-yellow-100"}>
          {user?.emailVerified ? "Verified" : "Unverified"}
        </Badge>
      </div>

      <div className="space-y-4 text-left mb-6">
        <div className="flex items-center gap-3">
          <FiMail className="text-indigo-600" />
          <span className="text-gray-600 break-all">{user?.email || "No email"}</span>
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
);
 
/**
 * PaymentSummary Component: Displays key metrics about payments.
 */
const PaymentSummary = ({ totalSpent, enrolledCount, completedCount }: { totalSpent: number, enrolledCount: number, completedCount: number }) => (
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
      <SummaryCard icon={<FiDollarSign className="text-indigo-600" />} label="Total Spent" value={`৳${totalSpent.toLocaleString()}`} color="indigo" />
      <SummaryCard icon={<FiBookOpen className="text-green-600" />} label="Courses Enrolled" value={enrolledCount} color="green" />
      <SummaryCard icon={<FiCheckCircle className="text-purple-600" />} label="Completed Payments" value={completedCount} color="purple" />
    </div>
  </motion.div>
);

const SummaryCard = ({ icon, label, value, color }: { icon: React.ReactNode, label: string, value: string | number, color: string }) => (
    <motion.div
        whileHover={{ scale: 1.03 }}
        className={`bg-gradient-to-br from-${color}-50 to-${color}-100 rounded-lg p-4 border border-${color}-100`}
    >
        <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">{label}</span>
            <div className={`bg-${color}-100 p-2 rounded-full`}>
                {icon}
            </div>
        </div>
        <p className="text-2xl font-bold text-gray-800 mt-2">{value}</p>
    </motion.div>
);

/**
 * CourseVideoAccess Component: NEW component with instructions for accessing videos.
 */
const CourseVideoAccess = () => (
    <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
    >
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <FiVideo className="text-indigo-600" />
            Access Your Course Content
        </h3>
        <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-800 p-4 rounded-r-lg space-y-3">
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
                <Button className="w-full md:w-auto gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
                    Go to Learning Portal
                </Button>
            </a>
            <p className="text-sm text-gray-500 mt-2">Happy Learning!</p>
        </div>
    </motion.div>
);

/**
 * EmailVerificationBanner Component: Shows email verification status and resend option.
 */
const EmailVerificationBanner = ({ user }: { user: User | undefined }) => {
    const [isResending, setIsResending] = useState(false);

    const handleResendVerification = async () => {
        if (!user?.email) {
            toast.error('User email not found');
            return;
        }

        setIsResending(true);
        try {
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/resend-verification`,
                { email: user.email },
                { timeout: 10000 }
            );
            toast.success('Verification email sent successfully!');
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 
                            'Failed to resend verification email. Please try again.';
            toast.error(errorMsg);
        } finally {
            setIsResending(false);
        }
    };

    // Only show banner if user exists and is not verified
    if (!user || user.emailVerified) return null;

    return (
        <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 shadow-lg"
        >
            <div className="flex items-start gap-3">
                <FiAlertCircle className="text-yellow-600 text-xl mt-1 flex-shrink-0" />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-yellow-800 mb-2">
                        Email Verification Required
                    </h3>
                    <p className="text-yellow-700 mb-4">
                        Your email is not verified yet. Please verify your email to secure your account and receive important updates.
                    </p>
                    <Button 
                        onClick={handleResendVerification}
                        disabled={isResending}
                        className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                        {isResending ? 'Sending...' : 'Send Verification Email Again'}
                    </Button>
                </div>
            </div>
        </motion.div>
    );
};


/**
 * EnrolledCourses Component: Lists all courses the user is enrolled in.
 */
const EnrolledCourses = ({ courses }: { courses: EnrolledCourse[] }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.4 }}
    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
  >
    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <FiBookOpen className="text-indigo-600" />
      Enrolled Courses
      <Badge variant="secondary" className="ml-auto">{courses.length} Courses</Badge>
    </h3>
    <div className="space-y-4">
      {courses.length > 0 ? (
        courses.map((course) => <CourseItem key={course.id} course={course} />)
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No courses enrolled yet.</p>
          <Button variant="outline" className="mt-4 as-child">
            <Link href="/courses">Browse Courses</Link>
          </Button>
        </div>
      )}
    </div>
  </motion.div>
);

const CourseItem = ({ course }: { course: EnrolledCourse }) => (
    <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="p-4 border rounded-lg hover:shadow-md transition-shadow flex flex-col sm:flex-row items-start gap-4"
    >
        <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden self-center sm:self-start">
            <Image
                src={course.photoUrl}
                alt={course.name}
                fill
                className="object-cover"
            />
        </div>
        <div className="flex-1 w-full">
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
                    className="ml-2 flex-shrink-0"
                >
                    {course.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
);

/**
 * PaymentHistory Component: Shows a table of all past transactions.
 */
const PaymentHistory = ({ history }: { history: PaymentHistoryItem[] }) => (
  <motion.div
    initial={{ x: -20, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    transition={{ delay: 0.5 }}
    className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
  >
    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
      <FiDollarSign className="text-indigo-600" />
      Payment History
      <Badge variant="secondary" className="ml-auto">{history.length} Transactions</Badge>
    </h3>
    {history.length > 0 ? (
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
            {history.map((payment) => <PaymentRow key={payment.id} payment={payment} />)}
          </tbody>
        </table>
      </div>
    ) : (
      <div className="text-center py-8">
        <p className="text-gray-500">No payment history found.</p>
      </div>
    )}
  </motion.div>
);

const PaymentRow = ({ payment }: { payment: PaymentHistoryItem }) => (
    <motion.tr
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
);

/**
 * Main UserProfile Component - Overview Dashboard
 */
export default function UserProfile() {
  // --- DATA FETCHING & STATE ---
  const { data: userData } = useGetMeQuery({});
  const user = userData?.data;
  const userId = user?._id;
  // We should only query for payments if we have a userId
  const { data: paymentsData, isLoading, isError } = useGetMyPaymentsQuery(userId, {
    skip: !userId,
  });

  // --- DATA TRANSFORMATION ---
  // Memoizing this would be a good optimization for larger datasets.
  const myPayments: Payment[] = paymentsData?.data || [];

  const enrolledCourses: EnrolledCourse[] = myPayments
    .filter(p => p.status === 'completed') // Only show courses for completed payments
    .map(payment => ({
      id: payment._id,
      name: payment.course?.title || "Unknown Course",
      price: payment.amount,
      status: "in-progress", // Assuming they are in progress after payment
      progress: 5, // A more realistic starting progress
      photoUrl: payment.course?.photoUrl || "/default-course.jpg"
    }));

  const paymentHistory: PaymentHistoryItem[] = myPayments.map(payment => ({
    id: payment._id,
    date: payment.createdAt,
    amount: payment.amount,
    course: payment.course?.title || "Unknown Course",
    method: "bKash", // This should ideally come from payment data
    status: payment.status
  }));

  // --- CALCULATIONS ---
  const totalSpent = myPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const completedPayments = myPayments.filter(p => p.status === "completed").length;

  // --- RENDER LOGIC ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-xl font-semibold text-gray-600">Loading Profile...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center">
        <FiAlertCircle className="text-red-500 text-5xl mb-4"/>
        <h2 className="text-2xl font-bold text-red-600">Error Loading Profile</h2>
        <p className="text-gray-500 mt-2">We couldn't fetch your profile data. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-8 text-white relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/dbkwiwoll/image/upload/v1746349680/Artboard_1_1_-Picsart-AiImageEnhancer_dccum8.png')] bg-cover bg-center bg-no-repeat opacity-10" />
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="relative h-20 w-20 rounded-full overflow-hidden border-4 border-white/20">
              <Image
                src={user?.profilePhoto || "https://placehold.co/80x80/EFEFEF/333333?text=User"}
                alt={user?.name || "User"}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome back, {user?.name || "User"}! 👋
              </h1>
              <p className="text-blue-100 text-lg">
                Continue your learning journey with CADD Core
              </p>
              <div className="flex gap-3 mt-4">
                <Badge className="bg-white/20 text-white border-white/20">
                  {user?.status || "ACTIVE"}
                </Badge>
                <Badge className={`${
                  user?.emailVerified 
                    ? "bg-green-500/20 text-green-100 border-green-400/20" 
                    : "bg-yellow-500/20 text-yellow-100 border-yellow-400/20"
                }`}>
                  {user?.emailVerified ? "✓ Verified" : "⚠ Unverified"}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Email Verification Banner - only show when user data is loaded */}
      {user && <EmailVerificationBanner user={user} />}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Spent</p>
              <p className="text-2xl font-bold text-gray-900">৳{totalSpent.toLocaleString()}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiDollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Enrolled Courses</p>
              <p className="text-2xl font-bold text-gray-900">{enrolledCourses.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiBookOpen className="text-blue-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Completed Payments</p>
              <p className="text-2xl font-bold text-gray-900">{completedPayments}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiCheckCircle className="text-purple-600" size={24} />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Member Since</p>
              <p className="text-2xl font-bold text-gray-900">
                {user?.createdAt ? new Date(user.createdAt).getFullYear() : "N/A"}
              </p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <FiClock className="text-indigo-600" size={24} />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Profile Information Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <FiUser className="text-indigo-600" />
            Profile Information
          </h3>
          <Button variant="outline" className="gap-2">
            <FiEdit2 size={16} />
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FiMail className="text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-gray-900">{user?.email || "No email"}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <FiPhone className="text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Mobile Number</p>
                <p className="text-gray-900">{user?.mobileNumber || "Not provided"}</p>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FiClock className="text-indigo-600" />
              <div>
                <p className="text-sm font-medium text-gray-500">Member Since</p>
                <p className="text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <FiCheckCircle className="text-white" size={12} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Account Status</p>
                <p className="text-gray-900">{user?.status || "ACTIVE"}</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
      >
        <h3 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/user-profile/enrolled-courses">
            <Button variant="outline" className="w-full h-16 flex-col gap-2">
              <FiBookOpen size={20} />
              <span className="text-sm">View Courses</span>
            </Button>
          </Link>
          <Link href="/user-profile/apply-certificate">
            <Button variant="outline" className="w-full h-16 flex-col gap-2">
              <FiAward size={20} />
              <span className="text-sm">Apply Certificate</span>
            </Button>
          </Link>
          <Link href="/user-profile/working-projects">
            <Button variant="outline" className="w-full h-16 flex-col gap-2">
              <FiBriefcase size={20} />
              <span className="text-sm">My Projects</span>
            </Button>
          </Link>
          <Link href="/user-profile/learning-portal">
            <Button variant="outline" className="w-full h-16 flex-col gap-2">
              <FiExternalLink size={20} />
              <span className="text-sm">Learning Portal</span>
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Recent Courses Preview */}
      {enrolledCourses.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <FiBookOpen className="text-indigo-600" />
              Recent Courses
              <Badge variant="secondary" className="ml-2">{enrolledCourses.slice(0, 3).length}</Badge>
            </h3>
            <Link href="/user-profile/enrolled-courses">
              <Button variant="ghost" size="sm">View All</Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {enrolledCourses.slice(0, 3).map((course) => (
              <div key={course.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="relative h-32 w-full rounded-md overflow-hidden mb-3">
                  <Image
                    src={course.photoUrl}
                    alt={course.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h4 className="font-medium text-gray-800 mb-2 truncate">{course.name}</h4>
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Progress</span>
                  <span>{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Course Video Access Section */}
      <CourseVideoAccess />
    </div>
  );
}
