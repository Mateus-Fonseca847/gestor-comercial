import { Boxes } from "lucide-react";

type SummaryCardProps = {
  label: string;
  value: string;
  note: string;
};

export function SummaryCard({ label, value, note }: SummaryCardProps) {
  return (
    <article className="ui-surface-2 p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="ui-metric-label">{label}</p>
            <strong className="mt-3 block ui-kpi-value">
              {value}
            </strong>
          </div>
          <div className="ui-icon-chip">
            <Boxes className="h-5 w-5" />
          </div>
        </div>
        <p className="ui-metric-note">{note}</p>
      </div>
    </article>
  );
}
