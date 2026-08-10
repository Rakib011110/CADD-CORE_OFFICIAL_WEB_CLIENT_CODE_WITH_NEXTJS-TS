"use client";

import { useState } from "react";
import {
  useGetAllSchedulesQuery,
  useCreateScheduleMutation,
  useUpdateScheduleMutation,
  useDeleteScheduleMutation,
} from "@/redux/api/courseScheduleApi";
import { useGetAllCourseQuery } from "@/redux/api/courseApi";
import { format, parseISO, isValid } from "date-fns";
import {
  Calendar,
  Edit3,
  Trash2,
  Search,
  LayoutGrid,
  List,
  GraduationCap,
  Laptop,
  Briefcase,
  Award,
  Building2,
  CheckCircle2,
  Save,
  Clock,
  Sparkles,
  Layers,
  ChevronRight,
  Plus,
} from "lucide-react";
import { Button } from "@/components/UI/button";
import { Badge } from "@/components/UI/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/UI/dialog";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/UI/table";

// Helper for formatting dates cleanly
const formatPrettyDate = (dateStr: string) => {
  if (!dateStr) return "Not set";
  try {
    const parsed = new Date(dateStr);
    if (!isValid(parsed)) return dateStr;
    return format(parsed, "MMM dd, yyyy");
  } catch {
    return dateStr;
  }
};

// Format date to YYYY-MM-DD for standard HTML input[type="date"]
const formatInputDate = (dateStr: string) => {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    if (!isValid(d)) return "";
    return d.toISOString().slice(0, 10);
  } catch {
    return "";
  }
};

interface ScheduleItem {
  _id: string;
  course: { _id: string; title: string } | string;
  batchNo: string;
  onlineStartDate: string;
  onlineFinishDate: string;
  onJobTrainingStart: string;
  certificationDate: string;
  freelancingSessionDate: string;
  internshipStartDate: string;
  experienceCertificateDate: string;
  startDate?: string;
  endDate?: string;
  time?: string;
  days?: string;
  mode?: string;
}

