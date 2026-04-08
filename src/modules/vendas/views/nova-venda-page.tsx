"use client";

import { useSearchParams } from "next/navigation";
import { CommercialOrderForm } from "@/modules/vendas/components/commercial-order-form";

export function NovaVendaPage() {
  const searchParams = useSearchParams();
  const canalParam = searchParams.get("canal");
  const canal =
    canalParam === "online" || canalParam === "whatsapp" ? "online" : "loja_fisica";

  return <CommercialOrderForm defaultCanal={canal} />;
}
