import { ModuleChildScreen, ModuleReportsScreen } from "@/modules/shared/components/module-screens";

export default async function UsuariosChildPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "relatorios") {
    return <ModuleReportsScreen moduleKey="usuarios" />;
  }

  return <ModuleChildScreen moduleKey="usuarios" slug={slug} />;
}
