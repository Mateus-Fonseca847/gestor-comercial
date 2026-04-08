"use client";

import Link from "next/link";
import GestifyMark from "@/components/layout/gestify-mark";

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
      title="Ir para a Home"
      aria-label="Ir para a página inicial"
      className={[
        "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-slate-700 transition-all",
        "hover:-translate-y-0.5 hover:bg-slate-50 hover:text-slate-900 hover:shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40",
        className,
      ].join(" ")}
    >
      <GestifyMark className="h-6 w-6" />
      <span>Gestify</span>
    </Link>
  );
}
