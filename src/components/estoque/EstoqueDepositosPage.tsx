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

type Row = { id: string; nome: string; codigo: string; itens: number; disponivel: number; status: string };

export default function EstoqueDepositosPage() {
  const depositoIds = useEstoqueStore((state) => state.entities.depositos.allIds);
  const depositosById = useEstoqueStore((state) => state.entities.depositos.byId);
  const saldoIds = useEstoqueStore((state) => state.entities.saldosProduto.allIds);
  const saldosById = useEstoqueStore((state) => state.entities.saldosProduto.byId);

  const depositos = useMemo(() => depositoIds.map((id) => depositosById[id]), [depositoIds, depositosById]);
  const saldos = useMemo(() => saldoIds.map((id) => saldosById[id]), [saldoIds, saldosById]);

  const rows: Row[] = useMemo(() => depositos.map((deposito) => {
    const saldosDoDeposito = saldos.filter((saldo) => saldo.depositoId === deposito.id);
    return {
      id: deposito.id,
      nome: deposito.nome,
      codigo: deposito.codigo,
      itens: saldosDoDeposito.reduce((total, saldo) => total + saldo.quantidadeFisica, 0),
      disponivel: saldosDoDeposito.reduce((total, saldo) => total + saldo.quantidadeDisponivel, 0),
      status: deposito.status === "ativo" ? "Operacional" : deposito.status === "bloqueado" ? "Bloqueado" : "Inativo",
    };
  }), [depositos, saldos]);

  const columns = [
    { key: "nome", header: "Depósito" },
    { key: "codigo", header: "Código" },
    { key: "itens", header: "Itens", align: "right" as const },
    { key: "disponivel", header: "Disponível", align: "right" as const },
    { key: "status", header: "Status", render: (row: Row) => <StatusBadge variant={row.status === "Operacional" ? "success" : row.status === "Bloqueado" ? "danger" : "warning"}>{row.status}</StatusBadge> },
  ];

  return (
    <PageContainer>
      <SectionHeader title="Depósitos" description="Acompanhe a estrutura multiestoque com saldos reais por depósito." actions={[{ label: "Novo depósito" }]} />
      <section className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Depósitos" value={String(depositos.length)} description="Estruturas cadastradas no módulo." />
        <StatCard label="Operacionais" value={String(depositos.filter((item) => item.status === "ativo").length)} description="Depósitos com movimentação liberada." />
        <StatCard label="Itens totais" value={String(rows.reduce((total, row) => total + row.itens, 0))} description="Saldo físico consolidado por depósito." />
      </section>
      <FilterBar placeholder="Buscar em depósitos" chips={[{ label: "Todos", active: true }, { label: "Operacionais" }, { label: "Bloqueados" }]} />
      <DataTable columns={columns} data={rows} emptyState={<EmptyState title="Nenhum depósito encontrado" description="Cadastre depósitos para distribuir o estoque." actionLabel="Novo depósito" />} />
    </PageContainer>
  );
}
