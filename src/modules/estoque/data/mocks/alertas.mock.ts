import type { AlertaEstoque } from "@/modules/estoque/types";

export const alertasEstoqueMock: AlertaEstoque[] = [
  {
    id: "alt-001",
    tipo: "estoque_baixo",
    severidade: "warning",
    status: "aberto",
    produtoId: "prod-toner-hp667",
    depositoId: "dep-central",
    geradoEm: "2026-04-05T08:00:00.000Z",
    titulo: "Toner abaixo do mínimo",
    mensagem: "Saldo disponível no depósito central caiu para 6 unidades.",
  },
  {
    id: "alt-002",
    tipo: "estoque_baixo",
    severidade: "critical",
    status: "aberto",
    produtoId: "prod-monitor-24",
    depositoId: "dep-central",
    geradoEm: "2026-04-05T08:05:00.000Z",
    titulo: "Monitor com cobertura crítica",
    mensagem: "Estoque consolidado do item está abaixo do ponto de reposição.",
  },
  {
    id: "alt-003",
    tipo: "sem_giro",
    severidade: "info",
    status: "aberto",
    produtoId: "prod-mouse-usb",
    depositoId: "dep-quarentena",
    geradoEm: "2026-04-05T08:15:00.000Z",
    titulo: "Item parado em quarentena",
    mensagem: "Lote recebido permanece sem liberação para venda ou transferência.",
  },
];
