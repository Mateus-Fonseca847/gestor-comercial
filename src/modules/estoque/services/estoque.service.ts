import {
  dashboardAlerts,
  inventoryMetrics,
  movimentacoesMock,
  produtosDetalhadosMock,
  produtosMock,
  fornecedoresMock,
  quickLinks,
  estoqueSections,
} from "@/modules/estoque/data/mock";

export const estoqueService = {
  getDashboard() {
    return {
      metrics: inventoryMetrics,
      alerts: dashboardAlerts,
      quickLinks,
      recentMovements: movimentacoesMock,
    };
  },
  getProdutos() {
    return produtosMock;
  },
  getProdutoById(id: string) {
    const detalhado =
      produtosDetalhadosMock.find((item) => item.id === id) ?? null;

    if (detalhado) {
      return detalhado;
    }

    const produto = produtosMock.find((item) => item.id === id) ?? null;

    if (!produto) {
      return null;
    }

    return {
      ...produto,
      resumo: {
        estoqueAtual: `${produto.quantidade} un`,
        estoqueReservado: "0 un",
        estoqueMinimo: "15 un",
        ultimoCusto: `R$ ${produto.preco.toFixed(2)}`,
        ultimaMovimentacao: "Sem movimentacao recente",
      },
      visaoGeral: {
        descricao: produto.descricaoCurta,
        tipoProduto: "Produto fisico",
        unidadeMedida: "Unidade",
        categoria: produto.categoria,
        depositoPrincipal: produto.deposito,
        observacoes: "Cadastro mockado pronto para expansao futura.",
      },
      estoques: [
        {
          deposito: produto.deposito,
          disponivel: `${produto.quantidade} un`,
          reservado: "0 un",
          minimo: "15 un",
          localizacao: "Nao definida",
          cobertura: "Sem calculo",
        },
      ],
      variacoes: [],
      fiscal: {
        ncm: "Nao informado",
        cest: "Nao informado",
        cfop: "5102",
        origem: "Nacional",
        tributacao: "Padrao",
      },
      imagens: [],
      fornecedores: [],
      movimentacoes: [],
      historico: [],
    };
  },
  getMovimentacoes() {
    return movimentacoesMock;
  },
  getFornecedores() {
    return fornecedoresMock;
  },
  getSection(slug: string) {
    return estoqueSections[slug] ?? null;
  },
};
