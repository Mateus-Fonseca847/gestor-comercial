export type EstoqueNavItem = {
  label: string;
  href: string;
};

export type ProdutoStatus = "Saudável" | "Baixo" | "Zerado";
export type MovimentacaoStatus = "Concluída" | "Pendente";
export type FornecedorStatus = "Ativo" | "Em análise";

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
  status: ProdutoStatus;
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

export type ProdutoImagem = {
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
  imagens: ProdutoImagem[];
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
  status: MovimentacaoStatus;
};

export type Fornecedor = {
  id: string;
  nome: string;
  categoria: string;
  prazo: string;
  status: FornecedorStatus;
};

export type EstoqueMetric = {
  label: string;
  value: string;
  note: string;
};

export type EstoqueAlert = {
  id: string;
  title: string;
  description: string;
  severity: "warning" | "danger" | "info";
  href: string;
};

export type DepositoResumo = {
  id: string;
  nome: string;
  ocupacao: string;
  itens: string;
  status: string;
};

export type ReposicaoIndicador = {
  id: string;
  titulo: string;
  valor: string;
  detalhe: string;
  status: "info" | "success" | "warning";
};

export type EstoqueGenericRecord = {
  id: string;
  primary: string;
  secondary: string;
  tertiary: string;
  status: string;
};

export type EstoqueSectionConfig = {
  slug: string;
  title: string;
  description: string;
  actionLabel: string;
  filters: string[];
  metrics: EstoqueMetric[];
  records: EstoqueGenericRecord[];
};

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
