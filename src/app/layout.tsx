import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rewrito.ai";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "rewrito",
  title: {
    default: "rewrito - AI-powered professional communication",
    template: "%s - rewrito",
  },
  description:
    "Humanize AI text, check AI detector confidence, rewrite LinkedIn posts, improve professional emails, and study concepts clearly with rewrito.",
  keywords: [
    "AI humanizer",
    "LinkedIn post rewriter",
    "AI detector",
    "AI detection score",
    "email rewriter",
    "AI study assistant",
    "flashcard generator",
    "quiz generator",
    "AI writing tool",
    "professional communication",
    "rewrito",
  ],
  authors: [{ name: "rewrito" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "rewrito - AI-powered professional communication",
    description:
      "Rough text in. Refined communication out. Humanize AI text, polish LinkedIn posts, rewrite emails, and study clearly.",
    siteName: "rewrito",
    locale: "en_US",
    images: [{ url: "/rewrito-logo.png", width: 1200, height: 320, alt: "rewrito" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "rewrito - AI-powered professional communication",
    description:
      "Humanize AI text, check AI detector confidence, rewrite LinkedIn posts, improve professional emails, and study concepts clearly.",
    images: ["/rewrito-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "rewrito",
      url: siteUrl,
      logo: `${siteUrl}/rewrito-logo.png`,
      contactPoint: {
        "@type": "ContactPoint",
        email: "hello@rewrito.ai",
        contactType: "customer support",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: "rewrito",
      url: siteUrl,
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: "rewrito",
      url: siteUrl,
      applicationCategory: "WritingApplication",
      operatingSystem: "Web",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-580NF5HJMD" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-580NF5HJMD');
`,
          }}
        />
      </head>
      <body className="min-h-screen bg-bg text-ink antialiased">
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
