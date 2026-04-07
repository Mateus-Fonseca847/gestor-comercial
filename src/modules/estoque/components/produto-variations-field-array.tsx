"use client";

import { Control, FieldErrors, useFieldArray, UseFormRegister } from "react-hook-form";
import { ProdutoCadastroFormValues } from "@/modules/estoque/types/estoque.types";

type Props = {
  control: Control<ProdutoCadastroFormValues>;
  register: UseFormRegister<ProdutoCadastroFormValues>;
  errors: FieldErrors<ProdutoCadastroFormValues>;
};

export function ProdutoVariationsFieldArray({
  control,
  register,
  errors,
}: Props) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "variacoes",
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
              Variação {index + 1}
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
            <Field label="Tamanho" register={register(`variacoes.${index}.tamanho`)} error={errors.variacoes?.[index]?.tamanho?.message} />
            <Field label="Cor" register={register(`variacoes.${index}.cor`)} error={errors.variacoes?.[index]?.cor?.message} />
            <Field label="Modelo" register={register(`variacoes.${index}.modelo`)} error={errors.variacoes?.[index]?.modelo?.message} />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={() => append({ tamanho: "", cor: "", modelo: "" })}
        className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-medium text-white"
      >
        Adicionar variação
      </button>
    </div>
  );
}

function Field({
  label,
  register,
  error,
}: {
  label: string;
  register: ReturnType<UseFormRegister<ProdutoCadastroFormValues>>;
  error?: string;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
      <input
        {...register}
        className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-white px-4 text-sm text-[var(--color-text)] outline-none"
      />
      {error ? <p className="text-xs text-[#b42318]">{error}</p> : null}
    </label>
  );
}
