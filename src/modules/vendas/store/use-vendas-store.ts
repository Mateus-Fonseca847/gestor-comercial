import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  vendasPersistStorage,
  type PersistedVendasStore,
} from "@/modules/vendas/store/storage";
import type { SalvarVendaInput, VendaRegistro } from "@/modules/vendas/types";

type VendasStore = {
  vendas: VendaRegistro[];
  actions: {
    salvarVendaRascunho: (input: Omit<SalvarVendaInput, "status">) => string | null;
    concluirVenda: (input: Omit<SalvarVendaInput, "status" | "canal">) => string | null;
    criarPedidoWhatsapp: (
      input: Omit<SalvarVendaInput, "status" | "canal">,
    ) => string | null;
  };
};

function createVendaId(prefix: "VEN" | "WPP") {
  return `${prefix}-${Date.now().toString().slice(-6)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
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
      quantidade: item.quantidade,
      precoUnitario: item.precoUnitario,
      subtotal: item.quantidade * item.precoUnitario,
    }));

  if (!itens.length) {
    return null;
  }

  const timestamp = new Date().toISOString();

  return {
    id: createVendaId(input.canal === "whatsapp" ? "WPP" : "VEN"),
    canal: input.canal,
    status: input.status,
    clienteNome: input.clienteNome.trim(),
    telefone: input.telefone?.trim() || undefined,
    depositoId: input.depositoId,
    observacao: input.observacao?.trim() || undefined,
    subtotal: itens.reduce((total, item) => total + item.subtotal, 0),
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
        salvarVendaRascunho: (input) => {
          const venda = createVendaRegistro({
            ...input,
            canal: input.canal,
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
            canal: "loja",
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
            canal: "whatsapp",
            status: "pendente",
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

