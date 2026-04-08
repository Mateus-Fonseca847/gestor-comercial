import type { HomeClient, HomeSale } from "@/modules/shared/home/home.types";

export const homeSalesMock: HomeSale[] = [
  { id: "sale-1", cliente: "Carla M.", canal: "Loja Física", valor: 289.9, hora: "09:14" },
  { id: "sale-2", cliente: "Jose N.", canal: "Online", valor: 154.5, hora: "10:27" },
  { id: "sale-3", cliente: "Marina A.", canal: "Loja Física", valor: 420, hora: "11:05" },
  { id: "sale-4", cliente: "Pedro R.", canal: "Online", valor: 199.9, hora: "12:41" },
  { id: "sale-5", cliente: "Lucia S.", canal: "Loja Física", valor: 318, hora: "14:12" },
  { id: "sale-6", cliente: "Ana C.", canal: "Online", valor: 87.4, hora: "15:03" },
  { id: "sale-7", cliente: "Rafael D.", canal: "Loja Física", valor: 530, hora: "16:19" },
  { id: "sale-8", cliente: "Paula F.", canal: "Online", valor: 246.9, hora: "17:02" },
];

export const homeRecentClientsMock: HomeClient[] = [
  { id: "cli-1", nome: "Carla M.", origem: "Loja Física", ultimaInteracao: "Hoje 09:14" },
  { id: "cli-2", nome: "Jose N.", origem: "Online", ultimaInteracao: "Hoje 10:27" },
  { id: "cli-3", nome: "Marina A.", origem: "Loja Física", ultimaInteracao: "Hoje 11:05" },
  { id: "cli-4", nome: "Pedro R.", origem: "Online", ultimaInteracao: "Hoje 12:41" },
  { id: "cli-5", nome: "Lucia S.", origem: "Loja Física", ultimaInteracao: "Hoje 14:12" },
  { id: "cli-6", nome: "Ana C.", origem: "Online", ultimaInteracao: "Hoje 15:03" },
];
