"use client";

import { useSearchParams } from "next/navigation";
import { SaleRegistrationForm } from "@/modules/vendas/components/sale-registration-form";

export function NovaVendaPage() {
  const searchParams = useSearchParams();
  const canalParam = searchParams.get("canal");
  const canal =
    canalParam === "online" || canalParam === "whatsapp" ? "online" : "loja_fisica";

  return <SaleRegistrationForm defaultCanal={canal} />;
}
