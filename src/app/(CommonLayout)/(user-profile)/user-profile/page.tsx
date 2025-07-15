"use client";

import { useGetMeQuery } from "@/redux/api/userApi";
import { motion } from "framer-motion";
import Image from "next/image";
import { FiDollarSign, FiBookOpen, FiCheckCircle, FiClock, FiMail, FiPhone, FiEdit2, FiVideo, FiAlertCircle } from "react-icons/fi";
import { Progress } from "@/components/UI/progress";
import { Badge } from "@/components/UI/badge";
import { Button } from "@/components/UI/button";
import { useGetMyPaymentsQuery } from "@/redux/api/payment/paymentApi";
import Link from "next/link";

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
 * Main UserProfile Component
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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-xl font-semibold text-gray-600">Loading Profile...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col justify-center items-center h-screen text-center">
        <FiAlertCircle className="text-red-500 text-5xl mb-4"/>
        <h2 className="text-2xl font-bold text-red-600">Error Loading Profile</h2>
        <p className="text-gray-500 mt-2">We couldn't fetch your profile data. Please try again later.</p>
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
        
        {/* Left Column: Profile Card */}
        <ProfileCard user={user} />

        {/* Right Column: Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <PaymentSummary 
            totalSpent={totalSpent}
            enrolledCount={enrolledCourses.length}
            completedCount={completedPayments}
          />
          
          {/* New Video Access Section */}
          <CourseVideoAccess />

          <EnrolledCourses courses={enrolledCourses} />

          <PaymentHistory history={paymentHistory} />
        </div>
      </div>
    </motion.div>
  );
}
