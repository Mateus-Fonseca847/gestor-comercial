import type { ModuleMenuData } from "@/components/navigation/module-mega-menu";

export type ModuleNavItem = {
  label: string;
  href: string;
  behavior: "menu" | "link";
  menu?: ModuleMenuData;
  priority?: "primary" | "secondary";
};

export const moduleNavigation: ModuleNavItem[] = [
  {
    label: "Estoque",
    href: "/estoque",
    behavior: "menu",
    priority: "primary",
    menu: {
      sections: [
        {
          title: "principal",
          items: [
            { title: "Resumo", href: "/estoque" },
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
    label: "Clientes",
    href: "/cadastros/clientes",
    behavior: "link",
    priority: "primary",
  },
  {
    label: "Vendas",
    href: "/vendas",
    behavior: "menu",
    priority: "primary",
    menu: {
      sections: [
        {
          title: "principal",
          items: [
            { title: "Resumo", href: "/vendas" },
            { title: "Nova venda", href: "/vendas/nova", badge: "Novo" },
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
    priority: "primary",
    menu: {
      sections: [
        {
          title: "principal",
          items: [
            { title: "Resumo", href: "/financeiro" },
            { title: "Contas a pagar", href: "/financeiro/contas-pagar" },
            { title: "Contas a receber", href: "/financeiro/contas-receber" },
            { title: "Fluxo de caixa", href: "/financeiro/fluxo-caixa" },
            { title: "Relatórios", href: "/financeiro/relatorios" },
          ],
        },
      ],
    },
  },
  {
    label: "Tarefas",
    href: "/tarefas",
    behavior: "link",
    priority: "primary",
  },
];
