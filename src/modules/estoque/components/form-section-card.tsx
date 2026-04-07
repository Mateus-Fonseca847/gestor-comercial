type FormSectionCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function FormSectionCard({
  title,
  description,
  children,
}: FormSectionCardProps) {
  return (
    <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[0_12px_30px_rgba(0,74,173,0.06)]">
      <div className="mb-5 space-y-1">
        <h2 className="text-lg font-semibold text-[var(--color-primary)]">{title}</h2>
        {description ? (
          <p className="text-sm text-[var(--color-text-soft)]">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
