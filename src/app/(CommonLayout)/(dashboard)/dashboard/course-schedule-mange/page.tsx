"use client";
import { useState } from "react";
import {
  useGetAllSchedulesQuery,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} from "@/redux/api/courseScheduleApi";
// No need for useGetAllCourseQuery if we only display course title, not select it
// import { useGetAllCourseQuery } from "@/redux/api/courseApi"; // Removed as per new requirements
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/UI/table";
import { Button } from "@/components/UI/button";
// Dialog, Input components removed as form is removed
// import { Input } from "@/components/UI/input";
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/UI/dialog";

// Helper for formatting date
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 10);
};

// Define types for schedule item for better type safety
interface ScheduleItem {
  _id: string;
  course: { _id: string; title: string } | string; // Can be object or just ID string
  batchNo: string;
  onlineStartDate: string;
  onlineFinishDate: string;
  onJobTrainingStart: string;
  certificationDate: string;
  freelancingSessionDate: string;
  internshipStartDate: string;
  experienceCertificateDate: string;
  startDate: string;
  endDate: string;
  time: string;
  days: string;
  mode: string;
}

// Only allow editing for date and batchNo fields
type EditableField =
  | "batchNo"
  | "onlineStartDate"
  | "onlineFinishDate"
  | "onJobTrainingStart"
  | "certificationDate"
  | "freelancingSessionDate"
  | "internshipStartDate"
  | "experienceCertificateDate";

