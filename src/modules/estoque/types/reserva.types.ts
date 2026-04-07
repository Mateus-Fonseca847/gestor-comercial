import type { AuditInfo, EntityId, ISODateString } from "@/modules/estoque/types/shared.types";

export type ReservaOrigemTipo = "pedido_venda" | "ordem_servico" | "transferencia" | "manual";

export type ReservaStatus = "ativa" | "parcial" | "consumida" | "cancelada" | "expirada";

export type Reserva = AuditInfo & {
  id: EntityId;
  produtoId: EntityId;
  variacaoId?: EntityId;
  depositoId: EntityId;
  origemTipo: ReservaOrigemTipo;
  origemId: EntityId;
  status: ReservaStatus;
  quantidadeReservada: number;
  quantidadeAtendida: number;
  reservadaEm: ISODateString;
  expiraEm?: ISODateString;
  observacao?: string;
};
