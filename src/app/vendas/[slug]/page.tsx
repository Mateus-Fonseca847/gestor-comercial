import { notFound, redirect } from "next/navigation";
import { ModuleChildScreen, ModuleReportsScreen } from "@/modules/shared/components/module-screens";

export default async function VendasChildPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "relatorios") {
    return <ModuleReportsScreen moduleKey="vendas" />;
  }

  if (slug === "pedidos") {
    redirect("/vendas/nova?canal=online");
  }

  if (slug !== "historico") {
    notFound();
  }

  return <ModuleChildScreen moduleKey="vendas" slug={slug} />;
}
