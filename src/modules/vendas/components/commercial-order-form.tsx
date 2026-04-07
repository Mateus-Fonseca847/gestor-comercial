"use client";

import { useEffect, useMemo, useState } from "react";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatusBadge } from "@/components/page/status-badge";
import { FeedbackBanner } from "@/modules/estoque/components/feedback-banner";
import { useFeedback } from "@/modules/estoque/components/use-feedback";
import { useEstoqueStore } from "@/modules/estoque/store";
import { useVendasStore } from "@/modules/vendas/store";
import type { VendaCanal, VendaStatus } from "@/modules/vendas/types";

type ItemForm = {
  produtoId: string;
  quantidade: number;
};

type CommercialOrderFormProps = {
  defaultCanal?: VendaCanal;
};

const canalOptions: Array<{ value: VendaCanal; label: string }> = [
  { value: "loja", label: "Loja" },
  { value: "whatsapp", label: "WhatsApp" },
];

const statusOptions: Array<{ value: VendaStatus; label: string }> = [
  { value: "em_aberto", label: "Em aberto" },
  { value: "aguardando_confirmacao", label: "Aguardando confirmação" },
  { value: "concluida", label: "Concluída" },
  { value: "cancelada", label: "Cancelada" },
];

export function CommercialOrderForm({
  defaultCanal = "loja",
}: CommercialOrderFormProps) {
  const produtoIds = useEstoqueStore((state) => state.entities.produtos.allIds);
  const produtosById = useEstoqueStore((state) => state.entities.produtos.byId);
  const depositoIds = useEstoqueStore((state) => state.entities.depositos.allIds);
  const depositosById = useEstoqueStore((state) => state.entities.depositos.byId);
  const saldosIds = useEstoqueStore((state) => state.entities.saldosProduto.allIds);
  const saldosById = useEstoqueStore((state) => state.entities.saldosProduto.byId);
  const estoqueActions = useEstoqueStore((state) => state.actions);
  const vendasActions = useVendasStore((state) => state.actions);
  const { feedback, showFeedback, clearFeedback } = useFeedback();

  const produtos = useMemo(
    () =>
      produtoIds
        .map((id) => produtosById[id])
        .filter((produto) => produto && produto.ativo && produto.status === "ativo"),
    [produtoIds, produtosById],
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
  const saldos = useMemo(() => saldosIds.map((id) => saldosById[id]), [saldosIds, saldosById]);

  const [clienteNome, setClienteNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [depositoId, setDepositoId] = useState("");
  const [observacao, setObservacao] = useState("");
  const [canal, setCanal] = useState<VendaCanal>(defaultCanal);
  const [status, setStatus] = useState<VendaStatus>(
    defaultCanal === "whatsapp" ? "aguardando_confirmacao" : "em_aberto",
  );
  const [items, setItems] = useState<ItemForm[]>([{ produtoId: "", quantidade: 1 }]);

  useEffect(() => {
    if (!depositoId && depositos[0]) {
      setDepositoId(depositos[0].id);
    }
  }, [depositoId, depositos]);

  useEffect(() => {
    setCanal(defaultCanal);
    setStatus(defaultCanal === "whatsapp" ? "aguardando_confirmacao" : "em_aberto");
  }, [defaultCanal]);

  const preparedItems = useMemo(
    () =>
      items
        .map((item) => {
          const produto = produtosById[item.produtoId];
          const precoUnitario = produto?.precoVenda?.valor ?? 0;

          return produto
            ? {
                produto,
                quantidade: item.quantidade,
                precoUnitario,
                subtotal: item.quantidade * precoUnitario,
              }
            : null;
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item)),
    [items, produtosById],
  );

  const subtotal = useMemo(
    () => preparedItems.reduce((total, item) => total + item.subtotal, 0),
    [preparedItems],
  );

  function updateItem(index: number, changes: Partial<ItemForm>) {
    setItems((current) =>
      current.map((item, currentIndex) =>
        currentIndex === index ? { ...item, ...changes } : item,
      ),
    );
  }

  function addItem() {
    setItems((current) => [...current, { produtoId: "", quantidade: 1 }]);
  }

  function removeItem(index: number) {
    setItems((current) =>
      current.length === 1 ? current : current.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  function resetForm() {
    setClienteNome("");
    setTelefone("");
    setObservacao("");
    setCanal(defaultCanal);
    setStatus(defaultCanal === "whatsapp" ? "aguardando_confirmacao" : "em_aberto");
    setItems([{ produtoId: "", quantidade: 1 }]);
  }

  function validateBase() {
    if (!clienteNome.trim()) {
      showFeedback({ tone: "error", title: "Informe o cliente." });
      return false;
    }

    if (!preparedItems.length || preparedItems.some((item) => item.quantidade <= 0)) {
      showFeedback({
        tone: "error",
        title: "Adicione pelo menos um produto com quantidade válida.",
      });
      return false;
    }

    return true;
  }

  function validateEstoque() {
    if (!depositoId) {
      showFeedback({
        tone: "error",
        title: "Selecione de onde o estoque vai sair.",
      });
      return false;
    }

    for (const item of preparedItems) {
      const saldo = saldos.find(
        (saldoItem) =>
          saldoItem.produtoId === item.produto.id && saldoItem.depositoId === depositoId,
      );

      if (!saldo || saldo.quantidadeDisponivel < item.quantidade) {
        showFeedback({
          tone: "error",
          title: `Estoque insuficiente para ${item.produto.nome}.`,
        });
        return false;
      }
    }

    return true;
  }

  function handleSalvarRegistro() {
    const precisaBaixarEstoque = status === "concluida";

    if (!validateBase() || (precisaBaixarEstoque && !validateEstoque())) {
      return;
    }

    const registroId = vendasActions.salvarRegistroComercial({
      canal,
      status,
      clienteNome,
      telefone: telefone || undefined,
      depositoId: depositoId || undefined,
      observacao,
      itens: preparedItems.map((item) => ({
        produtoId: item.produto.id,
        nomeProduto: item.produto.nome,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
      })),
    });

    if (!registroId) {
      showFeedback({
        tone: "error",
        title: "Não foi possível salvar o registro.",
      });
      return;
    }

    if (precisaBaixarEstoque) {
      preparedItems.forEach((item) => {
        estoqueActions.registrarMovimentacao({
          tipo: "saida",
          status: "confirmada",
          origemTipo: "manual",
          origemOperacional: canal === "whatsapp" ? "pedido_whatsapp" : "venda_loja",
          origemId: registroId,
          produtoId: item.produto.id,
          depositoOrigemId: depositoId,
          quantidade: item.quantidade,
          unidadeMedida: item.produto.unidadeMedida,
          custoUnitario: item.produto.precoVenda,
          dataMovimentacao: new Date().toISOString(),
          observacao: observacao || "Registro comercial concluído.",
        });
      });
    }

    showFeedback({
      tone: "success",
      title: precisaBaixarEstoque ? "Registro salvo e estoque atualizado." : "Registro comercial salvo.",
      description:
        canal === "whatsapp"
          ? "O canal ficou marcado como WhatsApp."
          : "O canal ficou marcado como Loja.",
    });
    resetForm();
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Novo registro comercial"
        description="Use a mesma tela para loja e WhatsApp. O canal vira um atributo do pedido ou da venda."
        actions={[{ label: "Ver vendas", variant: "secondary", href: "/vendas" }]}
      />

      <FeedbackBanner feedback={feedback} onDismiss={clearFeedback} />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Dados do registro
              </h2>
              <p className="text-sm text-[var(--color-text-soft)]">
                Cliente, canal, status e itens no mesmo fluxo.
              </p>
            </div>
            <StatusBadge variant={canal === "whatsapp" ? "info" : "success"}>
              {canal === "whatsapp" ? "WhatsApp" : "Loja"}
            </StatusBadge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-[var(--color-text)]">Cliente</span>
              <input
                value={clienteNome}
                onChange={(event) => setClienteNome(event.target.value)}
                placeholder="Nome do cliente"
                className={inputClassName}
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-[var(--color-text)]">Telefone</span>
              <input
                value={telefone}
                onChange={(event) => setTelefone(event.target.value)}
                placeholder="(11) 99999-9999"
                className={inputClassName}
              />
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-[var(--color-text)]">Canal de origem</span>
              <select
                value={canal}
                onChange={(event) => setCanal(event.target.value as VendaCanal)}
                className={inputClassName}
              >
                {canalOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm">
              <span className="font-medium text-[var(--color-text)]">Status</span>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as VendaStatus)}
                className={inputClassName}
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 text-sm md:col-span-2">
              <span className="font-medium text-[var(--color-text)]">Saída do estoque</span>
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
            </label>
          </div>

          <div className="mt-5 space-y-4">
            {items.map((item, index) => {
              const produto = item.produtoId ? produtosById[item.produtoId] : null;

              return (
                <div
                  key={`${index}-${item.produtoId}`}
                  className="grid gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4 md:grid-cols-[1.4fr_0.55fr_auto]"
                >
                  <label className="space-y-2 text-sm">
                    <span className="font-medium text-[var(--color-text)]">Produto</span>
                    <select
                      value={item.produtoId}
                      onChange={(event) => updateItem(index, { produtoId: event.target.value })}
                      className={inputClassName}
                    >
                      <option value="">Selecione</option>
                      {produtos.map((produtoOption) => (
                        <option key={produtoOption.id} value={produtoOption.id}>
                          {produtoOption.nome}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="space-y-2 text-sm">
                    <span className="font-medium text-[var(--color-text)]">Quantidade</span>
                    <input
                      type="number"
                      min={1}
                      value={item.quantidade}
                      onChange={(event) =>
                        updateItem(index, {
                          quantidade: Math.max(Number(event.target.value) || 0, 0),
                        })
                      }
                      className={inputClassName}
                    />
                  </label>

                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-alt)]"
                    >
                      Remover
                    </button>
                  </div>

                  {produto ? (
                    <p className="text-sm text-[var(--color-text-soft)] md:col-span-3">
                      Preço unitário {formatCurrency(produto.precoVenda?.valor ?? 0)}
                    </p>
                  ) : null}
                </div>
              );
            })}

            <button
              type="button"
              onClick={addItem}
              className="rounded-xl border border-dashed border-[var(--color-border-strong)] px-4 py-3 text-sm font-medium text-[var(--color-primary)] transition hover:bg-[var(--color-surface-alt)]"
            >
              Adicionar produto
            </button>
          </div>

          <label className="mt-5 block space-y-2 text-sm">
            <span className="font-medium text-[var(--color-text)]">Observações</span>
            <textarea
              value={observacao}
              onChange={(event) => setObservacao(event.target.value)}
              rows={3}
              placeholder="Recado do cliente, pagamento, entrega ou detalhe da venda"
              className={inputClassName}
            />
          </label>
        </section>

        <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">Resumo</h2>
              <p className="text-sm text-[var(--color-text-soft)]">
                Confira os itens antes de salvar.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4">
              <p className="text-sm text-[var(--color-text-soft)]">Subtotal</p>
              <p className="mt-2 text-3xl font-semibold text-[var(--color-text)]">
                {formatCurrency(subtotal)}
              </p>
            </div>

            <div className="space-y-3">
              {preparedItems.map((item) => (
                <div
                  key={`${item.produto.id}-${item.quantidade}`}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--color-border)] px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-[var(--color-text)]">{item.produto.nome}</p>
                    <p className="text-sm text-[var(--color-text-soft)]">
                      {item.quantidade} x {formatCurrency(item.precoUnitario)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-[var(--color-text)]">
                    {formatCurrency(item.subtotal)}
                  </p>
                </div>
              ))}

              {!preparedItems.length ? (
                <p className="rounded-2xl border border-dashed border-[var(--color-border)] px-4 py-5 text-sm text-[var(--color-text-soft)]">
                  Adicione produtos para montar o pedido.
                </p>
              ) : null}
            </div>

            <button
              type="button"
              onClick={handleSalvarRegistro}
              className="w-full rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-primary-strong)]"
            >
              Salvar registro
            </button>
          </div>
        </section>
      </section>
    </PageContainer>
  );
}

const inputClassName =
  "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}
