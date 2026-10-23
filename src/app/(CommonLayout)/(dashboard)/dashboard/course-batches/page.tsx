"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast, Toaster } from "sonner";
import { CalendarPlus, Copy, ExternalLink, Pencil, Search, Trash2, Wallet } from "lucide-react";
import { useGetAllCourseQuery } from "@/redux/api/courseApi";
import {
  useCreateCourseBatchMutation,
  useDeleteCourseBatchMutation,
  useGetAllCourseBatchesQuery,
  useUpdateCourseBatchMutation,
} from "@/redux/api/courseBatchApi";
import { TBatchStatus, TCourseBatch, TDeliveryMode, TPaymentPlan } from "@/lib/courses";
import { useGetInstallmentPlansQuery } from "@/redux/api/payment/useInstallmentPlansApi";
import { priceForPlan, resolvePlans } from "@/components/pages/CourseDetails/CoursePage/courseUtils";
import DefaultPlansPanel from "@/components/pages/DatesFees/DefaultPlansPanel";
import CoursePricingDialog, { PricedCourse } from "@/components/pages/DatesFees/CoursePricingDialog";
import PlanEditor, { PlanRow, fromRow, planLabel, toRow, validatePlans } from "@/components/pages/DatesFees/PlanEditor";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/UI/dialog";
import { API_BASE_URL } from "@/lib/apiBase";

type CourseOption = PricedCourse & { courseType?: string };

const MODES: { value: TDeliveryMode; label: string }[] = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "weekend", label: "Weekend" },
  { value: "friday", label: "Friday" },
  { value: "corporate", label: "Friday (Corporate)" },
  { value: "one-to-one", label: "One to one" },
];

const STATUSES: { value: TBatchStatus; label: string; className: string }[] = [
  { value: "upcoming", label: "Upcoming", className: "bg-blue-50 text-blue-700" },
  { value: "running", label: "Running (admission open)", className: "bg-emerald-50 text-emerald-700" },
  { value: "full", label: "Full", className: "bg-amber-50 text-amber-700" },
  { value: "closed", label: "Closed", className: "bg-zinc-100 text-zinc-500" },
];

const emptyForm = {
  course: "",
  mode: "online" as TDeliveryMode,
  batchNo: "",
  // "date" = fixed start date, "anytime" = start when enrolling, "tba" = date to be announced
  startType: "date" as "date" | "anytime" | "tba",
  startDate: "",
  endDate: "",
  registrationDeadline: "",
  classDays: "",
  classTime: "",
  location: "",
  platform: "",
  fee: "",
  // false = the course's plans apply; true = planRows are this batch's own plans
  customPlans: false,
  planRows: [] as PlanRow[],
  seatsTotal: "",
  seatsBooked: "",
  minParticipants: "",
  note: "",
  status: "upcoming" as TBatchStatus,
  isPublished: true,
  onJobTrainingStart: "",
  onJobTrainingEnd: "",
  certificationDate: "",
  internshipStartDate: "",
};
type FormState = typeof emptyForm;

const toInputDate = (v?: string | null) => (v ? new Date(v).toISOString().slice(0, 10) : "");
const prettyDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
const courseOf = (b: TCourseBatch) => (typeof b.course === "object" ? b.course : null);
const taka = (n: number) => `৳${Math.round(n).toLocaleString("en-IN")}`;
// Numbers the server creates by itself; only numbers typed by an admin are worth showing
const AUTO_BATCH_NO = /^(ONLINE|OFFLINE|WEEKEND|FRIDAY|CORPORATE|ONE-TO-ONE)-(\d{4}-\d{2}-\d{2}|ANYTIME|TBA)(-\d+)?$/;

