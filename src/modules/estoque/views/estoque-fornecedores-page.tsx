"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ActionBar } from "@/components/page/action-bar";
import { DataTable } from "@/components/page/data-table";
import { EmptyState } from "@/components/page/empty-state";
import { FilterBar } from "@/components/page/filter-bar";
import { PageContainer } from "@/components/page/page-container";
import { SectionHeader } from "@/components/page/section-header";
import { ContextCard } from "@/modules/estoque/components/context-card";
import { FeedbackBanner } from "@/modules/estoque/components/feedback-banner";
import { FormSectionCard } from "@/modules/estoque/components/form-section-card";
import { useFeedback } from "@/modules/estoque/components/use-feedback";
import { formatFornecedorStatus } from "@/modules/estoque/helpers";
import { useEstoqueEntityList, useEstoqueStore } from "@/modules/estoque/store";

type FornecedorRow = {
  id: string;
  nome: string;
  categoria: string;
  prazo: string;
  produtosVinculados: number;
  produtosResumo: string;
  status: string;
};

const fornecedorSchema = z.object({
  razaoSocial: z.string().min(3, "Informe a razao social"),
  nomeFantasia: z.string().min(3, "Informe o nome fantasia"),
  documento: z.string().min(11, "Informe o documento"),
  email: z.string().email("Informe um e-mail valido"),
  telefone: z.string().min(8, "Informe o telefone"),
  status: z.enum(["ativo", "inativo", "em_analise", "bloqueado"]),
});

type FornecedorFormValues = z.infer<typeof fornecedorSchema>;

