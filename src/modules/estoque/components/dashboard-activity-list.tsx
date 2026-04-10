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
    <section className="ui-surface-1 p-6 md:p-7">
      <div className="mb-6 flex items-start justify-between gap-4 border-b ui-divider pb-4">
        <div className="space-y-1.5">
          <h2 className="ui-section-title">{title}</h2>
          <p className="ui-body max-w-xl">{description}</p>
        </div>
        {href ? (
          <Link
            href={href}
            className="ui-brand-badge inline-flex items-center gap-2 transition-all duration-200 hover:border-[rgba(21,93,252,0.28)] hover:bg-[rgba(21,93,252,0.14)]"
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
              className="ui-surface-3 ui-interactive-item flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
            >
              <div className="space-y-1.5">
                <p className="ui-card-title-strong">{item.title}</p>
                {item.summary ? (
                  <p className="ui-body text-[var(--color-text)]">{item.summary}</p>
                ) : null}
                <p className="ui-body">{item.meta}</p>
              </div>
              {item.aside ? <div className="flex items-center gap-2">{item.aside}</div> : null}
            </div>
          ))
        ) : (
          <div className="ui-surface-2 border-dashed px-5 py-10 ui-body">
            {emptyMessage}
          </div>
        )}
      </div>
    </section>
  );
}
