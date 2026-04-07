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
        "rounded-[26px] border bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(15,23,42,0.08)]",
        tone === "danger"
          ? "border-red-200"
          : tone === "warning"
            ? "border-yellow-200"
            : tone === "info"
              ? "border-blue-200"
              : "border-[var(--color-border)]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-4">
          <p className="text-[0.8rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
            {label}
          </p>
          <p className="text-[1.75rem] font-bold tracking-tight text-[var(--color-text)]">
            {value}
          </p>
          {context ? (
            <div
              className={[
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
                tone === "danger"
                  ? "bg-red-50 text-red-700"
                  : tone === "warning"
                    ? "bg-yellow-50 text-yellow-700"
                    : tone === "info"
                      ? "bg-blue-50 text-blue-700"
                      : "bg-[var(--color-surface-alt)] text-[var(--color-text-soft)]",
              ].join(" ")}
            >
              {trendIcon}
              {context}
            </div>
          ) : null}
        </div>
        <div
          className={[
            "flex h-11 w-11 items-center justify-center rounded-[18px] border",
            tone === "danger"
              ? "border-red-100 bg-red-50 text-red-700"
              : tone === "warning"
                ? "border-yellow-100 bg-yellow-50 text-yellow-700"
                : "border-[rgba(0,74,173,0.08)] bg-[rgba(0,74,173,0.06)] text-[var(--color-primary)]",
          ].join(" ")}
        >
          <Package className="h-5 w-5" />
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-[var(--color-text-soft)]">{note}</p>
    </article>
  );
}
