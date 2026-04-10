type Column<T> = {
  key: keyof T | string;
  header: string;
  align?: "left" | "right";
  render?: (row: T) => React.ReactNode;
};

type DataTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  emptyState?: React.ReactNode;
  onRowClick?: (row: T) => void;
};

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  emptyState,
  onRowClick,
}: DataTableProps<T>) {
  if (!data.length) {
    return <>{emptyState}</>;
  }

  return (
    <section className="ui-surface-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="border-b border-[var(--color-border)] bg-[#f8fafc]">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={[
                    "px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]",
                    column.align === "right" ? "text-right" : "text-left",
                  ].join(" ")}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={[
                  "border-b border-[var(--color-border)] last:border-b-0 transition-all duration-300 hover:bg-[var(--color-surface-muted)]",
                  onRowClick ? "cursor-pointer" : "",
                ].join(" ")}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={[
                      "px-6 py-4 text-sm text-[var(--color-text)]",
                      column.align === "right" ? "text-right" : "text-left",
                    ].join(" ")}
                  >
                    {column.render
                      ? column.render(row)
                      : String(row[column.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
