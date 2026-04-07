import type { StateCreator } from "zustand";
import {
  calcularStatusProduto,
  calcularValorTotalEmEstoque,
  recalcularAlertas,
  type ProdutoEstoqueStatus,
} from "@/modules/estoque/helpers";
import { createInitialEstoqueState } from "@/modules/estoque/store/initial-state";
import {
  createEntityCollectionState,
  createStoreEntityId,
  createTimestamp,
  getOrCreateSaldo,
  removeCollectionEntity,
  upsertCollectionEntity,
} from "@/modules/estoque/store/helpers";
import type {
  AlertaEstoque,
  Categoria,
  Deposito,
  EntradaMercadoria,
  EntityCollectionState,
  EntityId,
  EstoqueEntitiesState,
  EstoqueState,
  Fornecedor,
  Movimentacao,
  PedidoCompra,
  Produto,
  ProdutoSaldo,
  Reserva,
  Transferencia,
} from "@/modules/estoque/types";

type CollectionKey = keyof EstoqueEntitiesState;

type CollectionEntityMap = {
  produtos: Produto;
  categorias: Categoria;
  fornecedores: Fornecedor;
  depositos: Deposito;
  movimentacoes: Movimentacao;
  reservas: Reserva;
  pedidosCompra: PedidoCompra;
  entradasMercadoria: EntradaMercadoria;
  transferencias: Transferencia;
  alertasEstoque: AlertaEstoque;
  saldosProduto: ProdutoSaldo;
};

type NewProdutoInput = Omit<Produto, "id" | "criadoEm" | "atualizadoEm"> & {
  id?: EntityId;
};

type UpdateProdutoInput = Partial<Omit<Produto, "id" | "criadoEm" | "atualizadoEm">>;

type NewCategoriaInput = Omit<Categoria, "id" | "codigo" | "criadoEm" | "atualizadoEm"> & {
  id?: EntityId;
  codigo?: string;
};

type UpdateCategoriaInput = Partial<
  Omit<Categoria, "id" | "codigo" | "criadoEm" | "atualizadoEm">
>;

type NewFornecedorInput = Omit<Fornecedor, "id" | "criadoEm" | "atualizadoEm"> & {
  id?: EntityId;
};

type UpdateFornecedorInput = Partial<
  Omit<Fornecedor, "id" | "criadoEm" | "atualizadoEm">
>;

type NewDepositoInput = Omit<Deposito, "id" | "criadoEm" | "atualizadoEm"> & {
  id?: EntityId;
};

type UpdateDepositoInput = Partial<
  Omit<Deposito, "id" | "criadoEm" | "atualizadoEm">
>;

type RegistrarMovimentacaoInput = Omit<
  Movimentacao,
  "id" | "criadoEm" | "atualizadoEm"
> & {
  id?: EntityId;
};

type ReservarEstoqueInput = Omit<
  Reserva,
  "id" | "criadoEm" | "atualizadoEm" | "status" | "quantidadeAtendida" | "reservadaEm"
> & {
  id?: EntityId;
};

type LiberarReservaInput = {
  reservaId: EntityId;
  quantidade?: number;
  observacao?: string;
};

type AjustarEstoqueInput = {
  produtoId: EntityId;
  depositoId: EntityId;
  quantidadeAjustada: number;
  dataMovimentacao: string;
  motivo: string;
  observacao?: string;
};

type CriarTransferenciaInput = {
  produtoId: EntityId;
  depositoOrigemId: EntityId;
  depositoDestinoId: EntityId;
  quantidade: number;
  dataSolicitacao: string;
  observacao?: string;
};

type CriarPedidoCompraInput = {
  fornecedorId: EntityId;
  emitidoEm: string;
  status: PedidoCompra["status"];
  observacao?: string;
  itens: Array<{
    produtoId: EntityId;
    quantidadeSolicitada: number;
    custoUnitario: number;
  }>;
};

type RegistrarEntradaMercadoriaInput = {
  fornecedorId?: EntityId;
  pedidoCompraId?: EntityId;
  produtoId: EntityId;
  depositoId: EntityId;
  quantidade: number;
  dataRecebimento: string;
  observacao?: string;
};

