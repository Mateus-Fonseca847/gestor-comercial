"use client";

import { useMemo } from "react";
import { DataTable } from "@/components/page/data-table";
import { EmptyState } from "@/components/page/empty-state";
import { FilterBar } from "@/components/page/filter-bar";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatCard } from "@/components/page/stat-card";
import { StatusBadge } from "@/components/page/status-badge";
import { useEstoqueStore } from "@/modules/estoque/store";

type Row = { id: string; nome: string; descricao: string; status: string; produtos: number };

export default function EstoqueCategoriasPage() {
  const categoriaIds = useEstoqueStore((state) => state.entities.categorias.allIds);
  const categoriasById = useEstoqueStore((state) => state.entities.categorias.byId);
  const produtoIds = useEstoqueStore((state) => state.entities.produtos.allIds);
  const produtosById = useEstoqueStore((state) => state.entities.produtos.byId);

  const categorias = useMemo(() => categoriaIds.map((id) => categoriasById[id]), [categoriaIds, categoriasById]);
  const produtos = useMemo(() => produtoIds.map((id) => produtosById[id]), [produtoIds, produtosById]);

  const rows: Row[] = useMemo(() => categorias.map((categoria) => ({
    id: categoria.id,
    nome: categoria.nome,
    descricao: categoria.descricao ?? "Sem descricao",
    status: categoria.status === "ativa" ? "Ativa" : "Inativa",
    produtos: produtos.filter((produto) => produto.categoriaId === categoria.id).length,
  })), [categorias, produtos]);

  const columns = [
    { key: "nome", header: "Categoria" },
    { key: "descricao", header: "Descricao" },
    { key: "produtos", header: "Produtos", align: "right" as const },
    { key: "status", header: "Status", render: (row: Row) => <StatusBadge variant={row.status === "Ativa" ? "success" : "warning"}>{row.status}</StatusBadge> },
  ];

  return (
    <PageContainer>
      <SectionHeader title="Categorias" description="Organize a classificacao do estoque com dados reais do store." actions={[{ label: "Nova categoria" }]} />
      <section className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Categorias" value={String(categorias.length)} description="Registros conectados ao estado global." />
        <StatCard label="Ativas" value={String(categorias.filter((item) => item.status === "ativa").length)} description="Categorias disponiveis para novos produtos." />
        <StatCard label="Produtos vinculados" value={String(produtos.length)} description="Itens classificados por categoria." />
      </section>
      <FilterBar placeholder="Buscar em categorias" chips={[{ label: "Todas", active: true }, { label: "Ativas" }, { label: "Inativas" }]} />
      <DataTable columns={columns} data={rows} emptyState={<EmptyState title="Nenhuma categoria encontrada" description="Cadastre categorias para organizar o estoque." actionLabel="Nova categoria" />} />
    </PageContainer>
  );
}
