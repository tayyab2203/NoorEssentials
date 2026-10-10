"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppSettings } from "@/lib/api/settings";

function normalizePhone(raw: string) {
  return raw.replace(/[^\d]/g, "");
}

export function WhatsAppButton({
  phone,
  message,
  className,
}: {
  phone?: string;
  message?: string;
  className?: string;
}) {
  const { data: settings } = useAppSettings();
  const effectivePhone = phone || settings?.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "923190409623";
  const num = normalizePhone(effectivePhone);
  if (!num) return null;
  const brandName = settings?.appName || "Noor Essentials";
  const text = message ?? `Hello! I need help with my order from ${brandName}.`;
  const href = `https://wa.me/${num}?text=${encodeURIComponent(text)}`;

  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className={cn(
        "fixed bottom-24 left-4 z-[9999] inline-flex h-12 items-center gap-2 rounded-full bg-[#25D366] px-4 text-sm font-semibold text-white shadow-lg transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-white/80 focus:ring-offset-2 focus:ring-offset-transparent md:bottom-6",
        className
      )}
    >
      <MessageCircle className="h-5 w-5" aria-hidden />
      <span className="hidden sm:inline">WhatsApp</span>
    </Link>
  );
}

