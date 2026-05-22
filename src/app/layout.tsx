import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CORE_KEYWORDS, SITE_TAGLINE, SITE_URL } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const siteUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "rewrito",
  title: {
    default: "rewrito - AI Humanizer, Grammar Checker, Detector, Plagiarism Checker, and Study Assistant",
    template: "%s - rewrito",
  },
  description:
    "Build human intelligence with AI intelligence. Humanize AI text, check AI detector confidence, fix grammar, review plagiarism risk, rewrite LinkedIn posts and emails, and study concepts clearly with rewrito.",
  keywords: CORE_KEYWORDS,
  authors: [{ name: "rewrito" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "rewrito - AI Humanizer, Grammar Checker, Detector, Plagiarism Checker, and Study Assistant",
    description:
      "Human intelligence with AI intelligence. Humanize AI text, check originality risk, fix grammar, polish LinkedIn posts, rewrite emails, study clearly, and learn better patterns as you work.",
    siteName: "rewrito",
    locale: "en_US",
    images: [{ url: "/rewrito-logo.png", width: 1200, height: 320, alt: "rewrito" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "rewrito - AI Humanizer, Grammar Checker, Detector, Plagiarism Checker, and Study Assistant",
    description:
      "Humanize AI text, check detector confidence, fix grammar, review plagiarism risk, rewrite professional communication, study clearly, and learn better patterns as you work.",
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
      slogan: SITE_TAGLINE,
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
      description:
        "AI writing and study toolkit for humanizing AI text, checking AI detector confidence, fixing grammar, reviewing plagiarism risk, rewriting professional communication, and learning clearly.",
      publisher: { "@id": `${siteUrl}/#organization` },
    },
    {
      "@type": "SoftwareApplication",
      name: "rewrito",
      url: siteUrl,
      applicationCategory: "WritingApplication",
      operatingSystem: "Web",
      slogan: SITE_TAGLINE,
      keywords: CORE_KEYWORDS.join(", "),
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
    <html lang="en" className={inter.variable}>
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
