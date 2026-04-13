import { notFound, redirect } from "next/navigation";
import { ModuleChildScreen } from "@/modules/shared/components/module-screens";
import { VendasSalesReportPage } from "@/modules/vendas/views/vendas-sales-report-page";

export default async function VendasChildPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "relatorios") {
    return <VendasSalesReportPage />;
  }

  if (slug === "pedidos") {
    redirect("/vendas/nova?canal=online");
  }

  if (slug !== "historico") {
    notFound();
  }

  return <ModuleChildScreen moduleKey="vendas" slug={slug} />;
}
