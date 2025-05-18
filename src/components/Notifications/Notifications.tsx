"use client";

import Link from "next/link";
import { Bell } from "lucide-react";
import { useGetAllApplicationsQuery } from "@/redux/api/ceritificatesApplicationApi";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/UI/tooltip";

export default function Notifications() {
  const { data: response } = useGetAllApplicationsQuery();
  const applications = response?.data || [];

  // Filter only applications with 'applied' status
  const appliedApplications = applications.filter(
    (app: any) => app.status === "applied"
  );

  if (appliedApplications.length === 0) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link href="/dashboard/certificate-stutus">
            <div className="relative inline-block cursor-pointer">
              <Bell className="w-6 h-6 text-blue-600" />
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {appliedApplications.length}
              </span>
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="text-sm max-w-xs">
          <div className="space-y-1">
            {appliedApplications.map((app: any) => (
              <p key={app._id}>
                <span className="font-medium text-blue-700">{app.studentName}</span> applied for certificate
              </p>
            ))}
            <Link href="/dashboard/certificate-stutus" className="text-blue-600 underline text-sm block mt-2">
              Go to dashboard
            </Link>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
