import { EstoqueNavItem } from "@/modules/estoque/types/estoque.types";

export const estoqueNavigationItems: EstoqueNavItem[] = [
  { label: "Dashboard", href: "/estoque" },
  { label: "Produtos", href: "/estoque/produtos" },
  { label: "Categorias", href: "/estoque/categorias" },
  { label: "Fornecedores", href: "/estoque/fornecedores" },
  { label: "Movimentações", href: "/estoque/movimentacoes" },
  { label: "Inventário", href: "/estoque/inventario" },
  { label: "Depósitos", href: "/estoque/depositos" },
  { label: "Transferências", href: "/estoque/transferencias" },
  { label: "Compras", href: "/estoque/compras" },
  { label: "Entradas", href: "/estoque/entradas" },
  { label: "Relatórios", href: "/estoque/relatorios" },
];
