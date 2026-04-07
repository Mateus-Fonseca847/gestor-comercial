import { createJSONStorage, type StateStorage } from "zustand/middleware";
import type { EstoqueStore } from "@/modules/estoque/store/actions";

const noopStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export type PersistedEstoqueStore = Pick<EstoqueStore, "entities" | "ui">;

export const estoquePersistStorage = createJSONStorage<PersistedEstoqueStore>(() =>
  typeof window === "undefined" ? noopStorage : localStorage,
);
