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
    <article className="rounded-[26px] border border-[var(--color-border)]/90 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4">
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
            {label}
          </p>
          <p className="text-[1.9rem] font-bold tracking-tight text-[var(--color-text)]">
            {value}
          </p>
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-[rgba(0,74,173,0.08)] bg-[rgba(0,74,173,0.06)] text-[var(--color-primary)]">
          <Package className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--color-text-soft)]">{note}</p>
    </article>
  );
}
