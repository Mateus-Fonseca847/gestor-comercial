"use client";

import { useDeferredValue, useMemo, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/page/empty-state";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatCard } from "@/components/page/stat-card";
import { StatusBadge } from "@/components/page/status-badge";
import {
  calcularEstoqueDisponivel,
  calcularSugestaoReposicao,
  calcularUrgenciaReposicao,
  type ReposicaoUrgencia,
} from "@/modules/estoque/helpers";
import { useEstoqueStore } from "@/modules/estoque/store";

type ReposicaoRow = {
  id: string;
  produto: string;
  saldoAtual: number;
  estoqueMinimo: number;
  sugestaoReposicao: number;
  fornecedor: string;
  urgencia: ReposicaoUrgencia;
};

const URGENCIA_ORDER: Record<ReposicaoUrgencia, number> = {
  critica: 3,
  alta: 2,
  moderada: 1,
};

export default function EstoqueReposicaoPage() {
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  const produtoIds = useEstoqueStore((state) => state.entities.produtos.allIds);
  const produtosById = useEstoqueStore((state) => state.entities.produtos.byId);
  const fornecedoresById = useEstoqueStore((state) => state.entities.fornecedores.byId);
  const saldoIds = useEstoqueStore((state) => state.entities.saldosProduto.allIds);
  const saldosById = useEstoqueStore((state) => state.entities.saldosProduto.byId);

  const produtos = useMemo(() => produtoIds.map((id) => produtosById[id]).filter(Boolean), [produtoIds, produtosById]);
  const saldos = useMemo(() => saldoIds.map((id) => saldosById[id]).filter(Boolean), [saldoIds, saldosById]);

  const reposicoes = useMemo<ReposicaoRow[]>(() => {
    return produtos
      .map((produto) => {
        const urgencia = calcularUrgenciaReposicao(produto, saldos);

        if (!urgencia) {
          return null;
        }

        return {
          id: produto.id,
          produto: produto.nome,
          saldoAtual: calcularEstoqueDisponivel(produto.id, saldos),
          estoqueMinimo: produto.estoqueMinimo,
          sugestaoReposicao: calcularSugestaoReposicao(produto, saldos),
          fornecedor: produto.fornecedorPrincipalId
            ? fornecedoresById[produto.fornecedorPrincipalId]?.nomeFantasia ?? "Sem fornecedor"
            : "Sem fornecedor",
          urgencia,
        };
      })
      .filter((item): item is ReposicaoRow => item !== null)
      .sort((a, b) => {
        if (URGENCIA_ORDER[a.urgencia] !== URGENCIA_ORDER[b.urgencia]) {
          return URGENCIA_ORDER[b.urgencia] - URGENCIA_ORDER[a.urgencia];
        }

        if (a.saldoAtual !== b.saldoAtual) {
          return a.saldoAtual - b.saldoAtual;
        }

        return a.produto.localeCompare(b.produto, "pt-BR");
      });
  }, [fornecedoresById, produtos, saldos]);

  const normalizedSearch = deferredSearch.trim().toLocaleLowerCase("pt-BR");

  const visibleRows = useMemo(
    () =>
      reposicoes.filter((row) => {
        if (!normalizedSearch) {
          return true;
        }

        return [row.produto, row.fornecedor].some((value) =>
          value.toLocaleLowerCase("pt-BR").includes(normalizedSearch),
        );
      }),
    [normalizedSearch, reposicoes],
  );

  const totalSugestao = useMemo(
    () => visibleRows.reduce((total, row) => total + row.sugestaoReposicao, 0),
    [visibleRows],
  );

  return (
    <PageContainer>
      <SectionHeader
        title="Reposição"
        description="Veja o que está acabando e decida rápido o que precisa repor para não perder venda."
        actions={[{ label: "Registrar entrada" }, { label: "Ver fornecedores", variant: "secondary" }]}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <StatCard
          label="Itens pedindo reposição"
          value={String(reposicoes.length)}
          description="Produtos abaixo do mínimo ou já zerados."
        />
        <StatCard
          label="Urgência crítica"
          value={String(reposicoes.filter((item) => item.urgencia === "critica").length)}
          description="Itens sem saldo disponível agora."
        />
        <StatCard
          label="Sugestão total"
          value={`${totalSugestao} un.`}
          description="Quantidade sugerida para recompor a cobertura básica."
        />
      </section>

      <section className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Buscar</span>
            <input
              type="search"
              placeholder="Produto ou fornecedor"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            <StatusBadge variant="danger">
              {reposicoes.filter((item) => item.urgencia === "critica").length} críticas
            </StatusBadge>
            <StatusBadge variant="warning">
              {reposicoes.filter((item) => item.urgencia === "alta").length} altas
            </StatusBadge>
            <StatusBadge variant="info">
              {reposicoes.filter((item) => item.urgencia === "moderada").length} moderadas
            </StatusBadge>
          </div>
        </div>
      </section>

      {visibleRows.length ? (
        <section className="overflow-hidden rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[#f8fafc]">
                  {[
                    "Produto",
                    "Saldo atual",
                    "Estoque mínimo",
                    "Sugestão de reposição",
                    "Fornecedor",
                    "Urgência",
                    "Ação",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRows.map((row) => (
                  <tr
                    key={row.id}
                    className={[
                      "border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[#f8fbff]",
                      row.urgencia === "critica"
                        ? "bg-red-50/70"
                        : row.urgencia === "alta"
                          ? "bg-yellow-50/60"
                          : "bg-white",
                    ].join(" ")}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-[var(--color-primary)]">
                      <Link href={`/estoque/produtos/${row.id}`}>{row.produto}</Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text)]">{row.saldoAtual}</td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-soft)]">{row.estoqueMinimo}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-[var(--color-text)]">
                      {row.sugestaoReposicao} un.
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text)]">{row.fornecedor}</td>
                    <td className="px-6 py-4 text-sm">
                      <StatusBadge variant={getUrgenciaVariant(row.urgencia)}>
                        {getUrgenciaLabel(row.urgencia)}
                      </StatusBadge>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <Link
                        href="/estoque/fornecedores"
                        className="inline-flex rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-medium text-[var(--color-primary)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-surface-alt)]"
                      >
                        Ver fornecedor
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <EmptyState
          title={search ? "Nenhum item encontrado" : "Nenhum produto pedindo reposição"}
          description={
            search
              ? "Tente buscar por outro produto ou fornecedor."
              : "Quando algum item cair abaixo do mínimo, ele aparece aqui com sugestão de reposição."
          }
          actionLabel="Ver produtos"
        />
      )}
    </PageContainer>
  );
}

function getUrgenciaLabel(urgencia: ReposicaoUrgencia) {
  if (urgencia === "critica") return "Crítica";
  if (urgencia === "alta") return "Alta";
  return "Moderada";
}

function getUrgenciaVariant(urgencia: ReposicaoUrgencia) {
  if (urgencia === "critica") return "danger" as const;
  if (urgencia === "alta") return "warning" as const;
  return "info" as const;
}
