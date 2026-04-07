"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GestifyHomeButton from "@/components/layout/gestify-home-button";
import { ModuleMegaMenu } from "@/components/navigation/module-mega-menu";
import { moduleNavigation } from "@/config/module-navigation";
import { navigationItems } from "@/config/navigation";

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-white/95 shadow-[var(--shadow-sm)] backdrop-blur">
      <div className="mx-auto flex h-[var(--header-height)] max-w-[1800px] items-center gap-3 px-2 sm:px-3 lg:px-4">
        <GestifyHomeButton />

        <nav className="flex min-w-0 flex-1 items-center justify-center gap-2 overflow-visible">
          {navigationItems.map((item) => {
            const isActive =
              item.behavior === "menu"
                ? item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href)
                : pathname === item.href;

            if (item.behavior === "menu") {
              const menuItem = moduleNavigation.find(
                (moduleItem) => moduleItem.href === item.href,
              );

              if (!menuItem?.menu) {
                return null;
              }

              return (
                <div key={item.href}>
                  <ModuleMegaMenu
                    triggerLabel={item.label}
                    active={isActive}
                    data={menuItem.menu}
                  />
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "group relative flex shrink-0 items-center whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[rgba(0,74,173,0.08)] text-[var(--color-primary)]"
                    : "text-[var(--color-text-soft)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-primary)]",
                ].join(" ")}
              >
                <span>{item.label}</span>
                <span
                  className={[
                    "absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-[var(--color-primary)] transition-opacity duration-200",
                    isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                  ].join(" ")}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-[0_0_auto] items-center justify-end gap-2">
          <label className="flex h-11 w-[280px] items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-[var(--color-text-soft)] transition-all focus-within:border-[var(--color-primary)] focus-within:bg-white">
            <Search className="h-4 w-4 shrink-0" />
            <input
              type="search"
              placeholder="Pesquisar"
              className="w-full border-0 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
            />
          </label>
        </div>
      </div>
    </header>
  );
}
