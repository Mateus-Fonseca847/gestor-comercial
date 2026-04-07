import { Funnel, Search } from "lucide-react";

type FilterChip = {
  label: string;
  active?: boolean;
};

type FilterBarProps = {
  placeholder?: string;
  chips?: FilterChip[];
};

export function FilterBar({
  placeholder = "Buscar registros",
  chips = [],
}: FilterBarProps) {
  return (
    <section className="flex flex-col gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 shadow-[var(--shadow-sm)]">
      {chips.length ? (
        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              className={[
                "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm",
                chip.active
                  ? "border-[var(--color-primary)] bg-[rgba(0,74,173,0.08)] text-[var(--color-primary)]"
                  : "border-[var(--color-border)] bg-white text-[var(--color-text-soft)] hover:bg-[var(--color-surface-alt)]",
              ].join(" ")}
            >
              <Funnel className="h-4 w-4" />
              {chip.label}
            </button>
          ))}
        </div>
      ) : null}

      <label className="flex h-12 w-full items-center gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-[var(--color-text-soft)] transition-all focus-within:border-[var(--color-primary)] focus-within:bg-white">
        <Search className="h-4 w-4 shrink-0" />
        <input
          type="search"
          placeholder={placeholder}
          className="w-full border-0 bg-transparent text-sm text-[var(--color-text)] outline-none placeholder:text-[var(--color-text-muted)]"
        />
      </label>
    </section>
  );
}
