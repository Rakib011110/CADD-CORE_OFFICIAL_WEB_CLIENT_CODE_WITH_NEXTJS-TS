
"use client";

import { ReactNode, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  FiUser, 
  FiBookOpen, 
  FiAward, 
  FiBriefcase, 
  FiExternalLink,
  FiMenu,
  FiX,
  FiLogOut,
  FiHome
} from "react-icons/fi";
import { useUser } from "@/context/user.provider";
import { logout } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import Image from "next/image";

const profileRoutes = [
  {
    name: "Profile Overview",
    path: "/user-profile",
    icon: FiUser,
    description: "View and manage your profile information"
  },
  {
    name: "Apply for Certificate", 
    path: "/user-profile/apply-certificate",
    icon: FiAward,
    description: "Apply for course completion certificates"
  },
  {
    name: "My Enrolled Courses",
    path: "/user-profile/enrolled-courses", 
    icon: FiBookOpen,
    description: "Track your course progress and materials"
  },
  {
    name: "My Working Projects",
    path: "/user-profile/working-projects",
    icon: FiBriefcase,
    description: "Manage your ongoing projects and portfolio"
  },
  {
    name: "Learning Portal",
    path: "/user-profile/learning-portal",
    icon: FiExternalLink,
    description: "Access your course videos and materials"
  }
];

export default function UserProfileLayout({ children }: { children: ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { user, setIsLoading: setUserLoading } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setUserLoading(true);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg text-gray-950 hover:bg-red-50 transition-colors"
          >
            <FiMenu size={20} />
          </button>
          <h1 className="text-lg font-semibold text-gray-950">Profile</h1>
        </div>
        <Link href="/" className="p-2 rounded-lg text-gray-950 hover:bg-red-50 transition-colors">
          <FiHome size={20} />
        </Link>
      </div>

      <div className="flex">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <div className={`
          fixed lg:sticky top-0 left-0 h-screen w-80 bg-white shadow-xl lg:shadow-none border-r border-gray-200 z-50 flex flex-col
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-950">User Profile</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-red-50 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* User Info Card */}
            <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 rounded-full overflow-hidden border-2 border-white/20">
                  <Image
                    src={user?.profilePhoto || "https://placehold.co/48x48/EFEFEF/333333?text=User"}
                    alt={user?.name || "User"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white truncate">
                    {user?.name || "User"}
                  </h3>
                  <p className="text-red-100 text-sm truncate">
                    {user?.email || "No email"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <Badge variant="secondary" className="bg-white/20 text-white border-white/20 text-xs">
                  {user?.status || "ACTIVE"}
                </Badge>
                <Badge 
                  variant="secondary" 
                  className={`${
                    user?.emailVerified 
                      ? "bg-green-500/20 text-green-100 border-green-400/20" 
                      : "bg-yellow-500/20 text-yellow-100 border-yellow-400/20"
                  } text-xs`}
                >
                  {user?.emailVerified ? "Verified" : "Unverified"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="px-4 space-y-2">
              {profileRoutes.map((route) => {
                const isActive = pathname === route.path;
                const Icon = route.icon;
                
                return (
                  <Link key={route.path} href={route.path}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`
                        group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${isActive 
                          ? "bg-red-50 text-red-700 border border-red-200 shadow-sm" 
                          : "text-gray-950 hover:bg-gray-50 hover:text-red-600"
                        }
                      `}
                    >
                      <Icon 
                        size={20} 
                        className={`
                          transition-colors duration-200
                          ${isActive ? "text-red-600" : "text-gray-500 group-hover:text-red-500"}
                        `} 
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium truncate">{route.name}</h4>
                        <p className="text-xs text-gray-500 truncate">{route.description}</p>
                      </div>
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicator"
                          className="w-2 h-2 bg-red-600 rounded-full"
                        />
                      )}
                    </motion.div>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 space-y-2">
            <Link href="/">
              <Button variant="outline" className="w-full justify-start gap-2 border-gray-300 text-gray-950 hover:bg-red-50 hover:text-red-600 hover:border-red-300">
                <FiHome size={16} />
                Back to Home
              </Button>
            </Link>
            <Button 
              variant="ghost" 
              className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={handleLogout}
            >
              <FiLogOut size={16} />
              Logout
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-0 min-w-0">
          <div className="max-w-7xl mx-auto">
            {/* Desktop Header */}
            <div className="hidden lg:block bg-white border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-950">
                    {profileRoutes.find(route => route.path === pathname)?.name || "Profile"}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {profileRoutes.find(route => route.path === pathname)?.description || "Manage your profile and settings"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Link href="/">
                    <Button variant="outline" size="sm" className="gap-2 border-gray-300 text-gray-950 hover:bg-red-50 hover:text-red-600 hover:border-red-300">
                      <FiHome size={16} />
                      Home
                    </Button>
                  </Link>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    <FiLogOut size={16} />
                    Logout
                  </Button>
                </div>
              </div>
            </div>

            {/* Page Content */}
            <main className="p-4 lg:p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                {children}
              </motion.div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}