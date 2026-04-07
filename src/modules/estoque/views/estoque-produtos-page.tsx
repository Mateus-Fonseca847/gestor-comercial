"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ActionBar } from "@/components/page/action-bar";
import { EmptyState } from "@/components/page/empty-state";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatusBadge } from "@/components/page/status-badge";
import { ContextCard } from "@/modules/estoque/components/context-card";
import { ProductListFiltersStacked } from "@/modules/estoque/components/product-list-filters-stacked";
import { ProductRowActions } from "@/modules/estoque/components/product-row-actions";
import { TablePagination } from "@/modules/estoque/components/table-pagination";
import {
  calcularEstoqueDisponivel,
  calcularStatusProduto,
  getProdutoStatusLabel,
  getProdutoStatusVariant,
  verificarEstoqueMinimo,
} from "@/modules/estoque/helpers";
import { useEstoqueStore } from "@/modules/estoque/store";
import type { ProdutoEstoqueStatus } from "@/modules/estoque/types";

type SortField = "nome" | "preco" | "estoqueAtual" | "categoria";
type SortDirection = "asc" | "desc";

type ProductRow = {
  produto: {
    id: string;
    nome: string;
    sku: string;
    codigoInterno: string;
    descricao?: string;
    precoVenda?: {
      valor: number;
    };
    categoriaId: string;
  };
  categoria: string;
  depositoPrincipal: string;
  estoqueAtual: number;
  status: ProdutoEstoqueStatus;
};

const PAGE_SIZE = 6;

