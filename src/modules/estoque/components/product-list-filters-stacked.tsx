type ProductListFiltersStackedProps = {
  categories: string[];
  statuses: string[];
  deposits: string[];
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  selectedCategory?: string;
  selectedStatus?: string;
  selectedDeposit?: string;
  onCategoryChange?: (value: string) => void;
  onStatusChange?: (value: string) => void;
  onDepositChange?: (value: string) => void;
};

export function ProductListFiltersStacked({
  categories,
  statuses,
  deposits,
  searchValue = "",
  onSearchChange,
  selectedCategory = "",
  selectedStatus = "",
  selectedDeposit = "",
  onCategoryChange,
  onStatusChange,
  onDepositChange,
}: ProductListFiltersStackedProps) {
  return (
    <section className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-5 shadow-[var(--shadow-sm)]">
      <div className="flex flex-wrap gap-4">
        <SelectBlock
          label="Categoria"
          options={categories}
          value={selectedCategory}
          onChange={onCategoryChange}
        />
        <SelectBlock
          label="Status"
          options={statuses}
          value={selectedStatus}
          onChange={onStatusChange}
        />
        <SelectBlock
          label="Depósito"
          options={deposits}
          value={selectedDeposit}
          onChange={onDepositChange}
        />
      </div>

      <label className="mt-4 block space-y-2">
        <span className="text-sm font-medium text-[var(--color-text)]">Buscar</span>
        <input
          type="search"
          placeholder="Nome, SKU ou código"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white"
        />
      </label>
    </section>
  );
}

function SelectBlock({
  label,
  options,
  value = "",
  onChange,
}: {
  label: string;
  options: string[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="min-w-[180px] flex-1 space-y-2">
      <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white"
      >
        <option value="">Todos</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
