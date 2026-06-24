"use client";

import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/UI/scroll-area";

export type TabItem = {
  id: string;
  label: string;
  icon: LucideIcon;
};

type TabNavProps = {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
  /** Tab ids that currently contain validation errors. */
  errorTabs?: Set<string>;
};

export function TabNav({ tabs, active, onChange, errorTabs }: TabNavProps) {
  return (
    <ScrollArea className="w-full">
      <div className="flex items-center gap-2 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.id === active;
          const hasError = errorTabs?.has(tab.id);
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={cn(
                "relative inline-flex shrink-0 items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                isActive
                  ? "border-gray-900 bg-gray-900 text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
              {hasError && (
                <span
                  className={cn(
                    "ml-1 inline-block h-2 w-2 rounded-full",
                    isActive ? "bg-red-300" : "bg-red-500"
                  )}
                />
              )}
            </button>
          );
        })}
      </div>
    </ScrollArea>
  );
}
