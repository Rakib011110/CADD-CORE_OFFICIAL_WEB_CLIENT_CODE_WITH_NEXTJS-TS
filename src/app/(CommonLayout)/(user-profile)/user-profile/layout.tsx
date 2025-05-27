
import { ReactNode } from "react";

export default function UserProfileLayout({ children }: {children:ReactNode} ) {
  return (
    <main className="min-h-screen flex flex-col">
      <div className="flex-1">{children}</div>
    </main>
  );
}