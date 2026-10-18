"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, Layers } from "lucide-react";
import { TPaymentPlan } from "@/lib/courses";
import {
  useCreateInstallmentPlanMutation,
  useDeleteInstallmentPlanMutation,
  useGetInstallmentPlansQuery,
  useUpdateInstallmentPlanMutation,
} from "@/redux/api/payment/useInstallmentPlansApi";
import PlanEditor, { PlanRow, fromRow, toRow, validatePlans } from "./PlanEditor";

const errorText = (err: unknown) => {
  const e = err as { status?: number; data?: { message?: string } };
  if (e.status === 401 || e.status === 403) return "Your login has expired. Log in again and retry.";
  return e.data?.message || "Could not save the default plans";
};

// Plans used by every course that has no plans of its own
export default function DefaultPlansPanel({ exampleFee }: { exampleFee?: number }) {
  const { data, isLoading } = useGetInstallmentPlansQuery({ all: true });
  const [createPlan] = useCreateInstallmentPlanMutation();
  const [updatePlan] = useUpdateInstallmentPlanMutation();
  const [deletePlan] = useDeleteInstallmentPlanMutation();

  const saved: TPaymentPlan[] = data?.data || [];
  const [rows, setRows] = useState<PlanRow[]>([]);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setRows(saved.map((p) => toRow(p, true)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const save = async () => {
    const problem = validatePlans(rows);
    if (problem) return toast.error(problem);
    setSaving(true);
    try {
      const keptNames = new Set(rows.map((r) => r.originalName).filter(Boolean));
      for (const p of saved) if (!keptNames.has(p.name)) await deletePlan(p.name).unwrap();
      for (const r of rows) {
        const plan = fromRow(r);
        // Clear an old pay-now value when it was removed
        const body = { ...plan, payNowPercent: plan.payNowPercent ?? null };
        if (r.originalName) await updatePlan({ originalName: r.originalName, ...body }).unwrap();
        else await createPlan(body).unwrap();
      }
      toast.success("Default plans saved");
    } catch (err) {
      toast.error(errorText(err));
    } finally {
      setSaving(false);
    }
  };

  const summary = saved.length
    ? saved
        .filter((p) => p.isActive !== false)
        .map((p) => `${p.name}${p.discountPercent ? ` −${p.discountPercent}%` : ""}`)
        .join(" · ")
    : "No default plans";

  return (
    <section className="rounded-xl border border-zinc-200 bg-white">
      <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="flex w-full items-center gap-3 px-4 py-3 text-left">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
          <Layers className="h-4 w-4" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-zinc-900">Default payment plans</span>
          <span className="block truncate text-sm text-zinc-500">{isLoading ? "Loading…" : summary}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-zinc-400 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="space-y-3 border-t border-zinc-100 px-4 py-4">
          <p className="text-sm text-zinc-600">
            Every course uses these plans unless it has its own plans. <b>Discount %</b> is taken off the batch fee.{" "}
            <b>Pay now %</b> is the share of the total paid at enrollment; the rest is split over the later installments.
          </p>
          <PlanEditor rows={rows} onChange={setRows} previewFee={exampleFee} />
          {exampleFee ? <p className="text-xs text-zinc-500">Preview uses a fee of ৳{exampleFee.toLocaleString("en-IN")}.</p> : null}
          <div className="flex justify-end gap-2 border-t border-zinc-100 pt-3">
            <button
              type="button"
              onClick={() => setRows(saved.map((p) => toRow(p, true)))}
              className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50">
              Reset
            </button>
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-zinc-300">
              {saving ? "Saving…" : "Save default plans"}
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}
