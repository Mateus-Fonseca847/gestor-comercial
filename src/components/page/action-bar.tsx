import { ArrowUpRight, Download, Plus } from "lucide-react";

type ActionBarItem = {
  label: string;
  tone?: "primary" | "neutral";
};

type ActionBarProps = {
  items: ActionBarItem[];
};

export function ActionBar({ items }: ActionBarProps) {
  return (
    <section className="flex flex-wrap items-center gap-3 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 shadow-[var(--shadow-sm)]">
      {items.map((item) => (
        <button
          key={item.label}
          type="button"
          className={[
            "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md",
            item.tone === "neutral"
              ? "border border-[var(--color-border)] bg-white text-[var(--color-text)] hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-alt)]"
              : "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-strong)]",
          ].join(" ")}
        >
          {item.tone === "neutral" ? (
            item.label.toLowerCase().includes("export") ? (
              <Download className="h-4 w-4" />
            ) : (
              <ArrowUpRight className="h-4 w-4" />
            )
          ) : (
            <Plus className="h-4 w-4" />
          )}
          {item.label}
        </button>
      ))}
    </section>
  );
}
