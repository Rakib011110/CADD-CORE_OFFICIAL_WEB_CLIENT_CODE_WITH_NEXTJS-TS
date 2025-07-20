"use client";

import { useDeleteusersMutation, useGetAllUsersQuery, useUpdateusersMutation } from "@/redux/api/userApi";
import { useState, useMemo } from "react";
import { motion } from "framer-motion"; // Importing Framer Motion for animations
import GoogleSheets from "@/redux/google/googleSheetData";

export default function ManageAllUsers() {
  const { data, isLoading, isError, refetch } = useGetAllUsersQuery({});
  const [deleteUser] = useDeleteusersMutation();
  const [updateUser] = useUpdateusersMutation();

  // Tab and filter states
  const [activeTab, setActiveTab] = useState<'all' | 'admin' | 'users'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'ACTIVE' | 'BLOCKED' | 'DELETED'>('all');
  const [emailVerifiedFilter, setEmailVerifiedFilter] = useState<'all' | 'verified' | 'unverified'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<{
    name: string;
    email: string;
    role: string;
    status: string;
    mobileNumber?: string;
    emailVerified?: boolean;
  }>({
    name: "",
    email: "",
    role: "USER", 
    status: "ACTIVE", 
    mobileNumber: "",
    emailVerified: false,
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
      emailVerified: user.emailVerified || false,
    });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const finalValue = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setEditFormData((prev) => ({ ...prev, [name]: finalValue }));
  };

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUserId) {
      await updateUser({ id: editingUserId, usersData: editFormData });
      setEditingUserId(null);
      refetch();
    }
  };

  // Filter and pagination logic
  const filteredUsers = useMemo(() => {
    if (!data?.data) return [];
    
    let filtered = data.data.filter((user: any) => {
      // Tab filter
      if (activeTab === 'admin' && user.role !== 'ADMIN') return false;
      if (activeTab === 'users' && user.role !== 'USER') return false;
      
      // Search filter
      if (searchTerm && !user.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !user.email.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      
      // Status filter
      if (statusFilter !== 'all' && user.status !== statusFilter) return false;
      
      // Email verification filter
      if (emailVerifiedFilter === 'verified' && !user.emailVerified) return false;
      if (emailVerifiedFilter === 'unverified' && user.emailVerified) return false;
      
      return true;
    });
    
    return filtered;
  }, [data?.data, activeTab, searchTerm, statusFilter, emailVerifiedFilter]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (filterType: string, value: any) => {
    setCurrentPage(1);
    if (filterType === 'tab') setActiveTab(value);
    if (filterType === 'search') setSearchTerm(value);
    if (filterType === 'status') setStatusFilter(value);
    if (filterType === 'emailVerified') setEmailVerifiedFilter(value);
  };

  const getTabCounts = () => {
    if (!data?.data) return { all: 0, admin: 0, users: 0 };
    
    const all = data.data.length;
    const admin = data.data.filter((user: any) => user.role === 'ADMIN').length;
    const users = data.data.filter((user: any) => user.role === 'USER').length;
    
    return { all, admin, users };
  };

  const tabCounts = getTabCounts();

  if (isLoading) return <div className="text-center py-10">Loading...</div>;
  if (isError) return <div className="text-center py-10 text-red-500">Failed to load users.</div>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Users</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 border-b">
        <button
          onClick={() => handleFilterChange('tab', 'all')}
          className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
            activeTab === 'all'
              ? 'bg-blue-500 text-white border-b-2 border-blue-500'
              : 'text-gray-600 hover:text-blue-500 hover:bg-gray-100'
          }`}
        >
          All Users ({tabCounts.all})
        </button>
        <button
          onClick={() => handleFilterChange('tab', 'admin')}
          className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
            activeTab === 'admin'
              ? 'bg-blue-500 text-white border-b-2 border-blue-500'
              : 'text-gray-600 hover:text-blue-500 hover:bg-gray-100'
          }`}
        >
          Admins ({tabCounts.admin})
        </button>
        <button
          onClick={() => handleFilterChange('tab', 'users')}
          className={`px-6 py-3 font-medium rounded-t-lg transition-colors ${
            activeTab === 'users'
              ? 'bg-blue-500 text-white border-b-2 border-blue-500'
              : 'text-gray-600 hover:text-blue-500 hover:bg-gray-100'
          }`}
        >
          Users ({tabCounts.users})
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Users</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="BLOCKED">Blocked</option>
              <option value="DELETED">Deleted</option>
            </select>
          </div>

          {/* Email Verification Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Verification</label>
            <select
              value={emailVerifiedFilter}
              onChange={(e) => handleFilterChange('emailVerified', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Users</option>
              <option value="verified">Verified Only</option>
              <option value="unverified">Unverified Only</option>
            </select>
          </div>

          {/* Items per page */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Items per page</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Results info */}
          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              Showing {startIndex + 1}-{Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
            </div>
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          {searchTerm || statusFilter !== 'all' || emailVerifiedFilter !== 'all' ? 'No users found matching your filters.' : 'No users found.'}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full border-separate border-spacing-0">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="py-3 px-4 text-center">Profile</th>
                  <th className="py-3 px-4 text-center">Name</th>
                  <th className="py-3 px-4 text-center">Email</th>
                  <th className="py-3 px-4 text-center">Email Verified</th>
                  <th className="py-3 px-4 text-center">Role</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Mobile</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user: any) => (
                  <motion.tr
                    key={user._id}
                    className="text-center border-b transition-all hover:bg-gray-100"
                    whileHover={{ scale: 1.00 }}
                    whileTap={{ scale: 0.98 }}
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
                    <td className="py-3 px-4 font-medium">{user.name}</td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.emailVerified 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.emailVerified ? 'Verified' : 'Not Verified'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'ADMIN' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.status === 'ACTIVE' 
                          ? 'bg-green-100 text-green-800' 
                          : user.status === 'BLOCKED'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{user.mobileNumber || "-"}</td>
                    <td className="py-3 px-4 space-x-2">
                      <button
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition-colors"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-between items-center mt-6 bg-white p-4 rounded-lg shadow-md">
              <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                Page {currentPage} of {totalPages}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  First
                </button>
                
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                
                {/* Page numbers */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNumber;
                  
                  if (totalPages <= 5) {
                    // If total pages is 5 or less, show all pages
                    pageNumber = i + 1;
                  } else {
                    // Calculate page number based on current page position
                    const startPage = Math.max(1, currentPage - 2);
                    const endPage = Math.min(totalPages, startPage + 4);
                    const adjustedStartPage = Math.max(1, endPage - 4);
                    pageNumber = adjustedStartPage + i;
                  }
                  
                  // Only render if pageNumber is valid and within range
                  if (pageNumber >= 1 && pageNumber <= totalPages) {
                    return (
                      <button
                        key={`page-${pageNumber}`}
                        onClick={() => setCurrentPage(pageNumber)}
                        className={`px-3 py-2 text-sm border rounded-md ${
                          currentPage === pageNumber
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  }
                  return null;
                }).filter(Boolean)}
                
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
                
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 text-sm border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Last
                </button>
              </div>
            </div>
          )}
        </>
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
              <div>
                <label className="block mb-1">Email Verified</label>
                <div className="flex items-center space-x-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="emailVerified"
                      checked={editFormData.emailVerified}
                      onChange={handleEditChange}
                      className="mr-2"
                    />
                    Email is verified
                  </label>
                </div>
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
    </div>
  );
}
