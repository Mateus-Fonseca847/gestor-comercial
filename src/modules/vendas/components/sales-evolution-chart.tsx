"use client";

import { useMemo, useState } from "react";
import type { VendaRegistro } from "@/modules/vendas/types";

export type SalesPeriod = "hoje" | "semana" | "mes" | "ano";
type SalesMetric = "faturamento" | "vendas" | "concluidos" | "ticket_medio";

type SalesPoint = {
  label: string;
  atual: number;
  anterior: number;
};

const periodOptions: Array<{ value: SalesPeriod; label: string }> = [
  { value: "hoje", label: "Hoje" },
  { value: "semana", label: "Essa semana" },
  { value: "mes", label: "Esse mês" },
  { value: "ano", label: "Esse ano" },
];

const metricOptions: Array<{ value: SalesMetric; label: string }> = [
  { value: "faturamento", label: "Valor vendido" },
  { value: "vendas", label: "Quantidade de vendas" },
  { value: "concluidos", label: "Pedidos concluídos" },
  { value: "ticket_medio", label: "Ticket médio" },
];

const metricDescriptions: Record<SalesMetric, string> = {
  faturamento: "Receita do período",
  vendas: "Volume de vendas lançadas",
  concluidos: "Pedidos fechados",
  ticket_medio: "Valor médio por venda",
};

export function SalesEvolutionChart({
  vendas,
  periodo: periodoProp,
  onPeriodoChange,
}: {
  vendas: VendaRegistro[];
  periodo?: SalesPeriod;
  onPeriodoChange?: (value: SalesPeriod) => void;
}) {
  const [internalPeriodo, setInternalPeriodo] = useState<SalesPeriod>("hoje");
  const [metrica, setMetrica] = useState<SalesMetric>("faturamento");
  const periodo = periodoProp ?? internalPeriodo;

  function handlePeriodoChange(value: SalesPeriod) {
    onPeriodoChange?.(value);
    if (periodoProp === undefined) {
      setInternalPeriodo(value);
    }
  }

  const data = useMemo(
    () => buildComparisonSeries(vendas, periodo, metrica),
    [vendas, periodo, metrica],
  );
  const chartData = useMemo(() => buildChartData(data), [data]);
  const periodLabels = getPeriodLegend(periodo);

  return (
    <article className="overflow-hidden rounded-[34px] border border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(246,249,252,0.96)_100%)] p-6 shadow-[0_20px_48px_rgba(15,23,42,0.08)] md:p-7">
      <div className="mb-6 flex flex-col gap-5 border-b border-[rgba(148,163,184,0.16)] pb-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <div className="inline-flex rounded-full bg-[rgba(37,99,235,0.08)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
            Painel comercial
          </div>
          <div className="space-y-1.5">
            <h2 className="text-[1.35rem] font-semibold tracking-tight text-[var(--color-text)]">
              Comparativo de vendas
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-soft)]">
              Compare o desempenho atual com o período anterior equivalente e identifique a direção da operação.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 xl:w-auto xl:items-end">
          <div className="inline-flex w-full flex-wrap rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-[rgba(248,250,252,0.94)] p-1.5 xl:w-auto">
            {periodOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handlePeriodoChange(option.value)}
                className={[
                  "rounded-[15px] px-3.5 py-2.5 text-sm font-medium transition-all duration-200",
                  periodo === option.value
                    ? "bg-white text-[var(--color-primary)] shadow-[0_8px_20px_rgba(15,23,42,0.08)]"
                    : "text-[var(--color-text-soft)] hover:text-[var(--color-text)]",
                ].join(" ")}
              >
                {option.label}
              </button>
            ))}
          </div>

          <select
            value={metrica}
            onChange={(event) => setMetrica(event.target.value as SalesMetric)}
            className="h-11 rounded-[16px] border border-[rgba(148,163,184,0.18)] bg-white px-4 text-sm font-medium text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)] xl:min-w-[220px]"
          >
            {metricOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--color-text)]">
            {metricDescriptions[metrica]}
          </p>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
            Atual x anterior equivalente
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm">
          <Legend color="#155DFC" label={periodLabels.atual} />
          <Legend color="#94BFFF" label={periodLabels.anterior} />
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[rgba(148,163,184,0.18)] bg-[linear-gradient(180deg,rgba(239,246,255,0.72)_0%,rgba(255,255,255,0.98)_100%)] p-4 md:p-5">
        <svg viewBox="0 0 920 380" className="h-[360px] w-full">
          {chartData.yTicks.map((tick) => (
            <g key={tick.value}>
              <line
                x1={72}
                x2={884}
                y1={tick.y}
                y2={tick.y}
                stroke="rgba(148,163,184,0.22)"
                strokeDasharray="5 7"
              />
              <text
                x={58}
                y={tick.y + 4}
                textAnchor="end"
                fontSize="12"
                fill="var(--color-text-soft)"
              >
                {formatMetricTick(tick.value, metrica)}
              </text>
            </g>
          ))}

          <line x1={72} x2={884} y1={330} y2={330} stroke="rgba(148,163,184,0.34)" />

          <path
            d={chartData.anteriorPath}
            fill="none"
            stroke="#94BFFF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={chartData.atualPath}
            fill="none"
            stroke="#155DFC"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {chartData.points.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.atualY} r={4.5} fill="#155DFC" />
              <circle cx={point.x} cy={point.anteriorY} r={4} fill="#94BFFF" />
              <text
                x={point.x}
                y={354}
                textAnchor="middle"
                fontSize="12"
                fill="var(--color-text-soft)"
              >
                {point.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </article>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-2.5 rounded-full bg-white/70 px-3 py-2 text-sm shadow-[0_6px_16px_rgba(15,23,42,0.05)]">
      <span className="h-2.5 w-8 rounded-full" style={{ backgroundColor: color }} />
      <span className="font-medium text-[var(--color-text-soft)]">{label}</span>
    </div>
  );
}

