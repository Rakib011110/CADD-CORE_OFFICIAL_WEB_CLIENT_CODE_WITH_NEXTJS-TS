"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FiExternalLink, 
  FiPlay, 
  FiBook, 
  FiDownload, 
  FiClock,
  FiUser,
  FiCalendar,
  FiStar,
  FiEye,
  FiLock,
  FiUnlock,
  FiFileText,
  FiVideo,
  FiHeadphones,
  FiImage,
  FiFile,
  FiSearch,
  FiFilter,
  FiMonitor,
  FiSmartphone,
  FiTablet
} from "react-icons/fi";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import { Progress } from "@/components/UI/progress";
import { useGetMeQuery } from "@/redux/api/userApi";
import { useGetMyPaymentsQuery } from "@/redux/api/payment/paymentApi";
import Image from "next/image";
import Link from "next/link";

type LearningMaterial = {
  id: string;
  title: string;
  type: "video" | "document" | "audio" | "image" | "software";
  duration?: string;
  size?: string;
  url: string;
  downloadUrl?: string;
  locked: boolean;
  completed: boolean;
  description?: string;
};

type CourseModule = {
  id: string;
  title: string;
  description: string;
  duration: string;
  materials: LearningMaterial[];
  locked: boolean;
  completed: boolean;
  completedMaterials: number;
  totalMaterials: number;
};

type LearningCourse = {
  id: string;
  title: string;
  instructor: string;
  thumbnailUrl: string;
  progress: number;
  totalDuration: string;
  enrolledDate: string;
  lastAccessed?: string;
  modules: CourseModule[];
  studentId?: string;
  password?: string;
  portalUrl: string;
  status: "active" | "completed" | "expired";
  certificateAvailable: boolean;
  rating?: number;
  studentsEnrolled: number;
};

const mockCourses: LearningCourse[] = [
  {
    id: "1",
    title: "AutoCAD 2D & 3D Complete Course",
    instructor: "Eng. John Smith",
    thumbnailUrl: "https://placehold.co/400x225/007ACC/FFFFFF?text=AutoCAD",
    progress: 75,
    totalDuration: "40 hours",
    enrolledDate: "2024-01-15",
    lastAccessed: "2024-01-28",
    studentId: "CADD001-2024",
    password: "AutoCAD@123",
    portalUrl: "https://engineeringitskills.com/autocad-course",
    status: "active",
    certificateAvailable: false,
    rating: 4.8,
    studentsEnrolled: 1250,
    modules: [
      {
        id: "1",
        title: "Introduction to AutoCAD",
        description: "Getting started with AutoCAD interface and basic tools",
        duration: "2h 30m",
        locked: false,
        completed: true,
        completedMaterials: 5,
        totalMaterials: 5,
        materials: [
          {
            id: "1",
            title: "Welcome to AutoCAD",
            type: "video",
            duration: "15 min",
            url: "#",
            locked: false,
            completed: true
          },
          {
            id: "2",
            title: "Interface Overview",
            type: "video",
            duration: "25 min",
            url: "#",
            locked: false,
            completed: true
          },
          {
            id: "3",
            title: "Basic Commands Cheat Sheet",
            type: "document",
            size: "2.5 MB",
            url: "#",
            downloadUrl: "#",
            locked: false,
            completed: true
          }
        ]
      },
      {
        id: "2",
        title: "2D Drawing Fundamentals",
        description: "Master the essential 2D drawing tools and techniques",
        duration: "4h 15m",
        locked: false,
        completed: true,
        completedMaterials: 8,
        totalMaterials: 8,
        materials: [
          {
            id: "4",
            title: "Drawing Lines and Shapes",
            type: "video",
            duration: "45 min",
            url: "#",
            locked: false,
            completed: true
          },
          {
            id: "5",
            title: "Precision Drawing Techniques",
            type: "video",
            duration: "35 min",
            url: "#",
            locked: false,
            completed: true
          }
        ]
      },
      {
        id: "3",
        title: "3D Modeling Basics",
        description: "Introduction to 3D modeling in AutoCAD",
        duration: "3h 45m",
        locked: false,
        completed: false,
        completedMaterials: 3,
        totalMaterials: 6,
        materials: [
          {
            id: "6",
            title: "3D Workspace Setup",
            type: "video",
            duration: "20 min",
            url: "#",
            locked: false,
            completed: true
          },
          {
            id: "7",
            title: "Basic 3D Primitives",
            type: "video",
            duration: "30 min",
            url: "#",
            locked: false,
            completed: false
          }
        ]
      },
      {
        id: "4",
        title: "Advanced 3D Techniques",
        description: "Advanced 3D modeling and editing techniques",
        duration: "5h 20m",
        locked: true,
        completed: false,
        completedMaterials: 0,
        totalMaterials: 10,
        materials: []
      }
    ]
  },
  {
    id: "2",
    title: "3ds Max Modeling & Rendering",
    instructor: "Eng. Sarah Johnson",
    thumbnailUrl: "https://placehold.co/400x225/FF6B35/FFFFFF?text=3ds+Max",
    progress: 100,
    totalDuration: "50 hours",
    enrolledDate: "2023-11-10",
    lastAccessed: "2024-01-20",
    studentId: "CADD002-2023",
    password: "3dsMax@456",
    portalUrl: "https://engineeringitskills.com/3dsmax-course",
    status: "completed",
    certificateAvailable: true,
    rating: 4.9,
    studentsEnrolled: 890,
    modules: [
      {
        id: "5",
        title: "3ds Max Interface",
        description: "Complete overview of 3ds Max interface and workflow",
        duration: "3h 00m",
        locked: false,
        completed: true,
        completedMaterials: 6,
        totalMaterials: 6,
        materials: []
      }
    ]
  }
];

