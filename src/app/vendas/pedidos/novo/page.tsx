import { redirect } from "next/navigation";

export default function NovoPedidoWhatsappRoute() {
  redirect("/vendas/nova?canal=online");
}
