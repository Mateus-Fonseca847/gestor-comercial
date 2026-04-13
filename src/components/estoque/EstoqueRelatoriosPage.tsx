"use client";

import { useMemo, useState } from "react";
import type { ChangeEventHandler, ReactNode } from "react";
import { X } from "lucide-react";
import { DataTable } from "@/components/page/data-table";
import { EmptyState } from "@/components/page/empty-state";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatCard } from "@/components/page/stat-card";
import { StatusBadge } from "@/components/page/status-badge";
import {
  calcularEstoqueDisponivel,
  calcularStatusProduto,
  calcularSugestaoReposicao,
  calcularValorTotalEmEstoque,
  formatDateBR,
  formatMovimentacaoStatus,
  formatMovimentacaoTipo,
} from "@/modules/estoque/helpers";
import type { ProdutoEstoqueStatus } from "@/modules/estoque/helpers";
import { useEstoqueStore } from "@/modules/estoque/store";
import type { Movimentacao, Produto, ProdutoSaldo } from "@/modules/estoque/types";

type PeriodoFiltro = "hoje" | "7_dias" | "30_dias" | "mes" | "ano";
type InatividadeFiltro = 15 | 30 | 60 | 90;
type ReposicaoFiltro = "todas" | "critica" | "alta" | "moderada";
type MovimentacaoFiltro = "todas" | "entradas" | "saidas" | "ajustes";

type ProdutoResumo = {
  produto: Produto;
  categoria: string;
  fornecedor: string;
  disponivel: number;
  status: ProdutoEstoqueStatus;
  sugestaoReposicao: number;
  ultimaMovimentacao?: string;
  valorParado: number;
};

type ReposicaoRow = {
  id: string;
  produto: string;
  categoria: string;
  saldoAtual: number;
  estoqueMinimo: number;
  sugestaoReposicao: number;
  fornecedor: string;
  urgencia: ReposicaoFiltro;
};

type SemGiroRow = {
  id: string;
  produto: string;
  categoria: string;
  saldoDisponivel: number;
  ultimaMovimentacao: string;
  valorParado: string;
};

type RankingRow = {
  id: string;
  produto: string;
  quantidade: number;
  frequencia: number;
  saldoAtual: number;
};

type MovimentacaoRecenteRow = {
  id: string;
  produto: string;
  tipo: string;
  quantidade: string;
  data: string;
  status: string;
};

type DetailModalState =
  | {
      kind: "lista";
      title: string;
      description: string;
      items: ProdutoResumo[];
      highlight: string;
    }
  | {
      kind: "produto";
      title: string;
      description: string;
      item: ProdutoResumo;
      context: Array<{ label: string; value: string }>;
    }
  | {
      kind: "movimentacao";
      title: string;
      description: string;
      movimentacao: Movimentacao;
      produto?: Produto;
      categoria: string;
      fornecedor: string;
      saldoAtual: number;
      valorEstoque: string;
    };

const periodos: Array<{ value: PeriodoFiltro; label: string }> = [
  { value: "hoje", label: "Hoje" },
  { value: "7_dias", label: "7 dias" },
  { value: "30_dias", label: "30 dias" },
  { value: "mes", label: "Este mês" },
  { value: "ano", label: "Este ano" },
];

const inatividades: Array<{ value: InatividadeFiltro; label: string }> = [
  { value: 15, label: "15 dias" },
  { value: 30, label: "30 dias" },
  { value: 60, label: "60 dias" },
  { value: 90, label: "90 dias" },
];

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

