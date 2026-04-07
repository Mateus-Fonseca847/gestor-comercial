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

type Row = { id: string; numero: string; fornecedor: string; deposito: string; status: string };

export default function EstoqueEntradasPage() {
  const entradaIds = useEstoqueStore((state) => state.entities.entradasMercadoria.allIds);
  const entradasById = useEstoqueStore((state) => state.entities.entradasMercadoria.byId);
  const fornecedoresById = useEstoqueStore((state) => state.entities.fornecedores.byId);
  const depositosById = useEstoqueStore((state) => state.entities.depositos.byId);

  const entradas = useMemo(() => entradaIds.map((id) => entradasById[id]), [entradaIds, entradasById]);

  const rows: Row[] = useMemo(() => entradas.map((entrada) => ({
    id: entrada.id,
    numero: entrada.numero,
    fornecedor: entrada.fornecedorId ? fornecedoresById[entrada.fornecedorId]?.nomeFantasia ?? fornecedoresById[entrada.fornecedorId]?.razaoSocial ?? "Fornecedor nao encontrado" : "Sem fornecedor",
    deposito: depositosById[entrada.depositoId]?.nome ?? "Deposito nao encontrado",
    status: formatStatus(entrada.status),
  })), [entradas, fornecedoresById, depositosById]);

  const columns = [
    { key: "numero", header: "Entrada" },
    { key: "fornecedor", header: "Fornecedor" },
    { key: "deposito", header: "Deposito" },
    { key: "status", header: "Status", render: (row: Row) => <StatusBadge variant={row.status === "Conferida" ? "success" : row.status === "Cancelada" ? "danger" : "warning"}>{row.status}</StatusBadge> },
  ];

  return (
    <PageContainer>
      <SectionHeader title="Entradas" description="Monitore recebimentos e conferencias com base no store global." actions={[{ label: "Nova entrada" }]} />
      <section className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Entradas" value={String(entradas.length)} description="Recebimentos registrados no modulo." />
        <StatCard label="Conferidas" value={String(entradas.filter((item) => item.status === "conferida").length)} description="Entradas finalizadas no recebimento." />
        <StatCard label="Pendentes" value={String(entradas.filter((item) => item.status !== "conferida" && item.status !== "cancelada").length)} description="Recebimentos ainda em andamento." />
      </section>
      <FilterBar placeholder="Buscar em entradas" chips={[{ label: "Todas", active: true }, { label: "Pendentes" }, { label: "Conferidas" }]} />
      <DataTable columns={columns} data={rows} emptyState={<EmptyState title="Nenhuma entrada encontrada" description="Registre recebimentos para acompanhar o abastecimento." actionLabel="Nova entrada" />} />
    </PageContainer>
  );
}

function formatStatus(status: string) {
  if (status === "conferida") return "Conferida";
  if (status === "cancelada") return "Cancelada";
  if (status === "parcial") return "Parcial";
  if (status === "em_conferencia") return "Em conferencia";
  return "Pendente";
}
