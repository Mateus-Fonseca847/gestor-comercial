import type { AuditInfo, EntityId, ISODateString, UnidadeMedida } from "@/modules/estoque/types/shared.types";

export type TransferenciaStatus =
  | "rascunho"
  | "pendente"
  | "separacao"
  | "em_transito"
  | "recebida"
  | "cancelada";

export type TransferenciaItem = {
  id: EntityId;
  produtoId: EntityId;
  variacaoId?: EntityId;
  quantidade: number;
  unidadeMedida: UnidadeMedida;
};

export type Transferencia = AuditInfo & {
  id: EntityId;
  codigo: string;
  status: TransferenciaStatus;
  depositoOrigemId: EntityId;
  depositoDestinoId: EntityId;
  solicitadoEm: ISODateString;
  enviadoEm?: ISODateString;
  recebidoEm?: ISODateString;
  observacao?: string;
  itens: TransferenciaItem[];
};
