import Link from "next/link";
import { StatusBadge } from "@/components/page/status-badge";

type ReplenishmentItem = {
  id: string;
  title: string;
  detail: string;
  shortage: string;
  status: "danger" | "warning" | "info";
};

export function DashboardReplenishmentActions({
  items,
}: {
  items: ReplenishmentItem[];
}) {
  return (
    <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          Reposição prioritária
        </h2>
        <p className="text-sm text-[var(--color-text-soft)]">
          Itens que merecem ação de compra ou ajuste ainda hoje.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-4"
          >
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div className="space-y-1">
                <p className="font-semibold text-[var(--color-text)]">{item.title}</p>
                <p className="text-sm text-[var(--color-text-soft)]">{item.detail}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <span className="text-lg font-medium tracking-tight text-[var(--color-text-soft)]">
                  {item.shortage}
                </span>
                <StatusBadge variant={item.status}>
                  {item.status === "danger" ? "Agir agora" : "Monitorar"}
                </StatusBadge>
                <Link
                  href="/estoque/compras"
                  className="rounded-xl bg-[var(--color-primary)] px-3.5 py-2 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-primary-strong)]"
                >
                  Criar pedido
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
