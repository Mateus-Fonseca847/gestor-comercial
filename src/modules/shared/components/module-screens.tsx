import Link from "next/link";
import { notFound } from "next/navigation";
import { ActionBar } from "@/components/page/action-bar";
import { DataTable } from "@/components/page/data-table";
import { EmptyState } from "@/components/page/empty-state";
import { FilterBar } from "@/components/page/filter-bar";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatCard } from "@/components/page/stat-card";
import { StatusBadge } from "@/components/page/status-badge";
import { moduleNavigation } from "@/config/module-navigation";
import {
  CollectionPageConfig,
  moduleCollections,
  moduleDashboards,
  ModuleKey,
} from "@/modules/shared/config/module-content";

export function ModuleDashboardScreen({ moduleKey }: { moduleKey: ModuleKey }) {
  const config = moduleDashboards[moduleKey];
  const nav = moduleNavigation.find((item) => item.href === `/${moduleKey}`);

  if (!config || !nav) {
    notFound();
  }

  return (
    <PageContainer>
      <SectionHeader title={config.title} description={config.description} />

      <section className="grid gap-4 lg:grid-cols-3">
        {config.metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="rounded-[30px] border border-[var(--color-border)] bg-[linear-gradient(135deg,#ffffff_0%,#edf4ff_62%,#d9e8ff_100%)] p-7">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex rounded-full border border-[var(--color-border)] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-soft)]">
              Centro do módulo
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-primary)]">
                {config.spotlightTitle}
              </h2>
              <p className="max-w-xl text-sm leading-7 text-[var(--color-text-soft)]">
                {config.spotlightDescription}
              </p>
            </div>
            <div className="space-y-2">
              {config.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3 text-sm text-[var(--color-text)]"
                >
                  {highlight}
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_12px_30px_rgba(0,74,173,0.06)]">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[var(--color-primary)]">
              Atalhos do módulo
            </h2>
            <p className="text-sm text-[var(--color-text-soft)]">
              Navegação rápida para as áreas principais desta seção.
            </p>
          </div>
          <div className="space-y-3">
            {nav.menu.sections.flatMap((section) => section.items).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-2xl border border-[var(--color-border)] px-4 py-4 transition-colors hover:bg-[var(--color-surface-alt)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <h3 className="font-semibold text-[var(--color-primary)]">
                    {item.title}
                  </h3>
                  <span className="text-lg text-[var(--color-primary)]">→</span>
                </div>
              </Link>
            ))}
          </div>
        </article>
      </section>
    </PageContainer>
  );
}

export function ModuleCollectionScreen({
  moduleKey,
  slug,
}: {
  moduleKey: ModuleKey;
  slug: string;
}) {
  const config = moduleCollections[moduleKey]?.[slug];

  if (!config) {
    notFound();
  }

  const columns = config.columns.map((column) => ({
    key: column.key,
    header: column.header,
    render:
      column.type === "status"
        ? (row: Record<string, string | number>) => (
            <StatusBadge variant={statusVariant(String(row[column.key] ?? ""))}>
              {String(row[column.key] ?? "")}
            </StatusBadge>
          )
        : undefined,
  }));

  return (
    <PageContainer>
      <SectionHeader
        title={config.title}
        description={config.description}
        actions={[{ label: config.actionLabel }]}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {config.metrics.map((metric) => (
          <StatCard key={metric.label} {...metric} />
        ))}
      </section>

      <ActionBar
        items={[
          { label: config.actionLabel },
          { label: "Exportar", tone: "neutral" },
        ]}
      />
      <FilterBar
        placeholder={config.filters.placeholder}
        chips={config.filters.chips}
      />

      <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[0_12px_30px_rgba(0,74,173,0.06)]">
        <div className="mb-4 flex items-center justify-between gap-3 px-2 pt-2">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-primary)]">
              {config.title}
            </h2>
            <p className="text-sm text-[var(--color-text-soft)]">
              Área principal com registros simulados para validar navegação e hierarquia.
            </p>
          </div>
          <StatusBadge variant="info">{config.rows.length} registros</StatusBadge>
        </div>

        <DataTable
          columns={columns}
          data={config.rows}
          emptyState={
            <EmptyState
              title={`Nenhum registro em ${config.title.toLowerCase()}`}
              description="Esta área está pronta para receber dados reais quando a camada de backend for conectada."
              actionLabel={config.actionLabel}
            />
          }
        />
      </section>
    </PageContainer>
  );
}

