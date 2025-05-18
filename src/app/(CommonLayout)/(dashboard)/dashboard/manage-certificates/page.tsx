"use client";

import {
  useDeleteCertificatesMutation,
  useGetAllCertificatesQuery,
  useUpdateCertificateMutation,
} from "@/redux/api/certificatesApi";
import { useState } from "react";
import { ICertificate } from "@/types";

export default function ManageCertificate() {
  const { data: certificates, isLoading } = useGetAllCertificatesQuery({});
  const [deleteCertificate] = useDeleteCertificatesMutation();
  const [updateCertificate] = useUpdateCertificateMutation();

  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<ICertificate>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCertificates = certificates?.data?.filter((cert: ICertificate) =>
    cert.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) return <div className="p-6 text-center">Loading...</div>;

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure to delete this certificate?")) {
      await deleteCertificate(id);
    }
  };

  const handleEdit = (certificate: ICertificate) => {
    setEditId(certificate._id || certificate.certificateId || certificate.studentId);
    setFormData(certificate);
  };

  const handleUpdate = async () => {
    if (editId) {
      await updateCertificate({ id: editId, data: formData });
      setEditId(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold mb-6">Manage Certificates</h1>

      {/* 🔍 Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="সার্চ করুন Student ID বা Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2 p-2 border rounded shadow-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300 rounded shadow-sm text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3 border">Student ID</th>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Course</th>
              <th className="p-3 border">Issue Date</th>
              <th className="p-3 border">Instructor</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border">Comment</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCertificates?.map((cert: ICertificate & { _id: string }) => (
              <tr
                key={cert._id}
                className={`${
                  editId === cert._id ? "bg-yellow-50" : "hover:bg-gray-50"
                } border-b transition`}
              >
                {editId === cert._id ? (
                  <>
                    <td className="p-2 border">
                      <input
                        type="text"
                        className="w-full border p-1"
                        value={formData.studentId || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, studentId: e.target.value })
                        }
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        className="w-full border p-1"
                        value={formData.studentName || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, studentName: e.target.value })
                        }
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        className="w-full border p-1"
                        value={formData.courseName || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, courseName: e.target.value })
                        }
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="date"
                        className="w-full border p-1"
                        value={
                          formData.issueDate
                            ? new Date(formData.issueDate).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          setFormData({ ...formData, issueDate: e.target.value })
                        }
                      />
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        className="w-full border p-1"
                        value={formData.instructorName || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, instructorName: e.target.value })
                        }
                      />
                    </td>
                    <td className="p-2 border">
                      <select
                        className="w-full border p-1"
                        value={formData.status || ""}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            status: e.target.value as ICertificate["status"],
                          })
                        }
                      >
                        <option value="">Select</option>
                        <option value="pending">Pending</option>
                        <option value="issued">Issued</option>
                        <option value="revoked">Revoked</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="p-2 border">
                      <input
                        type="text"
                        className="w-full border p-1"
                        value={formData.comment || ""}
                        onChange={(e) =>
                          setFormData({ ...formData, comment: e.target.value })
                        }
                      />
                    </td>
                    <td className="p-2 border text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={handleUpdate}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditId(null)}
                          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="p-2 border">{cert?.studentId}</td>
                    <td className="p-2 border">{cert?.studentName}</td>
                    <td className="p-2 border">{cert?.courseName}</td>
                    <td className="p-2 border">
                      {new Date(cert?.issueDate).toDateString()}
                    </td>
                    <td className="p-2 border">{cert?.instructorName}</td>
                    <td className="p-2 border">{cert?.status}</td>
                    <td className="p-2 border">{cert?.comment}</td>
                    <td className="p-2 border text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleEdit(cert)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cert._id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
