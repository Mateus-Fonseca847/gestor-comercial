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
    <section className="ui-surface-1 p-6">
      <div className="mb-5 flex items-start justify-between gap-3 border-b ui-divider pb-4">
        <div>
          <h2 className="ui-section-title">{title}</h2>
          <p className="ui-body mt-1">{description}</p>
        </div>
        {href ? (
          <Link
            href={href}
            className="ui-brand-badge inline-flex items-center gap-2"
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
            className="ui-surface-3 ui-interactive-item flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
          >
            <div>
              <p className="ui-card-title-strong">{item.title}</p>
              <p className="ui-body mt-1">{item.meta}</p>
            </div>
            {item.aside ? <div className="flex items-center gap-2">{item.aside}</div> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
