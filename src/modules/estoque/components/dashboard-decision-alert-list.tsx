import {
  AlertCircle,
  AlertTriangle,
  ArrowRight,
  Info,
  RotateCcw,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/page/status-badge";

export type DashboardDecisionAlert = {
  id: string;
  severity: "danger" | "warning" | "info";
  label: string;
  item: string;
  problem: string;
  data: string;
  href: string;
  primaryAction: string;
  secondaryAction?: string;
};

export function DashboardDecisionAlertList({
  alerts,
}: {
  alerts: DashboardDecisionAlert[];
}) {
  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <article
          key={alert.id}
          className={[
            "rounded-[22px] border px-5 py-4 shadow-sm",
            alert.severity === "danger"
              ? "border-red-200 bg-red-50"
              : alert.severity === "warning"
                ? "border-yellow-200 bg-yellow-50"
                : "border-blue-200 bg-blue-50",
          ].join(" ")}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-3">
              <div
                className={[
                  "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
                  alert.severity === "danger"
                    ? "bg-red-100 text-red-700"
                    : alert.severity === "warning"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700",
                ].join(" ")}
              >
                {alert.severity === "danger" ? (
                  <AlertCircle className="h-5 w-5" />
                ) : alert.severity === "warning" ? (
                  <AlertTriangle className="h-5 w-5" />
                ) : (
                  <Info className="h-5 w-5" />
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                  {alert.label}
                </p>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-[var(--color-text)]">
                    {alert.item}
                  </h3>
                  <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                    {alert.problem}
                  </p>
                </div>
                <div className="inline-flex rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-[var(--color-text-soft)]">
                  {alert.data}
                </div>
              </div>
            </div>

            <div className="flex min-w-[230px] flex-col items-start gap-3 lg:items-end">
              <StatusBadge variant={alert.severity}>
                {alert.severity === "danger"
                  ? "Alta prioridade"
                  : alert.severity === "warning"
                    ? "Atenção"
                    : "Informativo"}
              </StatusBadge>
              <div className="flex flex-col items-stretch gap-2 lg:w-[170px]">
                <Link
                  href={alert.href}
                  className={[
                    "inline-flex items-center justify-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5",
                    alert.severity === "danger"
                      ? "bg-red-700 text-white hover:bg-red-800"
                      : alert.severity === "warning"
                        ? "bg-yellow-500 text-yellow-950 hover:bg-yellow-400"
                        : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)]",
                  ].join(" ")}
                >
                  {alert.primaryAction.includes("pedido") ? (
                    <ShoppingCart className="h-4 w-4" />
                  ) : (
                    <ArrowRight className="h-4 w-4" />
                  )}
                  {alert.primaryAction}
                </Link>
                {alert.secondaryAction ? (
                  <Link
                    href={alert.href}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] bg-white px-3.5 py-2 text-sm font-medium text-[var(--color-text)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-surface-alt)]"
                  >
                    <RotateCcw className="h-4 w-4" />
                    {alert.secondaryAction}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
