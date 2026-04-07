"use client";

import Link from "next/link";

type GestifyHomeButtonProps = {
  href?: string;
  className?: string;
};

export default function GestifyHomeButton({
  href = "/",
  className = "",
}: GestifyHomeButtonProps) {
  return (
    <Link
      href={href}
      aria-label="Ir para a página inicial"
      className={[
        "inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors",
        "hover:bg-slate-50 hover:text-slate-900",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
        className,
      ].join(" ")}
    >
      Gestify
    </Link>
  );
}