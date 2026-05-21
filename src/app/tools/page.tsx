import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { absoluteUrl, pageMetadata, TOOL_KEYWORDS, uniqueKeywords } from "@/lib/seo";
import {
  ArrowRightIcon,
  LinkedinIcon,
  MailIcon,
  ShieldCheckIcon,
  SparkleIcon,
  StudyIcon,
} from "@/components/ui/icons";

export const metadata: Metadata = pageMetadata({
  title: "AI Writing Tools - Humanizer, Detector, Rewriters, Study Assistant",
  description:
    "Explore rewrito's AI Humanizer, AI Detector Score, LinkedIn Post Rewriter, Professional Email Rewriter, and AI Study Assistant in one toolkit.",
  path: "/tools",
  keywords: uniqueKeywords(
    TOOL_KEYWORDS.humanizer,
    TOOL_KEYWORDS.detector,
    TOOL_KEYWORDS.linkedin,
    TOOL_KEYWORDS.email,
    TOOL_KEYWORDS.study
  ),
});

const tools = [
  {
    icon: SparkleIcon,
    name: "AI Humanizer",
    href: "/ai-humanizer",
    description:
      "Rewrite AI-generated text so it sounds natural, specific, and human while preserving the original meaning.",
    points: ["Removes robotic phrasing", "Improves rhythm and flow", "Keeps facts intact"],
  },
  {
    icon: LinkedinIcon,
    name: "LinkedIn Post Rewriter",
    href: "/linkedin-rewriter",
    description:
      "Turn rough notes into a clean LinkedIn post with a grounded hook, short paragraphs, and a real voice.",
    points: ["Shapes rough drafts", "Avoids fake hype", "Improves post structure"],
  },
  {
    icon: MailIcon,
    name: "Professional Email Rewriter",
    href: "/email-rewriter",
    description:
      "Rewrite messy drafts into concise, polite, confident emails that keep your intent and details.",
    points: ["Tightens wording", "Balances tone", "Keeps names, dates, and numbers"],
  },
  {
    icon: ShieldCheckIcon,
    name: "AI Detector Score",
    href: "/ai-detector",
    description:
      "Check detector-style AI confidence, compare before and after scores, and learn which writing patterns to improve.",
    points: ["Shows before and after scores", "Humanizes high-risk drafts", "Teaches better writing habits"],
  },
  {
    icon: StudyIcon,
    name: "Rewrito Study",
    href: "/study-assistant",
    description:
      "Turn confusing study material into clear explanations, step-by-step breakdowns, quizzes, flashcards, notes, and study plans.",
    points: ["Explains concepts clearly", "Creates quizzes and flashcards", "Organizes study plans"],
  },
];

export default function ToolsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "rewrito AI Writing Tools",
    description:
      "AI tools for humanizing AI text, checking AI detector confidence, rewriting LinkedIn posts, improving professional emails, and learning concepts clearly.",
    mainEntity: tools.map((tool) => ({
      "@type": "SoftwareApplication",
      name: tool.name,
      applicationCategory: tool.href === "/study-assistant" ? "EducationalApplication" : "WritingApplication",
      url: absoluteUrl(tool.href),
    })),
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="bg-bg">
          <div className="mx-auto max-w-6xl px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
            <span className="chip mb-5">AI writing toolkit</span>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Tools for writing, studying, and checking AI confidence.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              Choose a focused workspace for AI-generated copy, detector-style checks,
              LinkedIn posts, email drafts, or study material. Each tool improves clarity while keeping the purpose intact.
            </p>
          </div>
        </section>

        <section className="bg-bg-section/60">
          <div className="mx-auto grid max-w-6xl gap-5 px-5 py-14 sm:grid-cols-2 sm:px-8 sm:py-20 lg:grid-cols-3 xl:grid-cols-5">
            {tools.map((tool) => (
              <article key={tool.name} className="card flex h-full flex-col p-6">
                <span className="mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-softPurple text-brand">
                  <tool.icon size={22} />
                </span>
                <h2 className="text-lg font-semibold text-ink">{tool.name}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{tool.description}</p>
                <ul className="mt-5 space-y-2 text-sm text-ink">
                  {tool.points.map((point) => (
                    <li key={point} className="flex items-start gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <Link href={tool.href} className="btn-secondary mt-6 w-full">
                  Open tool <ArrowRightIcon size={16} />
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="bg-bg">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <div className="mb-10 max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight text-ink">
                Try the toolkit
              </h2>
              <p className="mt-3 text-base text-ink-muted">
                Paste a draft or study material, choose the right settings, and compare the result.
              </p>
            </div>
            <ToolWorkspace />
          </div>
        </section>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
