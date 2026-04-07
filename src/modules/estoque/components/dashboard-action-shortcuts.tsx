import {
  ArrowRight,
  ClipboardList,
  PackageSearch,
  ShoppingCart,
} from "lucide-react";
import Link from "next/link";

type Shortcut = {
  title: string;
  description: string;
  href: string;
  helper?: string;
};

export function DashboardActionShortcuts({ items }: { items: Shortcut[] }) {
  return (
    <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          Atalhos rápidos
        </h2>
        <p className="text-sm text-[var(--color-text-soft)]">
          Entre nas tarefas mais frequentes sem trocar de contexto.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[var(--color-primary)]">
                    {item.title.includes("Produto") ? (
                      <PackageSearch className="h-5 w-5" />
                    ) : item.title.includes("Compra") ? (
                      <ShoppingCart className="h-5 w-5" />
                    ) : (
                      <ClipboardList className="h-5 w-5" />
                    )}
                  </div>
                  <h3 className="font-semibold text-[var(--color-text)]">{item.title}</h3>
                </div>
                <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                  {item.description}
                </p>
                {item.helper ? (
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[var(--color-text-muted)]">
                    {item.helper}
                  </p>
                ) : null}
              </div>
              <ArrowRight className="h-5 w-5 text-[var(--color-primary)]" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
