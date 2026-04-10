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
    <section className="flex flex-col gap-4 pb-1 lg:flex-row lg:items-end lg:justify-between">
      <div className="space-y-2">
        <div className="space-y-1.5">
          <h1 className="ui-page-title text-[1.9rem] sm:text-[2.1rem]">{title}</h1>
          <p className="ui-body max-w-2xl text-[15px]">{description}</p>
        </div>
      </div>

      {actions?.length ? (
        <div className="flex flex-wrap gap-2.5">
          {actions.map((action) =>
            action.href ? (
              <Link
                key={action.label}
                href={action.href}
                className={[
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5",
                  action.variant === "secondary"
                    ? "border border-[rgba(21,93,252,0.14)] bg-white text-[var(--color-text)] hover:border-[rgba(21,93,252,0.3)] hover:bg-[var(--color-surface-alt)]"
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
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5",
                  action.variant === "secondary"
                    ? "border border-[rgba(21,93,252,0.14)] bg-white text-[var(--color-text)] hover:border-[rgba(21,93,252,0.3)] hover:bg-[var(--color-surface-alt)]"
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
