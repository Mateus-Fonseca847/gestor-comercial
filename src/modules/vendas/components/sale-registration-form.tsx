"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, CreditCard, PackageSearch, ReceiptText, UserRound } from "lucide-react";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { FeedbackBanner } from "@/modules/estoque/components/feedback-banner";
import { useFeedback } from "@/modules/estoque/components/use-feedback";
import { useEstoqueStore } from "@/modules/estoque/store";
import { useVendasStore } from "@/modules/vendas/store";
import type {
  DescontoTipo,
  FormaPagamento,
  PagamentoStatus,
  VendaCanal,
  VendaStatus,
} from "@/modules/vendas/types";

type ItemForm = {
  produtoId: string;
  produtoBusca: string;
  quantidade: number;
  precoUnitario: number;
};

type SaleRegistrationFormProps = {
  defaultCanal?: VendaCanal;
};

type ClienteSugestao = {
  id: string;
  nome: string;
  telefone: string;
  email?: string;
};

const canalOptions: Array<{ value: VendaCanal; label: string }> = [
  { value: "loja_fisica", label: "Loja Física" },
  { value: "online", label: "Online" },
];

const statusOptions: Array<{ value: VendaStatus; label: string }> = [
  { value: "rascunho", label: "Rascunho" },
  { value: "em_aberto", label: "Em aberto" },
  { value: "aguardando_confirmacao", label: "Aguardando confirmação" },
  { value: "concluida", label: "Concluída" },
  { value: "cancelada", label: "Cancelada" },
];

const descontoOptions: Array<{ value: DescontoTipo; label: string }> = [
  { value: "valor_fixo", label: "Valor fixo" },
  { value: "percentual", label: "Percentual" },
];

const pagamentoFormaOptions: Array<{ value: FormaPagamento; label: string }> = [
  { value: "dinheiro", label: "Dinheiro" },
  { value: "pix", label: "Pix" },
  { value: "cartao", label: "Cartão" },
  { value: "boleto", label: "Boleto" },
  { value: "outro", label: "Outro" },
];

const pagamentoStatusOptions: Array<{ value: PagamentoStatus; label: string }> = [
  { value: "pendente", label: "Pendente" },
  { value: "pago", label: "Pago" },
  { value: "parcialmente_pago", label: "Parcialmente pago" },
];

const clientesMock: ClienteSugestao[] = [
  { id: "cli-1", nome: "Carla Menezes", telefone: "(11) 99999-4010", email: "carla@lojista.com" },
  { id: "cli-2", nome: "José Nunes", telefone: "(11) 98888-1241", email: "jose@nunes.com" },
  { id: "cli-3", nome: "Marina Alves", telefone: "(11) 97777-1503", email: "marina@alves.com" },
  { id: "cli-4", nome: "Paula Ferreira", telefone: "(11) 96666-1702", email: "paula@ferreira.com" },
];

const initialDate = "2026-04-10";
const initialTime = "18:00";

const inputClassName =
  "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm outline-none transition focus:border-[var(--color-primary)]";

