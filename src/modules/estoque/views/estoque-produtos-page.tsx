"use client";

import { useDeferredValue, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { EmptyState } from "@/components/page/empty-state";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatusBadge } from "@/components/page/status-badge";
import { ContextCard } from "@/modules/estoque/components/context-card";
import { TablePagination } from "@/modules/estoque/components/table-pagination";
import {
  calcularEstoqueDisponivel,
  calcularStatusProduto,
  getProdutoStatusLabel,
  getProdutoStatusVariant,
} from "@/modules/estoque/helpers";
import { useEstoqueStore } from "@/modules/estoque/store";

type ProdutoEstoqueStatus = ReturnType<typeof calcularStatusProduto>;

type ProductRow = {
  id: string;
  nome: string;
  sku: string;
  categoria: string;
  precoVenda: number;
  estoqueDisponivel: number;
  estoqueMinimo: number;
  status: ProdutoEstoqueStatus;
};

const PAGE_SIZE = 8;
const STATUS_OPTIONS = ["", "Saudável", "Baixo", "Zerado", "Inativo"];

export default function EstoqueProdutosPage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const deferredSearch = useDeferredValue(search);
  const statusFilter = useEstoqueStore((state) => String(state.ui.filtrosAtivos.status ?? ""));
  const setFiltroAtivo = useEstoqueStore((state) => state.actions.setFiltroAtivo);
  const produtoIds = useEstoqueStore((state) => state.entities.produtos.allIds);
  const produtosById = useEstoqueStore((state) => state.entities.produtos.byId);
  const categoriasById = useEstoqueStore((state) => state.entities.categorias.byId);
  const saldosById = useEstoqueStore((state) => state.entities.saldosProduto.byId);

  const produtos = useMemo(
    () => produtoIds.map((id) => produtosById[id]).filter(Boolean),
    [produtoIds, produtosById],
  );
  const saldos = useMemo(() => Object.values(saldosById), [saldosById]);

  const rows = useMemo<ProductRow[]>(
    () =>
      produtos
        .map((produto) => {
          const status = calcularStatusProduto(produto, saldos);

          return {
            id: produto.id,
            nome: produto.nome,
            sku: produto.sku,
            categoria: categoriasById[produto.categoriaId]?.nome ?? "Sem categoria",
            precoVenda: produto.precoVenda?.valor ?? 0,
            estoqueDisponivel: calcularEstoqueDisponivel(produto.id, saldos),
            estoqueMinimo: produto.estoqueMinimo,
            status,
          };
        })
        .sort((a, b) => {
          if (statusWeight(a.status) !== statusWeight(b.status)) {
            return statusWeight(b.status) - statusWeight(a.status);
          }

          return a.nome.localeCompare(b.nome, "pt-BR");
        }),
    [categoriasById, produtos, saldos],
  );

  const normalizedSearch = deferredSearch.trim().toLocaleLowerCase("pt-BR");

  const filteredRows = useMemo(
    () =>
      rows.filter((row) => {
        const matchesSearch = normalizedSearch
          ? [row.nome, row.sku].some((value) =>
              value.toLocaleLowerCase("pt-BR").includes(normalizedSearch),
            )
          : true;
        const matchesStatus = statusFilter
          ? getProdutoStatusLabel(row.status) === statusFilter
          : true;

        return matchesSearch && matchesStatus;
      }),
    [normalizedSearch, rows, statusFilter],
  );

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE)),
    [filteredRows.length],
  );
  const paginatedRows = useMemo(
    () => filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [currentPage, filteredRows],
  );

  const produtosAbaixoMinimo = useMemo(
    () => rows.filter((row) => row.status === "baixo").length,
    [rows],
  );
  const produtosZerados = useMemo(
    () => rows.filter((row) => row.status === "zerado").length,
    [rows],
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    setFiltroAtivo("categoria", undefined);
    setFiltroAtivo("deposito", undefined);
  }, [setFiltroAtivo]);

  return (
    <PageContainer>
      <SectionHeader
        title="Produtos"
        description="Consulte preço, estoque disponível e itens que pedem reposição sem perder tempo."
        actions={[{ label: "Novo produto" }]}
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <ContextCard
          title="Produtos cadastrados"
          value={String(produtos.length)}
          description="Base atual de itens disponíveis para venda e controle."
        />
        <ContextCard
          title="Abaixo do mínimo"
          value={String(produtosAbaixoMinimo)}
          description="Itens acabando e pedindo reposição."
        />
        <ContextCard
          title="Produtos zerados"
          value={String(produtosZerados)}
          description="Itens sem saldo disponível para vender."
        />
      </section>

      <section className="rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)]">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Buscar</span>
            <input
              type="search"
              placeholder="Nome ou SKU"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Status do estoque</span>
            <select
              value={statusFilter}
              onChange={(event) =>
                setFiltroAtivo("status", event.target.value || undefined)
              }
              className="h-12 w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none transition-all focus:border-[var(--color-primary)] focus:bg-white"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option || "todos"} value={option}>
                  {option || "Todos"}
                </option>
              ))}
            </select>
          </label>
        </div>
      </section>

      <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-sm)]">
        <div className="mb-4 flex flex-col gap-2 px-2 pt-2 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-[var(--color-text)]">Lista de produtos</h2>
            <p className="text-sm text-[var(--color-text-soft)]">
              Os itens críticos aparecem primeiro para facilitar a decisão do dia.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge variant="warning">{produtosAbaixoMinimo} abaixo do mínimo</StatusBadge>
            <StatusBadge variant="danger">{produtosZerados} zerados</StatusBadge>
          </div>
        </div>

        {filteredRows.length ? (
          <div className="overflow-hidden rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-sm)]">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="border-b border-[var(--color-border)] bg-[#f8fafc]">
                    {[
                      "Produto",
                      "SKU",
                      "Categoria",
                      "Preço de venda",
                      "Estoque disponível",
                      "Estoque mínimo",
                      "Status do estoque",
                      "Ação",
                    ].map((header) => (
                      <th
                        key={header}
                        className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedRows.map((row) => (
                    <tr
                      key={row.id}
                      className={[
                        "border-b border-[var(--color-border)] last:border-b-0 transition-colors hover:bg-[#f8fbff]",
                        row.status === "zerado"
                          ? "bg-red-50/70"
                          : row.status === "baixo"
                            ? "bg-yellow-50/60"
                            : "bg-white",
                      ].join(" ")}
                    >
                      <td className="px-6 py-4 text-sm">
                        <div className="space-y-1">
                          <Link
                            href={`/estoque/produtos/${row.id}`}
                            className="font-medium text-[var(--color-primary)]"
                          >
                            {row.nome}
                          </Link>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text)]">{row.sku}</td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text)]">{row.categoria}</td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text)]">
                        {formatCurrency(row.precoVenda)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-[var(--color-text)]">
                        {row.estoqueDisponivel}
                      </td>
                      <td className="px-6 py-4 text-sm text-[var(--color-text-soft)]">
                        {row.estoqueMinimo}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <StatusBadge variant={getProdutoStatusVariant(row.status)}>
                          {getProdutoStatusLabel(row.status)}
                        </StatusBadge>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <Link
                          href={`/estoque/produtos/${row.id}/editar`}
                          className="inline-flex rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-medium text-[var(--color-primary)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-surface-alt)]"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredRows.length}
              pageSize={PAGE_SIZE}
              itemLabel="produtos"
              onPageChange={setCurrentPage}
            />
          </div>
        ) : (
          <EmptyState
            title={search || statusFilter ? "Nenhum produto encontrado" : "Nenhum produto cadastrado"}
            description={
              search || statusFilter
                ? "Tente buscar por outro nome, SKU ou ajustar o status filtrado."
                : "Quando os primeiros produtos forem cadastrados, eles aparecem aqui."
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

function statusWeight(status: ProdutoEstoqueStatus) {
  if (status === "zerado") return 3;
  if (status === "baixo") return 2;
  if (status === "inativo") return 1;
  return 0;
}
