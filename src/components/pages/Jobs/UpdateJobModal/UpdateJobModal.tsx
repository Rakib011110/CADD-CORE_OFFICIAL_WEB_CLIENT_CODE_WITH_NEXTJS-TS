"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Input } from "@/components/UI/input";
import { Button } from "@/components/UI/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useUpdateJobMutation } from "@/redux/api/jobsApi/jobAPi";

interface UpdateJobsProps {
  open: boolean;
  onClose: () => void;
  jobData: any;
  refetch: () => void;
}

export default function UpdateJobs({ open, onClose, jobData, refetch }: UpdateJobsProps) {
  const [formData, setFormData] = useState<any>({
    title: "",
    slug: "",
    type: "",
    category: "",
    duration: "",
    date: "",
    location: "",
    experience: "",
    about: "",
    qualifications: "",
    responsibilities: "",
    benefits: "",
  });

  const [updateJob, { isLoading }] = useUpdateJobMutation();

  useEffect(() => {
    if (jobData) {
      setFormData({
        ...jobData,
        qualifications: jobData.qualifications?.join(", ") || "",
        responsibilities: jobData.responsibilities?.join(", ") || "",
        benefits: jobData.benefits?.join(", ") || "",
      });
    }
  }, [jobData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      qualifications: formData.qualifications.split(",").map((s: string) => s.trim()),
      responsibilities: formData.responsibilities.split(",").map((s: string) => s.trim()),
      benefits: formData.benefits.split(",").map((s: string) => s.trim()),
    };
    try {
      await updateJob({ id: jobData._id, data: payload }).unwrap();
      toast.success("Job updated successfully");
      onClose();
      refetch();
    } catch {
      toast.error("Failed to update job");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Job</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-3">
          {[
            "title",
            "slug",
            "type",
            "category",
            "duration",
            "date",
            "location",
            "experience",
          ].map((field) => (
            <div key={field}>
              <label className="block text-sm capitalize mb-1">{field}</label>
              <Input
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                required={field === "title" || field === "slug"}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm mb-1">About</label>
            <textarea
              name="about"
              value={formData.about || ""}
              onChange={handleChange}
              className="w-full border rounded p-2 text-sm"
              rows={4}
            />
          </div>

          {["qualifications", "responsibilities", "benefits"].map((field) => (
            <div key={field}>
              <label className="block text-sm mb-1 capitalize">
                {field} (comma-separated)
              </label>
              <textarea
                name={field}
                value={formData[field] || ""}
                onChange={handleChange}
                className="w-full border rounded p-2 text-sm"
                rows={3}
              />
            </div>
          ))}

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Updating..." : "Update Job"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
