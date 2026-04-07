import { AppHeader } from "@/components/layout/app-header";

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <AppHeader />
      <main className="mx-auto w-full max-w-[1680px] px-4 pb-10 pt-[calc(var(--header-height)+2rem)] sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
