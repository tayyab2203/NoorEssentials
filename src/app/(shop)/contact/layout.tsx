import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Send a message, find the store address, working hours, and social links.",
  openGraph: {
    title: "Contact",
    description: "Contact the store for enquiries, support, and feedback.",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
