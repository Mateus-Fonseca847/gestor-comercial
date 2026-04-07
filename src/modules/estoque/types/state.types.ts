import type { AlertaEstoque } from "@/modules/estoque/types/alerta-estoque.types";
import type { Categoria } from "@/modules/estoque/types/categoria.types";
import type { Deposito } from "@/modules/estoque/types/deposito.types";
import type { EntradaMercadoria } from "@/modules/estoque/types/entrada-mercadoria.types";
import type { Fornecedor } from "@/modules/estoque/types/fornecedor.types";
import type { Movimentacao } from "@/modules/estoque/types/movimentacao.types";
import type { PedidoCompra } from "@/modules/estoque/types/pedido-compra.types";
import type { Produto, ProdutoSaldo } from "@/modules/estoque/types/produto.types";
import type { Reserva } from "@/modules/estoque/types/reserva.types";
import type { EntityId, EntityMap } from "@/modules/estoque/types/shared.types";
import type { Transferencia } from "@/modules/estoque/types/transferencia.types";

export type LoadStatus = "idle" | "loading" | "success" | "error";

export type EntityCollectionState<T> = {
  byId: EntityMap<T>;
  allIds: EntityId[];
  status: LoadStatus;
  error?: string | null;
  lastSyncAt?: string;
};

export type EstoqueEntitiesState = {
  produtos: EntityCollectionState<Produto>;
  categorias: EntityCollectionState<Categoria>;
  fornecedores: EntityCollectionState<Fornecedor>;
  depositos: EntityCollectionState<Deposito>;
  movimentacoes: EntityCollectionState<Movimentacao>;
  reservas: EntityCollectionState<Reserva>;
  pedidosCompra: EntityCollectionState<PedidoCompra>;
  entradasMercadoria: EntityCollectionState<EntradaMercadoria>;
  transferencias: EntityCollectionState<Transferencia>;
  alertasEstoque: EntityCollectionState<AlertaEstoque>;
  saldosProduto: EntityCollectionState<ProdutoSaldo>;
};

export type EstoqueUIState = {
  produtoSelecionadoId?: EntityId;
  depositoSelecionadoId?: EntityId;
  filtrosAtivos: Record<string, string | number | boolean | undefined>;
};

export type EstoqueState = {
  entities: EstoqueEntitiesState;
  ui: EstoqueUIState;
};
