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
        "flex min-h-[168px] flex-col justify-between rounded-[28px] border bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.95)_100%)] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.08)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_22px_46px_rgba(15,23,42,0.10)]",
        tone === "danger"
          ? "border-red-200/90"
          : tone === "warning"
            ? "border-amber-200/90"
            : tone === "info"
              ? "border-blue-200/90"
              : "border-[rgba(148,163,184,0.18)]",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-3">
          <p className="text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
            {label}
          </p>
          <p className="text-[2rem] font-semibold leading-none tracking-[-0.03em] text-[var(--color-text)]">
            {value}
          </p>
        </div>
        <div
          className={[
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] border",
            tone === "danger"
              ? "border-red-100 bg-red-50 text-red-700"
              : tone === "warning"
                ? "border-amber-100 bg-amber-50 text-amber-700"
                : tone === "info"
                  ? "border-blue-100 bg-blue-50 text-blue-700"
                  : "border-[rgba(148,163,184,0.18)] bg-[rgba(248,250,252,0.92)] text-[var(--color-primary)]",
          ].join(" ")}
        >
          <Package className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-5 space-y-3 border-t border-[rgba(148,163,184,0.16)] pt-4">
        {context ? (
          <div
            className={[
              "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
              tone === "danger"
                ? "bg-red-50 text-red-700"
                : tone === "warning"
                  ? "bg-amber-50 text-amber-700"
                  : tone === "info"
                    ? "bg-blue-50 text-blue-700"
                    : "bg-[var(--color-surface-alt)] text-[var(--color-text-soft)]",
            ].join(" ")}
          >
            {trendIcon}
            {context}
          </div>
        ) : null}
        <p className="text-sm leading-6 text-[var(--color-text-soft)]">{note}</p>
      </div>
    </article>
  );
}
