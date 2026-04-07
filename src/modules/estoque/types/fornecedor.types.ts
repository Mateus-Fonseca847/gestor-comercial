import type {
  AuditInfo,
  Contato,
  Endereco,
  EntityId,
  TipoPessoa,
} from "@/modules/estoque/types/shared.types";

export type FornecedorStatus = "ativo" | "inativo" | "em_analise" | "bloqueado";

export type Fornecedor = AuditInfo & {
  id: EntityId;
  codigo: string;
  razaoSocial: string;
  nomeFantasia?: string;
  documento: string;
  tipoPessoa: TipoPessoa;
  categoriaPrincipal?: string;
  status: FornecedorStatus;
  prazoMedioEntregaDias?: number;
  email?: string;
  telefone?: string;
  contatoPrincipal?: Contato;
  endereco?: Endereco;
  observacoes?: string;
};
