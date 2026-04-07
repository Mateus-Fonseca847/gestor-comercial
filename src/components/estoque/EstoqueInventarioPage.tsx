"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/page/data-table";
import { EmptyState } from "@/components/page/empty-state";
import { FilterBar } from "@/components/page/filter-bar";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatCard } from "@/components/page/stat-card";
import { StatusBadge } from "@/components/page/status-badge";
import { calcularEstoqueDisponivel, calcularEstoqueReservado, calcularStatusProduto } from "@/modules/estoque/helpers";
import { useEstoqueStore } from "@/modules/estoque/store";

type Row = { id: string; produto: string; sku: string; estoque: number; reservado: number; status: string };

export default function EstoqueInventarioPage() {
  const produtoIds = useEstoqueStore((state) => state.entities.produtos.allIds);
  const produtosById = useEstoqueStore((state) => state.entities.produtos.byId);
  const saldoIds = useEstoqueStore((state) => state.entities.saldosProduto.allIds);
  const saldosById = useEstoqueStore((state) => state.entities.saldosProduto.byId);

  const produtos = useMemo(() => produtoIds.map((id) => produtosById[id]), [produtoIds, produtosById]);
  const saldos = useMemo(() => saldoIds.map((id) => saldosById[id]), [saldoIds, saldosById]);

  const rows: Row[] = useMemo(() => produtos.map((produto) => ({
    id: produto.id,
    produto: produto.nome,
    sku: produto.sku,
    estoque: calcularEstoqueDisponivel(produto.id, saldos),
    reservado: calcularEstoqueReservado(produto.id, saldos),
    status: formatStatus(calcularStatusProduto(produto, saldos)),
  })), [produtos, saldos]);

  const columns = [
    { key: "produto", header: "Produto" },
    { key: "sku", header: "SKU" },
    { key: "estoque", header: "Estoque", align: "right" as const },
    { key: "reservado", header: "Reservado", align: "right" as const },
    { key: "status", header: "Status", render: (row: Row) => <StatusBadge variant={row.status === "Saudavel" ? "success" : row.status === "Zerado" ? "danger" : "warning"}>{row.status}</StatusBadge> },
  ];

  return (
    <PageContainer>
      <SectionHeader title="Inventario" description="Visao consolidada do saldo atual por produto usando o store global." actions={[{ label: "Nova contagem" }]} />
      <section className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Produtos monitorados" value={String(produtos.length)} description="Cadastros consolidados no inventario." />
        <StatCard label="Saldo fisico" value={String(saldos.reduce((total, saldo) => total + saldo.quantidadeFisica, 0))} description="Soma de todas as unidades em estoque." />
        <StatCard label="Itens reservados" value={String(saldos.reduce((total, saldo) => total + saldo.quantidadeReservada, 0))} description="Quantidade comprometida em reservas." />
      </section>
      <FilterBar placeholder="Buscar em inventario" chips={[{ label: "Todos", active: true }, { label: "Criticos" }, { label: "Zerados" }]} />
      <DataTable columns={columns} data={rows} emptyState={<EmptyState title="Nenhum item no inventario" description="Cadastre produtos para consolidar o inventario." actionLabel="Novo produto" />} />
    </PageContainer>
  );
}

function formatStatus(status: string) {
  if (status === "saudavel") return "Saudavel";
  if (status === "baixo") return "Baixo";
  if (status === "zerado") return "Zerado";
  return "Inativo";
}
