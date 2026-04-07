import { EstoqueProdutoDetailPage as EstoqueProdutoDetailView } from "@/modules/estoque/views/estoque-produto-detail-page";

type EstoqueProdutoDetailPageProps = {
  id: string;
};

export default function EstoqueProdutoDetailPage({
  id,
}: EstoqueProdutoDetailPageProps) {
  return <EstoqueProdutoDetailView id={id} />;
}
