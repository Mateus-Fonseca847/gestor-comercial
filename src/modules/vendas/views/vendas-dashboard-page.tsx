"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageContainer } from "@/components/page/page-container";
import { StatusBadge } from "@/components/page/status-badge";
import { DashboardKpiTile } from "@/modules/estoque/components/dashboard-kpi-tile";
import {
  SalesEvolutionChart,
  type SalesPeriod,
} from "@/modules/vendas/components/sales-evolution-chart";
import { vendasDashboardMock } from "@/modules/vendas/data/dashboard.mock";
import { useVendasStore } from "@/modules/vendas/store";
import type { VendaCanal, VendaRegistro, VendaStatus } from "@/modules/vendas/types";

type CanalFiltro = "todos" | VendaCanal;
type StatusFiltro = "todos" | VendaStatus;

export function VendasDashboardPage() {
  const vendasStore = useVendasStore((state) => state.vendas);
  const [buscaVenda, setBuscaVenda] = useState("");
  const [canalFiltro, setCanalFiltro] = useState<CanalFiltro>("todos");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("todos");
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [historicoFile, setHistoricoFile] = useState<File | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [chartPeriod, setChartPeriod] = useState<SalesPeriod>("mes");

  const vendas = useMemo(
    () => (vendasStore.length ? vendasStore : vendasDashboardMock),
    [vendasStore],
  );

  const buscaNormalizada = buscaVenda.trim().toLowerCase();

  const vendasOrdenadas = useMemo(
    () =>
      [...vendas].sort(
        (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
      ),
    [vendas],
  );

  const vendasFiltradas = useMemo(
    () =>
      vendasOrdenadas.filter((venda) => {
        const matchBusca =
          !buscaNormalizada ||
          [
            venda.id,
            venda.clienteNome,
            venda.telefone ?? "",
            formatDateTime(venda.criadoEm),
            formatCanal(venda.canal),
            getStatusLabel(venda.status),
            ...venda.itens.map((item) => item.nomeProduto),
          ]
            .join(" ")
            .toLowerCase()
            .includes(buscaNormalizada);

        const matchCanal = canalFiltro === "todos" || venda.canal === canalFiltro;
        const matchStatus = statusFiltro === "todos" || venda.status === statusFiltro;

        return matchBusca && matchCanal && matchStatus;
      }),
    [buscaNormalizada, canalFiltro, statusFiltro, vendasOrdenadas],
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

  const metricas = useMemo(() => {
    const referencia = new Date("2026-04-10T18:00:00-03:00");
    const mesAtual = getRangeMes(referencia);
    const mesAnterior = getRangeMes(new Date(referencia.getFullYear(), referencia.getMonth() - 1, 10));
    const anoAtual = getRangeAno(referencia);
    const anoAnterior = getRangeAno(
      new Date(referencia.getFullYear() - 1, referencia.getMonth(), referencia.getDate()),
    );

    const faturamentoMes = sumFaturamentoConclusoes(vendas, mesAtual.inicio, mesAtual.fim);
    const faturamentoMesAnterior = sumFaturamentoConclusoes(
      vendas,
      mesAnterior.inicio,
      mesAnterior.fim,
    );
    const faturamentoAno = sumFaturamentoConclusoes(vendas, anoAtual.inicio, anoAtual.fim);
    const faturamentoAnoAnterior = sumFaturamentoConclusoes(
      vendas,
      anoAnterior.inicio,
      anoAnterior.fim,
    );

    const vendasMes = countVendas(vendas, mesAtual.inicio, mesAtual.fim, "concluida");
    const vendasMesAnterior = countVendas(vendas, mesAnterior.inicio, mesAnterior.fim, "concluida");
    const ticketMes = vendasMes ? faturamentoMes / vendasMes : 0;
    const ticketMesAnterior = vendasMesAnterior ? faturamentoMesAnterior / vendasMesAnterior : 0;
    return [
      {
        label: "Faturamento do mês",
        value: formatCurrency(faturamentoMes),
        note: "Resultado acumulado do mês.",
        context: formatComparisonContext(
          faturamentoMes,
          faturamentoMesAnterior,
          "vs mês passado",
        ),
        tone: "neutral" as const,
        trend: getComparisonTrend(faturamentoMes, faturamentoMesAnterior),
      },
      {
        label: "Faturamento do ano",
        value: formatCurrency(faturamentoAno),
        note: "Receita acumulada no ano.",
        context: formatComparisonContext(faturamentoAno, faturamentoAnoAnterior, "vs ano passado"),
        tone: "neutral" as const,
        trend: getComparisonTrend(faturamentoAno, faturamentoAnoAnterior),
      },
      {
        label: "Vendas do mês",
        value: String(vendasMes),
        note: "Pedidos concluídos no mês atual.",
        context: formatComparisonContext(vendasMes, vendasMesAnterior, "vs mês passado"),
        tone: "neutral" as const,
        trend: getComparisonTrend(vendasMes, vendasMesAnterior),
      },
      {
        label: "Ticket médio",
        value: formatCurrency(ticketMes),
        note: "Média por venda concluída no mês.",
        context: formatComparisonContext(ticketMes, ticketMesAnterior, "vs mês passado"),
        tone: "neutral" as const,
        trend: getComparisonTrend(ticketMes, ticketMesAnterior),
      },
    ];
  }, [vendas]);

  const chartSummary = useMemo(() => {
    const referencia = new Date("2026-04-10T18:00:00-03:00");
    const range =
      chartPeriod === "hoje"
        ? {
            inicio: new Date(referencia.getFullYear(), referencia.getMonth(), referencia.getDate(), 0, 0, 0, 0),
            fim: new Date(referencia.getFullYear(), referencia.getMonth(), referencia.getDate(), 23, 59, 59, 999),
          }
        : chartPeriod === "semana"
          ? getRangeSemana(referencia)
          : chartPeriod === "mes"
            ? getRangeMes(referencia)
            : getRangeAno(referencia);

    const vendasPeriodo = vendas.filter((venda) => {
      const data = new Date(venda.criadoEm).getTime();
      return data >= range.inicio.getTime() && data <= range.fim.getTime();
    });
    const concluidas = vendasPeriodo.filter((venda) => venda.status === "concluida");
    const faturamento = concluidas.reduce((total, venda) => total + venda.subtotal, 0);
    const ticket = concluidas.length ? faturamento / concluidas.length : 0;

    return [
      { label: "Valor total vendido", value: formatCurrency(faturamento) },
      { label: "Quantidade de vendas", value: String(vendasPeriodo.length) },
      { label: "Pedidos concluídos", value: String(concluidas.length) },
      { label: "Ticket médio total", value: formatCurrency(ticket) },
    ];
  }, [chartPeriod, vendas]);

  const produtosMaisVendidos = useMemo(
    () =>
      vendasFiltradas
        .filter((venda) => venda.status === "concluida")
        .flatMap((venda) => venda.itens)
        .reduce<
          Array<{
            produtoId: string;
            nomeProduto: string;
            quantidade: number;
            faturamento: number;
            frequencia: number;
          }>
        >((acc, item) => {
          const found = acc.find((entry) => entry.produtoId === item.produtoId);

          if (found) {
            found.quantidade += item.quantidade;
            found.faturamento += item.subtotal;
            found.frequencia += 1;
            return acc;
          }

          acc.push({
            produtoId: item.produtoId,
            nomeProduto: item.nomeProduto,
            quantidade: item.quantidade,
            faturamento: item.subtotal,
            frequencia: 1,
          });

          return acc;
        }, [])
        .sort((a, b) => b.quantidade - a.quantidade || b.faturamento - a.faturamento)
        .slice(0, 6),
    [vendasFiltradas],
  );

  const ultimasVendas = useMemo(() => vendasFiltradas.slice(0, 7), [vendasFiltradas]);

  return (
    <PageContainer>
      <section className="space-y-6">
        <div className="space-y-2 px-1">
          <h1 className="text-[2.15rem] font-semibold tracking-[-0.03em] text-[var(--color-text)]">
            Vendas
          </h1>
          <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-soft)]">
            Leia o ritmo comercial da loja, acompanhe o que está fechando melhor e detalhe cada venda sem sair da tela.
          </p>
        </div>

        <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr] xl:items-stretch">
          <div className="space-y-4">
            <SalesEvolutionChart
              vendas={vendas}
              periodo={chartPeriod}
              onPeriodoChange={setChartPeriod}
            />

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
                    Importar histórico de vendas
                  </h2>
                  <p className="text-sm text-[var(--color-text-soft)]">
                    Traga vendas antigas para começar a análise com base completa.
                  </p>
                </div>

                <label className="inline-flex cursor-pointer items-center justify-center rounded-[18px] bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary-strong)]">
                  <input
                    type="file"
                    accept=".csv,.xlsx,.xls"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0] ?? null;
                      setHistoricoFile(file);
                      setImportStatus(
                        file ? `Arquivo ${file.name} pronto para revisão.` : null,
                      );
                    }}
                  />
                  Importar
                </label>
              </div>

              {historicoFile || importStatus ? (
                <p className="text-sm text-[var(--color-text-soft)]">
                  {importStatus ?? historicoFile?.name}
                </p>
              ) : null}
            </section>

            <div className="grid gap-4 sm:grid-cols-2">
              {metricas.map((metrica) => (
                <DashboardKpiTile
                  key={metrica.label}
                  label={metrica.label}
                  value={metrica.value}
                  note={metrica.note}
                  context={metrica.context}
                  tone={metrica.tone}
                  trend={metrica.trend}
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
              Encontre rápido uma venda por cliente, código ou produto.
            </p>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.3fr_0.36fr_0.36fr]">
          <label className="flex h-14 items-center gap-3 rounded-[20px] border border-[rgba(148,163,184,0.2)] bg-white px-4 text-[var(--color-text-soft)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-all duration-200 focus-within:border-[var(--color-primary)] focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.08)]">
            <Search className="h-4 w-4 shrink-0" />
            <input
              type="search"
              value={buscaVenda}
              onChange={(event) => setBuscaVenda(event.target.value)}
              placeholder="Buscar venda por cliente, código ou produto"
              className="w-full border-0 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)]"
            />
          </label>

          <select
            value={canalFiltro}
            onChange={(event) => setCanalFiltro(event.target.value as CanalFiltro)}
            className="h-14 rounded-[20px] border border-[rgba(148,163,184,0.2)] bg-white px-4 text-sm text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)]"
          >
            <option value="todos">Todos os canais</option>
            <option value="loja_fisica">Loja Física</option>
            <option value="online">Online</option>
          </select>

          <select
            value={statusFiltro}
            onChange={(event) => setStatusFiltro(event.target.value as StatusFiltro)}
            className="h-14 rounded-[20px] border border-[rgba(148,163,184,0.2)] bg-white px-4 text-sm text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)]"
          >
            <option value="todos">Todos os status</option>
            <option value="rascunho">Rascunho</option>
            <option value="concluida">Concluída</option>
            <option value="aguardando_confirmacao">Aguardando confirmação</option>
            <option value="em_aberto">Em aberto</option>
            <option value="cancelada">Cancelada</option>
          </select>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.95fr_0.95fr] xl:items-start">
        <article className="ui-surface-1 p-6 md:p-7">
          <div className="mb-6 flex items-start justify-between gap-4 border-b ui-divider pb-4">
            <div className="space-y-1.5">
              <h2 className="ui-section-title">Últimas vendas</h2>
              <p className="ui-body max-w-xl">
                Clique em uma venda para abrir o detalhe comercial ao lado.
              </p>
            </div>
            <StatusBadge variant="info">{ultimasVendas.length} registros</StatusBadge>
          </div>

          <div className="space-y-3.5">
            {ultimasVendas.length ? (
              ultimasVendas.map((venda) => {
                const selected = venda.id === vendaSelecionada?.id;

                return (
                  <button
                    key={venda.id}
                    type="button"
                    onClick={() => setSelectedSaleId(venda.id)}
                    className={[
                      "ui-surface-3 ui-interactive-item flex w-full flex-col gap-3 px-5 py-4 text-left lg:flex-row lg:items-center lg:justify-between",
                      selected
                        ? "border-[var(--color-primary)] shadow-[0_12px_24px_rgba(21,93,252,0.12)]"
                        : "",
                    ].join(" ")}
                  >
                    <div className="space-y-1.5">
                      <p className="ui-card-title-strong">{venda.clienteNome}</p>
                      <p className="ui-body text-[var(--color-text)]">
                        {venda.id} • {formatCanal(venda.canal)}
                      </p>
                      <p className="ui-body">
                        {formatDateTime(venda.criadoEm)} • {venda.itens.length} item(ns)
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[var(--color-text)]">
                          {formatCurrency(venda.subtotal)}
                        </p>
                        <p className="text-xs text-[var(--color-text-soft)]">
                          {getStatusLabel(venda.status)}
                        </p>
                      </div>
                      <StatusBadge variant={getStatusVariant(venda.status)}>
                        {formatCanal(venda.canal)}
                      </StatusBadge>
                    </div>
                  </button>
                );
              })
            ) : (
              <div className="ui-surface-2 border-dashed px-5 py-10 ui-body">
                Nenhuma venda encontrada com os filtros atuais.
              </div>
            )}
          </div>
        </article>

        <article className="ui-surface-1 p-6 md:p-7">
          <div className="mb-6 flex items-start justify-between gap-4 border-b ui-divider pb-4">
            <div className="space-y-1.5">
              <h2 className="ui-section-title">Produtos mais vendidos</h2>
              <p className="ui-body max-w-xl">
                Itens com melhor saída dentro do recorte atual.
              </p>
            </div>
            <StatusBadge variant="success">Top giro</StatusBadge>
          </div>

          <div className="space-y-3.5">
            {produtosMaisVendidos.length ? (
              produtosMaisVendidos.map((produto) => (
                <div
                  key={produto.produtoId}
                  className="ui-surface-3 ui-interactive-item flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div className="space-y-1.5">
                    <p className="ui-card-title-strong">{produto.nomeProduto}</p>
                    <p className="ui-body text-[var(--color-text)]">
                      {produto.quantidade} un vendidas
                    </p>
                    <p className="ui-body">
                      Apareceu em {produto.frequencia} venda(s)
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {formatCurrency(produto.faturamento)}
                    </p>
                    <p className="text-xs text-[var(--color-text-soft)]">
                      Faturamento do recorte
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="ui-surface-2 border-dashed px-5 py-10 ui-body">
                Ainda não há saída suficiente para destacar produtos.
              </div>
            )}
          </div>
        </article>

        <article className="ui-surface-1 p-6 md:p-7">
          <div className="mb-6 flex items-start justify-between gap-4 border-b ui-divider pb-4">
            <div className="space-y-1.5">
              <h2 className="ui-section-title">Detalhes da venda</h2>
              <p className="ui-body max-w-xl">
                Veja cliente, canal, itens e contexto da venda selecionada.
              </p>
            </div>
            {vendaSelecionada ? (
              <StatusBadge variant={getStatusVariant(vendaSelecionada.status)}>
                {getStatusLabel(vendaSelecionada.status)}
              </StatusBadge>
            ) : null}
          </div>

          {vendaSelecionada ? (
            <div className="space-y-5">
              <div className="ui-surface-3 px-5 py-4">
                <p className="text-[1.05rem] font-semibold text-[var(--color-text)]">
                  {vendaSelecionada.clienteNome}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                  {vendaSelecionada.id} • {formatCanal(vendaSelecionada.canal)}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                  {formatDateTime(vendaSelecionada.criadoEm)}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <MetricMiniCard
                  label="Total da venda"
                  value={formatCurrency(vendaSelecionada.subtotal)}
                />
                <MetricMiniCard
                  label="Itens"
                  value={`${vendaSelecionada.itens.reduce(
                    (total, item) => total + item.quantidade,
                    0,
                  )} un`}
                />
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    Itens lançados
                  </p>
                </div>
                <div className="space-y-2.5">
                  {vendaSelecionada.itens.map((item) => (
                    <div
                      key={item.id}
                      className="ui-surface-3 flex items-center justify-between gap-3 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text)]">
                          {item.nomeProduto}
                        </p>
                        <p className="text-xs text-[var(--color-text-soft)]">
                          {item.quantidade} x {formatCurrency(item.precoUnitario)}
                        </p>
                      </div>
                      <p className="text-sm font-semibold text-[var(--color-text)]">
                        {formatCurrency(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoLine label="Canal" value={formatCanal(vendaSelecionada.canal)} />
                <InfoLine label="Telefone" value={vendaSelecionada.telefone ?? "Não informado"} />
                <InfoLine label="Status" value={getStatusLabel(vendaSelecionada.status)} />
                <InfoLine label="Depósito" value={vendaSelecionada.depositoId ?? "Padrão da loja"} />
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
            <div className="ui-surface-2 border-dashed px-5 py-10 ui-body">
              Selecione uma venda para abrir o detalhe aqui.
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
  if (status === "rascunho") return "info" as const;
  if (status === "concluida") return "success" as const;
  if (status === "aguardando_confirmacao") return "warning" as const;
  if (status === "cancelada") return "danger" as const;
  return "info" as const;
}

function startOfWeek(data: Date) {
  const inicio = new Date(data);
  const day = inicio.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  inicio.setDate(inicio.getDate() + diff);
  inicio.setHours(0, 0, 0, 0);
  return inicio;
}

function getRangeSemana(data: Date) {
  const inicio = startOfWeek(data);
  const fim = new Date(inicio);
  fim.setDate(inicio.getDate() + 6);
  fim.setHours(23, 59, 59, 999);
  return { inicio, fim };
}

function getRangeMes(data: Date) {
  return {
    inicio: new Date(data.getFullYear(), data.getMonth(), 1, 0, 0, 0, 0),
    fim: new Date(data.getFullYear(), data.getMonth() + 1, 0, 23, 59, 59, 999),
  };
}

function getRangeAno(data: Date) {
  return {
    inicio: new Date(data.getFullYear(), 0, 1, 0, 0, 0, 0),
    fim: new Date(data.getFullYear(), 11, 31, 23, 59, 59, 999),
  };
}

function sumFaturamentoConclusoes(vendas: VendaRegistro[], inicio: Date, fim: Date) {
  return vendas
    .filter((venda) => venda.status === "concluida")
    .filter((venda) => {
      const data = new Date(venda.criadoEm).getTime();
      return data >= inicio.getTime() && data <= fim.getTime();
    })
    .reduce((total, venda) => total + venda.subtotal, 0);
}

function countVendas(
  vendas: VendaRegistro[],
  inicio: Date,
  fim: Date,
  status?: VendaStatus,
) {
  return vendas.filter((venda) => {
    const data = new Date(venda.criadoEm).getTime();
    const noPeriodo = data >= inicio.getTime() && data <= fim.getTime();
    return noPeriodo && (!status || venda.status === status);
  }).length;
}

function getComparisonTrend(atual: number, anterior: number) {
  if (atual > anterior) return "up" as const;
  if (atual < anterior) return "down" as const;
  return "flat" as const;
}

function formatComparisonContext(atual: number, anterior: number, suffix: string) {
  if (!anterior && !atual) {
    return `Sem movimento ${suffix}`;
  }

  if (!anterior && atual > 0) {
    return `+100% ${suffix}`;
  }

  const variacao = ((atual - anterior) / anterior) * 100;

  if (Math.abs(variacao) < 0.1) {
    return `Estável ${suffix}`;
  }

  const sinal = variacao > 0 ? "+" : "";
  return `${sinal}${variacao.toFixed(1).replace(".", ",")}% ${suffix}`;
}
