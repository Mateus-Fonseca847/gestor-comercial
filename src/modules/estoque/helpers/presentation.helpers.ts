export type ProdutoEstoqueStatus = "saudavel" | "baixo" | "zerado" | "inativo";

export function formatDateBR(value: string, withTime = false) {
  return new Intl.DateTimeFormat(
    "pt-BR",
    withTime ? { dateStyle: "short", timeStyle: "short" } : { dateStyle: "short" },
  ).format(new Date(value));
}

export function formatMovimentacaoTipo(tipo: string) {
  if (tipo === "entrada") return "Entrada";
  if (tipo === "saida") return "Saída";
  if (tipo === "ajuste") return "Ajuste";
  if (tipo === "transferencia") return "Transferência";
  if (tipo === "reserva") return "Reserva";
  return "Liberação";
}

export function formatMovimentacaoStatus(status: string) {
  if (status === "confirmada") return "Confirmada";
  if (status === "pendente") return "Pendente";
  if (status === "cancelada") return "Cancelada";
  return "Rascunho";
}

export function formatMovimentacaoOrigemOperacional(origem?: string) {
  if (origem === "venda_loja") return "Venda na loja";
  if (origem === "pedido_whatsapp") return "Pedido WhatsApp";
  if (origem === "ajuste_interno") return "Ajuste interno";
  if (origem === "reposicao_estoque") return "Reposição de estoque";
  if (origem === "devolucao") return "Devolução";
  return "Não informada";
}

export function formatFornecedorStatus(status: string) {
  if (status === "ativo") return "Ativo";
  if (status === "em_analise") return "Em análise";
  if (status === "bloqueado") return "Bloqueado";
  return "Inativo";
}

export function getProdutoStatusLabel(status: ProdutoEstoqueStatus) {
  if (status === "saudavel") return "Saudável";
  if (status === "baixo") return "Baixo";
  if (status === "zerado") return "Zerado";
  return "Inativo";
}

export function getProdutoStatusVariant(status: ProdutoEstoqueStatus) {
  if (status === "saudavel") return "success" as const;
  if (status === "baixo") return "warning" as const;
  if (status === "inativo") return "info" as const;
  return "danger" as const;
}
