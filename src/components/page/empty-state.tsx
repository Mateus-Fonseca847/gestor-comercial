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
    <section className="ui-surface-2 border-dashed px-6 py-12 text-center">
      <div className="mx-auto flex max-w-md flex-col items-center gap-4">
        <div className="ui-icon-chip-strong h-14 w-14 rounded-2xl">
          <Inbox className="h-7 w-7" />
        </div>
        <div className="space-y-2">
          <p className="ui-eyebrow text-[var(--color-primary)]">Nada por aqui ainda</p>
          <h3 className="text-lg font-semibold tracking-tight text-[var(--color-text)]">{title}</h3>
          <p className="ui-body">{description}</p>
        </div>

        {actionLabel ? (
          <button
            type="button"
            className="inline-flex items-center rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-primary-strong)] hover:shadow-[var(--shadow-brand)]"
          >
            {actionLabel}
          </button>
        ) : null}
      </div>
    </section>
  );
}
