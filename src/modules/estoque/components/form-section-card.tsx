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
    <section className="ui-surface-1 p-6">
      <div className="mb-5 space-y-1">
        <h2 className="ui-section-title text-[var(--color-primary)]">{title}</h2>
        {description ? (
          <p className="ui-body">{description}</p>
        ) : null}
      </div>
      {children}
    </section>
  );
}
