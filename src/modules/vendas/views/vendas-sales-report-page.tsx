"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { DataTable } from "@/components/page/data-table";
import { EmptyState } from "@/components/page/empty-state";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatCard } from "@/components/page/stat-card";
import { StatusBadge } from "@/components/page/status-badge";
import { vendasDashboardMock } from "@/modules/vendas/data/dashboard.mock";
import { useVendasStore } from "@/modules/vendas/store";
import type {
  FormaPagamento,
  VendaCanal,
  VendaRegistro,
  VendaStatus,
} from "@/modules/vendas/types";

type PeriodoFiltro = "hoje" | "semana" | "mes" | "ano";
type CanalFiltro = "todos" | VendaCanal;
type StatusFiltro = "todos" | VendaStatus;
type PagamentoFiltro = "todos" | FormaPagamento | "nao_informado";

type VendaRow = {
  id: string;
  cliente: string;
  data: string;
  canal: string;
  status: string;
  pagamento: string;
  total: string;
  itens: string;
};

type ProdutoRow = {
  id: string;
  produto: string;
  quantidade: number;
  faturamento: string;
  recorrencia: string;
};

type VendaRecenteRow = {
  id: string;
  cliente: string;
  data: string;
  valor: string;
  canal: string;
  status: string;
};

export function VendasSalesReportPage() {
  const vendasStore = useVendasStore((state) => state.vendas);
  const [periodo, setPeriodo] = useState<PeriodoFiltro>("mes");
  const [busca, setBusca] = useState("");
  const [identificadorFiltro, setIdentificadorFiltro] = useState("");
  const [canalFiltro, setCanalFiltro] = useState<CanalFiltro>("todos");
  const [statusFiltro, setStatusFiltro] = useState<StatusFiltro>("todos");
  const [produtoFiltro, setProdutoFiltro] = useState("todos");
  const [pagamentoFiltro, setPagamentoFiltro] = useState<PagamentoFiltro>("todos");
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);

  const vendas = useMemo(
    () => (vendasStore.length ? vendasStore : vendasDashboardMock),
    [vendasStore],
  );

  const periodoAtual = useMemo(() => getPeriodoAtual(periodo), [periodo]);
  const periodoAnterior = useMemo(
    () => getPeriodoAnterior(periodo, periodoAtual),
    [periodo, periodoAtual],
  );
  const periodoLabel = useMemo(() => getPeriodoLabel(periodo), [periodo]);
  const buscaNormalizada = busca.trim().toLowerCase();
  const identificadorNormalizado = identificadorFiltro.trim().toLowerCase();

  const produtoOptions = useMemo(
    () =>
      Array.from(new Set(vendas.flatMap((venda) => venda.itens.map((item) => item.nomeProduto)))).sort(
        (a, b) => a.localeCompare(b, "pt-BR"),
      ),
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

  const vendasNoPeriodo = useMemo(
    () =>
      vendas.filter((venda) =>
        isDateInRange(new Date(venda.criadoEm), periodoAtual.inicio, periodoAtual.fim),
      ),
    [periodoAtual, vendas],
  );

  const vendasFiltradas = useMemo(
    () =>
      vendasNoPeriodo
        .filter((venda) => {
          const pagamentoAtual = venda.pagamento?.formaPagamento ?? "nao_informado";
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
          const matchIdentificador =
            !identificadorNormalizado ||
            venda.id.toLowerCase().includes(identificadorNormalizado);

          return (
            matchBusca &&
            matchIdentificador &&
            (canalFiltro === "todos" || venda.canal === canalFiltro) &&
            (statusFiltro === "todos" || venda.status === statusFiltro) &&
            (produtoFiltro === "todos" ||
              venda.itens.some((item) => item.nomeProduto === produtoFiltro)) &&
            (pagamentoFiltro === "todos" || pagamentoAtual === pagamentoFiltro)
          );
        })
        .sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime()),
    [
      buscaNormalizada,
      canalFiltro,
      identificadorNormalizado,
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

  const vendasAnteriores = useMemo(
    () => filterVendasByRange(vendas, periodoAnterior.inicio, periodoAnterior.fim),
    [periodoAnterior, vendas],
  );

  const faturamentoAtual = useMemo(
    () => sumFaturamentoConclusoes(vendasFiltradas),
    [vendasFiltradas],
  );
  const faturamentoAnterior = useMemo(
    () => sumFaturamentoConclusoes(vendasAnteriores),
    [vendasAnteriores],
  );

  const concluidasAtual = useMemo(
    () => vendasFiltradas.filter((venda) => venda.status === "concluida"),
    [vendasFiltradas],
  );
  const concluidasAnterior = useMemo(
    () => vendasAnteriores.filter((venda) => venda.status === "concluida"),
    [vendasAnteriores],
  );

  const ticketAtual = concluidasAtual.length ? faturamentoAtual / concluidasAtual.length : 0;
  const ticketAnterior = concluidasAnterior.length ? faturamentoAnterior / concluidasAnterior.length : 0;
  const pendentesAtual = vendasFiltradas.filter(
    (venda) => venda.status === "em_aberto" || venda.status === "aguardando_confirmacao",
  ).length;
  const clientesAtivos = new Set(vendasFiltradas.map((venda) => venda.clienteNome)).size;
  const valorMedioPorCliente = clientesAtivos ? faturamentoAtual / clientesAtivos : 0;

  const canalMaisUsado = useMemo(() => {
    const totais = vendasFiltradas.reduce(
      (acc, venda) => {
        acc[venda.canal] += 1;
        return acc;
      },
      { loja_fisica: 0, online: 0 },
    );

    if (!totais.loja_fisica && !totais.online) {
      return "Sem dados";
    }

    return totais.loja_fisica >= totais.online ? "Loja Física" : "Online";
  }, [vendasFiltradas]);

  const metricas = [
    {
      label: "Faturamento do período",
      value: formatCurrency(faturamentoAtual),
      description: `${formatComparisonContext(faturamentoAtual, faturamentoAnterior)} • ${periodoLabel}`,
    },
    {
      label: "Quantidade de vendas",
      value: String(vendasFiltradas.length),
      description: `${vendasFiltradas.length} venda(s) registradas em ${periodoLabel.toLowerCase()}.`,
    },
    {
      label: "Ticket médio",
      value: formatCurrency(ticketAtual),
      description: `${formatComparisonContext(ticketAtual, ticketAnterior)} • média por pedido concluído`,
    },
    {
      label: "Pedidos concluídos",
      value: String(concluidasAtual.length),
      description: `${pendentesAtual} pedido(s) ainda pedem acompanhamento.`,
    },
    {
      label: "Valor médio por cliente",
      value: formatCurrency(valorMedioPorCliente),
      description: `${clientesAtivos} cliente(s) ativos nesse recorte.`,
    },
    {
      label: "Canal com maior uso",
      value: canalMaisUsado,
      description: "Canal com mais registros no período filtrado.",
    },
  ];

  const vendaRows = useMemo<VendaRow[]>(
    () =>
      vendasFiltradas.map((venda) => ({
        id: venda.id,
        cliente: venda.clienteNome,
        data: formatDateTime(venda.criadoEm),
        canal: formatCanal(venda.canal),
        status: getStatusLabel(venda.status),
        pagamento: getPagamentoLabel(venda.pagamento?.formaPagamento),
        total: formatCurrency(venda.totalFinal ?? venda.subtotal),
        itens: `${venda.itens.reduce((total, item) => total + item.quantidade, 0)} un`,
      })),
    [vendasFiltradas],
  );

  const produtosMaisVendidos = useMemo<ProdutoRow[]>(
    () =>
      concluidasAtual
        .flatMap((venda) => venda.itens)
        .reduce<
          Array<{ id: string; produto: string; quantidade: number; faturamento: number; recorrencia: number }>
        >((acc, item) => {
          const found = acc.find((entry) => entry.id === item.produtoId);

          if (found) {
            found.quantidade += item.quantidade;
            found.faturamento += item.subtotal;
            found.recorrencia += 1;
            return acc;
          }

          acc.push({
            id: item.produtoId,
            produto: item.nomeProduto,
            quantidade: item.quantidade,
            faturamento: item.subtotal,
            recorrencia: 1,
          });

          return acc;
        }, [])
        .sort((a, b) => b.quantidade - a.quantidade || b.faturamento - a.faturamento)
        .slice(0, 8)
        .map((item) => ({
          id: item.id,
          produto: item.produto,
          quantidade: item.quantidade,
          faturamento: formatCurrency(item.faturamento),
          recorrencia: `${item.recorrencia} venda(s)`,
        })),
    [concluidasAtual],
  );

  const ultimasVendas = useMemo<VendaRecenteRow[]>(
    () =>
      vendasFiltradas.slice(0, 6).map((venda) => ({
        id: venda.id,
        cliente: venda.clienteNome,
        data: formatDateTime(venda.criadoEm),
        valor: formatCurrency(venda.totalFinal ?? venda.subtotal),
        canal: formatCanal(venda.canal),
        status: getStatusLabel(venda.status),
      })),
    [vendasFiltradas],
  );

  const vendaColumns = [
    { key: "cliente", header: "Cliente" },
    { key: "data", header: "Data" },
    { key: "canal", header: "Canal" },
    {
      key: "status",
      header: "Status",
      render: (row: VendaRow) => (
        <StatusBadge variant={getStatusVariantFromLabel(row.status)}>{row.status}</StatusBadge>
      ),
    },
    { key: "pagamento", header: "Pagamento" },
    { key: "itens", header: "Itens", align: "right" as const },
    { key: "total", header: "Total", align: "right" as const },
  ];

  const produtosColumns = [
    { key: "produto", header: "Produto" },
    { key: "quantidade", header: "Quantidade", align: "right" as const },
    { key: "recorrencia", header: "Recorrência" },
    { key: "faturamento", header: "Faturamento", align: "right" as const },
  ];

  const ultimasVendasColumns = [
    { key: "cliente", header: "Cliente" },
    { key: "data", header: "Data" },
    { key: "canal", header: "Canal" },
    { key: "valor", header: "Valor", align: "right" as const },
    {
      key: "status",
      header: "Status",
      render: (row: VendaRecenteRow) => (
        <StatusBadge variant={getStatusVariantFromLabel(row.status)}>{row.status}</StatusBadge>
      ),
    },
  ];

  return (
    <PageContainer>
      <SectionHeader
        title="Relatório de vendas"
        description="Veja o resultado do período, encontre vendas rápido e acompanhe o que mais gira na loja."
      />

      <section className="space-y-4 rounded-[28px] border border-[rgba(148,163,184,0.16)] bg-[var(--color-surface-alt)]/70 p-5 shadow-sm md:p-6">
        <div className="flex flex-col gap-3 px-1 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--color-text)]">Busca e filtros do relatório</p>
            <p className="text-sm text-[var(--color-text-soft)]">
              Localize vendas por cliente, canal, status ou identificador sem sair da página.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full border border-[rgba(21,93,252,0.18)] bg-white px-3 py-1.5 text-xs font-semibold text-[var(--color-primary)]">
              {periodoLabel}
            </span>
            <span className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-text-soft)]">
              {vendasFiltradas.length} venda(s)
            </span>
            <span className="rounded-full border border-[var(--color-border)] bg-white px-3 py-1.5 text-xs font-medium text-[var(--color-text-soft)]">
              {clientesAtivos} cliente(s)
            </span>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_repeat(4,minmax(0,0.7fr))]">
          <label className="flex h-12 items-center gap-3 rounded-[18px] border border-[rgba(148,163,184,0.2)] bg-white px-4 text-[var(--color-text-soft)] transition-all duration-200 focus-within:border-[var(--color-primary)]">
            <Search className="h-4 w-4 shrink-0" />
            <input
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar por cliente, data, canal, status ou produto"
              className="w-full border-0 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)]"
            />
          </label>

          <input
            type="search"
            value={identificadorFiltro}
            onChange={(event) => setIdentificadorFiltro(event.target.value)}
            placeholder="ID da venda"
            className={filterClassName}
          />

          <select value={periodo} onChange={(event) => setPeriodo(event.target.value as PeriodoFiltro)} className={filterClassName}>
            <option value="hoje">Hoje</option>
            <option value="semana">Essa semana</option>
            <option value="mes">Esse mês</option>
            <option value="ano">Esse ano</option>
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
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <select value={pagamentoFiltro} onChange={(event) => setPagamentoFiltro(event.target.value as PagamentoFiltro)} className={filterClassName}>
            <option value="todos">Todos os pagamentos</option>
            {pagamentoOptions.map((pagamento) => (
              <option key={pagamento} value={pagamento}>{getPagamentoLabel(pagamento)}</option>
            ))}
            <option value="nao_informado">Sem forma informada</option>
          </select>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {metricas.map((metrica) => (
          <StatCard
            key={metrica.label}
            label={metrica.label}
            value={metrica.value}
            description={metrica.description}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.85fr]">
        <article className="space-y-4 rounded-[28px] border border-[rgba(148,163,184,0.16)] bg-white p-6 shadow-sm">
          <BlockHeader
            title="Listagem principal de vendas"
            description="Use a lista para revisar o período e abrir a venda que precisa de atenção."
            badge={`${vendaRows.length} venda(s)`}
          />
          <DataTable
            columns={vendaColumns}
            data={vendaRows}
            onRowClick={(row) => setSelectedSaleId(String(row.id))}
            emptyState={
              <EmptyState
                title="Nenhuma venda encontrada"
                description="Ajuste os filtros para localizar vendas nesse período."
              />
            }
          />
        </article>

        <article className="space-y-4 rounded-[28px] border border-[rgba(148,163,184,0.16)] bg-white p-6 shadow-sm">
          <BlockHeader
            title="Detalhes da venda"
            description="Confira cliente, itens, pagamento e contexto da venda selecionada."
            badge={vendaSelecionada ? getStatusLabel(vendaSelecionada.status) : undefined}
            badgeVariant={vendaSelecionada ? getStatusVariant(vendaSelecionada.status) : undefined}
          />

          {vendaSelecionada ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[var(--color-surface-alt)] px-4 py-4">
                <p className="text-base font-semibold text-[var(--color-text)]">{vendaSelecionada.clienteNome}</p>
                <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                  {vendaSelecionada.id} • {formatCanal(vendaSelecionada.canal)}
                </p>
                <p className="mt-1 text-sm text-[var(--color-text-soft)]">{formatDateTime(vendaSelecionada.criadoEm)}</p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoLine label="Subtotal" value={formatCurrency(vendaSelecionada.subtotal)} />
                <InfoLine label="Desconto" value={formatCurrency(vendaSelecionada.descontoValor ?? 0)} />
                <InfoLine label="Total final" value={formatCurrency(vendaSelecionada.totalFinal ?? vendaSelecionada.subtotal)} />
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
                    <div key={item.id} className="rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[var(--color-surface-alt)] px-4 py-3">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text)]">{item.nomeProduto}</p>
                          <p className="text-xs text-[var(--color-text-soft)]">
                            {item.quantidade} x {formatCurrency(item.precoUnitario)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-[var(--color-text)]">
                          {formatCurrency(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[var(--color-surface-alt)] px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                  Observações
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-text)]">
                  {vendaSelecionada.observacao ?? "Sem observações nessa venda."}
                </p>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Nenhuma venda selecionada"
              description="Clique em uma venda da listagem para abrir o detalhe aqui."
            />
          )}
        </article>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <article className="space-y-4 rounded-[28px] border border-[rgba(148,163,184,0.16)] bg-white p-6 shadow-sm">
          <BlockHeader
            title="Produtos mais vendidos"
            description="Itens com mais saída no período filtrado."
            badge={`${produtosMaisVendidos.length} destaque(s)`}
            badgeVariant="success"
          />
          <DataTable
            columns={produtosColumns}
            data={produtosMaisVendidos}
            emptyState={
              <EmptyState
                title="Sem destaque no período"
                description="Ainda não há vendas suficientes para montar esse ranking."
              />
            }
          />
        </article>

        <article className="space-y-4 rounded-[28px] border border-[rgba(148,163,184,0.16)] bg-white p-6 shadow-sm">
          <BlockHeader
            title="Últimas vendas"
            description="Acompanhe as vendas mais recentes dentro do recorte ativo."
            badge={`${ultimasVendas.length} registro(s)`}
            badgeVariant="info"
          />
          <DataTable
            columns={ultimasVendasColumns}
            data={ultimasVendas}
            onRowClick={(row) => setSelectedSaleId(String(row.id))}
            emptyState={
              <EmptyState
                title="Sem vendas recentes"
                description="Não há vendas para mostrar com os filtros ativos."
              />
            }
          />
        </article>
      </section>
    </PageContainer>
  );
}

