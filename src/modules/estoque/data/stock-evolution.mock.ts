export type EstoquePeriodo = "hoje" | "ultima_semana" | "nesse_mes" | "nesse_ano";

export type EstoqueEvolucaoPonto = {
  label: string;
  estoqueAtual: number;
  estoqueMedio: number;
};

export const estoqueEvolucaoMock: Record<EstoquePeriodo, EstoqueEvolucaoPonto[]> = {
  hoje: [
    { label: "08h", estoqueAtual: 412, estoqueMedio: 428 },
    { label: "10h", estoqueAtual: 406, estoqueMedio: 426 },
    { label: "12h", estoqueAtual: 398, estoqueMedio: 423 },
    { label: "14h", estoqueAtual: 392, estoqueMedio: 420 },
    { label: "16h", estoqueAtual: 384, estoqueMedio: 418 },
    { label: "18h", estoqueAtual: 379, estoqueMedio: 416 },
  ],
  ultima_semana: [
    { label: "Seg", estoqueAtual: 430, estoqueMedio: 422 },
    { label: "Ter", estoqueAtual: 424, estoqueMedio: 421 },
    { label: "Qua", estoqueAtual: 418, estoqueMedio: 420 },
    { label: "Qui", estoqueAtual: 409, estoqueMedio: 418 },
    { label: "Sex", estoqueAtual: 401, estoqueMedio: 417 },
    { label: "Sáb", estoqueAtual: 388, estoqueMedio: 415 },
    { label: "Dom", estoqueAtual: 382, estoqueMedio: 414 },
  ],
  nesse_mes: [
    { label: "01", estoqueAtual: 448, estoqueMedio: 430 },
    { label: "05", estoqueAtual: 438, estoqueMedio: 428 },
    { label: "10", estoqueAtual: 429, estoqueMedio: 426 },
    { label: "15", estoqueAtual: 421, estoqueMedio: 424 },
    { label: "20", estoqueAtual: 414, estoqueMedio: 422 },
    { label: "25", estoqueAtual: 404, estoqueMedio: 420 },
    { label: "30", estoqueAtual: 396, estoqueMedio: 418 },
  ],
  nesse_ano: [
    { label: "Jan", estoqueAtual: 472, estoqueMedio: 452 },
    { label: "Fev", estoqueAtual: 461, estoqueMedio: 448 },
    { label: "Mar", estoqueAtual: 446, estoqueMedio: 442 },
    { label: "Abr", estoqueAtual: 431, estoqueMedio: 437 },
    { label: "Mai", estoqueAtual: 425, estoqueMedio: 434 },
    { label: "Jun", estoqueAtual: 419, estoqueMedio: 431 },
    { label: "Jul", estoqueAtual: 413, estoqueMedio: 428 },
    { label: "Ago", estoqueAtual: 407, estoqueMedio: 425 },
    { label: "Set", estoqueAtual: 401, estoqueMedio: 423 },
    { label: "Out", estoqueAtual: 395, estoqueMedio: 420 },
    { label: "Nov", estoqueAtual: 389, estoqueMedio: 418 },
    { label: "Dez", estoqueAtual: 382, estoqueMedio: 416 },
  ],
};
