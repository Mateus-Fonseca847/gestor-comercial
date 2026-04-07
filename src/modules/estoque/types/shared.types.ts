export type EntityId = string;

export type ISODateString = string;

export type CurrencyCode = "BRL" | "USD" | "EUR";

export type UnidadeMedida =
  | "UN"
  | "CX"
  | "PC"
  | "KG"
  | "G"
  | "L"
  | "ML"
  | "M"
  | "CM"
  | "KIT";

export type TipoPessoa = "fisica" | "juridica";

export type AuditInfo = {
  criadoEm: ISODateString;
  atualizadoEm: ISODateString;
  criadoPor?: EntityId;
  atualizadoPor?: EntityId;
};

export type Endereco = {
  logradouro: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade: string;
  estado: string;
  cep?: string;
  pais: string;
};

export type Contato = {
  nome?: string;
  email?: string;
  telefone?: string;
  cargo?: string;
};

export type DocumentoFiscal = {
  numero?: string;
  serie?: string;
  chaveAcesso?: string;
};

export type Money = {
  valor: number;
  moeda: CurrencyCode;
};

export type EntityMap<T> = Record<EntityId, T>;
