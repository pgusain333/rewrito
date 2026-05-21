import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { pageMetadata, TOOL_KEYWORDS } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Plagiarism Checker - Originality Score and Citation Review",
  description:
    "Use rewrito's Plagiarism Checker to review originality risk, underline copied-sounding phrases, improve wording, and spot claims that may need citation.",
  path: "/plagiarism-checker",
  keywords: TOOL_KEYWORDS.plagiarism,
});

export default function Page() {
  return (
    <ToolPage
      tool="plagiarism"
      intro={{
        h1: "Plagiarism Checker - review originality before you submit or publish.",
        lead: "Paste a draft and get an originality-risk score, underlined similarity signals, safer wording, and citation-needed guidance without fake sources.",
      }}
      whatItDoes={[
        "Highlights copied-sounding or overly generic passages.",
        "Scores plagiarism-style similarity risk before and after revision.",
        "Rewrites risky wording into more original, specific language.",
        "Flags claims that may need citation without inventing sources.",
        "Keeps your meaning intact while improving originality.",
        "Works for essays, reports, assignments, articles, and professional drafts.",
      ]}
      audiences={[
        {
          title: "Students",
          body: "Review essays, assignments, and study drafts for originality risk before submission.",
          image:
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Academic writers",
          body: "Spot source-dependent claims and rewrite passages with clearer attribution habits.",
          image:
            "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Professionals",
          body: "Check reports, proposals, and summaries for generic or copied-sounding phrasing.",
          image:
            "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Content teams",
          body: "Review AI-assisted articles, briefs, and web copy before publishing.",
          image:
            "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=900&q=80",
        },
        {
          title: "Researchers",
          body: "Use the citation checklist to separate original explanation from claims that need support.",
          image:
            "https://images.unsplash.com/photo-1453738773917-9c3eff1db985?auto=format&fit=crop&w=900&q=80",
        },
      ]}
      faq={[
        {
          q: "Does rewrito scan the internet or academic databases?",
          a: "No. rewrito provides an originality-risk review and underlines copied-sounding patterns. It is not a database-matching plagiarism report from a university system.",
        },
        {
          q: "Can it help me avoid accidental plagiarism?",
          a: "Yes. It highlights broad copied-sounding phrasing, source-dependent claims, and citation-needed areas so you can rewrite responsibly and add sources where needed.",
        },
        {
          q: "Will it create fake citations?",
          a: "No. rewrito is instructed not to invent sources, authors, journals, page numbers, URLs, or legal authorities.",
        },
        {
          q: "Can I use it for AI-written text?",
          a: "Yes. It works well as a review layer for AI-assisted drafts, especially when you need more original wording and clearer citation habits.",
        },
      ]}
    />
  );
}
