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
    title: "Dashboard de cadastros",
    description: "Centralize entidades comerciais, acompanhe base ativa e chegue rapidamente aos registros estratégicos.",
    metrics: [
      { label: "Clientes ativos", value: "318", description: "Base comercial disponível para operação e relacionamento." },
      { label: "Leads em triagem", value: "42", description: "Oportunidades aguardando qualificação da equipe." },
      { label: "Tickets abertos", value: "18", description: "Solicitações em andamento com acompanhamento interno." },
    ],
    spotlightTitle: "Cadastros organizados para acelerar operação e atendimento.",
    spotlightDescription: "Use este módulo para manter a base principal do sistema íntegra e acessível, reduzindo retrabalho entre áreas.",
    highlights: [
      "Clientes e leads em um fluxo centralizado.",
      "Funcionários e tickets com leitura operacional clara.",
      "Acesso rápido aos relatórios do módulo.",
    ],
  },
  vendas: {
    title: "Dashboard de vendas",
    description: "Monitore pedidos, propostas e histórico comercial em um fluxo de navegação objetivo.",
    metrics: [
      { label: "Pedidos ativos", value: "126", description: "Negociações em processamento ou aguardando conclusão." },
      { label: "Orçamentos abertos", value: "34", description: "Propostas ainda em avaliação pelo cliente." },
      { label: "Conversão mensal", value: "28%", description: "Taxa consolidada dos mocks comerciais atuais." },
    ],
    spotlightTitle: "Vendas com visão operacional e resposta rápida.",
    spotlightDescription: "Concentre pipeline, histórico e materiais de acompanhamento em um módulo limpo e preparado para expansão.",
    highlights: [
      "Pedidos e orçamentos conectados ao mesmo fluxo.",
      "Histórico separado para consulta rápida.",
      "Relatórios sempre acessíveis pelo menu do módulo.",
    ],
  },
  financeiro: {
    title: "Dashboard financeiro",
    description: "Conecte contas, fluxo de caixa e análise gerencial em um centro financeiro claro e moderno.",
    metrics: [
      { label: "Receber no mês", value: "R$ 184 mil", description: "Títulos simulados em aberto dentro do período atual." },
      { label: "Pagar no mês", value: "R$ 96 mil", description: "Compromissos previstos para liquidação financeira." },
      { label: "Saldo projetado", value: "R$ 88 mil", description: "Projeção líquida com base nas entradas e saídas mockadas." },
    ],
    spotlightTitle: "Finanças operadas com mais previsibilidade e menos ruído.",
    spotlightDescription: "O módulo consolida compromissos, indicadores e visão de caixa em uma navegação objetiva para decisões rápidas.",
    highlights: [
      "Contas a pagar e a receber separadas por contexto.",
      "Fluxo de caixa com leitura dedicada.",
      "Dashboards e relatórios disponíveis no mesmo ecossistema.",
    ],
  },
  usuarios: {
    title: "Dashboard de usuários",
    description: "Organize acesso, perfis e auditoria de uso com uma navegação preparada para governança.",
    metrics: [
      { label: "Usuários ativos", value: "64", description: "Contas com uso recente no ambiente administrativo." },
      { label: "Perfis configurados", value: "9", description: "Estruturas de acesso definidas para as áreas internas." },
      { label: "Eventos de log", value: "182", description: "Registros recentes de troca e atividade no sistema." },
    ],
    spotlightTitle: "Governança simples para times e permissões.",
    spotlightDescription: "Concentre perfis, auditoria e gestão de troca de usuários sem espalhar a administração do ambiente.",
    highlights: [
      "Perfis separados por responsabilidade.",
      "Troca de usuário com acesso rápido.",
      "Logs e relatórios acessíveis pelo mesmo padrão.",
    ],
  },
  logistica: {
    title: "Dashboard de logística",
    description: "Acompanhe rastreamento, fretes e despachos com foco em execução e previsibilidade operacional.",
    metrics: [
      { label: "Entregas ativas", value: "52", description: "Processos logísticos em curso no período atual." },
      { label: "Fretes cotados", value: "14", description: "Cotações recentes em avaliação operacional." },
      { label: "Despachos pendentes", value: "7", description: "Saídas aguardando conferência ou expedição." },
    ],
    spotlightTitle: "Logística com navegação clara entre despacho, frete e rastreamento.",
    spotlightDescription: "O módulo foi organizado para leitura rápida dos fluxos operacionais sem excesso de camadas visuais.",
    highlights: [
      "Rastreamento e despacho em rotas separadas.",
      "Fretes visíveis com contexto imediato.",
      "Relatórios consolidados para gestão logística.",
    ],
  },
  configuracoes: {
    title: "Dashboard de configurações",
    description: "Centralize parâmetros do ambiente, integrações e suporte da operação em uma navegação clara.",
    metrics: [
      { label: "Parâmetros ativos", value: "38", description: "Configurações operacionais vigentes no ambiente." },
      { label: "Integrações conectadas", value: "6", description: "Serviços externos já simulados na aplicação." },
      { label: "Itens de ajuda", value: "24", description: "Conteúdos base para suporte e orientação interna." },
    ],
    spotlightTitle: "Configurações organizadas para administrar o sistema com segurança.",
    spotlightDescription: "Use este espaço para concentrar ajustes institucionais, ajuda e integrações sem quebrar a consistência visual do produto.",
    highlights: [
      "Empresa, ajuda e integrações em fluxos separados.",
      "Relatórios dedicados à camada administrativa.",
      "Estrutura pronta para parametrização futura.",
    ],
  },
};

