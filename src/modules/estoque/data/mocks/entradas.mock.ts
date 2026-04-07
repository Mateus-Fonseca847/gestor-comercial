import type { EntradaMercadoria } from "@/modules/estoque/types";

export const entradasMercadoriaMock: EntradaMercadoria[] = [
  {
    id: "ent-2026-0101",
    numero: "ENT-2026-0101",
    status: "conferida",
    depositoId: "dep-estoque",
    fornecedorId: "for-casa-criativa",
    pedidoCompraId: "pc-2026-0101",
    recebidoEm: "2026-04-02T09:20:00.000Z",
    conferidoEm: "2026-04-02T10:10:00.000Z",
    documentoFiscal: {
      numero: "48219",
      serie: "1",
      chaveAcesso: "35260412345678000190550010000482191234567890",
    },
    observacao: "Recebimento integral dos copos térmicos sem divergências.",
    itens: [
      {
        id: "enti-0101-1",
        produtoId: "prod-copo-termico",
        quantidadeRecebida: 20,
        quantidadeConferida: 20,
        unidadeMedida: "UN",
        custoUnitario: { valor: 22.9, moeda: "BRL" },
      },
    ],
    criadoEm: "2026-04-02T09:20:00.000Z",
    atualizadoEm: "2026-04-02T10:10:00.000Z",
  },
  {
    id: "ent-2026-0102",
    numero: "ENT-2026-0102",
    status: "parcial",
    depositoId: "dep-conferencia",
    fornecedorId: "for-essenza",
    pedidoCompraId: "pc-2026-0102",
    recebidoEm: "2026-04-04T13:10:00.000Z",
    conferidoEm: "2026-04-04T14:00:00.000Z",
    documentoFiscal: {
      numero: "99102",
      serie: "3",
      chaveAcesso: "35260445222111000108550030000991021234567891",
    },
    observacao: "Metade do pedido recebida; duas unidades ficaram em conferência por avaria na tampa.",
    itens: [
      {
        id: "enti-0102-1",
        produtoId: "prod-body-splash",
        quantidadeRecebida: 12,
        quantidadeConferida: 10,
        unidadeMedida: "UN",
        custoUnitario: { valor: 16.5, moeda: "BRL" },
        lote: "VAN-0404-A",
        validadeEm: "2027-03-30T00:00:00.000Z",
      },
    ],
    criadoEm: "2026-04-04T13:10:00.000Z",
    atualizadoEm: "2026-04-04T14:00:00.000Z",
  },
];
