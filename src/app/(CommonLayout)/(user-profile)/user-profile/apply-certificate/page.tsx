"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiAward, 
  FiCalendar, 
  FiBook, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiUpload,
  FiCheck,
  FiClock,
  FiX,
  FiAlertCircle,
  FiDownload
} from "react-icons/fi";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { Progress } from "@/components/UI/progress";
import { useGetMeQuery } from "@/redux/api/userApi";
import { useGetMyPaymentsQuery } from "@/redux/api/payment/paymentApi";
import Image from "next/image";
import { toast } from "sonner";

type CertificateApplication = {
  id: string;
  courseName: string;
  courseCode: string;
  completionDate: string;
  status: "pending" | "approved" | "rejected" | "draft";
  submittedDate: string;
  certificateType: "completion" | "participation";
  requirements: {
    projectsCompleted: number;
    requiredProjects: number;
    attendancePercentage: number;
    requiredAttendance: number;
    finalExamScore?: number;
    requiredExamScore?: number;
  };
};

const mockApplications: CertificateApplication[] = [
  {
    id: "1",
    courseName: "AutoCAD 2D & 3D Complete Course",
    courseCode: "CADD-001",
    completionDate: "2024-12-15",
    status: "approved",
    submittedDate: "2024-11-20",
    certificateType: "completion",
    requirements: {
      projectsCompleted: 8,
      requiredProjects: 8,
      attendancePercentage: 95,
      requiredAttendance: 80,
      finalExamScore: 88,
      requiredExamScore: 70
    }
  },
  {
    id: "2", 
    courseName: "3ds Max Modeling & Rendering",
    courseCode: "CADD-002",
    completionDate: "2024-11-30",
    status: "pending",
    submittedDate: "2024-11-25",
    certificateType: "completion",
    requirements: {
      projectsCompleted: 6,
      requiredProjects: 8,
      attendancePercentage: 85,
      requiredAttendance: 80,
      finalExamScore: 75,
      requiredExamScore: 70
    }
  }
];

