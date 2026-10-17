"use client";

import { useState } from "react";
import { toast, Toaster } from "sonner";
import { CalendarPlus, Pencil, Repeat, Trash2, X } from "lucide-react";
import {
  useCreateSeminarMutation,
  useDeleteseminarMutation,
  useGetAllSeminarQuery,
  useUpdateseminarMutation,
} from "@/redux/api/seminarApi";
import { useGetAllCourseQuery } from "@/redux/api/courseApi";
import { TSeminar, TSeminarRepeat } from "@/lib/types/TSeminars";
import { seminarDateEn, seminarInstant, upcomingSessions } from "@/lib/seminarSchedule";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/UI/dialog";

const emptyForm = {
  topic: "",
  place: "ONLINE",
  date: "",
  time: "21:00",
  durationMinutes: "90",
  repeat: "weekly" as TSeminarRepeat,
  repeatEveryWeeks: "1",
  repeatUntil: "",
  skipDates: [] as string[],
  registrationUrl: "",
  isActive: true,
};
type FormState = typeof emptyForm;

const STATUS_BADGE = {
  upcoming: { label: "Upcoming", className: "bg-blue-50 text-blue-700" },
  live: { label: "Running now", className: "bg-emerald-50 text-emerald-700" },
  ended: { label: "Ended", className: "bg-zinc-100 text-zinc-500" },
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

const repeatText = (s: Pick<TSeminar, "repeat" | "repeatEveryWeeks" | "repeatUntil">) => {
  if (s.repeat !== "weekly") return "One time";
  const every = s.repeatEveryWeeks || 1;
  const base = every === 1 ? "Every week" : `Every ${every} weeks`;
  return s.repeatUntil ? `${base} until ${s.repeatUntil}` : base;
};

export default function SeminarManagerPage() {
  const { data, isLoading, isError } = useGetAllSeminarQuery(undefined);
  const { data: coursesRes } = useGetAllCourseQuery({});
  const [createSeminar, { isLoading: creating }] = useCreateSeminarMutation();
  const [updateSeminar, { isLoading: updating }] = useUpdateseminarMutation();
  const [deleteSeminar] = useDeleteseminarMutation();

  const seminars: TSeminar[] = data?.data || [];
  const courseTitles: string[] = (coursesRes?.data || []).map((c: { title: string }) => c.title);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<TSeminar | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [skipInput, setSkipInput] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) => setForm((f) => ({ ...f, [key]: value }));

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setSkipInput("");
    setFormOpen(true);
  };

  const openEdit = (s: TSeminar) => {
    setEditing(s);
    setForm({
      topic: s.topic,
      place: s.place,
      date: s.date,
      time: s.time,
      durationMinutes: String(s.durationMinutes || 90),
      repeat: s.repeat || "none",
      repeatEveryWeeks: String(s.repeatEveryWeeks || 1),
      repeatUntil: s.repeatUntil || "",
      skipDates: s.skipDates || [],
      registrationUrl: s.registrationUrl || "",
      isActive: s.isActive !== false,
    });
    setSkipInput("");
    setFormOpen(true);
  };

  const addSkipDate = () => {
    if (!skipInput || form.skipDates.includes(skipInput)) return;
    set("skipDates", [...form.skipDates, skipInput].sort());
    setSkipInput("");
  };

  // Next sessions for the settings being edited
  const formSchedule = {
    ...form,
    durationMinutes: Number(form.durationMinutes) || 90,
    repeatEveryWeeks: Number(form.repeatEveryWeeks) || 1,
  };
  const preview = form.date && form.time ? upcomingSessions(formSchedule, 4) : [];
  const firstIsPast = form.date && form.time && seminarInstant(form.date, form.time) < new Date();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.topic.trim()) return toast.error("Enter the seminar topic");
    if (!form.date || !form.time) return toast.error("Choose the date and time");
    const payload = {
      ...form,
      durationMinutes: Number(form.durationMinutes) || 90,
      repeatEveryWeeks: Number(form.repeatEveryWeeks) || 1,
    };
    try {
      if (editing) {
        await updateSeminar({ id: editing._id, seminarData: payload }).unwrap();
        toast.success("Seminar updated");
      } else {
        await createSeminar(payload).unwrap();
        toast.success("Seminar created");
      }
      setFormOpen(false);
    } catch (err) {
      const e = err as { status?: number; data?: { message?: string; errorSources?: { message: string }[] } };
      toast.error(
        e.status === 401 || e.status === 403
          ? "Your login has expired or this account can't manage seminars. Log in again."
          : e.data?.errorSources?.[0]?.message || e.data?.message || "Could not save the seminar"
      );
    }
  };

  const remove = async (id: string) => {
    try {
      await deleteSeminar(id).unwrap();
      toast.success("Seminar deleted");
    } catch {
      toast.error("Could not delete the seminar");
    } finally {
      setConfirmDelete(null);
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-4 sm:p-6">
      <Toaster richColors position="top-center" />

      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">Seminars</h1>
          <p className="mt-1 max-w-2xl text-sm text-zinc-500">
            Weekly seminars move to the next date by themselves once a session is over. The home page always shows the
            next session with its day, date and countdown (Bangladesh time).
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">
          <CalendarPlus className="h-4 w-4" /> Add seminar
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3 font-medium">Topic</th>
              <th className="px-4 py-3 font-medium">Next session</th>
              <th className="px-4 py-3 font-medium">Repeats</th>
              <th className="px-4 py-3 font-medium">Place</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">Loading seminars…</td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-red-600">Could not load seminars. Reload the page.</td>
              </tr>
            ) : seminars.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-500">No seminars yet. Add the first one.</td>
              </tr>
            ) : (
              seminars.map((s) => {
                // Older API versions don't send the next session; work it out here
                const next = s.nextStartsAt ? new Date(s.nextStartsAt) : upcomingSessions(s, 1)[0];
                const status = s.status || (next ? "upcoming" : "ended");
                const badge = STATUS_BADGE[status];
                const hidden = s.isActive === false;
                return (
                  <tr key={s._id} className={hidden || status === "ended" ? "bg-zinc-50/60 text-zinc-500" : ""}>
                    <td className="max-w-[280px] px-4 py-3">
                      <span className="block truncate font-medium text-zinc-900">{s.topic}</span>
                      <span className="text-xs text-zinc-500">First session {s.date}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">{next ? seminarDateEn(next) : "—"}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5">
                        {s.repeat === "weekly" ? <Repeat className="h-3.5 w-3.5 text-sky-600" /> : null}
                        {repeatText(s)}
                      </span>
                      {s.skipDates?.length ? (
                        <span className="block text-xs text-zinc-500">Skips {s.skipDates.length} date(s)</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3">{s.place}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${badge.className}`}>{badge.label}</span>
                      {hidden ? <span className="mt-0.5 block text-[11px] text-zinc-500">Hidden from website</span> : null}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right">
                      {confirmDelete === s._id ? (
                        <span className="inline-flex items-center gap-2">
                          <span className="text-xs text-zinc-600">Delete?</span>
                          <button type="button" onClick={() => remove(s._id)} className="rounded-md bg-red-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-700">
                            Delete
                          </button>
                          <button type="button" onClick={() => setConfirmDelete(null)} className="rounded-md border border-zinc-300 px-2.5 py-1 text-xs font-medium hover:bg-zinc-50">
                            Cancel
                          </button>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1">
                          <button type="button" onClick={() => openEdit(s)} title="Edit" className="rounded-md p-1.5 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900">
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button type="button" onClick={() => setConfirmDelete(s._id)} title="Delete" className="rounded-md p-1.5 text-zinc-500 hover:bg-red-50 hover:text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto bg-white sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit seminar" : "Add seminar"}</DialogTitle>
            <DialogDescription>Dates and times are Bangladesh time.</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Topic" hint="Pick a course or type any topic">
                  <input id="seminar-topic" list="seminar-topic-options" value={form.topic} onChange={(e) => set("topic", e.target.value)} className={inputCls} maxLength={200} />
                  <datalist id="seminar-topic-options">
                    {courseTitles.map((t) => (
                      <option key={t} value={t} />
                    ))}
                  </datalist>
                </Field>
              </div>
              <Field label="Place" hint="ONLINE, or the campus address">
                <input id="seminar-place" value={form.place} onChange={(e) => set("place", e.target.value)} className={inputCls} maxLength={200} />
              </Field>
              <Field label="Length (minutes)" hint="The next date shows once this time has passed">
                <input id="seminar-duration" type="number" min={15} max={600} value={form.durationMinutes} onChange={(e) => set("durationMinutes", e.target.value)} className={inputCls} />
              </Field>
              <Field label={form.repeat === "weekly" ? "First session date" : "Date"}>
                <input id="seminar-date" type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} />
              </Field>
              <Field label="Start time">
                <input id="seminar-time" type="time" value={form.time} onChange={(e) => set("time", e.target.value)} className={inputCls} />
              </Field>
            </div>

            {/* Repeat settings */}
            <div className="space-y-4 rounded-lg border border-zinc-200 p-4">
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    { value: "weekly", label: "Repeats weekly" },
                    { value: "none", label: "One time" },
                  ] as const
                ).map((o) => (
                  <button
                    key={o.value}
                    type="button"
                    onClick={() => set("repeat", o.value)}
                    className={`rounded-full border px-3 py-1.5 text-sm font-medium ${
                      form.repeat === o.value ? "border-red-600 bg-red-50 text-red-700" : "border-zinc-300 text-zinc-600 hover:bg-zinc-50"
                    }`}>
                    {o.label}
                  </button>
                ))}
              </div>

              {form.repeat === "weekly" ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Repeat every">
                    <select id="seminar-every" value={form.repeatEveryWeeks} onChange={(e) => set("repeatEveryWeeks", e.target.value)} className={inputCls}>
                      {[1, 2, 3, 4].map((n) => (
                        <option key={n} value={n}>
                          {n === 1 ? "Week" : `${n} weeks`}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Stop after (optional)" hint="Leave empty to repeat until you stop it">
                    <input id="seminar-until" type="date" value={form.repeatUntil} onChange={(e) => set("repeatUntil", e.target.value)} className={inputCls} />
                  </Field>
                  <div className="sm:col-span-2">
                    <Field label="Skip dates (optional)" hint="No session on these dates, e.g. holidays. The website shows the session after.">
                      <span className="flex gap-2">
                        <input id="seminar-skip" type="date" value={skipInput} onChange={(e) => setSkipInput(e.target.value)} className={inputCls} />
                        <button type="button" onClick={addSkipDate} className="shrink-0 rounded-md border border-zinc-300 px-3 text-sm font-medium hover:bg-zinc-50">
                          Add
                        </button>
                      </span>
                    </Field>
                    {form.skipDates.length ? (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {form.skipDates.map((d) => (
                          <span key={d} className="inline-flex items-center gap-1 rounded-full bg-zinc-100 py-0.5 pl-2.5 pr-1 text-xs font-medium text-zinc-700">
                            {d}
                            <button type="button" onClick={() => set("skipDates", form.skipDates.filter((x) => x !== d))} aria-label={`Remove ${d}`} className="rounded-full p-0.5 hover:bg-zinc-200">
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {/* Preview */}
              {form.date && form.time ? (
                <div className="rounded-md bg-zinc-50 px-3 py-2.5 text-sm">
                  {preview.length ? (
                    <>
                      <p className="font-medium text-zinc-800">The website will show: {seminarDateEn(preview[0])}</p>
                      {preview.length > 1 ? (
                        <p className="mt-0.5 text-xs text-zinc-500">Then: {preview.slice(1).map(seminarDateEn).join(" · ")}</p>
                      ) : null}
                    </>
                  ) : (
                    <p className="font-medium text-amber-700">
                      {firstIsPast && form.repeat !== "weekly"
                        ? "This date has passed, so the seminar won't show on the website. Choose a new date or make it weekly."
                        : "No upcoming session with these settings, so it won't show on the website."}
                    </p>
                  )}
                </div>
              ) : null}
            </div>

            <Field label="Registration link (optional)" hint="Leave empty to use the default seminar registration form">
              <input id="seminar-url" type="url" value={form.registrationUrl} onChange={(e) => set("registrationUrl", e.target.value)} placeholder="https://" className={inputCls} />
            </Field>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-4">
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input id="seminar-active" type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="h-4 w-4 accent-red-600" />
                Show on the website
              </label>
              <div className="flex gap-2">
                <button type="button" onClick={() => setFormOpen(false)} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-medium hover:bg-zinc-50">
                  Cancel
                </button>
                <button type="submit" disabled={creating || updating} className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60">
                  {creating || updating ? "Saving…" : editing ? "Save changes" : "Add seminar"}
                </button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
