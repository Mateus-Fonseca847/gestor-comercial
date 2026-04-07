export type EstoqueNavItem = {
  label: string;
  href: string;
};

export type EstoqueMetric = {
  label: string;
  value: string;
  note: string;
};

export type EstoqueAlert = {
  id: string;
  title: string;
  description: string;
  severity: "warning" | "danger" | "info";
  href: string;
};

export type DepositoResumo = {
  id: string;
  nome: string;
  ocupacao: string;
  itens: string;
  status: string;
};

export type ReposicaoIndicador = {
  id: string;
  titulo: string;
  valor: string;
  detalhe: string;
  status: "info" | "success" | "warning";
};

export type EstoqueGenericRecord = {
  id: string;
  primary: string;
  secondary: string;
  tertiary: string;
  status: string;
};

export type EstoqueSectionConfig = {
  slug: string;
  title: string;
  description: string;
  actionLabel: string;
  filters: string[];
  metrics: EstoqueMetric[];
  records: EstoqueGenericRecord[];
};