export default function CourseScheduleManage() {
  const { data: scheduleData, isLoading, isError, error } = useGetAllSchedulesQuery({});
  const [updateSchedule] = useUpdateScheduleMutation();
  const [deleteSchedule] = useDeleteScheduleMutation();

  const [editingCell, setEditingCell] = useState<{ rowId: string; field: EditableField } | null>(null);
  const [cellValue, setCellValue] = useState<string>("");
  const [updatingCell, setUpdatingCell] = useState<{ rowId: string; field: EditableField } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);


  // Spreadsheet-like cell edit handlers
  const handleCellEdit = (rowId: string, field: EditableField, currentValue: string) => {
    setEditingCell({ rowId, field });
    setCellValue(currentValue);
  };

  const handleCellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCellValue(e.target.value);
  };

  const handleCellBlur = async (row: ScheduleItem, field: EditableField) => {
    // Only update if value has changed and it's a valid edit
    if (editingCell && editingCell.rowId === row._id && editingCell.field === field && cellValue !== (row[field] as string)) {
      setUpdatingCell({ rowId: row._id, field });
      try {
        let payload: Record<string, any> = { id: row._id };
        payload[field] = cellValue;
        await updateSchedule(payload).unwrap(); // Use unwrap to handle success/failure
      } catch (err) {
        console.error("Failed to update schedule:", err);
        // Optionally show a toast notification for error
      } finally {
        setUpdatingCell(null);
      }
    }
    setEditingCell(null);
  };

  const handleCellKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: ScheduleItem, field: EditableField) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur(); // Trigger blur to save
    } else if (e.key === "Escape") {
      setEditingCell(null); // Cancel editing
      // Optionally reset cellValue to original if needed
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this schedule? This action cannot be undone.")) {
      setDeletingId(id);
      try {
        await deleteSchedule(id).unwrap();
        // Optionally show a toast for success
      } catch (err) {
        console.error("Failed to delete schedule:", err);
        // Optionally show a toast notification for error
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg text-gray-600">
        Loading schedules...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600 text-lg">
        Error loading schedules. Please try again.
      </div>
    );
  }

  const schedules: ScheduleItem[] = scheduleData?.data || [];

  return (
    <div className="max-w-7xl mx-auto p-6 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center border-b-2 pb-4">
        Manage Course Schedules
      </h2>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
        <Table className="w-full text-sm text-left text-gray-500">
          <TableHeader className="bg-gray-50 text-xs text-gray-700 uppercase tracking-wider">
            <TableRow>
              <TableHead className="py-3 px-6 min-w-[180px]">Course Title</TableHead>
              <TableHead className="py-3 px-6 min-w-[100px]">Batch No</TableHead>
              <TableHead className="py-3 px-6 min-w-[130px]">Online Start</TableHead>
              <TableHead className="py-3 px-6 min-w-[130px]">Online Finish</TableHead>
              <TableHead className="py-3 px-6 min-w-[150px]">On-Job Training Start</TableHead>
              <TableHead className="py-3 px-6 min-w-[130px]">Certification Date</TableHead>
              <TableHead className="py-3 px-6 min-w-[150px]">Freelancing Session</TableHead>
              <TableHead className="py-3 px-6 min-w-[130px]">Internship Start</TableHead>
              <TableHead className="py-3 px-6 min-w-[170px]">Experience Certificate</TableHead>
              <TableHead className="py-3 px-6 min-w-[80px] text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedules.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8 text-gray-500 text-lg">
                  No course schedules found.
                </TableCell>
              </TableRow>
            ) : (
              schedules.map((item: ScheduleItem) => (
                <TableRow key={item._id} className="border-b hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                  {/* Course cell: just show title, not editable */}
                  <TableCell className="py-3 px-6 font-medium text-gray-900 whitespace-nowrap overflow-hidden text-ellipsis max-w-[180px]">
                    {typeof item.course === 'object' ? item.course.title : item.course}
                  </TableCell>

                  {/* Batch No - Editable */}
                  <TableCell
                    onClick={() => handleCellEdit(item._id, "batchNo", item.batchNo)}
                    className="py-3 px-6 cursor-pointer relative group"
                  >
                    {editingCell?.rowId === item._id && editingCell?.field === "batchNo" ? (
                      <input
                        type="text"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "batchNo")}
                        onKeyDown={e => handleCellKeyDown(e, item, "batchNo")}
                        autoFocus
                        className="w-full h-8 px-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="block min-w-[80px] hover:bg-gray-100 rounded-sm p-1 -m-1 transition-colors relative">
                        {item.batchNo}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "batchNo" && (
                          <span className="absolute top-1/2 right-1 -translate-y-1/2 text-xs text-blue-500 animate-pulse">
                            <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-blue-100 group-hover:bg-opacity-50 opacity-0 group-hover:opacity-100 text-blue-600 text-xs font-semibold rounded-sm transition-opacity duration-150">
                            Edit
                        </span>
                      </span>
                    )}
                  </TableCell>

                  {/* Online Start Date - Editable */}
                  <TableCell
                    onClick={() => handleCellEdit(item._id, "onlineStartDate", formatDate(item.onlineStartDate))}
                    className="py-3 px-6 cursor-pointer relative group"
                  >
                    {editingCell?.rowId === item._id && editingCell?.field === "onlineStartDate" ? (
                      <input
                        type="date"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "onlineStartDate")}
                        onKeyDown={e => handleCellKeyDown(e, item, "onlineStartDate")}
                        autoFocus
                        className="w-full h-8 px-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="block min-w-[100px] hover:bg-gray-100 rounded-sm p-1 -m-1 transition-colors relative">
                        {formatDate(item.onlineStartDate)}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "onlineStartDate" && (
                          <span className="absolute top-1/2 right-1 -translate-y-1/2 text-xs text-blue-500 animate-pulse">
                            <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-blue-100 group-hover:bg-opacity-50 opacity-0 group-hover:opacity-100 text-blue-600 text-xs font-semibold rounded-sm transition-opacity duration-150">
                            Edit
                        </span>
                      </span>
                    )}
                  </TableCell>

                  {/* Online Finish Date - Editable */}
                  <TableCell
                    onClick={() => handleCellEdit(item._id, "onlineFinishDate", formatDate(item.onlineFinishDate))}
                    className="py-3 px-6 cursor-pointer relative group"
                  >
                    {editingCell?.rowId === item._id && editingCell?.field === "onlineFinishDate" ? (
                      <input
                        type="date"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "onlineFinishDate")}
                        onKeyDown={e => handleCellKeyDown(e, item, "onlineFinishDate")}
                        autoFocus
                        className="w-full h-8 px-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="block min-w-[100px] hover:bg-gray-100 rounded-sm p-1 -m-1 transition-colors relative">
                        {formatDate(item.onlineFinishDate)}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "onlineFinishDate" && (
                          <span className="absolute top-1/2 right-1 -translate-y-1/2 text-xs text-blue-500 animate-pulse">
                            <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-blue-100 group-hover:bg-opacity-50 opacity-0 group-hover:opacity-100 text-blue-600 text-xs font-semibold rounded-sm transition-opacity duration-150">
                            Edit
                        </span>
                      </span>
                    )}
                  </TableCell>

                  {/* On-Job Training Start - Editable */}
                  <TableCell
                    onClick={() => handleCellEdit(item._id, "onJobTrainingStart", formatDate(item.onJobTrainingStart))}
                    className="py-3 px-6 cursor-pointer relative group"
                  >
                    {editingCell?.rowId === item._id && editingCell?.field === "onJobTrainingStart" ? (
                      <input
                        type="date"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "onJobTrainingStart")}
                        onKeyDown={e => handleCellKeyDown(e, item, "onJobTrainingStart")}
                        autoFocus
                        className="w-full h-8 px-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="block min-w-[120px] hover:bg-gray-100 rounded-sm p-1 -m-1 transition-colors relative">
                        {formatDate(item.onJobTrainingStart)}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "onJobTrainingStart" && (
                          <span className="absolute top-1/2 right-1 -translate-y-1/2 text-xs text-blue-500 animate-pulse">
                            <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-blue-100 group-hover:bg-opacity-50 opacity-0 group-hover:opacity-100 text-blue-600 text-xs font-semibold rounded-sm transition-opacity duration-150">
                            Edit
                        </span>
                      </span>
                    )}
                  </TableCell>

                  {/* Certification Date - Editable */}
                  <TableCell
                    onClick={() => handleCellEdit(item._id, "certificationDate", formatDate(item.certificationDate))}
                    className="py-3 px-6 cursor-pointer relative group"
                  >
                    {editingCell?.rowId === item._id && editingCell?.field === "certificationDate" ? (
                      <input
                        type="date"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "certificationDate")}
                        onKeyDown={e => handleCellKeyDown(e, item, "certificationDate")}
                        autoFocus
                        className="w-full h-8 px-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="block min-w-[100px] hover:bg-gray-100 rounded-sm p-1 -m-1 transition-colors relative">
                        {formatDate(item.certificationDate)}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "certificationDate" && (
                          <span className="absolute top-1/2 right-1 -translate-y-1/2 text-xs text-blue-500 animate-pulse">
                            <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-blue-100 group-hover:bg-opacity-50 opacity-0 group-hover:opacity-100 text-blue-600 text-xs font-semibold rounded-sm transition-opacity duration-150">
                            Edit
                        </span>
                      </span>
                    )}
                  </TableCell>

                  {/* Freelancing Session Date - Editable */}
                  <TableCell
                    onClick={() => handleCellEdit(item._id, "freelancingSessionDate", formatDate(item.freelancingSessionDate))}
                    className="py-3 px-6 cursor-pointer relative group"
                  >
                    {editingCell?.rowId === item._id && editingCell?.field === "freelancingSessionDate" ? (
                      <input
                        type="date"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "freelancingSessionDate")}
                        onKeyDown={e => handleCellKeyDown(e, item, "freelancingSessionDate")}
                        autoFocus
                        className="w-full h-8 px-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="block min-w-[120px] hover:bg-gray-100 rounded-sm p-1 -m-1 transition-colors relative">
                        {formatDate(item.freelancingSessionDate)}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "freelancingSessionDate" && (
                          <span className="absolute top-1/2 right-1 -translate-y-1/2 text-xs text-blue-500 animate-pulse">
                            <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-blue-100 group-hover:bg-opacity-50 opacity-0 group-hover:opacity-100 text-blue-600 text-xs font-semibold rounded-sm transition-opacity duration-150">
                            Edit
                        </span>
                      </span>
                    )}
                  </TableCell>

                  {/* Internship Start Date - Editable */}
                  <TableCell
                    onClick={() => handleCellEdit(item._id, "internshipStartDate", formatDate(item.internshipStartDate))}
                    className="py-3 px-6 cursor-pointer relative group"
                  >
                    {editingCell?.rowId === item._id && editingCell?.field === "internshipStartDate" ? (
                      <input
                        type="date"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "internshipStartDate")}
                        onKeyDown={e => handleCellKeyDown(e, item, "internshipStartDate")}
                        autoFocus
                        className="w-full h-8 px-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="block min-w-[100px] hover:bg-gray-100 rounded-sm p-1 -m-1 transition-colors relative">
                        {formatDate(item.internshipStartDate)}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "internshipStartDate" && (
                          <span className="absolute top-1/2 right-1 -translate-y-1/2 text-xs text-blue-500 animate-pulse">
                            <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-blue-100 group-hover:bg-opacity-50 opacity-0 group-hover:opacity-100 text-blue-600 text-xs font-semibold rounded-sm transition-opacity duration-150">
                            Edit
                        </span>
                      </span>
                    )}
                  </TableCell>

                  {/* Experience Certificate Date - Editable */}
                  <TableCell
                    onClick={() => handleCellEdit(item._id, "experienceCertificateDate", formatDate(item.experienceCertificateDate))}
                    className="py-3 px-6 cursor-pointer relative group"
                  >
                    {editingCell?.rowId === item._id && editingCell?.field === "experienceCertificateDate" ? (
                      <input
                        type="date"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "experienceCertificateDate")}
                        onKeyDown={e => handleCellKeyDown(e, item, "experienceCertificateDate")}
                        autoFocus
                        className="w-full h-8 px-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    ) : (
                      <span className="block min-w-[140px] hover:bg-gray-100 rounded-sm p-1 -m-1 transition-colors relative">
                        {formatDate(item.experienceCertificateDate)}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "experienceCertificateDate" && (
                          <span className="absolute top-1/2 right-1 -translate-y-1/2 text-xs text-blue-500 animate-pulse">
                            <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          </span>
                        )}
                        <span className="absolute inset-0 flex items-center justify-center bg-transparent group-hover:bg-blue-100 group-hover:bg-opacity-50 opacity-0 group-hover:opacity-100 text-blue-600 text-xs font-semibold rounded-sm transition-opacity duration-150">
                            Edit
                        </span>
                      </span>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3 px-6 text-center">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="flex items-center justify-center gap-1"
                    >
                      {deletingId === item._id ? (
                        <>
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011-1h4a1 1 0 110 2H8a1 1 0 01-1-1zm2 5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                          </svg>
                          Delete
                        </>
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="p-4 bg-gray-50 text-center text-sm text-gray-500">
          Click on a cell (Batch No or any Date field) to edit its value. Press <kbd className="bg-gray-200 px-1 py-0.5 rounded text-gray-700">Enter</kbd> or click away to save. Press <kbd className="bg-gray-200 px-1 py-0.5 rounded text-gray-700">Esc</kbd> to cancel editing.
        </div>
      </div>
    </div>
  );
}