import { CalendarClock } from "lucide-react";
import { TCourse, TCourseBatch, TPaymentPlan } from "@/lib/courses";
import CourseSection from "./CourseSection";
import {
  MODE_LABEL,
  batchDateText,
  batchStatusText,
  formatShortDateBn,
  plansForBatch,
  priceSummary,
  taka,
} from "../courseUtils";

type Props = {
  course: TCourse;
  batches: TCourseBatch[];
  plans: TPaymentPlan[];
  selectedBatch: TCourseBatch | null;
  onSelectBatch: (batch: TCourseBatch) => void;
};

function Journey({ batch }: { batch: TCourseBatch }) {
  const steps = [
    { label: "ক্লাস শুরু", date: batch.startDate },
    { label: "অন-জব ট্রেইনিং", date: batch.onJobTrainingStart },
    { label: "সার্টিফিকেশন", date: batch.certificationDate },
    { label: "ইন্টার্নশিপ", date: batch.internshipStartDate },
  ].filter((s) => s.date);
  if (steps.length < 2) return null;
  return (
    <div className="mt-5">
      <p className="mb-3 text-sm font-semibold text-zinc-900">আপনার শেখার যাত্রা ({MODE_LABEL[batch.mode]} ব্যাচ)</p>
      <ol className="grid grid-cols-2 gap-y-4 sm:grid-cols-4">
        {steps.map((s, i) => (
          <li key={s.label} className="relative pr-3 pt-5">
            <span className="absolute left-0 top-0 h-3 w-3 rounded-full bg-red-600 ring-4 ring-red-50" />
            {i < steps.length - 1 ? (
              <span className="absolute left-4 right-1 top-1.5 hidden h-px bg-zinc-200 sm:block" />
            ) : null}
            <span className="block text-sm font-semibold text-zinc-900">{formatShortDateBn(s.date)}</span>
            <span className="text-xs text-zinc-500">{s.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default function BatchesSection({ course, batches, plans, selectedBatch, onSelectBatch }: Props) {
  return (
    <CourseSection
      id="batches"
      title="ব্যাচ ও কোর্স ফি"
      subtitle="আপনার সুবিধামতো ব্যাচ বেছে নিন। ফি একসাথে সম্পূর্ণ পেমেন্টের হিসেবে দেখানো হয়েছে।">
      {batches.length ? (
        <div className="divide-y divide-zinc-200 overflow-hidden rounded-2xl border border-zinc-200 bg-white">
          {batches.map((b) => {
            const { best } = priceSummary(b.fee, plansForBatch(b, plans));
            const active = b._id === selectedBatch?._id;
            const full = b.status === "full";
            return (
              <div
                key={b._id}
                className={`grid grid-cols-2 items-center gap-x-4 gap-y-2 px-4 py-3.5 sm:grid-cols-[1.1fr_1.5fr_1fr_auto] ${
                  active ? "bg-red-50/60" : "bg-white"
                }`}>
                <div className="min-w-0">
                  <span className="text-sm font-semibold text-zinc-900">{MODE_LABEL[b.mode]}</span>
                  <span className={`block text-xs ${b.status === "running" ? "text-emerald-700" : full ? "text-zinc-400" : "text-red-600"}`}>
                    {batchStatusText(b)}
                  </span>
                </div>
                <div className="min-w-0 text-sm">
                  <span className="block font-medium text-zinc-800">{batchDateText(b)}</span>
                  <span className="block truncate text-xs text-zinc-500">
                    {[b.classDays, b.classTime].filter(Boolean).join(" · ") || " "}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="block font-semibold text-zinc-900">{taka(best.total)}</span>
                  {best.discount > 0 ? (
                    <span className="text-xs text-zinc-400 line-through">{taka(b.fee)}</span>
                  ) : null}
                </div>
                <button
                  type="button"
                  disabled={full}
                  onClick={() => onSelectBatch(b)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:border-zinc-200 disabled:bg-white disabled:text-zinc-400 ${
                    active
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "border border-red-600 text-red-600 hover:bg-red-50"
                  }`}>
                  {full ? "পূর্ণ" : active ? "নির্বাচিত" : "নির্বাচন করুন"}
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl border border-dashed border-zinc-300 p-5">
          <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="text-sm">
            <p className="font-semibold text-zinc-900">পরবর্তী ব্যাচের তারিখ শীঘ্রই ঘোষণা করা হবে</p>
            <p className="mt-1 text-zinc-600">
              কোর্স ফি {taka(priceSummary(course.courseFee || 0, plans).best.total)}। ভর্তি হয়ে এখনই আপনার আসন নিশ্চিত করুন।
            </p>
          </div>
        </div>
      )}
      {selectedBatch ? <Journey batch={selectedBatch} /> : null}
    </CourseSection>
  );
}
