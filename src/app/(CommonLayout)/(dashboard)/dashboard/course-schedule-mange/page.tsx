"use client"
import { useState } from "react";
import {
  useGetAllSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} from "@/redux/api/courseScheduleApi";
import { useGetAllCourseQuery } from "@/redux/api/courseApi";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/UI/table";
import { Button } from "@/components/UI/button";
import { Input } from "@/components/UI/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/UI/dialog";

// Helper for formatting date
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toISOString().slice(0, 10);
};

export default function CourseScheduleManage() {
  const { data: scheduleData, isLoading } = useGetAllSchedulesQuery({});
  console.log("Schedule Data:", scheduleData);
  const { data: courseData, isLoading: courseLoading } = useGetAllCourseQuery({});
  const [createSchedule] = useCreateScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();
  const [deleteSchedule] = useDeleteScheduleMutation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [form, setForm] = useState<any>({
    course: "",
    batchNo: "",
    onlineStartDate: "",
    onlineFinishDate: "",
    onJobTrainingStart: "",
    certificationDate: "",
    freelancingSessionDate: "",
    internshipStartDate: "",
    experienceCertificateDate: "",
    startDate: "",
    endDate: "",
    time: "",
    days: "",
    mode: "",
  });

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

  const [editingCell, setEditingCell] = useState<{rowId: string; field: EditableField} | null>(null);
  const [cellValue, setCellValue] = useState<string>("");
  const [updatingCell, setUpdatingCell] = useState<{rowId: string; field: EditableField} | null>(null);

  const handleOpen = (item?: any) => {
    if (item) {
      setEditMode(true);
      setSelected(item);
      setForm({
        course: item.course?._id || item.course,
        batchNo: item.batchNo || "",
        onlineStartDate: formatDate(item.onlineStartDate),
        onlineFinishDate: formatDate(item.onlineFinishDate),
        onJobTrainingStart: formatDate(item.onJobTrainingStart),
        certificationDate: formatDate(item.certificationDate),
        freelancingSessionDate: formatDate(item.freelancingSessionDate),
        internshipStartDate: formatDate(item.internshipStartDate),
        experienceCertificateDate: formatDate(item.experienceCertificateDate),
        startDate: item.startDate || "",
        endDate: item.endDate || "",
        time: item.time || "",
        days: item.days || "",
        mode: item.mode || "",
      });
    } else {
      setEditMode(false);
      setSelected(null);
      setForm({
        course: "",
        batchNo: "",
        onlineStartDate: "",
        onlineFinishDate: "",
        onJobTrainingStart: "",
        certificationDate: "",
        freelancingSessionDate: "",
        internshipStartDate: "",
        experienceCertificateDate: "",
        startDate: "",
        endDate: "",
        time: "",
        days: "",
        mode: "",
      });
    }
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditMode(false);
    setSelected(null);
    setForm({
      course: "",
      batchNo: "",
      onlineStartDate: "",
      onlineFinishDate: "",
      onJobTrainingStart: "",
      certificationDate: "",
      freelancingSessionDate: "",
      internshipStartDate: "",
      experienceCertificateDate: "",
      startDate: "",
      endDate: "",
      time: "",
      days: "",
      mode: "",
    });
  };
  // Spreadsheet-like cell edit handlers
  const handleCellEdit = (rowId: string, field: EditableField, value: string) => {
    setEditingCell({ rowId, field });
    setCellValue(value || "");
  };

  const handleCellChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCellValue(e.target.value);
  };

  const handleCellBlur = async (row: any, field: EditableField) => {
    if (cellValue !== (row[field] || "")) {
      setUpdatingCell({ rowId: row._id, field });
      let payload: Record<string, any> = { id: row._id };
      payload[field] = cellValue;
      await updateSchedule(payload);
      setUpdatingCell(null);
    }
    setEditingCell(null);
  };

  const handleCellKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, row: any, field: EditableField) => {
    if (e.key === "Enter") {
      (e.target as HTMLInputElement).blur();
    } else if (e.key === "Escape") {
      setEditingCell(null);
    }
  };

  const handleChange = (e: any) => {
    setForm((prev: any) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (editMode && selected) {
      await updateSchedule({ id: selected._id, ...form });
    } else {
      await createSchedule(form);
    }
    handleClose();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      await deleteSchedule(id);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Course Schedules</h2>
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => handleOpen()}>Add Schedule</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editMode ? "Edit Schedule" : "Add Schedule"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Course</label>
                <select
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                >
                  <option value="">Select a course</option>
                  {courseData?.data?.map((c: any) => (
                    <option key={c._id} value={c._id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Start Date</label>
                  <Input type="date" name="startDate" value={form.startDate} onChange={handleChange} required />
                </div>
                <div>
                  <label className="block mb-1">End Date</label>
                  <Input type="date" name="endDate" value={form.endDate} onChange={handleChange} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1">Time</label>
                  <Input type="text" name="time" value={form.time} onChange={handleChange} placeholder="e.g. 6pm-8pm" required />
                </div>
                <div>
                  <label className="block mb-1">Days</label>
                  <Input type="text" name="days" value={form.days} onChange={handleChange} placeholder="e.g. Mon, Wed, Fri" required />
                </div>
              </div>
              <div>
                <label className="block mb-1">Mode</label>
                <Input type="text" name="mode" value={form.mode} onChange={handleChange} placeholder="Online/Offline" required />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                <Button type="submit">{editMode ? "Update" : "Create"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded shadow p-4 overflow-x-auto">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[180px]">Course</TableHead>
              <TableHead className="min-w-[100px]">Batch No</TableHead>
              <TableHead className="min-w-[130px]">Online Start</TableHead>
              <TableHead className="min-w-[130px]">Online Finish</TableHead>
              <TableHead className="min-w-[150px]">On-Job Training Start</TableHead>
              <TableHead className="min-w-[130px]">Certification Date</TableHead>
              <TableHead className="min-w-[150px]">Freelancing Session</TableHead>
              <TableHead className="min-w-[130px]">Internship Start</TableHead>
              <TableHead className="min-w-[170px]">Experience Certificate</TableHead>
              <TableHead className="min-w-[120px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center">Loading...</TableCell>
              </TableRow>
            ) : scheduleData?.data?.length ? (
              scheduleData.data.map((item: any) => (
                <TableRow key={item._id} className="hover:bg-gray-50">
                  {/* Course cell: just show title, not editable */}
                  <TableCell>
                    <span className="truncate block text-gray-900 font-medium">
                      {item.course?.title || item.course}
                    </span>
                  </TableCell>
                  {/* Batch No */}
                  <TableCell onClick={() => handleCellEdit(item._id, "batchNo", item.batchNo)} className="cursor-pointer">
                    {editingCell?.rowId === item._id && editingCell?.field === "batchNo" ? (
                      <input
                        type="text"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "batchNo")}
                        onKeyDown={e => handleCellKeyDown(e, item, "batchNo")}
                        autoFocus
                        className="w-full border rounded p-1"
                      />
                    ) : (
                      <span className="block">
                        {item.batchNo}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "batchNo" && (
                          <span className="ml-2 text-xs text-blue-500 animate-pulse">Saving...</span>
                        )}
                      </span>
                    )}
                  </TableCell>
                  {/* Online Start Date */}
                  <TableCell onClick={() => handleCellEdit(item._id, "onlineStartDate", formatDate(item.onlineStartDate))} className="cursor-pointer">
                    {editingCell?.rowId === item._id && editingCell?.field === "onlineStartDate" ? (
                      <input
                        type="date"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "onlineStartDate")}
                        onKeyDown={e => handleCellKeyDown(e, item, "onlineStartDate")}
                        autoFocus
                        className="w-full border rounded p-1"
                      />
                    ) : (
                      <span className="block">
                        {formatDate(item.onlineStartDate)}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "onlineStartDate" && (
                          <span className="ml-2 text-xs text-blue-500 animate-pulse">Saving...</span>
                        )}
                      </span>
                    )}
                  </TableCell>
                  {/* Online Finish Date */}
                  <TableCell onClick={() => handleCellEdit(item._id, "onlineFinishDate", formatDate(item.onlineFinishDate))} className="cursor-pointer">
                    {editingCell?.rowId === item._id && editingCell?.field === "onlineFinishDate" ? (
                      <input
                        type="date"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "onlineFinishDate")}
                        onKeyDown={e => handleCellKeyDown(e, item, "onlineFinishDate")}
                        autoFocus
                        className="w-full border rounded p-1"
                      />
                    ) : (
                      <span className="block">
                        {formatDate(item.onlineFinishDate)}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "onlineFinishDate" && (
                          <span className="ml-2 text-xs text-blue-500 animate-pulse">Saving...</span>
                        )}
                      </span>
                    )}
                  </TableCell>
                  {/* On-Job Training Start */}
                  <TableCell onClick={() => handleCellEdit(item._id, "onJobTrainingStart", formatDate(item.onJobTrainingStart))} className="cursor-pointer">
                    {editingCell?.rowId === item._id && editingCell?.field === "onJobTrainingStart" ? (
                      <input
                        type="date"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "onJobTrainingStart")}
                        onKeyDown={e => handleCellKeyDown(e, item, "onJobTrainingStart")}
                        autoFocus
                        className="w-full border rounded p-1"
                      />
                    ) : (
                      <span className="block">
                        {formatDate(item.onJobTrainingStart)}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "onJobTrainingStart" && (
                          <span className="ml-2 text-xs text-blue-500 animate-pulse">Saving...</span>
                        )}
                      </span>
                    )}
                  </TableCell>
                  {/* Certification Date */}
                  <TableCell onClick={() => handleCellEdit(item._id, "certificationDate", formatDate(item.certificationDate))} className="cursor-pointer">
                    {editingCell && editingCell.rowId === item._id && editingCell.field === "certificationDate" ? (
                      <input
                        type="date"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "certificationDate")}
                        onKeyDown={e => handleCellKeyDown(e, item, "certificationDate")}
                        autoFocus
                        className="w-full border rounded p-1"
                      />
                    ) : (
                      <span className="block">
                        {formatDate(item.certificationDate)}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "certificationDate" && (
                          <span className="ml-2 text-xs text-blue-500 animate-pulse">Saving...</span>
                        )}
                      </span>
                    )}
                  </TableCell>
                  {/* Freelancing Session Date */}
                  <TableCell onClick={() => handleCellEdit(item._id, "freelancingSessionDate", formatDate(item.freelancingSessionDate))} className="cursor-pointer">
                    {editingCell && editingCell.rowId === item._id && editingCell.field === "freelancingSessionDate" ? (
                      <input
                        type="date"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "freelancingSessionDate")}
                        onKeyDown={e => handleCellKeyDown(e, item, "freelancingSessionDate")}
                        autoFocus
                        className="w-full border rounded p-1"
                      />
                    ) : (
                      <span className="block">
                        {formatDate(item.freelancingSessionDate)}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "freelancingSessionDate" && (
                          <span className="ml-2 text-xs text-blue-500 animate-pulse">Saving...</span>
                        )}
                      </span>
                    )}
                  </TableCell>
                  {/* Internship Start Date */}
                  <TableCell onClick={() => handleCellEdit(item._id, "internshipStartDate", formatDate(item.internshipStartDate))} className="cursor-pointer">
                    {editingCell?.rowId === item._id && editingCell?.field === "internshipStartDate" ? (
                      <input
                        type="date"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "internshipStartDate")}
                        onKeyDown={e => handleCellKeyDown(e, item, "internshipStartDate")}
                        autoFocus
                        className="w-full border rounded p-1"
                      />
                    ) : (
                      <span className="block">
                        {formatDate(item.internshipStartDate)}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "internshipStartDate" && (
                          <span className="ml-2 text-xs text-blue-500 animate-pulse">Saving...</span>
                        )}
                      </span>
                    )}
                  </TableCell>
                  {/* Experience Certificate Date */}
                  <TableCell onClick={() => handleCellEdit(item._id, "experienceCertificateDate", formatDate(item.experienceCertificateDate))} className="cursor-pointer">
                    {editingCell?.rowId === item._id && editingCell?.field === "experienceCertificateDate" ? (
                      <input
                        type="date"
                        value={cellValue}
                        onChange={handleCellChange}
                        onBlur={() => handleCellBlur(item, "experienceCertificateDate")}
                        onKeyDown={e => handleCellKeyDown(e, item, "experienceCertificateDate")}
                        autoFocus
                        className="w-full border rounded p-1"
                      />
                    ) : (
                      <span className="block">
                        {formatDate(item.experienceCertificateDate)}
                        {updatingCell?.rowId === item._id && updatingCell?.field === "experienceCertificateDate" && (
                          <span className="ml-2 text-xs text-blue-500 animate-pulse">Saving...</span>
                        )}
                      </span>
                    )}
                  </TableCell>
                  {/* Actions */}
                  <TableCell>
                    {/* <Button size="sm" variant="outline" onClick={() => handleOpen(item)} className="mr-2">Edit</Button> */}
                    <Button size="sm" variant="destructive" onClick={() => handleDelete(item._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="text-center">No schedules found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="text-xs text-gray-400 mt-2">Click any cell to edit. Press Enter or click outside to save. Esc to cancel.</div>
      </div>
    </div>
  );
}