import { ArrowRight } from "lucide-react";
import Link from "next/link";

type ActivityItem = {
  id: string;
  title: string;
  summary?: string;
  meta: string;
  aside?: React.ReactNode;
};

export function DashboardActivityList({
  title,
  description,
  items,
  href,
  emptyMessage = "Nenhum registro encontrado.",
}: {
  title: string;
  description: string;
  items: ActivityItem[];
  href?: string;
  emptyMessage?: string;
}) {
  return (
    <section className="rounded-[32px] border border-[rgba(15,23,42,0.08)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(248,250,252,0.96)_100%)] p-6 shadow-[0_18px_44px_rgba(15,23,42,0.08)] md:p-7">
      <div className="mb-6 flex items-start justify-between gap-4 border-b border-[rgba(148,163,184,0.18)] pb-4">
        <div className="space-y-1.5">
          <h2 className="text-[1.05rem] font-semibold tracking-tight text-[var(--color-text)]">
            {title}
          </h2>
          <p className="max-w-xl text-sm leading-6 text-[var(--color-text-soft)]">{description}</p>
        </div>
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full bg-[rgba(37,99,235,0.08)] px-3 py-2 text-sm font-medium text-[var(--color-primary)] transition-all duration-200 hover:bg-[rgba(37,99,235,0.12)]"
          >
            Ver tudo
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <div className="space-y-3.5">
        {items.length ? (
          items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-[24px] border border-[rgba(148,163,184,0.18)] bg-white/88 px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(15,23,42,0.06)] lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="space-y-1.5">
                <p className="text-[0.98rem] font-semibold text-[var(--color-text)]">{item.title}</p>
                {item.summary ? (
                  <p className="text-sm leading-6 text-[var(--color-text)]">{item.summary}</p>
                ) : null}
                <p className="text-sm text-[var(--color-text-soft)]">{item.meta}</p>
              </div>
              {item.aside ? <div className="flex items-center gap-2">{item.aside}</div> : null}
            </div>
          ))
        ) : (
          <div className="rounded-[24px] border border-dashed border-[rgba(148,163,184,0.3)] bg-[rgba(248,250,252,0.88)] px-5 py-10 text-sm text-[var(--color-text-soft)]">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}
