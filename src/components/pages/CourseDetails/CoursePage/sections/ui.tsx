import { Children, CSSProperties, ReactNode } from "react";

// Shared look for every course-page section, so cards, icons and spacing match.
export const CARD =
  "rounded-2xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition duration-200 hover:-translate-y-0.5 hover:border-zinc-300 hover:shadow-[0_10px_30px_-12px_rgba(0,0,0,0.18)]";
export const CARD_STATIC = "rounded-2xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)]";
export const ICON_TILE = "flex shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600";

// Fewest rows for n items with at most `max` columns, then spread items evenly:
// 4 items → 2 + 2 (not 3 + 1), 5 items → 3 + 2.
const balancedColumns = (n: number, max: number) => {
  if (n <= max) return Math.max(1, n);
  const rows = Math.ceil(n / max);
  return Math.ceil(n / rows);
};

/**
 * Grid without empty cells: columns are balanced to the number of items and a
 * shorter last row stretches to the full width. Every card in a row gets the
 * same height.
 */
export function AutoGrid({
  children,
  xs = 1,
  sm = 2,
  xl = 3,
  gap = "1rem",
  className = "",
}: {
  children: ReactNode;
  xs?: number; // columns on phones (below 640px)
  sm?: number;
  xl?: number;
  gap?: string;
  className?: string;
}) {
  const items = Children.toArray(children);
  const style = {
    "--c-xs": balancedColumns(items.length, xs),
    "--c-sm": balancedColumns(items.length, sm),
    "--c-xl": balancedColumns(items.length, xl),
    "--ag-gap": gap,
  } as CSSProperties;
  return (
    <ul className={`auto-grid ${className}`} style={style}>
      {items.map((child, i) => (
        <li key={i}>{child}</li>
      ))}
    </ul>
  );
}

export function SubHeading({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">
      <span className="h-px w-5 bg-red-500" />
      {children}
    </h3>
  );
}
