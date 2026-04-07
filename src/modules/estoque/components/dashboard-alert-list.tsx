import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/page/status-badge";
import { EstoqueAlert } from "@/modules/estoque/types/estoque.types";

export function DashboardAlertList({ alerts }: { alerts: EstoqueAlert[] }) {
  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <Link
          key={alert.id}
          href={alert.href}
          className={[
            "block rounded-[22px] border px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm",
            alert.severity === "danger"
              ? "border-red-200 bg-red-50"
              : alert.severity === "warning"
                ? "border-yellow-200 bg-yellow-50"
                : "border-blue-200 bg-blue-50",
          ].join(" ")}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div
                className={[
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl",
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
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                  {alert.severity === "danger"
                    ? "Crítico"
                    : alert.severity === "warning"
                      ? "Atenção"
                      : "Informativo"}
                </p>
                <h3 className="font-semibold text-[var(--color-text)]">{alert.title}</h3>
                <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                  {alert.description}
                </p>
              </div>
            </div>
            <StatusBadge variant={alert.severity}>
              {alert.severity === "danger"
                ? "Alta prioridade"
                : alert.severity === "warning"
                  ? "Monitorar"
                  : "Contexto"}
            </StatusBadge>
          </div>
        </Link>
      ))}
    </div>
  );
}
