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
  title: {
    default: "rewrito - AI-powered professional communication",
    template: "%s - rewrito",
  },
  description:
    "Humanize AI text, rewrite LinkedIn posts, and improve professional emails with rewrito. A simple AI writing toolkit built for clear communication.",
  keywords: [
    "AI humanizer",
    "LinkedIn post rewriter",
    "email rewriter",
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
      "Rough text in. Refined communication out. Humanize AI text, polish LinkedIn posts, and rewrite emails.",
    siteName: "rewrito",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "rewrito - AI-powered professional communication",
    description:
      "Humanize AI text, rewrite LinkedIn posts, and improve professional emails.",
  },
  robots: { index: true, follow: true },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="min-h-screen bg-bg text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
