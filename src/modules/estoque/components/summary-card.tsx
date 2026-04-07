import { Boxes } from "lucide-react";

type SummaryCardProps = {
  label: string;
  value: string;
  note: string;
};

export function SummaryCard({ label, value, note }: SummaryCardProps) {
  return (
    <article className="rounded-[26px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-[var(--color-text-soft)]">{label}</p>
            <strong className="mt-3 block text-2xl font-bold tracking-tight text-[var(--color-text)]">
              {value}
            </strong>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(0,74,173,0.08)] text-[var(--color-primary)]">
            <Boxes className="h-5 w-5" />
          </div>
        </div>
        <div className="flex items-end justify-between gap-4">
          <p className="text-sm leading-6 text-[var(--color-text-muted)]">{note}</p>
          <span className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-1 text-xs font-semibold text-[var(--color-primary)]">
            Estoque
          </span>
        </div>
      </div>
    </article>
  );
}
