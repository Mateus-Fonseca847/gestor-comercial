"use client";

import Link from "next/link";
import { useEstoqueNavigation } from "@/modules/estoque/hooks/use-estoque-navigation";

export function EstoqueModuleNav() {
  const items = useEstoqueNavigation();

  return (
    <nav className="rounded-[26px] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-3 shadow-[0_12px_30px_rgba(0,74,173,0.06)]">
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={[
              "rounded-full px-4 py-2 text-sm font-medium transition-colors",
              item.active
                ? "bg-[var(--color-primary)] text-white"
                : "text-[var(--color-text-soft)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-primary)]",
            ].join(" ")}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
