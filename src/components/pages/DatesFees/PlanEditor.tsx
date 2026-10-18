"use client";

import { Plus, Trash2 } from "lucide-react";
import { TPaymentPlan } from "@/lib/courses";
import { priceForPlan } from "@/components/pages/CourseDetails/CoursePage/courseUtils";

// One editable plan. Numbers are kept as strings while typing.
export type PlanRow = {
  key: string;
  originalName?: string; // name saved on the server (default plans are updated by name)
  name: string;
  installments: string;
  discountPercent: string;
  payNowPercent: string;
  isActive: boolean;
};

let rowSeq = 0;
const newKey = () => `plan-${Date.now()}-${rowSeq++}`;

// Pay-now share the website used before it became a setting
export const legacyPayNow = (installments: number) => (installments === 2 ? 50 : installments === 3 ? 30 : 100);

export const toRow = (p: Partial<TPaymentPlan>, keepName = false): PlanRow => ({
  key: newKey(),
  originalName: keepName ? p.name : undefined,
  name: p.name || "",
  installments: String(p.installments || 1),
  discountPercent: String(p.discountPercent || 0),
  payNowPercent: p.payNowPercent ? String(p.payNowPercent) : "",
  isActive: p.isActive !== false,
});

export const emptyRow = (installments = 1): PlanRow =>
  toRow({
    name: installments === 1 ? "Full Payment" : `Pay in ${installments} Installments`,
    installments,
    discountPercent: 0,
    payNowPercent: installments === 1 ? undefined : legacyPayNow(installments),
    isActive: true,
  });

export const fromRow = (r: PlanRow): TPaymentPlan => {
  const installments = Math.max(1, Math.round(Number(r.installments) || 1));
  const payNow = Number(r.payNowPercent);
  return {
    name: r.name.trim(),
    installments,
    discountPercent: Math.min(100, Math.max(0, Number(r.discountPercent) || 0)),
    // One payment always pays everything now
    ...(installments > 1 && payNow > 0 ? { payNowPercent: Math.min(100, payNow) } : {}),
    isActive: r.isActive,
  };
};

/** Returns an error message, or null when the plans can be saved. */
export const validatePlans = (rows: PlanRow[]) => {
  const names = rows.map((r) => r.name.trim().toLowerCase());
  if (names.some((n) => !n)) return "Every plan needs a name";
  if (new Set(names).size !== names.length) return "Two plans have the same name";
  for (const r of rows) {
    const i = Number(r.installments);
    const d = Number(r.discountPercent);
    const p = r.payNowPercent === "" ? null : Number(r.payNowPercent);
    if (!Number.isInteger(i) || i < 1 || i > 12) return `"${r.name}": installments must be 1 to 12`;
    if (isNaN(d) || d < 0 || d > 100) return `"${r.name}": discount must be 0 to 100%`;
    if (i > 1 && p !== null && (isNaN(p) || p < 1 || p > 100)) return `"${r.name}": pay now must be 1 to 100%`;
  }
  return null;
};

const taka = (n: number) => `৳${Math.round(n).toLocaleString("en-IN")}`;
const inputCls =
  "w-full rounded-md border border-zinc-300 bg-white px-2.5 py-1.5 text-sm text-zinc-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

export default function PlanEditor({
  rows,
  onChange,
  previewFee,
}: {
  rows: PlanRow[];
  onChange: (rows: PlanRow[]) => void;
  previewFee?: number; // shows what a student pays with each plan
}) {
  const update = (key: string, patch: Partial<PlanRow>) => onChange(rows.map((r) => (r.key === key ? { ...r, ...patch } : r)));

  return (
    <div className="space-y-2">
      {rows.length ? (
        <div className="hidden grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,0.8fr))_auto_auto] gap-2 px-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-500 md:grid">
          <span>Plan name (shown to students)</span>
          <span>Installments</span>
          <span>Discount %</span>
          <span>Pay now %</span>
          <span className="w-12 text-center">Active</span>
          <span className="w-8" />
        </div>
      ) : null}

      {rows.map((r) => {
        const plan = fromRow(r);
        const multi = plan.installments > 1;
        const price = previewFee ? priceForPlan(previewFee, plan) : null;
        return (
          <div key={r.key} className={`rounded-lg border p-2.5 ${r.isActive ? "border-zinc-200 bg-white" : "border-dashed border-zinc-200 bg-zinc-50 opacity-70"}`}>
            <div className="grid grid-cols-2 items-center gap-2 md:grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,0.8fr))_auto_auto]">
              <input
                aria-label="Plan name"
                value={r.name}
                onChange={(e) => update(r.key, { name: e.target.value })}
                placeholder="e.g. Full Payment"
                className={`${inputCls} col-span-2 md:col-span-1`}
              />
              <input
                aria-label="Installments"
                type="number"
                min={1}
                max={12}
                value={r.installments}
                onChange={(e) => update(r.key, { installments: e.target.value })}
                className={inputCls}
              />
              <input
                aria-label="Discount percent"
                type="number"
                min={0}
                max={100}
                value={r.discountPercent}
                onChange={(e) => update(r.key, { discountPercent: e.target.value })}
                className={inputCls}
              />
              <input
                aria-label="Pay now percent"
                type="number"
                min={1}
                max={100}
                value={multi ? r.payNowPercent : "100"}
                disabled={!multi}
                placeholder={String(legacyPayNow(plan.installments))}
                onChange={(e) => update(r.key, { payNowPercent: e.target.value })}
                className={`${inputCls} disabled:bg-zinc-100 disabled:text-zinc-500`}
              />
              <label className="flex w-12 justify-center">
                <input
                  type="checkbox"
                  aria-label="Active"
                  checked={r.isActive}
                  onChange={(e) => update(r.key, { isActive: e.target.checked })}
                  className="h-4 w-4 accent-red-600"
                />
              </label>
              <button
                type="button"
                onClick={() => onChange(rows.filter((x) => x.key !== r.key))}
                aria-label={`Remove ${r.name || "plan"}`}
                className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-red-50 hover:text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            {price ? (
              <p className="mt-1.5 px-1 text-xs text-zinc-500">
                Student pays <span className="font-semibold text-zinc-800">{taka(price.payNow)}</span> now
                {price.laterInstallments
                  ? ` + ${price.laterInstallments} × ${taka(price.perLaterInstallment)} later`
                  : ""}
                {" · "}total {taka(price.total)}
                {price.discount ? <span className="text-emerald-700"> (saves {taka(price.discount)})</span> : null}
              </p>
            ) : null}
          </div>
        );
      })}

      <div className="flex flex-wrap gap-2 pt-1">
        {[1, 2, 3].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange([...rows, emptyRow(n)])}
            className="inline-flex items-center gap-1.5 rounded-md border border-zinc-300 px-2.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50">
            <Plus className="h-3.5 w-3.5" /> {n === 1 ? "Full payment plan" : `${n} installments plan`}
          </button>
        ))}
      </div>
    </div>
  );
}
