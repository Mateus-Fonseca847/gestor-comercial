"use client";

import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";
import { ProdutoCadastroFormValues } from "@/modules/estoque/types/estoque.types";

type BaseProps = {
  register: UseFormRegister<ProdutoCadastroFormValues>;
  errors: FieldErrors<ProdutoCadastroFormValues>;
};

type ControlledProps = BaseProps & {
  control: Control<ProdutoCadastroFormValues>;
};

export function TextField({
  label,
  name,
  register,
  errors,
  textarea = false,
  type = "text",
}: BaseProps & {
  label: string;
  name: Path<ProdutoCadastroFormValues>;
  textarea?: boolean;
  type?: string;
}) {
  const error = getNestedError(errors, name);
  const className =
    "w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none";

  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
      {textarea ? (
        <textarea {...register(name)} rows={4} className={`${className} py-3`} />
      ) : (
        <input {...register(name, type === "number" ? { valueAsNumber: true } : undefined)} type={type} className={`${className} h-11`} />
      )}
      {error ? (
        <p className="text-xs text-[#b42318]">{String(error.message)}</p>
      ) : null}
    </label>
  );
}

export function SelectField({
  label,
  name,
  register,
  errors,
  options,
}: BaseProps & {
  label: string;
  name: Path<ProdutoCadastroFormValues>;
  options: string[];
}) {
  const error = getNestedError(errors, name);

  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
      <select
        {...register(name)}
        className="h-11 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 text-sm text-[var(--color-text)] outline-none"
      >
        <option value="">Selecione</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error ? <p className="text-xs text-[#b42318]">{String(error.message)}</p> : null}
    </label>
  );
}

function getNestedError(
  errors: FieldErrors<ProdutoCadastroFormValues>,
  path: string,
) {
  return path
    .split(".")
    .reduce<FieldValues | undefined>(
      (acc, key) => (acc ? acc[key] : undefined),
      errors as FieldValues,
    ) as { message?: string } | undefined;
}

export function SwitchField({
  label,
  name,
  control,
}: ControlledProps & {
  label: string;
  name:
    | "ativo"
    | "controlaLote"
    | "controlaValidade"
    | "ehKit";
}) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <label className="flex items-center justify-between rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-alt)] px-4 py-3">
          <span className="text-sm font-medium text-[var(--color-text)]">{label}</span>
          <button
            type="button"
            onClick={() => field.onChange(!field.value)}
            className={[
              "flex h-7 w-12 items-center rounded-full p-1 transition-colors",
              field.value ? "bg-[var(--color-primary)]" : "bg-[#c9d8ef]",
            ].join(" ")}
          >
            <span
              className={[
                "h-5 w-5 rounded-full bg-white transition-transform",
                field.value ? "translate-x-5" : "translate-x-0",
              ].join(" ")}
            />
          </button>
        </label>
      )}
    />
  );
}
