"use client";

import { type FormEvent, useEffect, useRef, useState } from "react";
import {
  CircleHelp,
  LogOut,
  Search,
  Settings2,
  UserRound,
  UserRoundCog,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import GestifyHomeButton from "@/components/layout/gestify-home-button";
import { ModuleMegaMenu } from "@/components/navigation/module-mega-menu";
import { moduleNavigation } from "@/config/module-navigation";
import { navigationItems } from "@/config/navigation";

type AuthMode = "login" | "cadastro";

type MockUser = {
  nome: string;
  email: string;
};

const iconButtonClass =
  "flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] text-[var(--color-text-soft)] transition-all duration-200 hover:border-[var(--color-primary)] hover:bg-white hover:text-[var(--color-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(21,93,252,0.18)]";

const menuItemClass =
  "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-[var(--color-text)] transition-all duration-200 hover:bg-[var(--color-surface-alt)] hover:text-[var(--color-primary)]";

export function AppHeader() {
  const pathname = usePathname();
  const settingsRef = useRef<HTMLDivElement | null>(null);
  const userRef = useRef<HTMLDivElement | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;

      if (settingsRef.current && !settingsRef.current.contains(target)) {
        setIsSettingsOpen(false);
      }

      if (
        currentUser &&
        userRef.current &&
        !userRef.current.contains(target)
      ) {
        setIsUserMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsSettingsOpen(false);
        setIsUserMenuOpen(false);
        setIsAuthModalOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [currentUser]);

  function openUserAccess(mode: AuthMode) {
    setAuthMode(mode);
    setIsUserMenuOpen(false);
    setIsAuthModalOpen(true);
  }

  function handleLoginSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCurrentUser({
      nome: loginEmail.split("@")[0] || "Conta da loja",
      email: loginEmail,
    });
    setIsAuthModalOpen(false);
    setLoginPassword("");
  }

  function handleRegisterSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setCurrentUser({
      nome: registerName || "Nova conta",
      email: registerEmail,
    });
    setIsAuthModalOpen(false);
    setRegisterPassword("");
  }

  function handleLogout() {
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    setLoginEmail("");
    setLoginPassword("");
    setRegisterName("");
    setRegisterEmail("");
    setRegisterPassword("");
  }

  const userInitials = currentUser?.nome
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  return (
    <>
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

            <div className="relative" ref={settingsRef}>
              <button
                type="button"
                aria-label="Abrir ajuda e configurações"
                aria-expanded={isSettingsOpen}
                onClick={() => setIsSettingsOpen((value) => !value)}
                className={iconButtonClass}
              >
                <Settings2 className="h-5 w-5" />
              </button>

              {isSettingsOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-64 rounded-[24px] border border-[var(--color-border)] bg-white p-3 shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
                  <div className="mb-2 px-2 pb-2">
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      Acessos rápidos
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      Ajustes e apoio da operação.
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/configuracoes/ajuda"
                      className={menuItemClass}
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      <CircleHelp className="h-4 w-4 text-[var(--color-primary)]" />
                      <span>Ajuda</span>
                    </Link>
                    <Link
                      href="/configuracoes"
                      className={menuItemClass}
                      onClick={() => setIsSettingsOpen(false)}
                    >
                      <Settings2 className="h-4 w-4 text-[var(--color-primary)]" />
                      <span>Configurações</span>
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>

            <div className="relative" ref={userRef}>
              <button
                type="button"
                aria-label="Abrir conta do usuário"
                aria-expanded={currentUser ? isUserMenuOpen : isAuthModalOpen}
                onClick={() => {
                  if (currentUser) {
                    setIsUserMenuOpen((value) => !value);
                    return;
                  }

                  openUserAccess("login");
                }}
                className={[
                  iconButtonClass,
                  currentUser
                    ? "w-auto gap-2 px-3 text-[var(--color-text)]"
                    : "",
                ].join(" ")}
              >
                {currentUser ? (
                  <>
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-semibold text-white">
                      {userInitials || "U"}
                    </span>
                    <span className="hidden text-sm font-medium sm:inline">
                      {currentUser.nome}
                    </span>
                  </>
                ) : (
                  <UserRound className="h-5 w-5" />
                )}
              </button>

              {currentUser && isUserMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+0.75rem)] z-50 w-72 rounded-[24px] border border-[var(--color-border)] bg-white p-3 shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
                  <div className="mb-3 rounded-2xl border border-[rgba(21,93,252,0.12)] bg-[rgba(21,93,252,0.05)] p-3">
                    <p className="text-sm font-semibold text-[var(--color-text)]">
                      {currentUser.nome}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {currentUser.email}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <Link
                      href="/usuarios/perfil"
                      className={menuItemClass}
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <UserRound className="h-4 w-4 text-[var(--color-primary)]" />
                      <span>Meu perfil</span>
                    </Link>
                    <button
                      type="button"
                      className={menuItemClass}
                      onClick={() => openUserAccess("login")}
                    >
                      <UserRoundCog className="h-4 w-4 text-[var(--color-primary)]" />
                      <span>Trocar perfil</span>
                    </button>
                    <button
                      type="button"
                      className={menuItemClass}
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 text-[var(--color-primary)]" />
                      <span>Sair</span>
                    </button>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      {isAuthModalOpen ? (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(15,23,42,0.28)] p-4 backdrop-blur-sm"
          onClick={() => setIsAuthModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-[28px] border border-[var(--color-border)] bg-white p-5 shadow-[0_32px_80px_rgba(15,23,42,0.18)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-lg font-semibold text-[var(--color-text)]">
                  {authMode === "login" ? "Entrar na conta" : "Criar acesso"}
                </p>
                <p className="text-sm text-[var(--color-text-muted)]">
                  {authMode === "login"
                    ? "Acesse sua operação em poucos segundos."
                    : "Prepare o acesso da loja para uso futuro."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(false)}
                className="rounded-xl border border-[var(--color-border)] px-3 py-2 text-xs font-medium text-[var(--color-text-soft)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
              >
                Fechar
              </button>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl bg-[var(--color-surface-alt)] p-1">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
                className={[
                  "rounded-2xl px-3 py-2 text-sm font-medium transition-all",
                  authMode === "login"
                    ? "bg-white text-[var(--color-primary)] shadow-[0_6px_18px_rgba(15,23,42,0.08)]"
                    : "text-[var(--color-text-soft)] hover:text-[var(--color-primary)]",
                ].join(" ")}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setAuthMode("cadastro")}
                className={[
                  "rounded-2xl px-3 py-2 text-sm font-medium transition-all",
                  authMode === "cadastro"
                    ? "bg-white text-[var(--color-primary)] shadow-[0_6px_18px_rgba(15,23,42,0.08)]"
                    : "text-[var(--color-text-soft)] hover:text-[var(--color-primary)]",
                ].join(" ")}
              >
                Cadastro
              </button>
            </div>

            {authMode === "login" ? (
              <form className="space-y-3" onSubmit={handleLoginSubmit}>
                <label className="block space-y-1">
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    E-mail
                  </span>
                  <input
                    required
                    type="email"
                    value={loginEmail}
                    onChange={(event) => setLoginEmail(event.target.value)}
                    className="h-11 w-full rounded-2xl border border-[var(--color-border)] px-4 text-sm text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)]"
                    placeholder="voce@lojista.com"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    Senha
                  </span>
                  <input
                    required
                    type="password"
                    value={loginPassword}
                    onChange={(event) => setLoginPassword(event.target.value)}
                    className="h-11 w-full rounded-2xl border border-[var(--color-border)] px-4 text-sm text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)]"
                    placeholder="Digite sua senha"
                  />
                </label>
                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center rounded-2xl bg-[var(--color-primary)] px-4 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary-strong)]"
                >
                  Entrar
                </button>
              </form>
            ) : (
              <form className="space-y-3" onSubmit={handleRegisterSubmit}>
                <label className="block space-y-1">
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    Nome
                  </span>
                  <input
                    required
                    type="text"
                    value={registerName}
                    onChange={(event) => setRegisterName(event.target.value)}
                    className="h-11 w-full rounded-2xl border border-[var(--color-border)] px-4 text-sm text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)]"
                    placeholder="Nome de quem vai acessar"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    E-mail
                  </span>
                  <input
                    required
                    type="email"
                    value={registerEmail}
                    onChange={(event) => setRegisterEmail(event.target.value)}
                    className="h-11 w-full rounded-2xl border border-[var(--color-border)] px-4 text-sm text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)]"
                    placeholder="loja@exemplo.com"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-sm font-medium text-[var(--color-text)]">
                    Senha
                  </span>
                  <input
                    required
                    type="password"
                    value={registerPassword}
                    onChange={(event) => setRegisterPassword(event.target.value)}
                    className="h-11 w-full rounded-2xl border border-[var(--color-border)] px-4 text-sm text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)]"
                    placeholder="Crie uma senha"
                  />
                </label>
                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center rounded-2xl bg-[var(--color-primary)] px-4 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary-strong)]"
                >
                  Criar conta
                </button>
              </form>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
