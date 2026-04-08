"use client";

import { MessageCircleMore, PackageSearch, ShoppingBag } from "lucide-react";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatCard } from "@/components/page/stat-card";
import { StatusBadge } from "@/components/page/status-badge";

const tarefas = [
  {
    id: "task-1",
    titulo: "Responder pedidos do WhatsApp",
    descricao: "3 pedidos estão aguardando confirmação do cliente.",
    status: "Hoje",
    icon: MessageCircleMore,
  },
  {
    id: "task-2",
    titulo: "Repor itens críticos",
    descricao: "2 produtos já estão abaixo do mínimo.",
    status: "Estoque",
    icon: PackageSearch,
  },
  {
    id: "task-3",
    titulo: "Conferir vendas em aberto",
    descricao: "4 registros comerciais ainda não foram concluídos.",
    status: "Vendas",
    icon: ShoppingBag,
  },
];

export function TarefasPage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Tarefas"
        description="Acompanhe o que pede ação primeiro na rotina da loja."
        actions={[{ label: "Ir para vendas", variant: "secondary", href: "/vendas" }]}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <StatCard
          label="Pendentes hoje"
          value="7"
          description="Tarefas que ainda pedem ação da equipe."
        />
        <StatCard
          label="Em andamento"
          value="3"
          description="Atividades já puxadas para a rotina do dia."
        />
        <StatCard
          label="Concluídas"
          value="12"
          description="O que já foi resolvido hoje."
        />
      </section>

      <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Prioridades do dia
            </h2>
            <p className="text-sm text-[var(--color-text-soft)]">
              Lista simples para a operação comercial não travar.
            </p>
          </div>
          <StatusBadge variant="info">Hoje</StatusBadge>
        </div>

        <div className="space-y-3">
          {tarefas.map((tarefa) => {
            const Icon = tarefa.icon;

            return (
              <article
                key={tarefa.id}
                className="flex items-start justify-between gap-4 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-4"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-[rgba(0,74,173,0.08)] bg-[rgba(0,74,173,0.06)] text-[var(--color-primary)]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium text-[var(--color-text)]">{tarefa.titulo}</p>
                    <p className="text-sm text-[var(--color-text-soft)]">{tarefa.descricao}</p>
                  </div>
                </div>
                <StatusBadge variant="warning">{tarefa.status}</StatusBadge>
              </article>
            );
          })}
        </div>

        <div className="mt-5 rounded-[22px] border border-dashed border-[var(--color-border)] px-4 py-4 text-sm text-[var(--color-text-soft)]">
          Estrutura pronta para integrar tarefas reais de vendas, clientes, estoque e financeiro.
        </div>
      </section>
    </PageContainer>
  );
}
