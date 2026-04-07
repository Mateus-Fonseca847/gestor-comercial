"use client";

import { Control, FieldErrors, useFieldArray, UseFormRegister } from "react-hook-form";
import { ProdutoCadastroFormValues } from "@/modules/estoque/types/estoque.types";

type Props = {
  control: Control<ProdutoCadastroFormValues>;
  register: UseFormRegister<ProdutoCadastroFormValues>;
  errors: FieldErrors<ProdutoCadastroFormValues>;
  depositOptions: string[];
};

export function ProdutoDepositsFieldArray({
  control,
  register,
  errors,
  depositOptions,
}: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "depositos",
  });

  return (
    <div className="space-y-4">
      {fields.map((field, index) => (
        <div
          key={field.id}
          className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] p-4"
        >
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-[var(--color-primary)]">
              Estoque {index + 1}
            </h3>
            {fields.length > 1 ? (
              <button
                type="button"
                onClick={() => remove(index)}
                className="text-xs font-medium text-[#b42318]"
              >
                Remover
              </button>
            ) : null}
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--color-text)]">Depósito</span>
              <select
                {...register(`depositos.${index}.deposito`)}
                className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-text)] outline-none"
              >
                <option value="">Selecione</option>
                {depositOptions.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--color-text)]">Quantidade</span>
              <input
                type="number"
                {...register(`depositos.${index}.quantidade`, { valueAsNumber: true })}
                className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-text)] outline-none"
              />
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-[var(--color-text)]">Localização</span>
              <input
                {...register(`depositos.${index}.localizacao`)}
                className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-text)] outline-none"
              />
            </label>
          </div>
          {errors.depositos?.[index] ? (
            <p className="mt-3 text-xs text-[#b42318]">Revise os campos deste estoque.</p>
          ) : null}
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ deposito: "", quantidade: 0, localizacao: "" })}
        className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white"
      >
        Adicionar estoque
      </button>
    </div>
  );
}
