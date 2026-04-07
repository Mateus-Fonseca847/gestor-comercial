"use client";

import { usePathname } from "next/navigation";
import { estoqueNavigationItems } from "@/modules/estoque/config/navigation";

export function useEstoqueNavigation() {
  const pathname = usePathname();

  return estoqueNavigationItems.map((item) => ({
    ...item,
    active:
      item.href === "/estoque"
        ? pathname === item.href
        : pathname.startsWith(item.href),
  }));
}
