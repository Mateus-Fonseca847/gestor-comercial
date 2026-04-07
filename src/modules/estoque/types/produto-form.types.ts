export type ProdutoVariacaoForm = {
  tamanho: string;
  cor: string;
  modelo: string;
};

export type ProdutoDepositoForm = {
  deposito: string;
  quantidade: number;
  localizacao: string;
};

export type ProdutoCadastroFormValues = {
  nome: string;
  sku: string;
  codigoInterno: string;
  descricao: string;
  precoCusto: number;
  precoVenda: number;
  categoria: string;
  fornecedorId: string;
  tipoProduto: string;
  unidadeMedida: string;
  ativo: boolean;
  variacoes: ProdutoVariacaoForm[];
  imagens: string[];
  ncm: string;
  cest: string;
  cfopPadrao: string;
  origemFiscal: string;
  localizacaoPrincipal: string;
  depositos: ProdutoDepositoForm[];
  estoqueMinimo: number;
  controlaLote: boolean;
  controlaValidade: boolean;
  ehKit: boolean;
  componentesKit: string;
  camposFlexiveis: {
    referenciaFabricante: string;
    colecao: string;
    observacoesInternas: string;
  };
};
