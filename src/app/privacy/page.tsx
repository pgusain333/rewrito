import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy - rewrito",
  description: "Privacy policy for rewrito, including how anonymous trials and signed-in rewrite history are handled.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-bg">
        <section className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
          <span className="chip mb-5">Privacy</span>
          <h1 className="text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Privacy Policy
          </h1>
          <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink-muted">
            <p>
              rewrito is designed to help people improve professional writing while keeping data
              handling simple and clear.
            </p>
            <section>
              <h2 className="mb-2 text-lg font-semibold text-ink">Anonymous use</h2>
              <p>
                Anonymous trial usage is tracked with a local browser identifier and a usage count.
                Anonymous rewrite text is not saved to rewrite history.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-semibold text-ink">Signed-in use</h2>
              <p>
                When you sign in, rewrites may be saved to your dashboard so you can revisit recent
                drafts. Account authentication is handled by Supabase.
              </p>
            </section>
            <section>
              <h2 className="mb-2 text-lg font-semibold text-ink">Contact</h2>
              <p>
                For privacy questions, email <a className="text-brand hover:underline" href="mailto:hello@rewrito.ai">hello@rewrito.ai</a>.
              </p>
            </section>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