function BlockHeader({
  title,
  description,
  badge,
  badgeVariant = "info",
}: {
  title: string;
  description: string;
  badge?: string;
  badgeVariant?: "info" | "success" | "warning" | "danger";
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[rgba(148,163,184,0.14)] pb-4">
      <div className="space-y-1">
        <h2 className="text-[1.05rem] font-semibold tracking-tight text-[var(--color-text)]">{title}</h2>
        <p className="text-sm leading-6 text-[var(--color-text-soft)]">{description}</p>
      </div>
      {badge ? <StatusBadge variant={badgeVariant}>{badge}</StatusBadge> : null}
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[rgba(148,163,184,0.16)] bg-[var(--color-surface-alt)] px-4 py-4">
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

function getPeriodoAtual(periodo: PeriodoFiltro) {
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

function getPeriodoAnterior(periodo: PeriodoFiltro, atual: { inicio: Date; fim: Date }) {
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

function getPeriodoLabel(periodo: PeriodoFiltro) {
  if (periodo === "hoje") return "Hoje";
  if (periodo === "semana") return "Essa semana";
  if (periodo === "ano") return "Esse ano";
  return "Esse mês";
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

function formatComparisonContext(atual: number, anterior: number) {
  if (!anterior && !atual) return "Sem variação no comparativo";
  if (!anterior && atual > 0) return "+100% vs período anterior";
  const variacao = ((atual - anterior) / anterior) * 100;
  if (Math.abs(variacao) < 0.1) return "Estável vs período anterior";
  const sinal = variacao > 0 ? "+" : "";
  return `${sinal}${variacao.toFixed(1).replace(".", ",")}% vs período anterior`;
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

function getStatusVariantFromLabel(status: string) {
  if (status === "Concluída") return "success" as const;
  if (status === "Aguardando confirmação") return "warning" as const;
  if (status === "Cancelada") return "danger" as const;
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
