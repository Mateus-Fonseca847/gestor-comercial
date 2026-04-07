"use client";

import { MessageCircleMore, PackagePlus, Receipt, ShoppingCart, Users } from "lucide-react";
import { ActionBar } from "@/components/page/action-bar";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatusBadge } from "@/components/page/status-badge";
import { DashboardKpiCard } from "@/modules/estoque/components/dashboard-kpi-card";
import { DashboardListBlock } from "@/modules/estoque/components/dashboard-list-block";
import { QuickActionsPanel } from "@/modules/shared/components/quick-actions-panel";
import { useHomeOperationalData } from "@/modules/shared/home/use-home-operational-data";

const quickActions = [
  {
    label: "Nova venda",
    description: "Abrir o caixa e registrar uma venda agora.",
    href: "/vendas/nova",
    icon: ShoppingCart,
  },
  {
    label: "Novo pedido WhatsApp",
    description: "Registrar pedido recebido no atendimento.",
    href: "/vendas/nova?canal=whatsapp",
    icon: MessageCircleMore,
  },
  {
    label: "Novo cliente",
    description: "Cadastrar cliente para vender e atender melhor.",
    href: "/cadastros/clientes",
    icon: Users,
  },
  {
    label: "Novo produto",
    description: "Cadastrar item novo para vender hoje.",
    href: "/estoque/produtos/novo",
    icon: PackagePlus,
  },
  {
    label: "Registrar entrada de estoque",
    description: "Dar entrada rapida no que acabou de chegar.",
    href: "/estoque/entradas",
    icon: Receipt,
  },
  {
    label: "Ver reposicao",
    description: "Abrir a fila de itens que precisam ser repostos.",
    href: "/estoque/reposicao",
    icon: PackagePlus,
  },
];