// Same visibility rule as the API: an upcoming batch stays on the website for
// 14 days after it starts (admission open), unless it is set to running/full.
const ADMISSION_GRACE_DAYS = 14;
const isLive = (b: TCourseBatch) => {
  if (!b.isPublished || b.status === "closed") return false;
  if (b.status === "running" || b.status === "full") return true;
  const cutoff = new Date(new Date().toDateString());
  cutoff.setDate(cutoff.getDate() - ADMISSION_GRACE_DAYS);
  return !b.startDate || new Date(b.startDate) >= cutoff;
};

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block text-sm">
      <span className="mb-1 block font-medium text-zinc-700">{label}</span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-zinc-500">{hint}</span> : null}
    </label>
  );
}

// One titled block of the batch form
function FormSection({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 py-5 first:pt-0">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-zinc-900">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-bold text-white">{step}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

const Pills = <T extends string | boolean>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly { value: T; label: string }[];
  onChange: (v: T) => void;
}) => (
  <div className="inline-flex flex-wrap gap-1 rounded-lg bg-zinc-100 p-1">
    {options.map((o) => (
      <button
        key={String(o.value)}
        type="button"
        onClick={() => onChange(o.value)}
        className={`rounded-md px-3 py-1.5 text-sm font-medium transition ${
          value === o.value ? "bg-white text-red-700 shadow-sm" : "text-zinc-600 hover:text-zinc-900"
        }`}>
        {o.label}
      </button>
    ))}
  </div>
);

