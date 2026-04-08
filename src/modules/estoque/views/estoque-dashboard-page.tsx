"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageContainer } from "@/components/page/page-container";
import { StatusBadge } from "@/components/page/status-badge";
import { DashboardActivityList } from "@/modules/estoque/components/dashboard-activity-list";
import { DashboardKpiTile } from "@/modules/estoque/components/dashboard-kpi-tile";
import { StockEvolutionChart } from "@/modules/estoque/components/stock-evolution-chart";
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

type ProdutoSemGiro = {
  id: string;
  nome: string;
  estoqueDisponivel: number;
  estoqueMinimo: number;
  ultimaMovimentacaoEm?: string;
  status: ReturnType<typeof calcularStatusProduto>;
};

export function EstoqueDashboardPage() {
  const [buscaProduto, setBuscaProduto] = useState("");
  const produtos = useEstoqueEntityList("produtos");
  const movimentacoes = useEstoqueEntityList("movimentacoes");
  const saldos = useEstoqueEntityList("saldosProduto");

  const agora = Date.now();
  const corteSemGiro = agora - 60 * 24 * 60 * 60 * 1000;
  const buscaNormalizada = buscaProduto.trim().toLowerCase();

  const produtosBaixoEstoque = useMemo(
    () => produtos.filter((produto) => calcularStatusProduto(produto, saldos) === "baixo"),
    [produtos, saldos],
  );

  const produtosZerados = useMemo(
    () => produtos.filter((produto) => calcularStatusProduto(produto, saldos) === "zerado"),
    [produtos, saldos],
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
    ],
    [produtos, produtosBaixoEstoque.length, produtosZerados.length, saldos],
  );

  const produtosPorId = useMemo(
    () =>
      produtos.reduce<Record<string, (typeof produtos)[number]>>((acc, produto) => {
        acc[produto.id] = produto;
        return acc;
      }, {}),
    [produtos],
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
        .map((item) => {
          const produto = produtosPorId[item.produtoId];

          return {
            id: item.id,
            title: produto?.nome ?? "Produto sem identificação",
            summary: `${formatMovimentacaoTipo(item.tipo)} • ${item.quantidade} ${item.unidadeMedida}`,
            meta: `${formatDateBR(item.dataMovimentacao, true)} • ${formatMovimentacaoStatus(item.status)}`,
            aside: (
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
            ),
          };
        }),
    [movimentacoes, produtosPorId],
  );

  const produtosSemGiroFiltrados = useMemo(() => {
    if (!buscaNormalizada) {
      return produtosSemGiro;
    }

    return produtosSemGiro.filter((produto) =>
      produto.nome.toLowerCase().includes(buscaNormalizada),
    );
  }, [buscaNormalizada, produtosSemGiro]);

  const movimentacoesRecentesFiltradas = useMemo(() => {
    if (!buscaNormalizada) {
      return movimentacoesRecentes;
    }

    return movimentacoesRecentes.filter((movimentacao) =>
      `${movimentacao.title} ${movimentacao.summary ?? ""}`
        .toLowerCase()
        .includes(buscaNormalizada),
    );
  }, [buscaNormalizada, movimentacoesRecentes]);

  return (
    <PageContainer>
      <section className="space-y-6">
        <div className="space-y-2 px-1">
          <h1 className="text-[2.15rem] font-semibold tracking-[-0.03em] text-[var(--color-text)]">
            Estoque
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-soft)]">
            Acompanhe o saldo da loja, identifique risco de ruptura e leia o histórico mais recente da operação.
          </p>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_0.82fr] xl:items-stretch">
          <StockEvolutionChart />

          <aside className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
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
          </aside>
        </section>
      </section>

      <section className="rounded-[30px] border border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)] p-5 shadow-[0_18px_44px_rgba(15,23,42,0.08)] md:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--color-text)]">Busca rápida</p>
            <p className="text-sm text-[var(--color-text-soft)]">
              Procure um produto e filtre os blocos operacionais abaixo.
            </p>
          </div>
        </div>
        <label className="flex h-14 items-center gap-3 rounded-[20px] border border-[rgba(148,163,184,0.2)] bg-white px-4 text-[var(--color-text-soft)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-200 focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]">
          <Search className="h-4 w-4 shrink-0" />
          <input
            type="search"
            value={buscaProduto}
            onChange={(event) => setBuscaProduto(event.target.value)}
            placeholder="Buscar produto no estoque"
            className="w-full border-0 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)]"
          />
        </label>
      </section>

      <section className="grid gap-6 xl:grid-cols-2 xl:items-start">
        <article className="rounded-[32px] border border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)] p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)] md:p-7">
          <div className="mb-6 flex items-start justify-between gap-4 border-b border-[rgba(148,163,184,0.18)] pb-4">
            <div className="space-y-1.5">
              <h2 className="text-[1.05rem] font-semibold tracking-tight text-[var(--color-text)]">
                Produtos sem giro recente
              </h2>
              <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                Itens com saldo parado há pelo menos 60 dias e que pedem revisão da loja.
              </p>
            </div>
            <StatusBadge variant={produtosSemGiroFiltrados.length ? "warning" : "success"}>
              {produtosSemGiroFiltrados.length ? "Acompanhar" : "Em dia"}
            </StatusBadge>
          </div>

          <div className="space-y-3.5">
            {produtosSemGiroFiltrados.length ? (
              produtosSemGiroFiltrados.map((produto) => (
                <div
                  key={produto.id}
                  className="flex flex-col gap-3 rounded-[24px] border border-[rgba(148,163,184,0.18)] bg-white/88 px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.06)] lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="space-y-1.5">
                    <p className="text-[0.98rem] font-semibold text-[var(--color-text)]">{produto.nome}</p>
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
              <div className="rounded-[24px] border border-dashed border-[rgba(148,163,184,0.3)] bg-[rgba(248,250,252,0.88)] px-5 py-10 text-sm text-[var(--color-text-soft)]">
                {buscaNormalizada
                  ? "Nenhum produto encontrado para essa busca."
                  : "Nenhum produto parado no momento."}
              </div>
            )}
          </div>
        </article>

        <DashboardActivityList
          title="Últimas movimentações"
          description="Entradas, saídas e ajustes mais recentes para leitura rápida da operação."
          href="/estoque/movimentacoes"
          items={movimentacoesRecentesFiltradas}
          emptyMessage={
            buscaNormalizada
              ? "Nenhuma movimentação encontrada para essa busca."
              : "Nenhuma movimentação recente no momento."
          }
        />
      </section>
    </PageContainer>
  );
}
