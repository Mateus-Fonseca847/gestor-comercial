import { Inbox } from "lucide-react";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
}: EmptyStateProps) {
  return (
    <section className="rounded-[28px] border border-dashed border-[var(--color-border-strong)] bg-[var(--color-surface-alt)] px-6 py-12 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgba(0,74,173,0.08)] text-[var(--color-primary)]">
          <Inbox className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[var(--color-text)]">
            {title}
          </h3>
          <p className="text-sm leading-6 text-[var(--color-text-soft)]">
            {description}
          </p>
        </div>

        {actionLabel ? (
          <button
            type="button"
            className="inline-flex items-center rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-primary-strong)] hover:shadow-md"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}
