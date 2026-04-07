import { DepositoResumo } from "@/modules/estoque/types/estoque.types";

export function DashboardDepositoGrid({
  items,
}: {
  items: DepositoResumo[];
}) {
  return (
    <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_12px_30px_rgba(0,74,173,0.06)]">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[var(--color-primary)]">
          Visão por depósito
        </h2>
        <p className="text-sm text-[var(--color-text-soft)]">
          Leitura rápida da ocupação e condição operacional de cada estrutura.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-[22px] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5"
          >
            <h3 className="font-semibold text-[var(--color-text)]">{item.nome}</h3>
            <p className="mt-3 text-2xl font-semibold text-[var(--color-primary)]">
              {item.ocupacao}
            </p>
            <p className="mt-1 text-sm text-[var(--color-text-soft)]">{item.itens}</p>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
              {item.status}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
