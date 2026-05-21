import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rewrito.ai";
  const now = new Date();
  const routes: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
    { path: "", priority: 1, changeFrequency: "weekly" },
    { path: "/try", priority: 0.95, changeFrequency: "weekly" },
    { path: "/tools", priority: 0.95, changeFrequency: "weekly" },
    { path: "/ai-humanizer", priority: 0.95, changeFrequency: "weekly" },
    { path: "/ai-detector", priority: 0.95, changeFrequency: "weekly" },
    { path: "/linkedin-rewriter", priority: 0.9, changeFrequency: "weekly" },
    { path: "/email-rewriter", priority: 0.9, changeFrequency: "weekly" },
    { path: "/study-assistant", priority: 0.95, changeFrequency: "weekly" },
    { path: "/study-assistant/quiz", priority: 0.88, changeFrequency: "weekly" },
    { path: "/study-assistant/flashcards", priority: 0.88, changeFrequency: "weekly" },
    { path: "/pricing", priority: 0.7, changeFrequency: "monthly" },
    { path: "/faq", priority: 0.65, changeFrequency: "monthly" },
    { path: "/privacy", priority: 0.4, changeFrequency: "yearly" },
    { path: "/terms", priority: 0.4, changeFrequency: "yearly" },
  ];
  return routes.map((route) => ({
    url: `${base}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
