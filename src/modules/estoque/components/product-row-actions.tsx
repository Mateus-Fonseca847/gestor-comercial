"use client";

import { useState } from "react";
import Link from "next/link";
import { FeedbackBanner } from "@/modules/estoque/components/feedback-banner";
import { useFeedback } from "@/modules/estoque/components/use-feedback";
import { useEstoqueStore } from "@/modules/estoque/store";

export function ProductRowActions({ id }: { id: string }) {
  const duplicarProduto = useEstoqueStore((state) => state.actions.duplicarProduto);
  const desativarProduto = useEstoqueStore((state) => state.actions.desativarProduto);
  const [duplicatedId, setDuplicatedId] = useState<string | null>(null);
  const [deactivatedId, setDeactivatedId] = useState<string | null>(null);
  const { feedback, showFeedback, clearFeedback } = useFeedback(2200);

  function handleDuplicate() {
    const newId = duplicarProduto(id);

    if (newId) {
      setDuplicatedId(newId);
      showFeedback({
        tone: "success",
        title: "Produto duplicado",
        description: "A cópia foi criada e já está disponível na listagem.",
      });
      window.setTimeout(() => setDuplicatedId(null), 2000);
      return;
    }

    showFeedback({
      tone: "error",
      title: "Não foi possível duplicar",
      description: "Revise os dados do produto e tente novamente.",
    });
  }

  function handleDeactivate() {
    if (!window.confirm("Deseja desativar este produto?")) {
      return;
    }

    desativarProduto(id);
    setDeactivatedId(id);
    showFeedback({
      tone: "warning",
      title: "Produto desativado",
      description: "O item continua na listagem e pode ser reativado depois.",
    });
    window.setTimeout(() => setDeactivatedId(null), 2000);
  }

  return (
    <div className="space-y-2">
      <FeedbackBanner feedback={feedback} onDismiss={clearFeedback} />
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Link
          href={`/estoque/produtos/${id}`}
          className="rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-medium text-[var(--color-primary)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-surface-alt)]"
        >
          Visualizar
        </Link>
        <Link
          href={`/estoque/produtos/${id}/editar`}
          className="rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-medium text-[var(--color-primary)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-surface-alt)]"
        >
          Editar
        </Link>
        <button
          type="button"
          onClick={handleDuplicate}
          className="rounded-xl border border-[var(--color-border)] bg-white px-3 py-2 text-xs font-medium text-[var(--color-primary)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-surface-alt)]"
        >
          {duplicatedId ? "Duplicado" : "Duplicar"}
        </button>
        <button
          type="button"
          onClick={handleDeactivate}
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 transition-all duration-200 hover:-translate-y-0.5"
        >
          {deactivatedId ? "Desativado" : "Desativar"}
        </button>
      </div>
    </div>
  );
}
