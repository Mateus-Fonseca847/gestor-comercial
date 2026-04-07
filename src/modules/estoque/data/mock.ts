import {
  DepositoResumo,
  EstoqueAlert,
  EstoqueMetric,
  EstoqueSectionConfig,
  Fornecedor,
  Movimentacao,
  ProdutoDetalhado,
  Produto,
  ReposicaoIndicador,
} from "@/modules/estoque/types/estoque.types";

export const inventoryMetrics: EstoqueMetric[] = [
  {
    label: "Total de produtos",
    value: "248",
    note: "18 novos itens no último ciclo",
  },
  {
    label: "Estoque baixo",
    value: "12",
    note: "Revisão recomendada para itens críticos",
  },
  {
    label: "Produtos zerados",
    value: "4",
    note: "Reposição imediata necessária",
  },
  {
    label: "Valor total em estoque",
    value: "R$ 284 mil",
    note: "Avaliação estimada com base no custo médio atual.",
  },
  {
    label: "Itens reservados",
    value: "37",
    note: "Produtos comprometidos por pedidos e separações em aberto.",
  },
];

export const produtosMock: Produto[] = [
  {
    id: "P001",
    codigo: "0001",
    nome: "Papel A4 Premium",
    descricaoCurta: "Pacote com 500 folhas para uso corporativo.",
    sku: "PAP-A4-001",
    categoria: "Escritório",
    preco: 32.9,
    deposito: "Depósito central",
    quantidade: 320,
    status: "Saudável",
  },
  {
    id: "P002",
    codigo: "0002",
    nome: "Tinta HP 667 Black",
    descricaoCurta: "Cartucho de reposição para impressoras HP compatíveis.",
    sku: "TIN-HP-667",
    categoria: "Suprimentos",
    preco: 89.5,
    deposito: "CD auxiliar",
    quantidade: 8,
    status: "Baixo",
  },
  {
    id: "P003",
    codigo: "0003",
    nome: "Mouse Corporativo",
    descricaoCurta: "Mouse óptico com conexão USB para uso em escritório.",
    sku: "PER-MOU-120",
    categoria: "Periféricos",
    preco: 44.9,
    deposito: "Depósito central",
    quantidade: 0,
    status: "Zerado",
  },
  {
    id: "P004",
    codigo: "0004",
    nome: "Teclado Slim Office",
    descricaoCurta: "Teclado compacto com perfil baixo e padrão ABNT2.",
    sku: "PER-TEC-233",
    categoria: "Periféricos",
    preco: 76.4,
    deposito: "CD auxiliar",
    quantidade: 64,
    status: "Saudável",
  },
  {
    id: "P005",
    codigo: "0005",
    nome: "Headset Pro Call",
    descricaoCurta: "Headset com microfone integrado para atendimento.",
    sku: "AUD-HDS-550",
    categoria: "Áudio",
    preco: 129.9,
    deposito: "Depósito central",
    quantidade: 19,
    status: "Baixo",
  },
  {
    id: "P006",
    codigo: "0006",
    nome: "Monitor 24 Full HD",
    descricaoCurta: "Monitor LED 24 polegadas para estações operacionais.",
    sku: "MON-24-900",
    categoria: "Monitores",
    preco: 899.0,
    deposito: "CD auxiliar",
    quantidade: 11,
    status: "Saudável",
  },
];

export const movimentacoesMock: Movimentacao[] = [
  {
    id: "M001",
    descricao: "Entrada de papel A4 Premium",
    tipo: "Entrada",
    origem: "Compra #3021",
    data: "Hoje, 09:20",
    status: "Concluída",
  },
  {
    id: "M002",
    descricao: "Saída de tinta HP 667 Black",
    tipo: "Saída",
    origem: "Pedido #948",
    data: "Hoje, 08:05",
    status: "Concluída",
  },
  {
    id: "M003",
    descricao: "Entrada de monitores 24\"",
    tipo: "Entrada",
    origem: "Fornecedor TechSupply",
    data: "Ontem, 17:40",
    status: "Pendente",
  },
];

export const fornecedoresMock: Fornecedor[] = [];

