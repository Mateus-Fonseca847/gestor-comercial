import EstoqueProdutoEditarPage from "@/components/estoque/EstoqueProdutoEditarPage";

export default async function EstoqueProdutoEditarRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EstoqueProdutoEditarPage id={id} />;
}