export default function EstoqueProdutosPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("nome");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const deferredSearch = useDeferredValue(search);
  const filtrosAtivos = useEstoqueStore((state) => state.ui.filtrosAtivos);
  const setFiltroAtivo = useEstoqueStore((state) => state.actions.setFiltroAtivo);
  const produtoIds = useEstoqueStore((state) => state.entities.produtos.allIds);
  const produtosById = useEstoqueStore((state) => state.entities.produtos.byId);
  const categoriasById = useEstoqueStore((state) => state.entities.categorias.byId);
  const depositosById = useEstoqueStore((state) => state.entities.depositos.byId);
  const saldosById = useEstoqueStore((state) => state.entities.saldosProduto.byId);

  const produtos = useMemo(
    () => produtoIds.map((id) => produtosById[id]).filter(Boolean),
    [produtoIds, produtosById],
  );
  const saldos = useMemo(() => Object.values(saldosById), [saldosById]);

  const rows: ProductRow[] = useMemo(
    () =>
      produtos.map((produto) => {
        const estoqueAtual = calcularEstoqueDisponivel(produto.id, saldos);
        const status = calcularStatusProduto(produto, saldos);
        const depositosProduto = saldos
          .filter((saldo) => saldo.produtoId === produto.id)
          .map((saldo) => depositosById[saldo.depositoId]?.nome)
          .filter(Boolean);

        return {
          produto,
          categoria: categoriasById[produto.categoriaId]?.nome ?? "Sem categoria",
          depositoPrincipal: depositosProduto[0] ?? "Sem deposito",
          estoqueAtual,
          status,
        };
      }),
    [categoriasById, depositosById, produtos, saldos],
  );

  const normalizedSearch = deferredSearch.trim().toLocaleLowerCase("pt-BR");
  const categoryFilter = String(filtrosAtivos.categoria ?? "");
  const statusFilter = String(filtrosAtivos.status ?? "");
  const depositFilter = String(filtrosAtivos.deposito ?? "");

  const filteredRows = useMemo(
    () =>
      rows.filter(({ produto, categoria, depositoPrincipal, status }) => {
        const matchesSearch = normalizedSearch
          ? [produto.nome, produto.sku, produto.codigoInterno].some((value) =>
              value.toLocaleLowerCase("pt-BR").includes(normalizedSearch),
            )
          : true;
        const matchesCategory = categoryFilter ? categoria === categoryFilter : true;
        const matchesStatus = statusFilter ? getProdutoStatusLabel(status) === statusFilter : true;
        const matchesDeposit = depositFilter ? depositoPrincipal === depositFilter : true;

        return matchesSearch && matchesCategory && matchesStatus && matchesDeposit;
      }),
    [categoryFilter, depositFilter, normalizedSearch, rows, statusFilter],
  );

  const sortedRows = useMemo(
    () =>
      [...filteredRows]
        .map((row, index) => ({ row, index }))
        .sort((a, b) => {
          const direction = sortDirection === "asc" ? 1 : -1;

          if (sortField === "nome") {
            const result = a.row.produto.nome.localeCompare(b.row.produto.nome, "pt-BR");
            return result === 0 ? a.index - b.index : result * direction;
          }

          if (sortField === "categoria") {
            const result = a.row.categoria.localeCompare(b.row.categoria, "pt-BR");
            return result === 0 ? a.index - b.index : result * direction;
          }

          if (sortField === "preco") {
            const result =
              (a.row.produto.precoVenda?.valor ?? 0) - (b.row.produto.precoVenda?.valor ?? 0);
            return result === 0 ? a.index - b.index : result * direction;
          }

          const result = a.row.estoqueAtual - b.row.estoqueAtual;
          return result === 0 ? a.index - b.index : result * direction;
        })
        .map(({ row }) => row),
    [filteredRows, sortDirection, sortField],
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(sortedRows.length / PAGE_SIZE)),
    [sortedRows.length],
  );
  const paginatedRows = useMemo(
    () => sortedRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, sortedRows],
  );
  const categories = useMemo(() => [...new Set(rows.map((item) => item.categoria))], [rows]);
  const statuses = useMemo(
    () => [...new Set(rows.map((item) => getProdutoStatusLabel(item.status)))],
    [rows],
  );
  const deposits = useMemo(
    () => [...new Set(rows.map((item) => item.depositoPrincipal))],
    [rows],
  );
  const produtosAbaixoMinimo = useMemo(
    () => produtos.filter((produto) => verificarEstoqueMinimo(produto, saldos)).length,
    [produtos, saldos],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, statusFilter, depositFilter, sortField, sortDirection]);

  return (
    <PageContainer>
      <SectionHeader
        title="Produtos"
        description="Consulte o catálogo operacional com dados comerciais, estoque atual e estrutura preparada para regras futuras."
        actions={[{ label: "Novo produto" }]}
      />

      <section className="grid gap-6 lg:grid-cols-3">
        <ContextCard
          title="Catálogo ativo"
          value={`${produtos.length} itens`}
          description="Base disponível para venda, compra e controle interno do estoque."
        />
        <ContextCard
          title="Itens abaixo do mínimo"
          value={`${produtosAbaixoMinimo} alertas`}
          description="Produtos que merecem revisão imediata antes da próxima ruptura."
        />
        <ContextCard
          title="Categorias monitoradas"
          value={`${categories.length} grupos`}
          description="Classificação operacional usada para leitura rápida do catálogo."
        />
      </section>

      <ActionBar
        items={[
          { label: "Novo produto" },
          { label: "Importar planilha", tone: "neutral" },
          { label: "Exportar lista", tone: "neutral" },
        ]}
      />

      <ProductListFiltersStacked
        categories={categories}
        statuses={statuses}
        deposits={deposits}
        searchValue={search}
        onSearchChange={setSearch}
        selectedCategory={categoryFilter}
        selectedStatus={statusFilter}
        selectedDeposit={depositFilter}
        onCategoryChange={(value) => setFiltroAtivo("categoria", value || undefined)}
        onStatusChange={(value) => setFiltroAtivo("status", value || undefined)}
        onDepositChange={(value) => setFiltroAtivo("deposito", value || undefined)}
      />

      <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
        <div className="mb-4 flex flex-col gap-2 px-2 pt-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Catálogo operacional
            </h2>
            <p className="text-sm text-[var(--color-text-soft)]">
              Visão consolidada dos itens cadastrados e seus respectivos saldos.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge variant="info">{produtos.length} produtos</StatusBadge>
            <StatusBadge variant="warning">{produtosAbaixoMinimo} com atenção</StatusBadge>
          </div>
        </div>

        {sortedRows.length ? (
          <div className="overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[#f8fafc]">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                      SKU
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                      Código
                    </th>
                    <SortableHeader
                      label="Nome"
                      active={sortField === "nome"}
                      direction={sortDirection}
                      onClick={() =>
                        handleSort("nome", sortField, sortDirection, setSortField, setSortDirection)
                      }
                    />
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                      Descrição curta
                    </th>
                    <SortableHeader
                      label="Categoria"
                      active={sortField === "categoria"}
                      direction={sortDirection}
                      onClick={() =>
                        handleSort(
                          "categoria",
                          sortField,
                          sortDirection,
                          setSortField,
                          setSortDirection,
                        )
                      }
                    />
                    <SortableHeader
                      label="Preço"
                      active={sortField === "preco"}
                      direction={sortDirection}
                      onClick={() =>
                        handleSort("preco", sortField, sortDirection, setSortField, setSortDirection)
                      }
                    />
                    <SortableHeader
                      label="Estoque atual"
                      active={sortField === "estoqueAtual"}
                      direction={sortDirection}
                      onClick={() =>
                        handleSort(
                          "estoqueAtual",
                          sortField,
                          sortDirection,
                          setSortField,
                          setSortDirection,
                        )
                      }
                    />
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.map(({ produto, categoria, estoqueAtual, status }) => (
                    <tr
                      key={produto.id}
                      className="border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[#f8fbff]"
                    >
                      <td className="px-6 py-4 text-sm text-[var(--color-text)]">{produto.sku}</td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text)]">
                        {produto.codigoInterno}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/estoque/produtos/${produto.id}`}
                          className="font-medium text-[var(--color-primary)]"
                        >
                          {produto.nome}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-soft)]">
                        {produto.descricao ?? "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text)]">{categoria}</td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text)]">
                        {formatCurrency(produto.precoVenda?.valor ?? 0)}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text)]">
                        {estoqueAtual}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <StatusBadge variant={getProdutoStatusVariant(status)}>
                          {getProdutoStatusLabel(status)}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <ProductRowActions id={produto.id} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={sortedRows.length}
              pageSize={PAGE_SIZE}
              itemLabel="produtos"
              onPageChange={setCurrentPage}
            />
          </div>
        ) : (
          <EmptyState
            title={
              search || categoryFilter || statusFilter || depositFilter
                ? "Nenhum produto encontrado"
                : "Nenhum produto cadastrado"
            }
            description={
              search || categoryFilter || statusFilter || depositFilter
                ? "Nenhum item corresponde aos filtros aplicados."
                : "Assim que os primeiros itens forem adicionados, a lista aparecerá aqui com filtros, ações e paginação."
            }
            actionLabel="Cadastrar produto"
          />
        )}
      </section>
    </PageContainer>
  );
}

export { EstoqueProdutosPage };

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function SortableHeader({
  label,
  active,
  direction,
  onClick,
}: {
  label: string;
  active: boolean;
  direction: SortDirection;
  onClick: () => void;
}) {
  return (
    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
      <button type="button" onClick={onClick} className="inline-flex items-center gap-2">
        <span>{label}</span>
        <span>{active ? (direction === "asc" ? "↑" : "↓") : "↕"}</span>
      </button>
    </th>
  );
}

function handleSort(
  field: SortField,
  currentField: SortField,
  currentDirection: SortDirection,
  setField: (value: SortField) => void,
  setDirection: (value: SortDirection) => void,
) {
  if (field === currentField) {
    setDirection(currentDirection === "asc" ? "desc" : "asc");
    return;
  }

  setField(field);
  setDirection("asc");
}

