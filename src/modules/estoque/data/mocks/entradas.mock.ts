import type { EntradaMercadoria } from "@/modules/estoque/types";

export const entradasMercadoriaMock: EntradaMercadoria[] = [
  {
    id: "ent-2026-0012",
    numero: "ENT-2026-0012",
    status: "conferida",
    depositoId: "dep-central",
    fornecedorId: "for-office-plus",
    pedidoCompraId: "pc-2026-0035",
    recebidoEm: "2026-04-02T09:20:00.000Z",
    conferidoEm: "2026-04-02T10:10:00.000Z",
    documentoFiscal: {
      numero: "48219",
      serie: "1",
      chaveAcesso: "35260412345678000190550010000482191234567890",
    },
    observacao: "Recebimento integral sem divergências.",
    itens: [
      {
        id: "enti-0012-1",
        produtoId: "prod-papel-a4",
        quantidadeRecebida: 80,
        quantidadeConferida: 80,
        unidadeMedida: "CX",
        custoUnitario: { valor: 24.9, moeda: "BRL" },
      },
    ],
    criadoEm: "2026-04-02T09:20:00.000Z",
    atualizadoEm: "2026-04-02T10:10:00.000Z",
  },
  {
    id: "ent-2026-0013",
    numero: "ENT-2026-0013",
    status: "parcial",
    depositoId: "dep-quarentena",
    fornecedorId: "for-tech-supply",
    pedidoCompraId: "pc-2026-0039",
    recebidoEm: "2026-04-04T13:10:00.000Z",
    conferidoEm: "2026-04-04T14:00:00.000Z",
    documentoFiscal: {
      numero: "99102",
      serie: "3",
      chaveAcesso: "35260445222111000108550030000991021234567891",
    },
    observacao: "15 unidades recebidas; saldo pendente para próxima remessa.",
    itens: [
      {
        id: "enti-0013-1",
        produtoId: "prod-mouse-usb",
        quantidadeRecebida: 15,
        quantidadeConferida: 15,
        unidadeMedida: "UN",
        custoUnitario: { valor: 29.9, moeda: "BRL" },
        lote: "MOU-0404-A",
      },
    ],
    criadoEm: "2026-04-04T13:10:00.000Z",
    atualizadoEm: "2026-04-04T14:00:00.000Z",
  },
];
