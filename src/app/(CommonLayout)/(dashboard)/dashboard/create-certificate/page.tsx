"use client";

import { useState } from "react";
import { Button } from "@/components/UI/button";
import { useCreateCertificateMutation } from "@/redux/api/certificatesApi";

export default function CreateCertificates() {
  const [createCertificate, { isLoading }] = useCreateCertificateMutation();

  const [formData, setFormData] = useState({
    studentId: "",
    studentName: "",
    courseName: "",
    issueDate: "",
    instructorName: "",
    status: "pending",
    comment: "",
    photoUrl: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await createCertificate(formData).unwrap();
      setMessage("✅ Certificate created successfully!");
      setFormData({
        studentId: "",
        studentName: "",
        courseName: "",
        issueDate: "",
        instructorName: "",
        status: "pending",
        comment: "",
        photoUrl: "",
      });
    } catch (err: any) {
      setMessage("❌ Failed to create certificate.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Create Certificate</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          name="studentId"
          type="text"
          placeholder="Student ID"
          value={formData.studentId}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          name="studentName"
          type="text"
          placeholder="Student Name"
          value={formData.studentName}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          name="courseName"
          type="text"
          placeholder="Course Name"
          value={formData.courseName}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          name="issueDate"
          type="date"
          value={formData.issueDate}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />
        <input
          name="instructorName"
          type="text"
          placeholder="Instructor Name"
          value={formData.instructorName}
          onChange={handleChange}
          className="border p-2 w-full rounded"
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        > 
        
          <option value="pending">Pending</option>
          <option value="issued">Issued</option>
        
          <option value="revoked">Revoked</option>
        </select>

        <textarea
          name="comment"
          placeholder="Comment (optional)"
          value={formData.comment}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <input
          name="photoUrl"
          type="text"
          placeholder="Photo URL (optional)"
          value={formData.photoUrl}
          onChange={handleChange}
          className="border p-2 w-full rounded"
        />

        <Button type="submit" className="bg-green-600" disabled={isLoading}>
          {isLoading ? "Creating..." : "Create Certificate"}
        </Button>

        {message && <p className="text-sm mt-2 text-blue-600">{message}</p>}
      </form>
    </div>
  );
}
