import type {
  AuditInfo,
  DocumentoFiscal,
  EntityId,
  ISODateString,
  Money,
  UnidadeMedida,
} from "@/modules/estoque/types/shared.types";

export type EntradaMercadoriaStatus =
  | "pendente"
  | "em_conferencia"
  | "conferida"
  | "parcial"
  | "cancelada";

export type EntradaMercadoriaItem = {
  id: EntityId;
  produtoId: EntityId;
  variacaoId?: EntityId;
  quantidadeRecebida: number;
  quantidadeConferida: number;
  unidadeMedida: UnidadeMedida;
  custoUnitario?: Money;
  lote?: string;
  validadeEm?: ISODateString;
};

export type EntradaMercadoria = AuditInfo & {
  id: EntityId;
  numero: string;
  status: EntradaMercadoriaStatus;
  depositoId: EntityId;
  fornecedorId?: EntityId;
  pedidoCompraId?: EntityId;
  recebidoEm: ISODateString;
  conferidoEm?: ISODateString;
  documentoFiscal?: DocumentoFiscal;
  observacao?: string;
  itens: EntradaMercadoriaItem[];
};
