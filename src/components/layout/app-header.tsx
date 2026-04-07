"use client";

import { Bell, ChevronDown, HelpCircle, Search, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModuleMegaMenu } from "@/components/navigation/module-mega-menu";
import { moduleNavigation } from "@/config/module-navigation";
import { navigationItems } from "@/config/navigation";
import { estoqueNavigationItems } from "@/modules/estoque/config/navigation";

export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[var(--color-border)] bg-white/95 shadow-[var(--shadow-sm)] backdrop-blur">
      <div className="mx-auto flex h-[var(--header-height)] max-w-[1800px] items-center gap-3 px-2 sm:px-3 lg:px-4">
        <Link
          href="/estoque"
          className="flex shrink-0 items-center rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 shadow-[var(--shadow-sm)]"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-[var(--color-primary)]" />
            <div className="hidden sm:block">
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                Gestor
              </p>
              <p className="text-sm font-semibold text-[var(--color-text)]">
                Comercial
              </p>
            </div>
          </div>
        </Link>

        <nav className="flex min-w-0 flex-1 items-center justify-center gap-4 overflow-visible">
          {navigationItems.map((item) => {
            const isActive =
              item.behavior === "menu"
                ? pathname.startsWith(item.href)
                : pathname === item.href;

            if (item.behavior === "menu") {
              const menuItem = moduleNavigation.find(
                (moduleItem) => moduleItem.href === item.href,
              );

              if (!menuItem) {
                return null;
              }

              const menuData =
                item.href === "/estoque"
                  ? {
                      sections: [
                        {
                          title: "principal",
                          items: estoqueNavigationItems.map((entry) => ({
                            title: entry.label,
                            href: entry.href,
                          })),
                        },
                      ],
                    }
                  : menuItem.menu;

              return (
                <ModuleMegaMenu
                  key={item.href}
                  triggerLabel={item.label}
                  active={isActive}
                  data={menuData}
                />
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "group relative flex shrink-0 items-center gap-1 whitespace-nowrap rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-[rgba(0,74,173,0.08)] text-[var(--color-primary)]"
                    : "text-[var(--color-text-soft)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-primary)]",
                ].join(" ")}
              >
                <span>{item.label}</span>
                <ChevronDown className="h-4 w-4 text-[var(--color-accent)] transition-colors group-hover:text-[var(--color-primary)]" />
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

          <HeaderIconButton ariaLabel="Ajuda">
            <HelpCircle className="h-5 w-5" />
          </HeaderIconButton>

          <HeaderIconButton ariaLabel="Notificações">
            <Bell className="h-5 w-5" />
          </HeaderIconButton>

          <HeaderIconButton ariaLabel="Configurações">
            <Settings className="h-5 w-5" />
          </HeaderIconButton>
        </div>
      </div>
    </header>
  );
}

type HeaderIconButtonProps = {
  ariaLabel: string;
  children: React.ReactNode;
};

function HeaderIconButton({ ariaLabel, children }: HeaderIconButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-transparent text-[var(--color-text-soft)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--color-border)] hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-primary)]"
    >
      {children}
    </button>
  );
}

type IconProps = {
  className?: string;
};

function ChevronDownIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 7.5 10 12.5 15 7.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SearchIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M8.75 15a6.25 6.25 0 1 1 0-12.5 6.25 6.25 0 0 1 0 12.5ZM13.5 13.5 17.5 17.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function HelpIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 17.5a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M8.8 7.1a1.7 1.7 0 1 1 2.46 1.53c-.82.43-1.26.88-1.26 1.87"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      <circle cx="10" cy="13.35" r=".9" fill="currentColor" />
    </svg>
  );
}

function BellIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 3.25a3.25 3.25 0 0 0-3.25 3.25v1.12c0 .57-.18 1.13-.5 1.6l-1 1.45a1.5 1.5 0 0 0 1.24 2.33h7.02a1.5 1.5 0 0 0 1.24-2.33l-1-1.45a2.74 2.74 0 0 1-.5-1.6V6.5A3.25 3.25 0 0 0 10 3.25Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.2 15a1.9 1.9 0 0 0 3.6 0"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SettingsIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 20 20" fill="none" className={className} aria-hidden="true">
      <path
        d="m10 2.75 1 .58 1.15-.18.7.94 1.12.35.1 1.17.82.83-.35 1.12.35 1.12-.82.83-.1 1.17-1.12.35-.7.94-1.15-.18-1 .58-1-.58-1.15.18-.7-.94-1.12-.35-.1-1.17-.82-.83.35-1.12-.35-1.12.82-.83.1-1.17 1.12-.35.7-.94 1.15.18 1-.58Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="10" r="2.3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
