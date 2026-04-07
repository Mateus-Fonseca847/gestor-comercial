import { EstoqueLayout } from "@/modules/estoque/layout/estoque-layout";

export default function EstoqueRouteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <EstoqueLayout>{children}</EstoqueLayout>;
}
