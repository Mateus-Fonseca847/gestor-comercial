export type HomeSale = {
  id: string;
  cliente: string;
  canal: "Loja Física" | "Online";
  valor: number;
  hora: string;
};

export type HomeClient = {
  id: string;
  nome: string;
  origem: "Loja Física" | "Online";
  ultimaInteracao: string;
};

export type HomeSalesSummary = {
  faturamentoDia: number;
  vendasDia: number;
  ticketMedio: number;
};

export type HomeChannelSummary = {
  canal: "Loja Física" | "Online";
  quantidadePedidos: number;
  valorTotal: number;
};