export function ModuleReportsScreen({ moduleKey }: { moduleKey: ModuleKey }) {
  const nav = moduleNavigation.find((item) => item.href === `/${moduleKey}`);

  if (!nav) {
    notFound();
  }

  return (
    <PageContainer>
      <SectionHeader
        title={`Relatórios de ${nav.label.toLowerCase()}`}
        description={`Explore leituras executivas e operacionais do módulo de ${nav.label.toLowerCase()}.`}
        actions={[{ label: "Gerar relatório" }]}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Modelos disponíveis" value="5" description="Conjunto inicial de relatórios configurados no módulo." />
        <StatCard label="Atualização" value="15 min" description="Frequência simulada de consolidação visual." />
        <StatCard label="Exportações" value="PDF / XLS" description="Formatos previstos para expansão futura." />
      </section>

      <ActionBar items={[{ label: "Gerar relatório" }, { label: "Exportar visão", tone: "neutral" }]} />
      <FilterBar
        placeholder={`Buscar relatórios de ${nav.label.toLowerCase()}`}
        chips={[
          { label: "Todos", active: true },
          { label: "Executivos" },
          { label: "Operacionais" },
        ]}
      />

      <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_12px_30px_rgba(0,74,173,0.06)]">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            Catálogo de relatórios
          </h2>
          <p className="text-sm text-[var(--color-text-soft)]">
            Relatórios disponíveis para leitura gerencial e acompanhamento operacional.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          {reportItems(nav.label).map((report) => (
            <article key={report.title} className="rounded-[24px] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[var(--color-primary)]">
                    {report.title}
                  </h3>
                  <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                    {report.description}
                  </p>
                </div>
                <StatusBadge variant={statusVariant(report.status)}>
                  {report.status}
                </StatusBadge>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <StatusBadge variant="info">{report.cadence}</StatusBadge>
                <StatusBadge variant="success">{report.owner}</StatusBadge>
              </div>
            </article>
          ))}
        </div>
      </section>
    </PageContainer>
  );
}

function reportItems(label: string) {
  return [
    { title: "Resumo executivo", description: `Visão consolidada com indicadores principais de ${label.toLowerCase()}.`, cadence: "Semanal", owner: "Gestão", status: "Disponível" },
    { title: "Acompanhamento operacional", description: "Leitura detalhada das rotinas e exceções da área.", cadence: "Diário", owner: "Operações", status: "Disponível" },
    { title: "Análise histórica", description: "Comparativo por período para apoio a decisões futuras.", cadence: "Mensal", owner: "Coordenação", status: "Em preparação" },
  ];
}

function statusVariant(value: string): "info" | "success" | "warning" | "danger" {
  const normalized = value.toLowerCase();

  if (["ativo", "aprovado", "concluído", "confirmado", "sucesso", "disponível", "publicado", "conectado", "online", "auditado"].some((term) => normalized.includes(term))) return "success";
  if (["atenção", "pendente", "em revisão", "em aberto", "em andamento", "em cotação", "em teste", "novo", "qualificando", "férias", "previsto", "projetado", "crítico", "separação", "separando", "conferência", "proposta", "enviado", "agendado", "em rota", "preparação"].some((term) => normalized.includes(term))) return "warning";
  if (["atrasado", "alerta", "bloqueada"].some((term) => normalized.includes(term))) return "danger";
  return "info";
}
