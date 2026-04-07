"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ActionBar } from "@/components/page/action-bar";
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

const novoProdutoSchema = z.object({
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
      quantidade: z.coerce.number().min(0, "Informe o estoque inicial"),
      localizacao: z.string(),
    }),
  ),
});

const defaultValues: ProdutoCadastroFormValues = {
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
  imagens: ["https://example.com/produto.png"],
  ncm: "0000",
  cest: "000",
  cfopPadrao: "5102",
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

export function EstoqueProdutoNovoPage() {
  const router = useRouter();
  const [saved, setSaved] = useState(false);
  const { feedback, showFeedback, clearFeedback } = useFeedback();
  const categorias = useEstoqueEntityList("categorias");
  const fornecedores = useEstoqueEntityList("fornecedores");
  const depositos = useEstoqueEntityList("depositos");
  const adicionarProduto = useEstoqueStore((state) => state.actions.adicionarProduto);
  const upsertEntity = useEstoqueStore((state) => state.actions.upsertEntity);
  const sincronizarAlertas = useEstoqueStore((state) => state.actions.sincronizarAlertas);

  const categoryOptions = useMemo(() => categorias.map((item) => item.nome), [categorias]);
  const supplierOptions = useMemo(
    () => fornecedores.map((item) => item.nomeFantasia ?? item.razaoSocial),
    [fornecedores],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ProdutoCadastroFormValues>({
    resolver: zodResolver(novoProdutoSchema) as never,
    defaultValues,
  });

  const onSubmit = handleSubmit((values) => {
    const categoria = categorias.find((item) => item.nome === values.categoria);
    const fornecedor = fornecedores.find(
      (item) => (item.nomeFantasia ?? item.razaoSocial) === values.fornecedorId,
    );
    const depositoInicial = depositos[0];

    if (!categoria) {
      setError("categoria", { message: "Categoria invalida" });
      showFeedback({
        tone: "error",
        title: "Categoria inválida",
        description: "Selecione uma categoria válida para continuar.",
      });
      return;
    }

    if (!fornecedor) {
      setError("fornecedorId", { message: "Fornecedor invalido" });
      showFeedback({
        tone: "error",
        title: "Fornecedor inválido",
        description: "Selecione um fornecedor válido para continuar.",
      });
      return;
    }

    if (!depositoInicial) {
      setError("nome", { message: "Nenhum deposito disponivel para o estoque inicial" });
      showFeedback({
        tone: "error",
        title: "Sem depósito disponível",
        description: "Cadastre ou ative um depósito antes de criar o produto.",
      });
      return;
    }

    const preco = Number(values.precoVenda);
    const estoqueInicial = Number(values.depositos[0]?.quantidade ?? 0);
    const estoqueMinimo = Number(values.estoqueMinimo);

    const produtoId = adicionarProduto({
      codigoInterno: values.codigoInterno,
      sku: values.sku,
      nome: values.nome,
      descricao: values.descricao || values.nome,
      categoriaId: categoria.id,
      fornecedorPrincipalId: fornecedor.id,
      tipo: "simples",
      status: "ativo",
      unidadeMedida: "UN",
      precoCusto: { valor: preco, moeda: "BRL" },
      precoVenda: { valor: preco, moeda: "BRL" },
      estoqueMinimo,
      pontoReposicao: estoqueMinimo,
      controlaLote: false,
      controlaValidade: false,
      ativo: true,
      fiscal: {
        ncm: values.ncm,
        cest: values.cest,
        cfopPadrao: values.cfopPadrao,
        origemFiscal: values.origemFiscal,
      },
      imagens: [],
      variacoes: [],
      tags: ["cadastro-manual"],
    });

    upsertEntity("saldosProduto", {
      id: `saldo-${produtoId}-${depositoInicial.id}`,
      produtoId,
      depositoId: depositoInicial.id,
      quantidadeDisponivel: estoqueInicial,
      quantidadeReservada: 0,
      quantidadeFisica: estoqueInicial,
      estoqueMinimo,
      localizacao: values.localizacaoPrincipal || "A-01-01",
    });

    sincronizarAlertas();
    setSaved(true);
    showFeedback({
      tone: "success",
      title: "Produto salvo",
      description: "O produto já foi incluído no store e aparecerá na listagem.",
    });
    window.setTimeout(() => {
      router.push("/estoque/produtos");
    }, 600);
  });

  return (
    <PageContainer>
      <SectionHeader
        title="Novo produto"
        description="Cadastro enxuto para incluir rapidamente um item no estoque e refletir na listagem."
        actions={[
          { label: saved ? "Salvo" : "Salvar produto" },
          { label: "Voltar para listagem", variant: "secondary" },
        ]}
      />

      <ActionBar
        items={[
          { label: saved ? "Produto salvo" : "Salvar produto" },
          { label: "Cadastro rapido", tone: "neutral" },
        ]}
      />

      <FeedbackBanner feedback={feedback} onDismiss={clearFeedback} />

      <form onSubmit={onSubmit} className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <FormSectionCard
            title="Dados principais"
            description="Informacoes minimas para criacao e publicacao do produto no estoque."
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
                <span className="text-sm font-medium text-[var(--color-text)]">Estoque inicial</span>
                <input
                  type="number"
                  {...register("depositos.0.quantidade", { valueAsNumber: true })}
                  className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
                />
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
                Fluxo conectado ao store
              </p>
              <h2 className="text-xl font-semibold text-[var(--color-primary)]">
                O produto entra direto na base local.
              </h2>
              <p className="text-sm leading-6 text-[var(--color-text-soft)]">
                Ao salvar, o item e o saldo inicial sao gravados no store global e ficam disponiveis imediatamente na listagem.
              </p>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-full bg-[var(--color-primary)] px-4 py-3 text-sm font-medium text-white disabled:opacity-60"
            >
              {saved ? "Produto salvo" : "Salvar produto"}
            </button>
          </aside>
        </div>
      </form>
    </PageContainer>
  );
}
