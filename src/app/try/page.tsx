import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";
import { pageMetadata, TOOL_KEYWORDS, uniqueKeywords } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Try rewrito Free - AI Humanizer, Detector, Plagiarism, Study",
  description:
    "Try rewrito free. Humanize AI text, check AI detector confidence, review plagiarism risk, rewrite LinkedIn posts and emails, and study concepts clearly in one workspace.",
  path: "/try",
  keywords: uniqueKeywords(
    TOOL_KEYWORDS.humanizer,
    TOOL_KEYWORDS.detector,
    TOOL_KEYWORDS.plagiarism,
    TOOL_KEYWORDS.linkedin,
    TOOL_KEYWORDS.email,
    TOOL_KEYWORDS.study
  ),
});

export default function TryPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-bg">
          <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 sm:py-10">
            <ToolWorkspace />
          </div>
        </section>

        <section className="bg-bg">
          <div className="mx-auto max-w-6xl px-5 pb-10 pt-4 sm:px-8 sm:pb-14 sm:pt-8">
            <span className="chip mb-5">Try free</span>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Rewrite rough text into clear professional communication.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              Use the workspace to humanize AI text, polish a LinkedIn draft, tighten a
              professional email, or understand study material clearly.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
