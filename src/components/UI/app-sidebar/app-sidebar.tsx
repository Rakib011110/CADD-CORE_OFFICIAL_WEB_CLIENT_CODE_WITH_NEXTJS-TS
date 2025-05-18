"use client";
import Link from "next/link"; // Correct import
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/UI/sidebar";
import Image from "next/image";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "/dashboard/inbox",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "/dashboard/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  return (
    <Sidebar className="w-64 !bg-gray-800 border border-red-600 h-11/12">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="p- text-lg font-bold w-full h-16 bg-red-500 20">
            <div className="">
              <Link href="/">
                <Image
                  width={150}
                  height={50}
                  src="https://cdn-ilbhfhh.nitrocdn.com/GQAjASDcQJAOSFnCNbjHAwgJDnuIafbo/assets/images/optimized/rev-f913869/caddcore.net/wp-content/uploads/2023/03/cropped-cadd-01.png"
                  alt="Logo"
                />
              </Link>
            </div>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="mt-20">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex  items-center gap-2 px-4 py-2 hover:bg-gray-700 transition">
                      <item.icon className="w-5 h-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
