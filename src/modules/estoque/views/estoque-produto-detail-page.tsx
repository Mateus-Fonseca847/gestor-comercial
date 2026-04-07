import Link from "next/link";
import { ActionBar } from "@/components/page/action-bar";
import { EmptyState } from "@/components/page/empty-state";
import { PageContainer } from "@/components/page/page-container";
import { StatusBadge } from "@/components/page/status-badge";
import { FormSectionCard } from "@/modules/estoque/components/form-section-card";
import { ProdutoDetailHistory } from "@/modules/estoque/components/produto-detail-history";
import { ProdutoDetailList } from "@/modules/estoque/components/produto-detail-list";
import { ProdutoDetailSummaryGrid } from "@/modules/estoque/components/produto-detail-summary-grid";
import { ProdutoDetailTabs } from "@/modules/estoque/components/produto-detail-tabs";
import { estoqueService } from "@/modules/estoque/services/estoque.service";

const sectionItems = [
  { label: "Visao geral", href: "#visao-geral" },
  { label: "Estoque", href: "#estoque" },
  { label: "Variacoes", href: "#variacoes" },
  { label: "Fiscal", href: "#fiscal" },
  { label: "Imagens", href: "#imagens" },
  { label: "Fornecedores", href: "#fornecedores" },
  { label: "Movimentacoes", href: "#movimentacoes" },
  { label: "Historico", href: "#historico" },
];

