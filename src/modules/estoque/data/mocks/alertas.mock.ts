import type { AlertaEstoque } from "@/modules/estoque/types";

export const alertasEstoqueMock: AlertaEstoque[] = [
  {
    id: "alt-001",
    tipo: "estoque_baixo",
    severidade: "warning",
    status: "aberto",
    produtoId: "prod-bolsa-tiracolo",
    depositoId: "dep-loja",
    geradoEm: "2026-04-06T19:00:00.000Z",
    titulo: "Bolsa tiracolo abaixo do mínimo",
    mensagem: "Saldo disponível consolidado caiu para 5 unidades e já pede reposição.",
  },
  {
    id: "alt-002",
    tipo: "estoque_zerado",
    severidade: "critical",
    status: "aberto",
    produtoId: "prod-carteira-feminina",
    depositoId: "dep-loja",
    geradoEm: "2026-04-06T19:05:00.000Z",
    titulo: "Carteira feminina zerada",
    mensagem: "O item está sem saldo na loja e no estoque de apoio.",
  },
  {
    id: "alt-003",
    tipo: "estoque_baixo",
    severidade: "warning",
    status: "aberto",
    produtoId: "prod-body-splash",
    depositoId: "dep-loja",
    geradoEm: "2026-04-06T19:10:00.000Z",
    titulo: "Body splash perto da ruptura",
    mensagem: "O saldo disponível está em 7 unidades, abaixo do mínimo configurado.",
  },
];
