export type VendaCanal = "loja" | "whatsapp";

export type VendaStatus = "rascunho" | "pendente" | "concluida";

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