export type EstoqueActions = {
  resetStore: () => void;
  setProdutoSelecionado: (produtoId?: EntityId) => void;
  setDepositoSelecionado: (depositoId?: EntityId) => void;
  setFiltroAtivo: (key: string, value?: string | number | boolean) => void;
  clearFiltros: () => void;
  replaceCollection: <K extends CollectionKey>(
    key: K,
    collection: EntityCollectionState<CollectionEntityMap[K]>,
  ) => void;
  upsertEntity: <K extends CollectionKey>(
    key: K,
    entity: CollectionEntityMap[K],
  ) => void;
  removeEntity: <K extends CollectionKey>(key: K, entityId: EntityId) => void;
  adicionarCategoria: (input: NewCategoriaInput) => EntityId;
  editarCategoria: (categoriaId: EntityId, changes: UpdateCategoriaInput) => void;
  desativarCategoria: (categoriaId: EntityId) => void;
  adicionarProduto: (input: NewProdutoInput) => EntityId;
  editarProduto: (produtoId: EntityId, changes: UpdateProdutoInput) => void;
  duplicarProduto: (
    produtoId: EntityId,
    overrides?: UpdateProdutoInput,
  ) => EntityId | null;
  desativarProduto: (produtoId: EntityId) => void;
  adicionarFornecedor: (input: NewFornecedorInput) => EntityId;
  editarFornecedor: (fornecedorId: EntityId, changes: UpdateFornecedorInput) => void;
  desativarFornecedor: (fornecedorId: EntityId) => void;
  adicionarDeposito: (input: NewDepositoInput) => EntityId;
  editarDeposito: (depositoId: EntityId, changes: UpdateDepositoInput) => void;
  desativarDeposito: (depositoId: EntityId) => void;
  criarPedidoCompra: (input: CriarPedidoCompraInput) => EntityId | null;
  atualizarStatusPedidoCompra: (
    pedidoCompraId: EntityId,
    status: PedidoCompra["status"],
  ) => boolean;
  registrarEntradaMercadoria: (
    input: RegistrarEntradaMercadoriaInput,
  ) => EntityId | null;
  criarTransferencia: (input: CriarTransferenciaInput) => EntityId | null;
  concluirTransferencia: (transferenciaId: EntityId) => boolean;
  registrarMovimentacao: (input: RegistrarMovimentacaoInput) => EntityId;
  ajustarEstoque: (input: AjustarEstoqueInput) => EntityId | null;
  reservarEstoque: (input: ReservarEstoqueInput) => EntityId | null;
  liberarReserva: (input: LiberarReservaInput) => void;
  consultarStatusProduto: (produtoId: EntityId) => ProdutoEstoqueStatus | null;
  consultarValorTotalEstoque: () => number;
  sincronizarAlertas: () => void;
};

export type EstoqueStore = EstoqueState & {
  actions: EstoqueActions;
};

function createCategoriaCodigo(nome: string): string {
  const normalized = nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "CATEGORIA";
}

function buildAlertasCollection(
  produtos: EntityCollectionState<Produto>,
  saldos: EntityCollectionState<ProdutoSaldo>,
): EntityCollectionState<AlertaEstoque> {
  return createEntityCollectionState(
    recalcularAlertas({
      produtos: Object.values(produtos.byId),
      saldos: Object.values(saldos.byId),
    }),
  );
}

function calcularStatusPedidoCompraRecebimento(
  itens: PedidoCompra["itens"],
): PedidoCompra["status"] {
  const totalSolicitado = itens.reduce((total, item) => total + item.quantidadeSolicitada, 0);
  const totalRecebido = itens.reduce((total, item) => total + item.quantidadeRecebida, 0);

  if (totalRecebido <= 0) {
    return "enviado";
  }

  if (totalRecebido >= totalSolicitado) {
    return "recebido";
  }

  return "parcial";
}

