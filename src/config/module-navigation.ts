import type { ModuleMenuData } from "@/components/navigation/module-mega-menu";

export type ModuleNavItem = {
  label: string;
  href: string;
  behavior: "menu";
  menu: ModuleMenuData;
};

export const moduleNavigation: ModuleNavItem[] = [
  {
    label: "Estoque",
    href: "/estoque",
    behavior: "menu",
    menu: {
      sections: [
        {
          title: "principal",
          items: [
            { title: "Dashboard", href: "/estoque" },
            { title: "Produtos", href: "/estoque/produtos" },
            { title: "Movimentações", href: "/estoque/movimentacoes", badge: "Hoje" },
            { title: "Fornecedores", href: "/estoque/fornecedores" },
            { title: "Relatórios", href: "/estoque/relatorios" },
          ],
        },
      ],
    },
  },
  {
    label: "Cadastros",
    href: "/cadastros",
    behavior: "menu",
    menu: {
      sections: [
        {
          title: "principal",
          items: [
            { title: "Clientes", href: "/cadastros/clientes" },
            { title: "Funcionários", href: "/cadastros/funcionarios" },
            { title: "Leads", href: "/cadastros/leads" },
            { title: "Tickets", href: "/cadastros/tickets" },
            { title: "Relatórios", href: "/cadastros/relatorios" },
          ],
        },
      ],
    },
  },
  {
    label: "Vendas",
    href: "/vendas",
    behavior: "menu",
    menu: {
      sections: [
        {
          title: "principal",
          items: [
            { title: "Pedidos", href: "/vendas/pedidos" },
            { title: "Orçamentos", href: "/vendas/orcamentos" },
            { title: "Histórico", href: "/vendas/historico" },
            { title: "Relatórios", href: "/vendas/relatorios" },
          ],
        },
      ],
    },
  },
  {
    label: "Financeiro",
    href: "/financeiro",
    behavior: "menu",
    menu: {
      sections: [
        {
          title: "principal",
          items: [
            { title: "Contas a pagar", href: "/financeiro/contas-pagar" },
            { title: "Contas a receber", href: "/financeiro/contas-receber" },
            { title: "Fluxo de caixa", href: "/financeiro/fluxo-caixa" },
            { title: "Dashboards", href: "/financeiro/dashboards" },
            { title: "Relatórios", href: "/financeiro/relatorios" },
          ],
        },
      ],
    },
  },
  {
    label: "Usuários",
    href: "/usuarios",
    behavior: "menu",
    menu: {
      sections: [
        {
          title: "principal",
          items: [
            { title: "Perfis", href: "/usuarios/perfis" },
            { title: "Trocar usuário", href: "/usuarios/trocar-usuario" },
            { title: "Logs", href: "/usuarios/logs" },
            { title: "Relatórios", href: "/usuarios/relatorios" },
          ],
        },
      ],
    },
  },
  {
    label: "Logística",
    href: "/logistica",
    behavior: "menu",
    menu: {
      sections: [
        {
          title: "principal",
          items: [
            { title: "Rastreamento", href: "/logistica/rastreamento" },
            { title: "Fretes", href: "/logistica/fretes" },
            { title: "Despachos", href: "/logistica/despachos" },
            { title: "Relatórios", href: "/logistica/relatorios" },
          ],
        },
      ],
    },
  },
  {
    label: "Configurações",
    href: "/configuracoes",
    behavior: "menu",
    menu: {
      sections: [
        {
          title: "principal",
          items: [
            { title: "Empresa", href: "/configuracoes/empresa" },
            { title: "Ajuda", href: "/configuracoes/ajuda" },
            { title: "Integrações", href: "/configuracoes/integracoes" },
            { title: "Relatórios", href: "/configuracoes/relatorios" },
          ],
        },
      ],
    },
  },
];
