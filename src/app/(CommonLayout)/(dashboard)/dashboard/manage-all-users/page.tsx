"use client";

import { useDeleteusersMutation, useGetAllUsersQuery, useUpdateusersMutation } from "@/redux/api/userApi";
import { useState } from "react";
import { motion } from "framer-motion"; // Importing Framer Motion for animations
import GoogleSheets from "@/redux/google/googleSheetData";

export default function ManageAllUsers() {
  const { data, isLoading, isError, refetch } = useGetAllUsersQuery({});
  const [deleteUser] = useDeleteusersMutation();
  const [updateUser] = useUpdateusersMutation();

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    email: string;
    role: string;
    status: string;
    mobileNumber?: string;
  }>( {
    name: "",
    email: "",
    role: "USER", 
    status: "ACTIVE", 
    mobileNumber: "",
  });

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this user?")) {
      await deleteUser(id);
      refetch();
    }
  };

  const handleEditClick = (user: any) => {
    setEditingUserId(user._id);
    setEditFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      mobileNumber: user.mobileNumber || "",
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEditFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId) {
      await updateUser({ id: editingUserId, usersData: editFormData });
      setEditingUserId(null);
      refetch();
    }
  };

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Failed to load users.</div>;

  return (
    <div className="p-6 ">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Manage All Users</h1>

      {data?.length === 0 ? (
        <div className="text-center text-gray-500">No users found.</div>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full border-separate border-spacing-0">
            <thead className="bg-blue-500 text-white text-center">
              <tr>
                <th className="py-3 px-4 text-center ">Profile</th>
                <th className="py-3 px-4 text-center">Name</th>
                <th className="py-3 px-4 text-center">Email</th>
                <th className="py-3 px-4 text-center">Role</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Mobile</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.map((user: any) => (
                <motion.tr
                  key={user._id}
                  className="text-center border-b transition-all hover:bg-gray-100"
                  whileHover={{ scale: 1.00 }} // Hover animation
                  whileTap={{ scale: 0.98 }}  // Tap animation
                >
                  <td className="py-3 px-4">
                    {user.profilePhoto ? (
                      <img
                        src={user.profilePhoto}
                        alt={user.name}
                        className="w-10 h-10 rounded-full mx-auto"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-300 rounded-full mx-auto flex items-center justify-center text-xs">
                        N/A
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 capitalize">{user.role}</td>
                  <td className="py-3 px-4 capitalize">{user.status}</td>
                  <td className="py-3 px-4">{user.mobileNumber || "-"}</td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      onClick={() => handleEditClick(user)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      onClick={() => handleDelete(user._id)}
                    >
                      Delete
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editingUserId && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-8 rounded-lg shadow-lg w-96"
            initial={{ y: "-100vh" }}
            animate={{ y: 0 }}
            exit={{ y: "100vh" }}
          >
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit User</h2>
            <form onSubmit={handleUpdateSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={editFormData.email}
                  onChange={handleEditChange}
                  className="w-full border px-3 py-2 rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Role</label>
                <select
                  name="role"
                  value={editFormData.role}
                  onChange={handleEditChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="ADMIN">ADMIN</option>
                  <option value="USER">USER</option>
                  <option value="HR">HR</option>
                  <option value="MARKETING_TEAM">MARKETING TEAM</option>
                  <option value="CUSTOMER_SERVICE_TEAM">CUSTOMER SERVICE TEAM</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Status</label>
                <select
                  name="status"
                  value={editFormData.status}
                  onChange={handleEditChange}
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="BLOCKED">Blocked</option>
                  <option value="DELETED">Deleted</option>
                </select>
              </div>
              <div>
                <label className="block mb-1">Mobile Number</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={editFormData.mobileNumber}
                  onChange={handleEditChange}
                  className="w-full border px-3 py-2 rounded"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 rounded"
                  onClick={() => setEditingUserId(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                  Update
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )} 


      <div>

        
      </div>
    </div>
  );
}
