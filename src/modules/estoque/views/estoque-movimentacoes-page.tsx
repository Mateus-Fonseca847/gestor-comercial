"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { EmptyState } from "@/components/page/empty-state";
import { FilterBar } from "@/components/page/filter-bar";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { StatusBadge } from "@/components/page/status-badge";
import { ContextCard } from "@/modules/estoque/components/context-card";
import { FeedbackBanner } from "@/modules/estoque/components/feedback-banner";
import { FormSectionCard } from "@/modules/estoque/components/form-section-card";
import { useFeedback } from "@/modules/estoque/components/use-feedback";
import {
  formatDateBR,
  formatMovimentacaoOrigemOperacional,
  formatMovimentacaoStatus,
  formatMovimentacaoTipo,
} from "@/modules/estoque/helpers";
import { useEstoqueEntityList, useEstoqueStore } from "@/modules/estoque/store";
import type { MovimentacaoOrigemOperacional } from "@/modules/estoque/types";

type MovimentacaoRow = {
  id: string;
  descricao: string;
  origem: string;
  data: string;
  tipo: string;
  status: string;
  origemOperacional: string;
};

const origemOperacionalOptions: Array<{
  value: MovimentacaoOrigemOperacional;
  label: string;
}> = [
  { value: "venda_loja", label: "Venda na loja" },
  { value: "pedido_whatsapp", label: "Pedido via WhatsApp" },
  { value: "ajuste_interno", label: "Ajuste interno" },
  { value: "reposicao_estoque", label: "Reposição de estoque" },
  { value: "devolucao", label: "Devolução" },
];

const movimentacaoBaseSchema = z.object({
  produtoId: z.string().min(1, "Selecione o produto"),
  depositoId: z.string().min(1, "Selecione o depósito"),
  quantidade: z.coerce.number().positive("Informe uma quantidade válida"),
  data: z.string().min(1, "Informe a data"),
  origemOperacional: z.enum([
    "venda_loja",
    "pedido_whatsapp",
    "ajuste_interno",
    "reposicao_estoque",
    "devolucao",
  ]),
  observacao: z.string().optional(),
});

const ajusteManualSchema = z.object({
  produtoId: z.string().min(1, "Selecione o produto"),
  depositoId: z.string().min(1, "Selecione o depósito"),
  quantidadeAjustada: z.coerce.number().min(0, "Informe uma quantidade válida"),
  motivo: z.string().min(3, "Informe o motivo"),
  origemOperacional: z.enum([
    "venda_loja",
    "pedido_whatsapp",
    "ajuste_interno",
    "reposicao_estoque",
    "devolucao",
  ]),
  observacao: z.string().optional(),
});

const reservaSchema = z.object({
  produtoId: z.string().min(1, "Selecione o produto"),
  depositoId: z.string().min(1, "Selecione o depósito"),
  quantidadeReservada: z.coerce.number().positive("Informe uma quantidade válida"),
  origemOperacional: z.enum([
    "venda_loja",
    "pedido_whatsapp",
    "ajuste_interno",
    "reposicao_estoque",
    "devolucao",
  ]),
  observacao: z.string().optional(),
});

type EntradaSaidaFormValues = z.infer<typeof movimentacaoBaseSchema>;
type AjusteManualFormValues = z.infer<typeof ajusteManualSchema>;
type ReservaFormValues = z.infer<typeof reservaSchema>;

