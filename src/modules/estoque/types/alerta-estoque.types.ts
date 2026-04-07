import type { EntityId, ISODateString } from "@/modules/estoque/types/shared.types";

export type AlertaEstoqueTipo =
  | "estoque_baixo"
  | "estoque_zerado"
  | "excesso"
  | "sem_giro"
  | "validade_proxima"
  | "reserva_em_conflito";

export type AlertaEstoqueSeveridade = "info" | "warning" | "critical";

export type AlertaEstoqueStatus = "aberto" | "reconhecido" | "resolvido";

export type AlertaEstoque = {
  id: EntityId;
  tipo: AlertaEstoqueTipo;
  severidade: AlertaEstoqueSeveridade;
  status: AlertaEstoqueStatus;
  produtoId: EntityId;
  depositoId?: EntityId;
  geradoEm: ISODateString;
  titulo: string;
  mensagem: string;
  origemId?: EntityId;
};
