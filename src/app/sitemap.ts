import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rewrito.ai";
  const now = new Date();
  const routes = [
    "",
    "/try",
    "/tools",
    "/ai-detector",
    "/faq",
    "/privacy",
    "/terms",
    "/ai-humanizer",
    "/linkedin-rewriter",
    "/email-rewriter",
    "/study-assistant",
    "/rewrito-study/quiz",
    "/rewrito-study/flashcards",
    "/pricing",
  ];
  return routes.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "" ? 1 : 0.8,
  }));
}
