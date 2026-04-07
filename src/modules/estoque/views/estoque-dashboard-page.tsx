"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ActionBar } from "@/components/page/action-bar";
import { FilterBar } from "@/components/page/filter-bar";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatusBadge } from "@/components/page/status-badge";
import {
  DashboardDecisionAlertList,
  type DashboardDecisionAlert,
} from "@/modules/estoque/components/dashboard-decision-alert-list";
import { DashboardDepositoGrid } from "@/modules/estoque/components/dashboard-deposito-grid";
import { DashboardKpiTile } from "@/modules/estoque/components/dashboard-kpi-tile";
import { DashboardActivityList } from "@/modules/estoque/components/dashboard-activity-list";
import { DashboardReplenishmentActions } from "@/modules/estoque/components/dashboard-replenishment-actions";
import { DashboardActionShortcuts } from "@/modules/estoque/components/dashboard-action-shortcuts";
import {
  calcularEstoqueDisponivel,
  calcularStatusProduto,
  formatDateBR,
  formatMovimentacaoTipo,
  calcularValorTotalEmEstoque,
} from "@/modules/estoque/helpers";
import { useEstoqueEntityList, useEstoqueStore } from "@/modules/estoque/store";

export function EstoqueDashboardPage() {
  const produtos = useEstoqueEntityList("produtos");
  const depositos = useEstoqueEntityList("depositos");
  const movimentacoes = useEstoqueEntityList("movimentacoes");
  const entradas = useEstoqueEntityList("entradasMercadoria");
  const alertas = useEstoqueEntityList("alertasEstoque");
  const saldos = useEstoqueEntityList("saldosProduto");

  const agora = Date.now();
  const corteSemGiro = agora - 60 * 24 * 60 * 60 * 1000;
  const corteValidade = agora + 30 * 24 * 60 * 60 * 1000;

  const produtosCriticos = useMemo(
    () =>
      produtos.filter((produto) => {
        const status = calcularStatusProduto(produto, saldos);
        return status === "baixo" || status === "zerado";
      }),
    [produtos, saldos],
  );

  const produtosBaixoEstoque = useMemo(
    () => produtos.filter((produto) => calcularStatusProduto(produto, saldos) === "baixo"),
    [produtos, saldos],
  );

  const produtosZerados = useMemo(
    () => produtos.filter((produto) => calcularStatusProduto(produto, saldos) === "zerado"),
    [produtos, saldos],
  );

  const itensReservados = useMemo(
    () => saldos.reduce((total, saldo) => total + saldo.quantidadeReservada, 0),
    [saldos],
  );

  const dashboardAlerts = useMemo<DashboardDecisionAlert[]>(() => {
    const estoqueAlerts = alertas.map((alerta) => ({
      id: alerta.id,
      severity:
        alerta.severidade === "critical"
          ? ("danger" as const)
          : alerta.severidade === "warning"
            ? ("warning" as const)
            : ("info" as const),
      label:
        alerta.severidade === "critical"
          ? "Ruptura"
          : alerta.severidade === "warning"
            ? "Abaixo do mínimo"
            : "Acompanhar",
      item: alerta.titulo,
      problem: alerta.mensagem,
      data: alerta.severidade === "critical" ? "Saldo indisponível" : "Revisar cobertura",
      href: "/estoque/produtos",
      primaryAction:
        alerta.severidade === "critical" ? "Repor agora" : "Ajustar estoque",
      secondaryAction: "Ver histórico",
    }));

    const validadeAlerts = entradas.flatMap((entrada) =>
      entrada.itens.flatMap((item) => {
        const produto = produtos.find((current) => current.id === item.produtoId);

        if (!produto?.controlaValidade || !item.validadeEm) {
          return [];
        }

        const validade = new Date(item.validadeEm).getTime();

        if (Number.isNaN(validade) || validade < agora || validade > corteValidade) {
          return [];
        }

        return [
          {
            id: `validade-${entrada.id}-${item.id}`,
            severity: "warning" as const,
            label: "Validade próxima",
            item: produto.nome,
            problem: "Lote com vencimento dentro da janela crítica de 30 dias.",
            data: `Validade em ${formatDateBR(item.validadeEm)}`,
            href: "/estoque/entradas",
            primaryAction: "Criar pedido",
            secondaryAction: "Ver histórico",
          },
        ];
      }),
    );

    const semGiroAlerts = produtos.flatMap((produto) => {
      const estoqueAtual = calcularEstoqueDisponivel(produto.id, saldos);

      if (estoqueAtual <= 0) {
        return [];
      }

      const ultimaMovimentacao = movimentacoes
        .filter(
          (movimentacao) =>
            movimentacao.status === "confirmada" && movimentacao.produtoId === produto.id,
        )
        .sort(
          (a, b) =>
            new Date(b.dataMovimentacao).getTime() - new Date(a.dataMovimentacao).getTime(),
        )[0];

      if (
        ultimaMovimentacao &&
        new Date(ultimaMovimentacao.dataMovimentacao).getTime() >= corteSemGiro
      ) {
        return [];
      }

      return [
        {
          id: `sem-giro-${produto.id}`,
          severity: "info" as const,
          label: "Sem giro",
          item: produto.nome,
          problem: "Saldo parado sem movimentação confirmada nos últimos 60 dias.",
          data: `Disponível ${estoqueAtual} unidades`,
          href: "/estoque/relatorios",
          primaryAction: "Ver histórico",
        },
      ];
    });

    return [...estoqueAlerts, ...validadeAlerts, ...semGiroAlerts]
      .sort((a, b) => priorityWeight(b.severity) - priorityWeight(a.severity))
      .slice(0, 5);
  }, [agora, alertas, corteSemGiro, corteValidade, entradas, movimentacoes, produtos, saldos]);

  const depositosResumo = useMemo(
    () =>
      depositos.map((deposito) => {
        const saldosDoDeposito = saldos.filter((saldo) => saldo.depositoId === deposito.id);
        const itens = saldosDoDeposito.reduce((total, saldo) => total + saldo.quantidadeFisica, 0);
        const disponivel = saldosDoDeposito.reduce(
          (total, saldo) => total + saldo.quantidadeDisponivel,
          0,
        );

        return {
          id: deposito.id,
          nome: deposito.nome,
          ocupacao: `${itens} itens`,
          itens: `${disponivel} disponíveis`,
          status:
            deposito.status === "ativo"
              ? "Operacional"
              : deposito.status === "bloqueado"
                ? "Bloqueado"
                : "Inativo",
        };
      }),
    [depositos, saldos],
  );

  const inventoryMetrics = useMemo(
    () => [
      {
        label: "Total de produtos",
        value: String(produtos.length),
        note: "Base total monitorada na operação.",
        context: `${produtosCriticos.length} exigem atenção`,
        tone: produtosCriticos.length ? ("info" as const) : ("neutral" as const),
        trend: "up" as const,
      },
      {
        label: "Produtos com estoque baixo",
        value: String(produtosBaixoEstoque.length),
        note: "Abaixo do mínimo configurado.",
        context: "Ajuste ou reponha ainda hoje",
        tone: produtosBaixoEstoque.length ? ("warning" as const) : ("neutral" as const),
        trend: produtosBaixoEstoque.length ? ("up" as const) : ("flat" as const),
      },
      {
        label: "Produtos zerados",
        value: String(produtosZerados.length),
        note: "Sem saldo para venda ou operação.",
        context: produtosZerados.length ? "Risco de ruptura" : "Sem ruptura",
        tone: produtosZerados.length ? ("danger" as const) : ("neutral" as const),
        trend: produtosZerados.length ? ("up" as const) : ("flat" as const),
      },
      {
        label: "Valor total em estoque",
        value: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(calcularValorTotalEmEstoque(produtos, saldos)),
        note: "Saldo físico multiplicado pelo custo unitário.",
        context: "Base patrimonial atual",
        tone: "info" as const,
        trend: "flat" as const,
      },
      {
        label: "Itens reservados",
        value: String(itensReservados),
        note: "Comprometidos por pedidos em aberto.",
        context: "Validar disponibilidade real",
        tone: itensReservados > 0 ? ("warning" as const) : ("neutral" as const),
        trend: itensReservados > 0 ? ("up" as const) : ("flat" as const),
      },
    ],
    [
      itensReservados,
      produtos,
      produtosBaixoEstoque.length,
      produtosCriticos.length,
      produtosZerados.length,
      saldos,
    ],
  );

  const movimentacoesRecentes = useMemo(
    () =>
      movimentacoes
        .filter(
          (item) =>
            item.status === "confirmada" &&
            (item.tipo === "entrada" || item.tipo === "saida" || item.tipo === "ajuste"),
        )
        .sort(
          (a, b) =>
            new Date(b.dataMovimentacao).getTime() - new Date(a.dataMovimentacao).getTime(),
        )
        .slice(0, 5)
        .map((item) => ({
          id: item.id,
          descricao: `${formatMovimentacaoTipo(item.tipo)} • ${item.quantidade} ${item.unidadeMedida}`,
          resumo: item.observacao ?? "Movimentação confirmada sem observação adicional.",
          origem: formatDateBR(item.dataMovimentacao),
          data: `Status ${item.status}`,
          tipo: formatMovimentacaoTipo(item.tipo),
          status: "Concluída",
        })),
    [movimentacoes],
  );

  const quickLinks = [
    {
      title: "Produtos",
      description: "Revise cadastro, estoque e criticidade.",
      href: "/estoque/produtos",
      helper: "Repor, ajustar ou revisar saldos",
    },
    {
      title: "Movimentações",
      description: "Acompanhe entradas, saídas e ajustes.",
      href: "/estoque/movimentacoes",
      helper: "Últimos eventos operacionais",
    },
    {
      title: "Relatórios",
      description: "Abra a camada analítica do estoque.",
      href: "/estoque/relatorios",
      helper: "Analisar giro, cobertura e desvios",
    },
    {
      title: "Compras",
      description: "Dispare abastecimento dos itens críticos.",
      href: "/estoque/compras",
      helper: "Criar pedido com menos cliques",
    },
  ];

  const reposicaoIndicadores = useMemo(
    () =>
      produtosCriticos.slice(0, 4).map((produto) => {
        const disponivel = calcularEstoqueDisponivel(produto.id, saldos);

        return {
          id: produto.id,
          title: produto.nome,
          detail: `Atual ${disponivel} • Mínimo ${produto.estoqueMinimo}`,
          shortage: `${Math.max(produto.estoqueMinimo - disponivel, 0)} em falta`,
          status: disponivel <= 0 ? ("danger" as const) : ("warning" as const),
        };
      }),
    [produtosCriticos, saldos],
  );

  return (
    <PageContainer>
      <SectionHeader
        title="Dashboard de estoque"
        description="Monitore saldos, alertas operacionais e acessos rápidos do módulo de estoque em um único espaço."
        actions={[
          { label: "Nova movimentação" },
          { label: "Exportar visão", variant: "secondary" },
        ]}
      />

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <ActionBar
          items={[
            { label: "Nova movimentação" },
            { label: "Ajustar estoque", tone: "neutral" },
            { label: "Gerar relatório", tone: "neutral" },
          ]}
        />

        <FilterBar
          placeholder="Buscar item, alerta ou movimentação"
          chips={[
            { label: "Hoje", active: true },
            { label: "Últimos 7 dias" },
            { label: "Itens críticos" },
          ]}
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="relative overflow-hidden rounded-[32px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-md)]">
          <div className="absolute inset-y-0 left-0 w-1.5 bg-[var(--color-primary)]" />
          <div className="relative space-y-6">
            <div className="inline-flex rounded-full border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-soft)]">
              Centro operacional
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-text)]">
                Veja agora o que trava operação, o que exige ajuste e onde agir primeiro.
              </h2>
              <p className="max-w-xl text-sm leading-7 text-[var(--color-text-soft)]">
                O dashboard resume ruptura, cobertura e movimentação recente para você decidir sem trocar de tela.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-red-700">
                  Crítico
                </p>
                <p className="mt-2 text-2xl font-bold text-[var(--color-text)]">
                  {produtosZerados.length}
                </p>
                <p className="mt-1 text-sm text-red-700">Itens sem saldo disponível</p>
              </div>
              <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-yellow-700">
                  Atenção
                </p>
                <p className="mt-2 text-2xl font-bold text-[var(--color-text)]">
                  {produtosBaixoEstoque.length}
                </p>
                <p className="mt-1 text-sm text-yellow-700">Produtos abaixo do mínimo</p>
              </div>
              <div className="rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-700">
                  Informativo
                </p>
                <p className="mt-2 text-2xl font-bold text-[var(--color-text)]">
                  {itensReservados}
                </p>
                <p className="mt-1 text-sm text-blue-700">Itens reservados no momento</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/estoque/produtos"
                className="rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-primary-strong)] hover:shadow-md"
              >
                Revisar produtos
              </Link>
              <Link
                href="/estoque/movimentacoes"
                className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-2.5 text-sm font-medium text-[var(--color-text)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-surface-alt)] hover:shadow-sm"
              >
                Abrir movimentações
              </Link>
            </div>
          </div>
        </article>

        <DashboardReplenishmentActions items={reposicaoIndicadores} />
      </section>

      <section className="grid gap-6 lg:grid-cols-3 xl:grid-cols-5">
        {inventoryMetrics.map((metric) => (
          <DashboardKpiTile
            key={metric.label}
            label={metric.label}
            value={metric.value}
            note={metric.note}
            context={metric.context}
            tone={metric.tone}
            trend={metric.trend}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Alertas operacionais
              </h2>
              <p className="text-sm text-[var(--color-text-soft)]">
                Estoque mínimo, validade próxima e itens sem giro recente.
              </p>
            </div>
            <StatusBadge variant="warning">Fila de ação</StatusBadge>
          </div>

          <DashboardDecisionAlertList alerts={dashboardAlerts} />
        </article>

        <DashboardActionShortcuts items={quickLinks} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <DashboardActivityList
          title="Movimentações recentes"
          description="Últimos registros processados pelo estoque."
          href="/estoque/movimentacoes"
          items={movimentacoesRecentes.map((item) => ({
            id: item.id,
            title: item.descricao,
            summary: item.resumo,
            meta: `${item.origem} • ${item.data}`,
            aside: (
              <>
                <StatusBadge variant={item.tipo === "Entrada" ? "info" : "warning"}>
                  {item.tipo}
                </StatusBadge>
                <StatusBadge
                  variant={item.status === "Concluída" ? "success" : "warning"}
                >
                  {item.status}
                </StatusBadge>
              </>
            ),
          }))}
        />

        <DashboardDepositoGrid items={depositosResumo} />
      </section>
    </PageContainer>
  );
}

function priorityWeight(severity: DashboardDecisionAlert["severity"]) {
  if (severity === "danger") return 3;
  if (severity === "warning") return 2;
  return 1;
}
