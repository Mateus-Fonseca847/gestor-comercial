import type {
  EntityCollectionState,
  EntityId,
  EntityMap,
  EstoqueEntitiesState,
  EstoqueState,
  EstoqueUIState,
  Produto,
  ProdutoSaldo,
} from "@/modules/estoque/types";

type EntityWithId = {
  id: EntityId;
};

export function createEntityMap<T extends EntityWithId>(items: T[]): EntityMap<T> {
  return items.reduce<EntityMap<T>>((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
}

export function createEntityCollectionState<T extends EntityWithId>(
  items: T[],
): EntityCollectionState<T> {
  return {
    byId: createEntityMap(items),
    allIds: items.map((item) => item.id),
    status: "success",
    error: null,
  };
}

export function createEstoqueUIState(): EstoqueUIState {
  return {
    produtoSelecionadoId: undefined,
    depositoSelecionadoId: undefined,
    filtrosAtivos: {},
  };
}

export function cloneEntityCollectionState<T>(
  collection: EntityCollectionState<T>,
): EntityCollectionState<T> {
  return {
    ...collection,
    byId: { ...collection.byId },
    allIds: [...collection.allIds],
  };
}

export function cloneEntitiesState(
  entities: EstoqueEntitiesState,
): EstoqueEntitiesState {
  return {
    produtos: cloneEntityCollectionState(entities.produtos),
    categorias: cloneEntityCollectionState(entities.categorias),
    fornecedores: cloneEntityCollectionState(entities.fornecedores),
    depositos: cloneEntityCollectionState(entities.depositos),
    movimentacoes: cloneEntityCollectionState(entities.movimentacoes),
    reservas: cloneEntityCollectionState(entities.reservas),
    pedidosCompra: cloneEntityCollectionState(entities.pedidosCompra),
    entradasMercadoria: cloneEntityCollectionState(entities.entradasMercadoria),
    transferencias: cloneEntityCollectionState(entities.transferencias),
    alertasEstoque: cloneEntityCollectionState(entities.alertasEstoque),
    saldosProduto: cloneEntityCollectionState(entities.saldosProduto),
  };
}

export function cloneEstoqueState(state: EstoqueState): EstoqueState {
  return {
    entities: cloneEntitiesState(state.entities),
    ui: {
      ...state.ui,
      filtrosAtivos: { ...state.ui.filtrosAtivos },
    },
  };
}

export function createTimestamp(): string {
  return new Date().toISOString();
}

export function createStoreEntityId(prefix: string): EntityId {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function upsertCollectionEntity<T extends EntityWithId>(
  collection: EntityCollectionState<T>,
  entity: T,
): EntityCollectionState<T> {
  const exists = collection.allIds.includes(entity.id);

  return {
    ...collection,
    byId: {
      ...collection.byId,
      [entity.id]: entity,
    },
    allIds: exists ? collection.allIds : [...collection.allIds, entity.id],
  };
}

export function removeCollectionEntity<T extends EntityWithId>(
  collection: EntityCollectionState<T>,
  entityId: EntityId,
): EntityCollectionState<T> {
  if (!collection.byId[entityId]) {
    return collection;
  }

  const nextById = { ...collection.byId };
  delete nextById[entityId];

  return {
    ...collection,
    byId: nextById,
    allIds: collection.allIds.filter((id) => id !== entityId),
  };
}

export function getOrCreateSaldo(
  saldos: EntityCollectionState<ProdutoSaldo>,
  produto: Produto,
  depositoId: EntityId,
): ProdutoSaldo {
  const existing = Object.values(saldos.byId).find(
    (saldo) =>
      saldo.produtoId === produto.id && saldo.depositoId === depositoId,
  );

  if (existing) {
    return existing;
  }

  return {
    id: createStoreEntityId("saldo"),
    produtoId: produto.id,
    depositoId,
    quantidadeDisponivel: 0,
    quantidadeReservada: 0,
    quantidadeFisica: 0,
    estoqueMinimo: produto.estoqueMinimo,
  };
}
