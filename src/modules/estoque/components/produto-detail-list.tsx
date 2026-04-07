import { StatusBadge } from "@/components/page/status-badge";

type ProdutoDetailListItem = {
  id: string;
  primary: string;
  secondary: string;
  tertiary?: string;
  status?: string;
  statusVariant?: "info" | "success" | "warning" | "danger";
};

type ProdutoDetailListProps = {
  items: ProdutoDetailListItem[];
  emptyLabel: string;
};

export function ProdutoDetailList({
  items,
  emptyLabel,
}: ProdutoDetailListProps) {
  if (!items.length) {
    return (
      <div className="rounded-[22px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-6 text-sm text-[var(--color-text-soft)]">
        {emptyLabel}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <article
          key={item.id}
          className="flex flex-col gap-3 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-4 lg:flex-row lg:items-center lg:justify-between"
        >
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--color-text)]">
              {item.primary}
            </p>
            <p className="text-sm text-[var(--color-text-soft)]">
              {item.secondary}
            </p>
            {item.tertiary ? (
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                {item.tertiary}
              </p>
            ) : null}
          </div>

          {item.status ? (
            <StatusBadge variant={item.statusVariant ?? "info"}>
              {item.status}
            </StatusBadge>
          ) : null}
        </article>
      ))}
    </div>
  );
}
