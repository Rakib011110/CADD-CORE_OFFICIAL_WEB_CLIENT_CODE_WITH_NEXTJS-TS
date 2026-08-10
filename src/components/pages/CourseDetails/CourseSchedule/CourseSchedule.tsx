"use client";

import { format } from "date-fns";
import { bn } from "date-fns/locale";
import { motion } from "framer-motion";

// Utility function to format dates in both English and Bangla
const formatDualDate = (dateString: string) => {
  if (!dateString) return { english: "TBD", bangla: "TBD", monthDayEng: "TBD", monthDayBn: "TBD" };
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return { english: "TBD", bangla: "TBD", monthDayEng: "TBD", monthDayBn: "TBD" };
  
  const formattedEng = format(date, "MMMM d, yyyy");
  const formattedBn = format(date, "MMMM d, yyyy", { locale: bn });
  return {
    english: format(date, "EEEE, MMMM d, yyyy"),
    bangla: format(date, "EEEE, MMMM d, yyyy", { locale: bn }),
    monthDayEng: formattedEng,
    monthDayBn: formattedBn,
  };
};

export default function CourseSchedule({ course }: { course: any }) {
  if (!course.courseSchedules || course.courseSchedules.length === 0) {
    return <div className="text-center py-8 text-gray-500"> </div>;
  }

  const schedule = course.courseSchedules[0];

  const milestones = [
    {
      title: "Online Training",
      date: schedule.onlineStartDate,
      endDate: schedule.onlineFinishDate,
      icon: "💻",
      duration: calculateDuration(
        schedule.onlineStartDate,
        schedule.onlineFinishDate
      ),
    },
    {
      title: "On Job Training",
      date: schedule.onJobTrainingStart,
      endDate: schedule.onJobTrainingEnd,
      icon: "👨‍💻",
      duration: calculateDuration(
        schedule.onJobTrainingStart,
        schedule.onJobTrainingEnd
      ),
    },
    {
      title: "Certification",
      date: schedule.certificationDate,
      icon: "📜",
    },
    {
      title: "Freelancing Session",
      date: schedule.freelancingSessionDate,
      icon: "💼",
    },
    {
      title: "Internship",
      date: schedule.internshipStartDate,
      icon: "🏢",
    },
    {
      title: "Experience Certificate",
      date: schedule.experienceCertificateDate,
      icon: "🏆",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 mb-10 bg-white rounded-xl border border-gray-100 shadow-sm">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-red-500">Current Batch Schedule</h3>
          <h2 className="text-2xl font-bold text-gray-900 mt-0.5">
            {course.title}
          </h2>
        </div>
        {schedule.batchNo && (
          <div className="bg-red-50 text-red-700 px-3.5 py-1.5 rounded-full text-xs font-bold border border-red-200 w-fit">
            Batch #{schedule.batchNo}
          </div>
        )}
      </motion.div>

      {/* Responsive Timeline */}
      <div className="relative overflow-x-auto pb-6">
        <div className="flex flex-wrap md:flex-nowrap justify-center md:space-x-12 gap-6">
          {milestones.map((milestone, index) => {
            const date = formatDualDate(milestone.date);
            const isLast = index === milestones.length - 1;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.15, duration: 0.4 }}
                className="relative border flex flex-col items-center text-center w-[135px] md:min-w-[135px] mx-auto p-3.5 rounded-xl bg-gradient-to-b from-red-50/80 to-white shadow-xs">
                {/* Connecting Line */}
                {!isLast && (
                  <div className="hidden md:block absolute top-5 left-20 w-[calc(100%+1.5rem)] h-1 bg-red-400 z-10" />
                )}

                {/* Icon */}
                <div className="relative z-30 w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl text-blue-700 border-2 border-red-500 shadow-md">
                  {milestone.icon}
                </div>

                {/* Date */}
                <div className="mt-3 bg-white px-2 py-1 rounded-md border border-gray-200/80 w-full shadow-2xs">
                  <p className="text-xs font-bold text-gray-900">
                    {date.monthDayEng}
                  </p>
                  <p className="text-[0.68rem] text-gray-500 font-medium">
                    {date.monthDayBn}
                  </p>
                </div>

                {/* Title */}
                <h3 className="mt-2 text-xs font-bold text-gray-800">
                  {milestone.title}
                </h3>

                {/* Optional Duration */}
                {milestone.duration && (
                  <p className="text-[0.65rem] text-blue-600 font-medium mt-1">
                    {milestone.duration}
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Phase Status */}
      {/* Phase Durations Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-10 p-6 rounded-2xl bg-gradient-to-br from-blue-50 via-white to-red-50 border border-blue-100 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-800">
          {/* Online Training */}
          <div className="flex items-center gap-4 bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <div className="text-2xl">🖥️</div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Online Training
              </p>
              <p className="text-gray-600">
                {calculateDuration(
                  schedule.onlineStartDate,
                  schedule.onlineFinishDate
                )}
              </p>
            </div>
          </div>

          {/* On Job Training */}
          <div className="flex items-center gap-4 bg-white rounded-xl shadow-md p-4 border-l-4 border-red-500">
            <div className="text-2xl">👨‍💻</div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                On Job Training
              </p>
              <p className="text-gray-600">30 Days</p>
            </div>
          </div>
          {/* On Internship Training */}
          <div className="flex items-center gap-4 bg-white rounded-xl shadow-md p-4 border-l-4 border-blue-500">
            <div className="text-2xl">👨‍💻</div>
            <div>
              <p className="text-sm font-semibold text-gray-700">
                {" "}
                Internship{" "}
              </p>
              <p className="text-gray-600">90 Days</p>
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 p-5 bg-gradient-to-r from-blue-100 to-red-100 rounded-xl text-blue-900 shadow-inner text-center">
          🎯 <strong>Stay focused!</strong> Completing all training phases will
          unlock your certification and real-world job readiness. Keep pushing
          forward 🚀
        </motion.div>
      </motion.div>
    </div>
  );
}

// Helper function to calculate duration between dates
function calculateDuration(start: string, end: string): string {
  if (!start || !end) return "";
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return `${diffDays} days (${Math.round(diffDays / 7)} weeks)`;
}