function applyMovimentacaoToSaldos(
  saldos: EntityCollectionState<ProdutoSaldo>,
  produtos: EntityCollectionState<Produto>,
  movimentacao: Movimentacao,
): EntityCollectionState<ProdutoSaldo> {
  if (movimentacao.status !== "confirmada") {
    return saldos;
  }

  const produto = produtos.byId[movimentacao.produtoId];

  if (!produto) {
    return saldos;
  }

  let nextSaldos = saldos;

  const upsertSaldo = (saldo: ProdutoSaldo) => {
    nextSaldos = upsertCollectionEntity(nextSaldos, saldo);
  };

  if (movimentacao.tipo === "entrada" && movimentacao.depositoDestinoId) {
    const saldo = getOrCreateSaldo(nextSaldos, produto, movimentacao.depositoDestinoId);
    upsertSaldo({
      ...saldo,
      quantidadeDisponivel: saldo.quantidadeDisponivel + movimentacao.quantidade,
      quantidadeFisica: saldo.quantidadeFisica + movimentacao.quantidade,
    });
  }

  if (movimentacao.tipo === "saida" && movimentacao.depositoOrigemId) {
    const saldo = getOrCreateSaldo(nextSaldos, produto, movimentacao.depositoOrigemId);
    upsertSaldo({
      ...saldo,
      quantidadeDisponivel: Math.max(0, saldo.quantidadeDisponivel - movimentacao.quantidade),
      quantidadeFisica: Math.max(0, saldo.quantidadeFisica - movimentacao.quantidade),
    });
  }

  if (
    movimentacao.tipo === "transferencia" &&
    movimentacao.depositoOrigemId &&
    movimentacao.depositoDestinoId
  ) {
    const saldoOrigem = getOrCreateSaldo(nextSaldos, produto, movimentacao.depositoOrigemId);
    const saldoDestino = getOrCreateSaldo(nextSaldos, produto, movimentacao.depositoDestinoId);

    upsertSaldo({
      ...saldoOrigem,
      quantidadeDisponivel: Math.max(0, saldoOrigem.quantidadeDisponivel - movimentacao.quantidade),
      quantidadeFisica: Math.max(0, saldoOrigem.quantidadeFisica - movimentacao.quantidade),
    });
    upsertSaldo({
      ...saldoDestino,
      quantidadeDisponivel: saldoDestino.quantidadeDisponivel + movimentacao.quantidade,
      quantidadeFisica: saldoDestino.quantidadeFisica + movimentacao.quantidade,
    });
  }

  if (movimentacao.tipo === "reserva" && movimentacao.depositoOrigemId) {
    const saldo = getOrCreateSaldo(nextSaldos, produto, movimentacao.depositoOrigemId);
    upsertSaldo({
      ...saldo,
      quantidadeDisponivel: Math.max(0, saldo.quantidadeDisponivel - movimentacao.quantidade),
      quantidadeReservada: saldo.quantidadeReservada + movimentacao.quantidade,
    });
  }

  if (movimentacao.tipo === "liberacao_reserva" && movimentacao.depositoOrigemId) {
    const saldo = getOrCreateSaldo(nextSaldos, produto, movimentacao.depositoOrigemId);
    upsertSaldo({
      ...saldo,
      quantidadeDisponivel: saldo.quantidadeDisponivel + movimentacao.quantidade,
      quantidadeReservada: Math.max(0, saldo.quantidadeReservada - movimentacao.quantidade),
    });
  }

  return nextSaldos;
}

export const createEstoqueActions: StateCreator<
  EstoqueStore,
  [],
  [],
  Pick<EstoqueStore, "actions">
