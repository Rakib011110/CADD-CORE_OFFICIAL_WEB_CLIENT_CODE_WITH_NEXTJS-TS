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
import DefaultPlansPanel from "@/components/pages/DatesFees/DefaultPlansPanel";
import CoursePricingDialog, { PricedCourse } from "@/components/pages/DatesFees/CoursePricingDialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/UI/dialog";
import { API_BASE_URL } from "@/lib/apiBase";

type CourseOption = PricedCourse & { courseType?: string };

const MODES: { value: TDeliveryMode; label: string }[] = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Offline" },
  { value: "weekend", label: "Weekend" },
  { value: "corporate", label: "Corporate (Friday)" },
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

const inputCls =
  "w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

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
    batchNo: b.batchNo,
    startType: b.startAnytime ? "anytime" : b.startDate ? "date" : "tba",
    startDate: toInputDate(b.startDate),
    endDate: toInputDate(b.endDate),
    registrationDeadline: toInputDate(b.registrationDeadline),
    classDays: b.classDays || "",
    classTime: b.classTime || "",
    location: b.location || "",
    platform: b.platform || "",
    fee: String(b.fee ?? ""),
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

  // Copy days, time, fee etc. into a new batch; dates and batch number are left for the admin
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.course) return toast.error("Choose a course");
    if (form.startType === "date" && !form.startDate) return toast.error("Choose the start date, or pick Start anytime / Date to be announced");
    if (form.fee === "" || Number(form.fee) < 0) return toast.error("Enter the fee for this batch");
    const { course, startType, ...rest } = form;
    const payload = {
      ...rest,
      batchNo: rest.batchNo.trim(),
      startAnytime: startType === "anytime",
      startDate: startType === "date" ? rest.startDate : "",
      fee: Number(form.fee),
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
      const e = err as { data?: { message?: string; errorSources?: { message: string }[] } };
      const duplicateKey = e.data?.message?.toLowerCase().includes("duplicate");
      toast.error(
        duplicateKey
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

  return (
    <div className="mx-auto max-w-7xl space-y-5 p-4 sm:p-6">
      <Toaster richColors position="top-center" />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Dates, Fees &amp; Plans</h1>
          <p className="mt-1 max-w-3xl text-sm text-zinc-500">
            One place for everything students see about when a course starts and what it costs: the regular fee, payment
            plans with discounts, and batches (online, offline, weekend, corporate, one to one). Changes show on the website
            right away.
          </p>
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
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-semibold">
            {coursesWithoutBatch.length} course{coursesWithoutBatch.length > 1 ? "s have" : " has"} no open batch on the
            website
          </p>
          <p className="mt-0.5 text-amber-800">Visitors see &quot;date to be announced&quot; and the regular fee. Add a batch:</p>
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
        </div>
      ) : null}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            id="batch-search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search course, batch number, days, location"
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
            const ownPlans = (c.paymentPlans || []).filter((p) => p.isActive !== false);
            const planText = ownPlans.length
              ? `Custom plans: ${ownPlans.map((p) => `${p.name}${p.discountPercent ? ` −${p.discountPercent}%` : ""}`).join(", ")}`
              : "Default plans";
            return (
              <section key={c._id} className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
                <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-zinc-100 bg-zinc-50/70 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-zinc-900">{c.title}</p>
                    <p className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-zinc-500">
                      <span>{c.courseType === "one-to-one" ? "One to one" : "Regular course"}</span>
                      <span className="font-medium text-zinc-700">
                        Fee {c.courseFee ? `৳${c.courseFee.toLocaleString("en-IN")}` : "not set"}
                      </span>
                      <span className={ownPlans.length ? "text-sky-700" : ""}>{planText}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setPricingCourse(c)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 hover:border-zinc-400">
                      <Wallet className="h-4 w-4" /> Fee &amp; plans
                    </button>
                    <button
                      type="button"
                      onClick={() => openCreate({ course: c._id })}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 hover:border-zinc-400">
                      <CalendarPlus className="h-4 w-4" /> Batch
                    </button>
                    {c.slug ? (
                      <Link
                        href={`/courses/${c.slug}`}
                        target="_blank"
                        title="View course page"
                        className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    ) : null}
                  </div>
                </header>

                {rows.length ? (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[820px] text-sm">
                      <thead className="text-left text-[11px] uppercase tracking-wide text-zinc-500">
                        <tr>
                          <th className="px-4 py-2 font-medium">Mode</th>
                          <th className="px-4 py-2 font-medium">Start</th>
                          <th className="px-4 py-2 font-medium">Days &amp; time</th>
                          <th className="px-4 py-2 text-right font-medium">Fee</th>
                          <th className="px-4 py-2 font-medium">Seats</th>
                          <th className="px-4 py-2 font-medium">Status</th>
                          <th className="px-4 py-2 text-right font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100">
                        {rows.map((b) => {
                          const status = STATUSES.find((s) => s.value === b.status);
                          const live = isLive(b);
                          return (
                            <tr key={b._id} className={live ? "" : "bg-zinc-50/60 text-zinc-500"}>
                              <td className="px-4 py-2.5">
                                <span className="block font-medium text-zinc-900">{MODES.find((m) => m.value === b.mode)?.label}</span>
                                <span className="text-xs text-zinc-500">#{b.batchNo}</span>
                              </td>
                              <td className="whitespace-nowrap px-4 py-2.5">
                                {b.startAnytime ? (
                                  <span className="font-medium text-sky-700">Start anytime</span>
                                ) : b.startDate ? (
                                  prettyDate(b.startDate)
                                ) : (
                                  <span className="text-zinc-500">To be announced</span>
                                )}
                              </td>
                              <td className="max-w-[220px] px-4 py-2.5">
                                <span className="block truncate">{b.classDays || "—"}</span>
                                <span className="block truncate text-xs text-zinc-500">{b.classTime}</span>
                              </td>
                              <td className="whitespace-nowrap px-4 py-2.5 text-right font-medium tabular-nums">৳{b.fee?.toLocaleString("en-IN")}</td>
                              <td className="whitespace-nowrap px-4 py-2.5 tabular-nums">{b.seatsTotal ? `${b.seatsBooked || 0} / ${b.seatsTotal}` : "—"}</td>
                              <td className="px-4 py-2.5">
                                <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${status?.className}`}>
                                  {status?.label.split(" (")[0]}
                                </span>
                                {!b.isPublished ? <span className="ml-1.5 text-xs text-zinc-500">Draft</span> : null}
                                {live ? <span className="mt-0.5 block text-[11px] text-emerald-700">On website</span> : null}
                              </td>
                              <td className="whitespace-nowrap px-4 py-2.5 text-right">
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
                                    <button type="button" onClick={() => duplicate(b)} title="Duplicate as new batch" className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
                                      <Copy className="h-4 w-4" />
                                    </button>
                                    <button type="button" onClick={() => openEdit(b)} title="Edit" className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
                                      <Pencil className="h-4 w-4" />
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
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit batch" : "Add batch"}</DialogTitle>
            <DialogDescription>
              The fee is the regular fee. Payment-plan discounts (e.g. full payment) are applied on top automatically.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Course">
                  <select
                    id="batch-form-course"
                    value={form.course}
                    disabled={!!editing}
                    onChange={(e) => {
                      const c = courses.find((x) => x._id === e.target.value);
                      setForm((f) => ({ ...f, course: e.target.value, fee: f.fee || (c?.courseFee ? String(c.courseFee) : "") }));
                    }}
                    className={inputCls}
                    required>
                    <option value="">Choose a course</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.title}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
              <Field label="Mode">
                <select id="batch-form-mode" value={form.mode} onChange={(e) => set("mode", e.target.value as TDeliveryMode)} className={inputCls}>
                  {MODES.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Batch number (optional)" hint="Leave empty and it is created automatically">
                <input id="batch-form-no" value={form.batchNo} onChange={(e) => set("batchNo", e.target.value)} placeholder="e.g. OFFLINE-2026-11" className={inputCls} />
              </Field>
              <div className="sm:col-span-2">
                <span className="mb-1 block text-sm font-medium text-zinc-700">When does it start?</span>
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { value: "date", label: "Fixed date" },
                      { value: "anytime", label: "Start anytime" },
                      { value: "tba", label: "Date to be announced" },
                    ] as const
                  ).map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      onClick={() => set("startType", o.value)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                        form.startType === o.value ? "border-red-600 bg-red-50 text-red-700" : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                      }`}>
                      {o.label}
                    </button>
                  ))}
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
                      : "Upcoming batches stay open for 14 days after the start date."}
                </span>
              </div>
              <Field label="Registration deadline">
                <input id="batch-form-deadline" type="date" value={form.registrationDeadline} onChange={(e) => set("registrationDeadline", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Class days" hint="As shown to students, e.g. শনিবার ও মঙ্গলবার">
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
              <Field label="Fee (৳)">
                <input id="batch-form-fee" type="number" min={0} value={form.fee} onChange={(e) => set("fee", e.target.value)} className={inputCls} required />
              </Field>
              <Field label="Total seats" hint="Leave empty for no limit">
                <input id="batch-form-seats" type="number" min={0} value={form.seatsTotal} onChange={(e) => set("seatsTotal", e.target.value)} className={inputCls} />
              </Field>
              {editing ? (
                <Field label="Seats booked" hint="Increases automatically after each online payment">
                  <input id="batch-form-booked" type="number" min={0} value={form.seatsBooked} onChange={(e) => set("seatsBooked", e.target.value)} className={inputCls} />
                </Field>
              ) : null}
              {form.mode === "corporate" ? (
                <Field label="Minimum participants">
                  <input id="batch-form-min" type="number" min={0} value={form.minParticipants} onChange={(e) => set("minParticipants", e.target.value)} className={inputCls} />
                </Field>
              ) : null}
              <Field label="Status" hint="Upcoming batches stay open for 14 days after the start date. Set Running to keep admission open longer.">
                <select id="batch-form-status" value={form.status} onChange={(e) => set("status", e.target.value as TBatchStatus)} className={inputCls}>
                  {STATUSES.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>
              <div className="sm:col-span-2">
                <Field label="Note for students" hint="One short line, e.g. নিজস্ব ল্যাপটপ আবশ্যক">
                  <input id="batch-form-note" value={form.note} onChange={(e) => set("note", e.target.value)} className={inputCls} maxLength={200} />
                </Field>
              </div>
            </div>

            <details className="rounded-lg border border-zinc-200 px-4 py-3 text-sm">
              <summary className="cursor-pointer font-medium text-zinc-700">Learning journey dates (optional)</summary>
              <div className="mt-3 grid gap-4 sm:grid-cols-2">
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

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4">
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
