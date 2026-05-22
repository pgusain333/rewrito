import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy - rewrito AI Writing and Study Tools",
  description:
    "Privacy policy for rewrito, including accounts, AI processing, analytics, plagiarism checking, detector scores, saved history, data retention, service providers, and user choices.",
  path: "/privacy",
  keywords: [
    "rewrito privacy",
    "AI writing tool privacy",
    "AI study assistant privacy",
    "AI detector privacy",
    "plagiarism checker privacy",
  ],
});

const lastUpdated = "May 22, 2026";

export default function PrivacyPage() {
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
            <span className="chip mb-5">Privacy</span>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Privacy Policy
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-muted sm:text-lg">
              rewrito is built to help people write, learn, and review more clearly. This policy explains what we collect, how we use it, and the choices you have.
            </p>
            <p className="mt-4 text-sm font-medium text-ink-muted">Last updated: {lastUpdated}</p>
          </div>
        </section>

        <section className="bg-bg">
          <div className="mx-auto grid max-w-6xl gap-6 px-5 pb-16 sm:px-8 sm:pb-24 lg:grid-cols-[280px_minmax(0,1fr)]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="card p-5">
                <h2 className="text-sm font-semibold text-ink">Quick summary</h2>
                <ul className="mt-4 space-y-3 text-sm leading-relaxed text-ink-muted">
                  <li>Anonymous history is not saved.</li>
                  <li>Signed-in history is saved so you can reopen work.</li>
                  <li>AI providers process text to generate outputs.</li>
                  <li>Detector and plagiarism scores are review aids.</li>
                  <li>We do not sell your personal information.</li>
                  <li>You can contact us to request account or data help.</li>
                </ul>
              </div>
            </aside>

            <div className="space-y-5">
              <PolicySection title="1. Information we collect">
                <p>
                  We collect information you choose to provide, such as your email address, name, password-based login details, Google login details shared with us by Supabase, and any text, files, questions, notes, or study material you submit to rewrito tools.
                </p>
                <p>
                  Your submitted content may include writing drafts, LinkedIn posts, emails, study notes, quiz material, flashcard topics, plagiarism-checker text, AI detector text, and uploaded PDFs used for study extraction.
                </p>
                <p>
                  For anonymous use, we may store a local browser identifier and basic usage data so the free experience works correctly. Anonymous rewrite text is not saved to your dashboard history.
                </p>
                <p>
                  For signed-in use, we save recent sessions, including input, output, selected tool, tone, refinement level, study mode, scores, quiz results, and timestamps, so you can revisit and reopen useful work.
                </p>
              </PolicySection>

              <PolicySection title="2. How we use information">
                <p>
                  We use your information to provide AI rewriting, AI detector-style scoring, study tools, quiz and flashcard workflows, account access, saved history, usage limits, product support, and service improvement.
                </p>
                <p>
                  We also use usage and analytics data to understand which pages and tools are working well, troubleshoot issues, prevent abuse, and improve rewrito over time.
                </p>
              </PolicySection>

              <PolicySection title="3. AI processing">
                <p>
                  Text you submit may be sent to AI infrastructure providers to generate rewrites, study explanations, quiz testlets, flashcards, summaries, scores, and related outputs.
                </p>
                <p>
                  Avoid submitting highly sensitive personal, financial, medical, legal, or confidential business information unless you are comfortable with it being processed to provide the service.
                </p>
              </PolicySection>

              <PolicySection title="4. Detector, plagiarism, and citation review">
                <p>
                  AI detector scores, originality scores, plagiarism-risk signals, underlined wording, and citation checks are generated as practical review aids. They are not official reports from universities, publishers, search engines, Turnitin, GPTZero, Originality.ai, or any academic database.
                </p>
                <p>
                  These tools may be wrong or incomplete. You should verify important claims, sources, citations, originality, and submission requirements before relying on any output.
                </p>
              </PolicySection>

              <PolicySection title="5. Service providers">
                <p>
                  We use trusted service providers to run rewrito, including hosting, authentication, database storage, email delivery, analytics, and AI generation providers. These providers process information only as needed to support the service.
                </p>
                <div className="mt-4 overflow-x-auto rounded-xl border border-line">
                  <table className="min-w-full divide-y divide-line text-left text-sm">
                    <thead className="bg-bg-section text-ink">
                      <tr>
                        <th className="px-4 py-3 font-semibold">Provider type</th>
                        <th className="px-4 py-3 font-semibold">Purpose</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line text-ink-muted">
                      <tr>
                        <td className="px-4 py-3 font-medium text-ink">Supabase</td>
                        <td className="px-4 py-3">Authentication, account data, usage limits, and saved history.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-ink">Resend</td>
                        <td className="px-4 py-3">Transactional emails, including welcome and account-related emails.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-ink">AI providers</td>
                        <td className="px-4 py-3">Generating rewrites, study outputs, scoring, quizzes, and flashcards.</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-3 font-medium text-ink">Analytics and hosting</td>
                        <td className="px-4 py-3">Site performance, reliability, analytics, and deployment.</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </PolicySection>

              <PolicySection title="6. Cookies, local storage, and analytics">
                <p>
                  rewrito may use cookies, local storage, and similar technologies for login sessions, anonymous usage limits, saved preferences, and analytics.
                </p>
                <p>
                  We use analytics tools, including Google Analytics, to understand traffic and product usage. You can control cookies and tracking through your browser settings and available platform controls.
                </p>
              </PolicySection>

              <PolicySection title="7. Data retention">
                <p>
                  Anonymous usage identifiers remain in your browser unless cleared. Signed-in history is retained so you can access it from your dashboard, subject to account settings, technical limits, and future plan limits.
                </p>
                <p>
                  We may retain limited logs and records where needed for security, abuse prevention, legal compliance, dispute resolution, or service operations.
                </p>
              </PolicySection>

              <PolicySection title="8. How we share information">
                <p>
                  We do not sell your personal information. We share information only with service providers that help us operate rewrito, when you direct us to do so, when needed for security or abuse prevention, or when required by law.
                </p>
                <p>
                  If rewrito is involved in a merger, acquisition, financing, or asset transfer, information may be transferred as part of that transaction, subject to appropriate protections.
                </p>
              </PolicySection>

              <PolicySection title="9. Email and product communications">
                <p>
                  We may send transactional emails such as sign-up confirmation, password reset, welcome emails, account notices, and important service updates. If marketing emails are introduced, you will be able to unsubscribe from those messages.
                </p>
              </PolicySection>

              <PolicySection title="10. Security">
                <p>
                  We use reasonable technical and organizational measures designed to protect rewrito accounts and data. No internet service can guarantee absolute security, so please use strong account credentials and avoid submitting sensitive information that is not needed for the tool.
                </p>
              </PolicySection>

              <PolicySection title="11. Your choices">
                <p>
                  You can use rewrito without signing in for limited anonymous access. If you create an account, you can access saved history in your dashboard and contact us for help with account or data requests.
                </p>
                <p>
                  Depending on your location, you may have rights to access, correct, delete, restrict, or object to certain processing of personal information. To make a request, email us at{" "}
                  <a className="text-brand hover:underline" href="mailto:hello@rewrito.ai">
                    hello@rewrito.ai
                  </a>.
                </p>
              </PolicySection>

              <PolicySection title="12. Children">
                <p>
                  rewrito is not intended for children under 13. If you believe a child has provided personal information to us, please contact us so we can review and take appropriate action.
                </p>
              </PolicySection>

              <PolicySection title="13. International users">
                <p>
                  rewrito may process and store information in countries other than where you live. By using the service, you understand that your information may be processed where our providers operate.
                </p>
              </PolicySection>

              <PolicySection title="14. Changes to this policy">
                <p>
                  We may update this Privacy Policy as rewrito evolves. If we make material changes, we will update the date above and may provide additional notice where appropriate.
                </p>
              </PolicySection>

              <PolicySection title="15. Contact">
                <p>
                  For privacy questions or requests, email{" "}
                  <a className="text-brand hover:underline" href="mailto:hello@rewrito.ai">
                    hello@rewrito.ai
                  </a>.
                </p>
                <p>
                  Please also review our <Link href="/terms" className="text-brand hover:underline">Terms of Use</Link>.
                </p>
              </PolicySection>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

function PolicySection({
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
