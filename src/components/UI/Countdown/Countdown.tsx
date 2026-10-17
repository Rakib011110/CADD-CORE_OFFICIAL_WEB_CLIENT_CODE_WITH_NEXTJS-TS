"use client";

import { Fragment, useEffect, useRef, useState } from "react";

interface CountdownProps {
  startsAt: string; // ISO time of the session
  endsAt?: string; // ISO time the session is over
  onEnd?: () => void; // called once the session is over, e.g. to load the next date
}

const bn = (n: number) => n.toLocaleString("bn-BD", { minimumIntegerDigits: 2 });

// Digital clock style "০২ : ২২ : ৫১ : ৪৮" under a label, or a "running now" panel of the same height
export default function Countdown({ startsAt, endsAt, onEnd }: CountdownProps) {
  const [now, setNow] = useState(() => Date.now());
  const ended = useRef(false);

  useEffect(() => {
    ended.current = false;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [startsAt]);

  const start = new Date(startsAt).getTime();
  const end = endsAt ? new Date(endsAt).getTime() : start;

  useEffect(() => {
    if (now >= end && !ended.current) {
      ended.current = true;
      onEnd?.();
    }
  }, [now, end, onEnd]);

  if (now >= start) {
    return (
      <span className="flex h-[5.25rem] w-full items-center justify-center gap-2.5 rounded-2xl bg-emerald-50 font-semibold text-emerald-700">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
        </span>
        সেমিনার এখন চলছে
      </span>
    );
  }

  const s = Math.floor((start - now) / 1000);
  const parts = [
    { value: Math.floor(s / 86400), label: "দিন" },
    { value: Math.floor((s % 86400) / 3600), label: "ঘণ্টা" },
    { value: Math.floor((s % 3600) / 60), label: "মিনিট" },
    { value: s % 60, label: "সেকেন্ড" },
  ];

  return (
    <span className="block h-[5.25rem]">
      <span className="mb-2.5 block text-center text-xs font-medium text-zinc-500">শুরু হতে বাকি</span>
      <span className="flex w-full items-start justify-between" role="timer" aria-label="সেমিনার শুরু হতে বাকি">
        {parts.map((p, i) => (
          <Fragment key={p.label}>
            {i > 0 ? (
              <span aria-hidden="true" className="pt-0.5 text-2xl font-light leading-none text-red-300">
                :
              </span>
            ) : null}
            <span className="flex min-w-[2.75rem] flex-col items-center">
              <span className="text-[1.875rem] font-bold tabular-nums leading-none tracking-tight text-zinc-900">{bn(p.value)}</span>
              <span className="mt-2 text-[11px] font-medium leading-none text-zinc-500">{p.label}</span>
            </span>
          </Fragment>
        ))}
      </span>
    </span>
  );
}
