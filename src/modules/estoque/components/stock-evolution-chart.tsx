"use client";

import { useMemo, useState } from "react";
import {
  estoqueEvolucaoMock,
  type EstoqueEvolucaoPonto,
  type EstoquePeriodo,
} from "@/modules/estoque/data/stock-evolution.mock";

const periodoOptions: Array<{ value: EstoquePeriodo; label: string }> = [
  { value: "nesse_mes", label: "Nesse mês" },
  { value: "hoje", label: "Hoje" },
  { value: "ultima_semana", label: "Última semana" },
  { value: "nesse_ano", label: "Esse ano" },
];

const periodoDescriptions: Record<EstoquePeriodo, string> = {
  hoje: "Estoque x horas",
  ultima_semana: "Estoque x dias",
  nesse_mes: "Estoque x dias",
  nesse_ano: "Estoque x meses",
};

export function StockEvolutionChart() {
  const [periodo, setPeriodo] = useState<EstoquePeriodo>("nesse_mes");
  const data = estoqueEvolucaoMock[periodo];

  const chartData = useMemo(() => buildChartData(data), [data]);

  return (
    <article className="overflow-hidden rounded-[34px] border border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(246,249,252,0.96)_100%)] p-6 shadow-[0_20px_48px_rgba(15,23,42,0.08)] md:p-7">
      <div className="mb-6 flex flex-col gap-5 border-b border-[rgba(148,163,184,0.16)] pb-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <div className="inline-flex rounded-full bg-[rgba(37,99,235,0.08)] px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-primary)]">
            Painel analítico
          </div>
          <div className="space-y-1.5">
            <h2 className="text-[1.35rem] font-semibold tracking-tight text-[var(--color-text)]">
              Evolução do estoque
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-[var(--color-text-soft)]">
              Compare o estoque médio com o estoque atual e acompanhe a pressão sobre o saldo ao longo do período.
            </p>
          </div>
        </div>

        <div className="inline-flex w-full flex-wrap rounded-[20px] border border-[rgba(148,163,184,0.18)] bg-[rgba(248,250,252,0.94)] p-1.5 xl:w-auto">
          {periodoOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPeriodo(option.value)}
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
      </div>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[var(--color-text)]">{periodoDescriptions[periodo]}</p>
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
            Leitura histórica do saldo
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm">
          <Legend color="#165DFF" label="Estoque atual" />
          <Legend color="#69B1FF" label="Estoque médio" />
        </div>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-[rgba(148,163,184,0.18)] bg-[linear-gradient(180deg,rgba(239,246,255,0.72)_0%,rgba(255,255,255,0.98)_100%)] p-4 md:p-5">
        <svg viewBox="0 0 920 380" className="h-[360px] w-full">
          <defs>
            <linearGradient id="estoque-area" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgba(22,93,255,0.16)" />
              <stop offset="100%" stopColor="rgba(22,93,255,0.02)" />
            </linearGradient>
          </defs>

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
                {tick.value}
              </text>
            </g>
          ))}

          <line x1={72} x2={884} y1={330} y2={330} stroke="rgba(148,163,184,0.34)" />

          <path d={chartData.areaPath} fill="url(#estoque-area)" />
          <path
            d={chartData.averagePath}
            fill="none"
            stroke="#69B1FF"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d={chartData.currentPath}
            fill="none"
            stroke="#165DFF"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {chartData.points.map((point) => (
            <g key={point.label}>
              <circle cx={point.x} cy={point.currentY} r={4.5} fill="#165DFF" />
              <circle cx={point.x} cy={point.averageY} r={4} fill="#69B1FF" />
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

function buildChartData(data: EstoqueEvolucaoPonto[]) {
  const width = 812;
  const height = 250;
  const startX = 72;
  const startY = 40;
  const bottomY = startY + height;
  const maxValue = Math.max(...data.map((item) => Math.max(item.estoqueAtual, item.estoqueMedio)));
  const minValue = Math.min(...data.map((item) => Math.min(item.estoqueAtual, item.estoqueMedio)));
  const padding = Math.max(Math.round((maxValue - minValue) * 0.14), 12);
  const domainMin = Math.max(0, minValue - padding);
  const domainMax = maxValue + padding;
  const steps = Math.max(data.length - 1, 1);
  const stepX = width / steps;

  const toY = (value: number) =>
    startY + height - ((value - domainMin) / Math.max(domainMax - domainMin, 1)) * height;

  const points = data.map((item, index) => ({
    label: item.label,
    x: startX + stepX * index,
    currentY: toY(item.estoqueAtual),
    averageY: toY(item.estoqueMedio),
  }));

  const currentPath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.currentY}`)
    .join(" ");
  const averagePath = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.averageY}`)
    .join(" ");
  const areaPath = `${currentPath} L ${points[points.length - 1]?.x ?? startX} ${bottomY} L ${points[0]?.x ?? startX} ${bottomY} Z`;

  const yTicks = Array.from({ length: 5 }, (_, index) => {
    const value = Math.round(domainMin + ((domainMax - domainMin) / 4) * index);
    return {
      value,
      y: toY(value),
    };
  }).reverse();

  return {
    points,
    currentPath,
    averagePath,
    areaPath,
    yTicks,
  };
}
