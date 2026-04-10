export type ClientePerfilMock = {
  id: string;
  nome: string;
  telefone?: string;
  email?: string;
  cadastroEm: string;
  status: "ativo" | "em_acompanhamento" | "novo";
  canalPreferencial?: "loja_fisica" | "online";
  observacao?: string;
};

export const clientesPerfisMock: ClientePerfilMock[] = [
  {
    id: "cli-1",
    nome: "Carla Menezes",
    telefone: "(11) 99999-4010",
    email: "carla@lojista.com",
    cadastroEm: "2026-01-15T10:00:00-03:00",
    status: "ativo",
    canalPreferencial: "loja_fisica",
    observacao: "Cliente recorrente de presentes e acessórios.",
  },
  {
    id: "cli-2",
    nome: "José Nunes",
    telefone: "(11) 98888-1241",
    email: "jose@nunes.com",
    cadastroEm: "2026-02-02T14:30:00-03:00",
    status: "em_acompanhamento",
    canalPreferencial: "online",
    observacao: "Costuma fechar pedido pelo WhatsApp.",
  },
  {
    id: "cli-3",
    nome: "Marina Alves",
    telefone: "(11) 97777-1503",
    email: "marina@alves.com",
    cadastroEm: "2026-01-28T16:10:00-03:00",
    status: "ativo",
    canalPreferencial: "loja_fisica",
  },
  {
    id: "cli-4",
    nome: "Pedro Rocha",
    telefone: "(11) 98888-1241",
    cadastroEm: "2026-03-10T09:10:00-03:00",
    status: "ativo",
    canalPreferencial: "online",
  },
  {
    id: "cli-5",
    nome: "Lucia Santos",
    telefone: "(11) 96666-1702",
    cadastroEm: "2026-02-18T11:40:00-03:00",
    status: "ativo",
    canalPreferencial: "loja_fisica",
  },
  {
    id: "cli-6",
    nome: "Ana Costa",
    telefone: "(11) 97777-1503",
    cadastroEm: "2026-03-22T13:20:00-03:00",
    status: "em_acompanhamento",
    canalPreferencial: "online",
  },
  {
    id: "cli-7",
    nome: "Rafael Duarte",
    cadastroEm: "2026-01-05T12:00:00-03:00",
    status: "ativo",
    canalPreferencial: "loja_fisica",
  },
  {
    id: "cli-8",
    nome: "Paula Ferreira",
    telefone: "(11) 96666-1702",
    cadastroEm: "2026-03-01T15:00:00-03:00",
    status: "ativo",
    canalPreferencial: "online",
  },
  {
    id: "cli-9",
    nome: "Beatriz Rocha",
    telefone: "(11) 95555-8899",
    email: "bia@contato.com",
    cadastroEm: "2026-04-02T10:45:00-03:00",
    status: "novo",
    canalPreferencial: "online",
    observacao: "Cadastro recente, ainda sem compras.",
  },
];
