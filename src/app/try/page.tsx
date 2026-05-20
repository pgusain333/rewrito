import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ToolWorkspace } from "@/components/tools/ToolWorkspace";

export const metadata: Metadata = {
  title: "Try rewrito Free - AI Writing Tool",
  description:
    "Try rewrito free. Humanize AI text, rewrite LinkedIn posts, and improve professional emails in one AI writing workspace.",
  alternates: { canonical: "/try" },
  openGraph: {
    title: "Try rewrito Free - AI Writing Tool",
    description:
      "Paste a draft, choose a tone, and get clearer professional writing with rewrito.",
    url: "/try",
  },
};

export default function TryPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-bg">
          <div className="mx-auto max-w-6xl px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
            <span className="chip mb-5">Try free</span>
            <h1 className="max-w-3xl text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Rewrite rough text into clear professional communication.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
              Use the workspace to humanize AI text, polish a LinkedIn draft, or tighten a
              professional email.
            </p>
          </div>
        </section>

        <section className="bg-bg">
          <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 sm:pb-24">
            <ToolWorkspace />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
