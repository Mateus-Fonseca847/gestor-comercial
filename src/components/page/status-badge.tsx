import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";

type StatusBadgeProps = {
  variant: "info" | "success" | "warning" | "danger";
  children: React.ReactNode;
};

const variantClasses: Record<StatusBadgeProps["variant"], string> = {
  info: "border border-blue-200 bg-blue-50 text-blue-700",
  success: "border border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border border-yellow-200 bg-yellow-50 text-yellow-700",
  danger: "border border-red-200 bg-red-50 text-red-700",
};

export function StatusBadge({ variant, children }: StatusBadgeProps) {
  const Icon =
    variant === "danger"
      ? AlertCircle
      : variant === "warning"
        ? AlertTriangle
        : variant === "success"
          ? CheckCircle2
          : Info;

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        variantClasses[variant],
      ].join(" ")}
    >
      <Icon className="h-3.5 w-3.5" />
      {children}
    </span>
  );
}
