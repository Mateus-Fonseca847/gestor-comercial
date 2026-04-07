import type { AuditInfo, Endereco, EntityId } from "@/modules/estoque/types/shared.types";

export type DepositoTipo = "fisico" | "virtual" | "transito" | "quarentena" | "loja";

export type DepositoStatus = "ativo" | "inativo" | "bloqueado";

export type Deposito = AuditInfo & {
  id: EntityId;
  codigo: string;
  nome: string;
  descricao?: string;
  tipo: DepositoTipo;
  status: DepositoStatus;
  endereco?: Endereco;
  responsavelId?: EntityId;
  capacidadeMaxima?: number;
  permiteMovimentacao: boolean;
};
