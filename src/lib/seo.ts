import type { Metadata } from "next";

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rewrito.ai";
export const SITE_NAME = "rewrito";
export const SITE_TAGLINE = "Build human intelligence with AI intelligence";

export const CORE_KEYWORDS = [
  "AI humanizer",
  "free AI humanizer",
  "humanize AI text",
  "AI detector score",
  "AI detection checker",
  "AI writing detector",
  "LinkedIn post rewriter",
  "LinkedIn AI post generator",
  "professional email rewriter",
  "AI email rewriter",
  "AI study assistant",
  "quiz generator",
  "AI quiz maker",
  "flashcard generator",
  "AI flashcards",
  "study plan generator",
  "organize notes AI",
  "rewrite AI text",
  "AI writing assistant",
  "human intelligence with AI intelligence",
  "rewrito",
];

export const TOOL_KEYWORDS = {
  humanizer: [
    "AI humanizer",
    "free AI humanizer",
    "humanize AI text",
    "make AI text sound human",
    "rewrite AI generated text",
    "remove AI writing patterns",
    "AI text humanizer",
    "humanize ChatGPT text",
  ],
  detector: [
    "AI detector",
    "AI detection score",
    "AI writing confidence score",
    "GPTZero score checker",
    "Originality AI score",
    "Turnitin style AI detector",
    "AI humanizer detector",
    "check if text sounds AI generated",
  ],
  linkedin: [
    "LinkedIn post rewriter",
    "LinkedIn post generator",
    "rewrite LinkedIn post",
    "LinkedIn hook generator",
    "professional LinkedIn post writer",
    "LinkedIn content rewriter",
    "thought leadership post writer",
  ],
  email: [
    "professional email rewriter",
    "AI email rewriter",
    "rewrite email professionally",
    "polite email rewriter",
    "business email writer",
    "email tone improver",
    "work email rewriter",
  ],
  study: [
    "AI study assistant",
    "AI tutor",
    "explain concepts simply",
    "step by step study helper",
    "organize notes AI",
    "quiz generator",
    "flashcard generator",
    "study plan generator",
    "exam preparation AI",
  ],
} as const;

export function uniqueKeywords(...groups: ReadonlyArray<readonly string[]>): string[] {
  return [...new Set(groups.flat())];
}

export function absoluteUrl(path = "") {
  if (!path) return SITE_URL;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
}: {
  title: string;
  description: string;
  path: string;
  keywords?: readonly string[];
}): Metadata {
  const url = absoluteUrl(path);
  return {
    title,
    description,
    keywords: uniqueKeywords(CORE_KEYWORDS, keywords),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      title,
      description,
      url,
      siteName: SITE_NAME,
      images: [{ url: "/rewrito-logo.png", width: 1200, height: 320, alt: "rewrito" }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/rewrito-logo.png"],
    },
  };
}

export function softwareAppJsonLd({
  name,
  description,
  path,
  category = "WritingApplication",
  keywords = [],
}: {
  name: string;
  description: string;
  path: string;
  category?: "WritingApplication" | "EducationalApplication";
  keywords?: readonly string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory: category,
    operatingSystem: "Web",
    url: absoluteUrl(path),
    keywords: uniqueKeywords(keywords).join(", "),
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
