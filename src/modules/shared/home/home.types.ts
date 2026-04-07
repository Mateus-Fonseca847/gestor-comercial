export type HomeSale = {
  id: string;
  cliente: string;
  canal: "Loja" | "WhatsApp";
  valor: number;
  hora: string;
};

export type HomeClient = {
  id: string;
  nome: string;
  origem: "Loja" | "WhatsApp";
  ultimaInteracao: string;
};

export type HomeSalesSummary = {
  faturamentoDia: number;
  vendasDia: number;
  ticketMedio: number;
};

export type HomeChannelSummary = {
  canal: "Loja" | "WhatsApp";
  quantidadePedidos: number;
  valorTotal: number;
};
