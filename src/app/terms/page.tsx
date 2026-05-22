import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Terms of Use - rewrito AI Writing and Study Tools",
  description:
    "Terms of Use for rewrito's AI Humanizer, AI Detector Score, Grammar Checker, Plagiarism Checker, LinkedIn Rewriter, Email Rewriter, and Rewrito Study tools.",
  path: "/terms",
  keywords: ["rewrito terms", "AI writing tool terms", "AI study assistant terms", "plagiarism checker terms"],
});

const lastUpdated = "May 22, 2026";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg">
        <section className="relative overflow-hidden bg-bg">
          <div aria-hidden className="hero-abstract opacity-70">
            <div className="grid-overlay" />
            <div className="blob-mid" />
          </div>
          <div className="mx-auto max-w-5xl px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
            <span className="chip mb-5">Terms</span>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Terms of Use
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-muted sm:text-lg">
              These terms explain how you may use rewrito, what our AI tools do, and what you are responsible for when using generated output.
            </p>
            <p className="mt-4 text-sm font-medium text-ink-muted">Last updated: {lastUpdated}</p>
          </div>
        </section>

        <section className="bg-bg">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 sm:px-8 sm:pb-24 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="card p-5">
                <h2 className="text-sm font-semibold text-ink">Plain-English summary</h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
                  <li>Use rewrito responsibly and review output before relying on it.</li>
                  <li>AI output can be wrong, incomplete, or unsuitable for your situation.</li>
                  <li>Detector, originality, and plagiarism scores are review aids, not official reports.</li>
                  <li>You keep responsibility for what you submit, publish, or turn in.</li>
                </ul>
              </div>
            </aside>

            <div className="space-y-5">
              <TermsSection title="1. Agreement to these terms">
                <p>
                  By accessing or using rewrito, you agree to these Terms of Use and our{" "}
                  <Link href="/privacy" prefetch={false} className="text-brand hover:underline">
                    Privacy Policy
                  </Link>
                  . If you do not agree, do not use the service.
                </p>
                <p>
                  These terms apply to all rewrito tools, including AI Humanizer, AI Detector Score, Grammar Checker, Plagiarism Checker, LinkedIn Post Rewriter, Professional Email Rewriter, Rewrito Study, quiz testlets, flashcards, dashboards, saved history, and related features.
                </p>
              </TermsSection>

              <TermsSection title="2. Accounts and access">
                <p>
                  You may use some features without an account. Signed-in access may unlock longer inputs, saved history, personalization, and other account features. Premium features may require payment or waitlist access when launched.
                </p>
                <p>
                  You are responsible for keeping your login credentials secure and for all activity under your account. Tell us promptly if you believe your account has been compromised.
                </p>
              </TermsSection>

              <TermsSection title="3. AI output and your responsibility">
                <p>
                  rewrito uses AI systems to generate rewrites, study explanations, scores, notes, quiz questions, flashcards, originality reviews, and other outputs. AI output may be inaccurate, incomplete, biased, outdated, or unsuitable for your context.
                </p>
                <p>
                  You are responsible for reviewing, editing, fact-checking, and deciding whether to use any output. You should verify names, dates, numbers, formulas, legal statements, financial claims, academic claims, citations, and anything important before relying on it.
                </p>
              </TermsSection>

              <TermsSection title="4. Detector and plagiarism tools">
                <p>
                  AI Detector Score and Plagiarism Checker are review aids. They provide detector-style confidence, originality-risk signals, underlined wording patterns, and citation-needed guidance. They are not official reports from GPTZero, Originality.ai, Turnitin, universities, publishers, or academic databases.
                </p>
                <p>
                  No AI detector, plagiarism checker, originality review, or humanizing workflow can guarantee a result, bypass a third-party detector, or certify that content will be accepted by a school, employer, publisher, or platform. You remain responsible for academic integrity, workplace policy compliance, proper citation, and final submission decisions.
                </p>
              </TermsSection>

              <TermsSection title="5. Study tools and academic use">
                <p>
                  Rewrito Study is designed for learning, explanation, organization, revision, quizzes, flashcards, and study planning. It is not designed to help users cheat, submit work they did not understand, or violate school, university, employer, or certification rules.
                </p>
                <p>
                  Use study outputs as learning support. Check formulas, worked examples, answer keys, and study plans before relying on them.
                </p>
              </TermsSection>

              <TermsSection title="6. Acceptable use">
                <p>You agree not to use rewrito to:</p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>Create, distribute, or facilitate harmful, illegal, abusive, hateful, deceptive, or infringing content.</li>
                  <li>Misrepresent AI-generated work as independently completed where that violates applicable rules.</li>
                  <li>Upload content you do not have the right to use.</li>
                  <li>Attempt to bypass security, rate limits, access controls, or usage controls.</li>
                  <li>Reverse engineer, scrape, overload, resell, or misuse the service.</li>
                  <li>Use the service for regulated professional advice without qualified human review.</li>
                </ul>
              </TermsSection>

              <TermsSection title="7. Your content and ownership">
                <p>
                  As between you and rewrito, you retain rights you already have in the text, files, prompts, and materials you submit. You grant rewrito the limited permission needed to process your content, generate outputs, operate the service, save history when you are signed in, provide support, and improve safety and reliability.
                </p>
                <p>
                  You are responsible for ensuring that your inputs do not violate someone else&apos;s rights, confidentiality obligations, workplace rules, or academic policies.
                </p>
              </TermsSection>

              <TermsSection title="8. rewrito intellectual property">
                <p>
                  rewrito, the website, interface, design, prompts, workflows, software, branding, logos, and related technology are owned by rewrito or its licensors. These terms do not grant you ownership of the service itself.
                </p>
              </TermsSection>

              <TermsSection title="9. Payments and premium features">
                <p>
                  Some features may be free, signed-in, premium, waitlisted, usage-limited, or plan-limited. We may change feature availability, limits, or pricing over time. If paid plans launch, payment terms shown at purchase will apply.
                </p>
                <p>
                  Unless otherwise required by law or stated at purchase, fees are non-refundable once a paid billing period begins.
                </p>
              </TermsSection>

              <TermsSection title="10. Third-party services">
                <p>
                  rewrito may rely on third-party providers for hosting, authentication, email, analytics, databases, payments, and AI generation. Their services may affect availability, performance, and processing.
                </p>
              </TermsSection>

              <TermsSection title="11. Disclaimers">
                <p>
                  rewrito is provided on an &quot;as is&quot; and &quot;as available&quot; basis. We do not promise that the service will be uninterrupted, error-free, perfectly secure, or suitable for every purpose.
                </p>
                <p>
                  rewrito does not provide legal, financial, medical, academic, employment, or professional advice. Any output in those areas must be reviewed by qualified humans before use.
                </p>
              </TermsSection>

              <TermsSection title="12. Limitation of liability">
                <p>
                  To the maximum extent permitted by law, rewrito will not be liable for indirect, incidental, consequential, special, exemplary, or punitive damages, or for lost profits, lost data, lost opportunities, academic penalties, workplace consequences, or reputational harm arising from your use of the service.
                </p>
              </TermsSection>

              <TermsSection title="13. Indemnity">
                <p>
                  You agree to defend, indemnify, and hold rewrito harmless from claims, losses, liabilities, damages, costs, and expenses arising from your content, your use of the service, your violation of these terms, or your violation of another person&apos;s rights.
                </p>
              </TermsSection>

              <TermsSection title="14. Suspension and termination">
                <p>
                  We may suspend or terminate access if we believe you violated these terms, created risk for rewrito or others, misused the service, or if we need to protect security, reliability, or legal compliance.
                </p>
              </TermsSection>

              <TermsSection title="15. Changes to these terms">
                <p>
                  We may update these terms as rewrito evolves. If changes are material, we may provide additional notice. Continued use after changes means you accept the updated terms.
                </p>
              </TermsSection>

              <TermsSection title="16. Governing rules">
                <p>
                  These terms are intended to be interpreted under applicable law without limiting any consumer rights that cannot be waived. If any part of these terms is unenforceable, the remaining parts continue to apply.
                </p>
              </TermsSection>

              <TermsSection title="17. Contact">
                <p>
                  For questions about these terms, email{" "}
                  <a className="text-brand hover:underline" href="mailto:hello@rewrito.ai">
                    hello@rewrito.ai
                  </a>
                  .
                </p>
              </TermsSection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function TermsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="card p-6 sm:p-7">
      <h2 className="text-xl font-semibold tracking-tight text-ink">{title}</h2>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">{children}</div>
    </section>
  );
}
