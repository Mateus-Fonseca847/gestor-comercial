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

  return <ModuleChildScreen moduleKey="vendas" slug={slug} />;
}
