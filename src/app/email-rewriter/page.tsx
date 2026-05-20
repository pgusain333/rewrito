import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";

export const metadata: Metadata = {
  title: "Professional Email Rewriter - clear, polite, confident emails",
  description:
    "Free Professional Email Rewriter. Rewrite rough email drafts into concise, polite, confident emails while keeping your intent.",
  alternates: { canonical: "/email-rewriter" },
  openGraph: {
    title: "Professional Email Rewriter - clear, polite, confident emails",
    description:
      "Paste a rough email draft. Get a concise, polite, confident version in seconds.",
    url: "/email-rewriter",
  },
};

export default function Page() {
  return (
    <ToolPage
      tool="email"
      intro={{
        h1: "Professional Email Rewriter - clear, polite, confident in seconds.",
        lead: "Paste a rough draft and get a concise, professional email that keeps your intent and every important detail.",
      }}
      whatItDoes={[
        "Removes filler, hedging, and unnecessary apologies.",
        "Keeps your request, dates, names, and numbers exact.",
        "Adjusts tone - friendly, professional, or executive.",
        "Tightens long emails without losing key details.",
        "Polite without being apologetic; confident without being curt.",
        "Maintains standard email structure when appropriate.",
      ]}
      faq={[
        {
          q: "Will it invent details I didn't write?",
          a: "No. rewrito is instructed not to fabricate facts, names, dates, or claims. If something isn't in your draft, it won't appear in the rewrite.",
        },
        {
          q: "Does it add a subject line automatically?",
          a: "Only if your input includes one or asks for one. Otherwise it returns just the email body so you can use your existing subject.",
        },
        {
          q: "Can I use it for sensitive emails?",
          a: "rewrito is great for tone-balancing tricky emails (declining requests, following up, giving feedback). For confidential matters, anonymous trials are not stored.",
        },
        {
          q: "How long can the email be?",
          a: "Up to 8,000 characters per rewrite. Long threads can be rewritten in sections.",
        },
      ]}
    />
  );
}