function buildComparisonSeries(
  vendas: VendaRegistro[],
  periodo: SalesPeriod,
  metrica: SalesMetric,
): SalesPoint[] {
  const hoje = new Date("2026-04-10T18:00:00-03:00");
  const vendasAtivas = vendas.filter((venda) => venda.status !== "cancelada");

  if (periodo === "hoje") {
    return ["09h", "11h", "13h", "15h", "17h", "19h"].map((label, index) => {
      const horaAtual = 9 + index * 2;
      const hojeInicio = new Date(hoje);
      hojeInicio.setHours(horaAtual, 0, 0, 0);
      const hojeFim = new Date(hojeInicio);
      hojeFim.setHours(horaAtual + 1, 59, 59, 999);

      const ontemInicio = new Date(hojeInicio);
      ontemInicio.setDate(hojeInicio.getDate() - 1);
      const ontemFim = new Date(hojeFim);
      ontemFim.setDate(hojeFim.getDate() - 1);

      return {
        label,
        atual: calculateMetricForRange(vendasAtivas, hojeInicio, hojeFim, metrica),
        anterior: calculateMetricForRange(vendasAtivas, ontemInicio, ontemFim, metrica),
      };
    });
  }

  if (periodo === "semana") {
    return ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map((label, index) => {
      const inicioAtual = startOfWeek(hoje);
      const diaAtual = new Date(inicioAtual);
      diaAtual.setDate(inicioAtual.getDate() + index);

      const inicioAnterior = new Date(inicioAtual);
      inicioAnterior.setDate(inicioAtual.getDate() - 7);
      const diaAnterior = new Date(inicioAnterior);
      diaAnterior.setDate(inicioAnterior.getDate() + index);

      return {
        label,
        atual: calculateMetricForDate(vendasAtivas, diaAtual, metrica),
        anterior: calculateMetricForDate(vendasAtivas, diaAnterior, metrica),
      };
    });
  }

  if (periodo === "mes") {
    return [
      { label: "S1", start: 1, end: 7 },
      { label: "S2", start: 8, end: 14 },
      { label: "S3", start: 15, end: 21 },
      { label: "S4", start: 22, end: 31 },
    ].map((bucket) => {
      const atualInicio = new Date(hoje.getFullYear(), hoje.getMonth(), bucket.start);
      const atualFim = new Date(hoje.getFullYear(), hoje.getMonth(), bucket.end, 23, 59, 59, 999);
      const anteriorInicio = new Date(hoje.getFullYear(), hoje.getMonth() - 1, bucket.start);
      const anteriorFim = new Date(
        hoje.getFullYear(),
        hoje.getMonth() - 1,
        bucket.end,
        23,
        59,
        59,
        999,
      );

      return {
        label: bucket.label,
        atual: calculateMetricForRange(vendasAtivas, atualInicio, atualFim, metrica),
        anterior: calculateMetricForRange(vendasAtivas, anteriorInicio, anteriorFim, metrica),
      };
    });
  }

  return [
    { label: "Jan", month: 0 },
    { label: "Fev", month: 1 },
    { label: "Mar", month: 2 },
    { label: "Abr", month: 3 },
    { label: "Mai", month: 4 },
    { label: "Jun", month: 5 },
    { label: "Jul", month: 6 },
    { label: "Ago", month: 7 },
    { label: "Set", month: 8 },
    { label: "Out", month: 9 },
    { label: "Nov", month: 10 },
    { label: "Dez", month: 11 },
  ].map((bucket) => {
    const atualInicio = new Date(hoje.getFullYear(), bucket.month, 1);
    const atualFim = new Date(hoje.getFullYear(), bucket.month + 1, 0, 23, 59, 59, 999);
    const anteriorInicio = new Date(hoje.getFullYear() - 1, bucket.month, 1);
    const anteriorFim = new Date(
      hoje.getFullYear() - 1,
      bucket.month + 1,
      0,
      23,
      59,
      59,
      999,
    );

    return {
      label: bucket.label,
      atual: calculateMetricForRange(vendasAtivas, atualInicio, atualFim, metrica),
      anterior: calculateMetricForRange(vendasAtivas, anteriorInicio, anteriorFim, metrica),
    };
  });
}

