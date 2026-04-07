import type { AuditInfo, EntityId } from "@/modules/estoque/types/shared.types";

export type CategoriaStatus = "ativa" | "inativa" | "arquivada";

export type Categoria = AuditInfo & {
  id: EntityId;
  codigo: string;
  nome: string;
  descricao?: string;
  status: CategoriaStatus;
  categoriaPaiId?: EntityId;
  ordem?: number;
};
