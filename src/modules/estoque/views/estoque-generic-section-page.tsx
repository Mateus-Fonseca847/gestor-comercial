import { ActionBar } from "@/components/page/action-bar";
import { DataTable } from "@/components/page/data-table";
import { EmptyState } from "@/components/page/empty-state";
import { FilterBar } from "@/components/page/filter-bar";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatusBadge } from "@/components/page/status-badge";
import { StatCard } from "@/components/page/stat-card";
import { estoqueService } from "@/modules/estoque/services/estoque.service";

export function EstoqueGenericSectionPage({ slug }: { slug: string }) {
  const config = estoqueService.getSection(slug);

  if (!config) {
    return null;
  }

  const columns = [
    { key: "primary", header: config.title.slice(0, -1) || "Registro" },
    { key: "secondary", header: "Contexto" },
    { key: "tertiary", header: "Detalhe" },
    {
      key: "status",
      header: "Status",
      render: (row: { status: string }) => (
        <StatusBadge variant={statusVariant(row.status)}>{row.status}</StatusBadge>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title={config.title}
        description={config.description}
        actions={[{ label: config.actionLabel }]}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {config.metrics.map((metric) => (
          <StatCard
            key={metric.label}
            label={metric.label}
            value={metric.value}
            description={metric.note}
          />
        ))}
      </section>

      <ActionBar
        items={[
          { label: config.actionLabel },
          { label: "Exportar visão", tone: "neutral" },
        ]}
      />

      <FilterBar
        placeholder={`Buscar em ${config.title.toLowerCase()}`}
        chips={config.filters.map((label, index) => ({
          label,
          active: index === 0,
        }))}
      />

      <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_12px_30px_rgba(0,74,173,0.06)]">
        <div className="mb-4 flex items-center justify-between gap-3 px-2 pt-2">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-primary)]">
              Base de {config.title.toLowerCase()}
            </h2>
            <p className="text-sm text-[var(--color-text-soft)]">
              Estrutura pronta para receber regras, integrações e operações reais do domínio.
            </p>
          </div>
          <StatusBadge variant="info">{config.records.length} registros</StatusBadge>
        </div>

        <DataTable
          columns={columns}
          data={config.records}
          emptyState={
            <EmptyState
              title={`Nenhum registro em ${config.title.toLowerCase()}`}
              description="Esta área está preparada para expansão futura com backend, filtros e ações de domínio."
              actionLabel={config.actionLabel}
            />
          }
        />
      </section>
    </PageContainer>
  );
}

function statusVariant(value: string): "info" | "success" | "warning" | "danger" {
  const normalized = value.toLowerCase();

  if (["ativo", "aprovada", "aprovado", "concluída", "concluído", "controlado", "conferida"].some((term) => normalized.includes(term))) return "success";
  if (["pendente", "aberto", "em trânsito", "recebimento", "ajuste", "aguardando"].some((term) => normalized.includes(term))) return "warning";
  if (["atenção", "atraso", "crítica", "crítico"].some((term) => normalized.includes(term))) return "danger";
  return "info";
}
