import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Who We Are",
  description:
    "Discover the story and mission behind the store. Everyday essentials chosen with care.",
  openGraph: {
    title: "Who We Are",
    description: "Our story, mission, and commitment to quality.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
