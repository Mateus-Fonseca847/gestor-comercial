import { notFound } from "next/navigation";
import { ModuleChildScreen, ModuleReportsScreen } from "@/modules/shared/components/module-screens";

export default async function CadastrosChildPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (slug === "relatorios") {
    return <ModuleReportsScreen moduleKey="cadastros" />;
  }

  if (slug !== "clientes") {
    notFound();
  }

  return <ModuleChildScreen moduleKey="cadastros" slug={slug} />;
}
