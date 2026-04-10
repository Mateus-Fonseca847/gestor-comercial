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
    <article className="ui-surface-2 p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(21,93,252,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4">
          <p className="ui-metric-label">{label}</p>
          <p className="ui-kpi-value">{value}</p>
        </div>
        <div className="ui-icon-chip">
          <Package className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 ui-metric-note">{note}</p>
    </article>
  );
}