> = (set, get) => ({
  actions: {
    resetStore: () => set(() => createInitialEstoqueState()),
    setProdutoSelecionado: (produtoId) =>
      set((state) => ({
        ...state,
        ui: {
          ...state.ui,
          produtoSelecionadoId: produtoId,
        },
      })),
    setDepositoSelecionado: (depositoId) =>
      set((state) => ({
        ...state,
        ui: {
          ...state.ui,
          depositoSelecionadoId: depositoId,
        },
      })),
    setFiltroAtivo: (key, value) =>
      set((state) => {
        const filtrosAtivos = { ...state.ui.filtrosAtivos };

        if (value === undefined) {
          delete filtrosAtivos[key];
        } else {
          filtrosAtivos[key] = value;
        }

        return {
          ...state,
          ui: {
            ...state.ui,
            filtrosAtivos,
          },
        };
      }),
    clearFiltros: () =>
      set((state) => ({
        ...state,
        ui: {
          ...state.ui,
          filtrosAtivos: {},
        },
      })),
    replaceCollection: (key, collection) =>
      set((state) => ({
        ...state,
        entities: {
          ...state.entities,
          [key]: {
            ...collection,
            byId: { ...collection.byId },
            allIds: [...collection.allIds],
          },
        },
      })),
    upsertEntity: (key, entity) =>
      set((state) => ({
        ...state,
        entities: {
          ...state.entities,
          [key]: upsertCollectionEntity(
            state.entities[key] as EntityCollectionState<CollectionEntityMap[typeof key]>,
            entity,
          ),
        },
      })),
    removeEntity: (key, entityId) =>
      set((state) => ({
        ...state,
        entities: {
          ...state.entities,
          [key]: removeCollectionEntity(
            state.entities[key] as EntityCollectionState<CollectionEntityMap[typeof key]>,
            entityId,
          ),
        },
      })),
    adicionarCategoria: (input) => {
      const timestamp = createTimestamp();
      const categoriaId = input.id ?? createStoreEntityId("cat");
      const categoria: Categoria = {
        ...input,
        id: categoriaId,
        codigo: input.codigo ?? createCategoriaCodigo(input.nome),
        criadoEm: timestamp,
        atualizadoEm: timestamp,
      };

      set((state) => ({
        ...state,
        entities: {
          ...state.entities,
          categorias: upsertCollectionEntity(state.entities.categorias, categoria),
        },
      }));

      return categoriaId;
    },
    editarCategoria: (categoriaId, changes) =>
      set((state) => {
        const categoriaAtual = state.entities.categorias.byId[categoriaId];

        if (!categoriaAtual) {
          return state;
        }

        return {
          ...state,
          entities: {
            ...state.entities,
            categorias: upsertCollectionEntity(state.entities.categorias, {
              ...categoriaAtual,
              ...changes,
              id: categoriaAtual.id,
              codigo: categoriaAtual.codigo,
              criadoEm: categoriaAtual.criadoEm,
              atualizadoEm: createTimestamp(),
            }),
          },
        };
      }),
    desativarCategoria: (categoriaId) =>
      set((state) => {
        const categoriaAtual = state.entities.categorias.byId[categoriaId];

        if (!categoriaAtual || categoriaAtual.status === "inativa") {
          return state;
        }

        return {
          ...state,
          entities: {
            ...state.entities,
            categorias: upsertCollectionEntity(state.entities.categorias, {
              ...categoriaAtual,
              status: "inativa",
              atualizadoEm: createTimestamp(),
            }),
          },
        };
      }),
    adicionarProduto: (input) => {
      const timestamp = createTimestamp();
      const produtoId = input.id ?? createStoreEntityId("prod");
      const produto: Produto = {
        ...input,
        id: produtoId,
        status: input.status ?? "ativo",
        ativo: input.ativo ?? true,
        criadoEm: timestamp,
        atualizadoEm: timestamp,
      };

      set((state) => ({
        ...state,
        entities: {
          ...state.entities,
          produtos: upsertCollectionEntity(state.entities.produtos, produto),
        },
      }));

      return produtoId;
    },
    editarProduto: (produtoId, changes) =>
      set((state) => {
        const produtoAtual = state.entities.produtos.byId[produtoId];

        if (!produtoAtual) {
          return state;
        }

        const produtos = upsertCollectionEntity(state.entities.produtos, {
          ...produtoAtual,
          ...changes,
          id: produtoAtual.id,
          criadoEm: produtoAtual.criadoEm,
          atualizadoEm: createTimestamp(),
        });

        return {
          ...state,
          entities: {
            ...state.entities,
            produtos,
            alertasEstoque: buildAlertasCollection(
              produtos,
              state.entities.saldosProduto,
            ),
          },
        };
      }),
    duplicarProduto: (produtoId, overrides) => {
      const produtoAtual = get().entities.produtos.byId[produtoId];

      if (!produtoAtual) {
        return null;
      }

      const timestamp = createTimestamp();
      const novoProdutoId = createStoreEntityId("prod");

      set((state) => ({
        ...state,
        entities: {
          ...state.entities,
          produtos: upsertCollectionEntity(state.entities.produtos, {
            ...produtoAtual,
            ...overrides,
            id: novoProdutoId,
            codigoInterno:
              overrides?.codigoInterno ?? `${produtoAtual.codigoInterno}-COPY`,
            sku: overrides?.sku ?? `${produtoAtual.sku}-COPY`,
            nome: overrides?.nome ?? `${produtoAtual.nome} (Cópia)`,
            criadoEm: timestamp,
            atualizadoEm: timestamp,
          }),
        },
      }));

      return novoProdutoId;
    },
    desativarProduto: (produtoId) =>
      set((state) => {
        const produtoAtual = state.entities.produtos.byId[produtoId];

        if (!produtoAtual) {
          return state;
        }

        const produtos = upsertCollectionEntity(state.entities.produtos, {
          ...produtoAtual,
          ativo: false,
          status: "inativo",
          atualizadoEm: createTimestamp(),
        });

        return {
          ...state,
          entities: {
            ...state.entities,
            produtos,
            alertasEstoque: buildAlertasCollection(
              produtos,
              state.entities.saldosProduto,
            ),
          },
        };
      }),
    adicionarFornecedor: (input) => {
      const timestamp = createTimestamp();
      const fornecedorId = input.id ?? createStoreEntityId("for");

      set((state) => ({
        ...state,
        entities: {
          ...state.entities,
          fornecedores: upsertCollectionEntity(state.entities.fornecedores, {
            ...input,
            id: fornecedorId,
            criadoEm: timestamp,
            atualizadoEm: timestamp,
          }),
        },
      }));

      return fornecedorId;
    },
    editarFornecedor: (fornecedorId, changes) =>
      set((state) => {
        const fornecedorAtual = state.entities.fornecedores.byId[fornecedorId];

        if (!fornecedorAtual) {
          return state;
        }

        return {
          ...state,
          entities: {
            ...state.entities,
            fornecedores: upsertCollectionEntity(state.entities.fornecedores, {
              ...fornecedorAtual,
              ...changes,
              id: fornecedorAtual.id,
              criadoEm: fornecedorAtual.criadoEm,
              atualizadoEm: createTimestamp(),
            }),
          },
        };
      }),
    desativarFornecedor: (fornecedorId) =>
      set((state) => {
        const fornecedorAtual = state.entities.fornecedores.byId[fornecedorId];

        if (!fornecedorAtual || fornecedorAtual.status === "inativo") {
          return state;
        }

        return {
          ...state,
          entities: {
            ...state.entities,
            fornecedores: upsertCollectionEntity(state.entities.fornecedores, {
              ...fornecedorAtual,
              status: "inativo",
              atualizadoEm: createTimestamp(),
            }),
          },
        };
      }),
    adicionarDeposito: (input) => {
      const timestamp = createTimestamp();
      const depositoId = input.id ?? createStoreEntityId("dep");

      set((state) => ({
        ...state,
        entities: {
          ...state.entities,
          depositos: upsertCollectionEntity(state.entities.depositos, {
            ...input,
            id: depositoId,
            criadoEm: timestamp,
            atualizadoEm: timestamp,
          }),
        },
      }));

      return depositoId;
    },
    editarDeposito: (depositoId, changes) =>
      set((state) => {
        const depositoAtual = state.entities.depositos.byId[depositoId];

        if (!depositoAtual) {
          return state;
        }

        return {
          ...state,
          entities: {
            ...state.entities,
            depositos: upsertCollectionEntity(state.entities.depositos, {
              ...depositoAtual,
              ...changes,
              id: depositoAtual.id,
              criadoEm: depositoAtual.criadoEm,
              atualizadoEm: createTimestamp(),
            }),
          },
          };
        }),
    desativarDeposito: (depositoId) =>
      set((state) => {
        const depositoAtual = state.entities.depositos.byId[depositoId];

        if (!depositoAtual || depositoAtual.status === "inativo") {
          return state;
        }

        return {
          ...state,
          entities: {
            ...state.entities,
            depositos: upsertCollectionEntity(state.entities.depositos, {
              ...depositoAtual,
              status: "inativo",
              permiteMovimentacao: false,
              atualizadoEm: createTimestamp(),
            }),
          },
        };
      }),
    criarPedidoCompra: (input) => {
      const state = get();
      const fornecedor = state.entities.fornecedores.byId[input.fornecedorId];

      if (!fornecedor || !input.itens.length) {
        return null;
      }

      const timestamp = createTimestamp();
      const pedidoId = createStoreEntityId("pc");
      const itens = input.itens
        .map((item) => {
          const produto = state.entities.produtos.byId[item.produtoId];

          if (!produto || item.quantidadeSolicitada <= 0 || item.custoUnitario < 0) {
            return null;
          }

          return {
            id: createStoreEntityId("pci"),
            produtoId: item.produtoId,
            quantidadeSolicitada: item.quantidadeSolicitada,
            quantidadeRecebida: 0,
            unidadeMedida: produto.unidadeMedida,
            custoUnitario: {
              valor: item.custoUnitario,
              moeda: "BRL" as const,
            },
          };
        })
        .filter((item): item is PedidoCompra["itens"][number] => Boolean(item));

      if (!itens.length) {
        return null;
      }

      const valorTotal = itens.reduce(
        (total, item) => total + item.quantidadeSolicitada * item.custoUnitario.valor,
        0,
      );

      const pedidoCompra: PedidoCompra = {
        id: pedidoId,
        numero: `PC-${Date.now().toString().slice(-6)}`,
        fornecedorId: input.fornecedorId,
        status: input.status,
        emitidoEm: input.emitidoEm,
        observacao: input.observacao,
        itens,
        valorTotal: {
          valor: valorTotal,
          moeda: "BRL",
        },
        criadoEm: timestamp,
        atualizadoEm: timestamp,
      };

      set((current) => ({
        ...current,
        entities: {
          ...current.entities,
          pedidosCompra: upsertCollectionEntity(current.entities.pedidosCompra, pedidoCompra),
        },
      }));

      return pedidoId;
    },
    atualizarStatusPedidoCompra: (pedidoCompraId, status) => {
      const state = get();
      const pedidoAtual = state.entities.pedidosCompra.byId[pedidoCompraId];

      if (!pedidoAtual || pedidoAtual.status === status) {
        return false;
      }

      set((current) => ({
        ...current,
        entities: {
          ...current.entities,
          pedidosCompra: upsertCollectionEntity(current.entities.pedidosCompra, {
            ...pedidoAtual,
            status,
            atualizadoEm: createTimestamp(),
          }),
        },
      }));

      return true;
    },
    registrarEntradaMercadoria: (input) => {
      const state = get();
      const produto = state.entities.produtos.byId[input.produtoId];

      if (!produto || input.quantidade <= 0) {
        return null;
      }

      const pedidoCompra = input.pedidoCompraId
        ? state.entities.pedidosCompra.byId[input.pedidoCompraId]
        : undefined;
      const itemPedido = pedidoCompra?.itens.find((item) => item.produtoId === input.produtoId);

      const timestamp = createTimestamp();
      const entradaId = createStoreEntityId("ent");
      const movimentacaoId = createStoreEntityId("mov");
      const entrada: EntradaMercadoria = {
        id: entradaId,
        numero: `ENT-${Date.now().toString().slice(-6)}`,
        status: "conferida",
        depositoId: input.depositoId,
        fornecedorId: input.fornecedorId ?? pedidoCompra?.fornecedorId,
        pedidoCompraId: input.pedidoCompraId,
        recebidoEm: input.dataRecebimento,
        conferidoEm: input.dataRecebimento,
        observacao: input.observacao,
        itens: [
          {
            id: createStoreEntityId("enti"),
            produtoId: input.produtoId,
            quantidadeRecebida: input.quantidade,
            quantidadeConferida: input.quantidade,
            unidadeMedida: produto.unidadeMedida,
            custoUnitario: produto.precoCusto,
          },
        ],
        criadoEm: timestamp,
        atualizadoEm: timestamp,
      };
      const movimentacao: Movimentacao = {
        id: movimentacaoId,
        tipo: "entrada",
        status: "confirmada",
        origemTipo: "entrada_mercadoria",
        origemId: entradaId,
        produtoId: input.produtoId,
        depositoDestinoId: input.depositoId,
        quantidade: input.quantidade,
        unidadeMedida: produto.unidadeMedida,
        custoUnitario: produto.precoCusto,
        dataMovimentacao: input.dataRecebimento,
        observacao: input.observacao,
        criadoEm: timestamp,
        atualizadoEm: timestamp,
      };

        set((current) => {
          const saldosProduto = applyMovimentacaoToSaldos(
            current.entities.saldosProduto,
            current.entities.produtos,
            movimentacao,
          );
          const pedidosCompra = pedidoCompra
            ? upsertCollectionEntity(current.entities.pedidosCompra, {
                ...pedidoCompra,
                itens: pedidoCompra.itens.map((item) => {
                  if (item.id !== itemPedido?.id) {
                    return item;
                  }

                  return {
                    ...item,
                    quantidadeRecebida: Math.min(
                      item.quantidadeSolicitada,
                      item.quantidadeRecebida + input.quantidade,
                    ),
                  };
                }),
                status: calcularStatusPedidoCompraRecebimento(
                  pedidoCompra.itens.map((item) => {
                    if (item.id !== itemPedido?.id) {
                      return item;
                    }

                    return {
                      ...item,
                      quantidadeRecebida: Math.min(
                        item.quantidadeSolicitada,
                        item.quantidadeRecebida + input.quantidade,
                      ),
                    };
                  }),
                ),
                atualizadoEm: timestamp,
              })
            : current.entities.pedidosCompra;

          return {
            ...current,
            entities: {
              ...current.entities,
            entradasMercadoria: upsertCollectionEntity(
                current.entities.entradasMercadoria,
                entrada,
              ),
              movimentacoes: upsertCollectionEntity(current.entities.movimentacoes, movimentacao),
              pedidosCompra,
              saldosProduto,
              alertasEstoque: buildAlertasCollection(current.entities.produtos, saldosProduto),
            },
          };
        });

      return entradaId;
    },
    criarTransferencia: (input) => {
      const state = get();
      const produto = state.entities.produtos.byId[input.produtoId];

      if (
        !produto ||
        input.quantidade <= 0 ||
        input.depositoOrigemId === input.depositoDestinoId
      ) {
        return null;
      }

      const saldoOrigem = getOrCreateSaldo(
        state.entities.saldosProduto,
        produto,
        input.depositoOrigemId,
      );

      if (saldoOrigem.quantidadeDisponivel < input.quantidade) {
        return null;
      }

      const timestamp = createTimestamp();
      const transferenciaId = createStoreEntityId("trf");
      const itemId = createStoreEntityId("trf-item");
      const transferencia: Transferencia = {
        id: transferenciaId,
        codigo: `TRF-${Date.now().toString().slice(-6)}`,
        status: "pendente",
        depositoOrigemId: input.depositoOrigemId,
        depositoDestinoId: input.depositoDestinoId,
        solicitadoEm: input.dataSolicitacao,
        observacao: input.observacao,
        itens: [
          {
            id: itemId,
            produtoId: input.produtoId,
            quantidade: input.quantidade,
            unidadeMedida: produto.unidadeMedida,
          },
        ],
        criadoEm: timestamp,
        atualizadoEm: timestamp,
      };

      set((currentState) => ({
        ...currentState,
        entities: {
          ...currentState.entities,
          transferencias: upsertCollectionEntity(
            currentState.entities.transferencias,
            transferencia,
          ),
        },
      }));

      return transferenciaId;
    },
    concluirTransferencia: (transferenciaId) => {
      const state = get();
      const transferenciaAtual = state.entities.transferencias.byId[transferenciaId];

      if (
        !transferenciaAtual ||
        transferenciaAtual.status === "recebida" ||
        transferenciaAtual.status === "cancelada"
      ) {
        return false;
      }

      const item = transferenciaAtual.itens[0];
      const produto = item ? state.entities.produtos.byId[item.produtoId] : undefined;

      if (!item || !produto) {
        return false;
      }

      const saldoOrigem = getOrCreateSaldo(
        state.entities.saldosProduto,
        produto,
        transferenciaAtual.depositoOrigemId,
      );

      if (saldoOrigem.quantidadeDisponivel < item.quantidade) {
        return false;
      }

      const timestamp = createTimestamp();
      const movimentacao: Movimentacao = {
        id: createStoreEntityId("mov"),
        tipo: "transferencia",
        status: "confirmada",
        origemTipo: "transferencia",
        origemId: transferenciaAtual.id,
        produtoId: item.produtoId,
        variacaoId: item.variacaoId,
        depositoOrigemId: transferenciaAtual.depositoOrigemId,
        depositoDestinoId: transferenciaAtual.depositoDestinoId,
        quantidade: item.quantidade,
        unidadeMedida: item.unidadeMedida,
        dataMovimentacao: timestamp,
        observacao: transferenciaAtual.observacao,
        criadoEm: timestamp,
        atualizadoEm: timestamp,
      };

      set((current) => {
        const saldosProduto = applyMovimentacaoToSaldos(
          current.entities.saldosProduto,
          current.entities.produtos,
          movimentacao,
        );

        return {
          ...current,
          entities: {
            ...current.entities,
            transferencias: upsertCollectionEntity(current.entities.transferencias, {
              ...transferenciaAtual,
              status: "recebida",
              enviadoEm: transferenciaAtual.enviadoEm ?? timestamp,
              recebidoEm: timestamp,
              atualizadoEm: timestamp,
            }),
            movimentacoes: upsertCollectionEntity(current.entities.movimentacoes, movimentacao),
            saldosProduto,
            alertasEstoque: buildAlertasCollection(current.entities.produtos, saldosProduto),
          },
        };
      });

      return true;
    },
    registrarMovimentacao: (input) => {
      const timestamp = createTimestamp();
      const movimentacaoId = input.id ?? createStoreEntityId("mov");
      const movimentacao: Movimentacao = {
        ...input,
        id: movimentacaoId,
        criadoEm: timestamp,
        atualizadoEm: timestamp,
      };
      set((state) => {
        const saldosProduto = applyMovimentacaoToSaldos(
          state.entities.saldosProduto,
          state.entities.produtos,
          movimentacao,
        );

        return {
          ...state,
          entities: {
            ...state.entities,
            movimentacoes: upsertCollectionEntity(
              state.entities.movimentacoes,
              movimentacao,
            ),
            saldosProduto,
            alertasEstoque: buildAlertasCollection(
              state.entities.produtos,
              saldosProduto,
            ),
          },
        };
      });

      return movimentacaoId;
    },
    ajustarEstoque: (input) => {
      const state = get();
      const produto = state.entities.produtos.byId[input.produtoId];

      if (!produto || input.quantidadeAjustada < 0) {
        return null;
      }

      const saldoAtual = getOrCreateSaldo(
        state.entities.saldosProduto,
        produto,
        input.depositoId,
      );
      const quantidadeReservada = saldoAtual.quantidadeReservada;
      const quantidadeFisica = input.quantidadeAjustada;
      const quantidadeDisponivel = Math.max(quantidadeFisica - quantidadeReservada, 0);
      const quantidadeMovimentada = Math.abs(quantidadeFisica - saldoAtual.quantidadeFisica);
      const timestamp = createTimestamp();
      const movimentacaoId = createStoreEntityId("mov");
      const movimentacao: Movimentacao = {
        id: movimentacaoId,
        tipo: "ajuste",
        status: "confirmada",
        origemTipo: "inventario",
        produtoId: input.produtoId,
        depositoOrigemId: input.depositoId,
        quantidade: quantidadeMovimentada,
        unidadeMedida: produto.unidadeMedida,
        dataMovimentacao: input.dataMovimentacao,
        observacao: `Motivo: ${input.motivo}${input.observacao ? ` | ${input.observacao}` : ""}`,
        criadoEm: timestamp,
        atualizadoEm: timestamp,
      };

      set((current) => {
        const saldosProduto = upsertCollectionEntity(current.entities.saldosProduto, {
          ...saldoAtual,
          quantidadeDisponivel,
          quantidadeFisica,
          estoqueMinimo: saldoAtual.estoqueMinimo ?? produto.estoqueMinimo,
        });

        return {
          ...current,
          entities: {
            ...current.entities,
            movimentacoes: upsertCollectionEntity(current.entities.movimentacoes, movimentacao),
            saldosProduto,
            alertasEstoque: buildAlertasCollection(current.entities.produtos, saldosProduto),
          },
        };
      });

      return movimentacaoId;
    },
    reservarEstoque: (input) => {
      const state = get();
      const produto = state.entities.produtos.byId[input.produtoId];

      if (!produto) {
        return null;
      }

      const saldo = Object.values(state.entities.saldosProduto.byId).find(
        (item) =>
          item.produtoId === input.produtoId &&
          item.depositoId === input.depositoId,
      );

      if (!saldo || saldo.quantidadeDisponivel < input.quantidadeReservada) {
        return null;
      }

      const timestamp = createTimestamp();
      const reservaId = input.id ?? createStoreEntityId("res");
      const reserva: Reserva = {
        ...input,
        id: reservaId,
        status: "ativa",
        quantidadeAtendida: 0,
        reservadaEm: timestamp,
        criadoEm: timestamp,
        atualizadoEm: timestamp,
      };
      const movimentacao: Movimentacao = {
        id: createStoreEntityId("mov"),
        tipo: "reserva",
        status: "confirmada",
        origemTipo: "reserva",
        origemId: reservaId,
        produtoId: reserva.produtoId,
        variacaoId: reserva.variacaoId,
        depositoOrigemId: reserva.depositoId,
        quantidade: reserva.quantidadeReservada,
        unidadeMedida: produto.unidadeMedida,
        dataMovimentacao: timestamp,
        observacao: reserva.observacao,
        criadoEm: timestamp,
        atualizadoEm: timestamp,
      };

      set((current) => {
        const saldosProduto = applyMovimentacaoToSaldos(
          current.entities.saldosProduto,
          current.entities.produtos,
          movimentacao,
        );

        return {
          ...current,
          entities: {
            ...current.entities,
            reservas: upsertCollectionEntity(current.entities.reservas, reserva),
            movimentacoes: upsertCollectionEntity(current.entities.movimentacoes, movimentacao),
            saldosProduto,
            alertasEstoque: buildAlertasCollection(
              current.entities.produtos,
              saldosProduto,
            ),
          },
        };
      });

      return reservaId;
    },
    liberarReserva: ({ reservaId, quantidade, observacao }) =>
      set((state) => {
        const reservaAtual = state.entities.reservas.byId[reservaId];

        if (!reservaAtual) {
          return state;
        }

        const produto = state.entities.produtos.byId[reservaAtual.produtoId];

        if (!produto) {
          return state;
        }

        const quantidadePendente =
          reservaAtual.quantidadeReservada - reservaAtual.quantidadeAtendida;
        const quantidadeLiberada = quantidade ?? quantidadePendente;

        if (quantidadeLiberada <= 0 || quantidadeLiberada > quantidadePendente) {
          return state;
        }

        const timestamp = createTimestamp();
        const novaQuantidadeReservada =
          reservaAtual.quantidadeReservada - quantidadeLiberada;
        const novoStatus =
          novaQuantidadeReservada === 0
            ? reservaAtual.quantidadeAtendida > 0
              ? "consumida"
              : "cancelada"
            : reservaAtual.quantidadeAtendida > 0
              ? "parcial"
              : "ativa";

        const reservaAtualizada: Reserva = {
          ...reservaAtual,
          quantidadeReservada: novaQuantidadeReservada,
          status: novoStatus,
          observacao: observacao ?? reservaAtual.observacao,
          atualizadoEm: timestamp,
        };
        const movimentacao: Movimentacao = {
          id: createStoreEntityId("mov"),
          tipo: "liberacao_reserva",
          status: "confirmada",
          origemTipo: "reserva",
          origemId: reservaId,
          produtoId: reservaAtual.produtoId,
          variacaoId: reservaAtual.variacaoId,
          depositoOrigemId: reservaAtual.depositoId,
          quantidade: quantidadeLiberada,
          unidadeMedida: produto.unidadeMedida,
          dataMovimentacao: timestamp,
          observacao,
          criadoEm: timestamp,
          atualizadoEm: timestamp,
        };

        const saldosProduto = applyMovimentacaoToSaldos(
          state.entities.saldosProduto,
          state.entities.produtos,
          movimentacao,
        );

        return {
          ...state,
          entities: {
            ...state.entities,
            reservas: upsertCollectionEntity(state.entities.reservas, reservaAtualizada),
            movimentacoes: upsertCollectionEntity(state.entities.movimentacoes, movimentacao),
            saldosProduto,
            alertasEstoque: buildAlertasCollection(
              state.entities.produtos,
              saldosProduto,
            ),
          },
        };
      }),
    consultarStatusProduto: (produtoId) => {
      const state = get();
      const produto = state.entities.produtos.byId[produtoId];

      if (!produto) {
        return null;
      }

      return calcularStatusProduto(
        produto,
        Object.values(state.entities.saldosProduto.byId),
      );
    },
    consultarValorTotalEstoque: () => {
      const state = get();

      return calcularValorTotalEmEstoque(
        Object.values(state.entities.produtos.byId),
        Object.values(state.entities.saldosProduto.byId),
      );
    },
    sincronizarAlertas: () =>
      set((state) => ({
        ...state,
        entities: {
          ...state.entities,
          alertasEstoque: buildAlertasCollection(
            state.entities.produtos,
            state.entities.saldosProduto,
          ),
        },
      })),
  },
});
