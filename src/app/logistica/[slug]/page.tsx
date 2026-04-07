import { ModuleChildScreen, ModuleReportsScreen } from "@/modules/shared/components/module-screens";

export default async function LogisticaChildPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "relatorios") {
    return <ModuleReportsScreen moduleKey="logistica" />;
  }

  return <ModuleChildScreen moduleKey="logistica" slug={slug} />;
}
