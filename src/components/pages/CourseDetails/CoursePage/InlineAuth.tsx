"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useUserLogin, useUserRegistration } from "@/hooks/auth.hook";

const DEFAULT_PHOTO = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
const inputCls =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20";

/**
 * Login or create an account inside the checkout, so the visitor never leaves it.
 * The auth hooks show errors and update the logged-in user; `onDone` runs on success.
 * The form has no button of its own: the checkout's main button submits it (`formId`).
 */
export default function InlineAuth({
  formId,
  onDone,
  onStateChange,
}: {
  formId: string;
  onDone: () => void;
  onStateChange?: (s: { mode: "login" | "register"; busy: boolean }) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", mobileNumber: "", password: "" });
  const { mutate: login, isPending: loggingIn } = useUserLogin();
  const { mutate: register, isPending: registering } = useUserRegistration();
  const busy = loggingIn || registering;

  useEffect(() => {
    onStateChange?.({ mode, busy });
  }, [mode, busy, onStateChange]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [key]: e.target.value }));
  const done = (res: { success?: boolean }) => {
    if (res?.success !== false) onDone();
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "login") {
      login({ email: form.email.trim(), password: form.password }, { onSuccess: done });
    } else {
      localStorage.setItem("emailForVerification", form.email.trim());
      register(
        { name: form.name.trim(), email: form.email.trim(), mobileNumber: form.mobileNumber.trim(), password: form.password, profilePhoto: DEFAULT_PHOTO },
        { onSuccess: done }
      );
    }
  };

  return (
    <form id={formId} onSubmit={submit} className="space-y-2.5">
      <div className="grid grid-cols-2 rounded-lg bg-zinc-100 p-1 text-sm font-medium" role="tablist">
        {(
          [
            { value: "login", label: "লগইন" },
            { value: "register", label: "নতুন অ্যাকাউন্ট" },
          ] as const
        ).map((t) => (
          <button
            key={t.value}
            type="button"
            role="tab"
            aria-selected={mode === t.value}
            onClick={() => setMode(t.value)}
            className={`rounded-md py-1.5 transition ${mode === t.value ? "bg-white text-red-600 shadow-sm" : "text-zinc-600 hover:text-zinc-900"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {mode === "register" ? (
        <div className="grid gap-2.5 sm:grid-cols-2">
          <input aria-label="আপনার নাম" placeholder="আপনার নাম" value={form.name} onChange={set("name")} required className={inputCls} autoComplete="name" />
          <input aria-label="মোবাইল নম্বর" placeholder="মোবাইল নম্বর" value={form.mobileNumber} onChange={set("mobileNumber")} required inputMode="tel" className={inputCls} autoComplete="tel" />
        </div>
      ) : null}
      <input aria-label="ইমেইল" type="email" placeholder="ইমেইল" value={form.email} onChange={set("email")} required className={inputCls} autoComplete="email" />
      <div className="relative">
        <input
          aria-label="পাসওয়ার্ড"
          type={showPassword ? "text" : "password"}
          placeholder="পাসওয়ার্ড"
          value={form.password}
          onChange={set("password")}
          required
          minLength={mode === "register" ? 6 : undefined}
          className={`${inputCls} pr-10`}
          autoComplete={mode === "login" ? "current-password" : "new-password"}
        />
        <button
          type="button"
          onClick={() => setShowPassword((s) => !s)}
          aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখুন"}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700">
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </form>
  );
}
