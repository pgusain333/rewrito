import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { pageMetadata, TOOL_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Grammar Checker - Fix Grammar, Punctuation, and Clarity",
  description:
    "Use rewrito's Grammar Checker to fix grammar, punctuation, spelling, sentence clarity, and flow while preserving your voice and meaning.",
  path: "/grammar-checker",
  keywords: TOOL_KEYWORDS.grammar,
});

export default function Page() {
  return (
    <ToolPage
      tool="grammar"
      intro={{
        h1: "Grammar Checker - correct writing without losing your voice.",
        lead: "Paste a draft and get a corrected version, a grammar report, and short coaching notes that help you write better next time.",
      }}
      whatItDoes={[
        "Fixes grammar, punctuation, spelling, agreement, tense, and sentence fragments.",
        "Improves clarity and flow while preserving your meaning.",
        "Shows a grammar report so changes are easy to trust.",
        "Flags ambiguous wording instead of inventing meaning.",
        "Keeps professional, academic, email, and everyday writing readable.",
        "Adds coaching notes so users learn the pattern behind each improvement.",
      ]}
      audiences={[
        {
          title: "Students",
          body: "Clean up assignments, notes, and essays while learning recurring grammar patterns.",
          image:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Professionals",
          body: "Make reports, client emails, and internal updates clearer before sending.",
          image:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Job seekers",
          body: "Polish cover notes, outreach, and profile copy with more confidence.",
          image:
            "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Creators",
          body: "Proofread posts, newsletters, and scripts without making them sound generic.",
          image:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Teams",
          body: "Give shared documents and updates a consistent, readable final pass.",
          image:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
        },
      ]}
      faq={[
        {
          q: "Does the grammar checker rewrite everything?",
          a: "No. It fixes grammar, punctuation, clarity, and flow while preserving your voice and original meaning.",
        },
        {
          q: "Will it explain what changed?",
          a: "Yes. The output includes a grammar report and short writing coach notes so you can understand the main improvements.",
        },
        {
          q: "Can I use it for professional emails?",
          a: "Yes. It works for emails, reports, essays, posts, and everyday writing where correctness and clarity matter.",
        },
        {
          q: "Is this different from the AI Humanizer?",
          a: "Yes. The Grammar Checker focuses on correctness and clarity. The AI Humanizer focuses on making AI-generated writing sound more natural and human.",
        },
      ]}
    />
  );
}
