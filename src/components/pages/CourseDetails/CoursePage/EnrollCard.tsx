"use client";

import { TCourse, TCourseBatch, TDeliveryMode, TPaymentPlan } from "@/lib/courses";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  MapPin,
  ShieldCheck,
  Users,
  MonitorPlay,
  Info,
} from "lucide-react";
import {
  FREE_SEMINAR_URL,
  MODE_HINT,
  MODE_LABEL,
  batchDateText,
  batchStatusText,
  formatDateBn,
  formatShortDateBn,
  priceSummary,
  seatsLeft,
  sortModes,
  taka,
  toBn,
} from "./courseUtils";

type Props = {
  course: TCourse;
  batches: TCourseBatch[];
  plans: TPaymentPlan[];
  selectedBatch: TCourseBatch | null;
  onSelectBatch: (batch: TCourseBatch) => void;
  onEnroll: () => void;
};

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5 text-sm">
      <span className="mt-0.5 text-zinc-400">{icon}</span>
      <span className="w-20 shrink-0 text-zinc-500">{label}</span>
      <span className="min-w-0 font-medium text-zinc-800">{value}</span>
    </div>
  );
}

export default function EnrollCard({ course, batches, plans, selectedBatch, onSelectBatch, onEnroll }: Props) {
  const modes = sortModes(batches.map((b) => b.mode));
  const activeMode: TDeliveryMode | null = selectedBatch?.mode || modes[0] || null;
  const modeBatches = batches.filter((b) => b.mode === activeMode);
  const otherBatches = modeBatches.filter((b) => b._id !== selectedBatch?._id);

  const fee = selectedBatch?.fee ?? course.courseFee ?? 0;
  const { best, installment } = priceSummary(fee, plans);
  const isFull = selectedBatch?.status === "full";
  const left = selectedBatch ? seatsLeft(selectedBatch) : null;
  const isOneToOne = course.courseType === "one-to-one";

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
      {/* Mode tabs */}
      {modes.length > 1 ? (
        <div className="border-b border-zinc-100 p-3">
          <p className="mb-2 px-1 text-xs font-medium text-zinc-500">কীভাবে শিখতে চান?</p>
          <div
            role="tablist"
            aria-label="ক্লাসের ধরন"
            className="grid gap-1 rounded-lg bg-zinc-100 p-1"
            style={{ gridTemplateColumns: `repeat(${modes.length}, minmax(0, 1fr))` }}>
            {modes.map((m) => {
              const active = m === activeMode;
              return (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onSelectBatch(batches.find((b) => b.mode === m)!)}
                  className={`rounded-md px-1 py-2 text-xs font-semibold transition-colors sm:text-sm ${
                    active ? "bg-white text-red-600 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
                  }`}>
                  {MODE_LABEL[m]}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="space-y-4 p-5">
        {/* Next batch */}
        {selectedBatch ? (
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-zinc-500">
                {modes.length <= 1 ? `${MODE_LABEL[selectedBatch.mode]} · ` : ""}
                {selectedBatch.status === "running" ? "চলমান ব্যাচ" : "পরবর্তী ব্যাচ শুরু"}
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                  isFull
                    ? "bg-zinc-100 text-zinc-500"
                    : selectedBatch.status === "running"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-600"
                }`}>
                {batchStatusText(selectedBatch)}
              </span>
            </div>
            <p className="mt-1 text-xl font-bold leading-snug text-zinc-900">{batchDateText(selectedBatch)}</p>
            <p className="mt-0.5 text-xs text-zinc-500">{MODE_HINT[selectedBatch.mode]}</p>
          </div>
        ) : (
          <div>
            <span className="text-xs font-medium text-zinc-500">পরবর্তী ব্যাচ</span>
            <p className="mt-1 text-lg font-bold text-zinc-900">তারিখ শীঘ্রই ঘোষণা করা হবে</p>
            <p className="mt-0.5 text-xs text-zinc-500">এখনই ভর্তি হয়ে আপনার আসন নিশ্চিত করুন</p>
          </div>
        )}

        {/* Schedule details */}
        <div className="space-y-2 border-y border-zinc-100 py-3">
          {selectedBatch ? (
            <>
              <Row icon={<CalendarDays className="h-4 w-4" />} label="ক্লাসের দিন" value={selectedBatch.classDays} />
              <Row icon={<Clock className="h-4 w-4" />} label="সময়" value={selectedBatch.classTime} />
              <Row icon={<MapPin className="h-4 w-4" />} label="স্থান" value={selectedBatch.location} />
              <Row icon={<MonitorPlay className="h-4 w-4" />} label="প্ল্যাটফর্ম" value={selectedBatch.platform} />
              <Row
                icon={<Users className="h-4 w-4" />}
                label="আসন"
                value={
                  left !== null
                    ? `${toBn(left)}টি বাকি (মোট ${toBn(selectedBatch.seatsTotal || 0)})`
                    : selectedBatch.minParticipants
                      ? `কমপক্ষে ${toBn(selectedBatch.minParticipants)} জন`
                      : null
                }
              />
              <Row
                icon={<CalendarDays className="h-4 w-4" />}
                label="শেষ সময়"
                value={formatDateBn(selectedBatch.registrationDeadline)}
              />
              {selectedBatch.note ? (
                <p className="flex items-start gap-2 rounded-md bg-amber-50 px-2.5 py-2 text-xs text-amber-800">
                  <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {selectedBatch.note}
                </p>
              ) : null}
            </>
          ) : (
            <>
              <Row
                icon={<CalendarDays className="h-4 w-4" />}
                label="ক্লাসের দিন"
                value={isOneToOne ? course.schedule?.days : null}
              />
              <Row icon={<Clock className="h-4 w-4" />} label="সময়" value={isOneToOne ? course.schedule?.time : null} />
              <Row icon={<Clock className="h-4 w-4" />} label="সময়কাল" value={course.duration} />
            </>
          )}
        </div>

        {/* Price */}
        <div>
          <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
            <span className="text-3xl font-bold tracking-tight text-zinc-900">{taka(best.total)}</span>
            {best.discount > 0 ? (
              <>
                <span className="text-base text-zinc-400 line-through">{taka(fee)}</span>
                <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {toBn(best.discountPercent)}% ছাড়
                </span>
              </>
            ) : null}
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            {best.discount > 0 ? "একসাথে সম্পূর্ণ পেমেন্টে" : "কোর্স ফি"}
            {installment
              ? ` · অথবা ${toBn(installment.installments)} কিস্তিতে, শুরুতে ${taka(installment.payNow)}`
              : ""}
          </p>
        </div>

        <button
          type="button"
          onClick={onEnroll}
          disabled={isFull}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 disabled:cursor-not-allowed disabled:bg-zinc-300">
          {isFull ? "এই ব্যাচের আসন পূর্ণ" : "ভর্তি হোন"}
          {!isFull && <ArrowRight className="h-4 w-4" />}
        </button>
        <a
          href={FREE_SEMINAR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-lg border border-zinc-200 px-4 py-2.5 text-center text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:bg-zinc-50">
          ফ্রি সেমিনারে যোগ দিন
        </a>

        {/* Other batches of this mode */}
        {otherBatches.length ? (
          <div className="border-t border-zinc-100 pt-3">
            <p className="mb-1.5 text-xs font-medium text-zinc-500">আরও ব্যাচ</p>
            <ul className="space-y-1">
              {otherBatches.slice(0, 3).map((b) => (
                <li key={b._id}>
                  <button
                    type="button"
                    onClick={() => onSelectBatch(b)}
                    className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-zinc-50">
                    <span className="font-medium text-zinc-800">{formatShortDateBn(b.startDate) || batchDateText(b)}</span>
                    <span className="text-xs text-zinc-500">{b.classDays}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <p className="flex items-center justify-center gap-1.5 text-[11px] text-zinc-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
          SSLCommerz এর মাধ্যমে ১০০% নিরাপদ পেমেন্ট
        </p>
      </div>
    </div>
  );
}
