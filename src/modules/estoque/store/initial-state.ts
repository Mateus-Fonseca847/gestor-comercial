import {
  alertasEstoqueMock,
  categoriasMock,
  depositosMock,
  entradasMercadoriaMock,
  fornecedoresMock,
  movimentacoesMock,
  pedidosCompraMock,
  produtosMock,
  reservasMock,
  saldosProdutoMock,
  transferenciasMock,
} from "@/modules/estoque/data/mocks";
import type { EstoqueState } from "@/modules/estoque/types";
import { createEntityCollectionState, createEstoqueUIState } from "@/modules/estoque/store/helpers";

export function createInitialEstoqueState(): EstoqueState {
  return {
    entities: {
      produtos: createEntityCollectionState(produtosMock),
      categorias: createEntityCollectionState(categoriasMock),
      fornecedores: createEntityCollectionState(fornecedoresMock),
      depositos: createEntityCollectionState(depositosMock),
      movimentacoes: createEntityCollectionState(movimentacoesMock),
      reservas: createEntityCollectionState(reservasMock),
      pedidosCompra: createEntityCollectionState(pedidosCompraMock),
      entradasMercadoria: createEntityCollectionState(entradasMercadoriaMock),
      transferencias: createEntityCollectionState(transferenciasMock),
      alertasEstoque: createEntityCollectionState(alertasEstoqueMock),
      saldosProduto: createEntityCollectionState(saldosProdutoMock),
    },
    ui: createEstoqueUIState(),
  };
}
