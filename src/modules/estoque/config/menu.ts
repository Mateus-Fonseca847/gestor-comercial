import type { ModuleMenuData } from "@/components/navigation/module-mega-menu";

export const estoqueMenuData: ModuleMenuData = {
  sections: [
    {
      title: "Operação",
      items: [
        {
          title: "Dashboard",
          description: "Visão geral do módulo com alertas, atalhos e movimentações recentes.",
          href: "/estoque",
        },
        {
          title: "Produtos",
          description: "Catálogo, saldos, categorias e monitoramento do estoque atual.",
          href: "/estoque/produtos",
        },
      ],
    },
    {
      title: "Fluxos",
      items: [
        {
          title: "Movimentações",
          description: "Entradas, saídas e histórico operacional com contexto de origem.",
          href: "/estoque/movimentacoes",
          badge: "Hoje",
        },
        {
          title: "Fornecedores",
          description: "Parceiros de abastecimento, lead time e vínculo com compras.",
          href: "/estoque/fornecedores",
        },
      ],
    },
    {
      title: "Inteligência",
      items: [
        {
          title: "Relatórios",
          description: "Atalho para consolidar análise operacional e giro por período.",
          href: "/estoque/movimentacoes",
        },
      ],
    },
  ],
};
