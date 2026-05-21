import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use - rewrito AI Writing and Study Tools",
  description:
    "Terms of Use for rewrito's AI Humanizer, AI Detector Score, LinkedIn Rewriter, Email Rewriter, and Rewrito Study tools.",
  path: "/terms",
  keywords: ["rewrito terms", "AI writing tool terms", "AI study assistant terms"],
});

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg">
        <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
          <span className="chip mb-5">Terms</span>
          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Terms of Use
          </h1>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-muted">
            <p>
              By using rewrito, you agree to use the service responsibly and review generated
              output before sending, publishing, or relying on it.
            </p>
            <section>
              <h2 className="mb-2 text-lg font-semibold text-ink">AI output</h2>
              <p>
                rewrito can improve clarity and tone, but AI output may still contain mistakes.
                You are responsible for checking facts, names, numbers, and final wording.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-semibold text-ink">Acceptable use</h2>
              <p>
                Do not use rewrito to create harmful, deceptive, illegal, or abusive content.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-semibold text-ink">Contact</h2>
              <p>
                For questions about these terms, email <a className="text-brand hover:underline" href="mailto:hello@rewrito.ai">hello@rewrito.ai</a>.
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
