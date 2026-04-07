"use client";

import { useMemo, useState, type ReactNode } from "react";
import { DataTable } from "@/components/page/data-table";
import { EmptyState } from "@/components/page/empty-state";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatCard } from "@/components/page/stat-card";
import { StatusBadge } from "@/components/page/status-badge";
import { FeedbackBanner } from "@/modules/estoque/components/feedback-banner";
import { useFeedback } from "@/modules/estoque/components/use-feedback";
import { useEstoqueStore } from "@/modules/estoque/store";
import type { MovimentacaoOrigemOperacional } from "@/modules/estoque/types";

type Row = {
  id: string;
  numero: string;
  produto: string;
  fornecedor: string;
  deposito: string;
  recebidoEm: string;
  status: string;
};

const origemOptions: Array<{
  value: MovimentacaoOrigemOperacional;
  label: string;
}> = [
  { value: "reposicao_estoque", label: "Reposição de estoque" },
  { value: "devolucao", label: "Devolução" },
  { value: "ajuste_interno", label: "Ajuste interno" },
];

export default function EstoqueEntradasPage() {
  const entradaIds = useEstoqueStore((state) => state.entities.entradasMercadoria.allIds);
  const entradasById = useEstoqueStore((state) => state.entities.entradasMercadoria.byId);
  const produtoIds = useEstoqueStore((state) => state.entities.produtos.allIds);
  const produtosById = useEstoqueStore((state) => state.entities.produtos.byId);
  const fornecedorIds = useEstoqueStore((state) => state.entities.fornecedores.allIds);
  const fornecedoresById = useEstoqueStore((state) => state.entities.fornecedores.byId);
  const depositoIds = useEstoqueStore((state) => state.entities.depositos.allIds);
  const depositosById = useEstoqueStore((state) => state.entities.depositos.byId);
  const actions = useEstoqueStore((state) => state.actions);
  const { feedback, showFeedback, clearFeedback } = useFeedback();

  const produtos = useMemo(
    () =>
      produtoIds
        .map((id) => produtosById[id])
        .filter((produto) => produto && produto.ativo && produto.status === "ativo"),
    [produtoIds, produtosById],
  );
  const fornecedores = useMemo(
    () =>
      fornecedorIds
        .map((id) => fornecedoresById[id])
        .filter((fornecedor) => fornecedor && fornecedor.status === "ativo"),
    [fornecedorIds, fornecedoresById],
  );
  const depositos = useMemo(
    () =>
      depositoIds
        .map((id) => depositosById[id])
        .filter(
          (deposito) =>
            deposito && deposito.status === "ativo" && deposito.permiteMovimentacao,
        ),
    [depositoIds, depositosById],
  );
  const entradas = useMemo(() => entradaIds.map((id) => entradasById[id]), [entradaIds, entradasById]);

  const [produtoId, setProdutoId] = useState("");
  const [fornecedorId, setFornecedorId] = useState("");
  const [depositoId, setDepositoId] = useState("");
  const [quantidade, setQuantidade] = useState("1");
  const [dataRecebimento, setDataRecebimento] = useState(new Date().toISOString().slice(0, 10));
  const [origemOperacional, setOrigemOperacional] =
    useState<MovimentacaoOrigemOperacional>("reposicao_estoque");
  const [observacao, setObservacao] = useState("");

  const rows: Row[] = useMemo(
    () =>
      entradas
        .map((entrada) => ({
          id: entrada.id,
          numero: entrada.numero,
          produto:
            entrada.itens
              .map((item) => produtosById[item.produtoId]?.nome)
              .filter(Boolean)
              .join(", ") || "Produto não encontrado",
          fornecedor: entrada.fornecedorId
            ? fornecedoresById[entrada.fornecedorId]?.nomeFantasia ??
              fornecedoresById[entrada.fornecedorId]?.razaoSocial ??
              "Fornecedor não encontrado"
            : "Sem fornecedor",
          deposito: depositosById[entrada.depositoId]?.nome ?? "Depósito não encontrado",
          recebidoEm: formatDateBR(entrada.recebidoEm),
          status: formatStatus(entrada.status),
        }))
        .sort((a, b) => b.recebidoEm.localeCompare(a.recebidoEm)),
    [entradas, produtosById, fornecedoresById, depositosById],
  );

  const columns = [
    { key: "numero", header: "Entrada" },
    { key: "produto", header: "Produto" },
    { key: "fornecedor", header: "Fornecedor" },
    { key: "deposito", header: "Depósito" },
    { key: "recebidoEm", header: "Data" },
    {
      key: "status",
      header: "Status",
      render: (row: Row) => (
        <StatusBadge
          variant={
            row.status === "Conferida"
              ? "success"
              : row.status === "Cancelada"
                ? "danger"
                : "warning"
          }
        >
          {row.status}
        </StatusBadge>
      ),
    },
  ];

  function handleSubmit() {
    const quantidadeValue = Number(quantidade);

    if (!produtoId || !depositoId || quantidadeValue <= 0 || !dataRecebimento) {
      showFeedback({
        tone: "error",
        title: "Preencha produto, depósito, quantidade e data.",
      });
      return;
    }

    const entradaId = actions.registrarEntradaMercadoria({
      produtoId,
      depositoId,
      fornecedorId: fornecedorId || undefined,
      quantidade: quantidadeValue,
      dataRecebimento: new Date(`${dataRecebimento}T12:00:00`).toISOString(),
      observacao: observacao.trim() || undefined,
      origemOperacional,
    });

    if (!entradaId) {
      showFeedback({
        tone: "error",
        title: "Não foi possível registrar a entrada.",
      });
      return;
    }

    showFeedback({
      tone: "success",
      title: "Entrada registrada.",
      description: "O estoque já foi atualizado.",
    });
    setProdutoId("");
    setFornecedorId("");
    setQuantidade("1");
    setObservacao("");
    setOrigemOperacional("reposicao_estoque");
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Entradas de estoque"
        description="Registre o que chegou na loja e atualize o saldo na hora."
        actions={[{ label: "Ver produtos", variant: "secondary", href: "/estoque/produtos" }]}
      />

      <FeedbackBanner feedback={feedback} onDismiss={clearFeedback} />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-[var(--color-text)]">
              Registrar entrada
            </h2>
            <p className="text-sm text-[var(--color-text-soft)]">
              Lance a chegada de mercadoria sem sair da rotina.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Produto">
              <select
                value={produtoId}
                onChange={(event) => setProdutoId(event.target.value)}
                className={inputClassName}
              >
                <option value="">Selecione</option>
                {produtos.map((produto) => (
                  <option key={produto.id} value={produto.id}>
                    {produto.nome}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Depósito">
              <select
                value={depositoId}
                onChange={(event) => setDepositoId(event.target.value)}
                className={inputClassName}
              >
                <option value="">Selecione</option>
                {depositos.map((deposito) => (
                  <option key={deposito.id} value={deposito.id}>
                    {deposito.nome}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Quantidade">
              <input
                type="number"
                min={1}
                value={quantidade}
                onChange={(event) => setQuantidade(event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field label="Data">
              <input
                type="date"
                value={dataRecebimento}
                onChange={(event) => setDataRecebimento(event.target.value)}
                className={inputClassName}
              />
            </Field>

            <Field label="Origem">
              <select
                value={origemOperacional}
                onChange={(event) =>
                  setOrigemOperacional(event.target.value as MovimentacaoOrigemOperacional)
                }
                className={inputClassName}
              >
                {origemOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Fornecedor">
              <select
                value={fornecedorId}
                onChange={(event) => setFornecedorId(event.target.value)}
                className={inputClassName}
              >
                <option value="">Sem fornecedor</option>
                {fornecedores.map((fornecedor) => (
                  <option key={fornecedor.id} value={fornecedor.id}>
                    {fornecedor.nomeFantasia ?? fornecedor.razaoSocial}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Observação">
            <textarea
              value={observacao}
              onChange={(event) => setObservacao(event.target.value)}
              rows={3}
              placeholder="Ex.: reposição da vitrine"
              className={inputClassName}
            />
          </Field>

          <button
            type="button"
            onClick={handleSubmit}
            className="mt-5 rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-primary-strong)]"
          >
            Confirmar entrada
          </button>
        </section>

        <section className="grid gap-4 lg:grid-cols-1">
          <StatCard
            label="Entradas"
            value={String(entradas.length)}
            description="Recebimentos lançados no estoque."
          />
          <StatCard
            label="Conferidas"
            value={String(entradas.filter((item) => item.status === "conferida").length)}
            description="Entradas já finalizadas."
          />
          <StatCard
            label="Pendentes"
            value={String(entradas.filter((item) => item.status !== "conferida").length)}
            description="Recebimentos que ainda pedem conferência."
          />
        </section>
      </section>

      <DataTable
        columns={columns}
        data={rows}
        emptyState={
          <EmptyState
            title="Nenhuma entrada lançada"
            description="Registre a primeira entrada para atualizar o estoque."
            actionLabel="Registrar entrada"
          />
        }
      />
    </PageContainer>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="space-y-2 text-sm">
      <span className="font-medium text-[var(--color-text)]">{label}</span>
      {children}
    </label>
  );
}

const inputClassName =
  "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]";

function formatStatus(status: string) {
  if (status === "conferida") return "Conferida";
  if (status === "cancelada") return "Cancelada";
  if (status === "parcial") return "Parcial";
  if (status === "em_conferencia") return "Em conferência";
  return "Pendente";
}

function formatDateBR(value: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(value));
}
