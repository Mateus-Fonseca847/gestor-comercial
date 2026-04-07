"use client";

import { useMemo } from "react";
import {
  calcularEstoqueDisponivel,
  calcularStatusProduto,
  formatDateBR,
  formatMovimentacaoTipo,
} from "@/modules/estoque/helpers";
import { useEstoqueEntityList } from "@/modules/estoque/store";
import {
  homeRecentClientsMock,
  homeSalesMock,
} from "@/modules/shared/home/home.mock-data";

export function useHomeOperationalData() {
  const produtos = useEstoqueEntityList("produtos");
  const movimentacoes = useEstoqueEntityList("movimentacoes");
  const saldos = useEstoqueEntityList("saldosProduto");

  const salesSummary = useMemo(() => {
    const faturamentoDia = homeSalesMock.reduce((total, sale) => total + sale.valor, 0);
    const vendasDia = homeSalesMock.length;

    return {
      faturamentoDia,
      vendasDia,
      ticketMedio: vendasDia ? faturamentoDia / vendasDia : 0,
    };
  }, []);

  const channelSummary = useMemo(
    () =>
      (["Loja", "WhatsApp"] as const).map((canal) => {
        const sales = homeSalesMock.filter((sale) => sale.canal === canal);

        return {
          canal,
          quantidadePedidos: sales.length,
          valorTotal: sales.reduce((total, sale) => total + sale.valor, 0),
        };
      }),
    [],
  );

  const recentClients = useMemo(
    () =>
      homeRecentClientsMock.map((client) => ({
        id: client.id,
        nome: client.nome,
        origem: client.origem,
        meta: `${client.origem} • ${client.ultimaInteracao}`,
      })),
    [],
  );

  const recentSales = useMemo(
    () =>
      homeSalesMock.slice(-5).reverse().map((sale) => ({
        id: sale.id,
        cliente: sale.cliente,
        canal: sale.canal,
        valor: sale.valor,
        meta: `${sale.canal} • ${sale.hora}`,
      })),
    [],
  );

  const commercialStockMovements = useMemo(
    () =>
      movimentacoes
        .filter(
          (movimentacao) =>
            movimentacao.status === "confirmada" &&
            ["venda_loja", "pedido_whatsapp", "reposicao_estoque", "devolucao"].includes(
              movimentacao.origemOperacional ?? "",
            ),
        )
        .sort(
          (a, b) =>
            new Date(b.dataMovimentacao).getTime() - new Date(a.dataMovimentacao).getTime(),
        )
        .slice(0, 5)
        .map((movimentacao) => {
          const produto = produtos.find((item) => item.id === movimentacao.produtoId);

          return {
            id: movimentacao.id,
            titulo: `${formatMovimentacaoTipo(movimentacao.tipo)} • ${produto?.nome ?? "Produto"}`,
            origemOperacional: movimentacao.origemOperacional,
            meta: `${formatDateBR(movimentacao.dataMovimentacao, true)} • ${formatOrigemOperacional(
              movimentacao.origemOperacional,
            )}`,
          };
        }),
    [movimentacoes, produtos],
  );

  const lowStockCount = useMemo(
    () =>
      produtos.filter((produto) => calcularStatusProduto(produto, saldos) === "baixo").length,
    [produtos, saldos],
  );

  const zeroStockCount = useMemo(
    () =>
      produtos.filter((produto) => calcularStatusProduto(produto, saldos) === "zerado").length,
    [produtos, saldos],
  );

  const replenishmentItems = useMemo(
    () =>
      produtos
        .filter((produto) => {
          const status = calcularStatusProduto(produto, saldos);
          return status === "baixo" || status === "zerado";
        })
        .slice(0, 4)
        .map((produto) => ({
          id: produto.id,
          nome: produto.nome,
          saldo: calcularEstoqueDisponivel(produto.id, saldos),
          minimo: produto.estoqueMinimo,
          status: calcularStatusProduto(produto, saldos),
        })),
    [produtos, saldos],
  );

  return {
    salesSummary,
    channelSummary,
    recentClients,
    recentSales,
    commercialStockMovements,
    lowStockCount,
    zeroStockCount,
    replenishmentItems,
  };
}

function formatOrigemOperacional(origem?: string) {
  if (origem === "venda_loja") return "Venda na loja";
  if (origem === "pedido_whatsapp") return "Pedido WhatsApp";
  if (origem === "reposicao_estoque") return "Reposição";
  if (origem === "devolucao") return "Devolução";
  return "Operação";
}