export default function EstoqueRelatoriosPage() {
  const [periodoSaida, setPeriodoSaida] = useState<PeriodoFiltro>("30_dias");
  const [periodoEntrada, setPeriodoEntrada] = useState<PeriodoFiltro>("30_dias");
  const [inatividadeAtiva, setInatividadeAtiva] = useState<InatividadeFiltro>(60);
  const [reposicaoAtiva, setReposicaoAtiva] = useState<ReposicaoFiltro>("todas");
  const [tipoMovimentacaoAtivo, setTipoMovimentacaoAtivo] = useState<MovimentacaoFiltro>("todas");
  const [detailModal, setDetailModal] = useState<DetailModalState | null>(null);

  const produtoIds = useEstoqueStore((state) => state.entities.produtos.allIds);
  const produtosById = useEstoqueStore((state) => state.entities.produtos.byId);
  const categoriaIds = useEstoqueStore((state) => state.entities.categorias.allIds);
  const categoriasById = useEstoqueStore((state) => state.entities.categorias.byId);
  const saldoIds = useEstoqueStore((state) => state.entities.saldosProduto.allIds);
  const saldosById = useEstoqueStore((state) => state.entities.saldosProduto.byId);
  const movimentacaoIds = useEstoqueStore((state) => state.entities.movimentacoes.allIds);
  const movimentacoesById = useEstoqueStore((state) => state.entities.movimentacoes.byId);
  const fornecedorIds = useEstoqueStore((state) => state.entities.fornecedores.allIds);
  const fornecedoresById = useEstoqueStore((state) => state.entities.fornecedores.byId);

  const produtos = useMemo(
    () => produtoIds.map((id) => produtosById[id]).filter(Boolean),
    [produtoIds, produtosById],
  );
  const saldos = useMemo(() => saldoIds.map((id) => saldosById[id]), [saldoIds, saldosById]);
  const movimentacoes = useMemo(
    () => movimentacaoIds.map((id) => movimentacoesById[id]).filter(Boolean),
    [movimentacaoIds, movimentacoesById],
  );

  const resumoProdutos = useMemo<ProdutoResumo[]>(() => {
    return produtos.map((produto) => {
      const categoria = categoriasById[produto.categoriaId]?.nome ?? "Sem categoria";
      const fornecedor = produto.fornecedorPrincipalId
        ? (fornecedoresById[produto.fornecedorPrincipalId]?.nomeFantasia ?? "Sem fornecedor")
        : "Sem fornecedor";
      const historicoProduto = movimentacoes
        .filter(
          (movimentacao) =>
            movimentacao.produtoId === produto.id && movimentacao.status === "confirmada",
        )
        .sort(
          (a, b) =>
            new Date(b.dataMovimentacao).getTime() - new Date(a.dataMovimentacao).getTime(),
        );
      const disponivel = calcularEstoqueDisponivel(produto.id, saldos);

      return {
        produto,
        categoria,
        fornecedor,
        disponivel,
        status: calcularStatusProduto(produto, saldos),
        sugestaoReposicao: calcularSugestaoReposicao(produto, saldos),
        ultimaMovimentacao: historicoProduto[0]?.dataMovimentacao,
        valorParado: disponivel * (produto.precoCusto?.valor ?? 0),
      };
    });
  }, [categoriasById, fornecedoresById, movimentacoes, produtos, saldos]);

  const cardsResumo = useMemo(() => {
    const abaixoMinimo = resumoProdutos.filter((item) => item.status === "baixo").length;
    const zerados = resumoProdutos.filter((item) => item.status === "zerado").length;
    const semGiro = resumoProdutos.filter((item) => {
      if (item.disponivel <= 0) {
        return false;
      }
      if (!item.ultimaMovimentacao) {
        return true;
      }
      return new Date(item.ultimaMovimentacao).getTime() < getCutoffFromDays(60);
    }).length;

    return {
      abaixoMinimo,
      zerados,
      semGiro,
      valorEstoque: calcularValorTotalEmEstoque(
        resumoProdutos.map((item) => item.produto),
        saldos,
      ),
    };
  }, [resumoProdutos, saldos]);

  const produtosAbaixoMinimo = useMemo(
    () => resumoProdutos.filter((item) => item.status === "baixo"),
    [resumoProdutos],
  );
  const produtosZerados = useMemo(
    () => resumoProdutos.filter((item) => item.status === "zerado"),
    [resumoProdutos],
  );
  const produtosSemGiroResumo = useMemo(
    () =>
      resumoProdutos.filter((item) => {
        if (item.disponivel <= 0) {
          return false;
        }
        if (!item.ultimaMovimentacao) {
          return true;
        }
        return new Date(item.ultimaMovimentacao).getTime() < getCutoffFromDays(60);
      }),
    [resumoProdutos],
  );

  const reposicaoRows = useMemo<ReposicaoRow[]>(() => {
    return resumoProdutos
      .filter((item) => item.sugestaoReposicao > 0)
      .map((item) => ({
        id: item.produto.id,
        produto: item.produto.nome,
        categoria: item.categoria,
        saldoAtual: item.disponivel,
        estoqueMinimo: item.produto.estoqueMinimo,
        sugestaoReposicao: item.sugestaoReposicao,
        fornecedor: item.fornecedor,
        urgencia: getReposicaoUrgencia(item.disponivel, item.produto.estoqueMinimo),
      }))
      .filter((item) => reposicaoAtiva === "todas" || item.urgencia === reposicaoAtiva)
      .sort((a, b) => b.sugestaoReposicao - a.sugestaoReposicao);
  }, [reposicaoAtiva, resumoProdutos]);

  const semGiroRows = useMemo<SemGiroRow[]>(() => {
    const cutoff = getCutoffFromDays(inatividadeAtiva);

    return resumoProdutos
      .filter((item) => item.disponivel > 0)
      .filter((item) => !item.ultimaMovimentacao || new Date(item.ultimaMovimentacao).getTime() < cutoff)
      .map((item) => ({
        id: item.produto.id,
        produto: item.produto.nome,
        categoria: item.categoria,
        saldoDisponivel: item.disponivel,
        ultimaMovimentacao: item.ultimaMovimentacao
          ? formatDateBR(item.ultimaMovimentacao, true)
          : "Sem registro recente",
        valorParado: currencyFormatter.format(item.valorParado),
      }))
      .sort((a, b) => b.saldoDisponivel - a.saldoDisponivel);
  }, [inatividadeAtiva, resumoProdutos]);

  const maiorSaidaRows = useMemo<RankingRow[]>(() => {
    return buildRankingRows({
      tipo: "saida",
      inicio: getPeriodoStart(periodoSaida),
      movimentacoes,
      produtosById,
      saldos,
    });
  }, [movimentacoes, periodoSaida, produtosById, saldos]);

  const maiorEntradaRows = useMemo<RankingRow[]>(() => {
    return buildRankingRows({
      tipo: "entrada",
      inicio: getPeriodoStart(periodoEntrada),
      movimentacoes,
      produtosById,
      saldos,
    });
  }, [movimentacoes, periodoEntrada, produtosById, saldos]);

  const movimentacaoRecenteRows = useMemo<MovimentacaoRecenteRow[]>(() => {
    const tiposPermitidos =
      tipoMovimentacaoAtivo === "todas"
        ? ["entrada", "saida", "ajuste"]
        : tipoMovimentacaoAtivo === "entradas"
          ? ["entrada"]
          : tipoMovimentacaoAtivo === "saidas"
            ? ["saida"]
            : ["ajuste"];

    return movimentacoes
      .filter((movimentacao) => movimentacao.status === "confirmada")
      .filter((movimentacao) => tiposPermitidos.includes(movimentacao.tipo))
      .sort(
        (a, b) =>
          new Date(b.dataMovimentacao).getTime() - new Date(a.dataMovimentacao).getTime(),
      )
      .slice(0, 12)
      .map((movimentacao) => ({
        id: movimentacao.id,
        produto: produtosById[movimentacao.produtoId]?.nome ?? "Produto sem identificação",
        tipo: formatMovimentacaoTipo(movimentacao.tipo),
        quantidade: `${movimentacao.quantidade} ${movimentacao.unidadeMedida}`,
        data: formatDateBR(movimentacao.dataMovimentacao, true),
        status: formatMovimentacaoStatus(movimentacao.status),
      }));
  }, [movimentacoes, produtosById, tipoMovimentacaoAtivo]);

  const openProdutoModal = (
    produtoId: string,
    description: string,
    context: Array<{ label: string; value: string }>,
  ) => {
    const item = resumoProdutos.find((entry) => entry.produto.id === produtoId);

    if (!item) {
      return;
    }

    setDetailModal({
      kind: "produto",
      title: item.produto.nome,
      description,
      item,
      context,
    });
  };

  const openMovimentacaoModal = (movimentacaoId: string) => {
    const movimentacao = movimentacoes.find((item) => item.id === movimentacaoId);

    if (!movimentacao) {
      return;
    }

    const produto = produtosById[movimentacao.produtoId];
    const resumo = resumoProdutos.find((item) => item.produto.id === movimentacao.produtoId);

    setDetailModal({
      kind: "movimentacao",
      title: produto?.nome ?? "Movimentação de estoque",
      description: "Detalhes da movimentação selecionada.",
      movimentacao,
      produto,
      categoria: resumo?.categoria ?? "Sem categoria",
      fornecedor: resumo?.fornecedor ?? "Sem fornecedor",
      saldoAtual: resumo?.disponivel ?? 0,
      valorEstoque: currencyFormatter.format(resumo?.valorParado ?? 0),
    });
  };

  const reposicaoColumns = [
    { key: "produto", header: "Produto" },
    { key: "categoria", header: "Categoria" },
    { key: "saldoAtual", header: "Saldo atual", align: "right" as const },
    { key: "estoqueMinimo", header: "Estoque mínimo", align: "right" as const },
    { key: "sugestaoReposicao", header: "Reposição sugerida", align: "right" as const },
    { key: "fornecedor", header: "Fornecedor" },
    {
      key: "urgencia",
      header: "Urgência",
      render: (row: ReposicaoRow) => (
        <StatusBadge variant={getUrgenciaVariant(row.urgencia)}>
          {getUrgenciaLabel(row.urgencia)}
        </StatusBadge>
      ),
    },
  ];

  const semGiroColumns = [
    { key: "produto", header: "Produto" },
    { key: "categoria", header: "Categoria" },
    { key: "saldoDisponivel", header: "Saldo disponível", align: "right" as const },
    { key: "ultimaMovimentacao", header: "Última movimentação" },
    { key: "valorParado", header: "Valor parado em estoque", align: "right" as const },
  ];

  const rankingColumns = [
    { key: "produto", header: "Produto" },
    { key: "quantidade", header: "Quantidade", align: "right" as const },
    { key: "frequencia", header: "Frequência", align: "right" as const },
    { key: "saldoAtual", header: "Saldo atual", align: "right" as const },
  ];

  const movimentacaoColumns = [
    { key: "produto", header: "Produto" },
    { key: "tipo", header: "Tipo" },
    { key: "quantidade", header: "Quantidade", align: "right" as const },
    { key: "data", header: "Data" },
    {
      key: "status",
      header: "Status",
      render: (row: MovimentacaoRecenteRow) => (
        <StatusBadge variant={row.status === "Confirmada" ? "success" : "warning"}>
          {row.status}
        </StatusBadge>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Relatórios de estoque"
        description="Acompanhe ruptura, giro e reposição com foco no que pede ação agora."
      />

      <section className="grid gap-4 lg:grid-cols-4">
        <StatCard
          label="Valor do estoque"
          value={currencyFormatter.format(cardsResumo.valorEstoque)}
          description="Valor estimado do estoque disponível."
          onClick={() =>
            setDetailModal({
              kind: "lista",
              title: "Valor do estoque",
              description: "Veja os produtos que compõem o valor atual do estoque.",
              items: resumoProdutos.filter((item) => item.disponivel > 0),
              highlight: "valor",
            })}
        />
        <StatCard
          label="Itens abaixo do mínimo"
          value={String(cardsResumo.abaixoMinimo)}
          description="Produtos que já pedem reposição."
          onClick={() =>
            setDetailModal({
              kind: "lista",
              title: "Itens abaixo do mínimo",
              description: "Produtos com saldo abaixo do mínimo configurado.",
              items: produtosAbaixoMinimo,
              highlight: "reposicao",
            })}
        />
        <StatCard
          label="Produtos zerados"
          value={String(cardsResumo.zerados)}
          description="Itens sem saldo para vender agora."
          onClick={() =>
            setDetailModal({
              kind: "lista",
              title: "Produtos zerados",
              description: "Itens sem saldo e com risco direto de ruptura.",
              items: produtosZerados,
              highlight: "zerado",
            })}
        />
        <StatCard
          label="Produtos sem giro"
          value={String(cardsResumo.semGiro)}
          description="Itens parados com capital imobilizado."
          onClick={() =>
            setDetailModal({
              kind: "lista",
              title: "Produtos sem giro",
              description: "Itens que estão parados e pedem revisão comercial.",
              items: produtosSemGiroResumo,
              highlight: "valor",
            })}
        />
      </section>

      <section className="space-y-4 rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-sm">
        <BlockHeader
          title="Reposição sugerida"
          description="Veja primeiro os itens que exigem atenção para não faltar na loja."
          action={
            <InlineSelect
              value={reposicaoAtiva}
              onChange={(event) => setReposicaoAtiva(event.target.value as ReposicaoFiltro)}
              options={[
                { value: "todas", label: "Todas" },
                { value: "critica", label: "Crítica" },
                { value: "alta", label: "Alta" },
                { value: "moderada", label: "Moderada" },
              ]}
            />
          }
        />
        <DataTable
          columns={reposicaoColumns}
          data={reposicaoRows}
          onRowClick={(row) =>
            openProdutoModal(row.id, "Produto em fila de reposição.", [
              { label: "Saldo atual", value: `${row.saldoAtual}` },
              { label: "Estoque mínimo", value: `${row.estoqueMinimo}` },
              { label: "Reposição sugerida", value: `${row.sugestaoReposicao}` },
              { label: "Urgência", value: getUrgenciaLabel(row.urgencia) },
            ])}
          emptyState={
            <EmptyState
              title="Sem reposição sugerida"
              description="Não há itens nesse nível de urgência agora."
            />
          }
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="space-y-4 rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <BlockHeader
            title="Produtos sem giro recente"
            description="Itens parados que merecem revisão de compra, preço ou exposição."
            action={
              <InlineSelect
                value={String(inatividadeAtiva)}
                onChange={(event) => setInatividadeAtiva(Number(event.target.value) as InatividadeFiltro)}
                options={inatividades.map((item) => ({ value: String(item.value), label: item.label }))}
              />
            }
          />
          <DataTable
            columns={semGiroColumns}
            data={semGiroRows}
            onRowClick={(row) =>
              openProdutoModal(row.id, "Produto sem giro recente.", [
                { label: "Saldo disponível", value: `${row.saldoDisponivel}` },
                { label: "Última movimentação", value: row.ultimaMovimentacao },
                { label: "Valor parado", value: row.valorParado },
                { label: "Dias sem giro", value: `${inatividadeAtiva} dias` },
              ])}
            emptyState={
              <EmptyState
                title="Sem produtos parados"
                description="Não há itens sem giro nessa faixa de inatividade."
              />
            }
          />
        </article>

        <article className="space-y-4 rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <BlockHeader
            title="Maior saída no período"
            description="Produtos que mais giraram e ajudam a puxar as vendas."
            action={
              <InlineSelect
                value={periodoSaida}
                onChange={(event) => setPeriodoSaida(event.target.value as PeriodoFiltro)}
                options={periodos}
              />
            }
          />
          <DataTable
            columns={rankingColumns}
            data={maiorSaidaRows}
            onRowClick={(row) =>
              openProdutoModal(row.id, "Produto com maior saída no período selecionado.", [
                { label: "Quantidade no período", value: `${row.quantidade}` },
                { label: "Frequência", value: `${row.frequencia}` },
                { label: "Saldo atual", value: `${row.saldoAtual}` },
                { label: "Período", value: periodos.find((item) => item.value === periodoSaida)?.label ?? "" },
              ])}
            emptyState={
              <EmptyState
                title="Sem saída no período"
                description="Ainda não houve baixas para montar esse ranking."
              />
            }
          />
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="space-y-4 rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <BlockHeader
            title="Maior entrada no período"
            description="Entradas mais fortes para acompanhar reposição e recebimento."
            action={
              <InlineSelect
                value={periodoEntrada}
                onChange={(event) => setPeriodoEntrada(event.target.value as PeriodoFiltro)}
                options={periodos}
              />
            }
          />
          <DataTable
            columns={rankingColumns}
            data={maiorEntradaRows}
            onRowClick={(row) =>
              openProdutoModal(row.id, "Produto com maior entrada no período selecionado.", [
                { label: "Quantidade no período", value: `${row.quantidade}` },
                { label: "Frequência", value: `${row.frequencia}` },
                { label: "Saldo atual", value: `${row.saldoAtual}` },
                { label: "Período", value: periodos.find((item) => item.value === periodoEntrada)?.label ?? "" },
              ])}
            emptyState={
              <EmptyState
                title="Sem entrada no período"
                description="Não houve entradas suficientes para montar esse ranking."
              />
            }
          />
        </article>

        <article className="space-y-4 rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <BlockHeader
            title="Movimentação recente"
            description="Veja as últimas entradas, saídas e ajustes do estoque."
            action={
              <InlineSelect
                value={tipoMovimentacaoAtivo}
                onChange={(event) => setTipoMovimentacaoAtivo(event.target.value as MovimentacaoFiltro)}
                options={[
                  { value: "todas", label: "Todas" },
                  { value: "entradas", label: "Entradas" },
                  { value: "saidas", label: "Saídas" },
                  { value: "ajustes", label: "Ajustes" },
                ]}
              />
            }
          />
          <DataTable
            columns={movimentacaoColumns}
            data={movimentacaoRecenteRows}
            onRowClick={(row) => openMovimentacaoModal(row.id)}
            emptyState={
              <EmptyState
                title="Sem movimentações"
                description="Não há registros nesse tipo de movimentação agora."
              />
            }
          />
        </article>
      </section>

      <DetailModal detail={detailModal} onClose={() => setDetailModal(null)} />
    </PageContainer>
  );
}

function BlockHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-1">
        <h2 className="text-[1.05rem] font-semibold tracking-tight text-[var(--color-text)]">
          {title}
        </h2>
        <p className="text-sm leading-6 text-[var(--color-text-soft)]">{description}</p>
      </div>
      {action}
    </div>
  );
}

