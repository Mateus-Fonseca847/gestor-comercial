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
    label: "Home",
    href: "/",
    behavior: "link",
    priority: "primary",
  },
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
            { title: "Reposição", href: "/estoque/reposicao", badge: "Acompanhar" },
            { title: "Fornecedores", href: "/estoque/fornecedores" },
            { title: "Relatórios", href: "/estoque/relatorios" },
          ],
        },
        {
          title: "mais recursos",
          items: [
            { title: "Entradas", href: "/estoque/entradas" },
            { title: "Compras", href: "/estoque/compras" },
            { title: "Depósitos", href: "/estoque/depositos" },
            { title: "Transferências", href: "/estoque/transferencias" },
            { title: "Inventário", href: "/estoque/inventario" },
            { title: "Categorias", href: "/estoque/categorias" },
          ],
        },
      ],
    },
  },
  {
    label: "Clientes",
    href: "/cadastros",
    behavior: "menu",
    priority: "primary",
    menu: {
      sections: [
        {
          title: "principal",
          items: [
            { title: "Clientes", href: "/cadastros/clientes" },
            { title: "Leads", href: "/cadastros/leads", badge: "WhatsApp" },
            { title: "Tickets", href: "/cadastros/tickets" },
            { title: "Relatórios", href: "/cadastros/relatorios" },
          ],
        },
        {
          title: "cadastros",
          items: [
            { title: "Funcionários", href: "/cadastros/funcionarios" },
          ],
        },
      ],
    },
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
    priority: "secondary",
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
    label: "Logística",
    href: "/logistica",
    behavior: "menu",
    priority: "secondary",
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
    label: "Usuários",
    href: "/usuarios",
    behavior: "menu",
    priority: "secondary",
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
    label: "Configurações",
    href: "/configuracoes",
    behavior: "menu",
    priority: "secondary",
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