export const produtosDetalhadosMock: ProdutoDetalhado[] = [
  {
    ...produtosMock[0],
    resumo: {
      estoqueAtual: "320 un",
      estoqueReservado: "48 un",
      estoqueMinimo: "120 un",
      ultimoCusto: "R$ 26,40",
      ultimaMovimentacao: "Saida por pedido #948 hoje, 08:05",
    },
    visaoGeral: {
      descricao:
        "Papel sulfite premium para operacao administrativa, impressao interna e consumo recorrente do escritorio.",
      tipoProduto: "Produto fisico",
      unidadeMedida: "Pacote",
      categoria: "Escritorio",
      depositoPrincipal: "Deposito central",
      observacoes:
        "Item de alta recorrencia. Mantem giro continuo e demanda revisao semanal de reposicao.",
    },
    estoques: [
      {
        deposito: "Deposito central",
        disponivel: "240 un",
        reservado: "48 un",
        minimo: "120 un",
        localizacao: "Rua A - Modulo 04",
        cobertura: "18 dias",
      },
      {
        deposito: "CD auxiliar",
        disponivel: "80 un",
        reservado: "0 un",
        minimo: "30 un",
        localizacao: "Bloco B - Prateleira 07",
        cobertura: "9 dias",
      },
    ],
    variacoes: [
      {
        id: "VAR-001",
        nome: "Papel A4 Premium 75g",
        sku: "PAP-A4-001-75",
        atributos: "Gramatura 75g",
        estoque: "210 un",
        status: "Ativa",
      },
      {
        id: "VAR-002",
        nome: "Papel A4 Premium 90g",
        sku: "PAP-A4-001-90",
        atributos: "Gramatura 90g",
        estoque: "110 un",
        status: "Ativa",
      },
    ],
    fiscal: {
      ncm: "4802.56.10",
      cest: "28.038.00",
      cfop: "5102",
      origem: "Nacional",
      tributacao: "Tributacao integral",
    },
    imagens: [
      { id: "IMG-001", label: "Capa principal", tone: "light" },
      { id: "IMG-002", label: "Lateral da embalagem", tone: "medium" },
      { id: "IMG-003", label: "Detalhe interno", tone: "dark" },
    ],
    fornecedores: [
      {
        id: "FOR-001",
        nome: "Office Plus",
        prazo: "5 dias uteis",
        custo: "R$ 26,40",
        status: "Principal",
      },
      {
        id: "FOR-002",
        nome: "Distribuidora Prisma",
        prazo: "8 dias uteis",
        custo: "R$ 27,10",
        status: "Alternativo",
      },
    ],
    movimentacoes: [
      {
        id: "MOV-001",
        tipo: "Saida",
        origem: "Pedido #948",
        quantidade: "16 un",
        data: "Hoje, 08:05",
        status: "Concluida",
      },
      {
        id: "MOV-002",
        tipo: "Entrada",
        origem: "Compra #3021",
        quantidade: "80 un",
        data: "Ontem, 17:40",
        status: "Concluida",
      },
      {
        id: "MOV-003",
        tipo: "Saida",
        origem: "Transferencia TR-205",
        quantidade: "24 un",
        data: "02 abr 2026, 10:20",
        status: "Pendente",
      },
    ],
    historico: [
      {
        id: "HIS-001",
        title: "Preco de venda revisado",
        description: "Margem ajustada para acompanhar aumento de custo do fornecedor principal.",
        date: "03 abr 2026, 14:10",
      },
      {
        id: "HIS-002",
        title: "Estoque minimo atualizado",
        description: "Parametro elevado de 90 para 120 unidades devido ao aumento de pedidos.",
        date: "01 abr 2026, 09:30",
      },
      {
        id: "HIS-003",
        title: "Fornecedor alternativo vinculado",
        description: "Distribuidora Prisma adicionada para contingencia de abastecimento.",
        date: "28 mar 2026, 11:45",
      },
    ],
  },
];

export const dashboardAlerts: EstoqueAlert[] = [
  {
    id: "AL1",
    title: "Estoque mínimo",
    description: "12 produtos estão abaixo do nível mínimo e precisam de revisão de reposição.",
    severity: "warning",
    href: "/estoque/produtos",
  },
  {
    id: "AL2",
    title: "Validade próxima",
    description: "8 itens vencem nos próximos 30 dias e exigem ação comercial ou logística.",
    severity: "danger",
    href: "/estoque/entradas",
  },
  {
    id: "AL3",
    title: "Sem movimentação recente",
    description: "16 produtos não registram entrada ou saída nas últimas 6 semanas.",
    severity: "info",
    href: "/estoque/movimentacoes",
  },
];