export function EstoqueProdutoDetailPage({ id }: { id: string }) {
  const produto = estoqueService.getProdutoById(id);

  if (!produto) {
    return (
      <PageContainer>
        <EmptyState
          title="Produto nao encontrado"
          description="O identificador informado nao existe na base mockada do estoque."
          actionLabel="Voltar para produtos"
        />
      </PageContainer>
    );
  }

  const summaryItems = [
    { label: "Estoque atual", value: produto.resumo.estoqueAtual },
    { label: "Reservado", value: produto.resumo.estoqueReservado },
    { label: "Estoque minimo", value: produto.resumo.estoqueMinimo },
    { label: "Ultimo custo", value: produto.resumo.ultimoCusto },
    { label: "Ultima movimentacao", value: produto.resumo.ultimaMovimentacao },
  ];

  return (
    <PageContainer>
      <section className="rounded-[30px] border border-[var(--color-border)] bg-[linear-gradient(135deg,#ffffff_0%,#edf4ff_58%,#dfeaff_100%)] p-6 shadow-[0_20px_44px_rgba(0,74,173,0.08)]">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[var(--color-border)] bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
                SKU {produto.sku}
              </span>
              <StatusBadge variant={getProductStatusVariant(produto.status)}>
                {produto.status}
              </StatusBadge>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-primary)]">
                {produto.nome}
              </h1>
              <p className="max-w-3xl text-sm leading-7 text-[var(--color-text-soft)]">
                Central de gestao do item com leitura operacional, fornecedores,
                historico e dados prontos para evolucao futura.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-[var(--color-text-soft)]">
              <span>Codigo {produto.codigo}</span>
              <span className="text-[var(--color-accent)]">/</span>
              <span>{produto.categoria}</span>
              <span className="text-[var(--color-accent)]">/</span>
              <span>{produto.deposito}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-full border border-[var(--color-border)] bg-white/85 px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-surface-alt)]"
            >
              Editar cadastro
            </button>
            <button
              type="button"
              className="rounded-full border border-[var(--color-border)] bg-white/85 px-4 py-2 text-sm font-medium text-[var(--color-primary)] transition-colors hover:bg-[var(--color-surface-alt)]"
            >
              Duplicar produto
            </button>
            <Link
              href="/estoque/movimentacoes"
              className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[var(--color-primary-strong)]"
            >
              Nova movimentacao
            </Link>
          </div>
        </div>
      </section>

      <ActionBar
        items={[
          { label: "Atualizar estoque" },
          { label: "Registrar compra", tone: "neutral" },
          { label: "Vincular fornecedor", tone: "neutral" },
          { label: "Gerar relatorio", tone: "neutral" },
        ]}
      />

      <ProdutoDetailTabs items={sectionItems} />

      <ProdutoDetailSummaryGrid items={summaryItems} />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <FormSectionCard
            title="Visao geral"
            description="Dados base do cadastro e parametros principais do produto."
          >
            <div id="visao-geral" className="grid gap-4 text-sm md:grid-cols-2">
              <InfoCard label="Descricao" value={produto.visaoGeral.descricao} />
              <InfoCard
                label="Tipo de produto"
                value={produto.visaoGeral.tipoProduto}
              />
              <InfoCard
                label="Unidade de medida"
                value={produto.visaoGeral.unidadeMedida}
              />
              <InfoCard label="Categoria" value={produto.visaoGeral.categoria} />
              <InfoCard
                label="Deposito principal"
                value={produto.visaoGeral.depositoPrincipal}
              />
              <InfoCard
                label="Observacoes"
                value={produto.visaoGeral.observacoes}
              />
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="Estoque"
            description="Leitura por deposito, localizacao e cobertura atual."
          >
            <div id="estoque" className="space-y-3">
              <ProdutoDetailList
                items={produto.estoques.map((item) => ({
                  id: item.deposito,
                  primary: item.deposito,
                  secondary: `Disponivel ${item.disponivel}  |  Reservado ${item.reservado}  |  Minimo ${item.minimo}`,
                  tertiary: `${item.localizacao}  |  Cobertura ${item.cobertura}`,
                  status: "Operando",
                  statusVariant: "success",
                }))}
                emptyLabel="Nenhum saldo por deposito configurado."
              />
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="Variacoes"
            description="Grade pronta para combinar atributos e saldos derivados."
          >
            <div id="variacoes">
              <ProdutoDetailList
                items={produto.variacoes.map((item) => ({
                  id: item.id,
                  primary: item.nome,
                  secondary: `Atributos ${item.atributos}  |  SKU ${item.sku}`,
                  tertiary: `Estoque ${item.estoque}`,
                  status: item.status,
                  statusVariant: "info",
                }))}
                emptyLabel="Este produto nao possui variacoes cadastradas."
              />
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="Fiscal"
            description="Parametros fiscais e referencias tributarias do item."
          >
            <div id="fiscal" className="grid gap-4 text-sm md:grid-cols-2">
              <InfoCard label="NCM" value={produto.fiscal.ncm} />
              <InfoCard label="CEST" value={produto.fiscal.cest} />
              <InfoCard label="CFOP padrao" value={produto.fiscal.cfop} />
              <InfoCard label="Origem" value={produto.fiscal.origem} />
              <InfoCard label="Tributacao" value={produto.fiscal.tributacao} />
            </div>
          </FormSectionCard>
        </div>

        <div className="space-y-6">
          <FormSectionCard
            title="Imagens"
            description="Area preparada para galeria e organizacao visual do cadastro."
          >
            <div id="imagens" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {produto.imagens.length ? (
                produto.imagens.map((imagem) => (
                  <article
                    key={imagem.id}
                    className="overflow-hidden rounded-[22px] border border-[var(--color-border)] bg-white"
                  >
                    <div
                      className={[
                        "h-32 w-full",
                        imagem.tone === "dark"
                          ? "bg-[linear-gradient(135deg,#1653a4_0%,#004aad_100%)]"
                          : imagem.tone === "medium"
                            ? "bg-[linear-gradient(135deg,#80afed_0%,#366fbb_100%)]"
                            : "bg-[linear-gradient(135deg,#f8fbff_0%,#dbe9ff_100%)]",
                      ].join(" ")}
                    />
                    <div className="px-4 py-3">
                      <p className="text-sm font-medium text-[var(--color-text)]">
                        {imagem.label}
                      </p>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[22px] border border-dashed border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-6 text-sm text-[var(--color-text-soft)]">
                  Nenhuma imagem vinculada ao produto.
                </div>
              )}
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="Fornecedores"
            description="Relacionamentos comerciais e custos de referencia."
          >
            <div id="fornecedores">
              <ProdutoDetailList
                items={produto.fornecedores.map((item) => ({
                  id: item.id,
                  primary: item.nome,
                  secondary: `Prazo ${item.prazo}  |  Ultimo custo ${item.custo}`,
                  status: item.status,
                  statusVariant: item.status === "Principal" ? "success" : "info",
                }))}
                emptyLabel="Nenhum fornecedor vinculado a este produto."
              />
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="Movimentacoes"
            description="Ultimos registros de entrada, saida e ajustes do item."
          >
            <div id="movimentacoes">
              <ProdutoDetailList
                items={produto.movimentacoes.map((item) => ({
                  id: item.id,
                  primary: `${item.tipo}  |  ${item.quantidade}`,
                  secondary: item.origem,
                  tertiary: item.data,
                  status: item.status,
                  statusVariant: item.status === "Concluida" ? "success" : "warning",
                }))}
                emptyLabel="Nenhuma movimentacao recente encontrada."
              />
            </div>
          </FormSectionCard>

          <FormSectionCard
            title="Historico"
            description="Linha do tempo de alteracoes relevantes do cadastro."
          >
            <div id="historico">
              <ProdutoDetailHistory items={produto.historico} />
            </div>
          </FormSectionCard>
        </div>
      </div>
    </PageContainer>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[22px] border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-text-soft)]">
        {label}
      </p>
      <p className="mt-2 text-sm leading-6 text-[var(--color-text)]">{value}</p>
    </article>
  );
}

function getProductStatusVariant(status: string) {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus.includes("saud")) {
    return "success" as const;
  }

  if (normalizedStatus.includes("baixo")) {
    return "warning" as const;
  }

  return "danger" as const;
}
