"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TCourse, TPaymentPlan } from "@/lib/courses";
import { useUpdateCourseMutation } from "@/redux/api/courseApi";
import { priceForPlan, resolvePlans } from "@/components/pages/CourseDetails/CoursePage/courseUtils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/UI/dialog";
import PlanEditor, { PlanRow, fromRow, toRow, validatePlans } from "./PlanEditor";

export type PricedCourse = Pick<TCourse, "_id" | "title" | "slug" | "courseFee" | "paymentPlans">;

const taka = (n: number) => `৳${Math.round(n).toLocaleString("en-IN")}`;
const inputCls =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

// Regular fee and payment plans of one course
export default function CoursePricingDialog({
  course,
  defaultPlans,
  onClose,
}: {
  course: PricedCourse | null;
  defaultPlans: TPaymentPlan[];
  onClose: () => void;
}) {
  const [updateCourse, { isLoading }] = useUpdateCourseMutation();
  const [fee, setFee] = useState("");
  const [custom, setCustom] = useState(false);
  const [rows, setRows] = useState<PlanRow[]>([]);

  useEffect(() => {
    if (!course) return;
    setFee(course.courseFee ? String(course.courseFee) : "");
    const own = course.paymentPlans || [];
    setCustom(own.length > 0);
    setRows(own.map((p) => toRow(p)));
  }, [course]);

  if (!course) return null;
  const feeNumber = Number(fee) || 0;
  // What students get when this course uses the default plans
  const effectiveDefaults = resolvePlans({ ...course, paymentPlans: [] }, defaultPlans);
  const limitedDefaults = effectiveDefaults.length < defaultPlans.filter((p) => p.isActive !== false).length;

  const save = async () => {
    if (!feeNumber || feeNumber < 0) return toast.error("Enter the regular fee");
    if (custom) {
      if (!rows.length) return toast.error("Add at least one plan, or use the default plans");
      const problem = validatePlans(rows);
      if (problem) return toast.error(problem);
    }
    try {
      await updateCourse({
        id: course._id,
        courseData: { courseFee: feeNumber, paymentPlans: custom ? rows.map(fromRow) : [] },
      }).unwrap();
      toast.success("Fee and plans saved");
      onClose();
    } catch (err) {
      const e = err as { status?: number; data?: { message?: string } };
      toast.error(e.status === 401 || e.status === 403 ? "Your login has expired. Log in again and retry." : e.data?.message || "Could not save");
    }
  };

  return (
    <Dialog open={Boolean(course)} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Fee & payment plans</DialogTitle>
          <DialogDescription>{course.title}</DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <label className="block max-w-xs text-sm">
            <span className="mb-1 block font-medium text-zinc-700">Regular fee (৳)</span>
            <input id="pricing-fee" type="number" min={0} value={fee} onChange={(e) => setFee(e.target.value)} className={inputCls} />
            <span className="mt-1 block text-xs text-zinc-500">Used for new batches and when no batch is open. Each batch can have its own fee.</span>
          </label>

          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-700">Payment plans</p>
            <div className="flex flex-wrap gap-2">
              {[
                { value: false, label: "Use default plans" },
                { value: true, label: "Custom plans for this course" },
              ].map((o) => (
                <button
                  key={String(o.value)}
                  type="button"
                  onClick={() => {
                    setCustom(o.value);
                    if (o.value && !rows.length) setRows(effectiveDefaults.map((p) => toRow(p)));
                  }}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                    custom === o.value ? "border-red-600 bg-red-50 text-red-700" : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                  }`}>
                  {o.label}
                </button>
              ))}
            </div>

            {custom ? (
              <PlanEditor rows={rows} onChange={setRows} previewFee={feeNumber || undefined} />
            ) : (
              <div className="space-y-1.5 rounded-lg bg-zinc-50 px-3 py-2.5 text-sm">
                {limitedDefaults ? (
                  <p className="text-xs text-amber-700">This course only offers full payment from the default plans.</p>
                ) : null}
                {effectiveDefaults.length ? (
                  effectiveDefaults.map((p) => {
                    const price = feeNumber ? priceForPlan(feeNumber, p) : null;
                    return (
                      <p key={p.name} className="flex flex-wrap justify-between gap-x-3 text-zinc-700">
                        <span className="font-medium">
                          {p.name}
                          {p.discountPercent ? <span className="text-emerald-700"> −{p.discountPercent}%</span> : null}
                        </span>
                        {price ? (
                          <span className="text-zinc-500">
                            {taka(price.payNow)} now
                            {price.laterInstallments ? ` + ${price.laterInstallments} × ${taka(price.perLaterInstallment)}` : ""}
                          </span>
                        ) : null}
                      </p>
                    );
                  })
                ) : (
                  <p className="text-zinc-500">No default plans yet. Add them under “Default payment plans”.</p>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 border-t border-zinc-100 pt-4">
            <button type="button" onClick={onClose} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50">
              Cancel
            </button>
            <button
              type="button"
              onClick={save}
              disabled={isLoading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-zinc-300">
              {isLoading ? "Saving…" : "Save fee & plans"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
