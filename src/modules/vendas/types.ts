export type VendaCanal = "loja_fisica" | "online";

export type VendaStatus =
  | "rascunho"
  | "em_aberto"
  | "aguardando_confirmacao"
  | "concluida"
  | "cancelada";

export type DescontoTipo = "valor_fixo" | "percentual";

export type FormaPagamento =
  | "dinheiro"
  | "pix"
  | "cartao"
  | "boleto"
  | "outro";

export type PagamentoStatus = "pendente" | "pago" | "parcialmente_pago";

export type VendaItem = {
  id: string;
  produtoId: string;
  nomeProduto: string;
  sku?: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
};

export type VendaPagamento = {
  formaPagamento?: FormaPagamento;
  statusPagamento?: PagamentoStatus;
  valorPago?: number;
  troco?: number;
};

export type VendaRegistro = {
  id: string;
  canal: VendaCanal;
  status: VendaStatus;
  clienteNome: string;
  clienteEmail?: string;
  telefone?: string;
  depositoId?: string;
  dataVenda?: string;
  horaVenda?: string;
  observacao?: string;
  subtotal: number;
  descontoTipo?: DescontoTipo;
  descontoValor?: number;
  acrescimoValor?: number;
  freteValor?: number;
  totalFinal?: number;
  pagamento?: VendaPagamento;
  itens: VendaItem[];
  criadoEm: string;
  atualizadoEm: string;
};

export type SalvarVendaInput = {
  canal: VendaCanal;
  status: VendaStatus;
  clienteNome: string;
  clienteEmail?: string;
  telefone?: string;
  depositoId?: string;
  dataVenda?: string;
  horaVenda?: string;
  observacao?: string;
  descontoTipo?: DescontoTipo;
  descontoValor?: number;
  acrescimoValor?: number;
  freteValor?: number;
  pagamento?: VendaPagamento;
  itens: Array<{
    produtoId: string;
    nomeProduto: string;
    sku?: string;
    quantidade: number;
    precoUnitario: number;
  }>;
};
