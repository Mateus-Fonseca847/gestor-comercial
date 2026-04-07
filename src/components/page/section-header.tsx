import { ArrowUpRight, Plus, SlidersHorizontal } from "lucide-react";
import Link from "next/link";

type SectionAction = {
  label: string;
  variant?: "primary" | "secondary";
  href?: string;
};

type SectionHeaderProps = {
  title: string;
  description: string;
  actions?: SectionAction[];
};

export function SectionHeader({
  title,
  description,
  actions,
}: SectionHeaderProps) {
  return (
    <section className="flex flex-col gap-6 rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-6 shadow-[var(--shadow-sm)] lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-text-soft)]">
          Operação
        </p>
        <div className="space-y-1">
          <h1 className="text-xl font-semibold tracking-tight text-[var(--color-text)] sm:text-[1.75rem]">
            {title}
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-soft)]">
            {description}
          </p>
        </div>
      </div>

      {actions?.length ? (
        <div className="flex flex-wrap gap-3">
          {actions.map((action) =>
            action.href ? (
              <Link
                key={action.label}
                href={action.href}
                className={[
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                  action.variant === "secondary"
                    ? "border border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-alt)]"
                    : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)]",
                ].join(" ")}
              >
                {action.variant === "secondary" ? (
                  <SlidersHorizontal className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {action.label}
                {action.variant === "secondary" ? null : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
              </Link>
            ) : (
              <button
                key={action.label}
                type="button"
                className={[
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                  action.variant === "secondary"
                    ? "border border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-alt)]"
                    : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)]",
                ].join(" ")}
              >
                {action.variant === "secondary" ? (
                  <SlidersHorizontal className="h-4 w-4" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {action.label}
                {action.variant === "secondary" ? null : (
                  <ArrowUpRight className="h-4 w-4" />
                )}
              </button>
            ),
          )}
        </div>
      ) : null}
    </section>
  );
}
