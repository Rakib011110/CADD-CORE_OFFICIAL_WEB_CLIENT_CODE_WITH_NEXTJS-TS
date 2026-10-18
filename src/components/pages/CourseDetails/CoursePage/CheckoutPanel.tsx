"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Check, CreditCard, FileText, Loader2, LogIn, ShieldCheck, X } from "lucide-react";
import { TCourse, TCourseBatch, TPaymentPlan } from "@/lib/courses";
import { useUser } from "@/context/user.provider";
import { useInitiatePaymentMutation } from "@/redux/api/payment/paymentApi";
import { TermsAndConditionsModal } from "../../Payments/TermsAndConditionsModal/TermsAndConditionsModal";
import InlineAuth from "./InlineAuth";
import { MANUAL_PAYMENT_URL, MODE_LABEL, batchDateText, priceForPlan, taka, toBn } from "./courseUtils";

type Props = {
  open: boolean;
  onClose: () => void;
  course: TCourse;
  batch: TCourseBatch | null;
  batches: TCourseBatch[];
  onSelectBatch: (batch: TCourseBatch) => void;
  plans: TPaymentPlan[];
  plansLoading: boolean;
};

function RadioDot({ active }: { active: boolean }) {
  return (
    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 ${active ? "border-red-600" : "border-zinc-300"}`}>
      {active ? <span className="h-2 w-2 rounded-full bg-red-600" /> : null}
    </span>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">{children}</p>
);

const optionCls = (active: boolean) =>
  `flex w-full items-center gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
    active ? "border-red-500 bg-red-50/60 ring-1 ring-red-500" : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
  }`;

/**
 * One compact column: batch, payment plan, account (login inside the panel) and pay.
 * The price uses the same rules as the server; the server recalculates the charged amount.
 */
export default function CheckoutPanel({ open, onClose, course, batch, batches, onSelectBatch, plans, plansLoading }: Props) {
  const { user, isLoading: userLoading, setIsLoading: reloadUser } = useUser();
  const [initiatePayment, { isLoading: paying }] = useInitiatePaymentMutation();
  const [planName, setPlanName] = useState<string | null>(null);
  const [showTerms, setShowTerms] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);
  // Before login the main button submits the login / new account form
  const [auth, setAuth] = useState<{ mode: "login" | "register"; busy: boolean }>({ mode: "login", busy: false });
  const onAuthState = useCallback((s: { mode: "login" | "register"; busy: boolean }) => setAuth(s), []);

  const fee = batch?.fee ?? course.courseFee ?? 0;
  const plan = plans.find((p) => p.name === planName) || plans[0];
  const price = useMemo(() => priceForPlan(fee, plan), [fee, plan]);

  // Default to the plan with the biggest discount
  useEffect(() => {
    if (!plans.length) return;
    if (!planName || !plans.some((p) => p.name === planName)) {
      const best = [...plans].sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0))[0];
      setPlanName(best.name);
    }
  }, [plans, planName]);

  // Close on Escape and stop the page behind from scrolling
  useEffect(() => {
    if (!open || showTerms) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, showTerms, onClose]);

  const pay = async () => {
    if (userLoading) return;
    if (!user) {
      accountRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      accountRef.current?.querySelector("input")?.focus();
      return;
    }
    try {
      const resp = await initiatePayment({
        courseId: course._id,
        batchId: batch?._id || undefined,
        paymentPlan: plan?.name,
        amount: price.payNow, // shown price; the server calculates the charged amount itself
        user: { _id: user._id, name: user.name, email: user.email, mobileNumber: user.mobileNumber || "N/A" },
      }).unwrap();
      if (resp.data?.gatewayUrl) window.location.href = resp.data.gatewayUrl;
      else toast.error("পেমেন্ট গেটওয়ে লিঙ্ক পাওয়া যায়নি।");
    } catch (err) {
      const e = err as { data?: { message?: string }; message?: string };
      toast.error(e.data?.message || e.message || "পেমেন্ট শুরু করতে ব্যর্থ।");
    }
  };

  if (!open) return null;
  const blocked = paying || plansLoading || userLoading || fee <= 0 || batch?.status === "full";

  return (
    <>
      {!showTerms ? (
        // Above the site navbar and the chat button
        <div className="fixed inset-0 z-[10000] flex items-end justify-center sm:items-center sm:p-6" style={{ fontFamily: "banglaFont" }}>
          <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            className="relative flex max-h-[100dvh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-h-[92vh] sm:max-w-lg sm:rounded-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-zinc-100 px-5 py-3.5">
              <div className="min-w-0">
                <h2 id="checkout-title" className="text-lg font-bold text-zinc-900">
                  ভর্তি নিশ্চিত করুন
                </h2>
                <p className="truncate text-sm text-zinc-500">{course.title}</p>
              </div>
              <button type="button" onClick={onClose} aria-label="বন্ধ করুন" className="-mr-1 rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-4">
              {/* Batch */}
              <div>
                <Label>ব্যাচ</Label>
                {batches.length > 1 ? (
                  <div className="space-y-2">
                    {batches.map((b) => {
                      const active = b._id === batch?._id;
                      return (
                        <button key={b._id || b.mode} type="button" disabled={b.status === "full"} onClick={() => onSelectBatch(b)} className={optionCls(active)}>
                          <RadioDot active={active} />
                          <span className="min-w-0 flex-1">
                            <span className="block text-sm font-semibold text-zinc-900">
                              {MODE_LABEL[b.mode]} · {batchDateText(b)}
                            </span>
                            {b.classDays || b.classTime ? (
                              <span className="block truncate text-xs text-zinc-500">{[b.classDays, b.classTime].filter(Boolean).join(" · ")}</span>
                            ) : null}
                          </span>
                          <span className="shrink-0 text-sm font-semibold text-zinc-700">{b.status === "full" ? "আসন পূর্ণ" : taka(b.fee)}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="rounded-xl bg-zinc-50 px-3.5 py-2.5 text-sm">
                    <span className="font-semibold text-zinc-900">
                      {batch ? `${MODE_LABEL[batch.mode]} · ${batchDateText(batch)}` : "তারিখ শীঘ্রই ঘোষণা করা হবে"}
                    </span>
                    {batch && (batch.classDays || batch.classTime) ? (
                      <span className="block text-xs text-zinc-500">{[batch.classDays, batch.classTime].filter(Boolean).join(" · ")}</span>
                    ) : null}
                  </p>
                )}
              </div>

              {/* Plan */}
              <div>
                <Label>পেমেন্ট</Label>
                {plansLoading ? (
                  <p className="flex items-center gap-2 text-sm text-zinc-500">
                    <Loader2 className="h-4 w-4 animate-spin" /> লোড হচ্ছে...
                  </p>
                ) : (
                  <div className="space-y-2">
                    {plans.map((p) => {
                      const pp = priceForPlan(fee, p);
                      const active = p.name === plan?.name;
                      return (
                        <button key={p._id || p.name} type="button" onClick={() => setPlanName(p.name)} className={optionCls(active)}>
                          <RadioDot active={active} />
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-zinc-900">
                              {pp.installments > 1 ? `${toBn(pp.installments)} কিস্তিতে` : "একসাথে পেমেন্ট"}
                              {p.discountPercent > 0 ? (
                                <span className="rounded-full bg-emerald-600 px-1.5 py-px text-[10px] font-semibold text-white">{toBn(p.discountPercent)}% ছাড়</span>
                              ) : null}
                            </span>
                            <span className="block text-xs text-zinc-500">
                              {pp.installments > 1
                                ? `পরে ${toBn(pp.laterInstallments)} × ${taka(pp.perLaterInstallment)}`
                                : pp.discount > 0
                                  ? `সাশ্রয় ${taka(pp.discount)}`
                                  : "সম্পূর্ণ ফি"}
                            </span>
                          </span>
                          <span className="shrink-0 text-right">
                            <span className="block text-base font-bold text-zinc-900">{taka(pp.payNow)}</span>
                            {pp.installments > 1 ? <span className="block text-[11px] text-zinc-500">এখন</span> : null}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Account */}
              <div ref={accountRef}>
                <Label>অ্যাকাউন্ট</Label>
                {userLoading ? (
                  <p className="flex items-center gap-2 rounded-xl bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-500">
                    <Loader2 className="h-4 w-4 animate-spin" /> লোড হচ্ছে...
                  </p>
                ) : user ? (
                  <div className="flex items-center gap-3 rounded-xl bg-zinc-50 px-3.5 py-2.5 text-sm">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-sm font-semibold text-red-600">
                      {(user.name || "U").charAt(0).toUpperCase()}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-zinc-900">{user.name}</span>
                      <span className="block truncate text-xs text-zinc-500">{user.email}</span>
                    </span>
                    <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                  </div>
                ) : (
                  <InlineAuth formId="checkout-auth" onDone={() => reloadUser(true)} onStateChange={onAuthState} />
                )}
              </div>
            </div>

            {/* Total and pay, always visible */}
            <div className="border-t border-zinc-200 bg-white px-5 pt-3" style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}>
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  <p className="text-[11px] text-zinc-500">এখন দিবেন</p>
                  <p className="text-xl font-bold leading-tight text-zinc-900">{taka(price.payNow)}</p>
                  {price.discount > 0 || price.laterInstallments > 0 ? (
                    <p className="text-[11px] text-zinc-500">
                      মোট {taka(price.total)}
                      {price.discount > 0 ? <span className="text-emerald-700"> · {toBn(price.discountPercent)}% ছাড়</span> : null}
                    </p>
                  ) : null}
                </div>
                <button
                  {...(user || userLoading ? { type: "button" as const, onClick: pay } : { type: "submit" as const, form: "checkout-auth" })}
                  disabled={blocked || auth.busy}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 font-semibold text-white shadow-[0_8px_20px_-8px_rgba(220,38,38,0.7)] transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:shadow-none">
                  {paying || userLoading || auth.busy ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : user ? (
                    <CreditCard className="h-5 w-5" />
                  ) : (
                    <LogIn className="h-5 w-5" />
                  )}
                  {paying
                    ? "প্রসেস হচ্ছে..."
                    : user
                      ? "পেমেন্ট করুন"
                      : auth.mode === "login"
                        ? "লগইন করে এগিয়ে যান"
                        : "অ্যাকাউন্ট খুলে এগিয়ে যান"}
                </button>
              </div>
              <p className="mt-2 text-center text-[11px] leading-relaxed text-zinc-500">
                পেমেন্ট করলে আপনি{" "}
                <button type="button" onClick={() => setShowTerms(true)} className="font-medium text-zinc-700 underline underline-offset-2">
                  শর্তাবলী
                </button>{" "}
                ও{" "}
                <Link href="/privecy-policy" target="_blank" className="font-medium text-zinc-700 underline underline-offset-2">
                  রিফান্ড পলিসি
                </Link>{" "}
                মেনে নিচ্ছেন
              </p>
              <div className="mt-1.5 flex items-center justify-center gap-4 text-[11px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> SSLCommerz নিরাপদ পেমেন্ট
                </span>
                <a href={MANUAL_PAYMENT_URL} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-medium text-zinc-700 hover:text-zinc-900">
                  <FileText className="h-3.5 w-3.5" /> ম্যানুয়াল পেমেন্ট
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <TermsAndConditionsModal isOpen={showTerms} onClose={() => setShowTerms(false)} onAccept={() => setShowTerms(false)} />
    </>
  );
}
