import { ArrowRight } from "lucide-react";
import Link from "next/link";

type ListItem = {
  id: string;
  title: string;
  meta: string;
  aside?: React.ReactNode;
};

type DashboardListBlockProps = {
  title: string;
  description: string;
  items: ListItem[];
  href?: string;
};

export function DashboardListBlock({
  title,
  description,
  items,
  href,
}: DashboardListBlockProps) {
  return (
    <section className="rounded-[30px] border border-[var(--color-border)]/90 bg-[linear-gradient(180deg,#ffffff_0%,#fbfdff_100%)] p-6 shadow-[0_12px_28px_rgba(15,23,42,0.06)]">
      <div className="mb-5 flex items-start justify-between gap-3 border-b border-[var(--color-border)]/70 pb-4">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-[var(--color-text)]">
            {title}
          </h2>
          <p className="mt-1 text-sm leading-6 text-[var(--color-text-soft)]">{description}</p>
        </div>
        {href ? (
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full bg-[rgba(0,74,173,0.06)] px-3 py-1.5 text-sm font-medium text-[var(--color-primary)]"
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
            className="flex flex-col gap-3 rounded-[22px] border border-[var(--color-border)]/80 bg-[var(--color-surface-alt)] px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[rgba(0,74,173,0.12)] hover:shadow-sm lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <p className="font-medium text-[var(--color-text)]">{item.title}</p>
              <p className="mt-1 text-sm text-[var(--color-text-soft)]">{item.meta}</p>
            </div>
            {item.aside ? <div className="flex items-center gap-2">{item.aside}</div> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
