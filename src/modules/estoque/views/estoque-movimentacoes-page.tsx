"use client";

import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ActionBar } from "@/components/page/action-bar";
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
  formatMovimentacaoStatus,
  formatMovimentacaoTipo,
} from "@/modules/estoque/helpers";
import { useEstoqueEntityList, useEstoqueStore } from "@/modules/estoque/store";

type MovimentacaoRow = {
  id: string;
  descricao: string;
  origem: string;
  data: string;
  tipo: string;
  status: string;
};

const entradaManualSchema = z.object({
  produtoId: z.string().min(1, "Selecione o produto"),
  depositoId: z.string().min(1, "Selecione o deposito"),
  quantidade: z.coerce.number().positive("Informe uma quantidade valida"),
  data: z.string().min(1, "Informe a data"),
  observacao: z.string().optional(),
});
const ajusteManualSchema = z.object({
  produtoId: z.string().min(1, "Selecione o produto"),
  depositoId: z.string().min(1, "Selecione o deposito"),
  quantidadeAjustada: z.coerce.number().min(0, "Informe uma quantidade valida"),
  motivo: z.string().min(3, "Informe o motivo"),
  observacao: z.string().optional(),
});

type EntradaManualFormValues = z.infer<typeof entradaManualSchema>;
type SaidaManualFormValues = z.infer<typeof entradaManualSchema>;
type AjusteManualFormValues = z.infer<typeof ajusteManualSchema>;

