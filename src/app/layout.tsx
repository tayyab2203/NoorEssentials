import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/shared/Providers";
import { StoreShell } from "@/components/layout/StoreShell";
import { BrandSync } from "@/components/layout/BrandSync";
import { siteMetadata, baseUrl } from "@/lib/metadata";
import { getAppSettings } from "@/lib/settings-server";

export const dynamic = "force-dynamic";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getAppSettings();
  return siteMetadata(undefined, settings);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getAppSettings();
  const logoUrl = settings.logoUrl.startsWith("http")
    ? settings.logoUrl
    : `${baseUrl}${settings.logoUrl}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: settings.appName,
        url: baseUrl,
        description: settings.appDescription,
        logo: { "@type": "ImageObject", url: logoUrl },
      },
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: settings.appName,
        description: settings.appDescription,
        publisher: { "@id": `${baseUrl}/#organization` },
        inLanguage: "en-US",
      },
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${playfairDisplay.variable} ${poppins.variable} font-body`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Providers>
          <BrandSync />
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <div className="flex min-h-screen flex-col bg-cream">
            <StoreShell>{children}</StoreShell>
          </div>
        </Providers>
      </body>
    </html>
  );
}
