"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/UI/table";
import { Button } from "@/components/UI/button";
import { toast } from "sonner";
import { Check } from "lucide-react";

import {
  useGetAllCertificatesQuery,
  useUpdateCertificateMutation,
} from "@/redux/api/certificatesApi";
import { useApproveApplicationMutation } from "@/redux/api/ceritificatesApplicationApi";
import { ICertificate } from "@/types";
import Link from "next/link";

type StatusFilter = "all" | "applied" | "approved" | "pending" | "issued";
type TimeFilter = "all" | "7days" | "30days" | "thisMonth";

export default function AdminCertificatePanels() {
  // — Search & filter state
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");

  // — Pagination state
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  // — Fetch data & mutations
  const {
    data: resp,
    isLoading,
    isError,
    refetch,
  } = useGetAllCertificatesQuery({});
  const apps: ICertificate[] = resp?.data || [];

  const [approveApp, { isLoading: approving }] =
    useApproveApplicationMutation();
  const [updateCert, { isLoading: issuing }] =
    useUpdateCertificateMutation();

  // — Track per-row issue date
  const [issueDates, setIssueDates] = useState<Record<string, string>>({});

  // — Approve handler
  async function onApprove(id: string) {
    try {
      await approveApp({ id }).unwrap();
      toast.success("Application approved!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Approve failed");
    }
  }
  // — Build filtered + sorted list
  const filtered = useMemo<ICertificate[]>(() => {
    const now = Date.now();
    return apps
      // search by ID / name
      .filter((a) => {
        if (!showSearch) return true;
        return (
          a.studentId.includes(searchTerm) ||
          a.studentName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      })
      // status filter
      .filter((a) =>
        statusFilter === "all" ? true : a.status === statusFilter
      )
      // time filter (based on appliedAt)
      .filter((a) => {
        if (timeFilter === "all") return true;
        const appliedAt = new Date(a.appliedAt!).getTime();
        const diff = now - appliedAt;
        if (timeFilter === "7days") {
          return diff <= 7 * 24 * 60 * 60 * 1000;
        }
        if (timeFilter === "30days") {
          return diff <= 30 * 24 * 60 * 60 * 1000;
        }
        if (timeFilter === "thisMonth") {
          const d = new Date(a.appliedAt!);
          const m0 = new Date(now);
          return (
            d.getMonth() === m0.getMonth() && d.getFullYear() === m0.getFullYear()
          );
        }
        return true;
      })
      // sort by status priority
      .sort((a, b) => {
        const order: Record<string, number> = {
          applied: 0,
          approved: 1,
          pending: 2,
          issued: 3,
        };
        return order[a.status] - order[b.status];
      });
  }, [apps, showSearch, searchTerm, statusFilter, timeFilter]);
  // — Issue handler
  async function onIssue(id: string) {
    const date = issueDates[id];
    if (!date) {
      toast.error("Please select an issue date");
      return;
    }
    try {
      await updateCert({
        id,
        data: { status: "issued", issueDate: new Date(date).toISOString() },
      }).unwrap();
      toast.success("Certificate issued!");
      refetch();
    } catch (err: any) {
      toast.error(err?.data?.message || "Issue failed");
    }
  }

  // — Loading / error UI
  if (isLoading) {
    return <div className="text-center py-10">Loading…</div>;
  }
  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error loading data
      </div>
    );
  }



  // — Pagination logic
  const total = filtered.length;
  const pages = Math.ceil(total / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header + Search Toggle */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold uppercase bg-red-500 p-2 rounded-md text-white">Certificate Applications</h1>
        <Button variant="outline" onClick={() => setShowSearch((s) => !s)}>
          {showSearch ? "Hide Search" : "Search by ID/Name"}
        </Button>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="mb-6 flex gap-2">
          <input
            type="text"
            placeholder="Student ID or Name…"
            className="border rounded px-3 py-2 flex-1"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={() => refetch()} disabled={!searchTerm}>
            Search
          </Button>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            className="border-2 rounded px-3 py-2 bg-white border-red-600"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as StatusFilter);
              setPage(1);
            }}
          >
            <option value="all">All</option>
            <option value="applied">Applied</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="issued">Issued</option>
          </select> 


          
        </div>
        <div> 
          <label className="block text-sm font-medium mb-1 ">Applied</label>
          <select
            className="border-2 rounded px-3 py-2 bg-white border-red-600"
            value={timeFilter}
            onChange={(e) => {
              setTimeFilter(e.target.value as TimeFilter);
              setPage(1);
            }}
          >
            <option value="all">All time</option>
            <option value="7days">Last 7 days</option>
            <option value="30days">Last 30 days</option>
            <option value="thisMonth">This month</option>
          </select>
        
        </div> 

        <div className="   ">
        <Button
          variant="outline"
          className=" mt-6 p-5 border-2 text-lg mb-6 bg-red-500 text-white font-bold border-red-600">
<Link href="/dashboard/manage-certificates">

Go Management

</Link>

          </Button>
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto bg-white rounded-lg border shadow-sm">
        <Table className="min-w-full text-sm">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead>Student ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-center">Approve</TableHead>
              <TableHead className="text-center">Issue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((app) => {
              const isIssued = app.status === "issued";
              const isApproved = app.status === "approved";
              return (
                <TableRow key={app._id} className="hover:bg-gray-50 transition">
                  <TableCell>{app.studentId}</TableCell>
                  <TableCell>{app.studentName}</TableCell>
                  <TableCell>{app.courseName?.slice(0, 30)}</TableCell>
                  <TableCell>
                    <span
                      className={`capitalize font-semibold ${
                        isIssued
                          ? "text-purple-600"
                          : isApproved
                          ? "text-green-600"
                          : "text-blue-600"
                      }`}
                    >
                      {app.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    {isIssued
                      ? new Date(app.issueDate!).toLocaleDateString()
                      : new Date(app.appliedAt!).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      size="sm"
                      className={`px-3 py-1 ${
                        isApproved || isIssued
                          ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                      onClick={() => onApprove(app._id)}
                      disabled={approving || isApproved || isIssued}
                    >
                      <Check size={16} />
                    </Button>
                  </TableCell>
                  <TableCell className="text-center">
                    {isApproved && !isIssued ? (
                      <div className="flex flex-col items-center gap-1">
                        <input
                          type="date"
                          className="border rounded px-1 py-1 text-xs"
                          value={issueDates[app._id] || ""}
                          onChange={(e) =>
                            setIssueDates((d) => ({
                              ...d,
                              [app._id]: e.target.value,
                            }))
                          }
                        />
                        <Button
                          size="sm"
                          className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1"
                          onClick={() => onIssue(app._id)}
                          disabled={issuing}
                        >
                          Issue
                        </Button>
                        <span className="text-xs text-gray-500">
                          Pick date…
                        </span>
                      </div>
                    ) : isIssued ? (
                      <span className="text-purple-600 font-medium">Issued</span>
                    ) : (
                      <span className="text-xs text-gray-400">—</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <span className="text-sm">
          Page {page} of {pages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPage((p) => Math.min(p + 1, pages))}
          disabled={page === pages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
