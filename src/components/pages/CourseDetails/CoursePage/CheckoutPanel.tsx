"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowRight, Check, CreditCard, FileText, HelpCircle, Loader2, LogIn, ShieldCheck, UserRound, X } from "lucide-react";
import { TCourse, TCourseBatch, TPaymentPlan } from "@/lib/courses";
import { useUser } from "@/context/user.provider";
import { useInitiatePaymentMutation } from "@/redux/api/payment/paymentApi";
import { AuthModal } from "@/components/auth";
import { TermsAndConditionsModal } from "../../Payments/TermsAndConditionsModal/TermsAndConditionsModal";
import { FREE_SEMINAR_URL, MANUAL_PAYMENT_URL, MODE_LABEL, batchDateText, batchStatusText, priceForPlan, taka, toBn } from "./courseUtils";

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

function StepTitle({ n, title, done }: { n: number; title: string; done: boolean }) {
  return (
    <h3 className="mb-3 flex items-center gap-2.5 text-sm font-semibold text-zinc-900">
      <span
        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
          done ? "bg-emerald-600 text-white" : "bg-zinc-900 text-white"
        }`}>
        {done ? <Check className="h-3.5 w-3.5" /> : toBn(n)}
      </span>
      {title}
    </h3>
  );
}

function RadioDot({ active }: { active: boolean }) {
  return (
    <span
      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
        active ? "border-red-600" : "border-zinc-300"
      }`}>
      {active ? <span className="h-2.5 w-2.5 rounded-full bg-red-600" /> : null}
    </span>
  );
}

/**
 * Checkout opened from "ভর্তি হোন": 1) batch, 2) payment plan, 3) account, terms and payment.
 * The price shown uses the same rules as the server; the server recalculates the
 * amount from the database before charging.
 */
