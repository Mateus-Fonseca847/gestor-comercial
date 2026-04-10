import { Layers3 } from "lucide-react";

type ContextCardProps = {
  title: string;
  value: string;
  description: string;
};

export function ContextCard({ title, value, description }: ContextCardProps) {
  return (
    <article className="ui-surface-2 p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4">
          <p className="ui-metric-label">{title}</p>
          <p className="ui-metric-value">{value}</p>
        </div>
        <div className="ui-icon-chip">
          <Layers3 className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-4 ui-metric-note">{description}</p>
    </article>
  );
}
