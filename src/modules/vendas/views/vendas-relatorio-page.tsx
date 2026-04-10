"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageContainer } from "@/components/page/page-container";
import { StatusBadge } from "@/components/page/status-badge";
import { DashboardKpiTile } from "@/modules/estoque/components/dashboard-kpi-tile";
import {
  SalesEvolutionChart,
  type SalesMetric,
  type SalesPeriod,
} from "@/modules/vendas/components/sales-evolution-chart";
import { vendasDashboardMock } from "@/modules/vendas/data/dashboard.mock";
import { useVendasStore } from "@/modules/vendas/store";
import type {
  FormaPagamento,
  VendaCanal,
  VendaRegistro,
  VendaStatus,
} from "@/modules/vendas/types";

type CanalFiltro = "todos" | VendaCanal;
type StatusFiltro = "todos" | VendaStatus;
type PagamentoFiltro = "todos" | FormaPagamento | "nao_informado";

export function VendasRelatorioPage() {
  const vendasStore = useVendasStore((state) => state.vendas);
  const [periodo, setPeriodo] = useState<SalesPeriod>("mes");
  const [metrica, setMetrica] = useState<SalesMetric>("faturamento");
  const [busca, setBusca] = useState("");
  const [clienteFiltro, setClienteFiltro] = useState("todos");
  const [canalFiltro, setCanalFiltro] = useState<CanalFiltro>("todos");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("todos");
  const [pagamentoFiltro, setPagamentoFiltro] = useState<PagamentoFiltro>("todos");
  const [produtoFiltro, setProdutoFiltro] = useState("todos");
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);

  const vendas = useMemo(
    () => (vendasStore.length ? vendasStore : vendasDashboardMock),
    [vendasStore],
  );

  const periodoAtual = useMemo(() => getPeriodoAtual(periodo), [periodo]);
  const periodoAnterior = useMemo(() => getPeriodoAnterior(periodo, periodoAtual), [periodo, periodoAtual]);
  const buscaNormalizada = busca.trim().toLowerCase();

  const vendasNoPeriodo = useMemo(
    () =>
      vendas.filter((venda) => isDateInRange(new Date(venda.criadoEm), periodoAtual.inicio, periodoAtual.fim)),
    [vendas, periodoAtual],
  );

  const clienteOptions = useMemo(
    () =>
      Array.from(new Set(vendas.map((venda) => venda.clienteNome))).sort((a, b) =>
        a.localeCompare(b, "pt-BR"),
      ),
    [vendas],
  );

  const produtoOptions = useMemo(
    () =>
      Array.from(
        new Set(vendas.flatMap((venda) => venda.itens.map((item) => item.nomeProduto))),
      ).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [vendas],
  );

  const pagamentoOptions = useMemo(
    () =>
      Array.from(
        new Set(
          vendas
            .map((venda) => venda.pagamento?.formaPagamento)
            .filter((value): value is FormaPagamento => Boolean(value)),
        ),
      ),
    [vendas],
  );

  const vendasFiltradas = useMemo(
    () =>
      vendasNoPeriodo
        .filter((venda) => {
          const matchBusca =
            !buscaNormalizada ||
            [
              venda.id,
              venda.clienteNome,
              venda.telefone ?? "",
              formatDateTime(venda.criadoEm),
              formatCanal(venda.canal),
              getStatusLabel(venda.status),
              getPagamentoLabel(venda.pagamento?.formaPagamento),
              ...venda.itens.map((item) => item.nomeProduto),
            ]
              .join(" ")
              .toLowerCase()
              .includes(buscaNormalizada);

          const matchCliente = clienteFiltro === "todos" || venda.clienteNome === clienteFiltro;
          const matchCanal = canalFiltro === "todos" || venda.canal === canalFiltro;
          const matchStatus = statusFiltro === "todos" || venda.status === statusFiltro;
          const pagamentoAtual = venda.pagamento?.formaPagamento ?? "nao_informado";
          const matchPagamento =
            pagamentoFiltro === "todos" || pagamentoAtual === pagamentoFiltro;
          const matchProduto =
            produtoFiltro === "todos" ||
            venda.itens.some((item) => item.nomeProduto === produtoFiltro);

          return (
            matchBusca &&
            matchCliente &&
            matchCanal &&
            matchStatus &&
            matchPagamento &&
            matchProduto
          );
        })
        .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()),
    [
      buscaNormalizada,
      canalFiltro,
      clienteFiltro,
      pagamentoFiltro,
      produtoFiltro,
      statusFiltro,
      vendasNoPeriodo,
    ],
  );

  useEffect(() => {
    if (!vendasFiltradas.length) {
      setSelectedSaleId(null);
      return;
    }

    if (!selectedSaleId || !vendasFiltradas.some((venda) => venda.id === selectedSaleId)) {
      setSelectedSaleId(vendasFiltradas[0]?.id ?? null);
    }
  }, [selectedSaleId, vendasFiltradas]);

  const vendaSelecionada = useMemo(
    () => vendasFiltradas.find((venda) => venda.id === selectedSaleId) ?? null,
    [selectedSaleId, vendasFiltradas],
  );

  const faturamentoAtual = useMemo(
    () => sumFaturamentoConclusoes(vendasFiltradas),
    [vendasFiltradas],
  );
  const faturamentoAnterior = useMemo(
    () => sumFaturamentoConclusoes(filterVendasByRange(vendas, periodoAnterior.inicio, periodoAnterior.fim)),
    [periodoAnterior, vendas],
  );

  const vendasAtual = vendasFiltradas.length;
  const vendasAnterior = useMemo(
    () => filterVendasByRange(vendas, periodoAnterior.inicio, periodoAnterior.fim).length,
    [periodoAnterior, vendas],
  );

  const concluidasAtual = useMemo(
    () => vendasFiltradas.filter((venda) => venda.status === "concluida"),
    [vendasFiltradas],
  );
  const concluidasAnterior = useMemo(
    () =>
      filterVendasByRange(vendas, periodoAnterior.inicio, periodoAnterior.fim).filter(
        (venda) => venda.status === "concluida",
      ),
    [periodoAnterior, vendas],
  );

  const ticketAtual = concluidasAtual.length ? faturamentoAtual / concluidasAtual.length : 0;
  const ticketAnterior = concluidasAnterior.length
    ? faturamentoAnterior / concluidasAnterior.length
    : 0;

  const pendentesAtual = useMemo(
    () =>
      vendasFiltradas.filter(
        (venda) =>
          venda.status === "em_aberto" || venda.status === "aguardando_confirmacao",
      ).length,
    [vendasFiltradas],
  );
  const pendentesAnterior = useMemo(
    () =>
      filterVendasByRange(vendas, periodoAnterior.inicio, periodoAnterior.fim).filter(
        (venda) =>
          venda.status === "em_aberto" || venda.status === "aguardando_confirmacao",
      ).length,
    [periodoAnterior, vendas],
  );

  const metricas = [
    {
      label: "Faturamento do período",
      value: formatCurrency(faturamentoAtual),
      note: `Resultado em ${getPeriodLabel(periodo).toLowerCase()}.`,
      context: formatComparisonContext(faturamentoAtual, faturamentoAnterior),
      tone: "info" as const,
      trend: getComparisonTrend(faturamentoAtual, faturamentoAnterior),
    },
    {
      label: "Quantidade de vendas",
      value: String(vendasAtual),
      note: "Registros dentro do recorte aplicado.",
      context: formatComparisonContext(vendasAtual, vendasAnterior),
      tone: "neutral" as const,
      trend: getComparisonTrend(vendasAtual, vendasAnterior),
    },
    {
      label: "Ticket médio",
      value: formatCurrency(ticketAtual),
      note: "Média das vendas concluídas.",
      context: formatComparisonContext(ticketAtual, ticketAnterior),
      tone: "neutral" as const,
      trend: getComparisonTrend(ticketAtual, ticketAnterior),
    },
    {
      label: "Pedidos em aberto",
      value: String(pendentesAtual),
      note: "Vendas aguardando fechamento ou confirmação.",
      context: formatComparisonContext(pendentesAtual, pendentesAnterior),
      tone: "neutral" as const,
      trend: getComparisonTrendInverse(pendentesAtual, pendentesAnterior),
    },
  ];

  const produtosMaisVendidos = useMemo(
    () =>
      concluidasAtual
        .flatMap((venda) => venda.itens)
        .reduce<
          Array<{
            produtoId: string;
            nomeProduto: string;
            quantidade: number;
            faturamento: number;
          }>
        >((acc, item) => {
          const found = acc.find((entry) => entry.produtoId === item.produtoId);
          if (found) {
            found.quantidade += item.quantidade;
            found.faturamento += item.subtotal;
            return acc;
          }
          acc.push({
            produtoId: item.produtoId,
            nomeProduto: item.nomeProduto,
            quantidade: item.quantidade,
            faturamento: item.subtotal,
          });
          return acc;
        }, [])
        .sort((a, b) => b.quantidade - a.quantidade || b.faturamento - a.faturamento)
        .slice(0, 8),
    [concluidasAtual],
  );

  const ultimasVendas = useMemo(() => vendasFiltradas.slice(0, 6), [vendasFiltradas]);

  return (
    <PageContainer>
      <section className="space-y-5">
        <div className="space-y-2 px-1">
          <h1 className="text-[2.15rem] font-semibold tracking-[-0.03em] text-[var(--color-text)]">
            Relatório de vendas
          </h1>
          <p className="max-w-3xl text-sm leading-6 text-[var(--color-text-soft)]">
            Centralize resultados, compare períodos e abra o detalhe de cada venda sem sair da análise comercial.
          </p>
        </div>

        <section className="ui-surface-1 p-5 md:p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-[var(--color-text)]">Filtros do relatório</p>
              <p className="text-sm text-[var(--color-text-soft)]">
                Recorte o período e encontre rápido o que precisa analisar.
              </p>
            </div>

            <div className="inline-flex flex-wrap rounded-[18px] border border-[rgba(148,163,184,0.18)] bg-[rgba(248,250,252,0.94)] p-1.5">
              {([
                { value: "hoje", label: "Hoje" },
                { value: "semana", label: "Essa semana" },
                { value: "mes", label: "Esse mês" },
                { value: "ano", label: "Esse ano" },
              ] as Array<{ value: SalesPeriod; label: string }>).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setPeriodo(option.value)}
                  className={[
                    "rounded-[14px] px-3 py-2 text-sm font-medium transition-all duration-200",
                    periodo === option.value
                      ? "bg-white text-[var(--color-primary)] shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
                      : "text-[var(--color-text-soft)] hover:text-[var(--color-text)]",
                  ].join(" ")}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_repeat(5,minmax(0,0.6fr))]">
            <label className="flex h-12 items-center gap-3 rounded-[18px] border border-[rgba(148,163,184,0.2)] bg-white px-4 text-[var(--color-text-soft)] transition-all duration-200 focus-within:border-[var(--color-primary)]">
              <Search className="h-4 w-4 shrink-0" />
              <input
                type="search"
                value={busca}
                onChange={(event) => setBusca(event.target.value)}
                placeholder="Buscar por cliente, código, produto ou data"
                className="w-full border-0 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)]"
              />
            </label>

            <select value={clienteFiltro} onChange={(event) => setClienteFiltro(event.target.value)} className={filterClassName}>
              <option value="todos">Todos os clientes</option>
              {clienteOptions.map((cliente) => (
                <option key={cliente} value={cliente}>{cliente}</option>
              ))}
            </select>

            <select value={canalFiltro} onChange={(event) => setCanalFiltro(event.target.value as CanalFiltro)} className={filterClassName}>
              <option value="todos">Todos os canais</option>
              <option value="loja_fisica">Loja Física</option>
              <option value="online">Online</option>
            </select>

            <select value={statusFiltro} onChange={(event) => setStatusFiltro(event.target.value as StatusFiltro)} className={filterClassName}>
              <option value="todos">Todos os status</option>
              <option value="rascunho">Rascunho</option>
              <option value="em_aberto">Em aberto</option>
              <option value="aguardando_confirmacao">Aguardando confirmação</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>

            <select value={produtoFiltro} onChange={(event) => setProdutoFiltro(event.target.value)} className={filterClassName}>
              <option value="todos">Todos os produtos</option>
              {produtoOptions.map((produto) => (
                <option key={produto} value={produto}>{produto}</option>
              ))}
            </select>

            <select value={pagamentoFiltro} onChange={(event) => setPagamentoFiltro(event.target.value as PagamentoFiltro)} className={filterClassName}>
              <option value="todos">Todos os pagamentos</option>
              {pagamentoOptions.map((pagamento) => (
                <option key={pagamento} value={pagamento}>{getPagamentoLabel(pagamento)}</option>
              ))}
              <option value="nao_informado">Sem forma informada</option>
            </select>
          </div>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.28fr_0.92fr] xl:items-start">
          <SalesEvolutionChart
            vendas={vendasFiltradas}
            periodo={periodo}
            onPeriodoChange={setPeriodo}
            metrica={metrica}
            onMetricaChange={setMetrica}
          />

          <aside className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
            {metricas.map((metricaAtual) => (
              <DashboardKpiTile
                key={metricaAtual.label}
                label={metricaAtual.label}
                value={metricaAtual.value}
                note={metricaAtual.note}
                context={metricaAtual.context}
                tone={metricaAtual.tone}
                trend={metricaAtual.trend}
              />
            ))}
          </aside>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
          <article className="ui-surface-1 p-5 md:p-6">
            <div className="mb-4 flex items-start justify-between gap-3 border-b ui-divider pb-4">
              <div className="space-y-1">
                <h2 className="ui-section-title">Produtos mais vendidos</h2>
                <p className="ui-body">Veja os itens com mais saída no recorte atual.</p>
              </div>
              <StatusBadge variant="success">{produtosMaisVendidos.length} destaques</StatusBadge>
            </div>

            <div className="space-y-3">
              {produtosMaisVendidos.length ? (
                produtosMaisVendidos.map((produto, index) => (
                  <div key={produto.produtoId} className="ui-surface-3 flex items-center justify-between gap-3 px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(21,93,252,0.08)] text-sm font-semibold text-[var(--color-primary)]">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--color-text)]">{produto.nomeProduto}</p>
                        <p className="text-xs text-[var(--color-text-soft)]">{produto.quantidade} un vendidas</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[var(--color-text)]">{formatCurrency(produto.faturamento)}</p>
                      <p className="text-xs text-[var(--color-text-soft)]">Faturamento gerado</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="ui-surface-2 border-dashed px-4 py-8 ui-body">
                  Ainda não há vendas suficientes para montar o ranking.
                </div>
              )}
            </div>
          </article>

          <article className="ui-surface-1 p-5 md:p-6">
            <div className="mb-4 flex items-start justify-between gap-3 border-b ui-divider pb-4">
              <div className="space-y-1">
                <h2 className="ui-section-title">Últimas vendas</h2>
                <p className="ui-body">Clique em uma venda para abrir o detalhe completo.</p>
              </div>
              <StatusBadge variant="info">{ultimasVendas.length} registros</StatusBadge>
            </div>

            <div className="space-y-3">
              {ultimasVendas.length ? (
                ultimasVendas.map((venda) => (
                  <button
                    key={venda.id}
                    type="button"
                    onClick={() => setSelectedSaleId(venda.id)}
                    className={[
                      "ui-surface-3 ui-interactive-item flex w-full items-center justify-between gap-3 px-4 py-3 text-left",
                      venda.id === vendaSelecionada?.id
                        ? "border-[var(--color-primary)] shadow-[0_10px_20px_rgba(21,93,252,0.10)]"
                        : "",
                    ].join(" ")}
                  >
                    <div>
                      <p className="text-sm font-semibold text-[var(--color-text)]">{venda.clienteNome}</p>
                      <p className="text-xs text-[var(--color-text-soft)]">
                        {venda.id} • {formatDateTime(venda.criadoEm)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[var(--color-text)]">{formatCurrency(venda.totalFinal ?? venda.subtotal)}</p>
                      <p className="text-xs text-[var(--color-text-soft)]">{formatCanal(venda.canal)}</p>
                    </div>
                  </button>
                ))
              ) : (
                <div className="ui-surface-2 border-dashed px-4 py-8 ui-body">
                  Nenhuma venda encontrada com os filtros atuais.
                </div>
              )}
            </div>
          </article>
        </section>

        <section className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="ui-surface-1 p-5 md:p-6">
            <div className="mb-4 flex items-start justify-between gap-3 border-b ui-divider pb-4">
              <div className="space-y-1">
                <h2 className="ui-section-title">Listagem de vendas</h2>
                <p className="ui-body">Consulte o período filtrado e abra a venda que precisa revisar.</p>
              </div>
              <StatusBadge variant="info">{vendasFiltradas.length} venda(s)</StatusBadge>
            </div>

            <div className="space-y-3">
              {vendasFiltradas.length ? (
                vendasFiltradas.map((venda) => (
                  <button
                    key={venda.id}
                    type="button"
                    onClick={() => setSelectedSaleId(venda.id)}
                    className={[
                      "ui-surface-3 ui-interactive-item flex w-full flex-col gap-3 px-4 py-4 text-left lg:flex-row lg:items-center lg:justify-between",
                      venda.id === vendaSelecionada?.id
                        ? "border-[var(--color-primary)] shadow-[0_10px_20px_rgba(21,93,252,0.10)]"
                        : "",
                    ].join(" ")}
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[var(--color-text)]">{venda.clienteNome}</p>
                      <p className="text-xs text-[var(--color-text-soft)]">
                        {venda.id} • {formatDateTime(venda.criadoEm)} • {venda.itens.length} item(ns)
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge variant={getStatusVariant(venda.status)}>{getStatusLabel(venda.status)}</StatusBadge>
                      <StatusBadge variant="info">{formatCanal(venda.canal)}</StatusBadge>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[var(--color-text)]">{formatCurrency(venda.totalFinal ?? venda.subtotal)}</p>
                        <p className="text-xs text-[var(--color-text-soft)]">{getPagamentoLabel(venda.pagamento?.formaPagamento)}</p>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="ui-surface-2 border-dashed px-4 py-10 ui-body">
                  Nenhuma venda encontrada com os filtros atuais.
                </div>
              )}
            </div>
          </article>

          <article className="ui-surface-1 p-5 md:p-6">
            <div className="mb-4 flex items-start justify-between gap-3 border-b ui-divider pb-4">
              <div className="space-y-1">
                <h2 className="ui-section-title">Detalhes da venda</h2>
                <p className="ui-body">Cliente, itens, pagamento e observações da venda selecionada.</p>
              </div>
              {vendaSelecionada ? (
                <StatusBadge variant={getStatusVariant(vendaSelecionada.status)}>
                  {getStatusLabel(vendaSelecionada.status)}
                </StatusBadge>
              ) : null}
            </div>

            {vendaSelecionada ? (
              <div className="space-y-4">
                <div className="ui-surface-3 px-4 py-4">
                  <p className="text-base font-semibold text-[var(--color-text)]">{vendaSelecionada.clienteNome}</p>
                  <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                    {vendaSelecionada.id} • {formatCanal(vendaSelecionada.canal)}
                  </p>
                  <p className="mt-1 text-sm text-[var(--color-text-soft)]">{formatDateTime(vendaSelecionada.criadoEm)}</p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoLine label="Total" value={formatCurrency(vendaSelecionada.totalFinal ?? vendaSelecionada.subtotal)} />
                  <InfoLine label="Pagamento" value={getPagamentoLabel(vendaSelecionada.pagamento?.formaPagamento)} />
                  <InfoLine label="Status" value={getStatusLabel(vendaSelecionada.status)} />
                  <InfoLine label="Telefone" value={vendaSelecionada.telefone ?? "Não informado"} />
                </div>

                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    Itens vendidos
                  </p>
                  <div className="space-y-2">
                    {vendaSelecionada.itens.map((item) => (
                      <div key={item.id} className="ui-surface-3 flex items-center justify-between gap-3 px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text)]">{item.nomeProduto}</p>
                          <p className="text-xs text-[var(--color-text-soft)]">
                            {item.quantidade} x {formatCurrency(item.precoUnitario)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-[var(--color-text)]">{formatCurrency(item.subtotal)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ui-surface-3 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    Observações
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text)]">
                    {vendaSelecionada.observacao ?? "Sem observações nessa venda."}
                  </p>
                </div>
              </div>
            ) : (
              <div className="ui-surface-2 border-dashed px-4 py-10 ui-body">
                Selecione uma venda na listagem para abrir o detalhe aqui.
              </div>
            )}
          </article>
        </section>
      </section>
    </PageContainer>
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

function filterVendasByRange(vendas: VendaRegistro[], inicio: Date, fim: Date) {
  return vendas.filter((venda) => isDateInRange(new Date(venda.criadoEm), inicio, fim));
}

function sumFaturamentoConclusoes(vendas: VendaRegistro[]) {
  return vendas
    .filter((venda) => venda.status === "concluida")
    .reduce((total, venda) => total + (venda.totalFinal ?? venda.subtotal), 0);
}

function getPeriodoAtual(periodo: SalesPeriod) {
  const referencia = new Date("2026-04-10T18:00:00-03:00");

  if (periodo === "hoje") {
    return {
      inicio: new Date(referencia.getFullYear(), referencia.getMonth(), referencia.getDate(), 0, 0, 0, 0),
      fim: new Date(referencia.getFullYear(), referencia.getMonth(), referencia.getDate(), 23, 59, 59, 999),
    };
  }

  if (periodo === "semana") {
    const inicio = startOfWeek(referencia);
    const fim = new Date(inicio);
    fim.setDate(inicio.getDate() + 6);
    fim.setHours(23, 59, 59, 999);
    return { inicio, fim };
  }

  if (periodo === "mes") {
    return {
      inicio: new Date(referencia.getFullYear(), referencia.getMonth(), 1, 0, 0, 0, 0),
      fim: new Date(referencia.getFullYear(), referencia.getMonth() + 1, 0, 23, 59, 59, 999),
    };
  }

  return {
    inicio: new Date(referencia.getFullYear(), 0, 1, 0, 0, 0, 0),
    fim: new Date(referencia.getFullYear(), 11, 31, 23, 59, 59, 999),
  };
}

function getPeriodoAnterior(periodo: SalesPeriod, atual: { inicio: Date; fim: Date }) {
  if (periodo === "hoje") {
    return {
      inicio: new Date(atual.inicio.getTime() - 24 * 60 * 60 * 1000),
      fim: new Date(atual.fim.getTime() - 24 * 60 * 60 * 1000),
    };
  }

  if (periodo === "semana") {
    return {
      inicio: new Date(atual.inicio.getTime() - 7 * 24 * 60 * 60 * 1000),
      fim: new Date(atual.fim.getTime() - 7 * 24 * 60 * 60 * 1000),
    };
  }

  if (periodo === "mes") {
    return {
      inicio: new Date(atual.inicio.getFullYear(), atual.inicio.getMonth() - 1, 1, 0, 0, 0, 0),
      fim: new Date(atual.inicio.getFullYear(), atual.inicio.getMonth(), 0, 23, 59, 59, 999),
    };
  }

  return {
    inicio: new Date(atual.inicio.getFullYear() - 1, 0, 1, 0, 0, 0, 0),
    fim: new Date(atual.inicio.getFullYear() - 1, 11, 31, 23, 59, 59, 999),
  };
}

function isDateInRange(data: Date, inicio: Date, fim: Date) {
  const time = data.getTime();
  return time >= inicio.getTime() && time <= fim.getTime();
}

function startOfWeek(data: Date) {
  const inicio = new Date(data);
  const day = inicio.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  inicio.setDate(inicio.getDate() + diff);
  inicio.setHours(0, 0, 0, 0);
  return inicio;
}

function getComparisonTrend(atual: number, anterior: number) {
  if (atual > anterior) return "up" as const;
  if (atual < anterior) return "down" as const;
  return "flat" as const;
}

function getComparisonTrendInverse(atual: number, anterior: number) {
  if (atual < anterior) return "up" as const;
  if (atual > anterior) return "down" as const;
  return "flat" as const;
}

function formatComparisonContext(atual: number, anterior: number) {
  if (!anterior && !atual) return "Sem variação no comparativo";
  if (!anterior && atual > 0) return "+100% vs período anterior";
  const variacao = ((atual - anterior) / anterior) * 100;
  if (Math.abs(variacao) < 0.1) return "Estável vs período anterior";
  const sinal = variacao > 0 ? "+" : "";
  return `${sinal}${variacao.toFixed(1).replace(".", ",")}% vs período anterior`;
}

function getPeriodLabel(periodo: SalesPeriod) {
  if (periodo === "hoje") return "Hoje";
  if (periodo === "semana") return "Essa semana";
  if (periodo === "mes") return "Esse mês";
  return "Esse ano";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatCanal(canal: VendaCanal) {
  return canal === "loja_fisica" ? "Loja Física" : "Online";
}

function getStatusLabel(status: VendaStatus) {
  if (status === "rascunho") return "Rascunho";
  if (status === "concluida") return "Concluída";
  if (status === "aguardando_confirmacao") return "Aguardando confirmação";
  if (status === "cancelada") return "Cancelada";
  return "Em aberto";
}

function getStatusVariant(status: VendaStatus) {
  if (status === "concluida") return "success" as const;
  if (status === "aguardando_confirmacao") return "warning" as const;
  if (status === "cancelada") return "danger" as const;
  return "info" as const;
}

function getPagamentoLabel(pagamento?: FormaPagamento) {
  if (!pagamento) return "Não informado";
  if (pagamento === "pix") return "Pix";
  if (pagamento === "cartao") return "Cartão";
  if (pagamento === "boleto") return "Boleto";
  if (pagamento === "dinheiro") return "Dinheiro";
  return "Outro";
}

const filterClassName =
  "h-12 rounded-[18px] border border-[rgba(148,163,184,0.2)] bg-white px-4 text-sm text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)]";
