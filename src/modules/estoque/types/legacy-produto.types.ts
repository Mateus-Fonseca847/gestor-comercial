export type ProdutoStatusLegado = "Saudável" | "Baixo" | "Zerado";

export type MovimentacaoStatusLegado = "Concluída" | "Pendente";

export type FornecedorStatusLegado = "Ativo" | "Em análise";

export type Produto = {
  id: string;
  codigo: string;
  nome: string;
  descricaoCurta: string;
  sku: string;
  categoria: string;
  preco: number;
  deposito: string;
  quantidade: number;
  status: ProdutoStatusLegado;
};

export type ProdutoResumoRapido = {
  estoqueAtual: string;
  estoqueReservado: string;
  estoqueMinimo: string;
  ultimoCusto: string;
  ultimaMovimentacao: string;
};

export type ProdutoVisaoGeral = {
  descricao: string;
  tipoProduto: string;
  unidadeMedida: string;
  categoria: string;
  depositoPrincipal: string;
  observacoes: string;
};

export type ProdutoEstoqueItem = {
  deposito: string;
  disponivel: string;
  reservado: string;
  minimo: string;
  localizacao: string;
  cobertura: string;
};

export type ProdutoVariacaoDetalhe = {
  id: string;
  nome: string;
  sku: string;
  atributos: string;
  estoque: string;
  status: string;
};

export type ProdutoFiscalInfo = {
  ncm: string;
  cest: string;
  cfop: string;
  origem: string;
  tributacao: string;
};

export type ProdutoImagemLegado = {
  id: string;
  label: string;
  tone: "light" | "medium" | "dark";
};

export type ProdutoFornecedorItem = {
  id: string;
  nome: string;
  prazo: string;
  custo: string;
  status: string;
};

export type ProdutoMovimentacaoItem = {
  id: string;
  tipo: "Entrada" | "Saida";
  origem: string;
  quantidade: string;
  data: string;
  status: string;
};

export type ProdutoHistoricoItem = {
  id: string;
  title: string;
  description: string;
  date: string;
};

export type ProdutoDetalhado = Produto & {
  resumo: ProdutoResumoRapido;
  visaoGeral: ProdutoVisaoGeral;
  estoques: ProdutoEstoqueItem[];
  variacoes: ProdutoVariacaoDetalhe[];
  fiscal: ProdutoFiscalInfo;
  imagens: ProdutoImagemLegado[];
  fornecedores: ProdutoFornecedorItem[];
  movimentacoes: ProdutoMovimentacaoItem[];
  historico: ProdutoHistoricoItem[];
};

export type Movimentacao = {
  id: string;
  descricao: string;
  tipo: "Entrada" | "Saída";
  origem: string;
  data: string;
  status: MovimentacaoStatusLegado;
};

export type Fornecedor = {
  id: string;
  nome: string;
  categoria: string;
  prazo: string;
  status: FornecedorStatusLegado;
};