function calculateMetricForDate(
  vendas: VendaRegistro[],
  dia: Date,
  metrica: SalesMetric,
) {
  return calculateMetricForRange(
    vendas,
    new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), 0, 0, 0, 0),
    new Date(dia.getFullYear(), dia.getMonth(), dia.getDate(), 23, 59, 59, 999),
    metrica,
  );
}

function calculateMetricForRange(
  vendas: VendaRegistro[],
  inicio: Date,
  fim: Date,
  metrica: SalesMetric,
) {
  const recorte = vendas.filter((venda) => {
    const data = new Date(venda.criadoEm).getTime();
    return data >= inicio.getTime() && data <= fim.getTime();
  });

  if (metrica === "vendas") {
    return recorte.length;
  }

  if (metrica === "concluidos") {
    return recorte.filter((venda) => venda.status === "concluida").length;
  }

  const faturamento = recorte
    .filter((venda) => venda.status === "concluida")
    .reduce((total, venda) => total + venda.subtotal, 0);

  if (metrica === "faturamento") {
    return faturamento;
  }

  const concluidas = recorte.filter((venda) => venda.status === "concluida");
  return concluidas.length ? faturamento / concluidas.length : 0;
}

function buildChartData(data: SalesPoint[]) {
  const width = 812;
  const height = 250;
  const startX = 72;
  const startY = 40;
  const maxValue = Math.max(1, ...data.map((item) => Math.max(item.atual, item.anterior)));
  const steps = Math.max(data.length - 1, 1);
  const stepX = width / steps;

  const toY = (value: number) => startY + height - (value / maxValue) * height;

  const points = data.map((item, index) => ({
    label: item.label,
    x: startX + stepX * index,
    atualY: toY(item.atual),
    anteriorY: toY(item.anterior),
  }));

  const atualPath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.atualY}`)
    .join(" ");
  const anteriorPath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.anteriorY}`)
    .join(" ");

  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const value = Math.round((maxValue / 4) * index);
    return {
      value,
      y: toY(value),
    };
  }).reverse();

  return {
    points,
    atualPath,
    anteriorPath,
    yTicks,
  };
}

function startOfWeek(data: Date) {
  const inicio = new Date(data);
  const day = inicio.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  inicio.setDate(inicio.getDate() + diff);
  inicio.setHours(0, 0, 0, 0);
  return inicio;
}

function getPeriodLegend(periodo: SalesPeriod) {
  if (periodo === "hoje") {
    return { atual: "Hoje", anterior: "Ontem" };
  }

  if (periodo === "semana") {
    return { atual: "Essa semana", anterior: "Semana passada" };
  }

  if (periodo === "mes") {
    return { atual: "Esse mês", anterior: "Mês passado" };
  }

  return { atual: "Esse ano", anterior: "Ano passado" };
}

function formatMetricTick(value: number, metrica: SalesMetric) {
  if (metrica === "faturamento" || metrica === "ticket_medio") {
    if (value >= 1000) {
      return `R$ ${(value / 1000).toFixed(1).replace(".", ",")} mil`;
    }

    return `R$ ${Math.round(value)}`;
  }

  return String(Math.round(value));
}
