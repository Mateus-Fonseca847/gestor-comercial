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

type Row = { id: string; codigo: string; origem: string; destino: string; status: string };

export default function EstoqueTransferenciasPage() {
  const transferenciaIds = useEstoqueStore((state) => state.entities.transferencias.allIds);
  const transferenciasById = useEstoqueStore((state) => state.entities.transferencias.byId);
  const depositosById = useEstoqueStore((state) => state.entities.depositos.byId);

  const transferencias = useMemo(() => transferenciaIds.map((id) => transferenciasById[id]), [transferenciaIds, transferenciasById]);

  const rows: Row[] = useMemo(() => transferencias.map((transferencia) => ({
    id: transferencia.id,
    codigo: transferencia.codigo,
    origem: depositosById[transferencia.depositoOrigemId]?.nome ?? "Origem não encontrada",
    destino: depositosById[transferencia.depositoDestinoId]?.nome ?? "Destino não encontrado",
    status: formatStatus(transferencia.status),
  })), [transferencias, depositosById]);

  const columns = [
    { key: "codigo", header: "Transferência" },
    { key: "origem", header: "Origem" },
    { key: "destino", header: "Destino" },
    { key: "status", header: "Status", render: (row: Row) => <StatusBadge variant={row.status === "Recebida" ? "success" : row.status === "Cancelada" ? "danger" : "warning"}>{row.status}</StatusBadge> },
  ];

  return (
    <PageContainer>
      <SectionHeader title="Transferências" description="Controle o fluxo interno entre depósitos com dados reais do store." actions={[{ label: "Nova transferência" }]} />
      <section className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Transferências" value={String(transferencias.length)} description="Registros atuais do fluxo interno." />
        <StatCard label="Em trânsito" value={String(transferencias.filter((item) => item.status === "em_transito" || item.status === "pendente").length)} description="Operações ainda em deslocamento ou aguardando conclusão." />
        <StatCard label="Recebidas" value={String(transferencias.filter((item) => item.status === "recebida").length)} description="Transferências concluídas no módulo." />
      </section>
      <FilterBar placeholder="Buscar em transferências" chips={[{ label: "Todas", active: true }, { label: "Pendentes" }, { label: "Recebidas" }]} />
      <DataTable columns={columns} data={rows} emptyState={<EmptyState title="Nenhuma transferência encontrada" description="Crie transferências para movimentar estoque entre depósitos." actionLabel="Nova transferência" />} />
    </PageContainer>
  );
}

function formatStatus(status: string) {
  if (status === "recebida") return "Recebida";
  if (status === "cancelada") return "Cancelada";
  if (status === "em_transito") return "Em trânsito";
  if (status === "separacao") return "Separação";
  if (status === "pendente") return "Pendente";
  return "Rascunho";
}
