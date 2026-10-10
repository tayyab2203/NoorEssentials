import type { Metadata } from "next";
import { SITE_NAME, SITE_DESCRIPTION, LOGO_PATH } from "./constants";

export const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://noor-g.com";

export function siteMetadata(
  overrides?: Partial<Metadata>,
  branding?: { appName?: string; appDescription?: string; logoUrl?: string }
): Metadata {
  const name = branding?.appName?.trim() || SITE_NAME;
  const description = branding?.appDescription?.trim() || SITE_DESCRIPTION;
  const logo = branding?.logoUrl?.trim() || LOGO_PATH;

  return {
    metadataBase: new URL(baseUrl),
    icons: {
      icon: logo,
      shortcut: logo,
      apple: logo,
    },
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description,
    keywords: ["Noor Essentials", "premium clothing", "Pakistani fashion", "perfumes", "accessories", "shoes"],
    openGraph: {
      type: "website",
      locale: "en_US",
      url: baseUrl,
      siteName: name,
      title: name,
      description,
      images: logo ? [{ url: logo }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: name,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
    ...overrides,
  };
}

export function pageMetadata(
  title: string,
  description: string,
  path = ""
): Metadata {
  const url = path ? `${baseUrl}${path}` : baseUrl;
  return {
    title,
    description,
    alternates: path ? { canonical: url } : undefined,
    openGraph: {
      title,
      description,
      url,
    },
    twitter: {
      title,
      description,
    },
  };
}
