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
    <section className="ui-surface-1 p-6">
      <div className="mb-5 border-b ui-divider pb-4">
        <h2 className="ui-section-title">{title}</h2>
        <p className="ui-body mt-1">{description}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.label}
              href={item.href}
              className="ui-surface-3 flex items-start gap-4 px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(21,93,252,0.18)] hover:bg-white hover:shadow-sm"
            >
              <div className="ui-icon-chip">
                <Icon className="h-5 w-5" />
              </div>
              <div className="space-y-1">
                <p className="ui-card-title-strong">{item.label}</p>
                <p className="ui-body">{item.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
