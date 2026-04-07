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
}: {
  title: string;
  description: string;
  items: ActivityItem[];
  href?: string;
}) {
  return (
    <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-text)]">{title}</h2>
          <p className="text-sm text-[var(--color-text-soft)]">{description}</p>
        </div>
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-2 text-sm font-medium text-[var(--color-primary)]"
          >
            Ver tudo
            <ArrowRight className="h-4 w-4" />
          </Link>
        ) : null}
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-3 rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm lg:flex-row lg:items-center lg:justify-between"
          >
            <div className="space-y-1">
              <p className="font-medium text-[var(--color-text)]">{item.title}</p>
              {item.summary ? (
                <p className="text-sm text-[var(--color-text)]">{item.summary}</p>
              ) : null}
              <p className="text-sm text-[var(--color-text-soft)]">{item.meta}</p>
            </div>
            {item.aside ? <div className="flex items-center gap-2">{item.aside}</div> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
