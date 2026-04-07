"use client";

import { useEffect, useMemo, useState } from "react";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatusBadge } from "@/components/page/status-badge";
import { FeedbackBanner } from "@/modules/estoque/components/feedback-banner";
import { useFeedback } from "@/modules/estoque/components/use-feedback";
import { useEstoqueStore } from "@/modules/estoque/store";
import { useVendasStore } from "@/modules/vendas/store";

type ItemForm = {
  produtoId: string;
  quantidade: number;
};

type SalesOrderFormProps = {
  mode: "loja" | "whatsapp";
};

export function SalesOrderForm({ mode }: SalesOrderFormProps) {
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
        .filter((deposito) => deposito && deposito.status === "ativo" && deposito.permiteMovimentacao),
    [depositoIds, depositosById],
  );
  const saldos = useMemo(() => saldosIds.map((id) => saldosById[id]), [saldosIds, saldosById]);

  const [clienteNome, setClienteNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [depositoId, setDepositoId] = useState("");
  const [observacao, setObservacao] = useState("");
  const [items, setItems] = useState<ItemForm[]>([{ produtoId: "", quantidade: 1 }]);

  useEffect(() => {
    if (!depositoId && depositos[0]) {
      setDepositoId(depositos[0].id);
    }
  }, [depositoId, depositos]);

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
    setItems([{ produtoId: "", quantidade: 1 }]);
  }

  function validateBase() {
    if (!clienteNome.trim()) {
      showFeedback({
        tone: "error",
        title: "Informe o cliente.",
      });
      return false;
    }

    if (!preparedItems.length || preparedItems.some((item) => item.quantidade <= 0)) {
      showFeedback({
        tone: "error",
        title: "Adicione pelo menos um produto com quantidade valida.",
      });
      return false;
    }

    return true;
  }

  function validateEstoque() {
    if (!depositoId) {
      showFeedback({
        tone: "error",
        title: "Selecione de onde a venda vai sair.",
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

  function handleSalvarRascunho() {
    if (!validateBase()) {
      return;
    }

    const vendaId = vendasActions.salvarVendaRascunho({
      canal: "loja",
      clienteNome,
      depositoId: depositoId || undefined,
      observacao,
      itens: preparedItems.map((item) => ({
        produtoId: item.produto.id,
        nomeProduto: item.produto.nome,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
      })),
    });

    if (!vendaId) {
      showFeedback({
        tone: "error",
        title: "Nao foi possivel salvar a venda.",
      });
      return;
    }

    showFeedback({
      tone: "success",
      title: "Venda salva como rascunho.",
    });
    resetForm();
  }

  function handleConcluirVenda() {
    if (!validateBase() || !validateEstoque()) {
      return;
    }

    const vendaId = vendasActions.concluirVenda({
      clienteNome,
      depositoId,
      observacao,
      itens: preparedItems.map((item) => ({
        produtoId: item.produto.id,
        nomeProduto: item.produto.nome,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
      })),
    });

    if (!vendaId) {
      showFeedback({
        tone: "error",
        title: "Nao foi possivel concluir a venda.",
      });
      return;
    }

    preparedItems.forEach((item) => {
      estoqueActions.registrarMovimentacao({
        tipo: "saida",
        status: "confirmada",
        origemTipo: "manual",
        origemOperacional: "venda_loja",
        origemId: vendaId,
        produtoId: item.produto.id,
        depositoOrigemId: depositoId,
        quantidade: item.quantidade,
        unidadeMedida: item.produto.unidadeMedida,
        custoUnitario: item.produto.precoVenda,
        dataMovimentacao: new Date().toISOString(),
        observacao: observacao || "Venda registrada na loja.",
      });
    });

    showFeedback({
      tone: "success",
      title: "Venda concluida.",
      description: "O estoque ja foi atualizado.",
    });
    resetForm();
  }

  function handleSalvarPedidoWhatsapp() {
    if (!validateBase()) {
      return;
    }

    const pedidoId = vendasActions.criarPedidoWhatsapp({
      clienteNome,
      telefone,
      observacao,
      itens: preparedItems.map((item) => ({
        produtoId: item.produto.id,
        nomeProduto: item.produto.nome,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
      })),
    });

    if (!pedidoId) {
      showFeedback({
        tone: "error",
        title: "Nao foi possivel salvar o pedido WhatsApp.",
      });
      return;
    }

    showFeedback({
      tone: "success",
      title: "Pedido WhatsApp registrado.",
      description: "A origem do pedido ficou salva como WhatsApp.",
    });
    resetForm();
    setTelefone("");
  }

  return (
    <PageContainer>
      <SectionHeader
        title={mode === "whatsapp" ? "Novo pedido WhatsApp" : "Nova venda"}
        description={
          mode === "whatsapp"
            ? "Registre o pedido recebido no WhatsApp e deixe o canal salvo desde o inicio."
            : "Abra uma venda rapida de balcão com cliente, itens e subtotal."
        }
        actions={[
          {
            label: mode === "whatsapp" ? "Ver vendas" : "Ver pedidos",
            variant: "secondary",
            href: "/vendas",
          },
        ]}
      />

      <FeedbackBanner feedback={feedback} onDismiss={clearFeedback} />

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                {mode === "whatsapp" ? "Pedido do WhatsApp" : "Dados da venda"}
              </h2>
              <p className="text-sm text-[var(--color-text-soft)]">
                {mode === "whatsapp"
                  ? "Pedido com origem WhatsApp e status inicial pendente."
                  : "Venda simples para o dia a dia da loja."}
              </p>
            </div>
            <StatusBadge variant={mode === "whatsapp" ? "info" : "success"}>
              {mode === "whatsapp" ? "WhatsApp" : "Loja"}
            </StatusBadge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm">
              <span className="font-medium text-[var(--color-text)]">Cliente</span>
              <input
                value={clienteNome}
                onChange={(event) => setClienteNome(event.target.value)}
                placeholder="Nome do cliente"
                className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
              />
            </label>

            {mode === "whatsapp" ? (
              <label className="space-y-2 text-sm">
                <span className="font-medium text-[var(--color-text)]">Telefone</span>
                <input
                  value={telefone}
                  onChange={(event) => setTelefone(event.target.value)}
                  placeholder="(11) 99999-9999"
                  className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                />
              </label>
            ) : (
              <label className="space-y-2 text-sm">
                <span className="font-medium text-[var(--color-text)]">Saida do estoque</span>
                <select
                  value={depositoId}
                  onChange={(event) => setDepositoId(event.target.value)}
                  className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
                >
                  <option value="">Selecione</option>
                  {depositos.map((deposito) => (
                    <option key={deposito.id} value={deposito.id}>
                      {deposito.nome}
                    </option>
                  ))}
                </select>
              </label>
            )}
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
                      className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
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
                        updateItem(index, { quantidade: Math.max(Number(event.target.value) || 0, 0) })
                      }
                      className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
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
                      Preco unitario {formatCurrency(produto.precoVenda?.valor ?? 0)}
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
            <span className="font-medium text-[var(--color-text)]">Observacoes</span>
            <textarea
              value={observacao}
              onChange={(event) => setObservacao(event.target.value)}
              rows={3}
              placeholder={mode === "whatsapp" ? "Mensagem combinada, entrega, pagamento..." : "Observacao da venda"}
              className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]"
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

            <div className="space-y-3">
              {mode === "whatsapp" ? (
                <button
                  type="button"
                  onClick={handleSalvarPedidoWhatsapp}
                  className="w-full rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-primary-strong)]"
                >
                  Salvar pedido WhatsApp
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleConcluirVenda}
                    className="w-full rounded-xl bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white transition hover:bg-[var(--color-primary-strong)]"
                  >
                    Concluir venda
                  </button>
                  <button
                    type="button"
                    onClick={handleSalvarRascunho}
                    className="w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-border-strong)] hover:bg-[var(--color-surface-alt)]"
                  >
                    Salvar rascunho
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </section>
    </PageContainer>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

