type ModulePageProps = {
  title: string;
  description: string;
};

export function ModulePage({ title, description }: ModulePageProps) {
  return (
    <section className="space-y-6">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_16px_40px_rgba(0,74,173,0.08)]">
        <div className="mb-4 flex items-center justify-between gap-4 border-b border-[var(--color-border)] pb-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--color-text-soft)]">
              Módulo
            </p>
            <h1 className="text-2xl font-semibold text-[var(--color-primary)]">
              {title}
            </h1>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-lg border border-[var(--color-border)] bg-[linear-gradient(180deg,#edf4ff_0%,#ffffff_100%)] p-5">
            <p className="text-sm leading-6 text-[var(--color-text)]">{description}</p>
          </div>

          <div className="rounded-lg border border-dashed border-[var(--color-accent)] bg-[var(--color-surface)] p-5">
            <p className="text-sm font-medium text-[var(--color-text-soft)]">
              Área reservada para funcionalidades futuras.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