export function EstoqueMovimentacoesPage() {
  const [periodoFiltro, setPeriodoFiltro] = useState("todos");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const { feedback, showFeedback, clearFeedback } = useFeedback();

  const movimentacoes = useEstoqueEntityList("movimentacoes");
  const produtos = useEstoqueEntityList("produtos");
  const depositos = useEstoqueEntityList("depositos");
  const saldosProduto = useEstoqueEntityList("saldosProduto");
  const reservas = useEstoqueEntityList("reservas");
  const produtosById = useEstoqueStore((state) => state.entities.produtos.byId);
  const depositosById = useEstoqueStore((state) => state.entities.depositos.byId);
  const registrarMovimentacao = useEstoqueStore((state) => state.actions.registrarMovimentacao);
  const ajustarEstoque = useEstoqueStore((state) => state.actions.ajustarEstoque);
  const reservarEstoque = useEstoqueStore((state) => state.actions.reservarEstoque);

  const entradaForm = useForm<EntradaSaidaFormValues>({
    resolver: zodResolver(movimentacaoBaseSchema),
    defaultValues: {
      produtoId: "",
      depositoId: "",
      quantidade: 1,
      data: getTodayInputValue(),
      origemOperacional: "reposicao_estoque",
      observacao: "",
    },
  });

  const saidaForm = useForm<EntradaSaidaFormValues>({
    resolver: zodResolver(movimentacaoBaseSchema),
    defaultValues: {
      produtoId: "",
      depositoId: "",
      quantidade: 1,
      data: getTodayInputValue(),
      origemOperacional: "venda_loja",
      observacao: "",
    },
  });

  const ajusteForm = useForm<AjusteManualFormValues>({
    resolver: zodResolver(ajusteManualSchema),
    defaultValues: {
      produtoId: "",
      depositoId: "",
      quantidadeAjustada: 0,
      motivo: "",
      origemOperacional: "ajuste_interno",
      observacao: "",
    },
  });

  const reservaForm = useForm<ReservaFormValues>({
    resolver: zodResolver(reservaSchema),
    defaultValues: {
      produtoId: "",
      depositoId: "",
      quantidadeReservada: 1,
      origemOperacional: "pedido_whatsapp",
      observacao: "",
    },
  });

  const filteredMovimentacoes = useMemo(
    () =>
      movimentacoes.filter((movimentacao) => {
        if (tipoFiltro !== "todos" && movimentacao.tipo !== tipoFiltro) {
          return false;
        }

        return matchesPeriodoFiltro(movimentacao.dataMovimentacao, periodoFiltro);
      }),
    [movimentacoes, periodoFiltro, tipoFiltro],
  );

  const rows: MovimentacaoRow[] = useMemo(
    () =>
      filteredMovimentacoes
        .slice()
        .sort(
          (a, b) =>
            new Date(b.dataMovimentacao).getTime() - new Date(a.dataMovimentacao).getTime(),
        )
        .map((movimentacao) => ({
          id: movimentacao.id,
          descricao: buildDescricao(movimentacao.tipo, produtosById[movimentacao.produtoId]?.nome),
          origem: buildOrigem(
            movimentacao,
            depositosById[movimentacao.depositoOrigemId ?? ""],
            depositosById[movimentacao.depositoDestinoId ?? ""],
          ),
          data: formatDateBR(movimentacao.dataMovimentacao, true),
          tipo: formatMovimentacaoTipo(movimentacao.tipo),
          status: formatMovimentacaoStatus(movimentacao.status),
          origemOperacional: formatMovimentacaoOrigemOperacional(
            movimentacao.origemOperacional,
          ),
        })),
    [depositosById, filteredMovimentacoes, produtosById],
  );

  const entradasHoje = movimentacoes.filter(
    (item) => item.tipo === "entrada" && isToday(item.dataMovimentacao),
  ).length;
  const saidasHoje = movimentacoes.filter(
    (item) => item.tipo === "saida" && isToday(item.dataMovimentacao),
  ).length;
  const reservasAtivas = reservas.filter((item) => item.status === "ativa").length;

  const onSubmitEntrada = entradaForm.handleSubmit((values) => {
    const produto = produtosById[values.produtoId];

    if (!produto) {
      return;
    }

    registrarMovimentacao({
      tipo: "entrada",
      status: "confirmada",
      origemTipo: "manual",
      origemOperacional: values.origemOperacional,
      produtoId: values.produtoId,
      depositoDestinoId: values.depositoId,
      quantidade: values.quantidade,
      unidadeMedida: produto.unidadeMedida,
      dataMovimentacao: new Date(values.data).toISOString(),
      observacao: values.observacao?.trim() || undefined,
    });

    entradaForm.reset({
      produtoId: "",
      depositoId: "",
      quantidade: 1,
      data: getTodayInputValue(),
      origemOperacional: "reposicao_estoque",
      observacao: "",
    });

    showFeedback({
      tone: "success",
      title: "Entrada registrada",
      description: "A movimentação foi salva com a origem operacional informada.",
    });
  });

  const onSubmitSaida = saidaForm.handleSubmit((values) => {
    const produto = produtosById[values.produtoId];

    if (!produto) {
      return;
    }

    const saldo = saldosProduto.find(
      (item) => item.produtoId === values.produtoId && item.depositoId === values.depositoId,
    );
    const saldoDisponivel = saldo?.quantidadeDisponivel ?? 0;

    if (saldoDisponivel < values.quantidade) {
      saidaForm.setError("quantidade", {
        message: `Saldo disponível insuficiente. Disponível: ${saldoDisponivel}`,
      });
      showFeedback({
        tone: "error",
        title: "Saldo insuficiente",
        description: `Disponível no depósito: ${saldoDisponivel}.`,
      });
      return;
    }

    registrarMovimentacao({
      tipo: "saida",
      status: "confirmada",
      origemTipo: "manual",
      origemOperacional: values.origemOperacional,
      produtoId: values.produtoId,
      depositoOrigemId: values.depositoId,
      quantidade: values.quantidade,
      unidadeMedida: produto.unidadeMedida,
      dataMovimentacao: new Date(values.data).toISOString(),
      observacao: values.observacao?.trim() || undefined,
    });

    saidaForm.reset({
      produtoId: "",
      depositoId: "",
      quantidade: 1,
      data: getTodayInputValue(),
      origemOperacional: "venda_loja",
      observacao: "",
    });

    showFeedback({
      tone: "success",
      title: "Saída registrada",
      description: "A saída foi salva com o canal operacional informado.",
    });
  });

  const onSubmitAjuste = ajusteForm.handleSubmit((values) => {
    ajustarEstoque({
      produtoId: values.produtoId,
      depositoId: values.depositoId,
      quantidadeAjustada: values.quantidadeAjustada,
      dataMovimentacao: new Date().toISOString(),
      motivo: values.motivo.trim(),
      origemOperacional: values.origemOperacional,
      observacao: values.observacao?.trim() || undefined,
    });

    ajusteForm.reset({
      produtoId: "",
      depositoId: "",
      quantidadeAjustada: 0,
      motivo: "",
      origemOperacional: "ajuste_interno",
      observacao: "",
    });

    showFeedback({
      tone: "success",
      title: "Ajuste registrado",
      description: "O ajuste foi salvo com a origem operacional informada.",
    });
  });

  const onSubmitReserva = reservaForm.handleSubmit((values) => {
    const reservaId = reservarEstoque({
      produtoId: values.produtoId,
      depositoId: values.depositoId,
      origemTipo: "manual",
      origemId: `manual-${Date.now()}`,
      quantidadeReservada: values.quantidadeReservada,
      origemOperacional: values.origemOperacional,
      observacao: values.observacao?.trim() || undefined,
    });

    if (!reservaId) {
      showFeedback({
        tone: "error",
        title: "Reserva não registrada",
        description: "Revise o saldo disponível e tente novamente.",
      });
      return;
    }

    reservaForm.reset({
      produtoId: "",
      depositoId: "",
      quantidadeReservada: 1,
      origemOperacional: "pedido_whatsapp",
      observacao: "",
    });

    showFeedback({
      tone: "success",
      title: "Reserva registrada",
      description: "A reserva entrou no estoque com a origem operacional informada.",
    });
  });

  return (
    <PageContainer>
      <SectionHeader
        title="Movimentações"
        description="Registre entradas, saídas, ajustes e reservas com a origem real da operação da loja."
        actions={[{ label: "Registrar entrada" }]}
      />

      <section className="grid gap-6 lg:grid-cols-3">
        <ContextCard
          title="Entradas hoje"
          value={String(entradasHoje)}
          description="Reposições, devoluções e recebimentos do dia."
        />
        <ContextCard
          title="Saídas hoje"
          value={String(saidasHoje)}
          description="Baixas de venda e outras saídas da operação."
        />
        <ContextCard
          title="Reservas ativas"
          value={String(reservasAtivas)}
          description="Itens separados para pedidos e atendimentos."
        />
      </section>

      <FeedbackBanner feedback={feedback} onDismiss={clearFeedback} />

      <div className="grid gap-6 xl:grid-cols-2">
        <FormSectionCard
          title="Lançar entrada"
          description="Use a origem operacional para mostrar se a entrada veio de reposição ou devolução."
        >
          <MovimentacaoForm
            form={entradaForm}
            produtos={produtos}
            depositos={depositos}
            quantidadeField="quantidade"
            onSubmit={onSubmitEntrada}
            submitLabel="Registrar entrada"
          />
        </FormSectionCard>

        <FormSectionCard
          title="Lançar saída"
          description="Informe se a saída veio da loja, do WhatsApp, de devolução ou outro contexto operacional."
        >
          <MovimentacaoForm
            form={saidaForm}
            produtos={produtos}
            depositos={depositos}
            quantidadeField="quantidade"
            onSubmit={onSubmitSaida}
            submitLabel="Registrar saída"
          />
        </FormSectionCard>

        <FormSectionCard
          title="Lançar ajuste"
          description="Registre ajuste interno sem perder o motivo operacional da movimentação."
        >
          <AjusteForm
            form={ajusteForm}
            produtos={produtos}
            depositos={depositos}
            onSubmit={onSubmitAjuste}
          />
        </FormSectionCard>

        <FormSectionCard
          title="Lançar reserva"
          description="Reserve itens para pedido WhatsApp, venda na loja ou outra necessidade da rotina comercial."
        >
          <ReservaForm
            form={reservaForm}
            produtos={produtos}
            depositos={depositos}
            onSubmit={onSubmitReserva}
          />
        </FormSectionCard>
      </div>

      <FilterBar
        placeholder="Filtrar movimentações"
        chips={[
          { label: "Todas", active: tipoFiltro === "todos" },
          { label: "Entradas", active: tipoFiltro === "entrada" },
          { label: "Saídas", active: tipoFiltro === "saida" },
          { label: "Reservas", active: tipoFiltro === "reserva" },
        ]}
      />

      <section className="grid gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 shadow-[var(--shadow-sm)] md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-[var(--color-text)]">Período</span>
          <select
            value={periodoFiltro}
            onChange={(event) => setPeriodoFiltro(event.target.value)}
            className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
          >
            <option value="todos">Todos</option>
            <option value="hoje">Hoje</option>
            <option value="7dias">Últimos 7 dias</option>
            <option value="30dias">Últimos 30 dias</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-[var(--color-text)]">Tipo</span>
          <select
            value={tipoFiltro}
            onChange={(event) => setTipoFiltro(event.target.value)}
            className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
          >
            <option value="todos">Todos</option>
            <option value="entrada">Entrada</option>
            <option value="saida">Saída</option>
            <option value="ajuste">Ajuste</option>
            <option value="reserva">Reserva</option>
            <option value="liberacao_reserva">Liberação de reserva</option>
          </select>
        </label>
      </section>

      {rows.length ? (
        <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
          <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Últimas movimentações
              </h2>
              <p className="text-sm text-[var(--color-text-soft)]">
                Agora a origem operacional aparece junto de cada movimentação.
              </p>
            </div>
            <StatusBadge variant="info">{rows.length} registros</StatusBadge>
          </div>

          <div className="space-y-3">
            {rows.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="space-y-1">
                  <h3 className="font-medium text-[var(--color-text)]">{item.descricao}</h3>
                  <p className="text-sm text-[var(--color-text-soft)]">{item.origem}</p>
                  <p className="text-sm text-[var(--color-text-soft)]">{item.data}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge variant="info">{item.origemOperacional}</StatusBadge>
                  <StatusBadge variant={item.tipo === "Saída" ? "warning" : item.tipo === "Reserva" ? "warning" : "info"}>
                    {item.tipo}
                  </StatusBadge>
                  <StatusBadge variant={item.status === "Confirmada" ? "success" : "warning"}>
                    {item.status}
                  </StatusBadge>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="Nenhuma movimentação registrada"
          description="As entradas, saídas, ajustes e reservas aparecem aqui com a origem operacional informada."
          actionLabel="Registrar movimentação"
        />
      )}
    </PageContainer>
  );
}

function MovimentacaoForm({ form, produtos, depositos, quantidadeField, onSubmit, submitLabel }: {
  form: ReturnType<typeof useForm<EntradaSaidaFormValues>>;
  produtos: Array<{ id: string; nome: string }>;
  depositos: Array<{ id: string; nome: string }>;
  quantidadeField: "quantidade";
  onSubmit: () => void;
  submitLabel: string;
}) {
  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <SelectField label="Produto" error={errors.produtoId?.message}>
        <select {...register("produtoId")} className={fieldClassName}>
          <option value="">Selecione</option>
          {produtos.map((produto) => (
            <option key={produto.id} value={produto.id}>{produto.nome}</option>
          ))}
        </select>
      </SelectField>

      <SelectField label="Depósito" error={errors.depositoId?.message}>
        <select {...register("depositoId")} className={fieldClassName}>
          <option value="">Selecione</option>
          {depositos.map((deposito) => (
            <option key={deposito.id} value={deposito.id}>{deposito.nome}</option>
          ))}
        </select>
      </SelectField>

      <InputField label="Quantidade" error={errors.quantidade?.message}>
        <input type="number" min={1} step={1} {...register(quantidadeField, { valueAsNumber: true })} className={fieldClassName} />
      </InputField>

      <InputField label="Data" error={errors.data?.message}>
        <input type="date" {...register("data")} className={fieldClassName} />
      </InputField>

      <SelectField label="Origem operacional" error={errors.origemOperacional?.message}>
        <select {...register("origemOperacional")} className={fieldClassName}>
          {origemOperacionalOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </SelectField>

      <InputField label="Observação">
        <input type="text" {...register("observacao")} className={fieldClassName} />
      </InputField>

      <div className="xl:col-span-3 flex justify-end">
        <button type="submit" disabled={isSubmitting} className="h-11 rounded-xl bg-[var(--color-primary)] px-6 text-sm font-medium text-white disabled:opacity-60">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}

function AjusteForm({ form, produtos, depositos, onSubmit }: {
  form: ReturnType<typeof useForm<AjusteManualFormValues>>;
  produtos: Array<{ id: string; nome: string }>;
  depositos: Array<{ id: string; nome: string }>;
  onSubmit: () => void;
}) {
  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <SelectField label="Produto" error={errors.produtoId?.message}>
        <select {...register("produtoId")} className={fieldClassName}>
          <option value="">Selecione</option>
          {produtos.map((produto) => (
            <option key={produto.id} value={produto.id}>{produto.nome}</option>
          ))}
        </select>
      </SelectField>
      <SelectField label="Depósito" error={errors.depositoId?.message}>
        <select {...register("depositoId")} className={fieldClassName}>
          <option value="">Selecione</option>
          {depositos.map((deposito) => (
            <option key={deposito.id} value={deposito.id}>{deposito.nome}</option>
          ))}
        </select>
      </SelectField>
      <InputField label="Quantidade ajustada" error={errors.quantidadeAjustada?.message}>
        <input type="number" min={0} step={1} {...register("quantidadeAjustada", { valueAsNumber: true })} className={fieldClassName} />
      </InputField>
      <InputField label="Motivo" error={errors.motivo?.message}>
        <input type="text" {...register("motivo")} className={fieldClassName} />
      </InputField>
      <SelectField label="Origem operacional" error={errors.origemOperacional?.message}>
        <select {...register("origemOperacional")} className={fieldClassName}>
          {origemOperacionalOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </SelectField>
      <InputField label="Observação">
        <input type="text" {...register("observacao")} className={fieldClassName} />
      </InputField>
      <div className="xl:col-span-3 flex justify-end">
        <button type="submit" disabled={isSubmitting} className="h-11 rounded-xl bg-[var(--color-primary)] px-6 text-sm font-medium text-white disabled:opacity-60">
          Registrar ajuste
        </button>
      </div>
    </form>
  );
}

function ReservaForm({ form, produtos, depositos, onSubmit }: {
  form: ReturnType<typeof useForm<ReservaFormValues>>;
  produtos: Array<{ id: string; nome: string }>;
  depositos: Array<{ id: string; nome: string }>;
  onSubmit: () => void;
}) {
  const { register, formState: { errors, isSubmitting } } = form;

  return (
    <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
      <SelectField label="Produto" error={errors.produtoId?.message}>
        <select {...register("produtoId")} className={fieldClassName}>
          <option value="">Selecione</option>
          {produtos.map((produto) => (
            <option key={produto.id} value={produto.id}>{produto.nome}</option>
          ))}
        </select>
      </SelectField>
      <SelectField label="Depósito" error={errors.depositoId?.message}>
        <select {...register("depositoId")} className={fieldClassName}>
          <option value="">Selecione</option>
          {depositos.map((deposito) => (
            <option key={deposito.id} value={deposito.id}>{deposito.nome}</option>
          ))}
        </select>
      </SelectField>
      <InputField label="Quantidade reservada" error={errors.quantidadeReservada?.message}>
        <input type="number" min={1} step={1} {...register("quantidadeReservada", { valueAsNumber: true })} className={fieldClassName} />
      </InputField>
      <SelectField label="Origem operacional" error={errors.origemOperacional?.message}>
        <select {...register("origemOperacional")} className={fieldClassName}>
          {origemOperacionalOptions.map((option) => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </SelectField>
      <InputField label="Observação">
        <input type="text" {...register("observacao")} className={fieldClassName} />
      </InputField>
      <div className="xl:col-span-3 flex justify-end">
        <button type="submit" disabled={isSubmitting} className="h-11 rounded-xl bg-[var(--color-primary)] px-6 text-sm font-medium text-white disabled:opacity-60">
          Registrar reserva
        </button>
      </div>
    </form>
  );
}

function SelectField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
      {children}
      {error ? <p className="text-xs text-[#b42318]">{error}</p> : null}
    </label>
  );
}

function InputField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
      {children}
      {error ? <p className="text-xs text-[#b42318]">{error}</p> : null}
    </label>
  );
}

