import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { pageMetadata, TOOL_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "LinkedIn Post Rewriter - Clear Hooks and Better Posts",
  description:
    "Rewrite LinkedIn posts with rewrito. Turn rough notes into a professional LinkedIn post with a stronger hook, short paragraphs, clear structure, and no fake hype.",
  path: "/linkedin-rewriter",
  keywords: TOOL_KEYWORDS.linkedin,
});

export default function Page() {
  return (
    <ToolPage
      tool="linkedin"
      intro={{
        h1: "LinkedIn Post Rewriter - turn rough notes into a post worth reading.",
        lead: "Paste your draft and get a clear, professional LinkedIn post with a real hook, short paragraphs, and zero motivational fluff.",
      }}
      whatItDoes={[
        "Builds a grounded hook - no 'Here's what nobody tells you'.",
        "Breaks ideas into short, readable paragraphs.",
        "Preserves your specific points and examples.",
        "Removes fake hype, emoji spam, and humblebrags.",
        "Ends with a genuine thought, not a forced CTA.",
        "Tone presets for professional, natural, or executive voice.",
      ]}
      audiences={[
        {
          title: "Founders and creators",
          body: "Shape rough ideas into posts with a clear hook and a grounded point of view.",
          image:
            "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Professionals",
          body: "Rewrite career updates, lessons, wins, and reflections without sounding generic.",
          image:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Marketing teams",
          body: "Polish thought-leadership drafts while keeping specific examples and credibility.",
          image:
            "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Consultants",
          body: "Turn client lessons, frameworks, and market observations into readable posts.",
          image:
            "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Job seekers",
          body: "Share projects, learning notes, and career stories with confidence and clarity.",
          image:
            "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80",
        },
      ]}
      faq={[
        {
          q: "Will my post sound generic?",
          a: "No - that's the whole point. rewrito strips the generic LinkedIn voice. It keeps your specific examples and angles and rewrites the structure around them.",
        },
        {
          q: "Can it write a post from scratch?",
          a: "rewrito is a rewriter, not a generator. Give it a rough draft, bullet points, or a voice memo transcript and it'll shape it into a post.",
        },
        {
          q: "How long can my draft be?",
          a: "Up to 8,000 characters per rewrite. Most LinkedIn posts perform best around 1,200-1,800 characters.",
        },
        {
          q: "Does it add emojis or hashtags?",
          a: "Only if your draft already has them. The default output is clean - no surprise emojis, no auto-generated hashtag soup.",
        },
      ]}
    />
  );
}
