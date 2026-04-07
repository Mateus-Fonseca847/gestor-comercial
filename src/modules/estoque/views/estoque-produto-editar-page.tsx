"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ActionBar } from "@/components/page/action-bar";
import { EmptyState } from "@/components/page/empty-state";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { FeedbackBanner } from "@/modules/estoque/components/feedback-banner";
import { FormSectionCard } from "@/modules/estoque/components/form-section-card";
import {
  SelectField,
  TextField,
} from "@/modules/estoque/components/produto-form-fields";
import { useFeedback } from "@/modules/estoque/components/use-feedback";
import { useEstoqueEntityList, useEstoqueStore } from "@/modules/estoque/store";
import type { ProdutoCadastroFormValues } from "@/modules/estoque/types/estoque.types";

const editarProdutoSchema = z.object({
  nome: z.string().min(3, "Informe o nome do produto"),
  sku: z.string().min(3, "Informe o SKU"),
  codigoInterno: z.string().min(2, "Informe o codigo interno"),
  categoria: z.string().min(1, "Selecione a categoria"),
  precoVenda: z.coerce.number().min(0, "Informe um preco valido"),
  estoqueMinimo: z.coerce.number().min(0, "Informe o estoque minimo"),
  fornecedorId: z.string().min(1, "Selecione o fornecedor"),
  depositos: z.array(
    z.object({
      deposito: z.string(),
      quantidade: z.coerce.number().min(0, "Informe o estoque atual"),
      localizacao: z.string(),
    }),
  ),
});

const emptyValues: ProdutoCadastroFormValues = {
  nome: "",
  sku: "",
  codigoInterno: "",
  descricao: "",
  precoCusto: 0,
  precoVenda: 0,
  categoria: "",
  fornecedorId: "",
  tipoProduto: "simples",
  unidadeMedida: "UN",
  ativo: true,
  variacoes: [{ tamanho: "padrao", cor: "padrao", modelo: "padrao" }],
  imagens: [""],
  ncm: "",
  cest: "",
  cfopPadrao: "",
  origemFiscal: "0",
  localizacaoPrincipal: "A-01-01",
  depositos: [{ deposito: "", quantidade: 0, localizacao: "A-01-01" }],
  estoqueMinimo: 0,
  controlaLote: false,
  controlaValidade: false,
  ehKit: false,
  componentesKit: "",
  camposFlexiveis: {
    referenciaFabricante: "",
    colecao: "",
    observacoesInternas: "",
  },
};

