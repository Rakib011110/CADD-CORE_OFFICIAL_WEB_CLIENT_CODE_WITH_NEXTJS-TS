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
import { useUser } from "@/context/user.provider";

export default function Notifications({ iconClassName }: { iconClassName?: string }) {
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
              <Bell className={iconClassName || "w-5 h-5 text-white"} />
              <span className="absolute -top-1.5 -right-1.5 bg-amber-400 text-zinc-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow">
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
