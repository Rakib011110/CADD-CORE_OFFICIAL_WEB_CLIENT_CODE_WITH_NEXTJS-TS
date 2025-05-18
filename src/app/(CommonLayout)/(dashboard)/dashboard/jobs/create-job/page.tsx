"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { Button } from "@/components/UI/button";
import { toast } from "sonner";
import { useCreateJobMutation } from "@/redux/api/jobsApi/jobAPi";

const categories = [
  "Web & IT",
  "Marketing",
  "Finance",
  "General Service",
  "Graphic & Creative",
  "Administration",
  "Engineering",
];

const CreateJobForm: React.FC = () => {
  const [createJob, { isLoading }] = useCreateJobMutation();

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    type: "",
    duration: "",
    date: "",
    category: "",
    location: "",
    vacancy:"",

    experience: "", 
    about: "",
    qualifications: "",
    responsibilities: "",
    benefits: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      qualifications: formData.qualifications.split(",").map((s) => s.trim()).filter(Boolean),
      responsibilities: formData.responsibilities.split(",").map((s) => s.trim()).filter(Boolean),
      benefits: formData.benefits.split(",").map((s) => s.trim()).filter(Boolean),
    };

    try {
      await createJob(payload).unwrap();
      toast.success("Job created successfully!");
      setFormData({
        title: "",
        slug: "",
        type: "",
        duration: "",
        date: "",
        category: "",
        location: "",    vacancy:"",

        experience: "",
        about: "",
        qualifications: "",
        responsibilities: "",
        benefits: "",
      });
    } catch (error: any) {
      toast.error(error.data?.message || "Failed to create job.");
    }
  };

  return (
    <motion.div
      className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-xl mt-10"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="text-3xl font-bold text-red-600 mb-8">🚀 Post a New Job</h2> 
      <form onSubmit={handleSubmit} className="space-y-5">
        {[
          { label: "Job Title", name: "title", type: "text" },
          { label: "Slug", name: "slug", type: "text", placeholder: "e.g. structural-designer-intern" },
          // { label: "Job Type", name: "type", type: "text", placeholder: "e.g. Internship, Full-time" },
          { label: "Duration", name: "duration", type: "text" },
          { label: "Date", name: "date", type: "date" },
          { label: "Location", name: "location", type: "text" },
          { label: "Vacancy", name: "vacancy", type: "text" },
          { label: "Experience", name: "experience", type: "text", placeholder: "e.g. Fresher" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
            <Input
              name={field.name}
              type={field.type}
              value={(formData as any)[field.name]}
              onChange={handleChange}
              placeholder={field.placeholder || field.label}
              required
            />
          </div>
        ))}
{/* Job Type Select Dropdown */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
  <select
    name="type"
    value={formData.type}
    onChange={handleChange}
    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
    required
  >
    <option value="">Select Job Type</option>
    <option value="Internship">Internship</option>
    <option value="Full time">Full time</option>
    <option value="Part time">Part time</option>
  </select>
</div>

        {/* Category Select Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* About Textarea */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">About the Job</label>
          <Textarea
            name="about"
            value={formData.about}
            onChange={handleChange}
            placeholder="Describe the job"
            rows={4}
            required
          />
        </div>

        {/* Comma separated fields */}
        {[
          { label: "Qualifications", name: "qualifications" },
          { label: "Responsibilities", name: "responsibilities" },
          { label: "Benefits", name: "benefits" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label} (comma separated)
            </label>
            <Input
              name={field.name}
              value={(formData as any)[field.name]}
              onChange={handleChange}
              placeholder={`${field.label} (e.g. item1, item2)`}
              required
            />
          </div>
        ))}

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-bold text-lg"
        >
          {isLoading ? "Submitting..." : "Submit Job"}
        </Button>
      </form>
    </motion.div>
  );
};

export default CreateJobForm;
