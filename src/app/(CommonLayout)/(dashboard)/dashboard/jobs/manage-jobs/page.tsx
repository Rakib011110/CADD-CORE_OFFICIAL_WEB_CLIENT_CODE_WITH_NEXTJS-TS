"use client";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/UI/table";
import { Button } from "@/components/UI/button";
import { useState } from "react";
import { toast } from "sonner";
import { useDeleteJobMutation, useGetAllJobsQuery } from "@/redux/api/jobsApi/jobAPi";
import UpdateJobs from "@/components/pages/Jobs/UpdateJobModal/UpdateJobModal";
import LoadingSpinner from "@/components/UI/LoadingSpinner/LoadingSpinner";

export default function ManageJobs() {
  const { data, isLoading, refetch } = useGetAllJobsQuery(undefined);
  const [deleteJob] = useDeleteJobMutation();

  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteJob(id).unwrap();
      toast.success("Job deleted successfully");
      refetch();
    } catch {
      toast.error("Failed to delete job");
    }
  };

  const handleUpdateClick = (job: any) => {
    setSelectedJob(job);
    setUpdateModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-red-600">Manage Jobs</h1>
      
      <div className="border rounded-lg overflow-hidden shadow-lg">
        <Table className="min-w-full">
          <TableHeader className="bg-red-50">
            <TableRow>
              <TableHead className="px-6 py-4 text-left text-red-800 font-semibold">Title</TableHead>
              <TableHead className="px-6 py-4 text-left text-red-800 font-semibold">Category</TableHead>
              <TableHead className="px-6 py-4 text-left text-red-800 font-semibold">Deadline</TableHead>
              <TableHead className="px-6 py-4 text-left text-red-800 font-semibold">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="divide-y divide-gray-200">
            {data?.data?.map((job: any) => (
              <TableRow key={job._id} className="hover:bg-red-50 transition-colors">
                <TableCell className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {job.title}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {job.category}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap text-gray-600">
                  {job.date}
                </TableCell>
                <TableCell className="px-6 py-4 whitespace-nowrap space-x-3">
                  <Button 
                    variant="outline" 
                    onClick={() => handleUpdateClick(job)}
                    className="border-red-300 text-red-600 hover:bg-red-100 hover:text-red-700"
                  >
                    Update
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDelete(job._id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Update Modal */}
      <UpdateJobs
        open={updateModalOpen}
        onClose={() => setUpdateModalOpen(false)}
        jobData={selectedJob}
        refetch={refetch}
      />
    </div>
  );
}