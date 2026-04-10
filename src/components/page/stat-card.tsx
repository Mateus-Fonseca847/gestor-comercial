import { BarChart3 } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string;
  description: string;
  onClick?: () => void;
};

export function StatCard({ label, value, description, onClick }: StatCardProps) {
  return (
    <article
      onClick={onClick}
      className={[
        "ui-surface-2 border-l-4 border-l-[var(--color-primary)] p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_rgba(21,93,252,0.1)]",
        onClick ? "cursor-pointer" : "",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4">
          <p className="ui-metric-label">{label}</p>
          <p className="ui-metric-value">{value}</p>
        </div>
        <div className="ui-icon-chip-strong">
          <BarChart3 className="h-5 w-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <p className="ui-metric-note">{description}</p>
        <span className="ui-brand-badge">Hoje</span>
      </div>
    </article>
  );
}