function InlineSelect({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className="h-10 min-w-[128px] rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-3 text-sm text-[var(--color-text)] outline-none"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function DetailModal({
  detail,
  onClose,
}: {
  detail: DetailModalState | null;
  onClose: () => void;
}) {
  if (!detail) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(15,23,42,0.45)] p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl rounded-[28px] border border-[var(--color-border)] bg-white p-6 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-text-soft)]">
              Detalhes
            </p>
            <h3 className="text-xl font-semibold text-[var(--color-text)]">{detail.title}</h3>
            <p className="text-sm text-[var(--color-text-soft)]">{detail.description}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-text-soft)] transition hover:bg-[var(--color-surface-alt)]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {detail.kind === "lista" ? (
          <div className="space-y-3">
            {detail.items.length ? (
              detail.items.slice(0, 8).map((item) => (
                <div
                  key={item.produto.id}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-[var(--color-text)]">{item.produto.nome}</p>
                      <p className="text-sm text-[var(--color-text-soft)]">
                        {item.categoria} • {item.fornecedor}
                      </p>
                    </div>
                    <StatusBadge variant={getProdutoStatusVariant(item.status)}>
                      {getProdutoStatusLabel(item.status)}
                    </StatusBadge>
                  </div>
                  <div className="mt-3 grid gap-3 text-sm text-[var(--color-text-soft)] sm:grid-cols-3">
                    <InfoItem label="Saldo atual" value={`${item.disponivel}`} />
                    <InfoItem label="Estoque mínimo" value={`${item.produto.estoqueMinimo}`} />
                    <InfoItem
                      label={detail.highlight === "valor" ? "Valor estimado" : "Reposição sugerida"}
                      value={
                        detail.highlight === "valor"
                          ? currencyFormatter.format(item.valorParado)
                          : `${item.sugestaoReposicao}`
                      }
                    />
                  </div>
                </div>
              ))
            ) : (
              <EmptyState
                title="Sem itens para mostrar"
                description="Não há registros para esse recorte."
              />
            )}
          </div>
        ) : null}

        {detail.kind === "produto" ? (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard label="SKU" value={detail.item.produto.sku} />
              <InfoCard label="Código interno" value={detail.item.produto.codigoInterno} />
              <InfoCard label="Categoria" value={detail.item.categoria} />
              <InfoCard label="Fornecedor" value={detail.item.fornecedor} />
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <InfoCard label="Saldo atual" value={`${detail.item.disponivel}`} />
              <InfoCard label="Estoque mínimo" value={`${detail.item.produto.estoqueMinimo}`} />
              <InfoCard
                label="Status"
                value={getProdutoStatusLabel(detail.item.status)}
                badge={<StatusBadge variant={getProdutoStatusVariant(detail.item.status)}>{getProdutoStatusLabel(detail.item.status)}</StatusBadge>}
              />
              <InfoCard label="Valor estimado" value={currencyFormatter.format(detail.item.valorParado)} />
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
              <p className="mb-3 text-sm font-medium text-[var(--color-text)]">Contexto do relatório</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {detail.context.map((item) => (
                  <InfoItem key={item.label} label={item.label} value={item.value} />
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {detail.kind === "movimentacao" ? (
          <div className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <InfoCard label="SKU" value={detail.produto?.sku ?? "-"} />
              <InfoCard label="Código interno" value={detail.produto?.codigoInterno ?? "-"} />
              <InfoCard label="Categoria" value={detail.categoria} />
              <InfoCard label="Fornecedor" value={detail.fornecedor} />
            </div>

            <div className="grid gap-3 sm:grid-cols-4">
              <InfoCard label="Tipo" value={formatMovimentacaoTipo(detail.movimentacao.tipo)} />
              <InfoCard label="Quantidade" value={`${detail.movimentacao.quantidade} ${detail.movimentacao.unidadeMedida}`} />
              <InfoCard label="Data" value={formatDateBR(detail.movimentacao.dataMovimentacao, true)} />
              <InfoCard
                label="Status"
                value={formatMovimentacaoStatus(detail.movimentacao.status)}
                badge={<StatusBadge variant={detail.movimentacao.status === "confirmada" ? "success" : "warning"}>{formatMovimentacaoStatus(detail.movimentacao.status)}</StatusBadge>}
              />
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
              <p className="mb-3 text-sm font-medium text-[var(--color-text)]">Contexto da movimentação</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoItem label="Origem" value={detail.movimentacao.origemOperacional ?? detail.movimentacao.origemTipo} />
                <InfoItem label="Saldo atual" value={`${detail.saldoAtual}`} />
                <InfoItem label="Valor estimado em estoque" value={detail.valorEstoque} />
                <InfoItem label="Observação" value={detail.movimentacao.observacao ?? "Sem observação"} />
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function InfoCard({
  label,
  value,
  badge,
}: {
  label: string;
  value: string;
  badge?: ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
        {label}
      </p>
      <div className="mt-2">
        {badge ?? <p className="text-sm font-medium text-[var(--color-text)]">{value}</p>}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
        {label}
      </p>
      <p className="mt-1 text-sm font-medium text-[var(--color-text)]">{value}</p>
    </div>
  );
}

function getPeriodoStart(periodo: PeriodoFiltro) {
  const agora = new Date();

  if (periodo === "hoje") {
    agora.setHours(0, 0, 0, 0);
    return agora.getTime();
  }
  if (periodo === "7_dias") {
    return Date.now() - 7 * 24 * 60 * 60 * 1000;
  }
  if (periodo === "30_dias") {
    return Date.now() - 30 * 24 * 60 * 60 * 1000;
  }
  if (periodo === "mes") {
    return new Date(agora.getFullYear(), agora.getMonth(), 1).getTime();
  }

  return new Date(agora.getFullYear(), 0, 1).getTime();
}

function getCutoffFromDays(days: number) {
  return Date.now() - days * 24 * 60 * 60 * 1000;
}

function getReposicaoUrgencia(disponivel: number, estoqueMinimo: number): ReposicaoFiltro {
  if (disponivel <= 0) {
    return "critica";
  }
  if (disponivel <= Math.max(1, Math.floor(estoqueMinimo * 0.4))) {
    return "alta";
  }
  return "moderada";
}

function getUrgenciaLabel(urgencia: ReposicaoFiltro) {
  if (urgencia === "critica") {
    return "Crítica";
  }
  if (urgencia === "alta") {
    return "Alta";
  }
  if (urgencia === "moderada") {
    return "Moderada";
  }
  return "Todas";
}

function getUrgenciaVariant(urgencia: ReposicaoFiltro): "danger" | "warning" | "info" {
  if (urgencia === "critica") {
    return "danger";
  }
  if (urgencia === "alta") {
    return "warning";
  }
  return "info";
}

function getProdutoStatusLabel(status: ProdutoEstoqueStatus) {
  if (status === "baixo") {
    return "Abaixo do mínimo";
  }
  if (status === "zerado") {
    return "Zerado";
  }
  if (status === "inativo") {
    return "Inativo";
  }
  return "Saudável";
}

function getProdutoStatusVariant(status: ProdutoEstoqueStatus): "danger" | "warning" | "info" | "success" {
  if (status === "zerado") {
    return "danger";
  }
  if (status === "baixo") {
    return "warning";
  }
  if (status === "inativo") {
    return "info";
  }
  return "success";
}

function buildRankingRows({
  tipo,
  inicio,
  movimentacoes,
  produtosById,
  saldos,
}: {
  tipo: "entrada" | "saida";
  inicio: number;
  movimentacoes: Movimentacao[];
  produtosById: Record<string, Produto | undefined>;
  saldos: ProdutoSaldo[];
}) {
  const agrupado = new Map<string, { quantidade: number; frequencia: number }>();

  movimentacoes
    .filter((movimentacao) => movimentacao.status === "confirmada")
    .filter((movimentacao) => movimentacao.tipo === tipo)
    .filter((movimentacao) => new Date(movimentacao.dataMovimentacao).getTime() >= inicio)
    .forEach((movimentacao) => {
      const atual = agrupado.get(movimentacao.produtoId) ?? { quantidade: 0, frequencia: 0 };
      agrupado.set(movimentacao.produtoId, {
        quantidade: atual.quantidade + movimentacao.quantidade,
        frequencia: atual.frequencia + 1,
      });
    });

  return [...agrupado.entries()]
    .map(([produtoId, dados]) => ({
      id: produtoId,
      produto: produtosById[produtoId]?.nome ?? "Produto sem identificação",
      quantidade: dados.quantidade,
      frequencia: dados.frequencia,
      saldoAtual: calcularEstoqueDisponivel(produtoId, saldos),
    }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 10);
}
