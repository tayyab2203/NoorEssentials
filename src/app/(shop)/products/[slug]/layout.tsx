import { Metadata } from "next";

type Props = { params: Promise<{ slug: string }>; children: React.ReactNode };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/products?slug=${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!res.ok) return { title: "Product" };
    const product = await res.json();
    if (!product?.name) return { title: "Product" };
    const description = product.description?.slice(0, 160) ?? `Shop ${product.name}.`;
    return {
      title: product.name,
      description,
      openGraph: {
        title: product.name,
        description: product.description?.slice(0, 160),
      },
    };
  } catch {
    return { title: "Product" };
  }
}

export default function ProductSlugLayout({ children }: Props) {
  return <>{children}</>;
}
