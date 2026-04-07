type ProdutoDetailHistoryItem = {
  id: string;
  title: string;
  description: string;
  date: string;
};

type ProdutoDetailHistoryProps = {
  items: ProdutoDetailHistoryItem[];
};

export function ProdutoDetailHistory({ items }: ProdutoDetailHistoryProps) {
  if (!items.length) {
    return (
      <div className="rounded-[22px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-6 text-sm text-[var(--color-text-soft)]">
        Nenhum evento registrado para este produto.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-4">
          <div className="flex w-6 justify-center">
            <div className="mt-1 h-3 w-3 rounded-full bg-[var(--color-primary)]" />
          </div>
          <article className="flex-1 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-4">
            <div className="flex flex-col gap-1 lg:flex-row lg:items-center lg:justify-between">
              <p className="text-sm font-semibold text-[var(--color-text)]">
                {item.title}
              </p>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
                {item.date}
              </p>
            </div>
            <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">
              {item.description}
            </p>
          </article>
        </div>
      ))}
    </div>
  );
}
