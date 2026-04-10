import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  vendasPersistStorage,
  type PersistedVendasStore,
} from "@/modules/vendas/store/storage";
import type {
  DescontoTipo,
  SalvarVendaInput,
  VendaPagamento,
  VendaRegistro,
} from "@/modules/vendas/types";

type VendasStore = {
  vendas: VendaRegistro[];
  actions: {
    salvarRegistroComercial: (input: SalvarVendaInput) => string | null;
    salvarVendaRascunho: (input: Omit<SalvarVendaInput, "status">) => string | null;
    concluirVenda: (input: Omit<SalvarVendaInput, "status" | "canal">) => string | null;
    criarPedidoWhatsapp: (
      input: Omit<SalvarVendaInput, "status" | "canal">,
    ) => string | null;
  };
};

function createVendaId(prefix: "VEN" | "ONL") {
  return `${prefix}-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function calculateDiscountValue(
  subtotal: number,
  descontoTipo?: DescontoTipo,
  descontoValor?: number,
) {
  if (!descontoValor || descontoValor <= 0) {
    return 0;
  }

  if (descontoTipo === "percentual") {
    return Math.min(subtotal, subtotal * (descontoValor / 100));
  }

  return Math.min(subtotal, descontoValor);
}

function sanitizePagamento(pagamento?: VendaPagamento) {
  if (!pagamento) {
    return undefined;
  }

  return {
    formaPagamento: pagamento.formaPagamento,
    statusPagamento: pagamento.statusPagamento,
    valorPago:
      typeof pagamento.valorPago === "number" ? Math.max(pagamento.valorPago, 0) : undefined,
    troco: typeof pagamento.troco === "number" ? Math.max(pagamento.troco, 0) : undefined,
  };
}

function createVendaRegistro(input: SalvarVendaInput): VendaRegistro | null {
  if (!input.clienteNome.trim() || !input.itens.length) {
    return null;
  }

  const itens = input.itens
    .filter((item) => item.produtoId && item.quantidade > 0 && item.precoUnitario >= 0)
    .map((item, index) => ({
      id: `${item.produtoId}-${index + 1}`,
      produtoId: item.produtoId,
      nomeProduto: item.nomeProduto,
      sku: item.sku,
      quantidade: item.quantidade,
      precoUnitario: item.precoUnitario,
      subtotal: item.quantidade * item.precoUnitario,
    }));

  if (!itens.length) {
    return null;
  }

  const timestamp = new Date().toISOString();
  const subtotal = itens.reduce((total, item) => total + item.subtotal, 0);
  const descontoValorAplicado = calculateDiscountValue(
    subtotal,
    input.descontoTipo,
    input.descontoValor,
  );
  const acrescimoValor = Math.max(input.acrescimoValor ?? 0, 0);
  const freteValor = Math.max(input.freteValor ?? 0, 0);
  const totalFinal = Math.max(subtotal - descontoValorAplicado + acrescimoValor + freteValor, 0);

  return {
    id: createVendaId(input.canal === "online" ? "ONL" : "VEN"),
    canal: input.canal,
    status: input.status,
    clienteNome: input.clienteNome.trim(),
    clienteEmail: input.clienteEmail?.trim() || undefined,
    telefone: input.telefone?.trim() || undefined,
    depositoId: input.depositoId,
    dataVenda: input.dataVenda,
    horaVenda: input.horaVenda,
    observacao: input.observacao?.trim() || undefined,
    subtotal,
    descontoTipo: input.descontoTipo,
    descontoValor: descontoValorAplicado || undefined,
    acrescimoValor: acrescimoValor || undefined,
    freteValor: freteValor || undefined,
    totalFinal,
    pagamento: sanitizePagamento(input.pagamento),
    itens,
    criadoEm: timestamp,
    atualizadoEm: timestamp,
  };
}

export const useVendasStore = create<VendasStore>()(
  persist(
    (set) => ({
      vendas: [],
      actions: {
        salvarRegistroComercial: (input) => {
          const venda = createVendaRegistro(input);
          if (!venda) {
            return null;
          }
          set((state) => ({
            vendas: [venda, ...state.vendas],
          }));
          return venda.id;
        },
        salvarVendaRascunho: (input) => {
          const venda = createVendaRegistro({
            ...input,
            status: "rascunho",
          });

          if (!venda) {
            return null;
          }

          set((state) => ({
            vendas: [venda, ...state.vendas],
          }));

          return venda.id;
        },
        concluirVenda: (input) => {
          const venda = createVendaRegistro({
            ...input,
            canal: "loja_fisica",
            status: "concluida",
          });

          if (!venda) {
            return null;
          }

          set((state) => ({
            vendas: [venda, ...state.vendas],
          }));

          return venda.id;
        },
        criarPedidoWhatsapp: (input) => {
          const venda = createVendaRegistro({
            ...input,
            canal: "online",
            status: "aguardando_confirmacao",
          });

          if (!venda) {
            return null;
          }

          set((state) => ({
            vendas: [venda, ...state.vendas],
          }));

          return venda.id;
        },
      },
    }),
    {
      name: "gestor-comercial:vendas-store",
      storage: vendasPersistStorage,
      partialize: (state): PersistedVendasStore => ({
        vendas: state.vendas,
      }),
    },
  ),
);
