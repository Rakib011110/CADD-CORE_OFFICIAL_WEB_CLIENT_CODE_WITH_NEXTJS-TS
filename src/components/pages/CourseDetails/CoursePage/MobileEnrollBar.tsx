"use client";

import { useEffect, useRef } from "react";
import { TCourse, TCourseBatch, TPaymentPlan } from "@/lib/courses";
import { MODE_LABEL, formatShortDateBn, priceSummary, taka } from "./courseUtils";

// Fixed bar at the bottom of the screen on phones and tablets, so price and the
// next batch are always visible while reading the page.
export default function MobileEnrollBar({
  course,
  batch,
  plans,
  onEnroll,
}: {
  course: TCourse;
  batch: TCourseBatch | null;
  plans: TPaymentPlan[];
  onEnroll: () => void;
}) {
  const barRef = useRef<HTMLDivElement>(null);
  const { best } = priceSummary(batch?.fee ?? course.courseFee ?? 0, plans);

  // Lift floating widgets (chat button) above the bar while it is visible
  useEffect(() => {
    const el = barRef.current;
    if (!el) return;
    const root = document.documentElement;
    const update = () => root.style.setProperty("--floating-offset", `${el.offsetHeight}px`);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty("--floating-offset");
    };
  }, []);
  const full = batch?.status === "full";
  const when = batch
    ? `${MODE_LABEL[batch.mode]} · ${formatShortDateBn(batch.startDate) || "তারিখ শীঘ্রই"}`
    : "পরবর্তী ব্যাচ শীঘ্রই";

  return (
    <div
      ref={barRef}
      className="fixed inset-x-0 bottom-0 z-30 border-t border-zinc-200 bg-white/95 px-4 pt-3 shadow-[0_-6px_20px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)", fontFamily: "banglaFont" }}>
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-zinc-900">{taka(best.total)}</span>
            {best.discount > 0 ? (
              <span className="text-xs text-zinc-400 line-through">{taka(best.fee)}</span>
            ) : null}
          </div>
          <p className="truncate text-xs text-zinc-500">{when}</p>
        </div>
        <button
          type="button"
          onClick={onEnroll}
          disabled={full}
          className="shrink-0 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-zinc-300">
          {full ? "আসন পূর্ণ" : "ভর্তি হোন"}
        </button>
      </div>
    </div>
  );
}
