"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { label: "Dashboard", href: "/estoque" },
  { label: "Produtos", href: "/estoque/produtos" },
  { label: "Movimentações", href: "/estoque/movimentacoes" },
  { label: "Fornecedores", href: "/estoque/fornecedores" },
];

export function EstoqueSubnav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex flex-wrap gap-2 rounded-[26px] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] px-3 py-3 shadow-[0_12px_30px_rgba(0,74,173,0.06)]">
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition-all duration-150",
              isActive
                ? "bg-[var(--color-primary)] text-white shadow-[0_10px_20px_rgba(0,74,173,0.2)]"
                : "text-[var(--color-text-soft)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-primary)]",
            ].join(" ")}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
