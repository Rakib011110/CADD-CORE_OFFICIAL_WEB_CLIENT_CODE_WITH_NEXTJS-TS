"use client";

import React, { useEffect, useState } from "react";
import { GraduationCap, Award, BookOpen, Briefcase } from "lucide-react";

interface StatItem {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  label: string;
  duration: number;
}

export default function StatsSection() {
  const stats: StatItem[] = [
    {
      icon: GraduationCap,
      value: 12000,
      suffix: "+",
      label: "Graduate Students",
      duration: 2000,
    },
    {
      icon: Award,
      value: 15,
      suffix: "+",
      label: "Certified Instructors",
      duration: 1200,
    },
    {
      icon: BookOpen,
      value: 10,
      suffix: "+",
      label: "Departmental Courses",
      duration: 1000,
    },
    {
      icon: Briefcase,
      value: 100,
      suffix: "%",
      label: "Practical Learning",
      duration: 1400,
    },
  ];

  const [animatedValues, setAnimatedValues] = useState<number[]>(stats.map(() => 0));

  useEffect(() => {
    const animationDuration = Math.max(...stats.map((stat) => stat.duration));
    let startTime: number | null = null;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const newValues = stats.map((stat) => {
        if (elapsed >= stat.duration) return stat.value;
        const progress = Math.min(elapsed / stat.duration, 1);
        const ease = 1 - (1 - progress) * (1 - progress);
        return Math.floor(ease * stat.value);
      });

      setAnimatedValues(newValues);

      if (elapsed < animationDuration) {
        requestAnimationFrame(animate);
      }
    };

    const animFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <section className="relative z-10 py-5 sm:py-7 bg-gradient-to-b from-slate-50/70 via-white to-slate-50/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact 2-col on mobile, 4-col on desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 md:gap-4">
          {stats.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative rounded-2xl p-[1px] bg-gradient-to-b from-slate-200/90 via-slate-100 to-slate-200/40 hover:from-red-500 hover:via-rose-500 hover:to-red-600 transition-all duration-300 shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_24px_-8px_rgba(220,38,38,0.18)] hover:-translate-y-1 cursor-default"
              >
                {/* Compact Frosted Glass Inner Surface */}
                <div className="relative h-full bg-white/95 backdrop-blur-md rounded-[15px] p-3 sm:p-4 md:p-4.5 flex items-center gap-2.5 sm:gap-3.5 md:gap-4 overflow-hidden">
                  {/* Subtle ambient light on hover */}
                  <div className="absolute -top-8 -right-8 w-16 h-16 bg-red-500/[0.06] rounded-full blur-xl group-hover:bg-red-500/[0.12] transition-all duration-300 pointer-events-none" />

                  {/* Compact 3D Glowing Icon Squircle */}
                  <div className="relative shrink-0 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-red-600 to-rose-400 opacity-20 blur-sm group-hover:opacity-70 group-hover:scale-110 transition-all duration-300" />
                    <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-white via-red-50/80 to-rose-100/60 border border-red-100/90 shadow-[0_2px_8px_rgba(220,38,38,0.08)] flex items-center justify-center text-red-600 group-hover:scale-105 group-hover:bg-gradient-to-br group-hover:from-red-600 group-hover:to-rose-600 group-hover:text-white group-hover:border-transparent group-hover:shadow-[0_6px_16px_rgba(220,38,38,0.3)] transition-all duration-300">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300" strokeWidth={2.2} />
                    </div>
                  </div>

                  {/* Number & Exact Label */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-0.5">
                      <span className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
                        {animatedValues[index].toLocaleString()}
                      </span>
                      {item.suffix && (
                        <span className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent ml-0.5">
                          {item.suffix}
                        </span>
                      )}
                    </div>
                    <p className="text-xs sm:text-[13px] md:text-sm font-semibold text-slate-700 mt-1 truncate leading-tight group-hover:text-slate-900 transition-colors">
                      {item.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}