export default function CheckoutPanel({ open, onClose, course, batch, batches, onSelectBatch, plans, plansLoading }: Props) {
  const { user, isLoading: userLoading, setIsLoading: reloadUser } = useUser();
  const [initiatePayment, { isLoading: paying }] = useInitiatePaymentMutation();
  const [planName, setPlanName] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

  // After login/register: close the login popup, re-read the account from the
  // new cookie and return to this checkout with every choice kept.
  const handleAuthenticated = () => {
    setShowAuth(false);
    setJustLoggedIn(true);
    reloadUser(true);
  };

  const fee = batch?.fee ?? course.courseFee ?? 0;
  const plan = plans.find((p) => p.name === planName) || plans[0];
  const price = useMemo(() => priceForPlan(fee, plan), [fee, plan]);
  const openBatches = batches.filter((b) => b.status !== "full");
  const includes = Object.values(course.courseIncludes || {}).filter(
    (v): v is string => typeof v === "string" && v.trim().length > 0
  );

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
    if (!open || showAuth || showTerms) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, showAuth, showTerms, onClose]);

  const pay = async () => {
    if (userLoading) return;
    if (!user) return setShowAuth(true);
    if (!termsAccepted) return setTermsError(true);
    try {
      const resp = await initiatePayment({
        courseId: course._id,
        batchId: batch?._id || undefined,
        paymentPlan: plan?.name,
        amount: price.payNow, // shown price; the server calculates the charged amount itself
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          mobileNumber: user.mobileNumber || "N/A",
        },
      }).unwrap();
      if (resp.data?.gatewayUrl) window.location.href = resp.data.gatewayUrl;
      else toast.error("পেমেন্ট গেটওয়ে লিঙ্ক পাওয়া যায়নি।");
    } catch (err) {
      const e = err as { data?: { message?: string }; message?: string };
      toast.error(e.data?.message || e.message || "পেমেন্ট শুরু করতে ব্যর্থ।");
    }
  };

  const payLabel = userLoading
    ? "অ্যাকাউন্ট লোড হচ্ছে..."
    : !user
      ? "লগইন করে এগিয়ে যান"
      : `পেমেন্ট করুন · ${taka(price.payNow)}`;
  const PayButton = ({ className = "" }: { className?: string }) => (
    <button
      type="button"
      onClick={pay}
      disabled={paying || plansLoading || userLoading || fee <= 0 || batch?.status === "full"}
      className={`flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3.5 font-semibold text-white shadow-[0_8px_20px_-8px_rgba(220,38,38,0.7)] transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:shadow-none ${className}`}>
      {paying || userLoading ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : !user ? (
        <LogIn className="h-5 w-5" />
      ) : (
        <CreditCard className="h-5 w-5" />
      )}
      {paying ? "প্রসেস হচ্ছে..." : payLabel}
    </button>
  );

  const TermsCheck = ({ id }: { id: string }) => (
    <label
      htmlFor={id}
      className={`flex items-start gap-2.5 rounded-xl border bg-white px-3 py-2.5 text-sm text-zinc-600 transition-colors ${
        termsError && !termsAccepted ? "border-red-400 ring-2 ring-red-100" : "border-zinc-200"
      }`}>
      <input
        id={id}
        type="checkbox"
        checked={termsAccepted}
        onChange={(e) => {
          setTermsAccepted(e.target.checked);
          setTermsError(false);
        }}
        className="mt-0.5 h-4 w-4 accent-red-600"
      />
      <span>
        আমি{" "}
        <button type="button" onClick={() => setShowTerms(true)} className="font-medium text-red-600 underline underline-offset-2">
          শর্তাবলী
        </button>{" "}
        পড়েছি এবং সম্মত আছি
        {termsError && !termsAccepted ? (
          <span className="mt-1 block text-xs font-medium text-red-600">পেমেন্টের আগে শর্তাবলীতে সম্মতি দিন</span>
        ) : null}
      </span>
    </label>
  );

  return (
    <>
      {open && !showAuth && !showTerms ? (
        // Above the site navbar and the chat button
        <div className="fixed inset-0 z-[10000] flex items-end justify-center sm:items-center sm:p-6" style={{ fontFamily: "banglaFont" }}>
          <div className="absolute inset-0 bg-zinc-950/70 backdrop-blur-[2px]" onClick={onClose} aria-hidden="true" />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            className="relative flex h-[100dvh] w-full flex-col overflow-hidden bg-white shadow-2xl sm:h-auto sm:max-h-[90vh] sm:max-w-4xl sm:rounded-2xl">
            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4 sm:px-6">
              <div className="min-w-0">
                <h2 id="checkout-title" className="text-lg font-bold text-zinc-900 sm:text-xl">
                  ভর্তি নিশ্চিত করুন
                </h2>
                <p className="mt-0.5 truncate text-sm text-zinc-500">{course.title}</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="বন্ধ করুন"
                className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid min-h-0 flex-1 overflow-y-auto md:grid-cols-[1.3fr_1fr] md:grid-rows-[minmax(0,1fr)] md:overflow-hidden">
              {/* Left: choices */}
              <div className="space-y-7 px-5 py-6 sm:px-6 md:overflow-y-auto">
                {/* Step 1: batch */}
                <div>
                  <StepTitle n={1} title="ব্যাচ বেছে নিন" done={!!batch || !batches.length} />
                  {batches.length > 1 ? (
                    <div className="space-y-2">
                      {batches.map((b) => {
                        const active = b._id === batch?._id;
                        const full = b.status === "full";
                        return (
                          <button
                            key={b._id || b.mode}
                            type="button"
                            disabled={full}
                            onClick={() => onSelectBatch(b)}
                            className={`flex w-full items-center gap-3 rounded-xl border p-3.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                              active ? "border-red-500 bg-red-50/50 ring-1 ring-red-500" : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                            }`}>
                            <RadioDot active={active} />
                            <span className="min-w-0 flex-1">
                              <span className="flex flex-wrap items-center gap-x-2 text-sm font-semibold text-zinc-900">
                                {MODE_LABEL[b.mode]} · {batchDateText(b)}
                              </span>
                              <span className="block truncate text-xs text-zinc-500">
                                {[b.classDays, b.classTime].filter(Boolean).join(" · ") || batchStatusText(b)}
                              </span>
                            </span>
                            <span className="shrink-0 text-sm font-semibold text-zinc-700">{taka(b.fee)}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3.5 text-sm">
                      <p className="font-semibold text-zinc-900">
                        {batch ? `${MODE_LABEL[batch.mode]} ব্যাচ · ${batchDateText(batch)}` : "পরবর্তী ব্যাচ · তারিখ শীঘ্রই ঘোষণা করা হবে"}
                      </p>
                      {batch && (batch.classDays || batch.classTime) ? (
                        <p className="mt-0.5 text-zinc-500">{[batch.classDays, batch.classTime].filter(Boolean).join(" · ")}</p>
                      ) : null}
                    </div>
                  )}
                  {batches.length > 1 && !openBatches.length ? (
                    <p className="mt-2 text-xs text-red-600">সব ব্যাচের আসন পূর্ণ। ম্যানুয়াল পেমেন্ট ফর্মে যোগাযোগ করুন।</p>
                  ) : null}
                </div>

                {/* Step 2: plan */}
                <div>
                  <StepTitle n={2} title="পেমেন্ট প্ল্যান" done={!!plan} />
                  {plansLoading ? (
                    <p className="flex items-center gap-2 text-sm text-zinc-500">
                      <Loader2 className="h-4 w-4 animate-spin" /> প্ল্যান লোড হচ্ছে...
                    </p>
                  ) : (
                    <div className={`grid gap-3 ${plans.length > 1 ? "sm:grid-cols-2" : ""}`}>
                      {plans.map((p) => {
                        const pp = priceForPlan(fee, p);
                        const active = p.name === plan?.name;
                        return (
                          <button
                            key={p._id || p.name}
                            type="button"
                            onClick={() => setPlanName(p.name)}
                            className={`flex flex-col gap-3 rounded-xl border p-4 text-left transition-colors ${
                              active ? "border-red-500 bg-red-50/50 ring-1 ring-red-500" : "border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50"
                            }`}>
                            <span className="flex items-center justify-between gap-2">
                              <span className="flex items-center gap-2.5">
                                <RadioDot active={active} />
                                <span className="text-sm font-semibold text-zinc-900">
                                  {pp.installments > 1 ? `${toBn(pp.installments)} কিস্তিতে` : "একসাথে পেমেন্ট"}
                                </span>
                              </span>
                              {p.discountPercent > 0 ? (
                                <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[11px] font-semibold text-white">
                                  {toBn(p.discountPercent)}% ছাড়
                                </span>
                              ) : null}
                            </span>
                            <span>
                              <span className="block text-2xl font-bold tracking-tight text-zinc-900">{taka(pp.payNow)}</span>
                              <span className="block text-xs text-zinc-500">
                                {pp.installments > 1
                                  ? `এখন দিবেন · পরে ${toBn(pp.laterInstallments)}টি কিস্তিতে ${taka(pp.perLaterInstallment)}`
                                  : pp.discount > 0
                                    ? `সাশ্রয় ${taka(pp.discount)}`
                                    : "সম্পূর্ণ কোর্স ফি"}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* What's included, from the course data */}
                {includes.length ? (
                  <div className="rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-white p-4">
                    <p className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-zinc-500">এই কোর্সে যা পাচ্ছেন</p>
                    <ul className="grid gap-x-4 gap-y-2 sm:grid-cols-2">
                      {includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-zinc-700">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-zinc-500">
                  <HelpCircle className="h-4 w-4 shrink-0 text-zinc-400" />
                  সিদ্ধান্ত নিতে সাহায্য দরকার?
                  <a href={FREE_SEMINAR_URL} target="_blank" rel="noopener noreferrer" className="font-semibold text-red-600 hover:underline">
                    ফ্রি সেমিনারে যোগ দিন
                  </a>
                </p>
              </div>

              {/* Right: summary and payment. On desktop the actions are pinned to the bottom. */}
              <div className="flex min-h-0 flex-col border-t border-zinc-100 bg-zinc-50/80 md:border-l md:border-t-0">
                <div className="flex-1 space-y-4 px-5 py-6 sm:px-6 md:overflow-y-auto">
                  <StepTitle n={3} title="পেমেন্ট সম্পন্ন করুন" done={false} />
                  <dl className="space-y-1.5 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">কোর্স ফি</dt>
                      <dd className="text-zinc-800">{taka(fee)}</dd>
                    </div>
                    {price.discount > 0 ? (
                      <div className="flex justify-between text-emerald-700">
                        <dt>ছাড় ({toBn(price.discountPercent)}%)</dt>
                        <dd>−{taka(price.discount)}</dd>
                      </div>
                    ) : null}
                    <div className="flex justify-between">
                      <dt className="text-zinc-500">মোট</dt>
                      <dd className="font-medium text-zinc-800">{taka(price.total)}</dd>
                    </div>
                    {price.laterInstallments > 0 && price.perLaterInstallment > 0 ? (
                      <div className="flex justify-between">
                        <dt className="text-zinc-500">পরে দিবেন</dt>
                        <dd className="text-zinc-800">
                          {toBn(price.laterInstallments)} × {taka(price.perLaterInstallment)}
                        </dd>
                      </div>
                    ) : null}
                    <div className="flex items-baseline justify-between border-t border-dashed border-zinc-200 pt-2.5">
                      <dt className="font-semibold text-zinc-900">এখন দিবেন</dt>
                      <dd className="text-xl font-bold tracking-tight text-zinc-900">{taka(price.payNow)}</dd>
                    </div>
                  </dl>

                  {/* Account: one slim row */}
                  {userLoading ? (
                    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-500">
                      <Loader2 className="h-4 w-4 animate-spin" /> আপনার অ্যাকাউন্ট লোড হচ্ছে...
                    </div>
                  ) : user ? (
                    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-semibold text-red-600">
                        {(user.name || "U").charAt(0).toUpperCase()}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium text-zinc-900">{user.name}</p>
                        <p className="truncate text-xs text-zinc-500">{user.email}</p>
                      </div>
                      <Check className="h-4 w-4 shrink-0 text-emerald-600" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                        <UserRound className="h-4 w-4" />
                      </span>
                      <p className="min-w-0 flex-1 text-zinc-600">পেমেন্টের আগে লগইন প্রয়োজন</p>
                      <button
                        type="button"
                        onClick={() => setShowAuth(true)}
                        className="shrink-0 rounded-lg bg-zinc-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-zinc-800">
                        লগইন
                      </button>
                    </div>
                  )}

                  {justLoggedIn && user && !userLoading ? (
                    <p className="flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-medium text-emerald-800">
                      <Check className="h-4 w-4 shrink-0" />
                      লগইন সফল হয়েছে। {termsAccepted ? "এখন পেমেন্ট করুন।" : "শর্তাবলীতে সম্মতি দিয়ে পেমেন্ট করুন।"}
                    </p>
                  ) : null}

                  {/* Phones: terms and links stay in the scrolling area */}
                  <div className="space-y-3 md:hidden">
                    <TermsCheck id="checkout-terms-mobile" />
                    <a
                      href={MANUAL_PAYMENT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-sm font-semibold text-zinc-600 underline underline-offset-2">
                      ম্যানুয়াল পেমেন্ট করতে চান?
                    </a>
                  </div>
                </div>

                {/* Desktop: pinned actions, always visible */}
                <div className="hidden space-y-2.5 border-t border-zinc-200 bg-white px-6 py-4 md:block">
                  <TermsCheck id="checkout-terms" />
                  <PayButton />
                  <div className="flex items-center justify-between gap-3 text-[11px] text-zinc-500">
                    <a
                      href={MANUAL_PAYMENT_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs font-semibold text-zinc-700 hover:text-zinc-900">
                      <FileText className="h-3.5 w-3.5" /> ম্যানুয়াল পেমেন্ট <ArrowRight className="h-3 w-3" />
                    </a>
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> SSLCommerz নিরাপদ পেমেন্ট
                    </span>
                    <Link href="/privecy-policy" className="hover:text-zinc-800 hover:underline">
                      রিফান্ড পলিসি
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* Phones: total and pay button always visible */}
            <div
              className="flex items-center gap-3 border-t border-zinc-200 bg-white px-5 pt-3 md:hidden"
              style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 0.75rem)" }}>
              <div className="shrink-0">
                <p className="text-[11px] text-zinc-500">এখন দিবেন</p>
                <p className="text-lg font-bold text-zinc-900">{taka(price.payNow)}</p>
              </div>
              <PayButton className="py-3 text-sm" />
            </div>
          </div>
        </div>
      ) : null}

      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        onAuthenticated={handleAuthenticated}
        defaultTab="login"
      />
      <TermsAndConditionsModal
        isOpen={showTerms}
        onClose={() => setShowTerms(false)}
        onAccept={() => {
          setTermsAccepted(true);
          setTermsError(false);
          setShowTerms(false);
        }}
      />
    </>
  );
}
