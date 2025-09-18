"use client";
import { ReactNode } from "react";

export default function HomeLayout({ children }: {children:ReactNode} ) {
  return (
    <main suppressHydrationWarning={true} className="min-h-screen flex flex-col">
      <div className="flex-1">{children}</div>
    </main>
  );
}