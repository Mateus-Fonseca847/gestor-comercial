import { createJSONStorage, type StateStorage } from "zustand/middleware";
import type { VendaRegistro } from "@/modules/vendas/types";

export type PersistedVendasStore = {
  vendas: VendaRegistro[];
};

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const vendasPersistStorage = createJSONStorage<PersistedVendasStore>(() =>
  typeof window === "undefined" ? noopStorage : localStorage,
);

