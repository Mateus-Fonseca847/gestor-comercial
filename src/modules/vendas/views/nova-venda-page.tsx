"use client";

import { useSearchParams } from "next/navigation";
import { CommercialOrderForm } from "@/modules/vendas/components/commercial-order-form";

export function NovaVendaPage() {
  const searchParams = useSearchParams();
  const canal = searchParams.get("canal") === "whatsapp" ? "whatsapp" : "loja";

  return <CommercialOrderForm defaultCanal={canal} />;
}
