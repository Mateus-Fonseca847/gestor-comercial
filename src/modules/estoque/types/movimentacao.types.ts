import type { AuditInfo, EntityId, ISODateString, Money, UnidadeMedida } from "@/modules/estoque/types/shared.types";

export type MovimentacaoTipo =
  | "entrada"
  | "saida"
  | "ajuste"
  | "transferencia"
  | "reserva"
  | "liberacao_reserva";

export type MovimentacaoStatus = "rascunho" | "pendente" | "confirmada" | "cancelada";

export type MovimentacaoOrigemTipo =
  | "manual"
  | "pedido_compra"
  | "entrada_mercadoria"
  | "transferencia"
  | "inventario"
  | "reserva";

export type Movimentacao = AuditInfo & {
  id: EntityId;
  tipo: MovimentacaoTipo;
  status: MovimentacaoStatus;
  origemTipo: MovimentacaoOrigemTipo;
  origemId?: EntityId;
  produtoId: EntityId;
  variacaoId?: EntityId;
  depositoOrigemId?: EntityId;
  depositoDestinoId?: EntityId;
  quantidade: number;
  unidadeMedida: UnidadeMedida;
  custoUnitario?: Money;
  dataMovimentacao: ISODateString;
  observacao?: string;
};
