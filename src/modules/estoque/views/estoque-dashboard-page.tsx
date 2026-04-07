"use client";

import { useMemo } from "react";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatusBadge } from "@/components/page/status-badge";
import { DashboardActivityList } from "@/modules/estoque/components/dashboard-activity-list";
import { DashboardKpiTile } from "@/modules/estoque/components/dashboard-kpi-tile";
import {
  calcularEstoqueDisponivel,
  calcularStatusProduto,
  calcularValorTotalEmEstoque,
  formatDateBR,
  formatMovimentacaoStatus,
  formatMovimentacaoTipo,
  getProdutoStatusLabel,
  getProdutoStatusVariant,
} from "@/modules/estoque/helpers";
import { useEstoqueEntityList } from "@/modules/estoque/store";
import { QuickActionsPanel } from "@/modules/shared/components/quick-actions-panel";
import {
  MessageCircleMore,
  PackagePlus,
  Receipt,
  ShoppingCart,
  Users,
} from "lucide-react";

export function EstoqueDashboardPage() {
  const produtos = useEstoqueEntityList("produtos");
  const movimentacoes = useEstoqueEntityList("movimentacoes");
  const saldos = useEstoqueEntityList("saldosProduto");

  const agora = Date.now();
  const corteSemGiro = agora - 60 * 24 * 60 * 60 * 1000;
  type ProdutoSemGiro = {
    id: string;
    nome: string;
    estoqueDisponivel: number;
    estoqueMinimo: number;
    ultimaMovimentacaoEm?: string;
    status: ReturnType<typeof calcularStatusProduto>;
  };

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

  const produtosSemGiro = useMemo(() => {
    return produtos
      .reduce<ProdutoSemGiro[]>((acc, produto) => {
        const estoqueDisponivel = calcularEstoqueDisponivel(produto.id, saldos);

        if (estoqueDisponivel <= 0) {
          return acc;
        }

        const ultimaMovimentacao = movimentacoes
          .filter(
            (movimentacao) =>
              movimentacao.produtoId === produto.id && movimentacao.status === "confirmada",
          )
          .sort(
            (a, b) =>
              new Date(b.dataMovimentacao).getTime() - new Date(a.dataMovimentacao).getTime(),
          )[0];

        if (
          ultimaMovimentacao &&
          new Date(ultimaMovimentacao.dataMovimentacao).getTime() >= corteSemGiro
        ) {
          return acc;
        }

        acc.push({
          id: produto.id,
          nome: produto.nome,
          estoqueDisponivel,
          estoqueMinimo: produto.estoqueMinimo,
          ultimaMovimentacaoEm: ultimaMovimentacao?.dataMovimentacao,
          status: calcularStatusProduto(produto, saldos),
        });

        return acc;
      }, [])
      .sort((a, b) => a.estoqueDisponivel - b.estoqueDisponivel)
      .slice(0, 5);
  }, [corteSemGiro, movimentacoes, produtos, saldos]);

  const kpis = useMemo(
    () => [
      {
        label: "Produtos cadastrados",
        value: String(produtos.length),
        note: "Base total de itens da loja.",
        context: "Cadastro ativo",
        tone: "info" as const,
      },
      {
        label: "Abaixo do mínimo",
        value: String(produtosBaixoEstoque.length),
        note: "Itens acabando e pedindo reposição.",
        context: produtosBaixoEstoque.length ? "Agir hoje" : "Tudo em dia",
        tone: produtosBaixoEstoque.length ? ("warning" as const) : ("neutral" as const),
      },
      {
        label: "Produtos zerados",
        value: String(produtosZerados.length),
        note: "Sem saldo para vender agora.",
        context: produtosZerados.length ? "Risco de ruptura" : "Sem ruptura",
        tone: produtosZerados.length ? ("danger" as const) : ("neutral" as const),
      },
      {
        label: "Valor estimado do estoque",
        value: new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(calcularValorTotalEmEstoque(produtos, saldos)),
        note: "Custo estimado do saldo atual.",
        context: "Visão da loja",
        tone: "info" as const,
      },
      {
        label: "Itens reservados",
        value: String(itensReservados),
        note: "Separados para pedidos em aberto.",
        context: itensReservados ? "Conferir disponível" : "Sem reserva",
        tone: itensReservados ? ("warning" as const) : ("neutral" as const),
      },
    ],
    [itensReservados, produtos, produtosBaixoEstoque.length, produtosZerados.length, saldos],
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
        .slice(0, 6)
        .map((item) => ({
          id: item.id,
          title: `${formatMovimentacaoTipo(item.tipo)} • ${item.quantidade} ${item.unidadeMedida}`,
          summary: item.observacao ?? "Movimentação registrada sem observação.",
          meta: `${formatDateBR(item.dataMovimentacao, true)} • ${formatMovimentacaoStatus(item.status)}`,
          aside: (
            <StatusBadge variant={item.tipo === "entrada" ? "info" : item.tipo === "ajuste" ? "warning" : "danger"}>
              {formatMovimentacaoTipo(item.tipo)}
            </StatusBadge>
          ),
        })),
    [movimentacoes],
  );

  const acoesRapidas = [
    {
      label: "Nova venda",
      description: "Abrir venda rápida sem sair da rotina.",
      href: "/vendas/nova",
      icon: ShoppingCart,
    },
    {
      label: "Novo pedido WhatsApp",
      description: "Registrar atendimento do canal digital.",
      href: "/vendas/pedidos/novo",
      icon: MessageCircleMore,
    },
    {
      label: "Novo cliente",
      description: "Cadastrar cliente para vender melhor.",
      href: "/cadastros/clientes",
      icon: Users,
    },
    {
      label: "Novo produto",
      description: "Cadastrar item novo para a loja.",
      href: "/estoque/produtos/novo",
      icon: PackagePlus,
    },
    {
      label: "Registrar entrada de estoque",
      description: "Dar entrada no que acabou de chegar.",
      href: "/estoque/entradas",
      icon: Receipt,
    },
    {
      label: "Ver reposição",
      description: "Abrir os itens que pedem compra.",
      href: "/estoque/reposicao",
      icon: PackagePlus,
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Resumo do estoque"
        description="Veja rápido o que está acabando, o que zerou e as últimas movimentações da loja."
      />

      <section className="grid gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {kpis.map((metric) => (
          <DashboardKpiTile
            key={metric.label}
            label={metric.label}
            value={metric.value}
            note={metric.note}
            context={metric.context}
            tone={metric.tone}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <QuickActionsPanel
          title="Ações rápidas"
          description="Atalhos do dia para vender, atender e repor com menos cliques."
          items={acoesRapidas}
        />

        <article className="rounded-[30px] border border-[var(--color-border)]/90 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Produtos sem giro recente</h2>
              <p className="text-sm text-[var(--color-text-soft)]">
                Itens com saldo parado há pelo menos 60 dias.
              </p>
            </div>
            <StatusBadge variant={produtosSemGiro.length ? "warning" : "success"}>
              {produtosSemGiro.length ? "Acompanhar" : "Em dia"}
            </StatusBadge>
          </div>

          <div className="space-y-3">
            {produtosSemGiro.length ? (
              produtosSemGiro.map((produto) => (
                <div
                  key={produto.id}
                  className="flex flex-col gap-3 rounded-[22px] border border-[var(--color-border)]/80 bg-[var(--color-surface-alt)] px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-[var(--color-text)]">{produto.nome}</p>
                    <p className="text-sm text-[var(--color-text-soft)]">
                      Disponível {produto.estoqueDisponivel} • Mínimo {produto.estoqueMinimo}
                    </p>
                    <p className="text-sm text-[var(--color-text-soft)]">
                      {produto.ultimaMovimentacaoEm
                        ? `Última movimentação em ${formatDateBR(produto.ultimaMovimentacaoEm)}`
                        : "Sem movimentação registrada"}
                    </p>
                  </div>
                  <StatusBadge variant={getProdutoStatusVariant(produto.status)}>
                    {getProdutoStatusLabel(produto.status)}
                  </StatusBadge>
                </div>
              ))
            ) : (
              <div className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-8 text-sm text-[var(--color-text-soft)]">
                Nenhum produto parado no momento.
              </div>
            )}
          </div>
        </article>
      </section>

      <DashboardActivityList
        title="Últimas movimentações"
        description="Entradas, saídas e ajustes mais recentes do estoque."
        href="/estoque/movimentacoes"
        items={movimentacoesRecentes}
      />
    </PageContainer>
  );
}
