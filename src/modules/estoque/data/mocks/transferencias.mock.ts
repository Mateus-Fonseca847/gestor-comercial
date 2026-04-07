import type { Transferencia } from "@/modules/estoque/types";

export const transferenciasMock: Transferencia[] = [
  {
    id: "tr-2026-0008",
    codigo: "TR-2026-0008",
    status: "recebida",
    depositoOrigemId: "dep-central",
    depositoDestinoId: "dep-auxiliar",
    solicitadoEm: "2026-04-03T08:00:00.000Z",
    enviadoEm: "2026-04-03T09:30:00.000Z",
    recebidoEm: "2026-04-03T16:20:00.000Z",
    observacao: "Reforço de papel A4 para operação da filial.",
    itens: [
      {
        id: "tri-0008-1",
        produtoId: "prod-papel-a4",
        quantidade: 40,
        unidadeMedida: "CX",
      },
    ],
    criadoEm: "2026-04-03T08:00:00.000Z",
    atualizadoEm: "2026-04-03T16:20:00.000Z",
  },
  {
    id: "tr-2026-0009",
    codigo: "TR-2026-0009",
    status: "em_transito",
    depositoOrigemId: "dep-central",
    depositoDestinoId: "dep-auxiliar",
    solicitadoEm: "2026-04-05T08:40:00.000Z",
    enviadoEm: "2026-04-05T09:15:00.000Z",
    observacao: "Reposição de headsets para equipe comercial.",
    itens: [
      {
        id: "tri-0009-1",
        produtoId: "prod-headset-call",
        quantidade: 6,
        unidadeMedida: "UN",
      },
    ],
    criadoEm: "2026-04-05T08:40:00.000Z",
    atualizadoEm: "2026-04-05T09:15:00.000Z",
  },
];
