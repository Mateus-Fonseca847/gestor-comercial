"use client";

import { useMemo } from "react";
import { useEstoqueStore } from "@/modules/estoque/store/use-estoque-store";
import type { EntityCollectionState, EstoqueEntitiesState } from "@/modules/estoque/types";

type EntityListItem<K extends keyof EstoqueEntitiesState> =
  EstoqueEntitiesState[K] extends EntityCollectionState<infer T> ? T : never;

export function useEstoqueEntityList<K extends keyof EstoqueEntitiesState>(
  key: K,
): EntityListItem<K>[] {
  const ids = useEstoqueStore((state) => state.entities[key].allIds);
  const byId = useEstoqueStore((state) => state.entities[key].byId);

  return useMemo(
    () => ids.map((id) => byId[id]).filter(Boolean) as EntityListItem<K>[],
    [byId, ids],
  );
}