export default function ApplyCertificate() {
  const [activeTab, setActiveTab] = useState<"apply" | "applications">("apply");
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [certificateType, setCertificateType] = useState<"completion" | "participation">("completion");
  const [applications, setApplications] = useState<CertificateApplication[]>(mockApplications);

  const { data: userData } = useGetMeQuery({});
  const user = userData?.data;
  const userId = user?._id;
  const { data: paymentsData } = useGetMyPaymentsQuery(userId, { skip: !userId });

  const enrolledCourses = paymentsData?.data?.filter((p: any) => p.status === 'completed') || [];

  const handleSubmitApplication = () => {
    if (!selectedCourse) {
      toast.error("Please select a course");
      return;
    }

    // Mock submission
    const newApplication: CertificateApplication = {
      id: Date.now().toString(),
      courseName: enrolledCourses.find((c: any) => c._id === selectedCourse)?.course?.title || "Unknown Course",
      courseCode: "CADD-" + Math.floor(Math.random() * 1000).toString().padStart(3, '0'),
      completionDate: new Date().toISOString().split('T')[0],
      status: "pending",
      submittedDate: new Date().toISOString().split('T')[0],
      certificateType,
      requirements: {
        projectsCompleted: Math.floor(Math.random() * 8) + 1,
        requiredProjects: 8,
        attendancePercentage: Math.floor(Math.random() * 20) + 80,
        requiredAttendance: 80,
        finalExamScore: Math.floor(Math.random() * 30) + 70,
        requiredExamScore: 70
      }
    };

    setApplications([newApplication, ...applications]);
    setSelectedCourse("");
    setActiveTab("applications");
    toast.success("Certificate application submitted successfully!");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <FiCheck className="text-green-500" />;
      case "pending": return <FiClock className="text-yellow-500" />;
      case "rejected": return <FiX className="text-red-500" />;
      default: return <FiAlertCircle className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "bg-green-100 text-green-800 border-green-200";
      case "pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "rejected": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const checkEligibility = (course: any) => {
    // Mock eligibility check
    const hasCompleted = Math.random() > 0.3;
    const attendanceGood = Math.random() > 0.2;
    const projectsComplete = Math.random() > 0.4;

    return {
      eligible: hasCompleted && attendanceGood && projectsComplete,
      hasCompleted,
      attendanceGood,
      projectsComplete
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <FiAward size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Certificate Applications</h1>
            <p className="text-amber-100 text-lg">Apply for and manage your course certificates</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white rounded-xl p-2 shadow-lg border border-gray-100">
        <button
          onClick={() => setActiveTab("apply")}
          className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === "apply"
              ? "bg-blue-500 text-white shadow-md"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          Apply for Certificate
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`flex-1 md:flex-none px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeTab === "applications"
              ? "bg-blue-500 text-white shadow-md"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          }`}
        >
          My Applications ({applications.length})
        </button>
      </div>

      {/* Apply Tab */}
      {activeTab === "apply" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* Application Form */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-6">New Certificate Application</h3>
            
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiUser className="text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Full Name</p>
                    <p className="text-gray-900">{user?.name || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiMail className="text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email Address</p>
                    <p className="text-gray-900">{user?.email || "Not provided"}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <FiPhone className="text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone Number</p>
                    <p className="text-gray-900">{user?.mobileNumber || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-500">Application Date</p>
                    <p className="text-gray-900">{new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Course Selection */}
            <div className="space-y-4 mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Select Course
              </label>
              <div className="space-y-3">
                {enrolledCourses.length > 0 ? (
                  enrolledCourses.map((payment: any) => {
                    const eligibility = checkEligibility(payment.course);
                    return (
                      <motion.div
                        key={payment._id}
                        whileHover={{ scale: 1.01 }}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          selectedCourse === payment._id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        } ${!eligibility.eligible && "opacity-60"}`}
                        onClick={() => eligibility.eligible && setSelectedCourse(payment._id)}
                      >
                        <div className="flex items-start gap-4">
                          <div className="relative h-16 w-16 rounded-lg overflow-hidden">
                            <Image
                              src={payment.course?.photoUrl || "/default-course.jpg"}
                              alt={payment.course?.title || "Course"}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900">
                                  {payment.course?.title || "Unknown Course"}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  Completed: {new Date(payment.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              {eligibility.eligible ? (
                                <Badge className="bg-green-100 text-green-800">Eligible</Badge>
                              ) : (
                                <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
                                  Not Eligible
                                </Badge>
                              )}
                            </div>
                            {!eligibility.eligible && (
                              <div className="mt-2 text-sm text-red-600">
                                <p>Requirements not met. Please contact support for details.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FiBook size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No completed courses found. Complete a course to apply for a certificate.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Certificate Type */}
            <div className="space-y-4 mb-6">
              <label className="block text-sm font-medium text-gray-700">
                Certificate Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    certificateType === "completion"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setCertificateType("completion")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      certificateType === "completion" 
                        ? "border-blue-500 bg-blue-500" 
                        : "border-gray-300"
                    }`}>
                      {certificateType === "completion" && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Course Completion Certificate</h4>
                      <p className="text-sm text-gray-500">
                        For successfully completing all course requirements
                      </p>
                    </div>
                  </div>
                </div>
                <div
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    certificateType === "participation"
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setCertificateType("participation")}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      certificateType === "participation" 
                        ? "border-blue-500 bg-blue-500" 
                        : "border-gray-300"
                    }`}>
                      {certificateType === "participation" && (
                        <div className="w-full h-full rounded-full bg-white scale-50" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Participation Certificate</h4>
                      <p className="text-sm text-gray-500">
                        For attending and participating in the course
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button 
                onClick={handleSubmitApplication}
                disabled={!selectedCourse}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700"
              >
                Submit Application
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {applications.length > 0 ? (
            applications.map((application) => (
              <motion.div
                key={application.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-lg p-6 border border-gray-100"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{application.courseName}</h3>
                    <p className="text-gray-600">Course Code: {application.courseCode}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(application.status)}
                    <Badge className={getStatusColor(application.status)}>
                      {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Certificate Type</p>
                    <p className="font-semibold text-gray-900 capitalize">{application.certificateType}</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Submitted</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(application.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Completion</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(application.completionDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Application ID</p>
                    <p className="font-semibold text-gray-900 text-xs">#{application.id}</p>
                  </div>
                </div>

                {/* Requirements Progress */}
                <div className="space-y-4 mb-6">
                  <h4 className="font-semibold text-gray-800">Requirements Status</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Projects Completed</span>
                        <span>{application.requirements.projectsCompleted}/{application.requirements.requiredProjects}</span>
                      </div>
                      <Progress 
                        value={(application.requirements.projectsCompleted / application.requirements.requiredProjects) * 100} 
                        className="h-2"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Attendance</span>
                        <span>{application.requirements.attendancePercentage}% (Required: {application.requirements.requiredAttendance}%)</span>
                      </div>
                      <Progress 
                        value={application.requirements.attendancePercentage} 
                        className="h-2"
                      />
                    </div>

                    {application.requirements.finalExamScore && (
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Final Exam Score</span>
                          <span>{application.requirements.finalExamScore}% (Required: {application.requirements.requiredExamScore}%)</span>
                        </div>
                        <Progress 
                          value={application.requirements.finalExamScore} 
                          className="h-2"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  {application.status === "approved" && (
                    <Button className="gap-2">
                      <FiDownload size={16} />
                      Download Certificate
                    </Button>
                  )}
                  {application.status === "pending" && (
                    <Button variant="outline" disabled>
                      <FiClock size={16} className="mr-2" />
                      Under Review
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
              <FiAward size={64} className="mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No Applications Yet</h3>
              <p className="text-gray-600 mb-6">
                You haven't submitted any certificate applications yet.
              </p>
              <Button onClick={() => setActiveTab("apply")}>
                Apply for Your First Certificate
              </Button>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
