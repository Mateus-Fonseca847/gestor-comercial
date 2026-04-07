type ProdutoDetailTab = {
  label: string;
  href: string;
};

type ProdutoDetailTabsProps = {
  items: ProdutoDetailTab[];
};

export function ProdutoDetailTabs({ items }: ProdutoDetailTabsProps) {
  return (
    <nav className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="rounded-full px-4 py-2 text-sm font-medium text-[var(--color-text-soft)] transition-colors hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-primary)]"
          >
            {item.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
