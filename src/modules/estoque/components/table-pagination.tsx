type TablePaginationProps = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  itemLabel?: string;
  onPageChange: (page: number) => void;
};

export function TablePagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  itemLabel = "itens",
  onPageChange,
}: TablePaginationProps) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);
  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-border)] px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
      <p className="text-sm text-[var(--color-text-soft)]">
        Exibindo {start}-{end} de {totalItems} {itemLabel}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-soft)] transition-all duration-200 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-alt)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Anterior
        </button>
        {pages.map((page) => (
          <button
            key={page}
            type="button"
            onClick={() => onPageChange(page)}
            className={
              page === currentPage
                ? "rounded-xl bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-[var(--color-primary-strong)]"
                : "rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-soft)] transition-all duration-200 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-alt)]"
            }
          >
            {page}
          </button>
        ))}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-sm text-[var(--color-text-soft)] transition-all duration-200 hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-alt)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Próxima
        </button>
      </div>
    </div>
  );
}
