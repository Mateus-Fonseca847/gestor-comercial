import EstoqueProdutoDetailPage from "@/components/estoque/EstoqueProdutoDetailPage";

export default async function EstoqueProdutoDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <EstoqueProdutoDetailPage id={id} />;
}