export const quickLinks = [
  {
    title: "Produtos",
    description: "Acompanhe catálogo, categorias e níveis de estoque.",
    href: "/estoque/produtos",
  },
  {
    title: "Movimentações",
    description: "Consulte entradas e saídas recentes do estoque.",
    href: "/estoque/movimentacoes",
  },
  {
    title: "Fornecedores",
    description: "Centralize parceiros e status de abastecimento.",
    href: "/estoque/fornecedores",
  },
  {
    title: "Compras",
    description: "Acompanhe pedidos de compra e abastecimento futuro.",
    href: "/estoque/compras",
  },
];

export const depositosResumoMock: DepositoResumo[] = [
  {
    id: "DEP1",
    nome: "Depósito central",
    ocupacao: "81%",
    itens: "184 itens monitorados",
    status: "Operação estável",
  },
  {
    id: "DEP2",
    nome: "CD auxiliar",
    ocupacao: "56%",
    itens: "72 itens monitorados",
    status: "Boa disponibilidade",
  },
  {
    id: "DEP3",
    nome: "Quarentena",
    ocupacao: "34%",
    itens: "19 itens bloqueados",
    status: "Atenção em conferência",
  },
];

export const reposicaoIndicadoresMock: ReposicaoIndicador[] = [
  {
    id: "RP1",
    titulo: "Cobertura média",
    valor: "26 dias",
    detalhe: "Janela atual considerando ritmo recente de saída dos itens mais ativos.",
    status: "info",
  },
  {
    id: "RP2",
    titulo: "Reposições em aberto",
    valor: "7 pedidos",
    detalhe: "Compras aguardando recebimento, conferência ou integração interna.",
    status: "warning",
  },
  {
    id: "RP3",
    titulo: "Urgência crítica",
    valor: "4 itens",
    detalhe: "Produtos zerados com impacto imediato nas vendas ou na operação.",
    status: "warning",
  },
];

