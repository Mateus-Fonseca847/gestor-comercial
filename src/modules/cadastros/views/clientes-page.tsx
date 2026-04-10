"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatusBadge } from "@/components/page/status-badge";
import { StatCard } from "@/components/page/stat-card";
import { clientesPerfisMock } from "@/modules/cadastros/data/clientes.mock";
import { vendasDashboardMock } from "@/modules/vendas/data/dashboard.mock";
import { useVendasStore } from "@/modules/vendas/store";
import type { VendaCanal, VendaRegistro } from "@/modules/vendas/types";

type ClienteStatus = "ativo" | "em_acompanhamento" | "novo";

type ClienteRelatorio = {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  cadastroEm: string;
  status: ClienteStatus;
  canalPreferencial: VendaCanal;
  observacao?: string;
  compras: VendaRegistro[];
};

type ClienteSortKey = "ultima_venda" | "ticket_medio" | "compras" | "frequencia";

export function ClientesPage() {
  const vendasStore = useVendasStore((state) => state.vendas);
  const [busca, setBusca] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<ClienteSortKey>("ultima_venda");

  const vendas = useMemo(
    () => (vendasStore.length ? vendasStore : vendasDashboardMock),
    [vendasStore],
  );

  const clientes = useMemo(() => {
    const salesByCliente = new Map<string, VendaRegistro[]>();

    for (const venda of vendas) {
      const current = salesByCliente.get(venda.clienteNome) ?? [];
      current.push(venda);
      salesByCliente.set(venda.clienteNome, current);
    }

    const fromProfiles = clientesPerfisMock.map<ClienteRelatorio>((perfil) => {
      const compras = [...(salesByCliente.get(perfil.nome) ?? [])].sort(
        (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
      );
      return {
        id: perfil.id,
        nome: perfil.nome,
        telefone: perfil.telefone ?? compras[0]?.telefone,
        email: perfil.email ?? compras[0]?.clienteEmail,
        cadastroEm: perfil.cadastroEm,
        status: perfil.status,
        canalPreferencial: perfil.canalPreferencial ?? getCanalPreferencial(compras),
        observacao: perfil.observacao,
        compras,
      };
    });

    const extraClientes = Array.from(salesByCliente.entries())
      .filter(([nome]) => !clientesPerfisMock.some((perfil) => perfil.nome === nome))
      .map<ClienteRelatorio>(([nome, compras], index) => ({
        id: `extra-${index + 1}`,
        nome,
        telefone: compras[0]?.telefone,
        email: compras[0]?.clienteEmail,
        cadastroEm: compras[compras.length - 1]?.criadoEm ?? new Date().toISOString(),
        status: "ativo",
        canalPreferencial: getCanalPreferencial(compras),
        compras: [...compras].sort(
          (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
        ),
      }));

    return [...fromProfiles, ...extraClientes].sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR"),
    );
  }, [vendas]);

  const buscaNormalizada = busca.trim().toLowerCase();
  const clientesFiltrados = useMemo(() => {
    const filtrados = clientes.filter((cliente) =>
      [cliente.nome, cliente.telefone ?? "", cliente.email ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(buscaNormalizada),
    );

    return [...filtrados].sort((a, b) => compareClientes(a, b, sortBy));
  }, [buscaNormalizada, clientes, sortBy]);

  useEffect(() => {
    if (!clientesFiltrados.length) {
      setSelectedId(null);
      return;
    }
    if (!selectedId || !clientesFiltrados.some((cliente) => cliente.id === selectedId)) {
      setSelectedId(clientesFiltrados[0]?.id ?? null);
    }
  }, [clientesFiltrados, selectedId]);

  const clienteSelecionado = useMemo(
    () => clientesFiltrados.find((cliente) => cliente.id === selectedId) ?? null,
    [clientesFiltrados, selectedId],
  );

  const metricas = useMemo(() => {
    const ativos = clientes.filter((cliente) => cliente.compras.length > 0).length;
    const semHistorico = clientes.filter((cliente) => !cliente.compras.length).length;
    const faturamento = clientes.reduce(
      (total, cliente) =>
        total +
        cliente.compras
          .filter((compra) => compra.status === "concluida")
          .reduce((sum, compra) => sum + (compra.totalFinal ?? compra.subtotal), 0),
      0,
    );

    return [
      { label: "Clientes com histórico", value: String(ativos), description: "Quem já comprou e já gera leitura comercial." },
      { label: "Sem histórico", value: String(semHistorico), description: "Clientes cadastrados que ainda não compraram." },
      { label: "Faturamento da base", value: formatCurrency(faturamento), description: "Valor já vendido para os clientes acompanhados." },
    ];
  }, [clientes]);

  const relatorio = useMemo(
    () => (clienteSelecionado ? buildClientReport(clienteSelecionado) : null),
    [clienteSelecionado],
  );

  return (
    <PageContainer>
      <SectionHeader
        title="Clientes"
        description="Clique em um cliente para abrir o relatório completo do relacionamento com a loja."
        actions={[{ label: "Novo cliente" }]}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        {metricas.map((metrica) => (
          <StatCard key={metrica.label} {...metrica} />
        ))}
      </section>

      <section className="ui-surface-1 p-5">
        <div className="grid gap-3 lg:grid-cols-[1fr_240px]">
          <label className="flex h-12 items-center gap-3 rounded-[18px] border border-[rgba(148,163,184,0.2)] bg-white px-4 text-[var(--color-text-soft)] transition-all duration-200 focus-within:border-[var(--color-primary)]">
            <Search className="h-4 w-4 shrink-0" />
            <input
              type="search"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar cliente por nome, telefone ou e-mail"
              className="w-full border-0 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-soft)]"
            />
          </label>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as ClienteSortKey)}
            className="h-12 rounded-[18px] border border-[rgba(148,163,184,0.2)] bg-white px-4 text-sm text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)]"
          >
            <option value="ultima_venda">Última venda</option>
            <option value="ticket_medio">Ticket médio</option>
            <option value="compras">Compras</option>
            <option value="frequencia">Frequência</option>
          </select>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.92fr_1.08fr] xl:items-start">
        <article className="ui-surface-1 p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3 border-b ui-divider pb-4">
            <div>
              <h2 className="ui-section-title">Base de clientes</h2>
              <p className="ui-body">Selecione um cliente para abrir o relatório comercial individual.</p>
            </div>
            <StatusBadge variant="info">{clientesFiltrados.length} clientes</StatusBadge>
          </div>

          <div className="space-y-3">
            {clientesFiltrados.length ? (
              clientesFiltrados.map((cliente) => {
                const ticket = calculateTicket(cliente.compras);
                const sequencia = calculateSequencia(cliente.compras);
                const ultimaVenda = getUltimaCompra(cliente.compras);
                return (
                  <button
                    key={cliente.id}
                    type="button"
                    onClick={() => setSelectedId(cliente.id)}
                    className={[
                      "ui-surface-3 ui-interactive-item flex w-full items-start justify-between gap-3 px-4 py-4 text-left",
                      cliente.id === clienteSelecionado?.id
                        ? "border-[var(--color-primary)] shadow-[0_10px_20px_rgba(21,93,252,0.10)]"
                        : "",
                    ].join(" ")}
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-[var(--color-text)]">{cliente.nome}</p>
                      <p className="text-xs text-[var(--color-text-soft)]">
                        {cliente.telefone ?? "Sem telefone"} • {formatCanal(cliente.canalPreferencial)}
                      </p>
                      <p className="text-xs text-[var(--color-text-soft)]">
                        {cliente.compras.length
                          ? `${cliente.compras.length} compra(s) • ticket ${formatCurrency(ticket)} • frequência ${sequencia.toFixed(1).replace(".", ",")}/mês`
                          : "Cliente cadastrado sem histórico"}
                      </p>
                      {ultimaVenda ? (
                        <p className="text-xs text-[var(--color-text-soft)]">
                          Última compra em {formatDateTime(ultimaVenda.criadoEm)}
                        </p>
                      ) : null}
                    </div>
                    <StatusBadge variant={statusVariantCliente(cliente.status)}>
                      {statusLabelCliente(cliente.status)}
                    </StatusBadge>
                  </button>
                );
              })
            ) : (
              <div className="ui-surface-2 border-dashed px-4 py-10 ui-body">
                Nenhum cliente encontrado com a busca atual.
              </div>
            )}
          </div>
        </article>

        <article className="ui-surface-1 p-5 md:p-6">
          <div className="mb-4 flex items-center justify-between gap-3 border-b ui-divider pb-4">
            <div>
              <h2 className="ui-section-title">Relatório do cliente</h2>
              <p className="ui-body">Histórico, comportamento de compra e contexto para atendimento.</p>
            </div>
            {clienteSelecionado ? (
              <StatusBadge variant={statusVariantCliente(clienteSelecionado.status)}>
                {statusLabelCliente(clienteSelecionado.status)}
              </StatusBadge>
            ) : null}
          </div>

          {clienteSelecionado && relatorio ? (
            <div className="space-y-5">
              <section className="ui-surface-3 px-4 py-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-base font-semibold text-[var(--color-text)]">{clienteSelecionado.nome}</p>
                    <p className="text-sm text-[var(--color-text-soft)]">
                      {clienteSelecionado.telefone ?? "Telefone não informado"}
                    </p>
                    <p className="text-sm text-[var(--color-text-soft)]">
                      {clienteSelecionado.email ?? "E-mail não informado"}
                    </p>
                  </div>
                  <div className="text-right text-sm text-[var(--color-text-soft)]">
                    <p>Cadastro em {formatDate(clienteSelecionado.cadastroEm)}</p>
                    <p>Canal preferencial: {formatCanal(clienteSelecionado.canalPreferencial)}</p>
                  </div>
                </div>
              </section>

              <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricMiniCard label="Total gasto" value={formatCurrency(relatorio.totalGasto)} />
                <MetricMiniCard label="Compras" value={String(relatorio.quantidadeCompras)} />
                <MetricMiniCard label="Ticket médio" value={formatCurrency(relatorio.ticketMedio)} />
                <MetricMiniCard label="Última compra" value={relatorio.ultimaCompra ? formatDateTime(relatorio.ultimaCompra.criadoEm) : "Sem compra"} />
              </section>

              <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <MetricMiniCard label="Canal mais usado" value={formatCanal(relatorio.canalMaisUsado)} />
                <MetricMiniCard label="Primeira compra" value={relatorio.primeiraCompra ? formatDate(relatorio.primeiraCompra.criadoEm) : "Sem compra"} />
                <MetricMiniCard label="Compras no mês" value={String(relatorio.comprasNoMes)} />
                <MetricMiniCard label="Valor no mês" value={formatCurrency(relatorio.valorNoMes)} />
                <MetricMiniCard label="Frequência" value={`${relatorio.sequencia.toFixed(1).replace(".", ",")} compra(s)/mês`} />
              </section>

              {relatorio.quantidadeCompras ? (
                <>
                  <section className="grid gap-4 xl:grid-cols-2">
                    <div className="ui-surface-3 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                        Produto mais comprado
                      </p>
                      <div className="mt-3 space-y-1">
                        <p className="text-sm font-semibold text-[var(--color-text)]">{relatorio.produtoMaisComprado.nome}</p>
                        <p className="text-sm text-[var(--color-text-soft)]">
                          {relatorio.produtoMaisComprado.quantidade} un • {formatCurrency(relatorio.produtoMaisComprado.valor)}
                        </p>
                        <p className="text-xs text-[var(--color-text-soft)]">
                          Apareceu em {relatorio.produtoMaisComprado.recorrencia} compra(s)
                        </p>
                      </div>
                    </div>

                    <div className="ui-surface-3 px-4 py-4">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                        Produtos comprados recentemente
                      </p>
                      <div className="mt-3 space-y-2">
                        {relatorio.produtosRecentes.map((produto) => (
                          <div key={`${produto.nome}-${produto.data}`} className="flex items-center justify-between gap-3 text-sm">
                            <span className="font-medium text-[var(--color-text)]">{produto.nome}</span>
                            <span className="text-[var(--color-text-soft)]">{formatDate(produto.data)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>

                  <section className="ui-surface-3 px-4 py-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                        Histórico de compras
                      </p>
                      <StatusBadge variant="info">{relatorio.historico.length} registros</StatusBadge>
                    </div>
                    <div className="space-y-2.5">
                      {relatorio.historico.map((compra) => (
                        <div key={compra.id} className="rounded-[18px] border border-[var(--color-border)] bg-white px-4 py-3">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-[var(--color-text)]">{formatDateTime(compra.criadoEm)}</p>
                              <p className="text-xs text-[var(--color-text-soft)]">
                                {formatCanal(compra.canal)} • {compra.itens.map((item) => item.nomeProduto).join(", ")}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-semibold text-[var(--color-text)]">{formatCurrency(compra.totalFinal ?? compra.subtotal)}</p>
                              <p className="text-xs text-[var(--color-text-soft)]">{getStatusLabel(compra.status)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              ) : (
                <section className="ui-surface-2 border-dashed px-5 py-10">
                  <p className="text-sm font-semibold text-[var(--color-text)]">Cliente cadastrado sem histórico comercial</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text-soft)]">
                    Assim que a primeira venda for registrada, esta área passa a mostrar compras, ticket médio, produtos recorrentes e frequência.
                  </p>
                </section>
              )}

              {clienteSelecionado.observacao ? (
                <section className="ui-surface-3 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    Observações
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-text)]">{clienteSelecionado.observacao}</p>
                </section>
              ) : null}
            </div>
          ) : (
            <div className="ui-surface-2 border-dashed px-4 py-10 ui-body">
              Selecione um cliente para abrir o relatório comercial.
            </div>
          )}
        </article>
      </section>
    </PageContainer>
  );
}

function buildClientReport(cliente: ClienteRelatorio) {
  const historico = [...cliente.compras].sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
  );
  const concluidas = historico.filter((compra) => compra.status === "concluida");
  const totalGasto = concluidas.reduce((total, compra) => total + (compra.totalFinal ?? compra.subtotal), 0);
  const quantidadeCompras = concluidas.length;
  const ticketMedio = quantidadeCompras ? totalGasto / quantidadeCompras : 0;

  const produtoMap = new Map<string, { nome: string; quantidade: number; valor: number; recorrencia: number }>();
  for (const compra of concluidas) {
    for (const item of compra.itens) {
      const current = produtoMap.get(item.produtoId) ?? {
        nome: item.nomeProduto,
        quantidade: 0,
        valor: 0,
        recorrencia: 0,
      };
      current.quantidade += item.quantidade;
      current.valor += item.subtotal;
      current.recorrencia += 1;
      produtoMap.set(item.produtoId, current);
    }
  }

  const produtoMaisComprado =
    [...produtoMap.values()].sort((a, b) => b.quantidade - a.quantidade || b.valor - a.valor)[0] ??
    { nome: "Sem histórico", quantidade: 0, valor: 0, recorrencia: 0 };

  const produtosRecentes = concluidas
    .flatMap((compra) =>
      compra.itens.map((item) => ({
        nome: item.nomeProduto,
        data: compra.criadoEm,
      })),
    )
    .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
    .slice(0, 4);

  const canalMaisUsado = getCanalPreferencial(concluidas);
  const agora = new Date("2026-04-10T18:00:00-03:00");
  const comprasNoMes = concluidas.filter((compra) => {
    const data = new Date(compra.criadoEm);
    return data.getFullYear() === agora.getFullYear() && data.getMonth() === agora.getMonth();
  });
  const sequencia = calculateSequencia(concluidas);
  return {
    totalGasto,
    quantidadeCompras,
    ticketMedio,
    ultimaCompra: historico[0],
    primeiraCompra: historico[historico.length - 1],
    canalMaisUsado,
    comprasNoMes: comprasNoMes.length,
    valorNoMes: comprasNoMes.reduce((total, compra) => total + (compra.totalFinal ?? compra.subtotal), 0),
    sequencia,
    produtoMaisComprado,
    produtosRecentes,
    historico: historico.slice(0, 8),
  };
}

function calculateTicket(compras: VendaRegistro[]) {
  const concluidas = compras.filter((compra) => compra.status === "concluida");
  if (!concluidas.length) return 0;
  const total = concluidas.reduce((sum, compra) => sum + (compra.totalFinal ?? compra.subtotal), 0);
  return total / concluidas.length;
}

function getCanalPreferencial(compras: VendaRegistro[]): VendaCanal {
  const loja = compras.filter((compra) => compra.canal === "loja_fisica").length;
  const online = compras.filter((compra) => compra.canal === "online").length;
  return online > loja ? "online" : "loja_fisica";
}

function getUltimaCompra(compras: VendaRegistro[]) {
  return [...compras].sort(
    (a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime(),
  )[0];
}

function getPrimeiraCompra(compras: VendaRegistro[]) {
  return [...compras].sort(
    (a, b) => new Date(a.criadoEm).getTime() - new Date(b.criadoEm).getTime(),
  )[0];
}

function calculateSequencia(compras: VendaRegistro[]) {
  const concluidas = compras.filter((compra) => compra.status === "concluida");
  if (!concluidas.length) return 0;

  const primeira = getPrimeiraCompra(concluidas);
  const referencia = new Date("2026-04-10T18:00:00-03:00");
  const diffMs = referencia.getTime() - new Date(primeira.criadoEm).getTime();
  const meses = Math.max(diffMs / (1000 * 60 * 60 * 24 * 30.4375), 1);

  return concluidas.length / meses;
}

function compareClientes(a: ClienteRelatorio, b: ClienteRelatorio, sortBy: ClienteSortKey) {
  if (sortBy === "ticket_medio") {
    return calculateTicket(b.compras) - calculateTicket(a.compras) || a.nome.localeCompare(b.nome, "pt-BR");
  }

  if (sortBy === "compras") {
    return b.compras.length - a.compras.length || a.nome.localeCompare(b.nome, "pt-BR");
  }

  if (sortBy === "frequencia") {
    return calculateSequencia(b.compras) - calculateSequencia(a.compras) || a.nome.localeCompare(b.nome, "pt-BR");
  }

  const ultimaA = getUltimaCompra(a.compras);
  const ultimaB = getUltimaCompra(b.compras);
  return (ultimaB ? new Date(ultimaB.criadoEm).getTime() : 0) - (ultimaA ? new Date(ultimaA.criadoEm).getTime() : 0) || a.nome.localeCompare(b.nome, "pt-BR");
}

function statusVariantCliente(status: ClienteStatus) {
  if (status === "ativo") return "success" as const;
  if (status === "em_acompanhamento") return "warning" as const;
  return "info" as const;
}

function statusLabelCliente(status: ClienteStatus) {
  if (status === "ativo") return "Ativo";
  if (status === "em_acompanhamento") return "Em acompanhamento";
  return "Novo";
}

function MetricMiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="ui-surface-3 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">{label}</p>
      <p className="mt-2 text-xl font-semibold text-[var(--color-text)]">{value}</p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
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
  return canal === "online" ? "Online" : "Loja Física";
}

function getStatusLabel(status: VendaRegistro["status"]) {
  if (status === "concluida") return "Concluída";
  if (status === "aguardando_confirmacao") return "Aguardando confirmação";
  if (status === "cancelada") return "Cancelada";
  if (status === "rascunho") return "Rascunho";
  return "Em aberto";
}
