import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createEstoqueActions, type EstoqueStore } from "@/modules/estoque/store/actions";
import { createInitialEstoqueState } from "@/modules/estoque/store/initial-state";
import {
  estoquePersistStorage,
  type PersistedEstoqueStore,
} from "@/modules/estoque/store/storage";

export const useEstoqueStore = create<EstoqueStore>()(
  persist(
    (...args) => ({
      ...createInitialEstoqueState(),
      ...createEstoqueActions(...args),
    }),
    {
      name: "gestor-comercial:estoque-store",
      storage: estoquePersistStorage,
      partialize: (state): PersistedEstoqueStore => ({
        entities: state.entities,
        ui: state.ui,
      }),
    },
  ),
);
