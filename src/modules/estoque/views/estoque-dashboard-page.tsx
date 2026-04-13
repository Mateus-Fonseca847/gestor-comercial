"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageContainer } from "@/components/page/page-container";
import { StatusBadge } from "@/components/page/status-badge";
import { DashboardKpiTile } from "@/modules/estoque/components/dashboard-kpi-tile";
import { StockEvolutionChart } from "@/modules/estoque/components/stock-evolution-chart";
import {
  calcularEstoqueDisponivel,
  calcularEstoqueReservado,
  calcularStatusProduto,
  calcularSugestaoReposicao,
  calcularValorTotalEmEstoque,
  formatDateBR,
  formatMovimentacaoStatus,
  formatMovimentacaoTipo,
  getProdutoStatusLabel,
  getProdutoStatusVariant,
} from "@/modules/estoque/helpers";
import { useEstoqueEntityList } from "@/modules/estoque/store";

type ProdutoPainel = {
  id: string;
  nome: string;
  sku: string;
  codigoInterno: string;
  estoqueDisponivel: number;
  estoqueReservado: number;
  estoqueMinimo: number;
  sugestaoReposicao: number;
  status: ReturnType<typeof calcularStatusProduto>;
  ultimaMovimentacaoEm?: string;
};

export function EstoqueDashboardPage() {
  const [buscaProduto, setBuscaProduto] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const produtos = useEstoqueEntityList("produtos");
  const movimentacoes = useEstoqueEntityList("movimentacoes");
  const saldos = useEstoqueEntityList("saldosProduto");

  const agora = Date.now();
  const corteSemGiro = agora - 60 * 24 * 60 * 60 * 1000;
  const buscaNormalizada = buscaProduto.trim().toLowerCase();

  const produtosAtencao = useMemo(() => {
    return produtos
      .map<ProdutoPainel>((produto) => {
        const estoqueDisponivel = calcularEstoqueDisponivel(produto.id, saldos);
        const estoqueReservado = calcularEstoqueReservado(produto.id, saldos);
        const ultimaMovimentacao = movimentacoes
          .filter(
            (movimentacao) =>
              movimentacao.produtoId === produto.id && movimentacao.status === "confirmada",
          )
          .sort(
            (a, b) =>
              new Date(b.dataMovimentacao).getTime() - new Date(a.dataMovimentacao).getTime(),
          )[0];

        return {
          id: produto.id,
          nome: produto.nome,
          sku: produto.sku,
          codigoInterno: produto.codigoInterno,
          estoqueDisponivel,
          estoqueReservado,
          estoqueMinimo: produto.estoqueMinimo,
          sugestaoReposicao: calcularSugestaoReposicao(produto, saldos),
          status: calcularStatusProduto(produto, saldos),
          ultimaMovimentacaoEm: ultimaMovimentacao?.dataMovimentacao,
        };
      })
      .filter((produto) => produto.status === "baixo" || produto.status === "zerado")
      .sort((a, b) => a.estoqueDisponivel - b.estoqueDisponivel || b.sugestaoReposicao - a.sugestaoReposicao);
  }, [movimentacoes, produtos, saldos]);

  const produtosBaixoEstoque = useMemo(
    () => produtosAtencao.filter((produto) => produto.status === "baixo"),
    [produtosAtencao],
  );

  const produtosZerados = useMemo(
    () => produtosAtencao.filter((produto) => produto.status === "zerado"),
    [produtosAtencao],
  );

  const produtosSemGiro = useMemo(
    () =>
      produtos.filter((produto) => {
        const estoqueDisponivel = calcularEstoqueDisponivel(produto.id, saldos);

        if (estoqueDisponivel <= 0) {
          return false;
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

        return !ultimaMovimentacao || new Date(ultimaMovimentacao.dataMovimentacao).getTime() < corteSemGiro;
      }).length,
    [corteSemGiro, movimentacoes, produtos, saldos],
  );

  const produtosAtencaoFiltrados = useMemo(() => {
    if (!buscaNormalizada) {
      return produtosAtencao.slice(0, 7);
    }

    return produtosAtencao
      .filter((produto) =>
        `${produto.nome} ${produto.sku} ${produto.codigoInterno}`
          .toLowerCase()
          .includes(buscaNormalizada),
      )
      .slice(0, 7);
  }, [buscaNormalizada, produtosAtencao]);

  useEffect(() => {
    if (!produtosAtencaoFiltrados.length) {
      setSelectedProductId(null);
      return;
    }

    if (!selectedProductId || !produtosAtencaoFiltrados.some((produto) => produto.id === selectedProductId)) {
      setSelectedProductId(produtosAtencaoFiltrados[0]?.id ?? null);
    }
  }, [produtosAtencaoFiltrados, selectedProductId]);

  const produtoSelecionado = useMemo(
    () => produtosAtencao.find((produto) => produto.id === selectedProductId) ?? null,
    [produtosAtencao, selectedProductId],
  );

  const valorEstoque = useMemo(
    () => calcularValorTotalEmEstoque(produtos, saldos),
    [produtos, saldos],
  );

  const produtosPorId = useMemo(
    () =>
      produtos.reduce<Record<string, (typeof produtos)[number]>>((acc, produto) => {
        acc[produto.id] = produto;
        return acc;
      }, {}),
    [produtos],
  );

  const kpis = useMemo(
    () => [
      {
        label: "Produtos cadastrados",
        value: String(produtos.length),
        note: "Base total de itens da loja.",
        context: "Cadastro ativo",
        tone: "neutral" as const,
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
        value: formatCurrency(valorEstoque),
        note: "Custo estimado do saldo atual.",
        context: "Visão da loja",
        tone: "neutral" as const,
      },
    ],
    [produtos.length, produtosBaixoEstoque.length, produtosZerados.length, valorEstoque],
  );

  const chartSummary = useMemo(() => {
    const unidadesDisponiveis = produtos.reduce(
      (total, produto) => total + calcularEstoqueDisponivel(produto.id, saldos),
      0,
    );
    const unidadesReservadas = produtos.reduce(
      (total, produto) => total + calcularEstoqueReservado(produto.id, saldos),
      0,
    );

    return [
      { label: "Itens com atenção", value: String(produtosAtencao.length) },
      { label: "Unidades disponíveis", value: String(unidadesDisponiveis) },
      { label: "Unidades reservadas", value: String(unidadesReservadas) },
      { label: "Produtos sem giro", value: String(produtosSemGiro) },
    ];
  }, [produtos, produtosAtencao.length, produtosSemGiro, saldos]);

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
        .slice(0, 7)
        .map((item) => ({
          ...item,
          produtoNome: produtosPorId[item.produtoId]?.nome ?? "Produto sem identificação",
        })),
    [movimentacoes, produtosPorId],
  );

  return (
    <PageContainer>
      <section className="space-y-6">
        <div className="space-y-2 px-1">
          <h1 className="text-[2.15rem] font-semibold tracking-[-0.03em] text-[var(--color-text)]">
            Estoque
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-soft)]">
            Leia o ritmo do estoque, identifique risco de ruptura e acompanhe cada item sem sair da tela.
          </p>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr] xl:items-stretch">
          <div className="space-y-4">
            <StockEvolutionChart />

            <section className="ui-surface-1 grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-4">
              {chartSummary.map((item) => (
                <div key={item.label} className="ui-surface-3 px-4 py-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    {item.label}
                  </p>
                  <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">
                    {item.value}
                  </p>
                </div>
              ))}
            </section>
          </div>

          <aside className="space-y-4">
            <section className="ui-surface-1 flex flex-col gap-4 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[var(--color-text)]">
                    Ações rápidas do estoque
                  </h2>
                  <p className="text-sm text-[var(--color-text-soft)]">
                    Entre no cadastro ou acompanhe as movimentações sem sair do resumo.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link
                    href="/estoque/produtos"
                    className="inline-flex items-center justify-center rounded-[18px] bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary-strong)]"
                  >
                    Ver produtos
                  </Link>
                  <Link
                    href="/estoque/movimentacoes"
                    className="inline-flex items-center justify-center rounded-[18px] border border-[rgba(21,93,252,0.16)] bg-white px-5 py-3 text-sm font-semibold text-[var(--color-text)] transition-all hover:border-[rgba(21,93,252,0.28)] hover:bg-[var(--color-surface-alt)]"
                  >
                    Movimentações
                  </Link>
                </div>
              </div>
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
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
            </div>
          </aside>
        </section>
      </section>

      <section className="rounded-[30px] border border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)] p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] md:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">Busca e filtros</p>
            <p className="text-sm text-[var(--color-text-soft)]">
              Encontre rápido um produto por nome, SKU ou código interno.
            </p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1fr]">
          <label className="flex h-14 items-center gap-3 rounded-[20px] border border-[rgba(148,163,184,0.2)] bg-white px-4 text-[var(--color-text-soft)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-200 focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]">
            <Search className="h-4 w-4 shrink-0" />
            <input
              type="search"
              value={buscaProduto}
              onChange={(event) => setBuscaProduto(event.target.value)}
              placeholder="Buscar produto no estoque por nome, SKU ou código"
              className="w-full border-0 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)]"
            />
          </label>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.95fr_0.95fr] xl:items-start">
        <article className="ui-surface-1 p-6 md:p-7">
          <div className="mb-6 flex items-start justify-between gap-4 border-b ui-divider pb-4">
            <div className="space-y-1.5">
              <h2 className="ui-section-title">Itens com mais atenção</h2>
              <p className="ui-body max-w-xl">
                Clique em um item para abrir o detalhe e entender o risco no estoque.
              </p>
            </div>
            <StatusBadge variant={produtosAtencaoFiltrados.length ? "warning" : "success"}>
              {produtosAtencaoFiltrados.length} item(ns)
            </StatusBadge>
          </div>

          <div className="space-y-3.5">
            {produtosAtencaoFiltrados.length ? (
              produtosAtencaoFiltrados.map((produto) => {
                const selected = produto.id === produtoSelecionado?.id;

                return (
                  <button
                    key={produto.id}
                    type="button"
                    onClick={() => setSelectedProductId(produto.id)}
                    className={[
                      "ui-surface-3 ui-interactive-item flex w-full flex-col gap-3 px-5 py-4 text-left lg:flex-row lg:items-center lg:justify-between",
                      selected
                        ? "border-[var(--color-primary)] shadow-[0_12px_24px_rgba(21,93,252,0.12)]"
                        : "",
                    ].join(" ")}
                  >
                    <div className="space-y-1.5">
                      <p className="ui-card-title-strong">{produto.nome}</p>
                      <p className="ui-body text-[var(--color-text)]">
                        {produto.codigoInterno} • {produto.sku}
                      </p>
                      <p className="ui-body">
                        Disponível {produto.estoqueDisponivel} • Mínimo {produto.estoqueMinimo}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[var(--color-text)]">
                          Repor {produto.sugestaoReposicao} un
                        </p>
                        <p className="text-xs text-[var(--color-text-soft)]">
                          {produto.estoqueReservado} reservado(s)
                        </p>
                      </div>
                      <StatusBadge variant={getProdutoStatusVariant(produto.status)}>
                        {getProdutoStatusLabel(produto.status)}
                      </StatusBadge>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="ui-surface-2 border-dashed px-5 py-10 ui-body">
                {buscaNormalizada
                  ? "Nenhum item encontrado com essa busca."
                  : "Nenhum item pedindo atenção agora."}
              </div>
            )}
          </div>
        </article>

        <article className="ui-surface-1 p-6 md:p-7">
          <div className="mb-6 flex items-start justify-between gap-4 border-b ui-divider pb-4">
            <div className="space-y-1.5">
              <h2 className="ui-section-title">Últimas movimentações</h2>
              <p className="ui-body max-w-xl">
                Entradas, saídas e ajustes mais recentes para leitura rápida da operação.
              </p>
            </div>
            <StatusBadge variant="info">{movimentacoesRecentes.length} registros</StatusBadge>
          </div>

          <div className="space-y-3.5">
            {movimentacoesRecentes.length ? (
              movimentacoesRecentes.map((item) => (
                <div
                  key={item.id}
                  className="ui-surface-3 ui-interactive-item flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="space-y-1.5">
                    <p className="ui-card-title-strong">{item.produtoNome}</p>
                    <p className="ui-body text-[var(--color-text)]">
                      {formatMovimentacaoTipo(item.tipo)} • {item.quantidade} {item.unidadeMedida}
                    </p>
                    <p className="ui-body">
                      {formatDateBR(item.dataMovimentacao, true)} • {formatMovimentacaoStatus(item.status)}
                    </p>
                  </div>
                  <StatusBadge
                    variant={
                      item.tipo === "entrada"
                        ? "info"
                        : item.tipo === "ajuste"
                          ? "warning"
                          : "danger"
                    }
                  >
                    {formatMovimentacaoTipo(item.tipo)}
                  </StatusBadge>
                </div>
              ))
            ) : (
              <div className="ui-surface-2 border-dashed px-5 py-10 ui-body">
                Nenhuma movimentação recente no momento.
              </div>
            )}
          </div>
        </article>

        <article className="ui-surface-1 p-6 md:p-7">
          <div className="mb-6 flex items-start justify-between gap-4 border-b ui-divider pb-4">
            <div className="space-y-1.5">
              <h2 className="ui-section-title">Detalhes do item</h2>
              <p className="ui-body max-w-xl">
                Veja saldo, reserva e sugestão de reposição do item selecionado.
              </p>
            </div>
            {produtoSelecionado ? (
              <StatusBadge variant={getProdutoStatusVariant(produtoSelecionado.status)}>
                {getProdutoStatusLabel(produtoSelecionado.status)}
              </StatusBadge>
            ) : null}
          </div>

          {produtoSelecionado ? (
            <div className="space-y-5">
              <div className="ui-surface-3 px-5 py-4">
                <p className="text-[1.05rem] font-semibold text-[var(--color-text)]">
                  {produtoSelecionado.nome}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                  {produtoSelecionado.codigoInterno} • {produtoSelecionado.sku}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                  {produtoSelecionado.ultimaMovimentacaoEm
                    ? `Última movimentação em ${formatDateBR(produtoSelecionado.ultimaMovimentacaoEm)}`
                    : "Sem movimentação recente registrada"}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <MetricMiniCard label="Disponível" value={`${produtoSelecionado.estoqueDisponivel} un`} />
                <MetricMiniCard label="Reservado" value={`${produtoSelecionado.estoqueReservado} un`} />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoLine label="Estoque mínimo" value={`${produtoSelecionado.estoqueMinimo} un`} />
                <InfoLine label="Sugestão de reposição" value={`${produtoSelecionado.sugestaoReposicao} un`} />
              </div>

              <div className="ui-surface-3 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                  Leitura rápida
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text)]">
                  {produtoSelecionado.status === "zerado"
                    ? "Esse item está sem saldo disponível e já pode impactar as próximas vendas."
                    : "Esse item está abaixo do mínimo e merece reposição em breve para evitar ruptura."}
                </p>
              </div>
            </div>
          ) : (
            <div className="ui-surface-2 border-dashed px-5 py-10 ui-body">
              Selecione um item para abrir o detalhe aqui.
            </div>
          )}
        </article>
      </section>
    </PageContainer>
  );
}

function MetricMiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="ui-surface-3 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">{value}</p>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="ui-surface-3 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-[var(--color-text)]">{value}</p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
