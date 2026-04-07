import type { AuditInfo, EntityId, ISODateString, Money, UnidadeMedida } from "@/modules/estoque/types/shared.types";

export type PedidoCompraStatus =
  | "rascunho"
  | "enviado"
  | "parcial"
  | "pendente_aprovacao"
  | "aprovado"
  | "parcialmente_recebido"
  | "recebido"
  | "cancelado";

export type PedidoCompraItem = {
  id: EntityId;
  produtoId: EntityId;
  variacaoId?: EntityId;
  quantidadeSolicitada: number;
  quantidadeRecebida: number;
  unidadeMedida: UnidadeMedida;
  custoUnitario: Money;
  observacao?: string;
};

export type PedidoCompra = AuditInfo & {
  id: EntityId;
  numero: string;
  fornecedorId: EntityId;
  status: PedidoCompraStatus;
  emitidoEm: ISODateString;
  previsaoEntregaEm?: ISODateString;
  observacao?: string;
  itens: PedidoCompraItem[];
  valorTotal?: Money;
};
