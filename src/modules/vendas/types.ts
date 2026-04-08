export type VendaCanal = "loja_fisica" | "online";

export type VendaStatus =
  | "em_aberto"
  | "aguardando_confirmacao"
  | "concluida"
  | "cancelada";

export type VendaItem = {
  id: string;
  produtoId: string;
  nomeProduto: string;
  quantidade: number;
  precoUnitario: number;
  subtotal: number;
};

export type VendaRegistro = {
  id: string;
  canal: VendaCanal;
  status: VendaStatus;
  clienteNome: string;
  telefone?: string;
  depositoId?: string;
  observacao?: string;
  subtotal: number;
  itens: VendaItem[];
  criadoEm: string;
  atualizadoEm: string;
};

export type SalvarVendaInput = {
  canal: VendaCanal;
  status: VendaStatus;
  clienteNome: string;
  telefone?: string;
  depositoId?: string;
  observacao?: string;
  itens: Array<{
    produtoId: string;
    nomeProduto: string;
    quantidade: number;
    precoUnitario: number;
  }>;
};
