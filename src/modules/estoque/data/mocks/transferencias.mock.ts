import type { Transferencia } from "@/modules/estoque/types";

export const transferenciasMock: Transferencia[] = [
  {
    id: "tr-2026-0101",
    codigo: "TR-2026-0101",
    status: "recebida",
    depositoOrigemId: "dep-estoque",
    depositoDestinoId: "dep-loja",
    solicitadoEm: "2026-04-03T08:00:00.000Z",
    enviadoEm: "2026-04-03T09:30:00.000Z",
    recebidoEm: "2026-04-03T11:10:00.000Z",
    observacao: "Reforço de copos térmicos para vitrine da loja.",
    itens: [
      {
        id: "tri-0101-1",
        produtoId: "prod-copo-termico",
        quantidade: 8,
        unidadeMedida: "UN",
      },
    ],
    criadoEm: "2026-04-03T08:00:00.000Z",
    atualizadoEm: "2026-04-03T11:10:00.000Z",
  },
  {
    id: "tr-2026-0102",
    codigo: "TR-2026-0102",
    status: "em_transito",
    depositoOrigemId: "dep-estoque",
    depositoDestinoId: "dep-loja",
    solicitadoEm: "2026-04-05T08:40:00.000Z",
    enviadoEm: "2026-04-05T09:15:00.000Z",
    observacao: "Reposição de nécessaires para montagem de kits na frente da loja.",
    itens: [
      {
        id: "tri-0102-1",
        produtoId: "prod-necessaire-estampada",
        quantidade: 5,
        unidadeMedida: "UN",
      },
    ],
    criadoEm: "2026-04-05T08:40:00.000Z",
    atualizadoEm: "2026-04-05T09:15:00.000Z",
  },
];
