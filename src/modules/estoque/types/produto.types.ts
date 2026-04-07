import type { AuditInfo, EntityId, Money, UnidadeMedida } from "@/modules/estoque/types/shared.types";

export type ProdutoTipo = "simples" | "variavel" | "kit" | "servico";

export type ProdutoStatus = "ativo" | "inativo" | "bloqueado" | "descontinuado";

export type ProdutoFiscal = {
  ncm?: string;
  cest?: string;
  cfopPadrao?: string;
  origemFiscal?: string;
};

export type ProdutoImagem = {
  id: EntityId;
  url: string;
  alt?: string;
  ordem: number;
};

export type ProdutoVariacaoAtributos = Record<string, string>;

export type ProdutoVariacao = {
  id: EntityId;
  sku: string;
  nome: string;
  atributos: ProdutoVariacaoAtributos;
  ativa: boolean;
};

export type ProdutoSaldo = {
  id: EntityId;
  produtoId: EntityId;
  depositoId: EntityId;
  quantidadeDisponivel: number;
  quantidadeReservada: number;
  quantidadeFisica: number;
  estoqueMinimo?: number;
  localizacao?: string;
};

export type Produto = AuditInfo & {
  id: EntityId;
  codigoInterno: string;
  sku: string;
  nome: string;
  descricao?: string;
  categoriaId: EntityId;
  fornecedorPrincipalId?: EntityId;
  tipo: ProdutoTipo;
  status: ProdutoStatus;
  unidadeMedida: UnidadeMedida;
  precoCusto?: Money;
  precoVenda?: Money;
  estoqueMinimo: number;
  estoqueMaximo?: number;
  pontoReposicao?: number;
  controlaLote: boolean;
  controlaValidade: boolean;
  ativo: boolean;
  fiscal?: ProdutoFiscal;
  imagens: ProdutoImagem[];
  variacoes: ProdutoVariacao[];
  tags?: string[];
};
