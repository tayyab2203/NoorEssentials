"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Container } from "@/components/layout/Container";

/** Home and About manage their own full-bleed sections. */
const FULL_BLEED_PATHS = new Set(["/", "/about"]);

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  if (FULL_BLEED_PATHS.has(pathname)) {
    return <>{children}</>;
  }

  return (
    <>
      <Breadcrumb />
      <Container className="py-8">{children}</Container>
    </>
  );
}
