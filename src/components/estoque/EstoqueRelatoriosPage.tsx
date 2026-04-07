"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/page/data-table";
import { EmptyState } from "@/components/page/empty-state";
import { FilterBar } from "@/components/page/filter-bar";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatCard } from "@/components/page/stat-card";
import { StatusBadge } from "@/components/page/status-badge";
import { calcularEstoqueDisponivel, calcularStatusProduto, calcularValorTotalEmEstoque } from "@/modules/estoque/helpers";
import { useEstoqueStore } from "@/modules/estoque/store";

type Row = { id: string; produto: string; categoria: string; estoque: number; status: string };

export default function EstoqueRelatoriosPage() {
  const produtoIds = useEstoqueStore((state) => state.entities.produtos.allIds);
  const produtosById = useEstoqueStore((state) => state.entities.produtos.byId);
  const categoriasById = useEstoqueStore((state) => state.entities.categorias.byId);
  const saldoIds = useEstoqueStore((state) => state.entities.saldosProduto.allIds);
  const saldosById = useEstoqueStore((state) => state.entities.saldosProduto.byId);
  const movimentacaoIds = useEstoqueStore((state) => state.entities.movimentacoes.allIds);

  const produtos = useMemo(() => produtoIds.map((id) => produtosById[id]), [produtoIds, produtosById]);
  const saldos = useMemo(() => saldoIds.map((id) => saldosById[id]), [saldoIds, saldosById]);

  const rows: Row[] = useMemo(() => produtos.map((produto) => ({
    id: produto.id,
    produto: produto.nome,
    categoria: categoriasById[produto.categoriaId]?.nome ?? "Sem categoria",
    estoque: calcularEstoqueDisponivel(produto.id, saldos),
    status: formatStatus(calcularStatusProduto(produto, saldos)),
  })), [produtos, categoriasById, saldos]);

  const columns = [
    { key: "produto", header: "Produto" },
    { key: "categoria", header: "Categoria" },
    { key: "estoque", header: "Estoque", align: "right" as const },
    { key: "status", header: "Status", render: (row: Row) => <StatusBadge variant={row.status === "Saudavel" ? "success" : row.status === "Zerado" ? "danger" : "warning"}>{row.status}</StatusBadge> },
  ];

  return (
    <PageContainer>
      <SectionHeader title="Relatorios" description="Indicadores operacionais consolidados com dados reais do store." actions={[{ label: "Exportar relatorio" }]} />
      <section className="grid gap-4 lg:grid-cols-4">
        <StatCard label="Produtos" value={String(produtos.length)} description="Base consolidada para relatorio." />
        <StatCard label="Movimentacoes" value={String(movimentacaoIds.length)} description="Historico operacional do modulo." />
        <StatCard label="Criticos" value={String(rows.filter((row) => row.status === "Baixo" || row.status === "Zerado").length)} description="Itens que exigem atencao." />
        <StatCard label="Valor em estoque" value={new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(calcularValorTotalEmEstoque(produtos, saldos))} description="Custo total atual do estoque." />
      </section>
      <FilterBar placeholder="Buscar em relatorios" chips={[{ label: "Resumo geral", active: true }, { label: "Produtos" }, { label: "Criticos" }]} />
      <DataTable columns={columns} data={rows} emptyState={<EmptyState title="Nenhum dado para relatorio" description="Cadastre movimentacoes e produtos para gerar indicadores." actionLabel="Atualizar leitura" />} />
    </PageContainer>
  );
}

function formatStatus(status: string) {
  if (status === "saudavel") return "Saudavel";
  if (status === "baixo") return "Baixo";
  if (status === "zerado") return "Zerado";
  return "Inativo";
}
