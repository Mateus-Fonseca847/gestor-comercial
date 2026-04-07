type ProdutoDetailSummaryItem = {
  label: string;
  value: string;
};

type ProdutoDetailSummaryGridProps = {
  items: ProdutoDetailSummaryItem[];
};

export function ProdutoDetailSummaryGrid({
  items,
}: ProdutoDetailSummaryGridProps) {
  return (
    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[0_12px_30px_rgba(0,74,173,0.05)]"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
            {item.label}
          </p>
          <p className="mt-3 text-lg font-semibold text-[var(--color-primary)]">
            {item.value}
          </p>
        </article>
      ))}
    </div>
  );
}
