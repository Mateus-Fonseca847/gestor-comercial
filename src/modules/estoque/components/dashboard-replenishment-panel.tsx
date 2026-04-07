import { StatusBadge } from "@/components/page/status-badge";
import { ReposicaoIndicador } from "@/modules/estoque/types/estoque.types";

export function DashboardReplenishmentPanel({
  items,
}: {
  items: ReposicaoIndicador[];
}) {
  return (
    <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[var(--color-text)]">
          Indicadores de reposição
        </h2>
        <p className="text-sm text-[var(--color-text-soft)]">
          Sinais operacionais para priorizar compras e ajustes de abastecimento.
        </p>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-4"
          >
            <div>
              <p className="font-medium text-[var(--color-text)]">{item.titulo}</p>
              <p className="text-sm text-[var(--color-text-soft)]">{item.detalhe}</p>
            </div>
            <div className="flex items-center gap-3">
              <strong className="text-xl font-bold text-[var(--color-text)]">{item.valor}</strong>
              <StatusBadge variant={item.status}>{item.titulo}</StatusBadge>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