export function EstoqueFornecedoresPage() {
  const [editingFornecedorId, setEditingFornecedorId] = useState<string | null>(null);
  const { feedback, showFeedback, clearFeedback } = useFeedback();
  const fornecedores = useEstoqueEntityList("fornecedores");
  const produtos = useEstoqueEntityList("produtos");
  const adicionarFornecedor = useEstoqueStore((state) => state.actions.adicionarFornecedor);
  const editarFornecedor = useEstoqueStore((state) => state.actions.editarFornecedor);
  const desativarFornecedor = useEstoqueStore((state) => state.actions.desativarFornecedor);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FornecedorFormValues>({
    resolver: zodResolver(fornecedorSchema),
    defaultValues: {
      razaoSocial: "",
      nomeFantasia: "",
      documento: "",
      email: "",
      telefone: "",
      status: "ativo",
    },
  });

  const rows: FornecedorRow[] = fornecedores.map((fornecedor) => {
    const produtosDoFornecedor = produtos.filter(
      (produto) => produto.fornecedorPrincipalId === fornecedor.id,
    );

    return {
      id: fornecedor.id,
      nome: fornecedor.nomeFantasia ?? fornecedor.razaoSocial,
      categoria: fornecedor.categoriaPrincipal ?? "Sem categoria",
      prazo: fornecedor.prazoMedioEntregaDias
        ? `${fornecedor.prazoMedioEntregaDias} dias`
        : "Nao informado",
      produtosVinculados: produtosDoFornecedor.length,
      produtosResumo: formatProdutosResumo(produtosDoFornecedor.map((produto) => produto.nome)),
      status: formatFornecedorStatus(fornecedor.status),
    };
  });

  const supplierColumns = [
    { key: "nome", header: "Fornecedor" },
    { key: "categoria", header: "Categoria" },
    { key: "prazo", header: "Prazo medio" },
    {
      key: "produtos",
      header: "Produtos vinculados",
      render: (row: FornecedorRow) => (
        <div className="space-y-1">
          <p className="font-medium text-[var(--color-text)]">
            {row.produtosVinculados} vinculados
          </p>
          <p className="text-xs text-[var(--color-text-soft)]">{row.produtosResumo}</p>
        </div>
      ),
    },
    { key: "status", header: "Status" },
    {
      key: "acoes",
      header: "Acoes",
      render: (row: FornecedorRow) => (
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={() => handleEdit(row.id)}
            className="rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-medium text-[var(--color-primary)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-surface-alt)]"
          >
            Editar
          </button>
          <button
            type="button"
            onClick={() => handleDeactivate(row.id)}
            disabled={row.status === "Inativo"}
            className="rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-700 transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {row.status === "Inativo" ? "Inativo" : "Desativar"}
          </button>
        </div>
      ),
    },
  ];

  const totalAtivos = fornecedores.filter((fornecedor) => fornecedor.status === "ativo").length;
  const leadTimes = fornecedores
    .map((fornecedor) => fornecedor.prazoMedioEntregaDias)
    .filter((value): value is number => typeof value === "number");
  const leadTimeMedio = leadTimes.length
    ? `${Math.round(leadTimes.reduce((total, value) => total + value, 0) / leadTimes.length)} dias`
    : "--";
  const categoriasCobertas = new Set(
    fornecedores
      .map((fornecedor) => fornecedor.categoriaPrincipal)
      .filter((value): value is string => Boolean(value)),
  ).size;

  useEffect(() => {
    if (!editingFornecedorId) {
      reset({
        razaoSocial: "",
        nomeFantasia: "",
        documento: "",
        email: "",
        telefone: "",
        status: "ativo",
      });
      return;
    }

    const fornecedor = fornecedores.find((item) => item.id === editingFornecedorId);

    if (!fornecedor) {
      setEditingFornecedorId(null);
      return;
    }

    setValue("razaoSocial", fornecedor.razaoSocial);
    setValue("nomeFantasia", fornecedor.nomeFantasia ?? "");
    setValue("documento", fornecedor.documento);
    setValue("email", fornecedor.email ?? "");
    setValue("telefone", fornecedor.telefone ?? "");
    setValue("status", fornecedor.status);
  }, [editingFornecedorId, fornecedores, reset, setValue]);

  const onSubmit = handleSubmit((values) => {
    const documentoLimpo = values.documento.replace(/\D/g, "");

    if (editingFornecedorId) {
      const fornecedorAtual = fornecedores.find((item) => item.id === editingFornecedorId);

      if (!fornecedorAtual) {
        return;
      }

      editarFornecedor(editingFornecedorId, {
        razaoSocial: values.razaoSocial.trim(),
        nomeFantasia: values.nomeFantasia.trim(),
        documento: values.documento.trim(),
        tipoPessoa: documentoLimpo.length > 11 ? "juridica" : "fisica",
        status: values.status,
        email: values.email.trim(),
        telefone: values.telefone.trim(),
        codigo: fornecedorAtual.codigo,
      });
      setEditingFornecedorId(null);
      showFeedback({
        tone: "success",
        title: "Fornecedor atualizado",
        description: "As alterações já foram aplicadas na listagem.",
      });
    } else {
      adicionarFornecedor({
        codigo: createFornecedorCodigo(values.nomeFantasia || values.razaoSocial),
        razaoSocial: values.razaoSocial.trim(),
        nomeFantasia: values.nomeFantasia.trim(),
        documento: values.documento.trim(),
        tipoPessoa: documentoLimpo.length > 11 ? "juridica" : "fisica",
        status: values.status,
        email: values.email.trim(),
        telefone: values.telefone.trim(),
      });
      showFeedback({
        tone: "success",
        title: "Fornecedor criado",
        description: "O novo fornecedor já está disponível no store.",
      });
    }

    reset({
      razaoSocial: "",
      nomeFantasia: "",
      documento: "",
      email: "",
      telefone: "",
      status: "ativo",
    });
  });

  function handleEdit(fornecedorId: string) {
    setEditingFornecedorId(fornecedorId);
    showFeedback({
      tone: "info",
      title: "Modo de edição ativo",
      description: "Revise os dados e salve para atualizar a listagem.",
    });
  }

  function handleCancelEdit() {
    setEditingFornecedorId(null);
    reset({
      razaoSocial: "",
      nomeFantasia: "",
      documento: "",
      email: "",
      telefone: "",
      status: "ativo",
    });
  }

  function handleDeactivate(fornecedorId: string) {
    if (!window.confirm("Deseja desativar este fornecedor?")) {
      return;
    }

    desativarFornecedor(fornecedorId);
    showFeedback({
      tone: "warning",
      title: "Fornecedor desativado",
      description: "O registro foi mantido e continua disponível para histórico.",
    });
  }

  return (
    <PageContainer>
      <SectionHeader
        title="Fornecedores"
        description="Gerencie parceiros de abastecimento, prazo medio e disponibilidade operacional."
        actions={[{ label: "Novo fornecedor" }]}
      />

      <FormSectionCard
        title={editingFornecedorId ? "Editar fornecedor" : "Novo fornecedor"}
        description="Cadastro minimo ligado ao store global para atualizar a listagem imediatamente."
      >
        <div className="mb-4">
          <FeedbackBanner feedback={feedback} onDismiss={clearFeedback} />
        </div>
        <form onSubmit={onSubmit} className="grid gap-4 lg:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Razao social</span>
            <input
              type="text"
              {...register("razaoSocial")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            />
            {errors.razaoSocial ? (
              <p className="text-xs text-[#b42318]">{errors.razaoSocial.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Nome fantasia</span>
            <input
              type="text"
              {...register("nomeFantasia")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            />
            {errors.nomeFantasia ? (
              <p className="text-xs text-[#b42318]">{errors.nomeFantasia.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Documento</span>
            <input
              type="text"
              {...register("documento")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            />
            {errors.documento ? (
              <p className="text-xs text-[#b42318]">{errors.documento.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">E-mail</span>
            <input
              type="email"
              {...register("email")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            />
            {errors.email ? <p className="text-xs text-[#b42318]">{errors.email.message}</p> : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Telefone</span>
            <input
              type="text"
              {...register("telefone")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            />
            {errors.telefone ? (
              <p className="text-xs text-[#b42318]">{errors.telefone.message}</p>
            ) : null}
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-[var(--color-text)]">Status</span>
            <select
              {...register("status")}
              className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="em_analise">Em analise</option>
              <option value="bloqueado">Bloqueado</option>
            </select>
          </label>

          <div className="lg:col-span-3 flex justify-end gap-2">
            {editingFornecedorId ? (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="h-11 rounded-xl border border-[var(--color-border)] bg-white px-6 text-sm font-medium text-[var(--color-primary)]"
              >
                Cancelar
              </button>
            ) : null}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 rounded-xl bg-[var(--color-primary)] px-6 text-sm font-medium text-white disabled:opacity-60"
            >
              {editingFornecedorId ? "Salvar alteracoes" : "Salvar fornecedor"}
            </button>
          </div>
        </form>
      </FormSectionCard>

      <section className="grid gap-4 lg:grid-cols-3">
        <ContextCard
          title="Base ativa"
          value={`${totalAtivos} parceiros`}
          description="Fornecedores ativos conectados ao store global do estoque."
        />
        <ContextCard
          title="Lead time medio"
          value={leadTimeMedio}
          description="Indicador calculado a partir dos prazos medios cadastrados."
        />
        <ContextCard
          title="Categorias cobertas"
          value={`${categoriasCobertas} grupos`}
          description="Cobertura atual de abastecimento com base nos fornecedores do store."
        />
      </section>

      <ActionBar
        items={[
          { label: "Novo fornecedor" },
          { label: "Importar contatos", tone: "neutral" },
        ]}
      />

      <FilterBar
        placeholder="Buscar por fornecedor ou categoria"
        chips={[
          { label: "Todos", active: true },
          { label: "Ativos" },
          { label: "Em analise" },
        ]}
      />

      <section className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <DataTable
          columns={supplierColumns}
          data={rows}
          emptyState={
            <EmptyState
              title="Nenhum fornecedor vinculado"
              description="Cadastre os primeiros parceiros para organizar compras, lead time e relacionamento comercial do estoque."
              actionLabel="Adicionar fornecedor"
            />
          }
        />

        <aside className="rounded-[28px] border border-[var(--color-border)] bg-[linear-gradient(180deg,#ffffff_0%,#edf4ff_100%)] p-6">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-text-soft)]">
              Proximo passo
            </p>
            <h2 className="text-xl font-semibold text-[var(--color-primary)]">
              Estruture sua rede de abastecimento.
            </h2>
            <p className="text-sm leading-6 text-[var(--color-text-soft)]">
              Comece pelos fornecedores criticos para compras recorrentes e itens de maior impacto no giro do estoque.
            </p>
          </div>

          <div className="mt-6 space-y-3">
            <div className="rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3">
              <p className="text-sm font-medium text-[var(--color-text)]">
                Prioridade sugerida
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                Cadastre parceiros para itens com alerta de estoque baixo.
              </p>
            </div>
            <div className="rounded-2xl border border-[var(--color-border)] bg-white/80 px-4 py-3">
              <p className="text-sm font-medium text-[var(--color-text)]">
                Dados recomendados
              </p>
              <p className="mt-1 text-sm text-[var(--color-text-soft)]">
                Nome, categoria, prazo medio e condicoes comerciais principais.
              </p>
            </div>
          </div>
        </aside>
      </section>
    </PageContainer>
  );
}

function createFornecedorCodigo(value: string) {
  const normalized = value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "FORNECEDOR";
}

function formatProdutosResumo(produtos: string[]) {
  if (!produtos.length) {
    return "Nenhum produto vinculado";
  }

  if (produtos.length <= 2) {
    return produtos.join(", ");
  }

  return `${produtos.slice(0, 2).join(", ")} +${produtos.length - 2}`;
}
