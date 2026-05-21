import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AudienceShowcase } from "@/components/marketing/AudienceShowcase";
import { AiDetectorTool } from "@/components/tools/AiDetectorTool";
import { ArrowRightIcon, ShieldCheckIcon } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "AI Detector Score - Check AI Writing Confidence",
  description:
    "Check AI-generated writing confidence with rewrito's AI detector score tool. See detector-style before and after scores, humanize drafts, and learn how to write more naturally.",
  alternates: { canonical: "/ai-detector" },
  keywords: [
    "AI detector",
    "AI detection score",
    "AI humanizer detector",
    "GPTZero score",
    "Originality.ai score",
    "Turnitin AI detector",
  ],
  openGraph: {
    title: "AI Detector Score - rewrito",
    description:
      "Check detector-style AI confidence, humanize drafts, and learn the writing patterns that lower AI-detection risk.",
    url: "/ai-detector",
  },
};

export default function AiDetectorPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: "rewrito AI Detector Score",
        applicationCategory: "WritingApplication",
        operatingSystem: "Web",
        url: "https://rewrito.ai/ai-detector",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Does rewrito connect directly to GPTZero, Originality.ai, or Turnitin?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "rewrito shows detector-style confidence estimates for writing review. It does not claim to be an official report from third-party detector platforms.",
            },
          },
          {
            "@type": "Question",
            name: "Can an AI detector score be guaranteed?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No detector score can be honestly guaranteed because each detector uses its own private model. rewrito focuses on lowering obvious AI-writing signals and teaching better writing patterns.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <Navbar />
      <main>
        <section className="relative overflow-hidden bg-bg">
          <div aria-hidden className="hero-abstract opacity-70">
            <div className="grid-overlay" />
            <div className="blob-mid" />
          </div>
          <div className="mx-auto max-w-6xl px-5 pb-10 pt-14 sm:px-8 sm:pb-14 sm:pt-20">
            <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
              <div>
                <span className="chip mb-5">
                  <ShieldCheckIcon size={14} />
                  AI detector score
                </span>
                <h1 className="text-balance text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
                  Check AI confidence before your writing goes out.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-muted sm:text-lg">
                  Paste a draft, see detector-style before and after scores, humanize the text, and learn the writing habits that make future drafts sound more natural.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Link href="#detector" className="btn-primary">
                    Check my text
                    <ArrowRightIcon size={16} />
                  </Link>
                  <Link href="/ai-humanizer" className="btn-secondary">
                    Open AI Humanizer
                  </Link>
                </div>
              </div>
              <DetectorHeroMockup />
            </div>
          </div>
        </section>

        <section id="detector" className="bg-bg-section/60">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
            <AiDetectorTool />
          </div>
        </section>

        <section className="bg-bg">
          <div className="mx-auto grid max-w-6xl gap-5 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-3">
            {[
              {
                title: "Before and after proof",
                body: "See how the rewritten draft changes detector-style confidence, naturalness, and clarity.",
              },
              {
                title: "Human writing lessons",
                body: "Learn which patterns were changed so you improve over time instead of depending on the tool forever.",
              },
              {
                title: "Review before sending",
                body: "Use the score as a quality check, then add personal detail, context, and examples where needed.",
              },
            ].map((item, index) => (
              <article key={item.title} className="card p-6">
                <span className="mb-4 inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-softPurple text-sm font-semibold text-brand">
                  {index + 1}
                </span>
                <h2 className="text-base font-semibold text-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <AudienceShowcase
          className="bg-bg-section/60"
          title="Built for people who need confidence before publishing."
          lead="Use the detector score as a writing review layer, then improve the draft with clearer human patterns."
          audiences={[
            {
              title: "Students",
              body: "Review AI-assisted study drafts and learn which patterns need a more human edit.",
              image:
                "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
            },
            {
              title: "Professionals",
              body: "Check reports, emails, posts, and summaries before they are shared.",
              image:
                "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
            },
            {
              title: "Content reviewers",
              body: "Compare before and after scores and spot wording that still sounds too generated.",
              image:
                "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80",
            },
            {
              title: "Academic reviewers",
              body: "Use detector-style estimates as a careful review signal before submitting or sharing.",
              image:
                "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
            },
            {
              title: "Teams",
              body: "Create a consistent review habit for AI-assisted drafts across shared work.",
              image:
                "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
            },
          ]}
        />
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}

function DetectorHeroMockup() {
  const scores = [
    ["GPTZero-style", 78, 18],
    ["Originality.ai-style", 82, 24],
    ["Turnitin-style", 69, 16],
  ] as const;

  return (
    <div className="relative mx-auto w-full max-w-lg [perspective:1100px]" aria-hidden>
      <div className="card relative overflow-hidden p-5 shadow-card [transform:rotateX(5deg)_rotateY(-7deg)]">
        <span className="mock-cursor mock-cursor-large" />
        <div className="mb-5 flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-ink">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-softPurple text-brand">
              <ShieldCheckIcon size={18} />
            </span>
            AI Detector Score
          </span>
          <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
            Readiness 91%
          </span>
        </div>
        <div className="space-y-3">
          <div className="ml-auto max-w-[78%] rounded-2xl rounded-tr-md bg-brand-softPurple px-4 py-3 text-sm font-medium text-brand">
            <span className="typing-reveal">Check if this draft sounds AI-written.</span>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-bg-soft px-3 py-2 text-ink-subtle">
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-typing-dot" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-typing-dot [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-typing-dot [animation-delay:240ms]" />
            <span className="ml-1 text-[10px] font-medium">rewrito is checking detector signals</span>
          </div>
          <div className="rounded-2xl rounded-tl-md border border-line bg-bg-soft p-3">
            <div className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-ink">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white text-brand">r</span>
              rewrito output
            </div>
            <div className="grid gap-3">
              {scores.map(([label, before, after]) => (
                <div key={label}>
                  <div className="mb-1.5 flex justify-between text-[11px] font-semibold text-ink">
                    <span>{label}</span>
                    <span>{after}% after</span>
                  </div>
                  <div className="grid gap-1.5">
                    <span className="h-1.5 rounded-full bg-error/20">
                      <span className="block h-full rounded-full bg-error/70" style={{ width: `${before}%` }} />
                    </span>
                    <span className="h-1.5 rounded-full bg-success/10">
                      <span className="block h-full rounded-full bg-success" style={{ width: `${after}%` }} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
