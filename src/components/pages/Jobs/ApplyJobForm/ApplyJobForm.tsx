"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/UI/dialog";
import { Input } from "@/components/UI/input";
import { Textarea } from "@/components/UI/textarea";
import { Button } from "@/components/UI/button";
import { toast } from "sonner";
import { useApplyJobMutation } from "@/redux/api/jobsApi/jobApplicationApi";

// Enums (can be imported if stored separately)
const academicOptions = [
  "Diploma in Civil",
  "Diploma in Architecture",
  "Diploma in Mechanical",
  "Diploma in Electrical",
  "Diploma in Computer",
  "Bachelor of Architecture (B.Arch)",
  "Bachelor of Science in Civil Engineering",
  "Bachelor of Science in Mechanical Engineering",
  "Bachelor of Science in Electrical Engineering",
  "Bachelor of Science in Computer Engineering",
  "Master of Science in Engineering",
  "Bachelor of Business Administration (BBA)",
  "Master of Business Administration (MBA)",
  "Bachelor of Science in Architecture",
  "Bachelor of Science in Construction Management",
  "Bachelor of Science in Environmental Engineering",
  "Master of Science in Architecture",
  "Master of Science in Construction Management",
  "Master of Science in Civil Engineering",
  "Others",
];

const exprienceOptions = ["Beginner", "Intermediate", "Advanced", "Expert"];

const ApplyJobModal = ({
  open,
  onClose,
  jobId,
}: {
  open: boolean;
  onClose: () => void;
  jobId: string;
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    linkedin: "",
    resumeFile: null as File | null,
    academicQualifications: "",
    exprience: "",
    presentAddress: "",
    portfolio: "",
    whyHireYou: "",
    
    certifications: "",
    
    softSkills: "",
    hardSkills: "",
  });

  const [applyJob, { isLoading }] = useApplyJobMutation();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, files } = e.target as any;
    if (name === "resumeFile" && files) {
      setFormData((prev) => ({ ...prev, resumeFile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.resumeFile) {
      toast.error("Please upload your resume.");
      return;
    }

    const fileData = new FormData();
    fileData.append("file", formData.resumeFile);
    fileData.append("upload_preset", "CADDCOREWEB");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dbkwiwoll/raw/upload",
        {
          method: "POST",
          body: fileData,
        }
      );
      const cloudData = await res.json();
      const resumeLink = cloudData.secure_url;

      await applyJob({
        jobId,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        linkedin: formData.linkedin,
        resumeLink,
        academicQualifications: formData.academicQualifications,
        exprience: formData.exprience,
        presentAddress: formData.presentAddress,
        portfolio: formData.portfolio,
        whyHireYou: formData.whyHireYou,
        certifications: formData.certifications.split(",").map((s) => s.trim()),
        softSkills: formData.softSkills.split(",").map((s) => s.trim()),
        hardSkills: formData.hardSkills.split(",").map((s) => s.trim()),
      }).unwrap();

      toast.success("Application submitted successfully!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        linkedin: "",
        resumeFile: null,
        academicQualifications: "",
        exprience: "",
        presentAddress: "",
        portfolio: "",
        whyHireYou: "",
        certifications: "",
        softSkills: "",
        hardSkills: "",
      });
      onClose();
    } catch (error) {
      toast.error("Failed to submit application.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-red-500">Apply for this Job</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <Input name="email" type="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
          <Input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
          <Input name="linkedin" placeholder="LinkedIn Profile URL" value={formData.linkedin} onChange={handleChange} />
        
        
          <select name="academicQualifications" value={formData.academicQualifications} onChange={handleChange} required className="w-full border rounded-md p-2">  
            
            <option value="">Select Academic Qualification</option>
            {academicOptions.map((option, idx) => (
              <option key={idx} value={option}>{option}</option>
            ))}
          </select>

          <select name="exprience" value={formData.exprience} onChange={handleChange} required className="w-full border rounded-md p-2">
            <option value="">Select Experience Level</option>
            {exprienceOptions.map((lvl, idx) => (
              <option key={idx} value={lvl}>{lvl}</option>
            ))}
          </select>

          <Input name="presentAddress" placeholder="Present Address" value={formData.presentAddress} onChange={handleChange} />
          <Input name="portfolio" placeholder="Portfolio URL" value={formData.portfolio} onChange={handleChange} />
          <Textarea name="whyHireYou" placeholder="Why should we hire you?" value={formData.whyHireYou} onChange={handleChange} />

          <Input name="certifications" placeholder="Certifications (comma separated)" value={formData.certifications} onChange={handleChange} />
          <Input name="softSkills" placeholder="Soft Skills (comma separated)" value={formData.softSkills} onChange={handleChange} />
          <Input name="hardSkills" placeholder="Hard Skills (comma separated)" value={formData.hardSkills} onChange={handleChange} />

          <Input type="file" name="resumeFile" accept=".pdf,.doc,.docx" onChange={handleChange} required />

          <Button type="submit" className="w-full bg-red-500 hover:bg-red-600 text-white" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ApplyJobModal;