const fieldClassName = "h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none";

function buildDescricao(tipo: string, produtoNome?: string) {
  const nome = produtoNome ?? "Produto";

  if (tipo === "entrada") return `Entrada de ${nome}`;
  if (tipo === "saida") return `Saída de ${nome}`;
  if (tipo === "transferencia") return `Transferência de ${nome}`;
  if (tipo === "reserva") return `Reserva de ${nome}`;
  if (tipo === "liberacao_reserva") return `Liberação de reserva de ${nome}`;
  return `Ajuste de ${nome}`;
}

function buildOrigem(
  movimentacao: {
    origemTipo: string;
    quantidade: number;
    unidadeMedida: string;
    depositoOrigemId?: string;
    depositoDestinoId?: string;
  },
  depositoOrigem?: { nome: string },
  depositoDestino?: { nome: string },
) {
  const quantidade = `${movimentacao.quantidade} ${movimentacao.unidadeMedida}`;

  if (movimentacao.depositoOrigemId && movimentacao.depositoDestinoId) {
    return `${depositoOrigem?.nome ?? "Origem"} -> ${depositoDestino?.nome ?? "Destino"} • ${quantidade}`;
  }

  if (movimentacao.depositoDestinoId) {
    return `${depositoDestino?.nome ?? "Destino"} • ${quantidade}`;
  }

  if (movimentacao.depositoOrigemId) {
    return `${depositoOrigem?.nome ?? "Origem"} • ${quantidade}`;
  }

  return quantidade;
}

function isToday(value: string) {
  const date = new Date(value);
  const now = new Date();

  return (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  );
}

function matchesPeriodoFiltro(value: string, periodoFiltro: string) {
  if (periodoFiltro === "todos") return true;
  if (periodoFiltro === "hoje") return isToday(value);

  const now = new Date();
  const date = new Date(value);
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

  if (periodoFiltro === "7dias") return diffInDays <= 7;
  if (periodoFiltro === "30dias") return diffInDays <= 30;
  return true;
}

function getTodayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