export function SaleRegistrationForm({
  defaultCanal = "loja_fisica",
}: SaleRegistrationFormProps) {
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

  const [clienteBusca, setClienteBusca] = useState("");
  const [clienteNome, setClienteNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [depositoId, setDepositoId] = useState("");
  const [observacao, setObservacao] = useState("");
  const [canal, setCanal] = useState<VendaCanal>(defaultCanal);
  const [status, setStatus] = useState<VendaStatus>(
    defaultCanal === "online" ? "aguardando_confirmacao" : "em_aberto",
  );
  const [dataVenda, setDataVenda] = useState(initialDate);
  const [horaVenda, setHoraVenda] = useState(initialTime);
  const [descontoTipo, setDescontoTipo] = useState<DescontoTipo>("valor_fixo");
  const [descontoValor, setDescontoValor] = useState(0);
  const [acrescimoValor, setAcrescimoValor] = useState(0);
  const [freteValor, setFreteValor] = useState(0);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("pix");
  const [statusPagamento, setStatusPagamento] = useState<PagamentoStatus>("pendente");
  const [valorPago, setValorPago] = useState(0);
  const [showClienteCadastro, setShowClienteCadastro] = useState(false);
  const [items, setItems] = useState<ItemForm[]>([createEmptyItem()]);

  useEffect(() => {
    if (!depositoId && depositos[0]) {
      setDepositoId(depositos[0].id);
    }
  }, [depositoId, depositos]);

  useEffect(() => {
    setCanal(defaultCanal);
    setStatus(defaultCanal === "online" ? "aguardando_confirmacao" : "em_aberto");
  }, [defaultCanal]);

  const vendaPreviewId = useMemo(
    () => `${canal === "online" ? "ONL" : "VEN"}-${dataVenda.replaceAll("-", "")}`,
    [canal, dataVenda],
  );

  const clientesFiltrados = useMemo(() => {
    const termo = clienteBusca.trim().toLowerCase();
    if (!termo) return clientesMock;
    return clientesMock.filter((cliente) =>
      [cliente.nome, cliente.telefone, cliente.email ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(termo),
    );
  }, [clienteBusca]);

  const preparedItems = useMemo(() => {
    const grouped = new Map<string, { produto: (typeof produtos)[number]; quantidade: number; precoUnitario: number; subtotal: number; }>();

    for (const item of items) {
      const produto = produtosById[item.produtoId];
      if (!produto || item.quantidade <= 0) continue;

      const existing = grouped.get(produto.id);
      if (existing && existing.precoUnitario === item.precoUnitario) {
        existing.quantidade += item.quantidade;
        existing.subtotal = existing.quantidade * existing.precoUnitario;
        continue;
      }

      grouped.set(produto.id, {
        produto,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
        subtotal: item.quantidade * item.precoUnitario,
      });
    }

    return Array.from(grouped.values());
  }, [items, produtosById]);

  const subtotal = useMemo(() => preparedItems.reduce((total, item) => total + item.subtotal, 0), [preparedItems]);
  const descontoAplicado = useMemo(() => {
    if (!descontoValor || descontoValor <= 0) return 0;
    if (descontoTipo === "percentual") return Math.min(subtotal, subtotal * (descontoValor / 100));
    return Math.min(subtotal, descontoValor);
  }, [descontoTipo, descontoValor, subtotal]);

  const totalFinal = useMemo(
    () => Math.max(subtotal - descontoAplicado + acrescimoValor + freteValor, 0),
    [acrescimoValor, descontoAplicado, freteValor, subtotal],
  );

  const troco = useMemo(() => {
    if (formaPagamento !== "dinheiro" || valorPago <= totalFinal) return 0;
    return valorPago - totalFinal;
  }, [formaPagamento, totalFinal, valorPago]);

  const clienteSelecionado = clienteNome ? { nome: clienteNome, telefone, email: clienteEmail } : null;
  function handleClienteSelect(value: string) {
    const cliente = clientesMock.find((item) => item.nome === value);
    setClienteBusca(value);
    setClienteNome(cliente?.nome ?? value);
    setTelefone(cliente?.telefone ?? "");
    setClienteEmail(cliente?.email ?? "");
  }

  function updateItem(index: number, changes: Partial<ItemForm>) {
    setItems((current) =>
      current.map((item, currentIndex) => {
        if (currentIndex !== index) return item;
        const next = { ...item, ...changes };
        if (changes.produtoId) {
          const produto = produtosById[changes.produtoId];
          next.produtoBusca = produto ? getProductOptionLabel(produto.nome, produto.sku) : "";
          next.precoUnitario = produto?.precoVenda?.valor ?? next.precoUnitario;
        }
        return next;
      }),
    );
  }

  function handleProdutoBusca(index: number, value: string) {
    const produto = findProdutoBySearch(value, produtos);
    setItems((current) =>
      current.map((item, currentIndex) =>
        currentIndex === index
          ? {
              ...item,
              produtoBusca: value,
              produtoId: produto?.id ?? item.produtoId,
              precoUnitario: produto?.precoVenda?.valor ?? item.precoUnitario,
            }
          : item,
      ),
    );
  }

  function addItem() {
    setItems((current) => [...current, createEmptyItem()]);
  }

  function removeItem(index: number) {
    setItems((current) =>
      current.length === 1 ? current : current.filter((_, currentIndex) => currentIndex !== index),
    );
  }

  function resetForm() {
    setClienteBusca("");
    setClienteNome("");
    setTelefone("");
    setClienteEmail("");
    setObservacao("");
    setCanal(defaultCanal);
    setStatus(defaultCanal === "online" ? "aguardando_confirmacao" : "em_aberto");
    setDataVenda(initialDate);
    setHoraVenda(initialTime);
    setDescontoTipo("valor_fixo");
    setDescontoValor(0);
    setAcrescimoValor(0);
    setFreteValor(0);
    setFormaPagamento("pix");
    setStatusPagamento("pendente");
    setValorPago(0);
    setShowClienteCadastro(false);
    setItems([createEmptyItem()]);
  }

  function validateBase() {
    if (!canal) {
      showFeedback({ tone: "error", title: "Selecione o canal da venda." });
      return false;
    }
    if (!clienteNome.trim()) {
      showFeedback({ tone: "error", title: "Informe ou selecione um cliente." });
      return false;
    }
    if (!dataVenda) {
      showFeedback({ tone: "error", title: "Informe a data da venda." });
      return false;
    }
    if (!preparedItems.length) {
      showFeedback({ tone: "error", title: "Adicione pelo menos um item na venda." });
      return false;
    }
    return true;
  }

  function validateEstoque() {
    if (!depositoId) {
      showFeedback({ tone: "error", title: "Selecione de onde o estoque vai sair." });
      return false;
    }

    for (const item of preparedItems) {
      const saldo = saldos.find(
        (saldoItem) => saldoItem.produtoId === item.produto.id && saldoItem.depositoId === depositoId,
      );
      if (!saldo || saldo.quantidadeDisponivel < item.quantidade) {
        showFeedback({ tone: "error", title: `Estoque insuficiente para ${item.produto.nome}.` });
        return false;
      }
    }

    return true;
  }

  function buildInput(statusFinal: VendaStatus) {
    return {
      canal,
      status: statusFinal,
      clienteNome,
      clienteEmail: clienteEmail || undefined,
      telefone: telefone || undefined,
      depositoId: depositoId || undefined,
      dataVenda,
      horaVenda,
      observacao,
      descontoTipo,
      descontoValor,
      acrescimoValor,
      freteValor,
      pagamento: {
        formaPagamento,
        statusPagamento,
        valorPago: valorPago || undefined,
        troco: troco || undefined,
      },
      itens: preparedItems.map((item) => ({
        produtoId: item.produto.id,
        nomeProduto: item.produto.nome,
        sku: item.produto.sku,
        quantidade: item.quantidade,
        precoUnitario: item.precoUnitario,
      })),
    };
  }

  function baixarEstoque(registroId: string) {
    preparedItems.forEach((item) => {
      estoqueActions.registrarMovimentacao({
        tipo: "saida",
        status: "confirmada",
        origemTipo: "manual",
        origemOperacional: canal === "online" ? "pedido_whatsapp" : "venda_loja",
        origemId: registroId,
        produtoId: item.produto.id,
        depositoOrigemId: depositoId,
        quantidade: item.quantidade,
        unidadeMedida: item.produto.unidadeMedida,
        custoUnitario: item.produto.precoVenda,
        dataMovimentacao: new Date(`${dataVenda}T${horaVenda || "12:00"}:00`).toISOString(),
        observacao: observacao || "Venda concluída.",
      });
    });
  }

  function handleSalvar(statusFinal: VendaStatus) {
    const precisaBaixarEstoque = statusFinal === "concluida";
    if (!validateBase() || (precisaBaixarEstoque && !validateEstoque())) return;

    const registroId = vendasActions.salvarRegistroComercial(buildInput(statusFinal));
    if (!registroId) {
      showFeedback({ tone: "error", title: "Não foi possível salvar a venda." });
      return;
    }

    if (precisaBaixarEstoque) baixarEstoque(registroId);

    showFeedback({
      tone: "success",
      title:
        statusFinal === "rascunho"
          ? "Rascunho salvo."
          : statusFinal === "concluida"
            ? "Venda concluída e estoque atualizado."
            : "Venda salva com sucesso.",
      description: `${clienteNome} • ${formatCurrency(totalFinal)}`,
    });

    resetForm();
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Nova venda"
        description="Preencha os dados principais, monte os itens e conclua a venda sem sair da operação."
        actions={[
          { label: "Histórico", variant: "secondary", href: "/vendas" },
          { label: "Nova venda", href: "/vendas/nova" },
        ]}
      />

      <FeedbackBanner feedback={feedback} onDismiss={clearFeedback} />
      <section className="grid gap-5 xl:grid-cols-[1.55fr_0.82fr] xl:items-start">
        <div className="space-y-4">
          <section className="ui-surface-1 p-5 md:p-6">
            <div className="mb-5 flex flex-wrap items-start justify-between gap-3 border-b ui-divider pb-4">
              <div className="space-y-1">
                <h2 className="ui-section-title text-[var(--color-primary)]">Ficha da venda</h2>
                <p className="ui-body">
                  Preencha a venda em um fluxo único. Identificador previsto {vendaPreviewId}.
                </p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    Dados principais
                  </p>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Canal da venda</span><select value={canal} onChange={(event) => setCanal(event.target.value as VendaCanal)} className={inputClassName}>{canalOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}</select></label>
                  <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Status da venda</span><select value={status} onChange={(event) => setStatus(event.target.value as VendaStatus)} className={inputClassName}>{statusOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}</select></label>
                  <div className="space-y-2 text-sm lg:col-span-2">
                    <span className="font-medium text-[var(--color-text)]">Cliente</span>
                    <div className="flex flex-col gap-3 lg:flex-row">
                      <input list="clientes-sugestoes" value={clienteBusca} onChange={(event) => handleClienteSelect(event.target.value)} placeholder="Buscar por nome ou telefone" className={`${inputClassName} flex-1`} />
                      <button
                        type="button"
                        onClick={() => setShowClienteCadastro((current) => !current)}
                        className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-text)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                      >
                        {showClienteCadastro ? "Ocultar cadastro" : "Adicionar cliente"}
                      </button>
                    </div>
                    <datalist id="clientes-sugestoes">{clientesFiltrados.map((cliente) => (<option key={cliente.id} value={cliente.nome}>{cliente.telefone}</option>))}</datalist>
                  </div>
                  <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Data da venda</span><div className="relative"><CalendarDays className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-soft)]" /><input type="date" value={dataVenda} onChange={(event) => setDataVenda(event.target.value)} className={`${inputClassName} pl-11`} /></div></label>
                  <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Horário</span><input type="time" value={horaVenda} onChange={(event) => setHoraVenda(event.target.value)} className={inputClassName} /></label>
                </div>
              </div>

              <div className="border-t ui-divider pt-5">
                <div className="mb-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    Cliente e complementos
                  </p>
                </div>
                {showClienteCadastro ? (
                  <div className="grid gap-3 lg:grid-cols-[1.25fr_0.75fr]">
                    <div className="grid gap-3 md:grid-cols-2">
                      <label className="space-y-2 text-sm md:col-span-2"><span className="font-medium text-[var(--color-text)]">Nome do cliente</span><input value={clienteNome} onChange={(event) => setClienteNome(event.target.value)} placeholder="Nome completo" className={inputClassName} /></label>
                      <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Telefone</span><input value={telefone} onChange={(event) => setTelefone(event.target.value)} placeholder="(11) 99999-9999" className={inputClassName} /></label>
                      <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">E-mail</span><input type="email" value={clienteEmail} onChange={(event) => setClienteEmail(event.target.value)} placeholder="cliente@email.com" className={inputClassName} /></label>
                      <label className="space-y-2 text-sm md:col-span-2"><span className="font-medium text-[var(--color-text)]">Saída do estoque</span><select value={depositoId} onChange={(event) => setDepositoId(event.target.value)} className={inputClassName}><option value="">Selecione</option>{depositos.map((deposito) => (<option key={deposito.id} value={deposito.id}>{deposito.nome}</option>))}</select></label>
                    </div>
                    <div className="ui-surface-3 px-4 py-4"><div className="mb-2 flex items-center gap-2"><UserRound className="h-4 w-4 text-[var(--color-primary)]" /><p className="text-sm font-semibold text-[var(--color-text)]">Cliente selecionado</p></div>{clienteSelecionado ? (<div className="space-y-1.5 text-sm text-[var(--color-text-soft)]"><p className="font-medium text-[var(--color-text)]">{clienteSelecionado.nome}</p><p>{clienteSelecionado.telefone || "Telefone não informado"}</p><p>{clienteSelecionado.email || "E-mail não informado"}</p></div>) : (<p className="text-sm text-[var(--color-text-soft)]">Selecione um cliente ou preencha os dados manualmente.</p>)}</div>
                  </div>
                ) : null}
              </div>

              <div className="border-t ui-divider pt-5">
                <div className="mb-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    Itens da venda
                  </p>
                </div>
                <div className="space-y-3">
                  {items.map((item, index) => {
                    const produto = item.produtoId ? produtosById[item.produtoId] : null;
                    const subtotalItem = item.quantidade * item.precoUnitario;
                    return (
                      <div key={`${index}-${item.produtoId}-${item.produtoBusca}`} className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-3.5">
                        <div className="grid gap-3 xl:grid-cols-[1.8fr_0.7fr_0.7fr_0.8fr_auto] xl:items-end">
                          <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Produto</span><div className="relative"><PackageSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-soft)]" /><input list="produtos-venda" value={item.produtoBusca} onChange={(event) => handleProdutoBusca(index, event.target.value)} placeholder="Buscar por nome ou SKU" className={`${inputClassName} pl-11`} /></div></label>
                          <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Quantidade</span><input type="number" min={1} value={item.quantidade} onChange={(event) => updateItem(index, { quantidade: Math.max(Number(event.target.value) || 0, 0) })} className={inputClassName} /></label>
                          <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Preço unitário</span><input type="number" min={0} step="0.01" value={item.precoUnitario} onChange={(event) => updateItem(index, { precoUnitario: Math.max(Number(event.target.value) || 0, 0) })} className={inputClassName} /></label>
                          <div className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Subtotal</span><div className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-text)]">{formatCurrency(subtotalItem)}</div></div>
                          <button type="button" onClick={() => removeItem(index)} className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-medium text-[var(--color-text)] transition hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">Remover</button>
                        </div>
                        {produto ? (<div className="mt-2.5 flex flex-wrap items-center gap-3 text-sm text-[var(--color-text-soft)]"><span>SKU {produto.sku}</span><span>•</span><span>Disponível {getSaldoDisponivel(produto.id, depositoId, saldos)}</span><span>•</span><span>{produto.nome}</span></div>) : null}
                      </div>
                    );
                  })}
                  <datalist id="produtos-venda">{produtos.map((produto) => (<option key={produto.id} value={getProductOptionLabel(produto.nome, produto.sku)} />))}</datalist>
                  <button type="button" onClick={addItem} className="rounded-xl border border-dashed border-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-[var(--color-primary)] transition hover:bg-[rgba(21,93,252,0.04)]">Adicionar item</button>
                </div>
              </div>

              <div className="border-t ui-divider pt-5">
                <div className="mb-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    Financeiro e pagamento
                  </p>
                </div>
                <div className="grid gap-5 xl:grid-cols-[1.05fr_0.95fr]">
                  <div className="space-y-3">
                    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-4">
                      <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Tipo de desconto</span><select value={descontoTipo} onChange={(event) => setDescontoTipo(event.target.value as DescontoTipo)} className={inputClassName}>{descontoOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}</select></label>
                      <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Desconto</span><input type="number" min={0} step="0.01" value={descontoValor} onChange={(event) => setDescontoValor(Math.max(Number(event.target.value) || 0, 0))} className={inputClassName} /></label>
                      <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Acréscimos</span><input type="number" min={0} step="0.01" value={acrescimoValor} onChange={(event) => setAcrescimoValor(Math.max(Number(event.target.value) || 0, 0))} className={inputClassName} /></label>
                      <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Frete</span><input type="number" min={0} step="0.01" value={freteValor} onChange={(event) => setFreteValor(Math.max(Number(event.target.value) || 0, 0))} className={inputClassName} /></label>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
                      <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Forma de pagamento</span><select value={formaPagamento} onChange={(event) => setFormaPagamento(event.target.value as FormaPagamento)} className={inputClassName}>{pagamentoFormaOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}</select></label>
                      <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Status do pagamento</span><select value={statusPagamento} onChange={(event) => setStatusPagamento(event.target.value as PagamentoStatus)} className={inputClassName}>{pagamentoStatusOptions.map((option) => (<option key={option.value} value={option.value}>{option.label}</option>))}</select></label>
                      <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Valor pago</span><input type="number" min={0} step="0.01" value={valorPago} onChange={(event) => setValorPago(Math.max(Number(event.target.value) || 0, 0))} className={inputClassName} /></label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t ui-divider pt-5">
                <div className="mb-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">
                    Observações e revisão final
                  </p>
                </div>
                <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
                  <label className="space-y-2 text-sm"><span className="font-medium text-[var(--color-text)]">Observações gerais</span><textarea value={observacao} onChange={(event) => setObservacao(event.target.value)} rows={4} placeholder="Anote detalhes da venda, entrega ou alinhamento com o cliente" className={inputClassName} /></label>
                  <div className="ui-surface-3 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-text-soft)]">Conferência final</p>
                    <div className="mt-3 space-y-2.5 text-sm">
                      <SummaryLine label="Itens" value={`${preparedItems.reduce((total, item) => total + item.quantidade, 0)} un`} />
                      <SummaryLine label="Cliente" value={clienteNome || "Não informado"} />
                      <SummaryLine label="Canal" value={canal === "online" ? "Online" : "Loja Física"} />
                      <SummaryLine label="Pagamento" value={getPagamentoLabel(formaPagamento)} />
                      <SummaryLine label="Status" value={getVendaStatusLabel(status)} />
                      <SummaryLine label="Total" value={formatCurrency(totalFinal)} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t ui-divider pt-5">
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <button type="button" onClick={resetForm} className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-text)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">Cancelar</button>
                  <button type="button" onClick={() => handleSalvar("rascunho")} className="rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm font-semibold text-[var(--color-text)] transition-all hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">Salvar rascunho</button>
                  <button type="button" onClick={() => handleSalvar("concluida")} className="rounded-xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[var(--color-primary-strong)]">Concluir venda</button>
                </div>
              </div>
            </div>
          </section>
        </div>

        <aside className="space-y-4 xl:sticky xl:top-[calc(var(--header-height)+1.25rem)]">
          <section className="ui-surface-brand p-5">
            <div className="mb-4 flex items-center justify-between gap-3"><div><p className="ui-metric-label ui-text-inverse-muted">Resumo final</p><p className="mt-2 text-3xl font-semibold text-white">{formatCurrency(totalFinal)}</p></div><div className="ui-icon-chip-brand"><ReceiptText className="h-5 w-5" /></div></div>
            <div className="space-y-3 text-sm"><SummaryLine label="Itens" value={`${preparedItems.reduce((total, item) => total + item.quantidade, 0)} un`} inverse /><SummaryLine label="Subtotal" value={formatCurrency(subtotal)} inverse /><SummaryLine label="Desconto" value={formatCurrency(descontoAplicado)} inverse /><SummaryLine label="Troco" value={formatCurrency(troco)} inverse /><SummaryLine label="Canal" value={canal === "online" ? "Online" : "Loja Física"} inverse /><SummaryLine label="Cliente" value={clienteNome || "Não informado"} inverse /><SummaryLine label="Pagamento" value={getPagamentoLabel(formaPagamento)} inverse /><SummaryLine label="Status" value={getVendaStatusLabel(status)} inverse /></div>
          </section>

          <section className="ui-surface-1 p-5">
            <div className="mb-3 flex items-center gap-2"><CreditCard className="h-4 w-4 text-[var(--color-primary)]" /><p className="text-sm font-semibold text-[var(--color-text)]">Conferência rápida</p></div>
            <div className="space-y-3">{preparedItems.length ? preparedItems.map((item) => (<div key={`${item.produto.id}-${item.quantidade}`} className="ui-surface-3 flex items-center justify-between gap-3 px-4 py-3"><div><p className="text-sm font-medium text-[var(--color-text)]">{item.produto.nome}</p><p className="text-xs text-[var(--color-text-soft)]">{item.quantidade} x {formatCurrency(item.precoUnitario)}</p></div><p className="text-sm font-semibold text-[var(--color-text)]">{formatCurrency(item.subtotal)}</p></div>)) : (<div className="ui-surface-2 border-dashed px-4 py-6 ui-body">Adicione itens para montar a venda.</div>)}</div>
          </section>
        </aside>
      </section>
    </PageContainer>
  );
}

