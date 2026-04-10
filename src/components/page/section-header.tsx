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
    <section className="ui-surface-1 flex flex-col gap-6 px-6 py-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-3">
        <p className="ui-eyebrow text-[var(--color-primary)]">Gestify</p>
        <div className="space-y-1">
          <h1 className="ui-page-title text-[2rem] sm:text-[2.2rem]">{title}</h1>
          <p className="ui-body max-w-2xl">{description}</p>
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
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                  action.variant === "secondary"
                    ? "border border-[rgba(21,93,252,0.14)] bg-white text-[var(--color-text)] hover:border-[rgba(21,93,252,0.3)] hover:bg-[var(--color-surface-alt)]"
                    : "bg-[var(--color-primary)] text-white shadow-[var(--shadow-brand)] hover:bg-[var(--color-primary-strong)]",
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
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
                  action.variant === "secondary"
                    ? "border border-[rgba(21,93,252,0.14)] bg-white text-[var(--color-text)] hover:border-[rgba(21,93,252,0.3)] hover:bg-[var(--color-surface-alt)]"
                    : "bg-[var(--color-primary)] text-white shadow-[var(--shadow-brand)] hover:bg-[var(--color-primary-strong)]",
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
