import { ArrowDown, ArrowRight, ArrowUp, Package } from "lucide-react";

type DashboardKpiTileProps = {
  label: string;
  value: string;
  note: string;
  context?: string;
  tone?: "neutral" | "info" | "warning" | "danger";
  trend?: "up" | "down" | "flat";
};

export function DashboardKpiTile({
  label,
  value,
  note,
  context,
  tone = "neutral",
  trend = "flat",
}: DashboardKpiTileProps) {
  const containerClass =
    tone === "danger"
      ? "border-red-200/90 bg-red-50"
      : tone === "warning"
        ? "border-amber-200/90 bg-amber-50"
        : tone === "info"
          ? "border-[rgba(21,93,252,0.18)] bg-[rgba(237,244,255,0.98)]"
          : "border-[rgba(21,93,252,0.12)] bg-[rgba(247,250,255,0.96)]";

  const valueClass =
    tone === "danger"
      ? "text-[2rem] font-semibold leading-none tracking-[-0.03em] text-red-700"
      : tone === "warning"
        ? "text-[2rem] font-semibold leading-none tracking-[-0.03em] text-amber-700"
        : tone === "info"
          ? "text-[2rem] font-semibold leading-none tracking-[-0.03em] text-[var(--color-primary-strong)]"
          : "text-[2rem] font-semibold leading-none tracking-[-0.03em] text-[var(--color-text)]";

  const iconClass =
    tone === "danger"
      ? "border-red-100 bg-red-50 text-red-700"
      : tone === "warning"
        ? "border-amber-100 bg-amber-50 text-amber-700"
        : tone === "info"
          ? "border-[rgba(21,93,252,0.16)] bg-white text-[var(--color-primary)]"
          : "border-[rgba(21,93,252,0.12)] bg-[rgba(255,255,255,0.92)] text-[var(--color-primary)]";

  const contextClass =
    tone === "danger"
      ? "border border-red-100 bg-red-50 text-red-700"
      : tone === "warning"
        ? "border border-amber-100 bg-amber-50 text-amber-700"
        : tone === "info"
          ? "border border-[rgba(21,93,252,0.12)] bg-white text-[var(--color-primary)]"
          : "border border-[rgba(21,93,252,0.12)] bg-white text-[var(--color-primary)]";

  const noteClass =
    tone === "danger"
      ? "text-sm leading-6 text-red-700/80"
      : tone === "warning"
        ? "text-sm leading-6 text-amber-700/85"
        : tone === "info"
          ? "text-sm leading-6 text-[var(--color-primary-strong)]/80"
          : "text-sm leading-6 text-[var(--color-text-soft)]";

  const trendIcon =
    trend === "up" ? (
      <ArrowUp className="h-3.5 w-3.5" />
    ) : trend === "down" ? (
      <ArrowDown className="h-3.5 w-3.5" />
    ) : (
      <ArrowRight className="h-3.5 w-3.5" />
    );

  return (
    <article
      className={[
        "flex min-h-[168px] flex-col justify-between rounded-[28px] border bg-white p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_46px_rgba(15,23,42,0.10)]",
        containerClass,
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="ui-metric-label">{label}</p>
          <p className={valueClass}>{value}</p>
        </div>
        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border",
            iconClass,
          ].join(" ")}
        >
          <Package className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-[rgba(21,93,252,0.12)] pt-4">
        {context ? (
          <div
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
              contextClass,
            ].join(" ")}
          >
            {trendIcon}
            {context}
          </div>
        ) : null}
        <p className={noteClass}>{note}</p>
      </div>
    </article>
  );
}