export function EstoqueProdutoEditarPage({ id }: { id: string }) {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const { feedback, showFeedback, clearFeedback } = useFeedback();
  const categorias = useEstoqueEntityList("categorias");
  const fornecedores = useEstoqueEntityList("fornecedores");
  const depositos = useEstoqueEntityList("depositos");
  const produto = useEstoqueStore((state) => state.entities.produtos.byId[id]);
  const saldosProduto = useEstoqueEntityList("saldosProduto");
  const saldos = useMemo(
    () => saldosProduto.filter((saldo) => saldo.produtoId === id),
    [id, saldosProduto],
  );
  const editarProduto = useEstoqueStore((state) => state.actions.editarProduto);
  const upsertEntity = useEstoqueStore((state) => state.actions.upsertEntity);
  const sincronizarAlertas = useEstoqueStore((state) => state.actions.sincronizarAlertas);

  const categoryOptions = useMemo(() => categorias.map((item) => item.nome), [categorias]);
  const supplierOptions = useMemo(
    () => fornecedores.map((item) => item.nomeFantasia ?? item.razaoSocial),
    [fornecedores],
  );
  const saldoPrincipal = saldos[0];
  const depositoPrincipal =
    (saldoPrincipal && depositos.find((item) => item.id === saldoPrincipal.depositoId)) || depositos[0];

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ProdutoCadastroFormValues>({
    resolver: zodResolver(editarProdutoSchema) as never,
    defaultValues: emptyValues,
  });

  useEffect(() => {
    if (!produto) {
      return;
    }

    const categoriaAtual = categorias.find((item) => item.id === produto.categoriaId);
    const fornecedorAtual = fornecedores.find(
      (item) => item.id === produto.fornecedorPrincipalId,
    );

    reset({
      ...emptyValues,
      nome: produto.nome,
      sku: produto.sku,
      codigoInterno: produto.codigoInterno,
      descricao: produto.descricao ?? "",
      precoCusto: produto.precoCusto?.valor ?? 0,
      precoVenda: produto.precoVenda?.valor ?? 0,
      categoria: categoriaAtual?.nome ?? "",
      fornecedorId: fornecedorAtual?.nomeFantasia ?? fornecedorAtual?.razaoSocial ?? "",
      ativo: produto.ativo,
      ncm: produto.fiscal?.ncm ?? "",
      cest: produto.fiscal?.cest ?? "",
      cfopPadrao: produto.fiscal?.cfopPadrao ?? "",
      origemFiscal: produto.fiscal?.origemFiscal ?? "0",
      localizacaoPrincipal: saldoPrincipal?.localizacao ?? "A-01-01",
      depositos: [
        {
          deposito: depositoPrincipal?.nome ?? "",
          quantidade: saldoPrincipal?.quantidadeDisponivel ?? 0,
          localizacao: saldoPrincipal?.localizacao ?? "A-01-01",
        },
      ],
      estoqueMinimo: produto.estoqueMinimo,
    });
  }, [categorias, depositoPrincipal?.nome, fornecedores, produto, reset, saldoPrincipal]);

  const onSubmit = handleSubmit((values) => {
    if (!produto) {
      return;
    }

    const categoria = categorias.find((item) => item.nome === values.categoria);
    const fornecedor = fornecedores.find(
      (item) => (item.nomeFantasia ?? item.razaoSocial) === values.fornecedorId,
    );
    const depositoDestino = depositoPrincipal ?? depositos[0];

    if (!categoria) {
      setError("categoria", { message: "Categoria invalida" });
      showFeedback({
        tone: "error",
        title: "Categoria inválida",
        description: "Selecione uma categoria válida para salvar as alterações.",
      });
      return;
    }

    if (!fornecedor) {
      setError("fornecedorId", { message: "Fornecedor invalido" });
      showFeedback({
        tone: "error",
        title: "Fornecedor inválido",
        description: "Selecione um fornecedor válido para salvar as alterações.",
      });
      return;
    }

    if (!depositoDestino) {
      setError("nome", { message: "Nenhum deposito disponivel para vincular o saldo" });
      showFeedback({
        tone: "error",
        title: "Sem depósito disponível",
        description: "Ative um depósito antes de salvar as alterações do produto.",
      });
      return;
    }

    const preco = Number(values.precoVenda);
    const estoqueDisponivel = Number(values.depositos[0]?.quantidade ?? 0);
    const quantidadeReservada = saldoPrincipal?.quantidadeReservada ?? 0;
    const estoqueMinimo = Number(values.estoqueMinimo);

    editarProduto(id, {
      codigoInterno: values.codigoInterno,
      sku: values.sku,
      nome: values.nome,
      descricao: values.descricao || values.nome,
      categoriaId: categoria.id,
      fornecedorPrincipalId: fornecedor.id,
      precoCusto: produto.precoCusto,
      precoVenda: { valor: preco, moeda: "BRL" },
      estoqueMinimo,
      pontoReposicao: estoqueMinimo,
      fiscal: {
        ncm: values.ncm,
        cest: values.cest,
        cfopPadrao: values.cfopPadrao,
        origemFiscal: values.origemFiscal,
      },
      ativo: produto.ativo,
      status: produto.status,
    });

    upsertEntity("saldosProduto", {
      id: saldoPrincipal?.id ?? `saldo-${id}-${depositoDestino.id}`,
      produtoId: id,
      depositoId: depositoDestino.id,
      quantidadeDisponivel: estoqueDisponivel,
      quantidadeReservada,
      quantidadeFisica: estoqueDisponivel + quantidadeReservada,
      estoqueMinimo,
      localizacao: values.localizacaoPrincipal || saldoPrincipal?.localizacao || "A-01-01",
    });

    sincronizarAlertas();
    setSaved(true);
    showFeedback({
      tone: "success",
      title: "Alterações salvas",
      description: "O produto e o saldo principal já foram atualizados no store.",
    });
    window.setTimeout(() => {
      router.push("/estoque/produtos");
    }, 600);
  });

  if (!produto) {
    return (
      <PageContainer>
        <EmptyState
          title="Produto nao encontrado"
          description="O produto informado nao existe no store local do estoque."
          actionLabel="Voltar para produtos"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Editar produto"
        description="Atualize os dados principais do produto e reflita a alteracao imediatamente na listagem."
        actions={[
          { label: saved ? "Salvo" : "Salvar alteracoes" },
          { label: "Voltar para listagem", variant: "secondary" },
        ]}
      />

      <ActionBar
        items={[
          { label: saved ? "Alteracoes salvas" : "Edicao conectada ao store" },
          { label: "Atualizacao imediata", tone: "neutral" },
        ]}
      />

      <FeedbackBanner feedback={feedback} onDismiss={clearFeedback} />

      <form onSubmit={onSubmit} className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <FormSectionCard
            title="Dados principais"
            description="Ajuste os campos centrais do cadastro sem sair do fluxo administrativo atual."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <TextField label="Nome" name="nome" register={register} errors={errors} />
              <TextField label="SKU" name="sku" register={register} errors={errors} />
              <TextField label="Codigo" name="codigoInterno" register={register} errors={errors} />
              <SelectField
                label="Categoria"
                name="categoria"
                register={register}
                errors={errors}
                options={categoryOptions}
              />
              <TextField
                label="Preco"
                name="precoVenda"
                type="number"
                register={register}
                errors={errors}
              />
              <TextField
                label="Estoque minimo"
                name="estoqueMinimo"
                type="number"
                register={register}
                errors={errors}
              />
              <label className="space-y-2">
                <span className="text-sm font-medium text-[var(--color-text)]">Estoque atual</span>
                <input
                  type="number"
                  {...register("depositos.0.quantidade", { valueAsNumber: true })}
                  className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
                />
                {errors.depositos?.[0]?.quantidade ? (
                  <p className="text-xs text-[#b42318]">
                    {String(errors.depositos[0].quantidade.message)}
                  </p>
                ) : null}
              </label>
              <SelectField
                label="Fornecedor"
                name="fornecedorId"
                register={register}
                errors={errors}
                options={supplierOptions}
              />
            </div>
          </FormSectionCard>
        </div>

        <div className="space-y-4">
          <aside className="rounded-[28px] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#edf4ff_100%)] p-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-soft)]">
                Edicao conectada ao store
              </p>
              <h2 className="text-xl font-semibold text-[var(--color-primary)]">
                As alteracoes atualizam a base local na hora.
              </h2>
              <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                Ao salvar, o produto e o saldo principal sao atualizados no store global e a tabela reflete o novo estado sem backend.
              </p>
            </div>

            <div className="mt-6 flex flex-col gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-full bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
              >
                {saved ? "Alteracoes salvas" : "Salvar alteracoes"}
              </button>
              <Link
                href="/estoque/produtos"
                className="w-full rounded-full border border-[var(--color-border)] px-4 py-3 text-center text-sm font-medium text-[var(--color-primary)]"
              >
                Cancelar
              </Link>
            </div>
          </aside>
        </div>
      </form>
    </PageContainer>
  );
}
