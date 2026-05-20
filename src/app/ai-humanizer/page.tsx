import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";

export const metadata: Metadata = {
  title: "AI Humanizer - rewrite AI text to sound natural",
  description:
    "Free AI Humanizer. Rewrite AI-generated text into natural, human, professional writing while preserving the original meaning.",
  alternates: { canonical: "/ai-humanizer" },
  openGraph: {
    title: "AI Humanizer - rewrite AI text to sound natural",
    description:
      "Turn AI-generated text into natural, human, professional writing - without losing meaning.",
    url: "/ai-humanizer",
  },
};

export default function Page() {
  return (
    <ToolPage
      tool="humanizer"
      intro={{
        h1: "AI Humanizer - make AI text sound like a person wrote it.",
        lead: "Paste AI-generated copy and get a natural, professional rewrite. Your meaning stays intact; the robotic patterns go.",
      }}
      whatItDoes={[
        "Reduces robotic patterns and AI-typical phrasing.",
        "Varies sentence length and structure for natural rhythm.",
        "Replaces filler ('in today's world', 'leverage', 'unlock') with specific language.",
        "Keeps every factual claim and the original intent.",
        "Offers Light, Medium, and Strong refinement levels.",
        "Supports six tones, from natural to executive.",
      ]}
      faq={[
        {
          q: "Will this change what my text actually says?",
          a: "No. The Humanizer preserves your meaning and facts. It changes how the text reads - flow, structure, and word choice - not what it claims.",
        },
        {
          q: "How is this different from a grammar checker?",
          a: "Grammar checkers fix mistakes. The Humanizer rewrites for rhythm and voice, removing AI-typical patterns that grammar tools don't catch.",
        },
        {
          q: "Can I detect AI text after humanizing?",
          a: "AI detection is unreliable as a category. rewrito focuses on quality - making your writing clear and human - rather than gaming any specific detector.",
        },
        {
          q: "What's the input limit?",
          a: "You can paste up to 8,000 characters per rewrite (roughly 1,200 words).",
        },
      ]}
    />
  );
}
