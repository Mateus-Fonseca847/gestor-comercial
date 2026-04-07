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

type Row = { id: string; numero: string; fornecedor: string; valor: string; status: string };

export default function EstoqueComprasPage() {
  const pedidoIds = useEstoqueStore((state) => state.entities.pedidosCompra.allIds);
  const pedidosById = useEstoqueStore((state) => state.entities.pedidosCompra.byId);
  const fornecedorIds = useEstoqueStore((state) => state.entities.fornecedores.allIds);
  const fornecedoresById = useEstoqueStore((state) => state.entities.fornecedores.byId);

  const pedidos = useMemo(() => pedidoIds.map((id) => pedidosById[id]), [pedidoIds, pedidosById]);
  const fornecedores = useMemo(() => fornecedorIds.map((id) => fornecedoresById[id]), [fornecedorIds, fornecedoresById]);
  void fornecedores;

  const rows: Row[] = useMemo(() => pedidos.map((pedido) => ({
    id: pedido.id,
    numero: pedido.numero,
    fornecedor: fornecedoresById[pedido.fornecedorId]?.nomeFantasia ?? fornecedoresById[pedido.fornecedorId]?.razaoSocial ?? "Fornecedor nao encontrado",
    valor: new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(pedido.valorTotal?.valor ?? 0),
    status: formatStatus(pedido.status),
  })), [pedidos, fornecedoresById]);

  const columns = [
    { key: "numero", header: "Pedido" },
    { key: "fornecedor", header: "Fornecedor" },
    { key: "valor", header: "Valor", align: "right" as const },
    { key: "status", header: "Status", render: (row: Row) => <StatusBadge variant={row.status === "Recebido" ? "success" : row.status === "Cancelado" ? "danger" : "warning"}>{row.status}</StatusBadge> },
  ];

  return (
    <PageContainer>
      <SectionHeader title="Compras" description="Acompanhe pedidos de compra reais do store global." actions={[{ label: "Novo pedido" }]} />
      <section className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Pedidos" value={String(pedidos.length)} description="Registros atuais do modulo." />
        <StatCard label="Pendentes" value={String(pedidos.filter((item) => item.status !== "recebido" && item.status !== "cancelado").length)} description="Pedidos ainda em processamento." />
        <StatCard label="Recebidos" value={String(pedidos.filter((item) => item.status === "recebido").length)} description="Pedidos finalizados no fluxo de compras." />
      </section>
      <FilterBar placeholder="Buscar em compras" chips={[{ label: "Todos", active: true }, { label: "Pendentes" }, { label: "Recebidos" }]} />
      <DataTable columns={columns} data={rows} emptyState={<EmptyState title="Nenhum pedido encontrado" description="Crie pedidos de compra para acompanhar o abastecimento." actionLabel="Novo pedido" />} />
    </PageContainer>
  );
}

function formatStatus(status: string) {
  if (status === "recebido") return "Recebido";
  if (status === "cancelado") return "Cancelado";
  if (status === "parcial" || status === "parcialmente_recebido") return "Parcial";
  if (status === "enviado" || status === "pendente_aprovacao") return "Enviado";
  return "Rascunho";
}
