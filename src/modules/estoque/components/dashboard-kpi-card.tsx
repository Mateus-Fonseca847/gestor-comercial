import { Package } from "lucide-react";

type DashboardKpiCardProps = {
  label: string;
  value: string;
  note: string;
};

export function DashboardKpiCard({
  label,
  value,
  note,
}: DashboardKpiCardProps) {
  return (
    <article className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4">
          <p className="text-sm font-medium text-[var(--color-text-soft)]">{label}</p>
          <p className="text-2xl font-bold tracking-tight text-[var(--color-text)]">
            {value}
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(0,74,173,0.08)] text-[var(--color-primary)]">
          <Package className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--color-text-muted)]">
        {note}
      </p>
    </article>
  );
}
