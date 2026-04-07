export type ModuleKey =
  | "estoque"
  | "cadastros"
  | "vendas"
  | "financeiro"
  | "usuarios"
  | "logistica"
  | "configuracoes";

export type Metric = {
  label: string;
  value: string;
  description: string;
};

export type CollectionPageConfig = {
  title: string;
  description: string;
  actionLabel: string;
  metrics: Metric[];
  filters: {
    placeholder: string;
    chips: { label: string; active?: boolean }[];
  };
  columns: {
    key: string;
    header: string;
    type?: "text" | "status";
  }[];
  rows: Array<Record<string, string | number>>;
};

export type DashboardConfig = {
  title: string;
  description: string;
  metrics: Metric[];
  spotlightTitle: string;
  spotlightDescription: string;
  highlights: string[];
};

export const moduleDashboards: Partial<Record<ModuleKey, DashboardConfig>> = {
  cadastros: {
    title: "Painel de clientes",
    description: "Veja clientes recentes, relacionamento e próximos passos de venda sem complicação.",
    metrics: [
      { label: "Clientes ativos", value: "318", description: "Clientes com compra recente ou atendimento em andamento." },
      { label: "Retornos do dia", value: "42", description: "Clientes que pedem resposta no WhatsApp ou no balcão." },
      { label: "Pendências", value: "18", description: "Conversas e contatos que ainda pedem ação." },
    ],
    spotlightTitle: "Clientes organizados para vender melhor todo dia.",
    spotlightDescription: "A base de clientes precisa ser simples: quem comprou, quem pediu retorno e quem vale uma nova conversa.",
    highlights: [
      "Cadastro simples e direto.",
      "Histórico comercial mais visível.",
      "Acompanhamento fácil do relacionamento.",
    ],
  },
  vendas: {
    title: "Painel de vendas",
    description: "Acompanhe a operação comercial da loja e o que entrou por WhatsApp ou no balcão.",
    metrics: [
      { label: "Registros do dia", value: "126", description: "Vendas e pedidos lançados na rotina da loja." },
      { label: "Aguardando confirmação", value: "34", description: "Pedidos que ainda pedem resposta do cliente." },
      { label: "Concluídas", value: "92", description: "Registros já fechados no período atual." },
    ],
    spotlightTitle: "Um fluxo comercial só, com canal e status bem claros.",
    spotlightDescription: "Loja e WhatsApp convivem no mesmo fluxo para a equipe registrar rápido e acompanhar melhor.",
    highlights: [
      "Canal de origem visível em cada registro.",
      "Histórico fácil de consultar.",
      "Relatórios prontos para fechar o dia.",
    ],
  },
  financeiro: {
    title: "Painel financeiro",
    description: "Veja caixa, contas e dinheiro da loja com leitura rápida e prática.",
    metrics: [
      { label: "A receber", value: "R$ 184 mil", description: "Entradas previstas das vendas e cobranças em aberto." },
      { label: "A pagar", value: "R$ 96 mil", description: "Contas do período que a loja precisa cobrir." },
      { label: "Caixa previsto", value: "R$ 88 mil", description: "Leitura simples do saldo projetado." },
    ],
    spotlightTitle: "Financeiro enxuto para acompanhar o caixa da loja.",
    spotlightDescription: "Entradas, saídas e contas visíveis sem transformar o financeiro em uma suíte pesada.",
    highlights: [
      "Contas a pagar e receber em leitura direta.",
      "Fluxo de caixa fácil de consultar.",
      "Indicadores úteis para a rotina da loja.",
    ],
  },
  usuarios: {
    title: "Painel de usuários",
    description: "Organize acessos da equipe e acompanhe usos importantes do sistema.",
    metrics: [
      { label: "Usuários ativos", value: "64", description: "Pessoas com uso recente no sistema." },
      { label: "Perfis criados", value: "9", description: "Níveis de acesso definidos para cada função." },
      { label: "Eventos recentes", value: "182", description: "Registros das últimas ações feitas no sistema." },
    ],
    spotlightTitle: "Acessos simples para cada pessoa usar só o que precisa.",
    spotlightDescription: "Gerencie perfis, trocas de usuário e rastros de uso sem deixar a administração pesada demais.",
    highlights: [
      "Perfis separados por função.",
      "Troca de usuário com acesso rápido.",
      "Histórico recente para conferência.",
    ],
  },
  logistica: {
    title: "Painel de logística",
    description: "Veja entregas, fretes e saídas de mercadoria sem perder tempo.",
    metrics: [
      { label: "Entregas em andamento", value: "52", description: "Pedidos que já saíram ou estão a caminho." },
      { label: "Fretes em cotação", value: "14", description: "Cotações abertas para escolher o melhor envio." },
      { label: "Saídas pendentes", value: "7", description: "Volumes que ainda precisam ser conferidos ou despachados." },
    ],
    spotlightTitle: "Logística organizada para a mercadoria sair no tempo certo.",
    spotlightDescription: "Acompanhe expedição, fretes e rastreio de forma objetiva, com foco no que precisa andar hoje.",
    highlights: [
      "Rastreamento e despacho em fluxos separados.",
      "Fretes com leitura rápida do status.",
      "Relatórios prontos para acompanhar entregas.",
    ],
  },
  configuracoes: {
    title: "Configurações",
    description: "Ajuste dados da loja, integrações e preferências do sistema em um só lugar.",
    metrics: [
      { label: "Ajustes ativos", value: "38", description: "Configurações em uso na operação atual." },
      { label: "Integrações ligadas", value: "6", description: "Conexões externas já simuladas no sistema." },
      { label: "Ajuda disponível", value: "24", description: "Guias e conteúdos de apoio para a equipe." },
    ],
    spotlightTitle: "Tudo que ajusta a loja fica concentrado aqui.",
    spotlightDescription: "Centralize dados da empresa, integrações e materiais de apoio sem espalhar configurações pelo sistema.",
    highlights: [
      "Dados da loja em um fluxo único.",
      "Integrações e ajuda em áreas separadas.",
      "Estrutura pronta para crescer depois.",
    ],
  },
};

