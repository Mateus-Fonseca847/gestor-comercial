import Link from "next/link";

type Shortcut = {
  title: string;
  description: string;
  href: string;
};

export function DashboardShortcuts({ items }: { items: Shortcut[] }) {
  return (
    <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[var(--color-primary)]">
          Atalhos rápidos
        </h2>
        <p className="text-sm text-[var(--color-text-soft)]">
          Acesso direto às áreas mais usadas do módulo.
        </p>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-semibold text-[var(--color-text)]">{item.title}</h3>
                <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                  {item.description}
                </p>
              </div>
              <span className="text-lg text-[var(--color-primary)]">→</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