function createEmptyItem(): ItemForm {
  return { produtoId: "", produtoBusca: "", quantidade: 1, precoUnitario: 0 };
}

function SummaryLine({ label, value, inverse = false }: { label: string; value: string; inverse?: boolean }) {
  return <div className="flex items-center justify-between gap-3"><span className={inverse ? "ui-text-inverse-soft" : "text-sm text-[var(--color-text-soft)]"}>{label}</span><span className={inverse ? "text-sm font-semibold text-white" : "text-sm font-semibold text-[var(--color-text)]"}>{value}</span></div>;
}
function getProductOptionLabel(nome: string, sku?: string) {
  return sku ? `${nome} • ${sku}` : nome;
}

function findProdutoBySearch(
  value: string,
  produtos: Array<{ id: string; nome: string; sku?: string; precoVenda?: { valor: number } }>,
) {
  const termo = value.trim().toLowerCase();
  return produtos.find((produto) => {
    const label = getProductOptionLabel(produto.nome, produto.sku).toLowerCase();
    return label === termo || produto.nome.toLowerCase() === termo || produto.sku?.toLowerCase() === termo;
  });
}

function getSaldoDisponivel(
  produtoId: string,
  depositoId: string,
  saldos: Array<{ produtoId: string; depositoId: string; quantidadeDisponivel: number }>,
) {
  return saldos.find((saldo) => saldo.produtoId === produtoId && saldo.depositoId === depositoId)?.quantidadeDisponivel ?? 0;
}

function getPagamentoLabel(value: FormaPagamento) {
  return pagamentoFormaOptions.find((option) => option.value === value)?.label ?? "Outro";
}

function getVendaStatusLabel(value: VendaStatus) {
  return statusOptions.find((option) => option.value === value)?.label ?? "Em aberto";
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value);
}