// Small chips with the plans a batch offers
function PlanChips({ plans, own }: { plans: TPaymentPlan[]; own?: boolean }) {
  if (!plans.length) return <span className="text-xs text-zinc-400">No plans</span>;
  return (
    <span className="flex flex-wrap gap-1">
      {plans.map((p) => (
        <span
          key={p.name}
          className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${
            p.discountPercent ? "bg-emerald-50 text-emerald-700" : "bg-zinc-100 text-zinc-600"
          }`}>
          {planLabel(p)}
        </span>
      ))}
      {own ? <span className="rounded bg-sky-50 px-1.5 py-0.5 text-[11px] font-medium text-sky-700">Batch only</span> : null}
    </span>
  );
}

const inputCls =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20";
const iconBtn = "rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900";

export default function CourseBatchesPage() {
  const { data: coursesRes } = useGetAllCourseQuery({});
  const { data: batchesRes, isLoading, isError, error: batchesError } = useGetAllCourseBatchesQuery(undefined);
  const loadErrorStatus = (batchesError as { status?: number | string } | undefined)?.status;
  const [createBatch, { isLoading: creating }] = useCreateCourseBatchMutation();
  const [updateBatch, { isLoading: updating }] = useUpdateCourseBatchMutation();
  const [deleteBatch] = useDeleteCourseBatchMutation();

  const courses: CourseOption[] = coursesRes?.data || [];
  const batches: TCourseBatch[] = batchesRes?.data || [];

  const [courseFilter, setCourseFilter] = useState("");
  const [modeFilter, setModeFilter] = useState("");
  const [showHidden, setShowHidden] = useState(false);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<TCourseBatch | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [pricingCourse, setPricingCourse] = useState<CourseOption | null>(null);
  const { data: plansRes } = useGetInstallmentPlansQuery({});
  const defaultPlans: TPaymentPlan[] = plansRes?.data || [];

  // Plans a course gives its batches: its own plans, or the default plans
  const coursePlans = (c?: CourseOption) => (c ? resolvePlans(c, defaultPlans) : []);

  // Links like ?course=<id> (from the course editor) open on that course
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("course");
    if (id) setCourseFilter(id);
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return batches.filter((b) => {
      const c = courseOf(b);
      if (courseFilter && c?._id !== courseFilter) return false;
      if (modeFilter && b.mode !== modeFilter) return false;
      if (!showHidden && !isLive(b)) return false;
      if (q && !`${c?.title} ${b.batchNo} ${b.classDays} ${b.location}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [batches, courseFilter, modeFilter, showHidden, search]);

  const hiddenCount = batches.filter((b) => !isLive(b)).length;

  // Courses with their matching batches. A course search or a mode filter hides courses with no match.
  const courseGroups = useMemo(() => {
    const q = search.trim().toLowerCase();
    return courses
      .filter((c) => !courseFilter || c._id === courseFilter)
      .map((c) => ({
        course: c,
        titleMatch: !q || c.title.toLowerCase().includes(q),
        rows: filtered.filter((b) => courseOf(b)?._id === c._id),
      }))
      .filter((g) => (q || modeFilter ? g.rows.length > 0 || (g.titleMatch && !modeFilter) : true))
      .map((g) => ({ course: g.course, rows: g.titleMatch && q ? filtered.filter((b) => courseOf(b)?._id === g.course._id) : g.rows }));
  }, [courses, filtered, courseFilter, modeFilter, search]);
  const coursesWithoutBatch = courses.filter((c) => !batches.some((b) => courseOf(b)?._id === c._id && isLive(b)));

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));
  const formCourse = courses.find((c) => c._id === form.course);
  const formFee = Number(form.fee) || 0;

  const openCreate = (preset?: Partial<FormState>) => {
    setEditing(null);
    const course = courses.find((c) => c._id === (preset?.course || courseFilter));
    setForm({
      ...emptyForm,
      course: course?._id || "",
      fee: course?.courseFee ? String(course.courseFee) : "",
      mode: course?.courseType === "one-to-one" ? "one-to-one" : "online",
      startType: course?.courseType === "one-to-one" ? "anytime" : "date",
      ...preset,
    });
    setFormOpen(true);
  };

  const fromBatch = (b: TCourseBatch): FormState => ({
    course: courseOf(b)?._id || String(b.course),
    mode: b.mode,
    batchNo: AUTO_BATCH_NO.test(b.batchNo) ? "" : b.batchNo,
    startType: b.startAnytime ? "anytime" : b.startDate ? "date" : "tba",
    startDate: toInputDate(b.startDate),
    endDate: toInputDate(b.endDate),
    registrationDeadline: toInputDate(b.registrationDeadline),
    classDays: b.classDays || "",
    classTime: b.classTime || "",
    location: b.location || "",
    platform: b.platform || "",
    fee: String(b.fee ?? ""),
    customPlans: Boolean(b.paymentPlans?.length),
    planRows: (b.paymentPlans || []).map((p) => toRow(p)),
    seatsTotal: b.seatsTotal != null ? String(b.seatsTotal) : "",
    seatsBooked: b.seatsBooked != null ? String(b.seatsBooked) : "",
    minParticipants: b.minParticipants != null ? String(b.minParticipants) : "",
    note: b.note || "",
    status: b.status,
    isPublished: b.isPublished,
    onJobTrainingStart: toInputDate(b.onJobTrainingStart),
    onJobTrainingEnd: toInputDate(b.onJobTrainingEnd),
    certificationDate: toInputDate(b.certificationDate),
    internshipStartDate: toInputDate(b.internshipStartDate),
  });

  const openEdit = (b: TCourseBatch) => {
    setEditing(b);
    setForm(fromBatch(b));
    setFormOpen(true);
  };

  // Copy days, time, fee, plans etc. into a new batch; dates and batch number are left for the admin
  const duplicate = (b: TCourseBatch) => {
    openCreate({
      ...fromBatch(b),
      batchNo: "",
      startDate: "",
      endDate: "",
      registrationDeadline: "",
      seatsBooked: "",
      status: "upcoming",
      onJobTrainingStart: "",
      onJobTrainingEnd: "",
      certificationDate: "",
      internshipStartDate: "",
    });
  };

  const setCustomPlans = (custom: boolean) =>
    setForm((f) => ({
      ...f,
      customPlans: custom,
      // Start from the course's plans so only the difference has to be typed
      planRows: custom && !f.planRows.length ? coursePlans(formCourse).map((p) => toRow(p)) : f.planRows,
    }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.course) return toast.error("Choose a course");
    if (form.startType === "date" && !form.startDate) return toast.error("Choose the start date, or pick Start anytime / Date to be announced");
    if (form.fee === "" || Number(form.fee) < 0) return toast.error("Enter the fee for this batch");
    if (form.customPlans) {
      if (!form.planRows.length) return toast.error("Add at least one plan, or choose Same as course");
      const problem = validatePlans(form.planRows);
      if (problem) return toast.error(problem);
    }
    const { course, startType, customPlans, planRows, ...rest } = form;
    const payload = {
      ...rest,
      batchNo: rest.batchNo.trim(),
      startAnytime: startType === "anytime",
      startDate: startType === "date" ? rest.startDate : "",
      fee: Number(form.fee),
      paymentPlans: customPlans ? planRows.map(fromRow) : [],
    };
    try {
      if (editing) {
        await updateBatch({ id: editing._id, ...payload }).unwrap();
        toast.success("Batch updated");
      } else {
        await createBatch({ course, ...payload }).unwrap();
        toast.success("Batch created");
      }
      setFormOpen(false);
    } catch (err) {
      const e = err as { status?: number; data?: { message?: string; errorSources?: { message: string }[] } };
      const duplicateKey = e.data?.message?.toLowerCase().includes("duplicate");
      toast.error(
        e.status === 401 || e.status === 403
          ? "Your login has expired. Log in again and retry."
          : duplicateKey
            ? "This course already has a batch with this number and mode"
            : e.data?.errorSources?.[0]?.message || e.data?.message || "Could not save the batch"
      );
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteBatch(id).unwrap();
      toast.success("Batch deleted");
    } catch {
      toast.error("Could not delete the batch");
    } finally {
      setConfirmDelete(null);
    }
  };

  const inheritedPlans = coursePlans(formCourse);

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
      <Toaster richColors position="top-center" />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dates, Fees &amp; Plans</h1>
          <p className="mt-1 text-sm text-zinc-500">Batches, fees and discounts for every course. Changes show on the website right away.</p>
        </div>
        <button
          type="button"
          onClick={() => openCreate()}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
          <CalendarPlus className="h-4 w-4" /> Add batch
        </button>
      </div>

      <DefaultPlansPanel exampleFee={10000} />

      {coursesWithoutBatch.length ? (
        <details className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-900">
          <summary className="cursor-pointer font-semibold">
            {coursesWithoutBatch.length} course{coursesWithoutBatch.length > 1 ? "s have" : " has"} no open batch on the website
          </summary>
          <p className="mt-1 text-amber-800">Visitors see &quot;date to be announced&quot; and the regular fee. Add a batch:</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {coursesWithoutBatch.map((c) => (
              <button
                key={c._id}
                type="button"
                onClick={() => openCreate({ course: c._id })}
                className="rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs font-medium hover:bg-amber-100">
                + {c.title}
              </button>
            ))}
          </div>
        </details>
      ) : null}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            id="batch-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search course, days, location"
            className={`${inputCls} pl-9`}
          />
        </div>
        <select id="batch-course-filter" value={courseFilter} onChange={(e) => setCourseFilter(e.target.value)} className={`${inputCls} w-auto max-w-xs`}>
          <option value="">All courses</option>
          {courses.map((c) => (
            <option key={c._id} value={c._id}>
              {c.title}
            </option>
          ))}
        </select>
        <select id="batch-mode-filter" value={modeFilter} onChange={(e) => setModeFilter(e.target.value)} className={`${inputCls} w-auto`}>
          <option value="">All modes</option>
          {MODES.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
        <label className="flex items-center gap-2 px-1 text-sm text-zinc-600">
          <input type="checkbox" checked={showHidden} onChange={(e) => setShowHidden(e.target.checked)} className="h-4 w-4 accent-red-600" />
          Show closed &amp; past ({hiddenCount})
        </label>
      </div>

      {/* Courses with their fee, plans and batches */}
      {isLoading ? (
        <p className="rounded-xl border border-zinc-200 bg-white px-4 py-10 text-center text-sm text-zinc-500">Loading…</p>
      ) : isError ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-center text-sm text-red-700">
          {loadErrorStatus === 404 ? (
            <>
              This API server doesn&apos;t have Course Batches yet. The website is connected to{" "}
              <code className="rounded bg-white px-1">{API_BASE_URL}</code>. Deploy the updated server, or point{" "}
              <code className="rounded bg-white px-1">NEXT_PUBLIC_API_BASE_URL</code> to a server that has it.
            </>
          ) : loadErrorStatus === 401 || loadErrorStatus === 403 ? (
            "Your login has expired or this account is not an admin. Log in again as an admin and reload the page."
          ) : (
            "Could not reach the API server. Check that it is running and reload the page."
          )}
        </p>
      ) : courseGroups.length === 0 ? (
        <p className="rounded-xl border border-zinc-200 bg-white px-4 py-10 text-center text-sm text-zinc-500">No courses match these filters.</p>
      ) : (
        <div className="space-y-4">
          {courseGroups.map(({ course: c, rows }) => {
            const cPlans = coursePlans(c);
            const ownCoursePlans = Boolean(c.paymentPlans?.length);
            return (
              <section key={c._id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-100 bg-zinc-50/70 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-2 font-semibold text-zinc-900">
                      <span className="truncate">{c.title}</span>
                      {c.slug ? (
                        <Link href={`/courses/${c.slug}`} target="_blank" title="View course page" className="shrink-0 text-zinc-400 hover:text-zinc-900">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      ) : null}
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
                      <span>{c.courseType === "one-to-one" ? "One to one" : "Regular course"}</span>
                      <span className="font-medium text-zinc-700">Fee {c.courseFee ? taka(c.courseFee) : "not set"}</span>
                      <span className="flex items-center gap-1.5">
                        {ownCoursePlans ? "Course plans:" : "Default plans:"} <PlanChips plans={cPlans} />
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPricingCourse(c)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 hover:border-zinc-400">
                      <Wallet className="h-4 w-4" /> Course fee &amp; plans
                    </button>
                    <button
                      type="button"
                      onClick={() => openCreate({ course: c._id })}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-zinc-700">
                      <CalendarPlus className="h-4 w-4" /> Add batch
                    </button>
                  </div>
                </header>

                {rows.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] text-sm">
                      <thead className="text-left text-[11px] uppercase tracking-wide text-zinc-500">
                        <tr>
                          <th className="px-4 py-2 font-medium">Batch</th>
                          <th className="px-4 py-2 font-medium">Days &amp; time</th>
                          <th className="px-4 py-2 font-medium">Fee &amp; plans</th>
                          <th className="px-4 py-2 font-medium">Status</th>
                          <th className="px-4 py-2 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {rows.map((b) => {
                          const status = STATUSES.find((s) => s.value === b.status);
                          const live = isLive(b);
                          const own = Boolean(b.paymentPlans?.length);
                          const plans = own ? (b.paymentPlans || []).filter((p) => p.isActive !== false) : cPlans;
                          return (
                            <tr key={b._id} className={live ? "align-top" : "bg-zinc-50/60 align-top text-zinc-500"}>
                              <td className="px-4 py-3">
                                <span className="block font-medium text-zinc-900">
                                  {MODES.find((m) => m.value === b.mode)?.label}
                                  {!AUTO_BATCH_NO.test(b.batchNo) ? <span className="ml-1.5 text-xs font-normal text-zinc-400">#{b.batchNo}</span> : null}
                                </span>
                                <span className="text-xs text-zinc-500">
                                  {b.startAnytime ? (
                                    <span className="font-medium text-sky-700">Start anytime</span>
                                  ) : b.startDate ? (
                                    `Starts ${prettyDate(b.startDate)}`
                                  ) : (
                                    "Date to be announced"
                                  )}
                                </span>
                              </td>
                              <td className="max-w-[220px] px-4 py-3">
                                <span className="block truncate">{b.classDays || "—"}</span>
                                <span className="block truncate text-xs text-zinc-500">{b.classTime}</span>
                              </td>
                              <td className="px-4 py-3">
                                <span className="block font-semibold tabular-nums text-zinc-900">{taka(b.fee || 0)}</span>
                                <span className="mt-1 block">
                                  <PlanChips plans={plans} own={own} />
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${status?.className}`}>
                                  {status?.label.split(" (")[0]}
                                </span>
                                {!b.isPublished ? <span className="ml-1.5 text-xs text-zinc-500">Draft</span> : null}
                                <span className="mt-0.5 block text-[11px] text-zinc-500">
                                  {live ? <span className="text-emerald-700">On website</span> : "Hidden"}
                                  {b.seatsTotal ? ` · ${b.seatsBooked || 0}/${b.seatsTotal} seats` : ""}
                                </span>
                              </td>
                              <td className="whitespace-nowrap px-4 py-3 text-right">
                                {confirmDelete === b._id ? (
                                  <span className="inline-flex items-center gap-2">
                                    <span className="text-xs text-zinc-600">Delete?</span>
                                    <button type="button" onClick={() => remove(b._id)} className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700">
                                      Delete
                                    </button>
                                    <button type="button" onClick={() => setConfirmDelete(null)} className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium hover:bg-zinc-50">
                                      Cancel
                                    </button>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1">
                                    <button type="button" onClick={() => openEdit(b)} title="Edit" className={iconBtn}>
                                      <Pencil className="h-4 w-4" />
                                    </button>
                                    <button type="button" onClick={() => duplicate(b)} title="Duplicate as new batch" className={iconBtn}>
                                      <Copy className="h-4 w-4" />
                                    </button>
                                    <button type="button" onClick={() => setConfirmDelete(b._id)} title="Delete" className="rounded-md p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600">
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="px-4 py-3 text-sm text-zinc-500">
                    No {showHidden ? "" : "open "}batches. Students see &quot;date to be announced&quot;.{" "}
                    <button type="button" onClick={() => openCreate({ course: c._id })} className="font-medium text-red-600 hover:underline">
                      Add a batch
                    </button>
                  </p>
                )}
              </section>
            );
          })}
        </div>
      )}

      <CoursePricingDialog course={pricingCourse} defaultPlans={defaultPlans} onClose={() => setPricingCourse(null)} />

      {/* Create / edit form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit batch" : "Add batch"}</DialogTitle>
            <DialogDescription>{formCourse?.title || "Choose the course, when it starts, and what it costs."}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit}>
            <div className="divide-y divide-zinc-100">
              <FormSection step={1} title="Batch">
                <div className="grid gap-4 sm:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                  <Field label="Course">
                    <select
                      id="batch-form-course"
                      value={form.course}
                      disabled={!!editing}
                      onChange={(e) => {
                        const c = courses.find((x) => x._id === e.target.value);
                        setForm((f) => ({ ...f, course: e.target.value, fee: f.fee || (c?.courseFee ? String(c.courseFee) : "") }));
                      }}
                      className={`${inputCls} disabled:bg-zinc-50 disabled:text-zinc-600`}
                      required>
                      <option value="">Choose a course</option>
                      {courses.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.title}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Mode">
                    <select id="batch-form-mode" value={form.mode} onChange={(e) => set("mode", e.target.value as TDeliveryMode)} className={inputCls}>
                      {MODES.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <div>
                  <span className="mb-1 block text-sm font-medium text-zinc-700">Start</span>
                  <div className="flex flex-wrap items-center gap-2">
                    <Pills
                      value={form.startType}
                      onChange={(v) => set("startType", v)}
                      options={[
                        { value: "date", label: "Fixed date" },
                        { value: "anytime", label: "Start anytime" },
                        { value: "tba", label: "To be announced" },
                      ]}
                    />
                    {form.startType === "date" ? (
                      <input id="batch-form-start" type="date" aria-label="Start date" value={form.startDate} onChange={(e) => set("startDate", e.target.value)} className={`${inputCls} w-auto`} />
                    ) : null}
                  </div>
                  <span className="mt-1 block text-xs text-zinc-500">
                    {form.startType === "anytime"
                      ? "Students see “যেকোনো সময় শুরু করা যাবে” and can enrol any day. The batch stays open until you close it."
                      : form.startType === "tba"
                        ? form.mode === "corporate"
                          ? "Students see “আপনার সুবিধামতো সময়ে”."
                          : "Students see “তারিখ শীঘ্রই ঘোষণা করা হবে” and can still enrol."
                        : "Admission stays open for 14 days after the start date."}
                  </span>
                </div>
              </FormSection>

              <FormSection step={2} title="Class schedule">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Class days" hint="As students see it, e.g. শনিবার ও মঙ্গলবার">
                    <input id="batch-form-days" value={form.classDays} onChange={(e) => set("classDays", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Class time" hint="e.g. সন্ধ্যা ৬টা - রাত ৮টা">
                    <input id="batch-form-time" value={form.classTime} onChange={(e) => set("classTime", e.target.value)} className={inputCls} />
                  </Field>
                  {form.mode === "online" ? (
                    <Field label="Platform" hint="e.g. Zoom, Google Meet">
                      <input id="batch-form-platform" value={form.platform} onChange={(e) => set("platform", e.target.value)} className={inputCls} />
                    </Field>
                  ) : (
                    <Field label="Location" hint="Campus or branch address">
                      <input id="batch-form-location" value={form.location} onChange={(e) => set("location", e.target.value)} className={inputCls} />
                    </Field>
                  )}
                  <Field label="Registration deadline" hint="Optional">
                    <input id="batch-form-deadline" type="date" value={form.registrationDeadline} onChange={(e) => set("registrationDeadline", e.target.value)} className={inputCls} />
                  </Field>
                </div>
              </FormSection>

              <FormSection step={3} title="Fee & payment plans">
                <div className="flex flex-wrap items-end gap-4">
                  <div className="w-40">
                    <Field label="Fee (৳)">
                      <input id="batch-form-fee" type="number" min={0} value={form.fee} onChange={(e) => set("fee", e.target.value)} className={inputCls} required />
                    </Field>
                  </div>
                  <div>
                    <span className="mb-1 block text-sm font-medium text-zinc-700">Plans &amp; discount</span>
                    <Pills
                      value={form.customPlans}
                      onChange={setCustomPlans}
                      options={[
                        { value: false, label: "Same as course" },
                        { value: true, label: "Own plans for this batch" },
                      ]}
                    />
                  </div>
                </div>

                {form.customPlans ? (
                  <>
                    <p className="text-xs text-zinc-500">
                      Only this batch uses these plans. Set discount 0 for no discount, or remove a plan to hide it.
                    </p>
                    <PlanEditor rows={form.planRows} onChange={(rows) => set("planRows", rows)} previewFee={formFee || undefined} />
                  </>
                ) : (
                  <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm">
                    {inheritedPlans.length ? (
                      <ul className="space-y-1">
                        {inheritedPlans.map((p) => {
                          const price = formFee ? priceForPlan(formFee, p) : null;
                          return (
                            <li key={p.name} className="flex flex-wrap justify-between gap-x-3">
                              <span className="font-medium text-zinc-800">
                                {p.name}
                                {p.discountPercent ? <span className="text-emerald-700"> −{p.discountPercent}%</span> : null}
                              </span>
                              {price ? (
                                <span className="text-zinc-500">
                                  {taka(price.payNow)} now
                                  {price.laterInstallments ? ` + ${price.laterInstallments} × ${taka(price.perLaterInstallment)}` : ""}
                                  {" · "}total {taka(price.total)}
                                </span>
                              ) : null}
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="text-zinc-500">{form.course ? "This course has no plans yet." : "Choose a course to see its plans."}</p>
                    )}
                    <p className="mt-2 text-xs text-zinc-500">
                      From {formCourse?.paymentPlans?.length ? "the course's own plans" : "the default plans"}. Choose “Own plans for this batch” to give
                      this batch a different discount.
                    </p>
                  </div>
                )}
              </FormSection>

              <FormSection step={4} title="Seats & status">
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Status">
                    <select id="batch-form-status" value={form.status} onChange={(e) => set("status", e.target.value as TBatchStatus)} className={inputCls}>
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Total seats" hint="Empty = no limit">
                    <input id="batch-form-seats" type="number" min={0} value={form.seatsTotal} onChange={(e) => set("seatsTotal", e.target.value)} className={inputCls} />
                  </Field>
                  {editing ? (
                    <Field label="Seats booked" hint="Goes up after each online payment">
                      <input id="batch-form-booked" type="number" min={0} value={form.seatsBooked} onChange={(e) => set("seatsBooked", e.target.value)} className={inputCls} />
                    </Field>
                  ) : null}
                  {form.mode === "corporate" ? (
                    <Field label="Minimum participants">
                      <input id="batch-form-min" type="number" min={0} value={form.minParticipants} onChange={(e) => set("minParticipants", e.target.value)} className={inputCls} />
                    </Field>
                  ) : null}
                </div>
              </FormSection>

              <div className="py-4">
                <details className="rounded-lg border border-zinc-200 px-4 py-3 text-sm">
                  <summary className="cursor-pointer font-medium text-zinc-700">More options: note, batch number, learning journey dates</summary>
                  <div className="mt-3 grid gap-4 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <Field label="Note for students" hint="One short line, e.g. নিজস্ব ল্যাপটপ আবশ্যক">
                        <input id="batch-form-note" value={form.note} onChange={(e) => set("note", e.target.value)} className={inputCls} maxLength={200} />
                      </Field>
                    </div>
                    <Field label="Batch number" hint="Empty = created automatically">
                      <input id="batch-form-no" value={form.batchNo} onChange={(e) => set("batchNo", e.target.value)} placeholder="e.g. 12" className={inputCls} />
                    </Field>
                    <Field label="Classes end">
                      <input id="batch-form-end" type="date" value={form.endDate} onChange={(e) => set("endDate", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="On-job training starts">
                      <input id="batch-form-ojt" type="date" value={form.onJobTrainingStart} onChange={(e) => set("onJobTrainingStart", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="On-job training ends">
                      <input id="batch-form-ojt-end" type="date" value={form.onJobTrainingEnd} onChange={(e) => set("onJobTrainingEnd", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Certification">
                      <input id="batch-form-cert" type="date" value={form.certificationDate} onChange={(e) => set("certificationDate", e.target.value)} className={inputCls} />
                    </Field>
                    <Field label="Internship starts">
                      <input id="batch-form-intern" type="date" value={form.internshipStartDate} onChange={(e) => set("internshipStartDate", e.target.value)} className={inputCls} />
                    </Field>
                  </div>
                </details>
              </div>
            </div>

            <div className="sticky bottom-0 -mx-6 -mb-6 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-200 bg-white px-6 py-3">
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  id="batch-form-published"
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => set("isPublished", e.target.checked)}
                  className="h-4 w-4 accent-red-600"
                />
                Show on the website
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setFormOpen(false)} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating || updating}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:bg-zinc-300">
                  {creating || updating ? "Saving…" : editing ? "Save changes" : "Create batch"}
                </button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