export const estoqueSections: Record<string, EstoqueSectionConfig> = {
  categorias: {
    slug: "categorias",
    title: "Categorias",
    description: "Organize a estrutura classificatória dos produtos para melhorar leitura, filtros e compras futuras.",
    actionLabel: "Nova categoria",
    filters: ["Todas", "Ativas", "Estratégicas"],
    metrics: [
      { label: "Categorias ativas", value: "18", note: "Classificações em uso no catálogo atual." },
      { label: "Sem vínculo", value: "2", note: "Categorias aguardando produtos associados." },
      { label: "Revisão", value: "3", note: "Grupos que merecem padronização interna." },
    ],
    records: [
      { id: "CAT1", primary: "Escritório", secondary: "74 produtos", tertiary: "Atualizada hoje", status: "Ativa" },
      { id: "CAT2", primary: "Periféricos", secondary: "22 produtos", tertiary: "Alta saída", status: "Ativa" },
      { id: "CAT3", primary: "Suprimentos", secondary: "16 produtos", tertiary: "Em revisão", status: "Ajuste" },
    ],
  },
  inventario: {
    slug: "inventario",
    title: "Inventário",
    description: "Prepare contagens, conciliações e ciclos de conferência sem misturar isso com a operação diária.",
    actionLabel: "Novo inventário",
    filters: ["Todos", "Abertos", "Finalizados"],
    metrics: [
      { label: "Inventários abertos", value: "2", note: "Ciclos atualmente em andamento." },
      { label: "Divergências", value: "11", note: "Itens com variação entre físico e sistema." },
      { label: "Última contagem", value: "Ontem", note: "Fechamento mais recente do módulo." },
    ],
    records: [
      { id: "INV1", primary: "Contagem geral abril", secondary: "Depósito central", tertiary: "Início hoje 08:00", status: "Aberto" },
      { id: "INV2", primary: "Inventário cíclico A", secondary: "Periféricos", tertiary: "Fechado ontem", status: "Concluído" },
      { id: "INV3", primary: "Recontagem crítica", secondary: "Suprimentos", tertiary: "11 divergências", status: "Pendente" },
    ],
  },
  depositos: {
    slug: "depositos",
    title: "Depósitos",
    description: "Gerencie estruturas físicas e lógicas de armazenagem com visão clara da ocupação operacional.",
    actionLabel: "Novo depósito",
    filters: ["Todos", "Ativos", "Capacidade crítica"],
    metrics: [
      { label: "Depósitos ativos", value: "4", note: "Estruturas disponíveis para operação." },
      { label: "Capacidade média", value: "72%", note: "Ocupação consolidada dos estoques." },
      { label: "Com atenção", value: "1", note: "Espaço com sobrecarga prevista." },
    ],
    records: [
      { id: "DEP1", primary: "Depósito central", secondary: "Capacidade 81%", tertiary: "Campinas", status: "Ativo" },
      { id: "DEP2", primary: "CD auxiliar", secondary: "Capacidade 56%", tertiary: "São Paulo", status: "Ativo" },
      { id: "DEP3", primary: "Quarentena", secondary: "Capacidade 34%", tertiary: "Itens bloqueados", status: "Controlado" },
    ],
  },
  transferencias: {
    slug: "transferencias",
    title: "Transferências",
    description: "Controle movimentações entre depósitos e garanta rastreabilidade nas realocações internas.",
    actionLabel: "Nova transferência",
    filters: ["Todas", "Em trânsito", "Concluídas"],
    metrics: [
      { label: "Transferências abertas", value: "5", note: "Fluxos entre depósitos sem fechamento." },
      { label: "Em trânsito", value: "2", note: "Movimentações aguardando recebimento." },
      { label: "Hoje", value: "7", note: "Transferências geradas no dia atual." },
    ],
    records: [
      { id: "TR1", primary: "TR-204", secondary: "Central → CD auxiliar", tertiary: "14 itens", status: "Em trânsito" },
      { id: "TR2", primary: "TR-205", secondary: "Quarentena → Central", tertiary: "6 itens", status: "Pendente" },
      { id: "TR3", primary: "TR-206", secondary: "Central → Loja", tertiary: "21 itens", status: "Concluída" },
    ],
  },
  compras: {
    slug: "compras",
    title: "Compras",
    description: "Consolide requisições e abastecimento do estoque antes da entrada efetiva dos produtos.",
    actionLabel: "Nova compra",
    filters: ["Todas", "Aprovadas", "Aguardando"],
    metrics: [
      { label: "Pedidos abertos", value: "9", note: "Compras em negociação ou conferência." },
      { label: "Em aprovação", value: "3", note: "Solicitações aguardando decisão." },
      { label: "Valor previsto", value: "R$ 48 mil", note: "Montante estimado das compras mockadas." },
    ],
    records: [
      { id: "CO1", primary: "Compra #3021", secondary: "TechSupply", tertiary: "R$ 12.400", status: "Aprovada" },
      { id: "CO2", primary: "Compra #3024", secondary: "Office Plus", tertiary: "R$ 4.820", status: "Aguardando" },
      { id: "CO3", primary: "Compra #3026", secondary: "Log Prime", tertiary: "R$ 8.110", status: "Recebimento" },
    ],
  },
  entradas: {
    slug: "entradas",
    title: "Entradas",
    description: "Registre recebimentos e conferências de mercadorias com contexto de origem e integridade operacional.",
    actionLabel: "Registrar entrada",
    filters: ["Todas", "Conferidas", "Pendentes"],
    metrics: [
      { label: "Entradas hoje", value: "18", note: "Recebimentos processados no dia." },
      { label: "Pendentes", value: "4", note: "Notas aguardando conferência final." },
      { label: "Último recebimento", value: "09:20", note: "Horário do registro mais recente." },
    ],
    records: [
      { id: "EN1", primary: "Recebimento #9001", secondary: "Compra #3021", tertiary: "Hoje 09:20", status: "Conferida" },
      { id: "EN2", primary: "Recebimento #9002", secondary: "Compra #3024", tertiary: "Hoje 10:05", status: "Pendente" },
      { id: "EN3", primary: "Recebimento #9003", secondary: "Transferência TR-205", tertiary: "Ontem 17:30", status: "Concluída" },
    ],
  },
};