export const moduleCollections: Partial<
  Record<ModuleKey, Record<string, CollectionPageConfig>>
> = {
  cadastros: {
    clientes: records("Clientes", "Gerencie a carteira comercial e a organização dos registros principais de relacionamento.", "Novo cliente", ["Cliente", "Segmento", "Cidade", "Status"], [
      { id: "C1", c1: "Acme Brasil", c2: "Indústria", c3: "Campinas", status: "Ativo" },
      { id: "C2", c1: "Nova Horizonte", c2: "Serviços", c3: "São Paulo", status: "Ativo" },
      { id: "C3", c1: "Orbital Tech", c2: "Tecnologia", c3: "Curitiba", status: "Em análise" },
    ]),
    funcionarios: records("Funcionários", "Estruture equipes, funções e vínculos operacionais do sistema.", "Novo funcionário", ["Nome", "Área", "Cargo", "Status"], [
      { id: "F1", c1: "Ana Ribeiro", c2: "Comercial", c3: "Executiva de contas", status: "Ativo" },
      { id: "F2", c1: "Carlos Mota", c2: "Financeiro", c3: "Analista", status: "Ativo" },
      { id: "F3", c1: "Luiza Prado", c2: "Logística", c3: "Coordenação", status: "Férias" },
    ]),
    leads: records("Leads", "Acompanhe oportunidades em qualificação e priorize contatos comerciais.", "Novo lead", ["Lead", "Origem", "Responsável", "Status"], [
      { id: "L1", c1: "Grupo Delta", c2: "Site", c3: "Equipe SDR", status: "Novo" },
      { id: "L2", c1: "Mercado Alfa", c2: "Campanha", c3: "Juliana", status: "Qualificando" },
      { id: "L3", c1: "Prime Labs", c2: "Indicação", c3: "Rafael", status: "Proposta" },
    ]),
    tickets: records("Tickets", "Organize solicitações internas e demandas ligadas ao cadastro das entidades.", "Novo ticket", ["Ticket", "Categoria", "Responsável", "Status"], [
      { id: "T1", c1: "Ajuste de documento", c2: "Cliente", c3: "Backoffice", status: "Em aberto" },
      { id: "T2", c1: "Vincular funcionário", c2: "RH", c3: "Operações", status: "Em andamento" },
      { id: "T3", c1: "Lead duplicado", c2: "Leads", c3: "Comercial", status: "Concluído" },
    ]),
  },
  vendas: {
    pedidos: records("Pedidos", "Acompanhe pedidos ativos e a evolução operacional das vendas.", "Novo pedido", ["Pedido", "Cliente", "Valor", "Status"], [
      { id: "P1", c1: "#948", c2: "Acme Brasil", c3: "R$ 18.400", status: "Aprovado" },
      { id: "P2", c1: "#952", c2: "Orbital Tech", c3: "R$ 7.920", status: "Separação" },
      { id: "P3", c1: "#956", c2: "Mercado Alfa", c3: "R$ 4.300", status: "Pendente" },
    ]),
    orcamentos: records("Orçamentos", "Conduza propostas comerciais com leitura clara por estágio.", "Novo orçamento", ["Orçamento", "Cliente", "Valor", "Status"], [
      { id: "O1", c1: "OR-201", c2: "Grupo Delta", c3: "R$ 22.100", status: "Enviado" },
      { id: "O2", c1: "OR-202", c2: "Nova Horizonte", c3: "R$ 9.450", status: "Em revisão" },
      { id: "O3", c1: "OR-203", c2: "Prime Labs", c3: "R$ 31.800", status: "Aprovado" },
    ]),
    historico: records("Histórico de vendas", "Consulte negociações finalizadas e eventos relevantes do módulo comercial.", "Registrar histórico", ["Registro", "Cliente", "Período", "Status"], [
      { id: "H1", c1: "Renovação anual", c2: "Acme Brasil", c3: "Mar/2026", status: "Concluído" },
      { id: "H2", c1: "Compra recorrente", c2: "Orbital Tech", c3: "Fev/2026", status: "Concluído" },
      { id: "H3", c1: "Negociação encerrada", c2: "Prime Labs", c3: "Jan/2026", status: "Arquivado" },
    ]),
  },
  financeiro: {
    "contas-pagar": records("Contas a pagar", "Gerencie obrigações e compromissos financeiros previstos para liquidação.", "Nova conta", ["Título", "Fornecedor", "Vencimento", "Status"], [
      { id: "CP1", c1: "Licença de software", c2: "Cloud Tools", c3: "12/04", status: "Em aberto" },
      { id: "CP2", c1: "Frete interestadual", c2: "Log Express", c3: "15/04", status: "Aprovado" },
      { id: "CP3", c1: "Compra de suprimentos", c2: "Office Plus", c3: "18/04", status: "Programado" },
    ]),
    "contas-receber": records("Contas a receber", "Acompanhe entradas previstas e títulos vinculados ao comercial.", "Nova cobrança", ["Título", "Cliente", "Vencimento", "Status"], [
      { id: "CR1", c1: "Fatura abril", c2: "Acme Brasil", c3: "10/04", status: "Em aberto" },
      { id: "CR2", c1: "Renovação anual", c2: "Orbital Tech", c3: "14/04", status: "Confirmado" },
      { id: "CR3", c1: "Pedido especial", c2: "Prime Labs", c3: "20/04", status: "Atrasado" },
    ]),
    "fluxo-caixa": records("Fluxo de caixa", "Visualize entradas e saídas consolidadas para leitura rápida do período.", "Novo lançamento", ["Movimento", "Tipo", "Período", "Status"], [
      { id: "FC1", c1: "Entrada comercial", c2: "Recebimento", c3: "Semana atual", status: "Projetado" },
      { id: "FC2", c1: "Pagamento fornecedor", c2: "Saída", c3: "Semana atual", status: "Confirmado" },
      { id: "FC3", c1: "Custo logístico", c2: "Saída", c3: "Próxima semana", status: "Previsto" },
    ]),
    dashboards: records("Dashboards financeiros", "Agrupe leituras executivas e painéis operacionais do módulo.", "Novo dashboard", ["Painel", "Foco", "Atualização", "Status"], [
      { id: "D1", c1: "Recebíveis", c2: "Entradas", c3: "15 min", status: "Ativo" },
      { id: "D2", c1: "Pagamentos", c2: "Saídas", c3: "15 min", status: "Ativo" },
      { id: "D3", c1: "Projeções", c2: "Caixa", c3: "1 hora", status: "Em revisão" },
    ]),
  },
  usuarios: {
    perfis: records("Perfis de acesso", "Gerencie grupos de permissão e responsabilidades por área.", "Novo perfil", ["Perfil", "Área", "Escopo", "Status"], [
      { id: "U1", c1: "Administradores", c2: "Diretoria", c3: "Total", status: "Ativo" },
      { id: "U2", c1: "Operações", c2: "Estoque", c3: "Parcial", status: "Ativo" },
      { id: "U3", c1: "Financeiro", c2: "Financeiro", c3: "Restrito", status: "Em revisão" },
    ]),
    "trocar-usuario": records("Troca de usuário", "Acesse sessões recentes e simulações de contexto para suporte operacional.", "Trocar usuário", ["Usuário", "Perfil", "Último acesso", "Status"], [
      { id: "TU1", c1: "Mariana Costa", c2: "Administradores", c3: "Hoje 09:18", status: "Online" },
      { id: "TU2", c1: "Ricardo Alves", c2: "Operações", c3: "Hoje 08:41", status: "Disponível" },
      { id: "TU3", c1: "Paula Lima", c2: "Financeiro", c3: "Ontem 17:20", status: "Inativo" },
    ]),
    logs: records("Logs de atividade", "Consulte eventos de acesso e movimentações relevantes do ambiente administrativo.", "Exportar logs", ["Evento", "Usuário", "Momento", "Status"], [
      { id: "LG1", c1: "Login validado", c2: "Mariana Costa", c3: "Hoje 09:18", status: "Sucesso" },
      { id: "LG2", c1: "Troca de perfil", c2: "Ricardo Alves", c3: "Hoje 08:54", status: "Auditado" },
      { id: "LG3", c1: "Tentativa bloqueada", c2: "Conta externa", c3: "Ontem 22:14", status: "Alerta" },
    ]),
  },
  logistica: {
    rastreamento: records("Rastreamento", "Monitore entregas, checkpoints e sinais de atraso logístico.", "Novo rastreio", ["Carga", "Destino", "Previsão", "Status"], [
      { id: "R1", c1: "Pedido #948", c2: "Campinas", c3: "Hoje 14:30", status: "Em rota" },
      { id: "R2", c1: "Pedido #952", c2: "Sorocaba", c3: "Hoje 16:10", status: "Em rota" },
      { id: "R3", c1: "Pedido #956", c2: "Curitiba", c3: "Amanhã 11:00", status: "Atraso" },
    ]),
    fretes: records("Fretes", "Gerencie cotações e contratos ligados ao deslocamento de mercadorias.", "Novo frete", ["Frete", "Transportadora", "Faixa", "Status"], [
      { id: "FR1", c1: "Cotação Sul", c2: "Log Express", c3: "R$ 1.800", status: "Em cotação" },
      { id: "FR2", c1: "Contrato SP", c2: "Rápido Cargo", c3: "R$ 980", status: "Ativo" },
      { id: "FR3", c1: "Urgência interior", c2: "Via Prime", c3: "R$ 1.250", status: "Aprovado" },
    ]),
    despachos: records("Despachos", "Acompanhe preparação, conferência e saída das cargas.", "Novo despacho", ["Despacho", "Origem", "Janela", "Status"], [
      { id: "D1", c1: "EXP-302", c2: "CD principal", c3: "Hoje 13:00", status: "Separando" },
      { id: "D2", c1: "EXP-304", c2: "CD principal", c3: "Hoje 15:00", status: "Conferência" },
      { id: "D3", c1: "EXP-305", c2: "Filial Sul", c3: "Amanhã 09:00", status: "Agendado" },
    ]),
  },
  configuracoes: {
    empresa: records("Empresa", "Consolide dados institucionais e parâmetros principais do ambiente.", "Editar empresa", ["Parâmetro", "Valor", "Escopo", "Status"], [
      { id: "E1", c1: "Razão social", c2: "Meu Negócio LTDA", c3: "Institucional", status: "Ativo" },
      { id: "E2", c1: "Fuso operacional", c2: "America/Sao_Paulo", c3: "Sistema", status: "Ativo" },
      { id: "E3", c1: "Moeda padrão", c2: "BRL", c3: "Financeiro", status: "Ativo" },
    ]),
    ajuda: records("Ajuda", "Organize materiais de suporte e orientação operacional para o time.", "Novo conteúdo", ["Conteúdo", "Tipo", "Atualização", "Status"], [
      { id: "A1", c1: "Fluxo de estoque", c2: "Guia", c3: "Hoje", status: "Publicado" },
      { id: "A2", c1: "Onboarding comercial", c2: "Checklist", c3: "Ontem", status: "Publicado" },
      { id: "A3", c1: "FAQ financeiro", c2: "Base de conhecimento", c3: "3 dias", status: "Em revisão" },
    ]),
    integracoes: records("Integrações", "Monitore conexões externas e o estado operacional de cada integração.", "Nova integração", ["Integração", "Canal", "Último sync", "Status"], [
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
      { label: "Itens monitorados", value: String(rows.length), description: "Registros mockados visíveis na visão principal." },
      { label: "Atualização", value: "Hoje", description: "Conteúdo base alinhado ao módulo selecionado." },
      { label: "Próxima ação", value: actionLabel, description: "CTA principal sugerida para o fluxo atual." },
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
