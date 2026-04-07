"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export type QuickActionItem = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export function QuickActionsPanel({
  title = "Ações rápidas",
  description = "Atalhos para acelerar a rotina da loja.",
  items,
}: {
  title?: string;
  description?: string;
  items: QuickActionItem[];
}) {
  return (
    <section className="rounded-[30px] border border-[var(--color-border)]/90 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
      <div className="mb-5 border-b border-[var(--color-border)]/70 pb-4">
        <h2 className="text-lg font-semibold tracking-tight text-[var(--color-text)]">{title}</h2>
        <p className="mt-1 text-sm leading-6 text-[var(--color-text-soft)]">{description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-start gap-4 rounded-[22px] border border-[var(--color-border)]/80 bg-[var(--color-surface-alt)] px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(0,74,173,0.18)] hover:bg-white hover:shadow-sm"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-[18px] border border-[rgba(0,74,173,0.08)] bg-[rgba(0,74,173,0.06)] text-[var(--color-primary)]">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="font-semibold text-[var(--color-text)]">{item.label}</p>
                <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                  {item.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