export function HomeOperationalPage() {
  const {
    salesSummary,
    channelSummary,
    recentClients,
    recentSales,
    commercialStockMovements,
    lowStockCount,
    zeroStockCount,
    replenishmentItems,
  } = useHomeOperationalData();

  return (
    <PageContainer>
      <SectionHeader
        title="Painel da loja"
        description="Veja rapido como estao as vendas, os pedidos e o estoque antes de comecar o dia."
        actions={[
          { label: "Nova venda", href: "/vendas/nova" },
          { label: "Ver estoque", variant: "secondary", href: "/estoque/produtos" },
        ]}
      />

      <ActionBar
        items={[
          { label: "Nova venda", href: "/vendas/nova" },
          { label: "Novo pedido WhatsApp", tone: "neutral", href: "/vendas/nova?canal=whatsapp" },
          { label: "Registrar entrada de estoque", tone: "neutral", href: "/estoque/entradas" },
        ]}
      />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="relative overflow-hidden rounded-[34px] border border-[var(--color-border)]/90 bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_58%,#eef5ff_100%)] p-8 shadow-[0_16px_38px_rgba(15,23,42,0.08)]">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-[var(--color-primary)]" />
          <div className="relative space-y-6">
            <div className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-soft)]">
              Operacao do dia
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">
                O que precisa da sua atencao agora.
              </h2>
              <p className="max-w-2xl text-sm leading-7 text-[var(--color-text-soft)]">
                A Home ja esta pronta para evoluir com vendas, clientes e pedidos por canal sem quebrar a interface.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <HighlightCard
                label="Faturamento do dia"
                value={formatCurrency(salesSummary.faturamentoDia)}
                note="Venda presencial e WhatsApp"
              />
              <HighlightCard
                label="Vendas do dia"
                value={String(salesSummary.vendasDia)}
                note="Atendimentos fechados"
              />
              <HighlightCard
                label="Ticket medio"
                value={formatCurrency(salesSummary.ticketMedio)}
                note="Media das vendas do dia"
              />
            </div>
          </div>
        </article>

        <section className="rounded-[30px] border border-[var(--color-border)]/90 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Reposicao</h2>
            <p className="text-sm text-[var(--color-text-soft)]">
              Itens que ja merecem compra ou conferencia.
            </p>
          </div>

          <div className="space-y-3">
            {replenishmentItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 rounded-[22px] border border-[var(--color-border)]/80 bg-[var(--color-surface-alt)] px-4 py-3"
              >
                <div>
                  <p className="font-medium text-[var(--color-text)]">{item.nome}</p>
                  <p className="text-sm text-[var(--color-text-soft)]">
                    Saldo {item.saldo} • Minimo {item.minimo}
                  </p>
                </div>
                <StatusBadge variant={item.status === "zerado" ? "danger" : "warning"}>
                  {item.status === "zerado" ? "Zerado" : "Baixo"}
                </StatusBadge>
              </div>
            ))}

            {!replenishmentItems.length ? (
              <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-5 text-sm text-[var(--color-text-soft)]">
                Nenhum item critico no momento.
              </div>
            ) : null}
          </div>
        </section>
      </section>

      <section className="grid gap-6 lg:grid-cols-3 xl:grid-cols-6">
        <DashboardKpiCard
          label="Faturamento do dia"
          value={formatCurrency(salesSummary.faturamentoDia)}
          note="Resumo de vendas do dia."
        />
        <DashboardKpiCard
          label="Vendas do dia"
          value={String(salesSummary.vendasDia)}
          note="Quantidade de vendas registradas."
        />
        <DashboardKpiCard
          label="Pedidos WhatsApp"
          value={String(channelSummary.find((item) => item.canal === "WhatsApp")?.quantidadePedidos ?? 0)}
          note="Pedidos do canal digital."
        />
        <DashboardKpiCard
          label="Estoque baixo"
          value={String(lowStockCount)}
          note="Itens perto da ruptura."
        />
        <DashboardKpiCard
          label="Produtos zerados"
          value={String(zeroStockCount)}
          note="Itens sem saldo agora."
        />
        <DashboardKpiCard
          label="Clientes recentes"
          value={String(recentClients.length)}
          note="Base ativa do dia."
        />
      </section>

      <QuickActionsPanel
        title="Acoes rapidas"
        description="Atalhos para vender, atender e repor sem perder tempo."
        items={quickActions}
      />

      <section className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-[30px] border border-[var(--color-border)]/90 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Pedidos por canal</h2>
              <p className="text-sm text-[var(--color-text-soft)]">
                Bloco pronto para consolidar pedidos da loja e do WhatsApp.
              </p>
            </div>
            <StatusBadge variant="info">Hoje</StatusBadge>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {channelSummary.map((item) => (
              <div
                key={item.canal}
                className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-4"
              >
                <p className="text-sm text-[var(--color-text-soft)]">{item.canal}</p>
                <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">
                  {item.quantidadePedidos} pedidos
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                  {formatCurrency(item.valorTotal)} no dia
                </p>
              </div>
            ))}
          </div>
        </section>

        <DashboardListBlock
          title="Clientes recentes"
          description="Bloco pronto para ligar na base real de clientes quando ela estiver disponivel."
          href="/cadastros/clientes"
          items={recentClients.map((client) => ({
            id: client.id,
            title: client.nome,
            meta: client.meta,
            aside: (
              <StatusBadge variant={client.origem === "WhatsApp" ? "info" : "success"}>
                {client.origem}
              </StatusBadge>
            ),
          }))}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <DashboardListBlock
          title="Ultimas vendas"
          description="Bloco preparado para receber o historico real de vendas do dia."
          href="/vendas"
          items={recentSales.map((sale) => ({
            id: sale.id,
            title: sale.cliente,
            meta: sale.meta,
            aside: (
              <div className="text-right">
                <p className="text-sm font-semibold text-[var(--color-text)]">
                  {formatCurrency(sale.valor)}
                </p>
                <p className="text-xs text-[var(--color-text-soft)]">{sale.canal}</p>
              </div>
            ),
          }))}
        />

        <DashboardListBlock
          title="Movimentacoes ligadas a operacao comercial"
          description="Entradas, saidas e reservas relacionadas a venda, WhatsApp e reposicao."
          href="/estoque/movimentacoes"
          items={commercialStockMovements.map((item) => ({
            id: item.id,
            title: item.titulo,
            meta: item.meta,
            aside: (
              <StatusBadge
                variant={
                  item.origemOperacional === "pedido_whatsapp"
                    ? "info"
                    : item.origemOperacional === "venda_loja"
                      ? "success"
                      : "warning"
                }
              >
                {item.origemOperacional === "pedido_whatsapp"
                  ? "Pedido WhatsApp"
                  : item.origemOperacional === "venda_loja"
                    ? "Venda na loja"
                    : item.origemOperacional === "devolucao"
                      ? "Devolucao"
                      : "Reposicao"}
              </StatusBadge>
            ),
          }))}
        />
      </section>
    </PageContainer>
  );
}

function HighlightCard({
  label,
  value,
  note,
}: {
  label: string;
  value: string;
  note: string;
}) {
  return (
    <div className="rounded-[22px] border border-[var(--color-border)]/80 bg-white/80 px-4 py-4 backdrop-blur-sm">
      <p className="text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-[var(--color-text)]">{value}</p>
      <p className="mt-1 text-sm text-[var(--color-text-soft)]">{note}</p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