export default function LearningPortal() {
  const [selectedCourse, setSelectedCourse] = useState<LearningCourse | null>(null);
  const [selectedModule, setSelectedModule] = useState<CourseModule | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<"all" | "video" | "document" | "audio">("all");

  const { data: userData } = useGetMeQuery({});
  const user = userData?.data;
  const userId = user?._id;
  const { data: paymentsData } = useGetMyPaymentsQuery(userId, { skip: !userId });

  // Use mock data for demonstration
  const courses = mockCourses;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return <FiVideo className="text-blue-500" />;
      case "document": return <FiFileText className="text-green-500" />;
      case "audio": return <FiHeadphones className="text-purple-500" />;
      case "image": return <FiImage className="text-orange-500" />;
      case "software": return <FiMonitor className="text-gray-500" />;
      default: return <FiFile className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredMaterials = selectedModule?.materials.filter(material => {
    const matchesSearch = material.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || material.type === filterType;
    return matchesSearch && matchesType;
  }) || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="bg-white/20 p-3 rounded-full">
            <FiExternalLink size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Learning Portal</h1>
            <p className="text-indigo-100 text-lg">Access your course materials and track your progress</p>
          </div>
        </div>

        {/* Portal Access Info */}
        <div className="bg-white/10 rounded-xl p-4 mt-6">
          <h3 className="font-semibold text-white mb-2">🎓 Portal Access Information</h3>
          <p className="text-indigo-100 text-sm mb-3">
            Your course credentials will be sent to your email before the course start date. 
            Use them to access the full learning portal with all course materials.
          </p>
          <div className="flex gap-3">
            <a href="https://engineeringitskills.com/" target="_blank" rel="noopener noreferrer">
              <Button className="bg-white text-indigo-600 hover:bg-indigo-50 gap-2">
                <FiExternalLink size={16} />
                Go to Full Portal
              </Button>
            </a>
            <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Contact Support
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Course Overview */}
      {!selectedCourse ? (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Courses</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {courses.filter(c => c.status === "active").length}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <FiBook className="text-green-600" size={24} />
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
                  <p className="text-sm font-medium text-gray-500">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {courses.filter(c => c.status === "completed").length}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <FiStar className="text-blue-600" size={24} />
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
                  <p className="text-sm font-medium text-gray-500">Watch Time</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {courses.reduce((acc, course) => acc + parseInt(course.totalDuration), 0)}h
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <FiClock className="text-purple-600" size={24} />
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
                  <p className="text-sm font-medium text-gray-500">Certificates</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {courses.filter(c => c.certificateAvailable).length}
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <FiDownload className="text-yellow-600" size={24} />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Courses List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800">Your Courses</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="relative h-48">
                    <Image
                      src={course.thumbnailUrl}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className={getStatusColor(course.status)}>
                        {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      {course.rating && (
                        <div className="bg-black/50 text-white px-2 py-1 rounded-lg flex items-center gap-1 text-sm">
                          <FiStar className="text-yellow-400 fill-current" size={14} />
                          <span>{course.rating}</span>
                        </div>
                      )}
                    </div>
                    {course.progress > 0 && course.progress < 100 && (
                      <div className="absolute bottom-4 left-4 right-4">
                        <Progress value={course.progress} className="h-2 bg-white/20" />
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{course.title}</h3>
                        <p className="text-gray-600 text-sm">{course.instructor}</p>
                      </div>
                    </div>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <FiClock size={14} />
                          <span>{course.totalDuration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FiUser size={14} />
                          <span>{course.studentsEnrolled} students</span>
                        </div>
                      </div>

                      {course.progress > 0 && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progress</span>
                            <span>{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>
                      )}

                      {course.lastAccessed && (
                        <p className="text-sm text-gray-500">
                          Last accessed: {new Date(course.lastAccessed).toLocaleDateString()}
                        </p>
                      )}
                    </div>

                    {/* Course Credentials */}
                    {course.studentId && course.password && (
                      <div className="bg-gray-50 rounded-lg p-4 mb-4">
                        <h4 className="font-semibold text-gray-800 mb-2">Portal Credentials</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Student ID:</span>
                            <span className="font-mono bg-white px-2 py-1 rounded">{course.studentId}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Password:</span>
                            <span className="font-mono bg-white px-2 py-1 rounded">{course.password}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setSelectedCourse(course)}
                        className="flex-1 gap-2"
                      >
                        <FiPlay size={16} />
                        {course.status === "completed" ? "Review Course" : "Continue Learning"}
                      </Button>
                      
                      <a href={course.portalUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="sm" className="gap-2">
                          <FiExternalLink size={14} />
                          Portal
                        </Button>
                      </a>

                      {course.certificateAvailable && (
                        <Button variant="outline" size="sm" className="gap-2">
                          <FiDownload size={14} />
                          Certificate
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Course Detail View */
        <div className="space-y-6">
          {/* Course Header */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={() => setSelectedCourse(null)}>
                  ← Back to Courses
                </Button>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedCourse.title}</h2>
                  <p className="text-gray-600">{selectedCourse.instructor}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={getStatusColor(selectedCourse.status)}>
                  {selectedCourse.status}
                </Badge>
                {selectedCourse.rating && (
                  <div className="flex items-center gap-1 text-sm">
                    <FiStar className="text-yellow-400 fill-current" />
                    <span>{selectedCourse.rating}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Overall Progress</span>
                    <span>{selectedCourse.progress}%</span>
                  </div>
                  <Progress value={selectedCourse.progress} className="h-3" />
                </div>
                
                <div className="flex gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <FiClock size={14} />
                    <span>{selectedCourse.totalDuration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar size={14} />
                    <span>Started {new Date(selectedCourse.enrolledDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <a href={selectedCourse.portalUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="gap-2">
                    <FiExternalLink size={16} />
                    Open Portal
                  </Button>
                </a>
                {selectedCourse.certificateAvailable && (
                  <Button variant="outline" className="gap-2">
                    <FiDownload size={16} />
                    Certificate
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Course Modules */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Modules List */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Course Modules</h3>
                <div className="space-y-3">
                  {selectedCourse.modules.map((module) => (
                    <motion.div
                      key={module.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedModule?.id === module.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      } ${module.locked && "opacity-60"}`}
                      onClick={() => !module.locked && setSelectedModule(module)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 flex items-center gap-2">
                          {module.locked ? <FiLock size={16} className="text-gray-400" /> : <FiUnlock size={16} className="text-green-500" />}
                          {module.title}
                        </h4>
                        {module.completed && <FiStar className="text-yellow-500 fill-current" size={16} />}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{module.duration}</span>
                        <span>{module.completedMaterials}/{module.totalMaterials} materials</span>
                      </div>
                      {!module.locked && (
                        <div className="mt-2">
                          <Progress 
                            value={(module.completedMaterials / module.totalMaterials) * 100} 
                            className="h-1"
                          />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Module Content */}
            <div className="lg:col-span-2">
              {selectedModule ? (
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{selectedModule.title}</h3>
                      <p className="text-gray-600">{selectedModule.description}</p>
                    </div>
                    <Badge className={selectedModule.completed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {selectedModule.completed ? "Completed" : "In Progress"}
                    </Badge>
                  </div>

                  {/* Material Filters */}
                  <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="relative flex-1">
                      <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search materials..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <select
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value as any)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="all">All Types</option>
                      <option value="video">Videos</option>
                      <option value="document">Documents</option>
                      <option value="audio">Audio</option>
                    </select>
                  </div>

                  {/* Materials List */}
                  <div className="space-y-3">
                    {filteredMaterials.map((material) => (
                      <motion.div
                        key={material.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`p-4 border rounded-lg ${
                          material.locked 
                            ? "bg-gray-50 border-gray-200 opacity-60" 
                            : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                        } transition-all`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getTypeIcon(material.type)}
                            <div>
                              <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                {material.title}
                                {material.completed && <FiEye className="text-green-500" size={16} />}
                                {material.locked && <FiLock className="text-gray-400" size={16} />}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                {material.duration && <span>{material.duration}</span>}
                                {material.size && <span>{material.size}</span>}
                                <span className="capitalize">{material.type}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            {!material.locked && (
                              <>
                                <Button size="sm" className="gap-2">
                                  <FiPlay size={14} />
                                  {material.type === "video" ? "Watch" : "Open"}
                                </Button>
                                {material.downloadUrl && (
                                  <Button size="sm" variant="outline" className="gap-2">
                                    <FiDownload size={14} />
                                    Download
                                  </Button>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {material.description && (
                          <p className="text-sm text-gray-600 mt-2">{material.description}</p>
                        )}
                      </motion.div>
                    ))}
                  </div>

                  {filteredMaterials.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <FiFile size={48} className="mx-auto mb-4 text-gray-300" />
                      <p>No materials found matching your search.</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center border border-gray-100">
                  <FiBook size={64} className="mx-auto mb-4 text-gray-300" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a Module</h3>
                  <p className="text-gray-600">
                    Choose a module from the left to view its learning materials.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Device Compatibility Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
          <FiMonitor className="text-blue-600" />
          Multi-Device Access
        </h3>
        <p className="text-blue-700 mb-3">
          Access your courses on any device. Your progress syncs automatically across all platforms.
        </p>
        <div className="flex gap-4 text-sm text-blue-600">
          <div className="flex items-center gap-1">
            <FiMonitor size={16} />
            <span>Desktop</span>
          </div>
          <div className="flex items-center gap-1">
            <FiTablet size={16} />
            <span>Tablet</span>
          </div>
          <div className="flex items-center gap-1">
            <FiSmartphone size={16} />
            <span>Mobile</span>
          </div>
        </div>
      </div>
    </div>
  );
}
