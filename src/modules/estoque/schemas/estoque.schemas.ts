import { z } from "zod";

export const produtoStatusOptions = ["Saudável", "Baixo", "Zerado"] as const;
export const movimentacaoTipoOptions = ["Entrada", "Saída"] as const;

const variacaoSchema = z.object({
  tamanho: z.string().min(1, "Informe o tamanho"),
  cor: z.string().min(1, "Informe a cor"),
  modelo: z.string().min(1, "Informe o modelo"),
});

const depositoSchema = z.object({
  deposito: z.string().min(1, "Selecione o depósito"),
  quantidade: z.coerce.number().min(0, "Quantidade inválida"),
  localizacao: z.string().min(1, "Informe a localização"),
});

export const produtoCadastroSchema = z.object({
  nome: z.string().min(3, "Informe o nome do produto"),
  sku: z.string().min(3, "Informe o SKU"),
  codigoInterno: z.string().min(2, "Informe o código interno"),
  descricao: z.string().min(10, "Descreva o produto"),
  precoCusto: z.coerce.number().min(0, "Preço de custo inválido"),
  precoVenda: z.coerce.number().min(0, "Preço de venda inválido"),
  categoria: z.string().min(1, "Selecione a categoria"),
  fornecedorId: z.string().min(1, "Selecione o fornecedor"),
  tipoProduto: z.string().min(1, "Selecione o tipo do produto"),
  unidadeMedida: z.string().min(1, "Selecione a unidade de medida"),
  ativo: z.boolean(),
  variacoes: z.array(variacaoSchema).min(1, "Adicione ao menos uma variação"),
  imagens: z.array(z.string().url("Use uma URL válida")).min(1, "Adicione ao menos uma imagem"),
  ncm: z.string().min(4, "Informe o NCM"),
  cest: z.string().min(3, "Informe o CEST"),
  cfopPadrao: z.string().min(4, "Informe o CFOP"),
  origemFiscal: z.string().min(1, "Selecione a origem fiscal"),
  localizacaoPrincipal: z.string().min(1, "Informe a localização principal"),
  depositos: z.array(depositoSchema).min(1, "Adicione ao menos um estoque"),
  estoqueMinimo: z.coerce.number().min(0, "Informe o estoque mínimo"),
  controlaLote: z.boolean(),
  controlaValidade: z.boolean(),
  ehKit: z.boolean(),
  componentesKit: z.string(),
  camposFlexiveis: z.object({
    referenciaFabricante: z.string().optional(),
    colecao: z.string().optional(),
    observacoesInternas: z.string().optional(),
  }),
});

export type ProdutoCadastroSchema = z.infer<typeof produtoCadastroSchema>;
