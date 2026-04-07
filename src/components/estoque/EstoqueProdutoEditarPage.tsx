import { EstoqueProdutoEditarPage as EstoqueProdutoEditarView } from "@/modules/estoque/views/estoque-produto-editar-page";

type EstoqueProdutoEditarPageProps = {
  id: string;
};

export default function EstoqueProdutoEditarPage({
  id,
}: EstoqueProdutoEditarPageProps) {
  return <EstoqueProdutoEditarView id={id} />;
}