export const moduleCollections: Partial<
  Record<ModuleKey, Record<string, CollectionPageConfig>>
> = {
  cadastros: {
    clientes: records("Clientes", "Acompanhe quem compra, quem pediu retorno e quem vale uma nova abordagem.", "Novo cliente", ["Cliente", "Perfil", "Cidade", "Status"], [
      { id: "C1", c1: "Mariana Souza", c2: "Compra recorrente", c3: "Campinas", status: "Ativo" },
      { id: "C2", c1: "Clube da Lari", c2: "Pedido WhatsApp", c3: "São Paulo", status: "Ativo" },
      { id: "C3", c1: "Fernanda Lima", c2: "Primeira compra", c3: "Curitiba", status: "Em retorno" },
    ]),
    funcionarios: records("Equipe", "Veja quem atende, vende e mantém a rotina da loja funcionando.", "Novo colaborador", ["Nome", "Área", "Função", "Status"], [
      { id: "F1", c1: "Ana Ribeiro", c2: "Vendas", c3: "Atendimento", status: "Ativo" },
      { id: "F2", c1: "Carlos Mota", c2: "Financeiro", c3: "Analista", status: "Ativo" },
      { id: "F3", c1: "Luiza Prado", c2: "Estoque", c3: "Coordenação", status: "Férias" },
    ]),
    leads: records("Contatos", "Organize novos contatos e quem ainda pode virar venda.", "Novo contato", ["Contato", "Origem", "Responsável", "Status"], [
      { id: "L1", c1: "Grupo Delta", c2: "Site", c3: "Equipe SDR", status: "Novo" },
      { id: "L2", c1: "Mercado Alfa", c2: "Campanha", c3: "Juliana", status: "Qualificando" },
      { id: "L3", c1: "Prime Labs", c2: "Indicação", c3: "Rafael", status: "Proposta" },
    ]),
    tickets: records("Pendências", "Acompanhe pedidos internos e ajustes que ainda pedem atenção.", "Nova pendência", ["Assunto", "Tipo", "Responsável", "Status"], [
      { id: "T1", c1: "Ajuste de documento", c2: "Cliente", c3: "Backoffice", status: "Em aberto" },
      { id: "T2", c1: "Vincular colaborador", c2: "Equipe", c3: "Operações", status: "Em andamento" },
      { id: "T3", c1: "Contato duplicado", c2: "Cadastro", c3: "Comercial", status: "Concluído" },
    ]),
  },
  vendas: {
    pedidos: records("Pedidos", "Acompanhe as vendas em andamento e o que falta separar, cobrar ou entregar.", "Novo pedido", ["Pedido", "Cliente", "Valor", "Status"], [
      { id: "P1", c1: "#948", c2: "Acme Brasil", c3: "R$ 18.400", status: "Aprovado" },
      { id: "P2", c1: "#952", c2: "Orbital Tech", c3: "R$ 7.920", status: "Separação" },
      { id: "P3", c1: "#956", c2: "Mercado Alfa", c3: "R$ 4.300", status: "Pendente" },
    ]),
    orcamentos: records("Orçamentos", "Veja propostas abertas e acompanhe o que ainda pode virar venda.", "Novo orçamento", ["Orçamento", "Cliente", "Valor", "Status"], [
      { id: "O1", c1: "OR-201", c2: "Grupo Delta", c3: "R$ 22.100", status: "Enviado" },
      { id: "O2", c1: "OR-202", c2: "Nova Horizonte", c3: "R$ 9.450", status: "Em revisão" },
      { id: "O3", c1: "OR-203", c2: "Prime Labs", c3: "R$ 31.800", status: "Aprovado" },
    ]),
    historico: records("Últimas vendas", "Revise as vendas já fechadas e o canal de origem de cada uma.", "Registrar venda", ["Registro", "Cliente", "Período", "Status"], [
      { id: "H1", c1: "Body splash + nécessaire", c2: "Mariana Souza", c3: "Hoje", status: "Concluído" },
      { id: "H2", c1: "Pedido WhatsApp de presentes", c2: "Clube da Lari", c3: "Ontem", status: "Concluído" },
      { id: "H3", c1: "Kit de acessórios", c2: "Fernanda Lima", c3: "Esta semana", status: "Concluído" },
    ]),
  },
  financeiro: {
    "contas-pagar": records("Contas a pagar", "Controle o que a loja precisa pagar nos próximos dias.", "Nova conta", ["Conta", "Fornecedor", "Vencimento", "Status"], [
      { id: "CP1", c1: "Reposição de bolsas", c2: "Atacado Bela Moda", c3: "12/04", status: "Em aberto" },
      { id: "CP2", c1: "Conta de energia", c2: "CPFL", c3: "15/04", status: "Programado" },
      { id: "CP3", c1: "Internet da loja", c2: "Vivo Empresas", c3: "18/04", status: "Programado" },
    ]),
    "contas-receber": records("Contas a receber", "Acompanhe o que ainda vai entrar no caixa da loja.", "Nova cobrança", ["Cobrança", "Cliente", "Vencimento", "Status"], [
      { id: "CR1", c1: "Sinal de encomenda", c2: "Mariana Souza", c3: "10/04", status: "Em aberto" },
      { id: "CR2", c1: "Pedido WhatsApp", c2: "Clube da Lari", c3: "14/04", status: "Confirmado" },
      { id: "CR3", c1: "Venda parcelada", c2: "Fernanda Lima", c3: "20/04", status: "Atrasado" },
    ]),
    "fluxo-caixa": records("Fluxo de caixa", "Veja entradas e saídas para entender o caixa da loja no dia.", "Novo lançamento", ["Movimento", "Tipo", "Período", "Status"], [
      { id: "FC1", c1: "Vendas da loja", c2: "Entrada", c3: "Hoje", status: "Confirmado" },
      { id: "FC2", c1: "Pedidos WhatsApp", c2: "Entrada", c3: "Hoje", status: "Projetado" },
      { id: "FC3", c1: "Pagamento fornecedor", c2: "Saída", c3: "Esta semana", status: "Previsto" },
    ]),
  },
  usuarios: {
    perfis: records("Perfis de acesso", "Defina o que cada pessoa da equipe pode ver e fazer.", "Novo perfil", ["Perfil", "Área", "Escopo", "Status"], [
      { id: "U1", c1: "Administradores", c2: "Direção", c3: "Total", status: "Ativo" },
      { id: "U2", c1: "Operações", c2: "Estoque", c3: "Parcial", status: "Ativo" },
      { id: "U3", c1: "Financeiro", c2: "Financeiro", c3: "Restrito", status: "Em revisão" },
    ]),
    "trocar-usuario": records("Troca de usuário", "Acesse perfis recentes para suporte ou conferência rápida.", "Trocar usuário", ["Usuário", "Perfil", "Último acesso", "Status"], [
      { id: "TU1", c1: "Mariana Costa", c2: "Administradores", c3: "Hoje 09:18", status: "Online" },
      { id: "TU2", c1: "Ricardo Alves", c2: "Operações", c3: "Hoje 08:41", status: "Disponível" },
      { id: "TU3", c1: "Paula Lima", c2: "Financeiro", c3: "Ontem 17:20", status: "Inativo" },
    ]),
    logs: records("Histórico de uso", "Veja acessos e ações recentes feitas no sistema.", "Exportar histórico", ["Evento", "Usuário", "Momento", "Status"], [
      { id: "LG1", c1: "Login validado", c2: "Mariana Costa", c3: "Hoje 09:18", status: "Sucesso" },
      { id: "LG2", c1: "Troca de perfil", c2: "Ricardo Alves", c3: "Hoje 08:54", status: "Auditado" },
      { id: "LG3", c1: "Tentativa bloqueada", c2: "Conta externa", c3: "Ontem 22:14", status: "Alerta" },
    ]),
  },
  logistica: {
    rastreamento: records("Rastreamento", "Acompanhe entregas e veja rápido o que está em rota ou atrasado.", "Novo rastreio", ["Carga", "Destino", "Previsão", "Status"], [
      { id: "R1", c1: "Pedido #948", c2: "Campinas", c3: "Hoje 14:30", status: "Em rota" },
      { id: "R2", c1: "Pedido #952", c2: "Sorocaba", c3: "Hoje 16:10", status: "Em rota" },
      { id: "R3", c1: "Pedido #956", c2: "Curitiba", c3: "Amanhã 11:00", status: "Atraso" },
    ]),
    fretes: records("Fretes", "Compare fretes e escolha o envio mais viável para a operação.", "Novo frete", ["Frete", "Transportadora", "Faixa", "Status"], [
      { id: "FR1", c1: "Cotação Sul", c2: "Log Express", c3: "R$ 1.800", status: "Em cotação" },
      { id: "FR2", c1: "Contrato SP", c2: "Rápido Cargo", c3: "R$ 980", status: "Ativo" },
      { id: "FR3", c1: "Urgência interior", c2: "Via Prime", c3: "R$ 1.250", status: "Aprovado" },
    ]),
    despachos: records("Despachos", "Veja o que está separando, conferindo e saindo para entrega.", "Novo despacho", ["Despacho", "Origem", "Janela", "Status"], [
      { id: "D1", c1: "EXP-302", c2: "CD principal", c3: "Hoje 13:00", status: "Separando" },
      { id: "D2", c1: "EXP-304", c2: "CD principal", c3: "Hoje 15:00", status: "Conferência" },
      { id: "D3", c1: "EXP-305", c2: "Filial Sul", c3: "Amanhã 09:00", status: "Agendado" },
    ]),
  },
  configuracoes: {
    empresa: records("Dados da loja", "Concentre os dados principais da empresa e preferências do sistema.", "Editar dados", ["Configuração", "Valor", "Escopo", "Status"], [
      { id: "E1", c1: "Razão social", c2: "Meu Negócio LTDA", c3: "Institucional", status: "Ativo" },
      { id: "E2", c1: "Fuso operacional", c2: "America/Sao_Paulo", c3: "Sistema", status: "Ativo" },
      { id: "E3", c1: "Moeda padrão", c2: "BRL", c3: "Financeiro", status: "Ativo" },
    ]),
    ajuda: records("Ajuda", "Reúna orientações rápidas para a equipe usar o sistema no dia a dia.", "Novo conteúdo", ["Conteúdo", "Tipo", "Atualização", "Status"], [
      { id: "A1", c1: "Fluxo de estoque", c2: "Guia", c3: "Hoje", status: "Publicado" },
      { id: "A2", c1: "Onboarding comercial", c2: "Checklist", c3: "Ontem", status: "Publicado" },
      { id: "A3", c1: "FAQ financeiro", c2: "Base de conhecimento", c3: "3 dias", status: "Em revisão" },
    ]),
    integracoes: records("Integrações", "Veja conexões externas e descubra rápido o que precisa de atenção.", "Nova integração", ["Integração", "Canal", "Último sync", "Status"], [
      { id: "I1", c1: "ERP legado", c2: "API", c3: "10 min", status: "Conectado" },
      { id: "I2", c1: "Transportadora", c2: "Webhook", c3: "32 min", status: "Atenção" },
      { id: "I3", c1: "Financeiro externo", c2: "API", c3: "2 horas", status: "Em teste" },
    ]),
  },
};

function records(
  title: string,
  description: string,
  actionLabel: string,
  headers: [string, string, string, string] | string[],
  rows: Array<Record<string, string>>,
): CollectionPageConfig {
  return {
    title,
    description,
    actionLabel,
    metrics: [
      { label: "Itens na tela", value: String(rows.length), description: "Registros visíveis nesta área." },
      { label: "Atualização", value: "Hoje", description: "Leitura atual desta área." },
      { label: "Próxima ação", value: actionLabel, description: "Ação mais comum para seguir a rotina." },
    ],
    filters: {
      placeholder: `Buscar em ${title.toLowerCase()}`,
      chips: [
        { label: "Todos", active: true },
        { label: "Ativos" },
        { label: "Recentes" },
      ],
    },
    columns: [
      { key: "c1", header: headers[0] },
      { key: "c2", header: headers[1] },
      { key: "c3", header: headers[2] },
      { key: "status", header: headers[3], type: "status" },
    ],
    rows,
  };
}
