import type { AlertaEstoque, EntityId, Produto, ProdutoSaldo } from "@/modules/estoque/types";

export type ProdutoEstoqueStatus = "saudavel" | "baixo" | "zerado" | "inativo";

type RecalcularAlertasParams = {
  produtos: Produto[];
  saldos: ProdutoSaldo[];
  agora?: string;
};

export function filtrarSaldosPorProduto(
  produtoId: EntityId,
  saldos: ProdutoSaldo[],
): ProdutoSaldo[] {
  return saldos.filter((saldo) => saldo.produtoId === produtoId);
}

export function calcularEstoqueDisponivel(
  produtoId: EntityId,
  saldos: ProdutoSaldo[],
): number {
  return filtrarSaldosPorProduto(produtoId, saldos).reduce(
    (total, saldo) => total + saldo.quantidadeDisponivel,
    0,
  );
}

export function calcularEstoqueReservado(
  produtoId: EntityId,
  saldos: ProdutoSaldo[],
): number {
  return filtrarSaldosPorProduto(produtoId, saldos).reduce(
    (total, saldo) => total + saldo.quantidadeReservada,
    0,
  );
}

export function verificarEstoqueMinimo(
  produto: Produto,
  saldos: ProdutoSaldo[],
): boolean {
  const estoqueDisponivel = calcularEstoqueDisponivel(produto.id, saldos);
  return estoqueDisponivel <= produto.estoqueMinimo;
}

export function calcularStatusProduto(
  produto: Produto,
  saldos: ProdutoSaldo[],
): ProdutoEstoqueStatus {
  if (!produto.ativo || produto.status === "inativo") {
    return "inativo";
  }

  const estoqueDisponivel = calcularEstoqueDisponivel(produto.id, saldos);

  if (estoqueDisponivel <= 0) {
    return "zerado";
  }

  if (verificarEstoqueMinimo(produto, saldos)) {
    return "baixo";
  }

  return "saudavel";
}

export function recalcularAlertas({
  produtos,
  saldos,
  agora,
}: RecalcularAlertasParams): AlertaEstoque[] {
  const geradoEm = agora ?? new Date().toISOString();

  return produtos.flatMap((produto) => {
    const status = calcularStatusProduto(produto, saldos);

    if (status === "inativo" || status === "saudavel") {
      return [];
    }

    const estoqueDisponivel = calcularEstoqueDisponivel(produto.id, saldos);

    if (status === "zerado") {
      return [
        {
          id: `alerta-${produto.id}-zerado`,
          tipo: "estoque_zerado",
          severidade: "critical",
          status: "aberto",
          produtoId: produto.id,
          geradoEm,
          titulo: `${produto.nome} sem estoque`,
          mensagem: `O produto ${produto.nome} esta com estoque disponivel zerado.`,
        },
      ];
    }

    return [
      {
        id: `alerta-${produto.id}-baixo`,
        tipo: "estoque_baixo",
        severidade: "warning",
        status: "aberto",
        produtoId: produto.id,
        geradoEm,
        titulo: `${produto.nome} abaixo do minimo`,
        mensagem: `Estoque disponivel em ${estoqueDisponivel} unidade(s), abaixo do minimo de ${produto.estoqueMinimo}.`,
      },
    ];
  });
}

export function calcularValorTotalEmEstoque(
  produtos: Produto[],
  saldos: ProdutoSaldo[],
): number {
  const produtosPorId = new Map(produtos.map((produto) => [produto.id, produto]));

  return saldos.reduce((total, saldo) => {
    const produto = produtosPorId.get(saldo.produtoId);
    const custoUnitario = produto?.precoCusto?.valor ?? 0;

    return total + saldo.quantidadeFisica * custoUnitario;
  }, 0);
}