export function EstoqueMovimentacoesPage() {
  const [periodoFiltro, setPeriodoFiltro] = useState("todos");
  const [tipoFiltro, setTipoFiltro] = useState("todos");
  const [produtoFiltro, setProdutoFiltro] = useState("todos");
  const [depositoFiltro, setDepositoFiltro] = useState("todos");
  const { feedback, showFeedback, clearFeedback } = useFeedback();
  const movimentacoes = useEstoqueEntityList("movimentacoes");
  const produtosById = useEstoqueStore((state) => state.entities.produtos.byId);
  const depositosById = useEstoqueStore((state) => state.entities.depositos.byId);
  const produtos = useEstoqueEntityList("produtos");
  const depositos = useEstoqueEntityList("depositos");
  const saldosProduto = useEstoqueEntityList("saldosProduto");
  const registrarMovimentacao = useEstoqueStore((state) => state.actions.registrarMovimentacao);
  const ajustarEstoque = useEstoqueStore((state) => state.actions.ajustarEstoque);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EntradaManualFormValues>({
    resolver: zodResolver(entradaManualSchema),
    defaultValues: {
      produtoId: "",
      depositoId: "",
      quantidade: 1,
      data: getTodayInputValue(),
      observacao: "",
    },
  });
  const {
    register: registerSaida,
    handleSubmit: handleSubmitSaida,
    reset: resetSaida,
    setError: setSaidaError,
    formState: { errors: saidaErrors, isSubmitting: isSubmittingSaida },
  } = useForm<SaidaManualFormValues>({
    resolver: zodResolver(entradaManualSchema),
    defaultValues: {
      produtoId: "",
      depositoId: "",
      quantidade: 1,
      data: getTodayInputValue(),
      observacao: "",
    },
  });
  const {
    register: registerAjuste,
    handleSubmit: handleSubmitAjuste,
    reset: resetAjuste,
    formState: { errors: ajusteErrors, isSubmitting: isSubmittingAjuste },
  } = useForm<AjusteManualFormValues>({
    resolver: zodResolver(ajusteManualSchema),
    defaultValues: {
      produtoId: "",
      depositoId: "",
      quantidadeAjustada: 0,
      motivo: "",
      observacao: "",
    },
  });

  const produtoOptions = useMemo(
    () =>
      Array.from(
        new Map(
          movimentacoes.map((movimentacao) => [
            movimentacao.produtoId,
            produtosById[movimentacao.produtoId]?.nome ?? "Produto",
          ]),
        ).entries(),
      ),
    [movimentacoes, produtosById],
  );

  const depositoOptions = useMemo(
    () =>
      Array.from(
        new Map(
          movimentacoes.flatMap((movimentacao) => {
            const ids = [movimentacao.depositoOrigemId, movimentacao.depositoDestinoId].filter(
              (value): value is string => Boolean(value),
            );

            return ids.map((id) => [id, depositosById[id]?.nome ?? "Deposito"] as const);
          }),
        ).entries(),
      ),
    [depositosById, movimentacoes],
  );

  const filteredMovimentacoes = useMemo(
    () =>
      movimentacoes.filter((movimentacao) => {
        if (tipoFiltro !== "todos" && movimentacao.tipo !== tipoFiltro) {
          return false;
        }

        if (produtoFiltro !== "todos" && movimentacao.produtoId !== produtoFiltro) {
          return false;
        }

        if (
          depositoFiltro !== "todos" &&
          movimentacao.depositoOrigemId !== depositoFiltro &&
          movimentacao.depositoDestinoId !== depositoFiltro
        ) {
          return false;
        }

        return matchesPeriodoFiltro(movimentacao.dataMovimentacao, periodoFiltro);
      }),
    [depositoFiltro, movimentacoes, periodoFiltro, produtoFiltro, tipoFiltro],
  );

  const rows: MovimentacaoRow[] = filteredMovimentacoes
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
    }));

  const entradasHoje = movimentacoes.filter(
    (item) => item.tipo === "entrada" && isToday(item.dataMovimentacao),
  ).length;
  const saidasHoje = movimentacoes.filter(
    (item) => item.tipo === "saida" && isToday(item.dataMovimentacao),
  ).length;
  const pendencias = movimentacoes.filter((item) => item.status === "pendente").length;

  const onSubmit = handleSubmit((values) => {
    const produto = produtosById[values.produtoId];

    if (!produto) {
      return;
    }

    registrarMovimentacao({
      tipo: "entrada",
      status: "confirmada",
      origemTipo: "manual",
      produtoId: values.produtoId,
      depositoDestinoId: values.depositoId,
      quantidade: values.quantidade,
      unidadeMedida: produto.unidadeMedida,
      dataMovimentacao: new Date(values.data).toISOString(),
      observacao: values.observacao?.trim() || undefined,
    });

    reset({
      produtoId: "",
      depositoId: "",
      quantidade: 1,
      data: getTodayInputValue(),
      observacao: "",
    });
    showFeedback({
      tone: "success",
      title: "Entrada registrada",
      description: "O saldo e a listagem de movimentações já foram atualizados.",
    });
  });
  const onSubmitSaida = handleSubmitSaida((values) => {
    const produto = produtosById[values.produtoId];

    if (!produto) {
      return;
    }

    const saldo = saldosProduto.find(
      (item) => item.produtoId === values.produtoId && item.depositoId === values.depositoId,
    );
    const saldoDisponivel = saldo?.quantidadeDisponivel ?? 0;

    if (saldoDisponivel < values.quantidade) {
      setSaidaError("quantidade", {
        message: `Saldo disponivel insuficiente. Disponivel: ${saldoDisponivel}`,
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
      produtoId: values.produtoId,
      depositoOrigemId: values.depositoId,
      quantidade: values.quantidade,
      unidadeMedida: produto.unidadeMedida,
      dataMovimentacao: new Date(values.data).toISOString(),
      observacao: values.observacao?.trim() || undefined,
    });

    resetSaida({
      produtoId: "",
      depositoId: "",
      quantidade: 1,
      data: getTodayInputValue(),
      observacao: "",
    });
    showFeedback({
      tone: "success",
      title: "Saída registrada",
      description: "A movimentação foi confirmada e o saldo foi abatido.",
    });
  });
  const onSubmitAjuste = handleSubmitAjuste((values) => {
    ajustarEstoque({
      produtoId: values.produtoId,
      depositoId: values.depositoId,
      quantidadeAjustada: values.quantidadeAjustada,
      dataMovimentacao: new Date().toISOString(),
      motivo: values.motivo.trim(),
      observacao: values.observacao?.trim() || undefined,
    });

    resetAjuste({
      produtoId: "",
      depositoId: "",
      quantidadeAjustada: 0,
      motivo: "",
      observacao: "",
    });
    showFeedback({
      tone: "success",
      title: "Ajuste registrado",
      description: "O saldo físico e a movimentação de ajuste já foram atualizados.",
    });
  });

  return (
    <PageContainer>
      <SectionHeader
        title="Movimentacoes de estoque"
        description="Acompanhe entradas e saidas registradas pela operacao com foco em rastreabilidade."
        actions={[{ label: "Nova movimentacao" }]}
      />

      <section className="grid gap-6 lg:grid-cols-3">
        <ContextCard
          title="Entradas hoje"
          value={String(entradasHoje)}
          description="Recebimentos e integracoes finalizadas na janela operacional atual."
        />
        <ContextCard
          title="Saidas hoje"
          value={String(saidasHoje)}
          description="Baixas associadas a pedidos, consumo interno e separacao logistica."
        />
        <ContextCard
          title="Pendencias"
          value={String(pendencias)}
          description="Registros que aguardam conferencia, ajuste ou revisao final."
        />
      </section>

      <ActionBar
        items={[
          { label: "Registrar entrada" },
          { label: "Registrar saida", tone: "neutral" },
        ]}
      />

      <FeedbackBanner feedback={feedback} onDismiss={clearFeedback} />

      <FormSectionCard
        title="Lancar entrada manual"
        description="Registre entradas diretamente no store para atualizar saldo e movimentacoes sem backend."
      >
        <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Produto</span>
            <select
              {...register("produtoId")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            >
              <option value="">Selecione</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </select>
            {errors.produtoId ? (
              <p className="text-xs text-[#b42318]">{errors.produtoId.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Deposito</span>
            <select
              {...register("depositoId")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            >
              <option value="">Selecione</option>
              {depositos.map((deposito) => (
                <option key={deposito.id} value={deposito.id}>
                  {deposito.nome}
                </option>
              ))}
            </select>
            {errors.depositoId ? (
              <p className="text-xs text-[#b42318]">{errors.depositoId.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Quantidade</span>
            <input
              type="number"
              min={1}
              step={1}
              {...register("quantidade", { valueAsNumber: true })}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            />
            {errors.quantidade ? (
              <p className="text-xs text-[#b42318]">{errors.quantidade.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Data</span>
            <input
              type="date"
              {...register("data")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            />
            {errors.data ? <p className="text-xs text-[#b42318]">{errors.data.message}</p> : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Observacao</span>
            <input
              type="text"
              {...register("observacao")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            />
          </label>

          <div className="xl:col-span-5 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-xl bg-[var(--color-primary)] px-6 text-sm font-medium text-white disabled:opacity-60"
            >
              Registrar entrada
            </button>
          </div>
        </form>
      </FormSectionCard>

      <FormSectionCard
        title="Lancar saida manual"
        description="Registre saidas com validacao de saldo disponivel antes de gravar a movimentacao."
      >
        <form onSubmit={onSubmitSaida} className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Produto</span>
            <select
              {...registerSaida("produtoId")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            >
              <option value="">Selecione</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </select>
            {saidaErrors.produtoId ? (
              <p className="text-xs text-[#b42318]">{saidaErrors.produtoId.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Deposito</span>
            <select
              {...registerSaida("depositoId")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            >
              <option value="">Selecione</option>
              {depositos.map((deposito) => (
                <option key={deposito.id} value={deposito.id}>
                  {deposito.nome}
                </option>
              ))}
            </select>
            {saidaErrors.depositoId ? (
              <p className="text-xs text-[#b42318]">{saidaErrors.depositoId.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Quantidade</span>
            <input
              type="number"
              min={1}
              step={1}
              {...registerSaida("quantidade", { valueAsNumber: true })}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            />
            {saidaErrors.quantidade ? (
              <p className="text-xs text-[#b42318]">{saidaErrors.quantidade.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Data</span>
            <input
              type="date"
              {...registerSaida("data")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            />
            {saidaErrors.data ? (
              <p className="text-xs text-[#b42318]">{saidaErrors.data.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Observacao</span>
            <input
              type="text"
              {...registerSaida("observacao")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            />
          </label>

          <div className="xl:col-span-5 flex justify-end">
            <button
              type="submit"
              disabled={isSubmittingSaida}
              className="h-11 rounded-xl bg-[var(--color-primary)] px-6 text-sm font-medium text-white disabled:opacity-60"
            >
              Registrar saida
            </button>
          </div>
        </form>
      </FormSectionCard>

      <FormSectionCard
        title="Lancar ajuste manual"
        description="Ajuste o saldo fisico do deposito e grave uma movimentacao do tipo ajuste."
      >
        <form onSubmit={onSubmitAjuste} className="grid gap-4 lg:grid-cols-2 xl:grid-cols-5">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Produto</span>
            <select
              {...registerAjuste("produtoId")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            >
              <option value="">Selecione</option>
              {produtos.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
            </select>
            {ajusteErrors.produtoId ? (
              <p className="text-xs text-[#b42318]">{ajusteErrors.produtoId.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Deposito</span>
            <select
              {...registerAjuste("depositoId")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            >
              <option value="">Selecione</option>
              {depositos.map((deposito) => (
                <option key={deposito.id} value={deposito.id}>
                  {deposito.nome}
                </option>
              ))}
            </select>
            {ajusteErrors.depositoId ? (
              <p className="text-xs text-[#b42318]">{ajusteErrors.depositoId.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Quantidade ajustada</span>
            <input
              type="number"
              min={0}
              step={1}
              {...registerAjuste("quantidadeAjustada", { valueAsNumber: true })}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            />
            {ajusteErrors.quantidadeAjustada ? (
              <p className="text-xs text-[#b42318]">{ajusteErrors.quantidadeAjustada.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Motivo</span>
            <input
              type="text"
              {...registerAjuste("motivo")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            />
            {ajusteErrors.motivo ? (
              <p className="text-xs text-[#b42318]">{ajusteErrors.motivo.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Observacao</span>
            <input
              type="text"
              {...registerAjuste("observacao")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            />
          </label>

          <div className="xl:col-span-5 flex justify-end">
            <button
              type="submit"
              disabled={isSubmittingAjuste}
              className="h-11 rounded-xl bg-[var(--color-primary)] px-6 text-sm font-medium text-white disabled:opacity-60"
            >
              Registrar ajuste
            </button>
          </div>
        </form>
      </FormSectionCard>

      <FilterBar
        placeholder="Buscar por item, origem ou referencia"
        chips={[
          { label: "Todas", active: tipoFiltro === "todos" },
          { label: "Entradas", active: tipoFiltro === "entrada" },
          { label: "Saidas", active: tipoFiltro === "saida" },
          { label: "Pendentes", active: periodoFiltro === "hoje" || tipoFiltro === "todos" },
        ]}
      />

      <section className="grid gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 shadow-[var(--shadow-sm)] md:grid-cols-2 xl:grid-cols-4">
        <label className="space-y-2">
          <span className="text-sm font-medium text-[var(--color-text)]">Periodo</span>
          <select
            value={periodoFiltro}
            onChange={(event) => setPeriodoFiltro(event.target.value)}
            className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
          >
            <option value="todos">Todos</option>
            <option value="hoje">Hoje</option>
            <option value="7dias">Ultimos 7 dias</option>
            <option value="30dias">Ultimos 30 dias</option>
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
            <option value="saida">Saida</option>
            <option value="transferencia">Transferencia</option>
            <option value="ajuste">Ajuste</option>
            <option value="reserva">Reserva</option>
            <option value="liberacao_reserva">Liberacao de reserva</option>
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-[var(--color-text)]">Produto</span>
          <select
            value={produtoFiltro}
            onChange={(event) => setProdutoFiltro(event.target.value)}
            className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
          >
            <option value="todos">Todos</option>
            {produtoOptions.map(([id, nome]) => (
              <option key={id} value={id}>
                {nome}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-[var(--color-text)]">Deposito</span>
          <select
            value={depositoFiltro}
            onChange={(event) => setDepositoFiltro(event.target.value)}
            className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
          >
            <option value="todos">Todos</option>
            {depositoOptions.map(([id, nome]) => (
              <option key={id} value={id}>
                {nome}
              </option>
            ))}
          </select>
        </label>
      </section>

      {rows.length ? (
        <section className="rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-sm)]">
          <div className="mb-5 flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-[var(--color-text)]">
                Linha do tempo operacional
              </h2>
              <p className="text-sm text-[var(--color-text-soft)]">
                Historico recente das movimentacoes tratadas pelo estoque.
              </p>
            </div>
            <StatusBadge variant="info">{rows.length} registros recentes</StatusBadge>
          </div>

          <div className="space-y-3">
            {rows.map((item) => (
              <article
                key={item.id}
                className="flex flex-col gap-4 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-5 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="space-y-1">
                  <h3 className="font-medium text-[var(--color-text)]">{item.descricao}</h3>
                  <p className="text-sm text-[var(--color-text-soft)]">
                    {item.origem} • {item.data}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <StatusBadge variant={item.tipo === "Entrada" ? "info" : "warning"}>
                    {item.tipo}
                  </StatusBadge>
                  <StatusBadge
                    variant={item.status === "Confirmada" ? "success" : "warning"}
                  >
                    {item.status}
                  </StatusBadge>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="Nenhuma movimentacao registrada"
          description="As entradas e saidas processadas aparecerao aqui com contexto operacional e badges de status."
          actionLabel="Registrar movimentacao"
        />
      )}
    </PageContainer>
  );
}

function buildDescricao(tipo: string, produtoNome?: string) {
  const nome = produtoNome ?? "Produto";

  if (tipo === "entrada") {
    return `Entrada de ${nome}`;
  }

  if (tipo === "saida") {
    return `Saida de ${nome}`;
  }

  if (tipo === "transferencia") {
    return `Transferencia de ${nome}`;
  }

  if (tipo === "reserva") {
    return `Reserva de ${nome}`;
  }

  if (tipo === "liberacao_reserva") {
    return `Liberacao de reserva de ${nome}`;
  }

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

  return `${formatOrigemTipo(movimentacao.origemTipo)} • ${quantidade}`;
}

function formatOrigemTipo(origemTipo: string) {
  if (origemTipo === "pedido_compra") {
    return "Pedido de compra";
  }

  if (origemTipo === "entrada_mercadoria") {
    return "Entrada de mercadoria";
  }

  if (origemTipo === "inventario") {
    return "Inventario";
  }

  if (origemTipo === "reserva") {
    return "Reserva";
  }

  if (origemTipo === "transferencia") {
    return "Transferencia";
  }

  return "Manual";
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
  if (periodoFiltro === "todos") {
    return true;
  }

  if (periodoFiltro === "hoje") {
    return isToday(value);
  }

  const now = new Date();
  const date = new Date(value);
  const diffInDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);

  if (periodoFiltro === "7dias") {
    return diffInDays <= 7;
  }

  if (periodoFiltro === "30dias") {
    return diffInDays <= 30;
  }

  return true;
}

function getTodayInputValue() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