export default function CourseScheduleManage() {
  const { data: scheduleData, isLoading, isError } = useGetAllSchedulesQuery({});
  const { data: allCoursesData } = useGetAllCourseQuery({});
  const [createSchedule] = useCreateScheduleMutation();
  const [updateSchedule] = useUpdateScheduleMutation();
  const [deleteSchedule] = useDeleteScheduleMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Add New Schedule Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    course: "",
    batchNo: "",
    onlineStartDate: "",
    onlineFinishDate: "",
    onJobTrainingStart: "",
    certificationDate: "",
    freelancingSessionDate: "",
    internshipStartDate: "",
    experienceCertificateDate: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  // Edit Modal State
  const [selectedItemForEdit, setSelectedItemForEdit] = useState<ScheduleItem | null>(null);
  const [formData, setFormData] = useState({
    batchNo: "",
    onlineStartDate: "",
    onlineFinishDate: "",
    onJobTrainingStart: "",
    certificationDate: "",
    freelancingSessionDate: "",
    internshipStartDate: "",
    experienceCertificateDate: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createFormData.course) {
      showToast("Please select a course!");
      return;
    }
    setIsCreating(true);
    try {
      await createSchedule(createFormData).unwrap();
      showToast("New Course Schedule created successfully!");
      setIsAddModalOpen(false);
      setCreateFormData({
        course: "",
        batchNo: "",
        onlineStartDate: "",
        onlineFinishDate: "",
        onJobTrainingStart: "",
        certificationDate: "",
        freelancingSessionDate: "",
        internshipStartDate: "",
        experienceCertificateDate: "",
      });
    } catch (err) {
      console.error("Failed to create schedule:", err);
      showToast("Failed to create schedule. Please check all fields.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleOpenEditModal = (item: ScheduleItem) => {
    setSelectedItemForEdit(item);
    setFormData({
      batchNo: item.batchNo || "",
      onlineStartDate: formatInputDate(item.onlineStartDate),
      onlineFinishDate: formatInputDate(item.onlineFinishDate),
      onJobTrainingStart: formatInputDate(item.onJobTrainingStart),
      certificationDate: formatInputDate(item.certificationDate),
      freelancingSessionDate: formatInputDate(item.freelancingSessionDate),
      internshipStartDate: formatInputDate(item.internshipStartDate),
      experienceCertificateDate: formatInputDate(item.experienceCertificateDate),
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForEdit) return;
    setIsSubmitting(true);
    try {
      await updateSchedule({
        id: selectedItemForEdit._id,
        ...formData,
      }).unwrap();
      showToast("Schedule updated successfully!");
      setSelectedItemForEdit(null);
    } catch (err) {
      console.error("Failed to update schedule:", err);
      showToast("Failed to update schedule. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      setDeletingId(id);
      try {
        await deleteSchedule(id).unwrap();
        showToast("Schedule deleted successfully!");
      } catch (err) {
        console.error("Failed to delete schedule:", err);
        showToast("Failed to delete schedule.");
      } finally {
        setDeletingId(null);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[500px] flex flex-col justify-center items-center gap-3">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium animate-pulse">Loading Course Schedules...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-[400px] flex flex-col justify-center items-center text-center p-6 bg-red-50 rounded-2xl border border-red-200">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 mb-3">
          ⚠️
        </div>
        <h3 className="text-xl font-bold text-red-800 mb-1">Failed to load schedules</h3>
        <p className="text-red-600 text-sm">An error occurred while fetching the schedules. Please refresh or try again later.</p>
      </div>
    );
  }

  const schedules: ScheduleItem[] = scheduleData?.data || [];

  const filteredSchedules = schedules.filter((item) => {
    const title = typeof item.course === "object" ? item.course.title : item.course || "";
    const batch = item.batchNo || "";
    const query = searchTerm.toLowerCase();
    return title.toLowerCase().includes(query) || batch.toLowerCase().includes(query);
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-5 h-5 text-green-400" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold backdrop-blur-md border border-blue-400/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Admin Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Course Schedule & Batch Management
            </h1>
            <p className="text-blue-200/80 text-sm max-w-xl">
              Easily update batch numbers, start dates, and milestones for all active courses in real-time.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto">
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2 rounded-xl shadow-lg flex items-center gap-2 border border-blue-400/30"
            >
              <Plus className="w-4 h-4" />
              Add New Schedule
            </Button>
            <Badge variant="secondary" className="px-3 py-1.5 bg-white/20 text-white font-semibold text-xs border-0">
              Total Batches: {schedules.length}
            </Badge>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & View Toggle & Add Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-gray-200/80 shadow-sm">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by course title or batch..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50/50"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* View Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === "grid"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              Grid Cards
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                viewMode === "table"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Compact Table
            </button>
          </div>

          {/* Quick Add Button */}
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Schedule</span>
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      {filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-500">
          <Layers className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-lg font-semibold text-gray-700">No schedules found</p>
          <p className="text-sm text-gray-400 mt-1">
            {searchTerm ? `No results for "${searchTerm}"` : "There are no course schedules registered yet."}
          </p>
        </div>
      ) : viewMode === "grid" ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 gap-6">
          {filteredSchedules.map((item) => {
            const courseTitle = typeof item.course === "object" ? item.course.title : item.course;

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                {/* Card Top Header */}
                <div className="bg-gradient-to-r from-gray-50 via-white to-blue-50/30 p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2.5 bg-blue-100 text-blue-700 rounded-xl mt-0.5 shrink-0">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 leading-snug">
                        {courseTitle}
                      </h3>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          Batch #{item.batchNo || "N/A"}
                        </span>
                        <span className="text-xs text-gray-400">•</span>
                        <span className="text-xs text-gray-500 font-medium">7 Phase Schedule</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <Button
                      onClick={() => handleOpenEditModal(item)}
                      className="bg-blue-600 hover:bg-blue-700 text-white gap-2 font-semibold text-xs px-4 py-2 rounded-xl shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Edit Schedule & Dates
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 border-gray-200 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Timeline Milestones Grid */}
                <div className="p-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-500" />
                    Timeline & Key Dates
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                    {/* 1. Online Start */}
                    <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100/60 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-blue-700 font-medium text-xs mb-2">
                        <Laptop className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>Online Start</span>
                      </div>
                      <div className="text-xs font-bold text-gray-900 bg-white px-2.5 py-1.5 rounded-lg border border-blue-200 shadow-xs flex items-center justify-between">
                        <span>{formatPrettyDate(item.onlineStartDate)}</span>
                        <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      </div>
                    </div>

                    {/* 2. Online Finish */}
                    <div className="bg-indigo-50/50 rounded-xl p-3 border border-indigo-100/60 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-indigo-700 font-medium text-xs mb-2">
                        <Laptop className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                        <span>Online Finish</span>
                      </div>
                      <div className="text-xs font-bold text-gray-900 bg-white px-2.5 py-1.5 rounded-lg border border-indigo-200 shadow-xs flex items-center justify-between">
                        <span>{formatPrettyDate(item.onlineFinishDate)}</span>
                        <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      </div>
                    </div>

                    {/* 3. On Job Training */}
                    <div className="bg-red-50/50 rounded-xl p-3 border border-red-100/60 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-red-700 font-medium text-xs mb-2">
                        <Briefcase className="w-3.5 h-3.5 text-red-600 shrink-0" />
                        <span>On-Job Training</span>
                      </div>
                      <div className="text-xs font-bold text-gray-900 bg-white px-2.5 py-1.5 rounded-lg border border-red-200 shadow-xs flex items-center justify-between">
                        <span>{formatPrettyDate(item.onJobTrainingStart)}</span>
                        <Calendar className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      </div>
                    </div>

                    {/* 4. Certification */}
                    <div className="bg-amber-50/50 rounded-xl p-3 border border-amber-100/60 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-amber-700 font-medium text-xs mb-2">
                        <Award className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        <span>Certification</span>
                      </div>
                      <div className="text-xs font-bold text-gray-900 bg-white px-2.5 py-1.5 rounded-lg border border-amber-200 shadow-xs flex items-center justify-between">
                        <span>{formatPrettyDate(item.certificationDate)}</span>
                        <Calendar className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      </div>
                    </div>

                    {/* 5. Freelancing */}
                    <div className="bg-emerald-50/50 rounded-xl p-3 border border-emerald-100/60 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-medium text-xs mb-2">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Freelancing</span>
                      </div>
                      <div className="text-xs font-bold text-gray-900 bg-white px-2.5 py-1.5 rounded-lg border border-emerald-200 shadow-xs flex items-center justify-between">
                        <span>{formatPrettyDate(item.freelancingSessionDate)}</span>
                        <Calendar className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      </div>
                    </div>

                    {/* 6. Internship */}
                    <div className="bg-sky-50/50 rounded-xl p-3 border border-sky-100/60 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-sky-700 font-medium text-xs mb-2">
                        <Building2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span>Internship</span>
                      </div>
                      <div className="text-xs font-bold text-gray-900 bg-white px-2.5 py-1.5 rounded-lg border border-sky-200 shadow-xs flex items-center justify-between">
                        <span>{formatPrettyDate(item.internshipStartDate)}</span>
                        <Calendar className="w-3.5 h-3.5 text-sky-500 shrink-0" />
                      </div>
                    </div>

                    {/* 7. Experience Certificate */}
                    <div className="bg-purple-50/50 rounded-xl p-3 border border-purple-100/60 flex flex-col justify-between">
                      <div className="flex items-center gap-1.5 text-purple-700 font-medium text-xs mb-2">
                        <Award className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span>Exp. Certificate</span>
                      </div>
                      <div className="text-xs font-bold text-gray-900 bg-white px-2.5 py-1.5 rounded-lg border border-purple-200 shadow-xs flex items-center justify-between">
                        <span>{formatPrettyDate(item.experienceCertificateDate)}</span>
                        <Calendar className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="w-full text-xs">
              <TableHeader className="bg-gray-50 border-b border-gray-200">
                <TableRow>
                  <TableHead className="py-3.5 px-4 font-bold text-gray-700 min-w-[220px]">Course Title</TableHead>
                  <TableHead className="py-3.5 px-3 font-bold text-gray-700 min-w-[90px]">Batch No</TableHead>
                  <TableHead className="py-3.5 px-3 font-bold text-gray-700 min-w-[110px]">Online Start</TableHead>
                  <TableHead className="py-3.5 px-3 font-bold text-gray-700 min-w-[110px]">Online Finish</TableHead>
                  <TableHead className="py-3.5 px-3 font-bold text-gray-700 min-w-[120px]">On-Job Start</TableHead>
                  <TableHead className="py-3.5 px-3 font-bold text-gray-700 min-w-[110px]">Certification</TableHead>
                  <TableHead className="py-3.5 px-3 font-bold text-gray-700 min-w-[110px]">Freelancing</TableHead>
                  <TableHead className="py-3.5 px-3 font-bold text-gray-700 min-w-[110px]">Internship</TableHead>
                  <TableHead className="py-3.5 px-3 font-bold text-gray-700 min-w-[110px]">Exp. Cert</TableHead>
                  <TableHead className="py-3.5 px-4 font-bold text-gray-700 text-center min-w-[100px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSchedules.map((item) => {
                  const courseTitle = typeof item.course === "object" ? item.course.title : item.course;
                  return (
                    <TableRow key={item._id} className="hover:bg-blue-50/30 border-b border-gray-100 transition-colors">
                      <TableCell className="py-3 px-4 font-semibold text-gray-900">
                        {courseTitle}
                      </TableCell>
                      <TableCell className="py-3 px-3 font-mono font-medium text-blue-700">
                        #{item.batchNo || "N/A"}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-gray-700">
                        {formatPrettyDate(item.onlineStartDate)}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-gray-700">
                        {formatPrettyDate(item.onlineFinishDate)}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-gray-700">
                        {formatPrettyDate(item.onJobTrainingStart)}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-gray-700">
                        {formatPrettyDate(item.certificationDate)}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-gray-700">
                        {formatPrettyDate(item.freelancingSessionDate)}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-gray-700">
                        {formatPrettyDate(item.internshipStartDate)}
                      </TableCell>
                      <TableCell className="py-3 px-3 text-gray-700">
                        {formatPrettyDate(item.experienceCertificateDate)}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button
                            size="sm"
                            onClick={() => handleOpenEditModal(item)}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-[11px] px-2.5 py-1 rounded-md"
                          >
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(item._id)}
                            disabled={deletingId === item._id}
                            className="text-[11px] px-2.5 py-1 rounded-md"
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* EDIT SCHEDULE MODAL */}
      <Dialog open={!!selectedItemForEdit} onOpenChange={(open) => !open && setSelectedItemForEdit(null)}>
        <DialogContent className="max-w-2xl bg-white p-0 rounded-2xl overflow-hidden border-0 shadow-2xl">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-6 relative">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-300 border border-blue-400/30">
                <Edit3 className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  Edit Course Schedule & Batch
                </DialogTitle>
                <DialogDescription className="text-blue-200/80 text-xs mt-0.5">
                  {selectedItemForEdit &&
                    (typeof selectedItemForEdit.course === "object"
                      ? selectedItemForEdit.course.title
                      : selectedItemForEdit.course)}
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSaveSchedule} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Section 1: Batch Info */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                1. Batch Information
              </label>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Batch Number / ID
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2506048"
                    value={formData.batchNo}
                    onChange={(e) => handleInputChange("batchNo", e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Online Phase */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                <Laptop className="w-4 h-4" />
                2. Online Training Phase
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Online Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.onlineStartDate}
                    onChange={(e) => handleInputChange("onlineStartDate", e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Online Finish Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.onlineFinishDate}
                    onChange={(e) => handleInputChange("onlineFinishDate", e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Career & Certifications */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                3. Career & Milestone Dates
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    On-Job Training Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.onJobTrainingStart}
                    onChange={(e) => handleInputChange("onJobTrainingStart", e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Certification Release Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.certificationDate}
                    onChange={(e) => handleInputChange("certificationDate", e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Freelancing Session Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.freelancingSessionDate}
                    onChange={(e) => handleInputChange("freelancingSessionDate", e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Internship Start Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.internshipStartDate}
                    onChange={(e) => handleInputChange("internshipStartDate", e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Experience Certificate Date
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.experienceCertificateDate}
                    onChange={(e) => handleInputChange("experienceCertificateDate", e.target.value)}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setSelectedItemForEdit(null)}
                className="px-5 py-2 rounded-xl text-gray-700 border-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-md"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save All Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* ADD NEW SCHEDULE MODAL */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-2xl bg-white p-0 rounded-2xl overflow-hidden border-0 shadow-2xl">
          <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white p-6 relative">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/20 rounded-xl text-white border border-white/20">
                <Plus className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-xl font-bold text-white">
                  Add New Course Schedule
                </DialogTitle>
                <DialogDescription className="text-blue-200/80 text-xs mt-0.5">
                  Select a course, assign a batch number, and set all milestone dates.
                </DialogDescription>
              </div>
            </div>
          </div>

          <form onSubmit={handleCreateSchedule} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Course Selection & Batch No */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                1. Course & Batch Setup
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Select Course *
                  </label>
                  <select
                    required
                    value={createFormData.course}
                    onChange={(e) => setCreateFormData((prev) => ({ ...prev, course: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="">-- Choose Course --</option>
                    {(allCoursesData?.data || allCoursesData || []).map((c: any) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Batch Number / ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2506049"
                    value={createFormData.batchNo}
                    onChange={(e) => setCreateFormData((prev) => ({ ...prev, batchNo: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Online Phase */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                <Laptop className="w-4 h-4" />
                2. Online Training Phase
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Online Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={createFormData.onlineStartDate}
                    onChange={(e) => setCreateFormData((prev) => ({ ...prev, onlineStartDate: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Online Finish Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={createFormData.onlineFinishDate}
                    onChange={(e) => setCreateFormData((prev) => ({ ...prev, onlineFinishDate: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Career & Milestones */}
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" />
                3. Career & Milestone Dates
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    On-Job Training Start Date
                  </label>
                  <input
                    type="date"
                    value={createFormData.onJobTrainingStart}
                    onChange={(e) => setCreateFormData((prev) => ({ ...prev, onJobTrainingStart: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Certification Release Date
                  </label>
                  <input
                    type="date"
                    value={createFormData.certificationDate}
                    onChange={(e) => setCreateFormData((prev) => ({ ...prev, certificationDate: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Freelancing Session Date
                  </label>
                  <input
                    type="date"
                    value={createFormData.freelancingSessionDate}
                    onChange={(e) => setCreateFormData((prev) => ({ ...prev, freelancingSessionDate: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Internship Start Date
                  </label>
                  <input
                    type="date"
                    value={createFormData.internshipStartDate}
                    onChange={(e) => setCreateFormData((prev) => ({ ...prev, internshipStartDate: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Experience Certificate Date
                  </label>
                  <input
                    type="date"
                    value={createFormData.experienceCertificateDate}
                    onChange={(e) => setCreateFormData((prev) => ({ ...prev, experienceCertificateDate: e.target.value }))}
                    className="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-gray-100 flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2 rounded-xl text-gray-700 border-gray-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="px-6 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-md"
              >
                {isCreating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Schedule
                  </>
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}